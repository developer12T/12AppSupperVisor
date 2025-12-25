<template>
    <div class="flex justify-between gap-6 mb-3">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex">
            <select class="select select-info ms-3 text-center mb-2" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option value="all">ทั้งหมด</option>
                <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
            </select>
            <select class="select select-info ms-3 text-center mb-2" v-model="selectedTeam">
                <option disabled value="">Select Team</option>
                <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                </option>
            </select>
            <select class="select select-info ms-3 text-center" v-model="selectedArea">
                <option disabled value="">Select Area</option>
                <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
            </select>
            <button class="btn btn-primary ms-3 text-center" @click="clearFilter">ล้างตัวเลือก</button>
        </div>
        <div class="flex">
            <div class="flex justify-start">
                <SegmentSwitch v-model="mode" :counts="counts" />
            </div>
        </div>
    </div>
    <div v-if="mode == 'approve'" class="overflow-x-auto rounded-xl mt-5"
        style="min-height: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border">No.</th>
                    <th class="p-2 border">รหัส</th>
                    <th class="p-2 border">รหัสร้าน</th>
                    <th class="p-2 border">ชื่อร้าน</th>
                    <th class="p-2 border">Route</th>
                    <th class="p-2 border">อนุมัติ</th>
                    <th class="p-2 border">ผู้อนุมัติ</th>
                    <th class="p-2 border">สถานะ</th>
                    <th class="p-2 border">วันที่อนุมัติ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in routeStores.routeAddStores" :key="item._id"
                    class="hover:bg-blue-50 cursor-pointer">
                    <td class="p-2 border">{{ index + 1 }}</td>
                    <td class="p-2 border">{{ item.id }}</td>
                    <td class="p-2 border">{{ item.storeId }}</td>
                    <td class="p-2 border">{{ item.name }}</td>
                    <td class="p-2 border">{{ item.route }}</td>
                    <td class="p-2 border">
                        <button @click="openAlert(item)" class="btn btn-primary text-center">
                            อนุมัติ
                        </button>
                    </td>
                    <td class="p-2 border">{{ item.approve?.appPerson ?? '-' }}</td>
                    <td class="p-2 border" :class="statusTHBG(item.statusTH)">{{ item.statusTH }}</td>
                    <td class="p-2 border text-center">{{ formatDateTime(item.approve?.dateAction ?? '') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="mode == 'all'" class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        <div v-for="item in cardData" :key="item.id" class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
            <div>

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
            </div>
        </div>
    </div>
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4">อนุมัติร้านค้าใหม่ "{{ routeSelected?.name ?? "" }}" => {{
                routeSelected?.route ?? "" }}</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติร้าน {{ routeSelected?.storeId ?? "" }} ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-success" @click="approveStatus(true)">อนุมัติ</button>
                <button class="btn btn-error text-white" @click="approveStatus(false)">ไม่อนุมัติ</button>
                <button class="btn btn-neutral" @click="showAlert = false">ยกเลิก</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'
import { getTeam3 } from '../../utils/format'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";
import SegmentSwitch from '../../components/SegmentSwitch.vue'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์


const mode = ref('approve')
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
const routeSelected = ref({})
const showAlert = ref(false)
const routeStores = useRouteStore()
const cardData = ref([]);



const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')



const radius = 50
const circumference = 2 * Math.PI * radius


const counts = computed(() => ({
    approve: routeStores.routeAddStores.filter(item => item.statusTH === 'กำลังดำเนินการ').length
}))



function statusTHBG(status) {
    switch (status) {
        case 'กำลังดำเนินการ': return 'bg-yellow-100 text-yellow-700'
        case 'อนุมัติ': return 'bg-green-100 text-green-700'
        default: return status
    }
}

function formatDateTime(isoString) {
    if (isoString != '') {
        const date = new Date(isoString)
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        const hh = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${dd}-${mm}-${yyyy} ${hh}:${min}`
    } else {
        return ''
    }

}



const filteredData = computed(() => {
    let data = routeStore.checkIn


    if (selectedZone.value) {
        data = data.filter(order =>
            (order.area || '').startsWith(selectedZone.value)
        )
    }

    if (selectedTeam.value) {
        console.log()
        data = data.filter(order =>
            getTeam3(order.area) === selectedTeam.value
        )
    }
    return data;
})


const totalStore = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        if (order.route !== "R25" || order.route !== "R26") {
            return sum + (Number(order.storeAll) || 0)
        }
        return sum
    }, 0)
})

const totalstoreSell = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.storeSell) || 0)
    }, 0)
})

const totalstoreNotSell = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.storeNotSell) || 0)
    }, 0)
})

const totalstorePending = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.storePending) || 0)
    }, 0)
})


const totalSummary = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.summary) || 0)
    }, 0)
})


const totalQTY = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.totalqty) || 0)
    }, 0)
})


const totalPercentVisit = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.percentVisit) || 0)
    }, 0)
})

const totalPercentEffective = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.percentEffective) || 0)
    }, 0)
})



const totalstoreTotal = computed(() => {
    return filteredData.value.reduce((sum, order) => {
        return sum + (Number(order.storeTotal) || 0)
    }, 0)
})

async function approveStatus(statusBool) {
    try {
        await routeStores.approveNewStoreToRoute(routeSelected.value.id, statusBool)

        if (routeStores.statusCode == 200) {
            toast(`อนุมัติเรียบร้อย !`, {
                "theme": toast.THEME.COLORED,
                "type": toast.TYPE.SUCCESS,
                "dangerouslyHTMLString": true
            })
        } else {
            toast(`${routeStores.message}!`, {
                "theme": toast.THEME.COLORED,
                "type": toast.TYPE.ERROR,
                "dangerouslyHTMLString": true
            })
        }

        // window.location.reload();
        // router.push('/areamanager/addstoreroute')

    } catch (error) {
        toast(`${error.message}!`, {
            "theme": toast.THEME.COLORED,
            "type": toast.TYPE.ERROR,
            "dangerouslyHTMLString": true
        })
    }

    // await withdrawStore.approve(route.params.id, statusBool)
}

function showDetail(item, routeCode, routeId) {
    selectedRoute.value = item
    router.push({ name: 'RouteDetail', params: { route: routeCode, routeId: routeId } })
}

function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    showExcel.value = ''
    router.replace({
        query: {
            zone: '',
            area: '',
            team: ''
        }
    });
    // window.location.assign('/supervisor/checkin')
}


function openAlert(item) {
    routeSelected.value = item
    console.log(routeSelected.value)
    console.log(routeSelected.value.route)
    showAlert.value = true;
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
    await filter.getZone('cash', period);
    filter.getTeam('cash', selectedZone.value);
    console.log('selectedArea.value', selectedArea.value)
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value, selectedTeam.value);
        //showExcel.value = 'true'
        //await filter.getTeam(selectedZone.value);
    }
    // console.log('route.query.team', route.query.team)
    await routeStores.getNewStoreToRoute(period, selectedZone.value, selectedTeam.value, selectedArea.value)
    await routeStores.getRouteChangeSale(period, selectedZone.value, selectedTeam.value, selectedArea.value)
    cardData.value = routeStores.routeChanges
    isLoading.value = false;
    // showExcel.value = 'true'
})

async function exportExcel() {
    try {
        await routeStore.getExcelCheckin(selectedArea.value, period, '', selectedZone.value)
        console.log('✅ Export success')
    } catch (err) {
        console.error('❌ Export failed:', err)
    }
}

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    router.replace({
        query: {
            ...route.query,
            area: '',
            team: newVal
        }
    });
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
        if (mode == 'approve') {
            isLoading.value = true;
            await routeStores.getNewStoreToRoute(period, selectedZone.value, newVal, selectedArea.value)
            isLoading.value = false;
        } else {
            isLoading.value = true;
            await routeStores.getRouteChangeSale(period, selectedZone.value, newVal, selectedArea.value)
            cardData.value = routeStores.routeChanges
            isLoading.value = false;
        }

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
    selectedArea.value = ''
    selectedTeam.value = ''
    if (newVal === 'all') {
        isLoading.value = true;
        selectedZone.value = ''
        newVal = ''
        await routeStores.getRouteChangeSale(period, newVal, selectedTeam.value, selectedArea.value)
        await routeStores.getNewStoreToRoute(period, newVal, selectedTeam.value, selectedArea.value)
        cardData.value = routeStores.routeChanges
        isLoading.value = false;
    }

    router.replace({
        query: {
            ...route.query,
            zone: newVal,
            area: '',
            team: ''
        }
    });
    if (newVal) {
        // await routeStore.getCheckin(period, selectedZone.value, selectedTeam.value, selectedArea.value);

        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam('cash', newVal);

        if (mode == 'approve') {
            isLoading.value = true;
            await routeStores.getNewStoreToRoute(period, newVal, selectedTeam.value, selectedArea.value)
            isLoading.value = false;
        } else {
            isLoading.value = true;
            await routeStores.getRouteChangeSale(period, newVal, selectedTeam.value, selectedArea.value)
            cardData.value = routeStores.routeChanges
            isLoading.value = false;
        }
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
        await filter.getZone('cash', period);
        // if (selectedZone.value) {
        //     await filter.getArea(period, selectedZone.value, selectedArea.value);

        // }
        if (selectedArea.value) {
            await routeStore.getCheckin(period, selectedArea.value);
            showExcel.value = 'true'
        }

        if (mode == 'approve') {
            isLoading.value = true;
            await routeStores.getNewStoreToRoute(period, selectedZone.value, selectedTeam.value, newVal)
            isLoading.value = false;
        } else {
            isLoading.value = true;
            await routeStores.getRouteChangeSale(period, selectedZone.value, selectedTeam.value, newVal)
            cardData.value = routeStores.routeChanges
            isLoading.value = false;
        }

        isLoading.value = false;
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



</script>
