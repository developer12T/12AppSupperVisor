<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">อนุมัติปรับสต๊อก</h2>
            <div class="ms-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                    </option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
        </div>
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
                            'bg-green-100 text-green-700': item.status === 'approved',
                            'bg-red-100 text-red-700': item.status === 'rejected'
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
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useStockStore } from '../../store/modules/stock'
import { useFilter } from '../../store/modules/filter'

const cardData = ref([]);
const isLoading = ref(false);
const route = useRoute()
const filter = useFilter()
const userRole = localStorage.getItem('role')

const stockStore = useStockStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const zone = localStorage.getItem('zone')

onMounted(async () => {
    isLoading.value = true
    await filter.getZone(period);
    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }
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

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = ''
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, newVal, selectedTeam.value);
        await filter.getTeam(newVal);
        await stockStore.getAdjustStock('cash', newVal, selectedTeam.value, selectedArea.value, period)
        cardData.value = stockStore.adjuststock
        isLoading.value = false
    }
});

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, selectedZone.value, newVal);
        await stockStore.getAdjustStock('cash', selectedZone.value, newVal, selectedArea.value, period)
        cardData.value = stockStore.adjuststock
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    if (newVal) {
        isLoading.value = true
        await stockStore.getAdjustStock('cash', selectedZone.value, selectedTeam.value, newVal, period)
        cardData.value = stockStore.adjuststock
        isLoading.value = false
    }
});

</script>