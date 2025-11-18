<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="p-4">
        <div class="flex justify-start gap-6 mb-3">
            <h2 class="text-lg font-semibold mb-3">Area Summary Table</h2>
            <select class="w-48 select select-info ms-3 text-center mb-3" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
            </select>
        </div>
        <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)] rounded-box">
            <table class="table border-separate border-spacing-0 min-w-[1800px] border border-black">
                <thead>
                    <tr class="border-b border-gray-200 text-gray-600 uppercase tracking-wide bg-white">
                        <th
                            class="sticky top-0 left-0 z-70 bg-primary text-white text-center p-2 min-w-[120px] border border-black shadow-md">
                            Area</th>
                        <th v-for="col in columns" :key="col"
                            class="sticky top-0 left-0 z-50 bg-primary text-white text-center p-2 min-w-[120px] border border-black shadow-md">
                            {{ col }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in data" :key="row.area" class="hover:bg-gray-50">
                        <td class="sticky left-0 z-30 bg-white text-center p-2 border border-black shadow-md">{{
                            row.area }}</td>
                        <td v-for="col in columns" :key="col" class="text-center p-2 border border-black">
                            {{ row[col] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouteStore } from "../../store/modules/route";
import { useFilter } from '../../store/modules/filter'
import LoadingOverlay from '../LoadingOverlay.vue'

const data = ref([])
const routeStore = useRouteStore()
const loading = ref(false)
const error = ref('')
const filter = useFilter()
const isLoading = ref(false)

// R01 - R25, R, del
const columns = [
    ...Array.from({ length: 25 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`),
    'R', 'del'
]


const selectedZone = ref('')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


watch(selectedZone, async (newVal) => {
    // selectedArea.value = ''
    isLoading.value = true
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: ''
    //     }
    // })
    if (newVal) {
        await routeStore.getRoutesStore(period, newVal)
        data.value = routeStore.routesStore
    }
    isLoading.value = false
})

const fetchData = async () => {
    isLoading.value = true
    error.value = ''
    try {
        await filter.getZone('cash',period)
        // await routeStore.getRoutesStore(period, 'BE')
        // data.value = routeStore.routesStore
    } catch (err) {
        error.value = err.message || 'API error'
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchData)
</script>

<style scoped>
table {
    border: 1px solid #ddd;
}

th,
td {
    text-align: center;
    min-width: 40px;
}
</style>
