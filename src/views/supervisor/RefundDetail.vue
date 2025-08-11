<template>
    <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 min-h-[400px]">
        <!-- Loading Overlay -->
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <template v-if="!isLoading">
            <template v-if="data">
                <h1 class="text-xl font-bold mb-2">ข้อมูลรายการปรับสต็อก</h1>
                <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div><span class="font-semibold">Order ID:</span> {{ data.orderId }}</div>
                    <div><span class="font-semibold">สถานะ:</span> <span
                            class="inline-block rounded px-3 py-1 text-xs font-bold" :class="{
                                'bg-yellow-100 text-yellow-700': data.status === 'pending',
                                'bg-green-100 text-green-700': data.status === 'completed',
                                'bg-red-100 text-red-700': data.status === 'rejected' || data.status === 'canceled'
                            }">
                            {{ data.status }}
                        </span></div>
                    <div><span class="font-semibold">พื้นที่:</span> {{ data.store.area }}</div>
                    <div><span class="font-semibold">เซลล์โค้ด:</span> {{ data.sale.saleCode }}</div>
                    <div><span class="font-semibold">รหัสร้าน:</span> {{ data.store.storeId }}</div>
                    <div><span class="font-semibold">หมายเหตุ:</span> {{ data.note }}</div>
                </div>
                <h2 class="font-bold mt-6 mb-2">รายการสินค้าขอเปลี่ยน</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full border border-gray-300 text-sm">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 border">No</th>
                                <th class="p-2 border">รหัสสินค้า</th>
                                <th class="p-2 border">ชื่อสินค้า</th>
                                <th class="p-2 border">จำนวน</th>
                                <th class="p-2 border">หน่วย</th>
                                <th class="p-2 border">ราคา/หน่วย</th>


                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in data.listProductChange" :key="item.id">
                                <td class="p-2 border text-center">{{ idx + 1 }}</td>
                                <td class="p-2 border">{{ item.id }}</td>
                                <td class="p-2 border">{{ item.name }}</td>
                                <td class="p-2 border text-right">{{ item.qty }}</td>
                                <td class="p-2 border">{{ item.unit }}</td>
                                <td class="p-2 border text-right">{{ item.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2 class="font-bold mt-6 mb-2">รายการสินค้าขอคืน</h2>
                <div class="overflow-x-auto mt-4">
                    <table class="min-w-full border border-gray-300 text-sm">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-2 border">No</th>
                                <th class="p-2 border">รหัสสินค้า</th>
                                <th class="p-2 border">ชื่อสินค้า</th>
                                <th class="p-2 border">จำนวน</th>
                                <th class="p-2 border">หน่วย</th>
                                <th class="p-2 border">ประเภท</th>
                                <th class="p-2 border">ราคา/หน่วย</th>


                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in data.listProductRefund" :key="item.id"
                                :class="item.condition === 'damaged' ? 'bg-red-50' : 'bg-green-50'">
                                <td class="p-2 border text-center">{{ idx + 1 }}</td>
                                <td class="p-2 border">{{ item.id }}</td>
                                <td class="p-2 border">{{ item.name }}</td>
                                <td class="p-2 border text-right">{{ item.qty }}</td>
                                <td class="p-2 border">{{ item.unit }}</td>
                                <td class="p-2 border text-right">{{ item.condition === 'damaged' ? 'คืนเสีย' : 'คืนดี'
                                    }}</td>
                                <td class="p-2 border text-right">{{ item.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="grid md:grid-cols-4 gap-5 bg-gray-50 rounded-xl p-4 shadow-inner mt-4">
                    <Info label="ยอดเปลี่ยน (บาท)" :value="formatNumber(data.totalChange)" highlight />
                    <Info label="Vat (บาท)" :value="formatNumber(data.totalChangeExVat)" />
                    <Info label="รวม (บาท)" :value="formatNumber(data.totalChangeVat)" />
                    <Info label="ผลต่าง (บาท)" :value="formatNumber(data.totalDiff)" highlight />
                    <Info label="ยอดรับคืน (บาท)" :value="formatNumber(data.totalRefund)" />
                    <Info label="Vat (บาท)" :value="formatNumber(data.totalRefundExVat)" />
                    <Info label="รวม (บาท)" :value="formatNumber(data.totalRefundVat)" />

                </div>
                <div v-if="data.status == 'pending'" class="flex justify-end gap-2 mt-4">
                    <button class="btn btn-error" @click="approve('reject')">
                        ไม่อนุมัติ
                    </button>
                    <button class="btn btn-success " @click="approve('approved')">
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
import { useRefundStock } from '../../store/modules/refund'
import Info from '../../views/Info.vue'

const route = useRoute()
const data = ref(null)
const isLoading = ref(false)
const refundStore = useRefundStock()

async function approve(status) {
    try {
        isLoading.value = true
        await refundStore.approveRefund('cash', route.params.orderId, status)
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
        await refundStore.getRefundDetail('cash', route.params.orderId)
        data.value = refundStore.refundDetail || null
    } catch (err) {
        data.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)
</script>
