<template>
    <div class="target-page">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <!-- Header -->
        <header class="header">
            <h1>🎯 Target / เป้าหมายยอดขาย เขต: {{ area }}</h1>
            <!-- <div class="header-actions">
                <button class="btn primary" @click="onAddRow">+ New Target</button>
                <button class="btn" @click="exportCSV">Export CSV</button>
            </div> -->
            <div class="flex justify-end">
                <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                    <option value="vat">รวม VAT</option>
                    <option value="novat">ไม่รวม VAT</option>
                </select>
                <div class="w-65 ms-3">
                    <VueDatePicker v-model="monthPick" month-picker @update:model-value="onMonthChange" />
                </div>
            </div>
        </header>

        <!-- Filters -->
        <!-- <section class="filters">
            <div class="filter">
                <label>Search / ค้นหา</label>
                <input v-model.trim="search" type="search" placeholder="zone, area, group, storeId…" />
            </div>
            <div class="filter">
                <label>Period / งวด</label>
                <select v-model="period">
                    <option value="">All</option>
                    <option v-for="p in periodOptions" :key="p" :value="p">{{ formatPeriod(p) }}</option>
                </select>
            </div>
            <div class="filter">
                <label>Zone</label>
                <select v-model="zone">
                    <option value="">All</option>
                    <option v-for="z in zoneOptions" :key="z" :value="z">{{ z }}</option>
                </select>
            </div>
            <div class="filter">
                <label>Area</label>
                <select v-model="area">
                    <option value="">All</option>
                    <option v-for="a in areaOptions" :key="a" :value="a">{{ a }}</option>
                </select>
            </div>
            <div class="filter">
                <label>Unit</label>
                <select v-model="unit">
                    <option value="">All</option>
                    <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                </select>
            </div>
            <div class="filter checkbox">
                <label>
                    <input type="checkbox" v-model="onlyBelow" />
                    Only below target / ต่ำกว่าเป้า
                </label>
            </div>
        </section> -->

        <!-- Metrics Summary -->
        <section class="summary">
            <div class="card">
                <div class="label">เป้าหมายยอดขาย</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum(saleStore.target?.target ?? 0,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.target * 1.07 ?? 0,
                    unitDisplay) }}</div>
            </div>
            <div class="card">
                <div class="label">ยอดขาย</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum((saleStore.target?.sale ?? 0) / 1.07,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.sale ?? 0,
                    unitDisplay) }}</div>
            </div>
            <div class="card">
                <div class="label">ความสำเร็จ</div>
                <div class="value"
                    :class="{ good: overallAttainment >= 1, warn: overallAttainment >= 0.8 && overallAttainment < 1, bad: overallAttainment < 0.8 }">
                    {{ (overallAttainment * 100).toFixed(1) }}%
                </div>
            </div>
            <div class="card">
                <div class="label">ผลต่าง (ยอดขาย - เป้าหมาย)</div>
                <div v-if="selectedStatus === 'novat'" class="value"
                    :class="{ good: variance >= 0, bad: variance < 0 }">{{ formatNum(variance,
                        unitDisplay) }}</div>

                <div v-if="selectedStatus === 'vat'" class="value" :class="{ good: variance >= 0, bad: variance < 0 }">
                    {{ formatNum(variance * 1.07,
                        unitDisplay) }}</div>
            </div>
        </section>
        <section class="summary">
            <div class="card">
                <div class="label">ยอดเปลี่ยน</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum((saleStore.target?.change ?? 0) / 1.07,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.change ?? 0,
                    unitDisplay) }}</div>
            </div>
            <div class="card">
                <div class="label">ยอดคืนดี</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum((saleStore.target?.good ?? 0) / 1.07,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.good ?? 0,
                    unitDisplay) }}</div>
            </div>
            <div class="card">
                <div class="label">ยอดเสีย</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum((saleStore.target?.damaged ?? 0) / 1.07,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.damaged ?? 0,
                    unitDisplay) }}</div>
            </div>
            <div class="card">
                <div class="label">ยอดตัดแจก</div>
                <div v-if="selectedStatus === 'novat'" class="value">{{ formatNum((saleStore.target?.give ?? 0) / 1.07,
                    unitDisplay) }}</div>
                <div v-if="selectedStatus === 'vat'" class="value">{{ formatNum(saleStore.target?.give ?? 0,
                    unitDisplay) }}</div>
            </div>
        </section>

        <!-- Chart -->
        <!-- <section class="chart-wrap" v-if="barReady">
            <Bar :data="barData" :options="barOptions" />
        </section> -->

        <!-- Data Table -->
        <section class="table-wrap">
            <table class="table">
                <thead>
                    <tr>
                        <th @click="setSort('period')">เดือน</th>
                        <th @click="setSort('productGroup')">กลุ่ม</th>
                        <!-- <th @click="setSort('productGroup')">Group Code</th> -->
                        <th class="num" @click="setSort('target')">เป้าหมาย</th>
                        <th class="num" @click="setSort('actual')">ยอดขาย</th>
                        <th class="num" @click="setSort('attainment')">เปอร์เซ็น%</th>
                        <th class="num" @click="setSort('variance')">ผลต่าง</th>
                        <!-- <th @click="setSort('unit')">Unit</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in visibleRows" :key="r.id">
                        <td>{{ formatPeriod(r.period) }}</td>
                        <!-- <td>{{ r.zone }}</td>
                        <td>{{ r.area }}</td> -->
                        <td>{{ r.group || '-' }}</td>
                        <!-- <td>{{ r.groupCode || '-' }}</td>  -->
                        <!-- <td>{{ r.storeId || '-' }}</td> -->
                        <td class="num" :title="String(r.targetQty)">
                            <template v-if="editingId === r.id">
                                <input class="input-num" type="number" min="0" step="0.01"
                                    v-model.number="editBuffer.targetQty" />
                            </template>
                            <template v-else>
                                {{ r.targetQty + " หีบ" }}
                            </template>
                        </td>
                        <td class="num" :title="String(r.actualCtn)">
                            <template v-if="editingId === r.id">
                                <input class="input-num" type="number" min="0" step="0.01"
                                    v-model.number="editBuffer.actualCtn" />
                            </template>
                            <template v-else>
                                {{ r.actualCtn + " หีบ" }}
                            </template>
                        </td>
                        <td class="num">
                            <span class="badge" :class="attainmentClass(r)">{{ attainment(r).toFixed(1) }}%</span>
                        </td>
                        <td class="num"
                            :class="{ neg: (r.actualCtn - r.targetQty) < 0, pos: (r.actualCtn - r.targetQty) >= 0 }">{{
                                r.actualCtn -
                                r.targetQty + " หีบ" }}</td>
                        <td>
                            <template v-if="editingId === r.id">
                                <select v-model="editBuffer.unit">
                                    <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                                </select>
                            </template>
                            <!-- <template v-else>
                                {{ r.unit }}
                            </template> -->
                        </td>
                        <!-- <td class="actions">
                            <template v-if="editingId === r.id">
                                <button class="btn primary sm" @click="saveEdit(r.id)">Save</button>
                                <button class="btn ghost sm" @click="cancelEdit">Cancel</button>
                            </template>
                            <template v-else>
                                <button class="btn sm" @click="startEdit(r)">Edit</button>
                                <button class="btn ghost sm" @click="removeRow(r.id)">Delete</button>
                            </template>
                        </td> -->
                    </tr>
                    <tr v-if="visibleRows.length === 0">
                        <td colspan="11" class="empty">No data / ไม่มีข้อมูล</td>
                    </tr>
                </tbody>
            </table>
            <!-- <div class="table-footer">
                <div class="rows">Rows: {{ visibleRows.length }}</div>
                <div class="spacer"></div>
                <div class="paging">
                    <button class="btn sm" :disabled="page === 1" @click="page--">Prev</button>
                    <span>Page {{ page }}</span>
                    <button class="btn sm" :disabled="endIndex >= sortedRows.length" @click="page++">Next</button>
                </div>
            </div> -->
        </section>
    </div>
</template>

<script lang="ts" setup>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, onMounted, reactive, ref } from 'vue'
import { useSale } from '../../store/modules/sale'
import 'chart.js/auto'
import { formatToYYYYMM, normalizeMonth, pad2 } from '../../utils/format'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์


// --- Types ---
export type Unit = 'THB' | 'PCS' | 'CTN'
export interface TargetRow {
    id: string
    period: string   // YYYYMM
    zone: string
    area: string
    storeId?: string
    group?: string
    targetAll: number
    actualCtn: number
    unit: Unit
}

const saleStore = useSale();

// ---- Demo Data (replace with API results) ----
const rows = ref<TargetRow[]>([])

// ---- Filters ----
const search = ref('')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const zone = ref('')
const unit = ref('')
const onlyBelow = ref(false)
const monthPick = ref();
const startDate = ref('') // e.g. "20250801"
const endDate = ref('') // e.g. "20250831"
const isLoading = ref(false)

let area = localStorage.getItem('area')
const selectedStatus = ref('vat')

const unitOptions = ['THB', 'PCS', 'CTN'] as const
const periodOptions = computed(() => Array.from(new Set(rows.value.map(r => r.period))).sort())
const zoneOptions = computed(() => Array.from(new Set(rows.value.map(r => r.zone))).sort())
const areaOptions = computed(() => Array.from(new Set(rows.value.map(r => r.area))).sort())

// ---- Sorting ----
// keys: period | zone | area | productGroup | storeId | target | actual | unit | attainment | variance
const sortKey = ref<'period' | 'zone' | 'area' | 'group' | 'storeId' | 'target' | 'actual' | 'unit' | 'attainment' | 'variance'>('period')
const sortDir = ref<1 | -1>(-1) // default newest first for period

function setSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortDir.value = (sortDir.value === 1 ? -1 : 1)
    } else {
        sortKey.value = key
        sortDir.value = key === 'period' ? -1 : 1
    }
}

// ---- Computed helpers ----
const filteredRows = computed(() => {
    const q = search.value.toLowerCase()
    return rows.value.filter(r => {
        if (period.value && r.period !== period.value) return false
        if (zone.value && r.zone !== zone.value) return false
        if (area.value && r.area !== area.value) return false
        if (unit.value && r.unit !== unit.value) return false
        if (q) {
            const hay = `${r.zone} ${r.area} ${r.productGroup ?? ''} ${r.storeId ?? ''}`.toLowerCase()
            if (!hay.includes(q)) return false
        }
        if (onlyBelow.value && r.actual >= r.target) return false
        return true
    })
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

// ---- Paging ----
const page = ref(1)
const pageSize = ref(10)
const startIndex = computed(() => (page.value - 1) * pageSize.value)
const endIndex = computed(() => page.value * pageSize.value)
const visibleRows = computed(() => sortedRows.value)

// ---- Summary ----
const totalTarget = computed(() => filteredRows.value.reduce((s, r) => s + (r.unit === unitDisplay.value || unitDisplay.value === 'THB' ? r.targetQty : r.targetQty), 0))
const totalActual = computed(() => filteredRows.value.reduce((s, r) => s + (r.unit === unitDisplay.value || unitDisplay.value === 'THB' ? r.actualCtn : r.actualCtn), 0))
const overallAttainment = computed(() => {
    const t = saleStore.target?.target ?? 0
    const s = saleStore.target?.sale ?? 0
    return t > 0 ? s / t : 0
})
const variance = computed(() =>
    ((saleStore.target?.sale ?? 0) / 1.07) - (saleStore.target?.target ?? 0)
)

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
    return r.targetQty > 0 ? (r.actualCtn / r.targetQty) * 100 : 0
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

async function onMonthChange() {
    isLoading.value = true
    console.log(monthPick.value)
    console.log(formatToYYYYMM(monthPick.value))

    const { year, month } = normalizeMonth(monthPick.value)
    const firstDay = 1
    const lastDay = new Date(year, month, 0).getDate() // handles 28/29/30/31 correctly

    // console.log(year)
    // console.log(month)
    // console.log(firstDay)
    // console.log(lastDay)

    startDate.value = `${year}${pad2(month)}${pad2(firstDay)}`
    endDate.value = `${year}${pad2(month)}${pad2(lastDay)}`

    await saleStore.getTarget(startDate.value, endDate.value, area)
    await saleStore.getTargetProduct(formatToYYYYMM(monthPick.value), area, '', '')
    rows.value = saleStore.targetProduct

    // await useOrderStore.fetchOrder('', `${startDate.value}`, `${endDate.value}`)
    isLoading.value = false
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
    await saleStore.getTarget('', '', area)
    await saleStore.getTargetProduct(period, area, '', '')
    rows.value = saleStore.targetProduct
    console.log(rows.value);
    isLoading.value = false
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
    align-items: center;
    justify-content: space-between;
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
}

.card .label {
    font-size: 12px;
    color: #666;
}

.card .value {
    font-weight: 700;
    font-size: 18px;
    margin-top: 6px;
}

.card .value.good {
    color: #067a00;
}

.card .value.warn {
    color: #a36b00;
}

.card .value.bad {
    color: #b00020;
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
    top: 0;
    background: #fafafa;
    text-align: left;
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


/* ===== Tablet tuning: Galaxy Tab A7 Lite (~800px) ===== */

/* 0) ปรับกล่องหลักให้ยืดหยุ่นขึ้น */
@media (max-width: 1024px) {
    .target-page {
        max-width: 100%;
        padding: 12px;
    }

    .header {
        flex-wrap: wrap;
        gap: 8px;
    }

    .header h1 {
        font-size: 18px;
        line-height: 1.25;
    }
}

/* 1) ช่วง tablet กว้าง (<= 900px): สรุป 2 คอลัมน์, ช่องตารางกระชับขึ้น */
@media (max-width: 900px) {
    .summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    .filters {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    .table thead th,
    .table td {
        padding: 8px 10px;
    }
}

/* 2) ระดับ Galaxy Tab A7 Lite (<= 820px): 
      - Header เรียงเป็นคอลัมน์ 
      - สรุป 2 คอลัมน์ 
      - ตารางเลื่อนแนวนอนได้ (สำคัญกับจอ ~800px) */
@media (max-width: 820px) {
    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    /* เปิด horizontal scroll ให้ตาราง */
    .table-wrap {
        overflow-x: auto;
        /* <-- เดิมเป็น hidden ให้เปลี่ยนเป็น auto */
        -webkit-overflow-scrolling: touch;
    }

    /* กันหัวตารางหายเวลาเลื่อน */
    .table {
        min-width: 720px;
        /* ป้องกันตารางบีบเกินไปบนจอ ~800px */
    }

    /* กระชับ card summary */
    .card .value {
        font-size: 16px;
    }
}

/* 3) จอแคบกว่า (<= 600px): สรุปเป็นคอลัมน์เดียว, ตารางยังเลื่อนข้างได้ */
@media (max-width: 600px) {
    .summary {
        grid-template-columns: 1fr;
    }

    .filters {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .table {
        min-width: 640px;
    }

    .header h1 {
        font-size: 16px;
    }
}

/* 4) คุณภาพชีวิต: ให้หัวตารางอยู่เหนือเนื้อหาตอนเลื่อนแนวขวาง */
.table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
}

/* 5) ปุ่ม/อินพุตให้กดง่ายขึ้นบนแท็บเล็ต */
@media (max-width: 900px) {

    .btn,
    .filter input,
    .filter select,
    .table td .input-num,
    .select {
        min-height: 40px;
    }
}

/* 6) ปรับส่วนเลือกเดือน/สถานะให้ชิดขวาบน desktop และเรียงลงบนแท็บเล็ต */
@media (max-width: 900px) {
    .header .flex {
        width: 100%;
        justify-content: space-between;
        gap: 8px;
    }

    .header .flex>* {
        flex: 1 1 auto;
    }

    .header .flex .w-65 {
        width: auto;
        /* กันความกว้าง fix ทำให้ล้น */
    }
}
</style>
