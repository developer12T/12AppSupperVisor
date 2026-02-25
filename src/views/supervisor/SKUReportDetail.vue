<template>
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold"> </h2>
        <button class="btn btn-sm" @click="exportDetail()">Export 📑</button>
    </div>
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
import * as XLSX from 'xlsx'

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

const exportToExcel = (exportRows, exportColumns) => {
    // Prepare header row
    const headerRow = ['Date', 'Order', 'Store', 'Store ID', ...exportColumns.map(col => col.skuName)]
    
    // Prepare data rows
    const dataRows = exportRows.map(row => [
        formatDate(row.date),
        row.orderId,
        row.storeName,
        row.storeId,
        ...exportColumns.map(col => row.items?.[col.skuId]?.pcs || 0)
    ])
    
    // Combine header and data
    const worksheetData = [headerRow, ...dataRows]
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SKU Report')
    
    // Set column widths
    const columnWidths = [
        { wch: 15 }, // Date
        { wch: 15 }, // Order
        { wch: 20 }, // Store
        { wch: 12 }, // Store ID
        ...exportColumns.map(() => ({ wch: 12 })) // SKU columns
    ]
    worksheet['!cols'] = columnWidths
    
    // Generate filename with current date
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    const filename = `SKU_Report_${dateStr}.xlsx`
    
    // Write file
    XLSX.writeFile(workbook, filename)
}

const exportDetail = async () => {
    isLoading.value = true
    try {
        // Get period
        const today = new Date()
        const period =
            today.getFullYear().toString() +
            String(today.getMonth() + 1).padStart(2, '0')

        // Fetch all data (without area filter)
        await routeStore.getOrderReportSKU('', period)

        const payload = routeStore.orderSKUv2 || {}
        const exportRows = payload.rows || []
        const exportColumns = payload.columns || []

        // Export to Excel
        exportToExcel(exportRows, exportColumns)
    } catch (error) {
        console.error('Error exporting data:', error)
    } finally {
        isLoading.value = false
    }
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

.btn {
    border: 2px solid #00ff00;
    background: #fff;
    border-radius: 10px;
    padding: 8px 12px;
    margin-right: 5%;
    font-weight: 600;
    cursor: pointer;
    float: right;
}

</style>
