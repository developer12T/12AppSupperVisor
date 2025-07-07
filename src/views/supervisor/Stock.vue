<template>
    <div class="max-w-7xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-4">
        <div class="flex justify-between flex-wrap gap-3 items-center mb-4">
            <div class="flex gap-3 ">
                <select v-model="selectedType" class="w-32 border rounded px-2 py-1 text-sm">
                    <option disabled value="" class="text-gray-400">เลือกกลุ่ม</option>
                    <option value="Summary">Summary</option>
                    <option value="In">Stock In</option>
                    <option value="Out">Stock Out</option>
                    <option value="Bal">Balance</option>
                    <!-- เพิ่มกลุ่มตามจริง -->
                </select>
                <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
            <div>
                <!-- <button class="ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">ล้างตัวกรอง</button> -->
                <button @click="exportExcel"
                    class="ms-4 ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">Export
                    Excel</button>
            </div>

        </div>
        <div class="overflow-x-auto rounded-xl" style="max-height: 480px; overflow-y: auto;">
            <table v-if="selectedType === 'Summary'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ชื่อ</th>
                        <th class="p-2 border">STOCK</th>
                        <th class="p-2 border">IN</th>
                        <th class="p-2 border">OUT</th>
                        <th class="p-2 border">BAL</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(prod, i) in data.data" :key="prod.productId" class="align-top">
                        <!-- ชื่อสินค้า (รวมรหัสและ unit) -->
                        <td class="border p-2 text-left whitespace-pre">
                            <span class="font-bold">{{ i + 1 }}.{{ prod.productName ?? '-' }}</span>
                            <div class="">{{ prod.productId }}</div>
                        </td>
                        <!-- STOCK -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.stock ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- IN -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.stockIn ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- OUT -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.stockOut ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- BAL -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center font-semibold">{{ unit.balance ?? 0 }} {{ unit.unitName ??
                                    unit.unit }}</div>
                            </template>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <!-- Summary row (PCS) -->
                    <tr class="bg-gray-300 font-bold ">
                        <td class="border p-2 text-center">รวมจำนวน (PCS)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockInPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockOutPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBalPcs) }}</td>
                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-300  font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStock) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockIn) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockOut) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBal) }}</td>
                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'In'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">รหัส</th>
                        <th class="p-2 border">ชื่อสินค้า</th>
                        <th class="p-2 border">ยอดยกมา</th>
                        <th class="p-2 border">เบิกระหว่างทริป</th>
                        <th class="p-2 border">รับคืนดี</th>
                        <th class="p-2 border">รับคืนเสีย</th>
                        <th class="p-2 border">รับโอนจากเครดิต</th>
                        <th class="p-2 border">รวมจำนวนรับเข้า</th>
                        <th class="p-2 border">รวมมูลค่ารับเข้า</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(prod, i) in stockIn" :key="prod.productId" class="align-top">
                        <!-- ชื่อสินค้า (รวมรหัสและ unit) -->
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.productId }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.name }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.stock }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.withdraw }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.good }}</div>
                        </td>
                        <td class="border p-2 text-rightwhitespace-pre">
                            <div class="">{{ prod.damaged }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.credit }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.sumStock }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summary }}</div>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>
                        <th class="p-2 border">{{ stockSummary.sumStockIn }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockIn }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockInGood }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockInDamaged }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockInCredit }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockInsumStock }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockInsummary }}</th>
                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'Out'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">รหัส</th>
                        <th class="p-2 border">ชื่อสินค้า</th>
                        <th class="p-2 border">จำนวนขาย</th>
                        <th class="p-2 border">มูลค่าขาย</th>
                        <th class="p-2 border">จำนวนแถม</th>
                        <th class="p-2 border">มูลค่าแถม</th>
                        <th class="p-2 border">จำนวนที่เปลี่ยนให้ร้านค้า</th>
                        <th class="p-2 border">มูลค่าเปลี่ยนให้ร้านค้า</th>
                        <th class="p-2 border">จำนวนแจกสินค้า</th>
                        <th class="p-2 border">มูลค่าแจกสินค้า</th>
                        <th class="p-2 border">แลกซอง</th>
                        <th class="p-2 border">รวมจำนวนขาย+แถม+เปลี่ยน</th>
                        <th class="p-2 border">รวมมูลค่าขาย+แถม+เปลี่ยน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(prod, i) in stockOut" :key="prod.productId" class="align-top">
                        <!-- ชื่อสินค้า (รวมรหัสและ unit) -->
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.productId }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.name }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.sale }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summarySale }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.promotion }}</div>
                        </td>
                        <td class="border p-2 text-rightwhitespace-pre">
                            <div class="">{{ prod.summaryPromotion }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.change }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summaryChange }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.give }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summaryGive }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.exchange }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summaryQtySalePromotionChange }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summarySalePromotionChange }}</div>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSale }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummarySale }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutPromotion }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummaryPromotion }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutChange }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummaryChange }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutGive }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummaryGive }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutexchange }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummaryQtySalePromotionChange }}</th>
                        <th class="p-2 border">{{ stockSummary.sumStockOutSummarySalePromotionChange }}</th>
                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'Bal'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">รหัส</th>
                        <th class="p-2 border">ชื่อสินค้า</th>
                        <th class="p-2 border">จำนวนคงเหลือดี</th>
                        <th class="p-2 border">จำนวนคงเหลือเสีย</th>
                        <th class="p-2 border">มูลค่าคงเหลือ</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(prod, i) in balance" :key="prod.productId" class="align-top">
                        <!-- ชื่อสินค้า (รวมรหัสและ unit) -->
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.productId }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.productName }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.balanceGood }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.balanceDamaged }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ prod.summary }}</div>
                        </td>


                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>
                        <th class="p-2 border">{{ stockSummary.sumBalanceGood }}</th>
                        <th class="p-2 border">{{ stockSummary.sumBalanceDamaged }}</th>
                        <th class="p-2 border">{{ stockSummary.sumBalanceSummary }}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="flex justify-end mt-4">
            <button class="bg-blue-700 text-white rounded-xl px-6 py-2 font-semibold flex items-center gap-2">
                <span class="material-icons">print</span> พิมพ์ Stock
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStockStore } from '../../store/modules/stock';
import { useFilter } from '../../store/modules/filter'

const filter = useFilter()
const selectedType = ref('Summary') // ค่า default
const stockStore = useStockStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

// ใช้ data ที่คุณให้มา หรือ fetch ก็ได้
const data = ref({})
const stockSummary = ref({})
const stockIn = ref({})
const stockOut = ref({})
const balance = ref({})
const selectedZone = ref('')
const selectedArea = ref('')

function formatNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '-'
    return Number(val).toLocaleString()
}


watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        filter.getArea(period, newVal, '');
    }
});

async function exportExcel() {
    await stockStore.downloadExcel(selectedArea.value, period)
}

watch(selectedArea, async (newVal) => {
    if (newVal) {
        await stockStore.getStock(newVal, period)
        await stockStore.stockToExcel(newVal, period)
        data.value = stockStore.stock
        stockSummary.value = stockStore.stockSummary
        stockIn.value = stockStore.stockIn
        stockOut.value = stockStore.stockOut
        console.log('stockOut', stockOut.value)
        balance.value = stockStore.balance
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
});

onMounted(async () => {
    // isLoading.value = true
    await filter.getZone(period);
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value, '');
    }


    // isLoading.value = false
})
</script>
