<template>
    <div class="flex justify-start gap-6">
        <div class="p-6">
            <h1 class="text-2xl font-bold">Route Detail: {{ routeCode }}</h1>
            <p>This is the detail page for route <strong>{{ routeCode }}</strong>.</p>
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
            <!-- <progress class="progress w-full"
                :class="percentageUsed >= 90 ? 'progress-error' : percentageUsed >= 70 ? 'progress-warning' : 'progress-success'"
                :value="percentageUsed" max="100"></progress> -->
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
    <div class="overflow-auto max-h-[600px] w-full border rounded-lg shadow mt-4">
        <table class="table table-zebra w-full min-w-[1000px] border-collapse">
            <thead class="bg-primary text-white sticky top-0 z-10">
                <tr>
                    <th class="text-left p-2">Store ID</th>
                    <th class="text-left p-2">Store Name</th>
                    <th class="text-center p-2">Phone</th>
                    <th class="text-center p-2">Summary</th>
                    <th class="text-center p-2">Status</th>
                    <th class="text-center p-2">Google Map</th>
                    <th class="text-center p-2">Datetime</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(store, index) in stores" :key="index">
                    <td class="text-left p-2">{{ store.storeId }}</td>
                    <td class="text-left p-2">{{ store.storeName }}</td>
                    <td class="text-center p-2">{{ store.phone }}</td>
                    <td class="text-center p-2">{{ store.sum }}</td>
                    <td class="text-center p-2" @click="store.status === 'ขายได้' && showDetail(store.orderId)">
                        <span
                            :class="store.status === 'ขายได้' ? 'text-green-600 font-semibold hover:bg-blue-100 cursor-pointer' : 'text-red-500 font-semibold'">
                            {{ store.status }}


                        </span>
                    </td>
                    <td class="text-center p-2">
                        <a :href="store.mapLink" target="_blank" class="text-blue-600 underline">View</a>
                    </td>
                    <td class="text-center p-2">{{ store.datetime }}</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

const stores = [
    {
        storeId: 'VNS2500543',
        storeName: 'Happy Mart',
        sum: 0,
        orderId: 'ORD2500012',
        phone: '081-234-5678',
        status: 'ขายไม่ได้',
        mapLink: 'https://maps.google.com/?q=13.7563,100.5018',
        datetime: '2025-05-22 10:30'
    },
    {
        storeId: 'VNS2500544',
        storeName: 'Fresh & Go',
        sum: 1000,
        orderId: 'ORD2500012',
        phone: '089-876-5432',
        status: 'ขายได้',
        mapLink: 'https://maps.google.com/?q=13.7367,100.5231',
        datetime: '2025-05-22 09:45'
    }
]

function showDetail(orderId) {
    // selectedRoute.value = item
    router.push({ name: 'OrderDetail', params: { orderId: orderId } })
}


const route = useRoute()
const routeCode = route.params.route
</script>