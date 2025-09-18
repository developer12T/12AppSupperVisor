<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

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
                    class="mx-4 ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">
                    Export Excel แยก (IN,OUT,BAL) </button>

                <button @click="exportExcelSummary"
                    class="ms-4 ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">Export
                    Excel</button>
            </div>

        </div>
        <div class="overflow-x-auto rounded-xl" style="max-height: 480px; overflow-y: auto;">
            <table v-if="selectedType === 'Summary'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ชื่อ</th>
                        <th class="p-2 border">ต้นทริป</th>
                        <th class="p-2 border">เบิก</th>
                        <th class="p-2 border">คืนดี (A34 CS0001)</th>
                        <th class="p-2 border">คืนเสีย (A34 CS0002)</th>
                        <th class="p-2 border">ขาย (A31)</th>
                        <th class="p-2 border">แถม (A31)</th>
                        <th class="p-2 border">เปลี่ยน (B31)</th>
                        <th class="p-2 border">คืนสต๊อก</th>
                        <th class="p-2 border">ตัดแจก</th>
                        <th class="p-2 border">คงเหลือ</th>
                        <th class="p-2 border">คงเหลือ (PCS)</th>
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
                        <!-- Withdraw -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.withdraw ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Damaged -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.good ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Good -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.damaged ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Sale -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.sale ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Promotion -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.promotion ?? 0 }} {{ unit.unitName ?? unit.unit }}
                                </div>
                            </template>
                        </td>
                        <!-- Change -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.change ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Adjust Stock -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.adjust ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Give Aways -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.give ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- BAL -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center font-semibold">{{ unit.balance ?? 0 }} {{ unit.unitName ??
                                    unit.unit }}</div>
                            </template>
                        </td>
                        <!-- BAL -->
                        <td class="border p-2">
                            <div class="text-center font-semibold">{{ prod?.summaryPcsPerProduct?.balance ?? 0 }}</div>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <!-- Summary row (PCS) -->
                    <tr class="bg-gray-300 font-bold ">
                        <td class="border p-2 text-center">รวมจำนวน (PCS)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.stockTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.withdrawTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.goodTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.damagedTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.saleTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.promotionTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.changeTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.adjustTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.giveTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.balTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.balTotalPcs) }}</td>
                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-300  font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStock) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryWithdraw) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryGood) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryDamaged) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summarySale) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryPromotion) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryChange) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryAdjust) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryGive) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBal) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBal) }}</td>
                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'In'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ชื่อ</th>
                        <th class="p-2 border">ต้นทริป</th>
                        <th class="p-2 border">เบิก</th>
                        <th class="p-2 border">คืนดี (A34 CS0001)</th>

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
                        <!-- Withdraw -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.withdraw ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Damaged -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.good ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>

                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <!-- Summary row (PCS) -->
                    <tr class="bg-gray-300 font-bold ">
                        <td class="border p-2 text-center">รวมจำนวน (PCS)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.stockTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.withdrawTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.goodTotalPcs) }}</td>


                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-300  font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStock) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryWithdraw) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryGood) }}</td>

                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'Out'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ชื่อ</th>
                        <th class="p-2 border">ขาย (A31)</th>
                        <th class="p-2 border">แถม (A31)</th>
                        <th class="p-2 border">เปลี่ยน (B31)</th>
                        <th class="p-2 border">คืนสต๊อก</th>
                        <th class="p-2 border">ตัดแจก</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(prod, i) in data.data" :key="prod.productId" class="align-top">
                        <!-- ชื่อสินค้า (รวมรหัสและ unit) -->
                        <td class="border p-2 text-left whitespace-pre">
                            <span class="font-bold">{{ i + 1 }}.{{ prod.productName ?? '-' }}</span>
                            <div class="">{{ prod.productId }}</div>
                        </td>
                        <!-- Sale -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.sale ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Promotion -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.promotion ?? 0 }} {{ unit.unitName ?? unit.unit }}
                                </div>
                            </template>
                        </td>
                        <!-- Change -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.change ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Adjust Stock -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.adjust ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>
                        <!-- Give Aways -->
                        <td class="border p-2">
                            <template v-for="(unit, j) in prod.listUnit" :key="j">
                                <div class="text-center">{{ unit.give ?? 0 }} {{ unit.unitName ?? unit.unit }}</div>
                            </template>
                        </td>

                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <!-- Summary row (PCS) -->
                    <tr class="bg-gray-300 font-bold ">
                        <td class="border p-2 text-center">รวมจำนวน (PCS)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.saleTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.promotionTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.changeTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.adjustTotalPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.giveTotalPcs) }}</td>
                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-300  font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summarySale) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryPromotion) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryChange) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryAdjust) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryGive) }}</td>
                    </tr>
                </tfoot>
            </table>
            <table v-else-if="selectedType === 'Bal'" class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ชื่อ</th>
                        <th class="p-2 border">ต้นทริป</th>
                        <th class="p-2 border">คงเหลือ</th>
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
                        <td class="border p-2 text-right">{{ formatNumber(data.balTotalPcs) }}</td>
                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-300  font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStock) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBal) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStockStore } from '../../store/modules/stock';
import { useFilter } from '../../store/modules/filter'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์


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
const isLoading = ref(false)

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

async function exportExcelSummary() {
    await stockStore.downloadExcelSummary(selectedArea.value, period)
}


watch(selectedArea, async (newVal) => {
    if (newVal) {
        isLoading.value = true;
        await stockStore.getStock(newVal, period)
        await stockStore.stockToExcel(newVal, period)
        data.value = stockStore.stock
        stockSummary.value = stockStore.stockSummary
        stockIn.value = stockStore.stockIn
        stockOut.value = stockStore.stockOut
        console.log('stockOut', stockOut.value)
        balance.value = stockStore.balance
        // await new Promise(resolve => setTimeout(resolve, 2000))
        isLoading.value = false;
    }
});

// const totalPCS = computed(() => {
//     return data.value.reduce((sum, order) => {
//         return sum + (Number(order?.summaryPcsPerProduct?.balance) || 0)
//     }, 0)
// })


onMounted(async () => {
    // isLoading.value = true
    await filter.getZone(period);
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value, '');
    }


    // isLoading.value = false
})
</script>
