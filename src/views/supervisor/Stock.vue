<template>
    <div class="max-w-7xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-4">
        <div class="flex justify-between flex-wrap gap-3 items-center mb-4">
            <select v-model="selectedType" class="border rounded px-2 py-1 text-sm">
                <option disabled value="" class="text-gray-400">เลือกกลุ่ม</option>
                <option value="Summary">Summary</option>
                <option value="In">Stock In</option>
                <option value="Out">Stock Out</option>
                <option value="Bal">Balance</option>
                <!-- เพิ่มกลุ่มตามจริง -->
            </select>
            <div>
                <!-- <button class="ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">ล้างตัวกรอง</button> -->
                <button class="ms-4 ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">Export
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

                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>

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

                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
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

                </tbody>
                <tbody>

                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr>
                        <th colspan="2" class="p-2 border">รวม</th>

                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
                        <th class="p-2 border">0</th>
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

const selectedType = ref('Summary') // ค่า default
const stockStore = useStockStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

// ใช้ data ที่คุณให้มา หรือ fetch ก็ได้
const data = ref({
})

function formatNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '-'
    return Number(val).toLocaleString()
}

onMounted(async () => {
    // isLoading.value = true
    await stockStore.getStock(period) // fetch from API
    data.value = stockStore.stock
    // isLoading.value = false
})
</script>
