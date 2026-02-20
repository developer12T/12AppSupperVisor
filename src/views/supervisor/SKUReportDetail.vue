<template>
    <div class="overflow-x-auto" style="max-height:560px; max-width:90vw;">
        <table class="table table-zebra w-full">

            <!-- HEADER -->
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Order</th>
                    <th>Store</th>
                    <th>Store ID</th>

                    <th v-for="sku in columns" :key="sku.skuId">
                        <div class="flex flex-col text-center">
                            <span class="font-semibold">{{ sku.skuName }}</span>
                            <span class="text-xs opacity-60">{{ sku.skuId }}</span>
                            <span class="text-xs text-orange-400">
                                🎯 {{ sku.target || 0 }} PCS
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>

            <!-- BODY -->
            <tbody>
                <tr v-for="(row, i) in rows" :key="row.orderId + i">

                    <td>{{ formatDate(row.date) }}</td>

                    <td class="font-mono cursor-pointer text-blue-600 hover:underline" @click="goToOrder(row.orderId)">
                        {{ row.orderId }}
                    </td>

                    <td>{{ row.storeName }}</td>
                    <td>{{ row.storeId }}</td>

                    <!-- SKU CELLS -->
                    <td v-for="sku in columns" :key="sku.skuId" class="text-center">

                        <template v-if="row.items?.[sku.skuId]">

                            <span class="badge" :class="{
                                'badge-success':
                                    row.items[sku.skuId].pcs >= sku.target,
                                'badge-outline':
                                    row.items[sku.skuId].pcs < sku.target
                            }">
                                {{ row.items[sku.skuId].pcs }} PCS
                            </span>

                        </template>

                        <span v-else class="text-gray-400">
                            0
                        </span>

                    </td>

                </tr>

                <tr v-if="!rows.length">
                    <td colspan="999" class="text-center py-6 text-gray-400">
                        No data
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouteStore } from '../../store/modules/route'

const routeStore = useRouteStore()
const route = useRoute()
const router = useRouter()

const rows = ref([])
const columns = ref([])
const isLoading = ref(false)

const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('th-TH')
}

const goToOrder = (orderId) => {
    const r = router.resolve({
        name: 'OrderDetailSup',
        params: { orderId }
    })
    window.open(r.href, '_blank')
}

onMounted(async () => {
    isLoading.value = true

    const today = new Date()
    const period =
        today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, '0')

    const area = route.params.area

    await routeStore.getOrderReportSKU(area, period)

    const payload = routeStore.orderSKUv2 || {}

    rows.value = payload.rows || []
    columns.value = payload.columns || []

    isLoading.value = false
})
</script>

<style scoped>
.table thead th {
    position: sticky;
    top: 0;
    background: #00569d;
    color: white;
}
</style>
