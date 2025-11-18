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
        <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">

            <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                <option disabled value="">Select Team</option>
                <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                </option>
            </select>
            <button class="btn btn-primary ms-3 mt-3 text-center" @click="clearFilter">ล้างตัวเลือก</button>
        </div>
        <router-link :to="selectedArea ? `/supervisor/polylineroute2/${selectedArea}` : ''" custom
            v-slot="{ navigate, href }">
            <div :class="[
                'bg-base-100 shadow-md rounded-xl p-6 flex justify-center flex-col items-center w-48',
                !selectedArea && 'opacity-60 pointer-events-none cursor-not-allowed'
            ]" :style="!selectedArea ? 'filter: grayscale(80%)' : ''" @click="selectedArea && navigate()">
                <Icon icon="mdi:map-marker-distance" class="h-20 w-20" color="red" />
                <h2>ดู Line การเช็คอิน</h2>
                <p class="text-sm text-gray-500">(เลือกเขตก่อน)</p>
            </div>
        </router-link>

        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-xs">
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

        </div>

        <div class="card bg-base-100 shadow-xl p-4 w-full max-w-xs">
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
    <div  class="w-full text-right">
  <button class="btn btn-success text-white mb-3" @click="exportExcel()">
    Export Excel
  </button>
</div>
    


    <div class="overflow-auto max-h-[600px] w-full border rounded-lg shadow">
        <table class="table w-full min-w-[800px] border-collapse">
            <thead class="bg-primary text-white sticky top-0 z-10">
                <tr>
                    <th class="text-left p-2 ">Route</th>
                    <th class="text-center p-2 ">ร้านทั้งหมด</th>
                    <th class="text-center p-2 ">เยี่ยมแล้ว</th>
                    <th class="text-center p-2 ">ซื้อ</th>
                    <th class="text-center p-2 ">ไม่ซื้อ</th>
                    <th class="text-center p-2 ">รอเยี่ยม</th>
                    <th class="text-center p-2 ">ยอดขายรวม</th>
                    <th class="text-center p-2 ">ยอดหีบ (CTN)</th>
                    <th class="text-center p-2 ">เปอร์เซ็นต์การเข้าเยี่ยม</th>
                    <th class="text-center p-2 ">เปอร์เซ็นต์การขายได้</th>

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
                    <tr v-for="(item, index) in routeStore.total" :key="index"
                        class="hover:bg-blue-100 cursor-pointer border-black"
                        @click="showDetail(item, item.area, item.routeId)">
                        <td class="p-2 border-r border-black">{{ item.area }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeAll }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeTotal }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeSell }}</td>
                        <td class="text-center p-2 border-r border-black">{{ 
                            item.storeNotSell + item.storeCheckInNotSell
                            }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.storeAll - item.storeTotal  }}</td>
                        <td class="text-right p-2  border-r border-black">{{ formatCurrency(item.summary) }}</td>
                        <td class="text-right p-2 border-r border-black">
                            {{ new Intl.NumberFormat('th-TH').format(item.totalqty || 0) }}
                        </td>
                        <td class="text-center p-2 border-r border-black">{{ item.percentVisit }}</td>
                        <td class="text-center p-2 border-r border-black">{{ item.percentEffective }}</td>

                    </tr>
                </template>
            </tbody>
        </table>
    </div>

</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'
import Swal from 'sweetalert2'
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const router = useRouter()
const route = useRoute()
const routeStore = useRouteStore()
const filter = useFilter()
const isLoading = ref(false);
const selectedRoute = ref(null)
const showExcel = ref(null)
const totalRow = ref('')

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

function showDetail(item, area, routeId) {
  selectedRoute.value = item

  // ✅ เก็บค่าที่ต้องการส่งไว้ใน sessionStorage
  const payload = { item, area, routeId }
  sessionStorage.setItem('checkin-data', JSON.stringify(payload))

  // ✅ เปิดหน้าใหม่โดยไม่ใช้ query
  const routeData = router.resolve({ path: '/supervisor/checkin' })
  window.open(routeData.href, '_blank')
}

function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    showExcel.value = ''
    window.location.assign('/supervisor/checkin')
}





function formatCurrency(value) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    }).format(value || 0)
}

onMounted(async () => {
    isLoading.value = true;
    await filter.getZone('cash',period);
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value, selectedTeam.value);
        // showExcel.value = 'true'
    //     await filter.getTeam(selectedZone.value);
    }

    await routeStore.getCheckin(period);
    // if (selectedArea.value) {
    //     await routeStore.getCheckin(period, selectedArea.value, selectedTeam.value);

    // }
    // await routeStore.getRouteEffective(selectedArea.value, period, '', selectedZone.value);
    // await new Promise(resolve => setTimeout(resolve, 2000))
    isLoading.value = false;
    // showExcel.value = 'true'
})

async function exportExcel() {
  try {
    // 🕐 เปิด popup ระหว่างรอ
    Swal.fire({
      title: 'กำลังสร้างไฟล์ Excel...',
      text: 'กรุณารอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await routeStore.getExcelCheckin('', period)

    // ✅ เมื่อโหลดเสร็จ
    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ!',
      text: 'ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว'
    })
  } catch (err) {
    console.error('❌ Export failed:', err)
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: err.message || 'ไม่สามารถดาวน์โหลดไฟล์ได้'
    })
  }
}

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         area: '',
    //         team: newVal
    //     }
    // });
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});

watch(() => route.query.zone, (val) => {
    selectedZone.value = val || ''
})

watch(() => route.query.area, (val) => {
    selectedArea.value = val || ''
})
watch(() => route.query.team, (val) => {
    selectedTeam.value = val || ''
})

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '',
    //         team: ''
    //     }
    // });
    if (newVal) {
        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam(newVal);
    }
});

watch(selectedArea, async (newVal) => {
    // router.replace({
    //     query: {
    //         ...route.query,
    //         area: newVal
    //     }
    // });
    // if (newVal) {
    //     isLoading.value = true;
    //     await filter.getZone('cash',period);
    //     if (selectedZone.value) {
    //         await filter.getArea(period, selectedZone.value, selectedArea.value);

    //     }
    //     if (selectedArea.value) {
    //         await routeStore.getCheckin(period, selectedArea.value);
    //         showExcel.value = 'true'
    //     }
    //     await routeStore.getRouteEffective(selectedArea.value, period, '', selectedZone.value);
    //     await routeStore.getCheckin(period, newVal);
    //     await new Promise(resolve => setTimeout(resolve, 2000))
    //     isLoading.value = false;
    // }
});

</script>
