<template>
    <div class="flex justify-start gap-6 mb-3">
        <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
            <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
            </select>
            <select class="select select-info ms-3 text-center" v-model="selectedArea">
                <option disabled value="">Select Area</option>
                <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
            </select>
        </div>
        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-sm">
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg">Visit</h2>
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else :class="[
                    routeStore.visit <= 80 ? 'text-red-500' :
                        routeStore.visit <= 50 ? 'text-yellow-500' :
                            'text-green-600',
                    'font-semibold'
                ]">
                    {{ Number(routeStore.visit || 0).toFixed(2) }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                เยี่ยมแล้ว:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreCheckInNotSell }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                รอเยี่ยม:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStorePending }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreAll }}</span>
            </div>
        </div>

        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-sm">
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg">Effective</h2>
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else :class="[
                    routeStore.effective <= 80 ? 'text-red-500' :
                        routeStore.effective <= 50 ? 'text-yellow-500' :
                            'text-green-600',
                    'font-semibold'
                ]">
                    {{ Number(routeStore.effective || 0).toFixed(2) }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ซื้อ:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreSell }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ไม่ซื้อ:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreNotSell }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreAll }}</span>
            </div>

            <!-- <progress class="progress w-full"
                :class="percentageUsed >= 90 ? 'progress-error' : percentageUsed >= 70 ? 'progress-warning' : 'progress-success'"
                :value="percentageUsed" max="100"></progress> -->
        </div>
    </div>
    <div class="overflow-auto max-h-[600px] w-full border rounded-lg shadow">
        <table class="table w-full min-w-[800px] border-collapse">
            <thead class="bg-primary text-white sticky top-0 z-10">
                <tr>
                    <th class="text-left p-2 ">Route</th>
                    <th class="text-center p-2 ">รอเยี่ยม</th>
                    <th class="text-center p-2 ">ซื้อ</th>
                    <th class="text-center p-2 ">ไม่ซื้อ</th>
                    <th class="text-center p-2 ">เยี่ยมแล้ว</th>
                    <th class="text-center p-2 ">Count (CTN)</th>
                    <th class="text-center p-2 ">Visit (%)</th>
                    <th class="text-center p-2 ">Effective (%)</th>
                    <th class="text-center p-2 ">จำนวนทั้งหมด</th>
                    <th class="text-center p-2 ">ร้านทั้งหมด</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="isLoading">
                    <tr v-for="n in 5" :key="'skeleton-' + n">
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                        <td>
                            <div class="h-4 bg-gray-300 rounded "></div>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="(item, index) in routeStore.checkIn" :key="index"
                        class="hover:bg-blue-100 cursor-pointer border-black"
                        @click="showDetail(item, item.route, item.routeId)">
                        <td class="p-2 border-r border-black">{{ item.route }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storePending }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeSell }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeNotSell }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeCheckInNotSell }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.totalqty }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.percentVisit }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.percentEffective }}</td>
                        <td class="text-center p-2  border-r border-black">{{ item.summary }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeAll }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');
const router = useRouter()
const route = useRoute()
const routeStore = useRouteStore()
const filter = useFilter()
const isLoading = ref(false);
const selectedRoute = ref(null)



const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
function showDetail(item, routeCode, routeId) {
    selectedRoute.value = item
    router.push({ name: 'RouteDetail', params: { route: routeCode, routeId: routeId } })
}

onMounted(async () => {
    isLoading.value = true;
    await filter.getZone(period);
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value);
    }
    if (selectedArea.value) {
        await routeStore.getCheckin(period, selectedArea.value);
    }
    await routeStore.getRouteEffective(selectedArea.value, period, '', selectedZone.value);
    await new Promise(resolve => setTimeout(resolve, 2000))
    isLoading.value = false;
})

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    router.replace({
        query: {
            ...route.query,
            zone: newVal,
            area: '' // clear old area
        }
    });
    if (newVal) {
        filter.getArea(period, newVal);
    }
});

watch(selectedArea, async (newVal) => {
    router.replace({
        query: {
            ...route.query,
            area: newVal
        }
    });
    if (newVal) {
        isLoading.value = true;
        await filter.getZone(period);
        if (selectedZone.value) {
            await filter.getArea(period, selectedZone.value);
        }
        if (selectedArea.value) {
            await routeStore.getCheckin(period, selectedArea.value);
        }
        await routeStore.getRouteEffective(selectedArea.value, period, '', selectedZone.value);
        await routeStore.getCheckin(period, newVal);
        await new Promise(resolve => setTimeout(resolve, 2000))
        isLoading.value = false;
    }
});

</script>
