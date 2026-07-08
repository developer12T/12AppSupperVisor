<template>
    <div class="target-page">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <!-- Header -->
        <header class="header">
            <h1>🕊️ เป้าหมายนกพิราบ เขต: {{ area }}</h1>
            <div class="date-picker-wrapper">
                <VueDatePicker 
                    v-model="dateRange" 
                    range 
                    @update:model-value="onDateRangeChange" 
                    placeholder="เลือกช่วงวันที่"
                    :enable-time-picker="false"
                />
            </div>
        </header>

        <!-- Summary cards -->
        <section class="summary-cards">
            <div class="card target">
                <div class="label">เป้าหมายยอดขาย</div>
                <div class="value">{{ formatCurrency(TARGET_SALES) }}</div>
            </div>
            <div class="card sales">
                <div class="label">ยอดขาย</div>
                <div class="value">{{ formatCurrency(totalSales) }}</div>
            </div>
            <div class="card diff">
                <div class="label">ผลต่าง (ยอดขาย - เป้าหมาย)</div>
                <div class="value" :class="{ above: diff >= 0, below: diff < 0 }">{{ formatCurrency(diff) }}</div>
            </div>
            <div class="card percent-card">
                <div class="label">เปอร์เซ็นต์ของเป้า</div>
                <div class="value" :class="{ above: percent >= 100, below: percent < 100 }">{{ percentText || (percent !== null && percent !== undefined ? percent + '%' : '0%') }}</div>
            </div>
        </section>

        <!-- Data Table -->
        <section class="table-wrap">
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th @click="setSort('productId')">รหัสสินค้า</th>
                            <th @click="setSort('productName')">สินค้า</th>
                            <th class="num" @click="setSort('quantity')">ยอดหน่วย</th>
                            <th class="num" @click="setSort('sales')">ยอดขาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in visibleRows" :key="r.id">
                            <td data-label="รหัสสินค้า">{{ r.productId }}</td>
                            <td data-label="สินค้า">{{ r.productName || '-' }}</td>
                            <td class="num" data-label="ยอดหน่วย">{{ r.quantityText }}</td>
                            <td class="num" data-label="ยอดขาย">{{ formatCurrency(r.sales) }}</td>
                        </tr>
                        <tr v-if="visibleRows.length === 0">
                            <td colspan="4" class="empty">No data / ไม่มีข้อมูล</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, ref } from 'vue'
import { useSale } from '../../store/modules/sale'
import { pad2 } from '../../utils/format'
import LoadingOverlay from '../LoadingOverlay.vue'


// --- Types ---
export interface PigeonRow {
    id: string
    productId: string    // รหัสสินค้า
    productName: string
    quantity: number     // จำนวนหลักสำหรับการจัดเรียง
    quantityText: string // แสดงผลหน่วยสำหรับผู้ใช้งาน
    unit?: string
    sales: number        // บาท
}

const saleStore = useSale();

// ---- Data ----
const rows = ref<PigeonRow[]>([])

// ---- State ----
const dateRange = ref<Date[]>([]);
const startDate = ref('') // e.g. "20250801"
const endDate = ref('') // e.g. "20250831"
const isLoading = ref(false)

let area = localStorage.getItem('area')

// ---- Sorting ----
const sortKey = ref<'productId' | 'productName' | 'quantity' | 'sales'>('productId')
const sortDir = ref<1 | -1>(1) // default ascending for productId

function setSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortDir.value = (sortDir.value === 1 ? -1 : 1)
    } else {
        sortKey.value = key
        sortDir.value = key === 'productId' ? 1 : 1
    }
}

// ---- Computed helpers ----
const sortedRows = computed(() => {
    const key = sortKey.value
    const dir = sortDir.value
    const list = [...rows.value]

    const getVal = (r: PigeonRow) => {
        switch (key) {
            case 'quantity':
            case 'sales':
                return r[key]
            default:
                return r[key]
        }
    }

    return list.sort((a, b) => {
        const va = getVal(a)
        const vb = getVal(b)
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
        return String(va).localeCompare(String(vb)) * dir
    })
})

const visibleRows = computed(() => sortedRows.value)

// ---- Summary / target ----
const TARGET_SALES = 178000
function parseNumber(value: any) {
    const numeric = String(value).replace(/[^0-9.-]+/g, '')
    const parsed = Number(numeric)
    return Number.isFinite(parsed) ? parsed : 0
}
const totalSales = computed(() => {
    return rows.value.reduce((sum, row) => sum + parseNumber(row.sales), 0)
})
const percent = computed(() => {
    if (TARGET_SALES === 0) return 0
    const result = (totalSales.value / TARGET_SALES) * 100
    return Number(result.toFixed(2))
})
const percentText = computed(() => {
    const formatted = percent.value.toFixed(2).replace(/\.00$/, '')
    return `${formatted}%`
})
const diff = computed(() => {
    return totalSales.value - TARGET_SALES
})

// ---- Utils ----
function formatDate(dateStr: string) {
    // dateStr format: YYYYMMDD
    if (!/^\d{8}$/.test(dateStr)) return dateStr
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${day}/${month}/${year}`
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat('th-TH', { 
        style: 'currency', 
        currency: 'THB', 
        maximumFractionDigits: 2 
    }).format(n)
}

function formatPigeonQuantity(item: any, fallbackQty: number, fallbackUnit: string) {
    // Prefer explicit ctn/pack fields when present
    const ctn = Number(item.quantityCtn ?? item.quantityCTN ?? item.quantityCtn ?? item.ctn ?? item.ctnQty ?? item.case ?? 0)
    const pack = Number(item.quantityPack ?? item.quantityPAC ?? item.quantityPac ?? item.pack ?? item.packQty ?? item.pcs ?? 0)
    const unit = String(item.unit || item.unitName || item.unitType || fallbackUnit || '').trim().toUpperCase()

    // If the API already provided a plain numeric quantity (calculated), show it as-is
    const rawQty = item.quantity ?? item.qty ?? fallbackQty ?? 0
    const rawStr = String(rawQty ?? '').trim()
    const onlyNumeric = /^-?\d+(?:\.\d+)?$/.test(rawStr)
    if (onlyNumeric) return rawStr

    const quantity = Number(rawQty ?? 0)

    const parts: string[] = []
    if (ctn > 0) parts.push(`${ctn} หีบ`)
    if (pack > 0) parts.push(`${pack} แพ็ค`)

    if (parts.length) return parts.join(' ')

    if (unit === 'CTN' || /หีบ/.test(unit)) return `${quantity} หีบ`
    if (unit === 'PCS' || unit === 'PAC' || unit === 'PKG' || unit === 'PACK' || unit === 'PACKS' || /แพ็ค|ชิ้น/.test(unit)) return `${quantity} แพ็ค`

    return `${quantity} หีบ`
}

async function onDateRangeChange() {
    if (!dateRange.value || dateRange.value.length < 2) return
    
    isLoading.value = true
    
    const startD = dateRange.value[0]
    const endD = dateRange.value[1]
    
    const startYear = startD.getFullYear()
    const startMonth = pad2(startD.getMonth() + 1)
    const startDay = pad2(startD.getDate())
    
    const endYear = endD.getFullYear()
    const endMonth = pad2(endD.getMonth() + 1)
    const endDay = pad2(endD.getDate())
    
    startDate.value = `${startYear}${startMonth}${startDay}`
    endDate.value = `${endYear}${endMonth}${endDay}`
    
    // เรียก API getProductPigeon
    await saleStore.getProductPigeon(startDate.value, endDate.value, area)
        rows.value = (saleStore.productPigeon || []).map((item: any, idx: number) => {
        // Prefer backend-provided display text when available (no frontend calculation)
        const backendText = (
            item.quantityText || item.qtyText || item.quantity_text || item.qty_text || item.displayQuantity || item.display_qty || ''
        )

        const unit = String(item.unit || item.unitName || item.unitType || '').trim()

        let quantity = 0
        let quantityText = ''

        if (backendText && String(backendText).trim().length > 0) {
            quantityText = String(backendText)
            // Use explicit numeric field for sorting if backend provides it
            if (item.quantityNumber != null) {
                quantity = Number(item.quantityNumber)
            } else if (item.qtyNum != null) {
                quantity = Number(item.qtyNum)
            } else if (item.quantityCTN != null || item.quantityCtn != null || item.quantityCtn != null) {
                quantity = Number(item.quantityCTN ?? item.quantityCtn ?? item.quantityCtn)
            } else if (item.quantityPAC != null || item.quantityPac != null || item.pack != null) {
                quantity = Number(item.quantityPAC ?? item.quantityPac ?? item.pack)
            } else if (item.quantity != null && !Number.isNaN(Number(item.quantity))) {
                quantity = Number(item.quantity)
            } else {
                // try extract first number from backendText as a best-effort fallback
                const m = String(backendText).match(/-?\d+(?:\.\d+)?/)
                quantity = m ? Number(m[0]) : 0
            }
        } else {
            // No backend display text — fallback to previous logic
            const rawQtyCandidate = item.quantity ?? item.qty ?? null
            const rawStr = rawQtyCandidate == null ? '' : String(rawQtyCandidate).trim()
            const rawIsNumeric = /^-?\d+(?:\.\d+)?$/.test(rawStr)

            if (rawIsNumeric) {
                quantity = Number(rawStr)
                quantityText = rawStr
            } else {
                quantity = Number(item.ctn ?? item.pack ?? item.quantity ?? item.qty ?? 0)
                quantityText = formatPigeonQuantity(item, quantity, unit)
            }
        }

        return {
            id: `pigeon-${idx}-${Math.random()}`,
            productId: item.productId || item.id || '-',
            productName: item.productName || item.name || '-',
            quantity,
            quantityText,
            unit,
            sales: item.sales || item.amount || 0
        }
    })
    
    isLoading.value = false
}

onMounted(async () => {
    // ตั้งค่า default date range เป็นเดือนปัจจุบัน
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    dateRange.value = [firstDay, lastDay]
    
    // เรียก API
    await onDateRangeChange()
})
</script>

<style scoped>
.target-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 8px;
}

@media (min-width: 768px) {
    .target-page {
        padding: 16px;
    }
}

.header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

@media (min-width: 768px) {
    .header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.header h1 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
}

@media (min-width: 768px) {
    .header h1 {
        font-size: 22px;
    }
}

.date-picker-wrapper {
    width: 100%;
    min-width: 200px;
}

.summary-cards {
    display: flex;
    gap: 16px;
    margin: 12px 0 16px 0;
}
.summary-cards .card {
    flex: 1;
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.summary-cards .card .label {
    color: #666;
    font-size: 13px;
}
.summary-cards .card .value {
    font-size: 20px;
    font-weight: 700;
    margin-top: 8px;
}
.summary-cards .card.target .value { color: #333 }
.summary-cards .card.sales .value { color: #0b7a4d }
.summary-cards .card.percent-card .value,
.summary-cards .card.diff .value {
    display: block !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    margin-top: 8px !important;
    color: #111 !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    min-height: 28px !important;
}
.summary-cards .card.percent-card .value.above,
.summary-cards .card.diff .value.above {
    color: #2e7d32 !important;
}
.summary-cards .card.percent-card .value.below,
.summary-cards .card.diff .value.below {
    color: #c62828 !important;
}

@media (min-width: 768px) {
    .date-picker-wrapper {
        width: 250px;
        flex-shrink: 0;
    }
}

.table-wrap {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    min-width: 500px;
}

.table thead th {
    position: sticky;
    top: 0;
    background: #fafafa;
    text-align: left;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
}

.table td {
    padding: 10px;
    border-bottom: 1px solid #f2f2f2;
}

.table td.num,
.table th.num {
    text-align: right;
}

.table .empty {
    text-align: center;
    color: #888;
    padding: 24px;
}

.flex {
    display: flex;
}

.justify-end {
    justify-content: flex-end;
}

.ms-3 {
    margin-left: 12px;
}

.w-65 {
    width: 250px;
}

/* Mobile-specific responsive */
@media (max-width: 640px) {
    .table {
        font-size: 13px;
    }

    .table thead th {
        padding: 8px;
        font-size: 12px;
    }

    .table td {
        padding: 8px;
    }

    .table td[data-label]::before {
        content: attr(data-label);
        font-weight: 600;
        display: block;
        font-size: 11px;
        color: #666;
        margin-bottom: 4px;
    }
}
</style>
