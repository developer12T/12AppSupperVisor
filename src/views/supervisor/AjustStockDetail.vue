<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 min-h-[400px]">
        <!-- Loading Overlay -->
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <template v-if="!isLoading">
            <template v-if="data">
                <h1 class="text-xl font-bold mb-2">ข้อมูลรายการปรับสต็อก</h1>
                <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div><span class="font-semibold">Order ID:</span> {{ data.orderId }}</div>
                    <div><span class="font-semibold">สถานะ:</span> {{ data.statusTH }}</div>
                    <div><span class="font-semibold">พื้นที่:</span> {{ data.area }}</div>
                    <div><span class="font-semibold">เซลล์โค้ด:</span> {{ data.saleCode }}</div>
                    <div><span class="font-semibold">รอบบัญชี:</span> {{ data.period }}</div>
                    <div><span class="font-semibold">หมายเหตุ:</span> {{ data.note }}</div>
                </div>
                <h2 class="font-bold mt-6 mb-2">รายการสินค้า</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full border border-gray-300 text-sm">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 border">#</th>
                                <th class="p-2 border">รหัสสินค้า</th>
                                <th class="p-2 border">ชื่อสินค้า</th>
                                <th class="p-2 border">จำนวน</th>
                                <th class="p-2 border">หน่วย</th>
                                <th class="p-2 border">จำนวน (PCS)</th>
                                <th class="p-2 border">ราคา/หน่วย</th>
                                <th class="p-2 border">ส่วนลด</th>
                                <th class="p-2 border">ประเภท</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in data.listProduct" :key="item.id"
                                :class="item.action === 'reduce' ? 'bg-red-50' : 'bg-green-50'">
                                <td class="p-2 border text-center">{{ idx + 1 }}</td>
                                <td class="p-2 border">{{ item.id }}</td>
                                <td class="p-2 border">{{ item.name }}</td>
                                <td class="p-2 border text-right">{{ item.qty }}</td>
                                <td class="p-2 border">{{ item.unit }}</td>
                                <td class="p-2 border text-right">{{ item.qtyPcs }}</td>
                                <td class="p-2 border text-right">{{ item.price }}</td>
                                <td class="p-2 border text-right">{{ item.discount }}</td>
                                <td class="p-2 border text-center">
                                    <span :class="item.action === 'reduce' ? 'text-red-500' : 'text-green-600'">
                                        {{ item.action === 'reduce' ? 'ตัดออก' : 'เพิ่มเข้า' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button class="btn btn-error">
                        ไม่อนุมัติ
                    </button>
                    <button class="btn btn-success ">
                        อนุมัติ
                    </button>
                </div>

            </template>
            <template v-else>
                <div class="text-center text-red-500 font-bold mt-10">ไม่พบข้อมูลปรับสต็อก</div>
            </template>
        </template>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามจริง
import { ref, onMounted } from 'vue'
import { useStockStore } from '../../store/modules/stock'

const route = useRoute()
const data = ref(null)
const isLoading = ref(false)
const stockStore = useStockStore()

async function loadData() {
    isLoading.value = true
    data.value = null
    try {
        await stockStore.getAdjustStockDetail('cash', route.params.orderId)
        data.value = stockStore.adjuststockDetail || null
    } catch (err) {
        data.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)
</script>
