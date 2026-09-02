<template>
    <div class="target-page">
        <LoadingOverlay :show="isLoading || isExporting" :text="isExporting ? exportProgressText : 'กำลังโหลดข้อมูล...'" />

        <!-- Header -->
        <header class="header">
            <h1>🕊️ รายงานยอดเบิกนกพิราบ</h1>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in visibleZones" :key="zone.zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                    </option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area.area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
            <div class="ms-3 month-picker-wrapper">
                <VueDatePicker
                    v-model="monthRange"
                    month-picker
                    format="MM/yyyy"
                    placeholder="เลือกเดือน"
                    @update:model-value="onMonthChange"
                />
            </div>
            <div class="ms-3">
                <button class="btn-export" :disabled="isExporting" @click="exportExcel">
                    {{ isExporting ? 'กำลังออกไฟล์...' : '📥 Export Excel (ทุกเขต)' }}
                </button>
            </div>
        </header>

        <div class="flex justify-between">
            <h1 class="text-xl">Zone:{{ selectedZone || "ทั้งหมด" }} Team:{{ selectedTeam || "ทั้งหมด" }} Area:{{ selectedArea || "ยังไม่เลือก" }} เดือน:{{ formatPeriod(period) }}</h1>
        </div>

        <!-- Prompt when no area selected -->
        <div v-if="!selectedArea" class="prompt">กรุณาเลือกเขต (Area) เพื่อดูรายการสินค้าตรานกพิราบที่เบิก</div>

        <template v-else>
            <!-- Summary -->
            <section class="summary">
                <div class="card">
                    <div class="label">ยอดเบิกรวม</div>
                    <div class="value text-right">{{ formatNum(totalQty) }} ลัง</div>
                </div>
                <div class="card">
                    <div class="label">จำนวนรายการสินค้าที่เบิก / ทั้งหมด</div>
                    <div class="value text-right">{{ withdrawnCount }} / {{ rows.length }}</div>
                </div>
            </section>

            <!-- Data Table -->
            <section class="table-wrap">
                <table class="table border-collapse">
                    <thead>
                        <tr>
                            <th class="text-center" @click="setSort('productId')">รหัสสินค้า</th>
                            <th class="text-center" @click="setSort('productName')">สินค้า</th>
                            <th class="text-center" @click="setSort('stockBalance')">สต๊อกคงเหลือ</th>
                            <th class="text-center" @click="setSort('qty')">ยอดเบิก</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in sortedRows" :key="r.productId">
                            <td class="text-center border">{{ r.productId }}</td>
                            <td class="text-left border">{{ r.productName || '-' }}</td>
                            <td class="text-right border">{{ formatStockBalance(r) }}</td>
                            <td class="text-right border">{{ r.qty == null ? '-' : `${formatNum(r.qty)} ลัง` }}</td>
                        </tr>
                        <tr v-if="rows.length === 0">
                            <td colspan="4" class="empty">ไม่พบรายการสินค้าตรานกพิราบในเขต/เดือนที่เลือก</td>
                        </tr>
                    </tbody>
                    <tfoot v-if="rows.length" class="bg-gray-300" style="position: sticky; bottom: 0; z-index: 2;">
                        <tr class="bg-gray-300 font-bold">
                            <td colspan="2" class="text-center">รวม</td>
                            <td class="text-right">-</td>
                            <td class="text-right">{{ formatNum(totalQty) }} ลัง</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
        </template>
    </div>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useFilter } from '../../store/modules/filter'
import { useSale } from '../../store/modules/sale'
import { useStockStore } from '../../store/modules/stock'
import { useStoresStore } from '../../store/modules/store'
import { useWithdrawStore } from '../../store/modules/withdraw'
import { formatDateToYYYYMMDD, formatToYYYYMM } from '../../utils/format'
import LoadingOverlay from '../LoadingOverlay.vue'

interface PigeonWithdrawRow {
    productId: string
    productName: string
    unit: string
    qty: number | null
    qtyPcs: number
    stockBalance: number | null
    stockBalanceCtn: number | null
    stockBalanceRemainderPcs: number | null
}

const PIGEON_BRAND = 'ตรานกพิราบ'
const HIDDEN_ZONES = ['IT', 'FT', 'PC']

const filter = useFilter()
const saleStore = useSale()
const withdrawStore = useWithdrawStore()
const stockStore = useStockStore()
const storesStore = useStoresStore()

const visibleZones = computed(() => (filter.zone || []).filter((z: any) => !HIDDEN_ZONES.includes(z.zone)))

const today = new Date()
const defaultPeriod = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0')

function periodMinusOneMonth(year: number, month0based: number) {
    let month = month0based - 1
    let y = year
    if (month < 0) {
        month = 11
        y -= 1
    }
    return formatToYYYYMM({ year: y, month })
}

function periodToDateRange(p: string) {
    const year = Number(p.slice(0, 4))
    const month = Number(p.slice(4, 6)) // 1-based
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    return { startDate: formatDateToYYYYMMDD(firstDay), endDate: formatDateToYYYYMMDD(lastDay) }
}

const selectedZone = ref('')
const selectedArea = ref('')
const selectedTeam = ref('')
const isLoading = ref(false)
const isExporting = ref(false)
const exportProgressText = ref('กำลังออกไฟล์...')

const monthRange = ref<{ month: number; year: number }>({ month: today.getMonth(), year: today.getFullYear() })
const period = ref(periodMinusOneMonth(today.getFullYear(), today.getMonth()))

const rows = ref<PigeonWithdrawRow[]>([])

const sortKey = ref<'productId' | 'productName' | 'qty' | 'stockBalance'>('productName')
const sortDir = ref<1 | -1>(1)

function setSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortDir.value = (sortDir.value === 1 ? -1 : 1)
    } else {
        sortKey.value = key
        sortDir.value = key === 'productId' || key === 'productName' ? 1 : -1
    }
}

const sortedRows = computed(() => {
    const key = sortKey.value
    const dir = sortDir.value
    const list = [...rows.value]
    return list.sort((a, b) => {
        const va = a[key] ?? -Infinity
        const vb = b[key] ?? -Infinity
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
        return String(va).localeCompare(String(vb)) * dir
    })
})

const totalQty = computed(() => rows.value.reduce((sum, r) => sum + (r.qty || 0), 0))
const withdrawnCount = computed(() => rows.value.filter((r) => r.qty != null).length)

function formatNum(n: number) {
    return new Intl.NumberFormat('th-TH').format(Math.round(n))
}

function formatPeriod(p: string) {
    if (!/^\d{6}$/.test(p)) return p
    return `${p.slice(0, 4)}-${p.slice(4, 6)}`
}

function parsePcsPerCtnFromName(name: string): number {
    // ชื่อสินค้ามักลงท้ายด้วยขนาดบรรจุ เช่น "145g x4x12" หมายถึง 4x12 = 48 ชิ้น/ลัง
    if (!name) return 0
    const matches = [...name.matchAll(/x\s*(\d+)\s*x\s*(\d+)/gi)]
    if (!matches.length) return 0
    const last = matches[matches.length - 1]
    const a = Number(last[1])
    const b = Number(last[2])
    if (!a || !b) return 0
    return a * b
}

function formatStockBalance(row: PigeonWithdrawRow) {
    if (row.stockBalance == null) return '-'
    if (row.stockBalanceCtn == null) {
        // ไม่มีอัตราส่วนแปลงเป็น CTN ได้ (ไม่มียอดเบิกอ้างอิง) แสดงเป็นจำนวนชิ้นแทน
        return `${formatNum(row.stockBalanceRemainderPcs ?? 0)} ชิ้น`
    }
    const parts: string[] = []
    if (row.stockBalanceCtn > 0) parts.push(`${formatNum(row.stockBalanceCtn)} ลัง`)
    if (row.stockBalanceRemainderPcs) parts.push(`${formatNum(row.stockBalanceRemainderPcs)} ชิ้น`)
    return parts.length ? parts.join(' ') : '0 ลัง'
}

async function fetchPigeonRowsForArea(area: string): Promise<PigeonWithdrawRow[]> {
    const map: Record<string, PigeonWithdrawRow> = {}

    // ตั้งต้นด้วยรายการสินค้าตรานกพิราบทั้งหมด (เหมือนหน้าเป้านกพิราบ) ก่อน จะได้เห็นครบทุกตัวแม้ไม่มีเบิก
    const { startDate, endDate } = periodToDateRange(period.value)
    await saleStore.getProductPigeon(startDate, endDate, area)
    const pigeonMasterList: any[] = Array.isArray(saleStore.productPigeon) ? saleStore.productPigeon : []
    pigeonMasterList.forEach((item) => {
        const id = item.productId || item.id || '-'
        if (!map[id]) {
            map[id] = {
                productId: id,
                productName: item.productName || item.name || '-',
                unit: item.unit || '',
                qty: null,
                qtyPcs: 0,
                stockBalance: null,
                stockBalanceCtn: null,
                stockBalanceRemainderPcs: null
            }
        }
    })

    await withdrawStore.getWithdrawTable('cash', period.value, '', area, '', '', '')

    const list: any[] = Array.isArray(withdrawStore.withdraw) ? withdrawStore.withdraw : []

    const newTripOnly = list.filter((o) => String(o?.newTrip ?? '').trim().toLowerCase() === 'true')

    // รายการสรุป (getWithdrawTable) ไม่มี listProduct ต้องเรียกรายละเอียดทีละใบเบิก
    const details: any[] = []
    for (const order of newTripOnly) {
        if (!order?.orderId) continue
        await withdrawStore.getWithdrawDetail(order.orderId)
        details.push(withdrawStore.withdrawDetail)
    }

    const pigeonBrandNormalized = PIGEON_BRAND.normalize('NFC')
    details.forEach((order) => {
        const items: any[] = Array.isArray(order?.listProduct) ? order.listProduct : []
        items
            .filter((it) => String(it?.brand ?? '').normalize('NFC').trim() === pigeonBrandNormalized)
            .forEach((it) => {
                const id = it.id || it.itemCode || it.code || '-'
                if (!map[id]) {
                    map[id] = {
                        productId: id,
                        productName: it.name || '-',
                        unit: it.unit || '',
                        qty: 0,
                        qtyPcs: 0,
                        stockBalance: null,
                        stockBalanceCtn: null,
                        stockBalanceRemainderPcs: null
                    }
                }
                map[id].qty = (map[id].qty || 0) + (Number(it.qty) || 0)
                map[id].qtyPcs += Number(it.qtyPcs) || 0
            })
    })

    // ดึงสต๊อกคงเหลือ (collection stockTest ผ่าน getStockQtyNew) มาจับคู่กับ productId
    await stockStore.getStock(area, period.value)
    const stockList: any[] = Array.isArray(stockStore.stock?.data) ? stockStore.stock.data : []
    const stockBalanceById: Record<string, number> = {}
    stockList.forEach((s) => {
        const id = s?.productId
        if (!id) return
        const balancePcs = s?.balancePcs ?? s?.summaryPcsPerProduct?.balance
        if (balancePcs != null) stockBalanceById[id] = Number(balancePcs) || 0
    })

    Object.values(map).forEach((row) => {
        const balancePcs = stockBalanceById[row.productId]
        if (balancePcs == null) return
        // แปลง PCS -> CTN: ใช้ขนาดบรรจุจากชื่อสินค้า (เช่น "x4x12" = 48 ชิ้น/ลัง) ก่อน
        // เพราะแม่นยำกว่าและมีให้ใช้แม้สินค้าตัวนั้นไม่มียอดเบิกในเดือนนี้เลย
        // ถ้าหาจากชื่อไม่ได้ ค่อย fallback ไปใช้อัตราส่วนจากยอดเบิกจริงของสินค้าตัวเดียวกันแทน
        const pcsPerCtn = parsePcsPerCtnFromName(row.productName) || (row.qty && row.qty > 0 ? row.qtyPcs / row.qty : 0)
        if (pcsPerCtn > 0) {
            row.stockBalance = balancePcs / pcsPerCtn
            row.stockBalanceCtn = Math.floor(balancePcs / pcsPerCtn)
            row.stockBalanceRemainderPcs = Math.round(balancePcs % pcsPerCtn)
        } else {
            // ไม่มีอัตราส่วนให้แปลง แสดงเป็นจำนวนชิ้นดิบแทน
            row.stockBalance = balancePcs
            row.stockBalanceCtn = null
            row.stockBalanceRemainderPcs = balancePcs
        }
    })

    return Object.values(map).sort((a, b) => String(a.productName).localeCompare(String(b.productName)))
}

function computeTotals(list: PigeonWithdrawRow[]) {
    const qtyTotal = list.reduce((sum, r) => sum + (r.qty || 0), 0)
    let totalCtn = 0
    let totalPcs = 0
    list.forEach((r) => {
        if (r.stockBalanceCtn != null) totalCtn += r.stockBalanceCtn
        totalPcs += r.stockBalanceRemainderPcs ?? 0
    })
    const parts: string[] = []
    if (totalCtn > 0) parts.push(`${formatNum(totalCtn)} ลัง`)
    if (totalPcs > 0) parts.push(`${formatNum(totalPcs)} ชิ้น`)
    const stockText = parts.length ? parts.join(' ') : '0 ลัง'
    return { stockText, qtyTotal }
}

function buildTotalRow(len: number, labelIdx: number, stockIdx: number, qtyIdx: number, stockText: string, qtyTotal: number) {
    const row: any[] = new Array(len).fill('')
    row[labelIdx] = 'รวม'
    row[stockIdx] = stockText
    row[qtyIdx] = formatNum(qtyTotal)
    return row
}

function safeSheetName(name: string, usedNames: Set<string>) {
    // ชื่อชีทของ Excel ห้ามยาวเกิน 31 ตัวอักษร และห้ามมีอักขระ : \ / ? * [ ]
    let base = name.replace(/[:\\/?*\[\]]/g, '-').slice(0, 31) || 'Sheet'
    let candidate = base
    let i = 1
    while (usedNames.has(candidate)) {
        const suffix = `_${i}`
        candidate = base.slice(0, 31 - suffix.length) + suffix
        i++
    }
    usedNames.add(candidate)
    return candidate
}

async function exportExcel() {
    if (isExporting.value) return
    isExporting.value = true
    exportProgressText.value = 'กำลังดึงรายชื่อเขต...'

    try {
        let areaList: string[] = []
        const storeAreas = await storesStore.getAreaAllFromStore()
        areaList = Array.from(new Set((storeAreas || []).map((a: any) => a.area).filter(Boolean)))
        areaList = areaList.filter((a: string) => !HIDDEN_ZONES.some((z) => a.startsWith(z)))
        areaList.sort()

        if (!areaList.length && selectedArea.value) {
            areaList = [selectedArea.value]
        }

        const workbook = XLSX.utils.book_new()
        const usedNames = new Set<string>()

        const perAreaData: { area: string; rows: PigeonWithdrawRow[] }[] = []

        for (let i = 0; i < areaList.length; i++) {
            const area = areaList[i]
            exportProgressText.value = `กำลังดึงข้อมูลเขต ${area} (${i + 1}/${areaList.length})...`

            const areaRows = area === selectedArea.value && rows.value.length ? rows.value : await fetchPigeonRowsForArea(area)
            if (!areaRows.length) continue

            perAreaData.push({ area, rows: areaRows })
        }

        // ชีทแรก: รวมทุกเขตต่อกันยาวลงมา (มีคอลัมน์เขต ไม่มีเดือน)
        const combinedSheetData: any[][] = [
            ['เขต', 'รหัสสินค้า', 'สินค้า', 'สต๊อกคงเหลือ', 'ยอดเบิก (ลัง)']
        ]
        const allRows: PigeonWithdrawRow[] = []
        perAreaData.forEach(({ area, rows: areaRows }) => {
            areaRows.forEach((r) => {
                combinedSheetData.push([area, r.productId, r.productName, formatStockBalance(r), r.qty == null ? '-' : r.qty])
                allRows.push(r)
            })
        })
        const combinedTotals = computeTotals(allRows)
        combinedSheetData.push(buildTotalRow(5, 2, 3, 4, combinedTotals.stockText, combinedTotals.qtyTotal))

        const combinedWorksheet = XLSX.utils.aoa_to_sheet(combinedSheetData)
        combinedWorksheet['!cols'] = [{ wch: 10 }, { wch: 16 }, { wch: 45 }, { wch: 18 }, { wch: 14 }]
        XLSX.utils.book_append_sheet(workbook, combinedWorksheet, safeSheetName('รวมทุกเขต', usedNames))

        // ชีทถัดไป: แยกตามเขต (ไม่มีเขต ไม่มีเดือน)
        perAreaData.forEach(({ area, rows: areaRows }) => {
            const sheetData: any[][] = [
                ['รหัสสินค้า', 'สินค้า', 'สต๊อกคงเหลือ', 'ยอดเบิก (ลัง)']
            ]
            areaRows.forEach((r) => {
                sheetData.push([r.productId, r.productName, formatStockBalance(r), r.qty == null ? '-' : r.qty])
            })
            const totals = computeTotals(areaRows)
            sheetData.push(buildTotalRow(4, 1, 2, 3, totals.stockText, totals.qtyTotal))

            const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
            worksheet['!cols'] = [{ wch: 16 }, { wch: 45 }, { wch: 18 }, { wch: 14 }]
            XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName(area, usedNames))
        })

        const filename = `รายงานยอดเบิกนกพิราบ_ทุกเขต_${period.value}.xlsx`
        XLSX.writeFile(workbook, filename)
    } catch (error) {
        console.error('Error exporting pigeon withdraw excel:', error)
    } finally {
        isExporting.value = false
    }
}

async function loadReport() {
    if (!selectedArea.value) {
        rows.value = []
        return
    }

    isLoading.value = true
    try {
        rows.value = await fetchPigeonRowsForArea(selectedArea.value)
    } finally {
        isLoading.value = false
    }
}

function onMonthChange(value: any) {
    if (value && value.year != null && value.month != null) {
        // เดือนที่เลือกต้องลบ 1 เดือนก่อนนำไป filter period จริง
        period.value = periodMinusOneMonth(Number(value.year), Number(value.month))
    }
    loadReport()
}

watch(selectedZone, (newVal) => {
    selectedArea.value = ''
    selectedTeam.value = ''
    if (newVal) {
        filter.getArea(defaultPeriod, newVal, selectedTeam.value)
        filter.getTeam('cash', newVal)
    }
})

watch(selectedTeam, (newVal) => {
    selectedArea.value = ''
    if (newVal) {
        filter.getArea(defaultPeriod, selectedZone.value, newVal)
    }
})

watch(selectedArea, () => {
    loadReport()
})

onMounted(async () => {
    await filter.getZone('cash', defaultPeriod)
})
</script>

<style scoped>
.target-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
}

.header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: start;
    gap: 12px;
    margin-bottom: 12px;
}

.header h1 {
    font-size: 22px;
    font-weight: 700;
}

.month-picker-wrapper {
    min-width: 160px;
}

.btn-export {
    white-space: nowrap;
    background: #0b7a4d;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    font-weight: 600;
    cursor: pointer;
}

.btn-export:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.prompt {
    padding: 24px;
    text-align: center;
    color: #888;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
}

.summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.card .label {
    font-size: 16px;
    color: #666;
}

.card .value {
    font-weight: 700;
    color: #111;
    font-size: 20px;
    margin-top: 6px;
}

.table-wrap {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
}

.table thead th {
    position: sticky;
    color: white;
    top: 0;
    background: #00569D;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.table td {
    padding: 10px;
    border-bottom: 1px solid #f2f2f2;
}

.table .empty {
    text-align: center;
    color: #888;
    padding: 24px;
}

@media (max-width: 1024px) {
    .summary {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}
</style>
