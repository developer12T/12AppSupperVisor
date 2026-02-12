<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <!-- TABLE -->

    <h1 class="text-2xl font-bold mb-8">เขต {{ route.params.area }} รหัสสินค้า {{ route.params.id }}</h1>
    <div class="overflow-x-auto rounded-xl" style="max-height: 480px;">
        <table class="table table-zebra w-full">
            <thead>
                <tr>
                    <th class="sticky-col">
                        Date
                    </th>
                    <th class="">
                        Order
                    </th>
                    <th class="">
                        Store
                    </th>
                    <th class="">
                        Store Name
                    </th>
                    <th class="">
                        QTY
                    </th>
                    <th class="">
                        Unit
                    </th>
                    <th class="">
                        Amount
                    </th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.orderId" @click="goToOrder(row.orderId)">
                    <td class="font-mono sticky-col">{{ formatDate(row.date) }}</td>
                    <td class="font-mono">{{ row.orderId }}</td>
                    <td class="font-mono">{{ row.storeId }}</td>
                    <td class="font-mono">{{ row.storeName }}</td>
                    <td class="font-mono">{{ row.qty }}</td>
                    <td class="font-mono">{{ row.unit }}</td>
                    <td class="font-mono">{{ formatCurrency(row.amount) }}</td>

                </tr>

                <tr v-if="!rows.length">
                    <!-- <td :colspan="skuColumns.length + 1" class="text-center text-gray-400 py-6">
                        ไม่มีข้อมูล
                    </td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import LoadingOverlay from '../LoadingOverlay.vue'
import { useFilter } from '../../store/modules/filter'
import { useRouteStore } from '../../store/modules/route'

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



const goToOrder = (orderId) => {
    const routeData = router.resolve({
        name: 'OrderDetailSup',
        params: { orderId }
    })

    window.open(routeData.href, '_blank')
}



const rows = computed(() => {
    const data = routeStore.orderSKU || []
    return data
})

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}


function formatCurrency(value) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    }).format(value || 0)
}


onMounted(async () => {
    isLoading.value = true
    await routeStore.getOrderReport(route.params.area, route.params.id, period)
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
