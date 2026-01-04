<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <div class="flex justify-between">
            <h2 class="text-2xl font-bold mb-6">อนุมัติการปรับรูท</h2>
            <h2 class="text-2xl font-bold mb-6"> Period : {{ period }} -> {{ periodnext }}</h2>

        </div>

        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
            <div v-for="item in cardData" :key="item.id"
                class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
                <router-link :to="`/areamanager/changeroute/detail/${item.id}`">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-bold text-lg text-gray-700">
                            R{{ item.day }}
                        </span>

                        <!-- 🔴 Circular Progress -->
                        <div class="relative w-16 h-16">
                            <svg viewBox="0 0 120 120" class="w-full h-full">
                                <!-- background -->
                                <circle cx="60" cy="60" r="50" stroke="#eee" stroke-width="10" fill="none" />
                                <!-- progress -->
                                <circle cx="60" cy="60" r="50" :stroke="getProgressColor(item)" stroke-width="10"
                                    fill="none" stroke-linecap="round" :stroke-dasharray="circumference"
                                    :stroke-dashoffset="getDashOffset(item)" transform="rotate(-90 60 60)" />
                            </svg>

                            <!-- center text -->
                            <div class="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                {{ item.storeTotal }}/{{ item.storeAll }}
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">
                            ทั้งหมด:
                        </div>
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold">{{ item.storeAll }}</span>

                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">
                            เยี่ยม:
                        </div>
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold">{{ item.storeTotal }}</span>

                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">
                            ซื้อ:
                        </div>
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold">{{ item.storeSell }}</span>

                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">
                            ไม่ซื้อ:
                        </div>
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold">{{ item.storeNotSell }}</span>

                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">
                            เช็คอิน:
                        </div>
                        <div class="text-sm text-gray-500">
                            <span class="font-semibold">{{ item.storeCheckInNotSell }}</span>

                        </div>
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
import { useFilter } from '../../store/modules/filter'
import { useRouteStore } from '../../store/modules/route'
import { Icon } from '@iconify/vue'

const filter = useFilter()
const userRole = localStorage.getItem('role')
const warehouse = localStorage.getItem('warehouse')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const selectedMonth = ref('') // format: YYYY-MM

const radius = 50
const circumference = 2 * Math.PI * radius

const month = computed(() => selectedMonth.value.split('-')[1])
const year = computed(() => selectedMonth.value.split('-')[0])
const getSafe = v => (typeof v === 'string' ? v : '');

const cardData = ref([]);
const routeStores = useRouteStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
const periodnext = nextMonth.getFullYear().toString() + String(nextMonth.getMonth() + 1).padStart(2, '0');

const showSyncAddress = ref('')
const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const zone = localStorage.getItem('zone')
const area = localStorage.getItem('area')
const channel = localStorage.getItem('channel')
const platformType = localStorage.getItem('platformType')

function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    window.location.assign('/supervisor/withdraw')
}


const getDashOffset = (item) => {
    const total = Number(item.storeAll) || 0
    const visited = Number(item.storeTotal) || 0
    if (total === 0) return circumference
    const percent = visited / total
    return circumference * (1 - percent)
}

const getPercent = (item) => {
    const total = Number(item.storeAll) || 0
    const visited = Number(item.storeTotal) || 0
    if (total === 0) return 0
    return (visited / total) * 100
}

const getProgressColor = (item) => {
    const p = getPercent(item)
    if (p < 40) return '#ef4444' // red-500
    if (p < 70) return '#f59e0b' // amber-500
    return '#22c55e'             // green-500
}


onMounted(async () => {

    isLoading.value = true
    await routeStores.getRouteChangeSale(period, '', '', route.params.area)
    cardData.value = routeStores.routeChanges

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
