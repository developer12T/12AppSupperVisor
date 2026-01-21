<template>
    <div class="flex justify-between">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    </div>

    <div class="flex justify-start">
        <h2 class="text-2xl font-bold mb-6">ปรับเปิด/ปิด Route</h2>

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


    <!-- 🔔 Empty state : ยังไม่เลือก Area -->
    <div v-if="!selectedArea" class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
            <div class="text-2xl font-semibold text-gray-600 mb-2">
                กรุณาเลือก Area ก่อน
            </div>
            <div class="text-sm text-gray-400">
                เพื่อแสดงข้อมูลการ Lock Route
            </div>
        </div>
    </div>

    <!-- ✅ Grid cards : เมื่อเลือก Area แล้ว -->
    <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        <div @click="goToDetail(item)" v-for="item in cardData" :key="item.id" class="relative rounded-2xl border p-5 shadow-sm transition"
            :class="item.lockRoute ? 'bg-white hover:shadow-md' : 'bg-gray-100'">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="text-xl font-bold">
                        R{{ item.day }}
                    </div>
                    <div class="text-xs text-gray-500">
                        Route Summary
                    </div>
                </div>

                <!-- ✅ Toggle Button -->
                <button type="button" @click="toggleLock(item)"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none"
                    :class="item.lockRoute ? 'bg-green-500' : 'bg-gray-400'">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        :class="item.lockRoute ? 'translate-x-6' : 'translate-x-1'" />
                </button>
            </div>

            <!-- 🔒 Disabled Content Wrapper -->
            <div :class="!item.lockRoute && 'pointer-events-none opacity-50'">
                <!-- Progress -->
                <div class="flex items-center gap-4 mb-4">
                    <div class="relative w-20 h-20">
                        <svg viewBox="0 0 120 120" class="w-full h-full">
                            <circle cx="60" cy="60" r="50" stroke="#eee" stroke-width="10" fill="none" />
                            <circle cx="60" cy="60" r="50" :stroke="getProgressColor(item)" stroke-width="10"
                                fill="none" stroke-linecap="round" :stroke-dasharray="circumference"
                                :stroke-dashoffset="getDashOffset(item)" transform="rotate(-90 60 60)" />
                        </svg>

                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <div class="text-sm font-bold">
                                {{ item.storeTotal }}/{{ item.storeAll }}
                            </div>
                            <div class="text-xs text-gray-400">visited</div>
                        </div>
                    </div>

                    <!-- Percent -->
                    <div>
                        <div class="text-2xl font-bold">
                            {{ Math.round((item.storeTotal / item.storeAll) * 100) }}%
                        </div>
                        <div class="text-xs text-gray-500">Completion</div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-y-2 text-sm">
                    <div class="flex justify-between me-2">
                        <span>ทั้งหมด</span>
                        <span class="font-semibold">{{ item.storeAll }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span> เยี่ยม</span>
                        <span class="font-semibold text-blue-600">{{ item.storeTotal }}</span>
                    </div>
                    <div class="flex justify-between me-2">
                        <span>ซื้อ</span>
                        <span class="font-semibold text-green-600">{{ item.storeSell }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>ไม่ซื้อ</span>
                        <span class="font-semibold text-red-500">{{ item.storeNotSell }}</span>
                    </div>
                    <div class="flex justify-between col-span-2">
                        <span>เช็คอิน</span>
                        <span class="font-semibold text-orange-500">
                            {{ item.storeCheckInNotSell }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Label เมื่อปิด -->
            <div v-if="!item.lockRoute"
                class="absolute inset-x-0 bottom-3 text-center text-xs font-semibold text-gray-500">
                ถูกล็อคไว้
            </div>
        </div>
    </div>
</template>


<script setup>
import LoadingOverlay from '../LoadingOverlay.vue'
import { ref, onMounted, watch, computed } from 'vue'
// import { useStoresStore } from '../../store/modules/store'
import { useRouteStore } from '../../store/modules/route'
import { useRouter, useRoute } from 'vue-router'
import { useFilter } from '../../store/modules/filter'





const router = useRouter()
const route = useRoute()

const filter = useFilter()
const isLoading = ref(false)
const userRole = localStorage.getItem('role')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const zone = localStorage.getItem('zone')
const cardData = ref([]);
const routeStores = useRouteStore()
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";


const radius = 50
const circumference = 2 * Math.PI * radius


onMounted(async () => {
    // isLoading.value = true
    await filter.getZone('cash', period);


    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }
    // await routeStores.getRouteLock(period, '', '', route.params.area)
    // cardData.value = routeStores.routeLocks

    // isLoading.value = false
    // console.log("store.storeAll", store.storeNew)
})


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
        await filter.getTeam('ADMIN', newVal);
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    if (newVal) {
        await routeStores.getRouteLock(period, '', '', newVal)
        cardData.value = routeStores.routeLocks
        // isLoading.value = true
        // isLoading.value = false
    }
});

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

const toggleLock = async (item) => {
    item.lockRoute = !item.lockRoute

    // 🔔 OPTIONAL: sync กับ backend
    try {
        await routeStores.editLockRoute(period, selectedArea.value, item.id, '', 'id', '', item.lockRoute)
        if (routeStores.statusCode === 200) {
            toast('เปลี่ยนสถานะ Route สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
        }
    } catch (err) {
        // rollback ถ้า error
        item.lockRoute = !item.lockRoute
        console.error(err)
    }
}

const goToDetail = (data) => {
    if (!data) {
        console.warn('Missing route params', data)
        return
    }
    const routeData = router.resolve({
        name: 'approveLockRouteDetail',
        params: {
            id: data.id,
        }
    })

    window.open(routeData.href, '_blank')

}


</script>