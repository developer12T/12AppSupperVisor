<template>
    <div class="flex justify-start gap-6">
        <div class="p-6">
            <h1 class="text-2xl font-bold">Route Detail: {{ routeCode }} </h1>
            <p>This is the detail page for route <strong>{{ routeCode }}</strong>.</p>
        </div>
        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-sm">
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg"> Visit</h2>
                <div v-if="isLoading" class="skeleton h-8 w-24 rounded"></div>
                <span v-else :class="[
                    routeStore.visit <= 90 ? 'text-red-500' :
                        routeStore.visit <= 70 ? 'text-yellow-500' :
                            'text-green-600',
                    'font-semibold'
                ]">
                    {{ routeStore.visit }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreAll }}</span>
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

            <!-- <progress class="progress w-full"
                :class="percentageUsed >= 90 ? 'progress-error' : percentageUsed >= 70 ? 'progress-warning' : 'progress-success'"
                :value="percentageUsed" max="100"></progress> -->
        </div>

        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-sm">
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg"> Effective</h2>
                <div v-if="isLoading" class="skeleton h-8 w-24 rounded"></div>
                <span v-else :class="[
                    routeStore.effective <= 80 ? 'text-red-500' :
                        routeStore.effective > 80 ? 'text-green-600' :
                            'text-yellow-600',
                    'font-semibold'
                ]">
                    {{ routeStore.effective }}%
                </span>
            </div>
            <div class="text-sm text-gray-500 mb-1 flex justify-between">
                ร้านทั้งหมด:
                <span v-if="isLoading" class="skeleton h-8 w-24 rounded"></span>
                <span v-else class="text-gray-700 font-medium">{{ routeStore.totalStoreAll }}</span>
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

            <!-- <progress class="progress w-full"
                :class="percentageUsed >= 90 ? 'progress-error' : percentageUsed >= 70 ? 'progress-warning' : 'progress-success'"
                :value="percentageUsed" max="100"></progress> -->
        </div>
    </div>
    <div class="overflow-auto max-h-[600px] w-full border rounded-lg shadow mt-4">
        <table class="table table-zebra w-full min-w-[1000px] border-collapse">
            <thead class="bg-primary text-white sticky top-0 z-10">
                <tr>
                    <th class="text-left p-2">Store ID</th>
                    <th class="text-left p-2">Store Name</th>
                    <th class="text-center p-2">Phone</th>
                    <th class="text-right p-2">Summary</th>
                    <th class="text-center p-2">Status</th>
                    <th class="text-center p-2">Google Map</th>
                    <th class="text-center p-2">Image</th>
                    <th class="text-center p-2">Datetime</th>
                </tr>
            </thead>
            <tbody>
                <!-- Skeleton loading -->
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

                    </tr>
                </template>

                <!-- Actual data -->
                <template v-else>
                    <tr v-for="(store, index) in routeStore.routes" :key="index">
                        <td class="text-left p-2">{{ store.storeId }}</td>
                        <td class="text-left p-2">{{ store.storeName }}</td>
                        <td class="text-center p-2">{{ store.phone }}</td>
                        <td class="text-right p-2">{{ formatCurrency(store.sum) }}</td>
                        <td class="text-center p-2" @click="store.status === 'ซื้อ' && showDetail(store.orderId)">
                            <span
                                :class="store.status === 'ซื้อ' ? 'text-green-600 font-semibold hover:bg-blue-100 cursor-pointer' : store.status === 'รอเยี่ยม' ? 'text-yellow-500 font-semibold' : 'text-red-500 font-semibold'">
                                {{ store.status }}
                            </span>
                        </td>
                        <td class="text-center p-2">
                            <a :href="store.mapLink" target="_blank" class="text-blue-600 underline">View</a>
                        </td>
                        <td v-if="store.imageLink" class="text-center p-2">
                            <a :href="store.imageLink" target="_blank" rel="noopener noreferrer"
                                class="text-blue-600 underline">
                                ดูภาพ
                            </a>
                        </td>
                        <td v-else class="text-center p-2 text-gray-400">
                            ไม่มีภาพ
                        </td>
                        <td class="text-center p-2">{{ store.datetime }}</td>
                    </tr>
                </template>
            </tbody>

        </table>
    </div>

</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useRouteStore } from '../../store/modules/route'

const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()

// Use computed to always get fresh route params
const routeId = computed(() => route.params.routeId)
const routeCode = computed(() => route.params.route)

// Safely extract parts of routeId
const area = computed(() => routeId.value.slice(6, 11))
const period = computed(() => routeId.value.slice(0, 6))
const day = computed(() => routeId.value.slice(12, 14))

onMounted(async () => {
    isLoading.value = true
    await routeStore.getRoutes(routeId.value)
    await routeStore.getRouteEffective(area.value, period.value, day.value, '')
    await new Promise(resolve => setTimeout(resolve, 2000))
    isLoading.value = false
})

function showDetail(orderId) {
    router.push({ name: 'OrderDetail', params: { orderId } })
}

function formatCurrency(value) {
    if (typeof value !== 'number') return value
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(value)
}
</script>
