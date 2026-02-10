<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="">
        <div class="flex justify-start">
            <h2 class="text-xl font-bold mb-4">Area Summary</h2>
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
        </div>
        <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)] rounded-box">
            <table class="table border-separate border-spacing-0 min-w-[500px] border border-black">
                <thead class="bg-gray-100">
                    <tr>
                        <th
                            class="border border-black px-3 py-2 text-left sticky top-0 left-0 z-50 bg-primary text-white">
                            Area</th>
                        <th v-for="r in rangeKeys" :key="r"
                            class="border border-black px-3 py-2 text-left sticky top-0 left-0 z-50 bg-primary text-white">
                            {{ r }}</th>
                        <th
                            class=" border border-black px-3 py-2 text-left sticky top-0 left-0 z-50 bg-primary text-white">
                            SUM</th>
                        <th
                            class=" border border-black px-3 py-2 text-left sticky top-0 left-0 z-50 bg-primary text-white">
                            R</th>
                        <th
                            class="border border-black px-3 py-2 text-left sticky top-0 left-0 z-50 bg-primary text-white">
                            del</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.area" class="hover:bg-gray-50">
                        <td class="border border-black px-3 py-2 font-semibold">{{ item.area }}</td>
                        <td v-for="r in rangeKeys" :key="r" class="border border-black px-3 py-2 text-center">{{ item[r]
                            ?? '-' }}</td>
                        <td class="border border-black px-3 py-2 text-center font-bold bg-yellow-100">
                            {{ calcSum(item) }}
                        </td>

                        <td class="border border-black px-3 py-2 text-center font-bold">{{ item.R }}</td>
                        <td class="border border-black px-3 py-2 text-center">{{ item.del }}</td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-200 font-bold">
                    <tr>
                        <td class="border border-black px-3 py-2 text-center sticky left-0 bg-gray-300">
                            รวม
                        </td>

                        <td v-for="r in rangeKeys" :key="r" class="border border-black px-3 py-2 text-center">
                            {{ columnSums[r] || 0 }}
                        </td>

                        <td class="border border-black px-3 py-2 text-center bg-yellow-200">
                            {{ grandTotal }}
                        </td>

                        <td class="border border-black px-3 py-2 text-center">-</td>
                        <td class="border border-black px-3 py-2 text-center">-</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouteStore } from '../../store/modules/route';
import LoadingOverlay from '../LoadingOverlay.vue'
import { useFilter } from '../../store/modules/filter'


const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const data = ref([]);
const isLoading = ref(false)
const routeStore = useRouteStore()
const filter = useFilter()

const selectedZone = ref('')
const selectedArea = ref('')
const selectedTeam = ref('')

const calcSum = (item: any) => {
    return rangeKeys.value.reduce((sum, key) => {
        const val = Number(item[key])
        return sum + (isNaN(val) ? 0 : val)
    }, 0)
}

const columnSums = computed(() => {
    const result: Record<string, number> = {}

    rangeKeys.value.forEach(key => {
        result[key] = data.value.reduce((sum, item: any) => {
            const val = Number(item[key])
            return sum + (isNaN(val) ? 0 : val)
        }, 0)
    })

    return result
})

const grandTotal = computed(() => {
    return Object.values(columnSums.value).reduce((a, b) => a + b, 0)
})

onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash', period);
    await routeStore.getStoreInRoute(period, '', '')
    data.value = routeStore.routeInStore
    isLoading.value = false
})

const rangeKeys = computed(() =>
    Array.from({ length: 25 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`)
)

watch(selectedZone, async (newVal) => {
    if (newVal) {
        isLoading.value = true
        await filter.getTeam('cash', newVal);
        await routeStore.getStoreInRoute(period, newVal, selectedTeam.value)
        data.value = routeStore.routeInStore
        isLoading.value = false
    }
});

watch(selectedTeam, async (newVal) => {
    if (newVal) {
        isLoading.value = true
        await routeStore.getStoreInRoute(period, selectedZone.value, newVal)
        data.value = routeStore.routeInStore
        isLoading.value = false
    }
});
</script>

<style scoped>
th,
td {
    border-bottom: 1px solid #e5e7eb;
}
</style>
