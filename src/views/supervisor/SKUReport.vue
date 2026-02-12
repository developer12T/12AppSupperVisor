<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

    <header class="header">
        <div class="flex justify-start items-center gap-2">
            <Icon icon="mdi:progress-star" class="h-6 w-6" />
            <h1>SKU Focus</h1>
        </div>

        <div class="ms-3">
            <select class="select select-info  ms-3 text-center" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option value="all">All</option>
                <option v-for="zone in filter.zone" :key="zone.zone" :value="zone.zone">
                    {{ zone.zone }}
                </option>
            </select>
        </div>

        <div class="ms-3">
            <select class="select select-info  ms-3 text-center" v-model="selectedTeam">
                <option disabled value="">Select Team</option>
                <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">
                    {{ team.saleTeam }}
                </option>
            </select>
        </div>

        <div class="ms-3">
            <select class="select select-info  ms-3 text-center" v-model="selectedArea">
                <option disabled value="">Select Area</option>
                <option v-for="area in filter.area" :key="area.area" :value="area.area">
                    {{ area.area }}
                </option>
            </select>
        </div>
    </header>

    <!-- TABLE -->
    <div class="overflow-x-auto rounded-xl" style="max-height: 480px;  max-width: 85vw;  overflow-y: auto;">
        <table class="table table-zebra w-full">
            <thead>
                <tr>
                    <th class="sticky-col">
                        Area
                    </th>
                    <th v-for="sku in skuColumns" :key="sku.code" class="text-center">
                        <div class="flex flex-col items-center">
                            <span class="font-semibold">
                                {{ sku.name }}
                            </span>
                            <span class="font-mono text-xs text-gray-200">
                                {{ sku.code }} (PCS)
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="row in rows" :key="row.area">
                    <td class="font-mono sticky-col">{{ row.area }}</td>
                    <td v-for="sku in skuColumns" :key="sku.code" class="text-center"
                        @click="goToDetail(row.area, sku.code)">
                        {{ row[sku.code] }}
                    </td>
                </tr>

                <tr v-if="!rows.length">
                    <td :colspan="skuColumns.length + 1" class="text-center text-gray-400 py-6">
                        ไม่มีข้อมูล
                    </td>
                </tr>
            </tbody>
            <tfoot v-if="rows.length">
                <tr class="bg-gray-200 font-bold">
                    <td class="sticky-col">TOTAL</td>

                    <td v-for="sku in skuColumns" :key="sku.code" class="text-center">
                        {{ totalRow[sku.code] }}
                    </td>
                </tr>
            </tfoot>

        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import LoadingOverlay from '../LoadingOverlay.vue'
import { useFilter } from '../../store/modules/filter'
import { useRouteStore } from '../../store/modules/route'
import { getTeam3 } from '../../utils/format'

// --------------------
// state
// --------------------
const isLoading = ref(false)

const router = useRouter()
const route = useRoute()
const routeStore = useRouteStore()
const filter = useFilter()

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


// --------------------
// mock data (แทน API)
// --------------------
const apiData = ref([])



const totalRow = computed(() => {
    const totals = {}

    skuColumns.value.forEach(sku => {
        totals[sku.code] = 0
    })

    rows.value.forEach(row => {
        skuColumns.value.forEach(sku => {
            totals[sku.code] += row[sku.code] || 0
        })
    })

    return totals
})

// --------------------
// columns (SKU)
// --------------------
const skuColumns = computed(() => {
    const map = {}
    routeStore.reportSKU.forEach(r => {
        map[r.itemCode] = r.itemName
    })
    return Object.entries(map).map(([code, name]) => ({ code, name }))
})


const goToDetail = (area, id) => {
    const routeData = router.resolve({
        name: 'SkuReportDetail',   // ใช้ name จะปลอดภัยกว่า
        params: { area, id }
    })
    window.open(routeData.href, '_blank')
}

// --------------------
// rows (Area x SKU)
// --------------------
const rows = computed(() => {
    const table = {}

    const rawData = routeStore.reportSKU || []

    // ✅ filter
    const filteredData = rawData.filter(order => {

        const matchZone = selectedZone.value && selectedZone.value != "all"
            ? (order.area || '').startsWith(selectedZone.value)
            : true

        const matchTeam = selectedTeam.value
            ? getTeam3(order.area) === selectedTeam.value
            : true

        const matchArea = selectedArea.value
            ? order.area === selectedArea.value
            : true

        return matchZone && matchTeam && matchArea
    })

    filteredData.forEach(r => {

        if (!table[r.area]) {
            table[r.area] = { area: r.area }

            // default ทุก SKU = 0
            skuColumns.value.forEach(sku => {
                table[r.area][sku.code] = 0
            })
        }

        table[r.area][r.itemCode] = r.qty
    })

    return Object.values(table)
})


onMounted(async () => {

    isLoading.value = true
    await routeStore.getProductSKUReport(period)
    await filter.getZone('cash', period);

    isLoading.value = false
})


watch(selectedZone, async (newVal) => {
    selectedArea.value = ''
    selectedTeam.value = ''

    if (newVal === 'all') {
        selectedArea.value = ''
        selectedTeam.value = ''
    } else {
        if (newVal) {
            isLoading.value = true;
            filter.getArea(period, newVal, selectedTeam.value);
            filter.getTeam('cash', newVal);
            isLoading.value = false;
        }
    }



})

watch(selectedTeam, async (newVal) => {
    selectedArea.value = ''
    if (newVal) {
        isLoading.value = true;
        filter.getArea(period, selectedZone.value, newVal);
        isLoading.value = false;
    }
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

/* lock first column */
.sticky-col {
    position: sticky;
    left: 0;
    z-index: 2;
    background: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

/* ให้ header อยู่เหนือ body */
.table thead .sticky-col {
    z-index: 3;
    background: #00569D;
    /* สีเดียวกับ header */
    color: white;
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
