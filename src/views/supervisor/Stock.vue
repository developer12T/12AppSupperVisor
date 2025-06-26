<template>
    <div class="max-w-4xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-4">
        <div class="flex flex-wrap gap-3 items-center mb-4">
            <select class="border rounded px-2 py-1 text-sm">
                <option>เลือกกลุ่ม</option>
                <!-- เพิ่มกลุ่มตามจริง -->
            </select>
            <button class="ml-auto bg-blue-700 text-white rounded px-4 py-1 font-semibold">ล้างตัวกรอง</button>
        </div>
        <div class="overflow-x-auto rounded-xl">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white">
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
                            <div class="">{{ prod.productId}}</div>

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
                    <!-- Summary row (PCS) -->
                    <tr class="bg-gray-50 font-bold ">
                        <td class="border p-2 text-center">รวมจำนวน (PCS)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockInPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockOutPcs) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBalPcs) }}</td>
                    </tr>
                    <!-- Summary row (Baht) -->
                    <tr class="bg-gray-100 font-bold">
                        <td class="border p-2 text-center">รวมจำนวนเงิน (บาท)</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStock) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockIn) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockOut) }}</td>
                        <td class="border p-2 text-right">{{ formatNumber(data.summaryStockBal) }}</td>
                    </tr>
                </tbody>
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
