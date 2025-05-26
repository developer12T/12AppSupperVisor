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
                <h2 class="font-bold text-lg">{{ title }} Visit</h2>
                <span :class="[
                    percentageUsed >= 90 ? 'text-red-500' :
                        percentageUsed >= 70 ? 'text-yellow-500' :
                            'text-green-600',
                    'font-semibold'
                ]">
                    {{ percentageUsed }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                เยี่ยมแล้ว: <span class="text-gray-700 font-medium">{{ used | currency }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                รอเยี่ยม: <span class="text-gray-700 font-medium">{{ used | currency }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด: <span class="text-gray-700 font-medium">{{ total | currency }}</span>
            </div>
        </div>

        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-sm">
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg">{{ title }} Effective</h2>
                <span :class="[
                    percentageUsed >= 90 ? 'text-red-500' :
                        percentageUsed >= 70 ? 'text-yellow-500' :
                            'text-green-600',
                    'font-semibold'
                ]">
                    {{ percentageUsed }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ขายได้: <span class="text-gray-700 font-medium">{{ used | currency }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ขายไม่ได้: <span class="text-gray-700 font-medium">{{ used | currency }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด: <span class="text-gray-700 font-medium">{{ total | currency }}</span>
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
                    <th class="text-left p-2">Route</th>
                    <th class="text-center p-2">Count (CTN)</th>
                    <th class="text-center p-2">Visit (%)</th>
                    <th class="text-center p-2">Effective (%)</th>
                    <th class="text-center p-2">Summary</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in routeStore.checkIn" :key="index"
                    class="text-left p-2 hover:bg-blue-100 cursor-pointer" @click="showDetail(item, item.route)">
                    <td>{{ item.route }}</td>
                    <td class="text-center p-2">
                        {{ item.count }}
                    </td>
                    <td class="text-center p-2">
                        {{ item.visit }}
                    </td>
                    <td class="text-center p-2">
                        {{ item.effective }}
                    </td>
                    <td class="text-center p-2">
                        {{ item.summary }}
                    </td>
                </tr>

            </tbody>
        </table>

        <!-- Detail Section -->
        <div v-if="selectedRoute" class="mt-4 p-4 bg-base-200 rounded-lg">
            <h2 class="text-lg font-bold">Detail for {{ selectedRoute.route }}</h2>
            <p><strong>Count:</strong> {{ selectedRoute.count }} CTN</p>
            <p><strong>Visit:</strong> {{ selectedRoute.visit }}</p>
            <p><strong>Effective:</strong> {{ selectedRoute.effective }}</p>
            <p><strong>Summary:</strong> {{ selectedRoute.summary }}</p>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');
const router = useRouter()
const routeStore = useRouteStore()
const filter = useFilter()
const routes = ref([])
const checkins = ref([])
const selectedZone = ref('')
const selectedArea = ref('')

// const checkins = [
//     { route: 'R01', count: 12, visit: '10%', effective: '10%', summary: 100 },
//     { route: 'R02', count: 8, visit: '10%', effective: '10%', summary: 100 },
//     { route: 'R03', count: 5, visit: '10%', effective: '10%', summary: 100 },

// ]

const selectedRoute = ref(null)

function showDetail(item, routeCode) {
    selectedRoute.value = item
    router.push({ name: 'RouteDetail', params: { route: routeCode } })
}

onMounted(async () => {
    await filter.getZone(period);
    selectedZone.value = ''
    selectedArea.value = ''
    checkins = [];
})

watch(selectedZone, (newVal) => {
    if (newVal) {
        filter.getArea(period, newVal);


    }
});

watch(selectedArea, (newVal) => {
    if (newVal) {
        routeStore.getCheckin(period, newVal);

    }
});



</script>
