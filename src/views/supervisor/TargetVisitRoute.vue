<template>
    <div class="target-page">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <!-- Header -->
        <header class="header">
            <h1>✅ เป้าหมายการเข้าเยี่ยม</h1>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
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
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
            <div class="ms-3">
                <input
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    type="month" v-model="monthRange" @update:model-value="onMonthChange">
                </input>
            </div>

        </header>
        <div class="">
            <div class="flex justify-between">
                <div>
                    <h1 class="text-xl">Zone:{{ selectedZone == "" ? "ทั้งหมด" : selectedZone }} Team:{{ selectedTeam ==
                        "" ?
                        "ทั้งหมด" : selectedTeam }} Area:{{
                            selectedArea == "" ? "ทั้งหมด" : selectedArea }}</h1>
                </div>
                <div>
                    <h1 class="text-xl">เดือน:{{ monthRange == "" ? period : monthRange }}
                    </h1>
                </div>
            </div>

        </div>
        <!-- Metrics Summary -->
        <section class="summary">
            <div class="card">

                <div class="label">
                    <Icon icon="mdi:target-arrow" width="24" height="24" style="color: #f00" /> เป้าหมายการเข้าเยี่ยม
                </div>
                <div class="value text-right">{{ formatNum(routeStore?.target?.visit ?? 0) }}</div>
            </div>
            <div class="card">
                <div class="label">
                    <Icon icon="mdi:target-arrow" width="24" height="24" style="color: #f00" /> เป้าหมายร้านค้าที่ซื้อ
                </div>
                <div class="value text-right">{{ formatNum(routeStore?.target?.sale ?? 0) }}</div>
            </div>
            <div class="card">
                <div class="label">
                    <Icon icon="mdi:store" width="24" height="24" style="color: #000" /> ร้านค้าทั้งหมด
                </div>
                <div class="value text-right">{{ formatNum(routeStore?.totalStoreAll ?? 0) }}</div>
            </div>
            <div class="card">
                <div class="label">
                    <Icon icon="mdi:store-clock" width="24" height="24" style="color: #ff9d00" />
                    ร้านค้าที่ไม่ได้เข้าเยี่ยม
                </div>
                <div class="value text-right">{{ formatNum(routeStore?.totalStorePending ?? 0) }}</div>
            </div>
        </section>
        <section class="summary">
            <div class="card">
                <div class="label">เข้าเยี่ยมแล้ว</div>
                <div class="value text-right">{{ formatNum(routeStore?.totalStoreCheckInNotSell ?? 0) }}</div>
            </div>
            <div class="card">
                <div class="label">ร้านค้าที่ขายได้</div>
                <div class="value text-right">{{ formatNum(routeStore?.totalStoreSell ?? 0) }}</div>
            </div>
            <div class="card" :class="visitTargetClass">
                <div class="flex justify-between">
                    <div class="label">เปอร์เซ็นที่เข้าเยี่ยม</div>
                    <div class="value text-right">
                        {{ routeStore?.compare?.visitVsTarget + "%" ?? 0 + "%" }}
                    </div>
                </div>
                <div class="value text-right">{{
                    formatNum(routeStore?.totalStoreCheckInNotSell ?? 0) }}/{{
                        formatNum(routeStore?.target?.visit ?? 0) }}</div>
            </div>
            <div class="card" :class="effectiveTargetClass">
                <div class="flex justify-between">
                    <div class="label">เปอร์เซ็นที่ขายได้</div>
                    <div class="value text-right">
                        {{ routeStore?.compare?.effectiveVsTarget + "%" ?? 0 + "%" }}
                    </div>
                </div>
                <div class="value text-right">{{
                    formatNum(routeStore?.totalStoreSell ?? 0) }}/{{
                        formatNum(routeStore?.target?.sale ?? 0) }}</div>
            </div>
        </section>

        <!-- Chart -->
        <!-- <section class="chart-wrap" v-if="barReady">
            <Bar :data="barData" :options="barOptions" />
        </section> -->

        <!-- Data Table -->
        <section class="table-wrap">
            <table class="table border-collapse ">
                <thead>
                    <tr>
                        <th class="text-center">วันที่</th>
                        <th class="text-center">รวมการเช็คอิน</th>
                        <th class="text-center">ร้านที่ซื้อ</th>
                        <th class="text-center">ร้านค้าไม่ซื้อ</th>
                        <th class="text-center">ร้านค้าที่เช็คอิน</th>
                        <!-- <th class="text-center">รวม</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in visibleRows" :key="r.day" @click="goToTargetVisit(r)">
                        <td class="text-center border">{{ formatPeriod(r.day) }}</td>

                        <td class="text-right border">
                            {{ r.storeCheckIn || '-' }}
                        </td>
                        <td class="text-right border">{{ r.storeSell || '-' }}</td>
                        <td class="text-right border">{{ r.storeNotSell || '-' }}</td>
                        <td class="text-right border">{{ r.storeVisit || '-' }}</td>
                        <!-- <td class="text-right border">{{ r.storeCheckIn || '-' }}</td> -->


                    </tr>
                    <tr v-if="routeStore.routeAll.length === 0">
                        <td colspan="11" class="empty">No data / ไม่มีข้อมูล</td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr class="bg-gray-300 font-bold ">
                        <td class="text-center">รวม</td>
                        <td class="text-right">{{ routeStore?.routeAlltoal?.storeCheckIn }}</td>
                        <td class="text-right">{{ routeStore?.routeAlltoal?.storeSell }}</td>
                        <td class="text-right">{{ routeStore?.routeAlltoal?.storeNotSell }}</td>
                        <td class="text-right">{{ routeStore?.routeAlltoal?.storeVisit }}</td>

                    </tr>
                </tfoot>
            </table>
            <div class="table-footer">
                <div class="rows">Rows: {{ visibleRows.length }}</div>
                <div class="spacer"></div>
                <div class="paging">
                    <button class="btn sm" :disabled="page === 1" @click="page--">Prev</button>
                    <span>Page {{ page }}</span>
                    <button class="btn sm" :disabled="endIndex >= sortedRows.length" @click="page++">Next</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { useRouter, useRoute } from 'vue-router'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'
import 'chart.js/auto'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์

const filter = useFilter()
const routeStore = useRouteStore()
const monthRange = ref();




const filteredDataRoute = computed(() => {
    let data = routeStore.checkIn
    if (selectedZone.value) {
        data = data.filter(order =>
            (order.area || '').startsWith(selectedZone.value)
        )
    }
    if (selectedTeam.value) {
        console.log()
        data = data.filter(order =>
            getTeam3(order.area) === selectedTeam.value
        )
    }
    return data;
})

function formatPeriodYYYYMM(v) {
    if (!v) return ''
    return v.replace('-', '')
}

const visitTargetClass = computed(() => {
    const v = routeStore?.compare?.visitVsTarget ?? 0

    if (v >= 80) return 'good'
    if (v >= 50) return 'warn'
    return 'bad'
})

const effectiveTargetClass = computed(() => {
    const v = routeStore?.compare?.effectiveVsTarget ?? 0

    if (v >= 80) return 'good'
    if (v >= 50) return 'warn'
    return 'bad'
})

// --- Types ---
export type Unit = 'THB' | 'PCS' | 'CTN'
export interface TargetRow {
    id: string
    period: string   // YYYYMM
    zone: string
    area: string
    storeId?: string
    productGroup?: string
    target: number
    actual: number
    unit: Unit
}

// ---- Demo Data (replace with API results) ----
const rows = ref<TargetRow[]>([

])

// ---- Filters ----
const search = ref('')
const selectedMonth = ref('')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const zone = ref('')
const area = ref('')
const unit = ref('')
const onlyBelow = ref(false)


const router = useRouter()
const route = useRoute()
const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const isLoading = ref(false)

const unitOptions = ['THB', 'PCS', 'CTN'] as const
const periodOptions = computed(() => Array.from(new Set(rows.value.map(r => r.period))).sort())
const zoneOptions = computed(() => Array.from(new Set(rows.value.map(r => r.zone))).sort())
const areaOptions = computed(() => Array.from(new Set(rows.value.map(r => r.area))).sort())

// ---- Sorting ----
// keys: period | zone | area | productGroup | storeId | target | actual | unit | attainment | variance
const sortKey = ref<'period' | 'zone' | 'area' | 'productGroup' | 'storeId' | 'target' | 'actual' | 'unit' | 'attainment' | 'variance'>('period')
const sortDir = ref<1 | -1>(-1) // default newest first for period
const selectedChannel = ref('cash')

function setSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortDir.value = (sortDir.value === 1 ? -1 : 1)
    } else {
        sortKey.value = key
        sortDir.value = key === 'period' ? -1 : 1
    }
}

// ---- Computed helpers ----
const filteredRowsRoute = computed(() => {
    const data = routeStore.checkIn
    // const q = search.value.toLowerCase()
    // return rows.value.filter(r => {
    //     if (period.value && r.period !== period.value) return false
    //     if (zone.value && r.zone !== zone.value) return false
    //     if (area.value && r.area !== area.value) return false
    //     if (unit.value && r.unit !== unit.value) return false
    //     if (q) {
    //         const hay = `${r.zone} ${r.area} ${r.productGroup ?? ''} ${r.storeId ?? ''}`.toLowerCase()
    //         if (!hay.includes(q)) return false
    //     }
    //     if (onlyBelow.value && r.actual >= r.target) return false
    //     return true
    // })
})
const filteredRows = computed(() => {
    const q = search.value.toLowerCase()
    return routeStore.routeAll
})

const sortedRows = computed(() => {
    const key = sortKey.value
    const dir = sortDir.value
    const list = [...filteredRows.value]

    const getVal = (r: TargetRow) => {
        switch (key) {
            case 'attainment':
                return r.target > 0 ? r.actual / r.target : 0
            case 'variance':
                return r.actual - r.target
            default:
                // @ts-expect-error dynamic access
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

async function onMonthChange(value) {
    isLoading.value = true
    console.log(formatPeriodYYYYMM(value))

    await routeStore.getRouteEffective(formatPeriodYYYYMM(value), '', selectedZone.value, selectedTeam.value, selectedArea.value,);
    await routeStore.getDayRoute(formatPeriodYYYYMM(value), selectedZone.value, selectedTeam.value, selectedArea.value);


    isLoading.value = false
}

// ---- Paging ----
const page = ref(1)
const pageSize = ref(25)
const startIndex = computed(() => (page.value - 1) * pageSize.value)
const endIndex = computed(() => page.value * pageSize.value)
const visibleRows = computed(() => routeStore.routeAll.slice(startIndex.value, endIndex.value))

// ---- Summary ----
const totalTarget = computed(() => filteredRows.value.reduce((s, r) => s + (r.unit === unitDisplay.value || unitDisplay.value === 'THB' ? r.target : r.target), 0))
const totalActual = computed(() => filteredRows.value.reduce((s, r) => s + (r.unit === unitDisplay.value || unitDisplay.value === 'THB' ? r.actual : r.actual), 0))
const overallAttainment = computed(() => totalTarget.value > 0 ? totalActual.value / totalTarget.value : 0)
const variance = computed(() => totalActual.value - totalTarget.value)

// display unit heuristic: if filter fixed use it, otherwise THB if present else first
const unitDisplay = computed<Unit>(() => {
    if (unit.value) return unit.value as Unit
    const hasTHB = filteredRows.value.some(r => r.unit === 'THB')
    return (hasTHB ? 'THB' : (filteredRows.value[0]?.unit ?? 'THB')) as Unit
})

// ---- Edit Row ----
const editingId = ref<string>('')
const editBuffer = reactive<Pick<TargetRow, 'target' | 'actual' | 'unit'>>({ target: 0, actual: 0, unit: 'THB' })

function startEdit(r: TargetRow) {
    editingId.value = r.id
    editBuffer.target = r.target
    editBuffer.actual = r.actual
    editBuffer.unit = r.unit
}
function cancelEdit() {
    editingId.value = ''
}
function saveEdit(id: string) {
    if (editBuffer.target < 0 || editBuffer.actual < 0) return alert('Target/Actual must be >= 0')
    const idx = rows.value.findIndex(r => r.id === id)
    if (idx !== -1) {
        rows.value[idx] = { ...rows.value[idx], target: editBuffer.target, actual: editBuffer.actual, unit: editBuffer.unit }
    }
    editingId.value = ''
}

function removeRow(id: string) {
    if (!confirm('Delete this row?')) return
    rows.value = rows.value.filter(r => r.id !== id)
}

function onAddRow() {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const newRow: TargetRow = {
        id: cryptoRandom(),
        period: `${y}${m}`,
        zone: zoneOptions.value[0] ?? 'BE',
        area: areaOptions.value[0] ?? 'BE211',
        storeId: '',
        productGroup: '',
        target: 0,
        actual: 0,
        unit: 'THB',
    }
    rows.value.unshift(newRow)
    startEdit(newRow)
}

function cryptoRandom() {
    // lightweight unique id
    return 'id-' + Math.random().toString(36).slice(2, 9)
}

// ---- Chart (Top gaps) ----
const barReady = ref(true)
const barData = computed(() => {
    const worst = [...filteredRows.value]
        .map(r => ({ label: `${formatPeriod(r.period)} • ${r.area} • ${r.productGroup ?? ''}`.trim(), gap: r.actual - r.target }))
        .sort((a, b) => a.gap - b.gap) // most negative first
        .slice(0, 10)

    return {
        labels: worst.map(w => w.label),
        datasets: [
            { label: 'Variance (Actual - Target)', data: worst.map(w => w.gap) },
        ],
    }
})

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
    },
    scales: {
        y: { ticks: { callback: (v: number) => formatShort(v as number) } },
        x: { ticks: { maxRotation: 0, minRotation: 0 } },
    },
}

// ---- Utils ----
function attainment(r: TargetRow) {
    return r.target > 0 ? (r.actual / r.target) * 100 : 0
}
function attainmentClass(r: TargetRow) {
    const a = attainment(r)
    return { good: a >= 100, warn: a >= 80 && a < 100, bad: a < 80 }
}
function formatPeriod(p: string) {
    if (!/^\d{6}$/.test(p)) return p
    return `${p.slice(0, 4)}-${p.slice(4, 6)}`
}
function formatNum(n: number, u: Unit) {
    if (u === 'THB') return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(n)
    return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2 }).format(n)
}
function formatShort(n: number) {
    const abs = Math.abs(n)
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
}

function exportCSV() {
    const header = ['id', 'period', 'zone', 'area', 'storeId', 'productGroup', 'target', 'actual', 'unit']
    const lines = [header.join(',')]
    for (const r of filteredRows.value) {
        const row = [r.id, r.period, r.zone, r.area, r.storeId ?? '', r.productGroup ?? '', r.target, r.actual, r.unit]
        lines.push(row.map(v => String(v).replaceAll('"', '""')).map(v => /[",\n]/.test(v) ? `"${v}"` : v).join(','))
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `targets_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash', period);
    await routeStore.getRouteEffective(period, '', selectedZone.value, selectedTeam.value, selectedArea.value,);
    await routeStore.getDayRoute(period, '', '', '');
    isLoading.value = false
    // Reset to first page when filters change
})

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = ''
    if (newVal) {
        isLoading.value = true
        if (monthRange.value) {
            await routeStore.getRouteEffective(formatPeriodYYYYMM(monthRange.value), '', newVal, selectedTeam.value, selectedArea.value,);
            await routeStore.getDayRoute(formatPeriodYYYYMM(monthRange.value), newVal, selectedTeam.value, selectedArea.value);
        } else {
            await routeStore.getRouteEffective(period, '', newVal, selectedTeam.value, selectedArea.value,);
            await routeStore.getDayRoute(period, newVal, selectedTeam.value, selectedArea.value);
        }

        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam(selectedChannel.value, newVal);
        isLoading.value = false
    }
});

watch(selectedTeam, async (newVal) => {
    selectedArea.value = ''
    if (newVal) {
        isLoading.value = true
        if (monthRange.value) {
            await routeStore.getRouteEffective(formatPeriodYYYYMM(monthRange.value), '', selectedZone.value, newVal, selectedArea.value,);
            await routeStore.getDayRoute(formatPeriodYYYYMM(monthRange.value), selectedZone.value, newVal, selectedArea.value);
        } else {
            await routeStore.getRouteEffective(period, '', selectedZone.value, newVal, selectedArea.value,);
            await routeStore.getDayRoute(period, selectedZone.value, newVal, selectedArea.value);
        }
        filter.getArea(period, selectedZone.value, newVal);
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    if (newVal) {
        isLoading.value = true
        if (monthRange.value) {
            await routeStore.getRouteEffective(formatPeriodYYYYMM(monthRange.value), '', selectedZone.value, selectedTeam.value, newVal,);
            await routeStore.getDayRoute(formatPeriodYYYYMM(monthRange.value), selectedZone.value, selectedTeam.value, newVal);
        } else {
            await routeStore.getRouteEffective(period, '', selectedZone.value, selectedTeam.value, newVal,);
            await routeStore.getDayRoute(period, selectedZone.value, selectedTeam.value, newVal);
        }
        isLoading.value = false
    }
});

const goToTargetVisit = (data) => {
    if (!selectedArea.value || !data.day) {
        console.warn('Missing route params', data, selectedArea.value)
        return
    }
    const routeData = router.resolve({
        name: 'targetvisitstore',
        params: {
            area: selectedArea.value,
            date: data.day
        }
    })

    window.open(routeData.href, '_blank')

}



</script>

<style scoped>
.target-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 12px;
    margin-bottom: 12px;
}

.header h1 {
    font-size: 22px;
    font-weight: 700;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.filters {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
    align-items: end;
    margin: 12px 0 16px;
}

.filter {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.filter input,
.filter select {
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 14px;
}

.filter.checkbox {
    align-self: center;
}

.summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    /* background-color: white; */
}

.card .label {
    font-size: 20px;
    color: black;

}

.card .value {
    font-weight: 500;
    color: black;
    /* align-items: end; */
    font-size: 18px;
    margin-top: 6px;
}

.card.good {
    border: 5px solid #067a00;
}

.card.warn {
    border: 5px solid #a36b00;
}

.card.bad {
    border: 5px solid #b00020;
}

.chart-wrap {
    height: 320px;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    background: #fff;
    margin-bottom: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
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

.table td.num,
.table th.num {
    text-align: right;
}

.table td .badge {
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

.table td .badge.good {
    background: #e9f8ea;
    color: #0a6d0a;
}

.table td .badge.warn {
    background: #fff3e0;
    color: #8b5e00;
}

.table td .badge.bad {
    background: #fde7ea;
    color: #af2337;
}

.table td.neg {
    color: #b00020;
}

.table td.pos {
    color: #0a6d0a;
}

.table td .input-num {
    width: 120px;
    text-align: right;
    padding: 6px 8px;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
}

.table .actions {
    display: flex;
    gap: 6px;
}

.table .empty {
    text-align: center;
    color: #888;
    padding: 24px;
}

.table-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: #fafafa;
}

.table-footer .spacer {
    flex: 1;
}

.btn {
    border: 1px solid #dcdcdc;
    background: #fff;
    border-radius: 10px;
    padding: 8px 12px;
    font-weight: 600;
    cursor: pointer;
}

.btn.primary {
    background: #111827;
    color: #fff;
    border-color: #111827;
}

.btn.ghost {
    background: transparent;
}

.btn.sm {
    padding: 6px 10px;
    font-size: 12px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 1024px) {
    .filters {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
