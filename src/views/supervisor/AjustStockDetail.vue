<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 min-h-[400px]">
        <!-- Loading Overlay -->
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <template v-if="!isLoading">
            <template v-if="data">
                <h1 class="text-xl font-bold mb-2">ข้อมูลรายการปรับสต็อก</h1>
                <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div><span class="font-semibold">Withdraw ID:</span> {{ data.withdrawId }}</div>
                    <div><span class="font-semibold">Order ID:</span> {{ data.orderId }}</div>
                    <div><span class="font-semibold">สถานะ:</span> <span
                            class="inline-block rounded px-3 py-1 text-xs font-bold" :class="{
                                'bg-yellow-100 text-yellow-700': data.status === 'pending',
                                'bg-green-100 text-green-700': data.status === 'approved',
                                'bg-red-100 text-red-700': data.status === 'rejected'
                            }">
                            {{ data.statusTH }}
                        </span></div>
                    <div><span class="font-semibold">พื้นที่:</span> {{ data.area }}</div>
                    <div><span class="font-semibold">เซลล์โค้ด:</span> {{ data.saleCode }}</div>
                    <div><span class="font-semibold">รอบบัญชี:</span> {{ data.period }}</div>
                    <div><span class="font-semibold">หมายเหตุ:</span> {{ data.note }}</div>
                </div>

                <h2 class="font-bold mt-6 mb-2">รายการสินค้าที่ปรับออก</h2>
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
                                :class="item.action === 'OUT' ? 'bg-red-50' : 'bg-green-50'">
                                <td class="p-2 border text-center">{{ idx + 1 }}</td>
                                <td class="p-2 border">{{ item.id }}</td>
                                <td class="p-2 border">{{ item.name }}</td>
                                <td class="p-2 border text-right">{{ item.qty }}</td>
                                <td class="p-2 border">{{ item.unit }}</td>
                                <td class="p-2 border text-right">{{ item.qtyPcs }}</td>
                                <td class="p-2 border text-right">{{ item.price }}</td>
                                <td class="p-2 border text-right">{{ item.discount }}</td>
                                <td class="p-2 border text-center">
                                    <span :class="item.action === 'OUT' ? 'text-red-500' : 'text-green-600'">
                                        {{ item.action === 'OUT' ? 'ตัดออก' : 'เพิ่มเข้า' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="data.status == 'pending'" class="flex justify-end gap-2 mt-4">
                    <button class="btn btn-error" @click="approve(false)">
                        ไม่อนุมัติ
                    </button>
                    <button class="btn btn-success " @click="approve(true)">
                        อนุมัติ
                    </button>
                </div>
                <h2 class="font-bold mt-6 mb-2">รายการสินค้าใบเบิก {{ data.withdrawId }}</h2>
                <div class="overflow-x-auto rounded-lg border border-gray-100 shadow">
                    <table class="min-w-full text-sm align-middle">
                        <thead class="sticky top-0 bg-gray-50">
                            <tr>
                                <th class="p-2 text-left">No</th>
                                <th class="p-2 text-left">สินค้า</th>
                                <th class="p-2 text-right">จำนวน</th>
                                <th class="p-2 text-left">หน่วย</th>
                                <th class="p-2 text-right">จำนวน (Pcs)</th>
                                <th class="p-2 text-right">ราคา/หน่วย</th>
                                <th class="p-2 text-right">รวม</th>
                                <th class="p-2 text-right">น้ำหนักรวม</th>
                                <th class="p-2 text-right">น้ำหนักสุทธิ</th>
                                <th class="p-2 text-right">รับจริง</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in dataWithdraw.listProduct ?? []" :key="item._id ?? idx"
                                class="hover:bg-blue-50">
                                <td class="border-t p-2">{{ idx + 1 }}</td>
                                <td class="border-t p-2">{{ item.name ?? '-' }}</td>
                                <td class="border-t p-2 text-right">{{ item.qty ?? 0 }}</td>
                                <td class="border-t p-2">{{ item.unit }}</td>
                                <td class="border-t p-2 text-right">{{ item.qtyPcs ?? 0 }}</td>
                                <td class="border-t p-2 text-right">{{ formatNumber(item.price) }}</td>
                                <td class="border-t p-2 text-right">{{ formatNumber(item.total) }}</td>
                                <td class="border-t p-2 text-right">{{ item.weightGross ?? 0 }}</td>
                                <td class="border-t p-2 text-right">{{ item.weightNet ?? 0 }}</td>
                                <td class="border-t p-2 text-right">{{ item.receiveQty ?? 0 }}</td>
                            </tr>
                            <tr v-if="!data.listProduct || data.listProduct.length === 0">
                                <td class="border-t p-2 text-center text-gray-400" colspan="14">ไม่มีสินค้า</td>
                            </tr>
                        </tbody>
                    </table>
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
import { useWithdrawStore } from '../../store/modules/withdraw'


const route = useRoute()
const data = ref(null)
const dataWithdraw = ref(null)
const isLoading = ref(false)
const stockStore = useStockStore()
const withdrawStore = useWithdrawStore()

async function approve(status) {
    try {
        isLoading.value = true
        await stockStore.approveAdjustStock('cash', route.params.orderId, status)
        window.location.reload()
        isLoading.value = false
    } catch (error) {
        console.log(error)
    }

}

function formatNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '-'
    return Number(val).toLocaleString()
}

async function loadData() {
    isLoading.value = true
    data.value = null
    try {
        await stockStore.getAdjustStockDetail('cash', route.params.orderId)
        data.value = stockStore.adjuststockDetail || null
        console.log(data.value.withdrawId)
        await withdrawStore.getWithdrawDetail('cash', data.value.withdrawId)
        dataWithdraw.value = withdrawStore.withdrawDetail

    } catch (err) {
        data.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)
</script>
