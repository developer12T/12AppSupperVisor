<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <h2 class="text-2xl font-bold mb-6">ใบขออนุมัติการปรับสต็อก</h2>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div v-for="item in cardData" :key="item.orderId"
                class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
                <router-link :to="`/supervisor/adjuststock/${item.orderId}`">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg text-gray-700">เลขใบขออนุมัติ</span>
                        <span class="text-sm text-gray-500">{{ item.orderId }}</span>
                    </div>
                    <div class="text-sm text-gray-500">พื้นที่: <span class="font-semibold">{{ item.area }}</span></div>
                    <div class="text-sm text-gray-500">ประเภท: <span class="font-semibold">{{ item.orderTypeName
                    }}</span>
                    </div>
                    <div class="text-sm text-gray-500">วันที่ส่ง: <span class="font-semibold">{{
                        formatDate(item.createdAt)
                            }}</span></div>
                    <div class="text-sm text-gray-500">จำนวนทั้งหมด: <span class="font-semibold">{{ item.total }}</span>
                    </div>
                    <div class="flex justify-end">
                        <span class="inline-block rounded px-3 py-1 text-xs font-bold" :class="{
                            'bg-yellow-100 text-yellow-700': item.status === 'pending',
                            'bg-green-100 text-green-700': item.status === 'sent',
                            'bg-red-100 text-red-700': item.status === 'failed'
                        }">
                            {{ item.status }}
                        </span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted } from 'vue'
import { useStockStore } from '../../store/modules/stock'

const cardData = ref([]);
const isLoading = ref(false);

const stockStore = useStockStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


onMounted(async () => {
    isLoading.value = true
    await stockStore.getAdjustStock('cash', '', '', '', period)
    cardData.value = stockStore.adjuststock
    isLoading.value = false
})


function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}

</script>