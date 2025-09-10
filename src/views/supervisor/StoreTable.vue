<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">รายการร้านค้าเปิดใหม่</h2>
            <label class="input ms-3 input-bordered flex items-center gap-2 w-64">
                <svg class="w-5 h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                        stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input v-model="searchQuery" type="search" class="grow" placeholder="Search" />
            </label>
            <div class="flex justify-start ms-2">
                <div>
                    <input type="date" v-model="startDate" @change="onMonthChange" class="border p-2 rounded" />
                    <p>เลือกวันที่: {{ formatDate(startDate) }}</p>
                </div>
            </div>
            <div class="ms-2 pt-2">ถึง</div>
            <div class="flex justify-start ms-2">
                <div>

                    <input type="date" v-model="endDate" @change="onMonthChange" class="border p-2 rounded" />
                    <p>เลือกวันที่: {{ formatDate(endDate) }}</p>
                </div>
            </div>
            <div class="mx-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                    <option disabled value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Cancel</option>
                </select>
            </div>
            <div class="ms-3">
                <button class="btn btn-success text-white" @click="exportExcel">Export Excel</button>
            </div>
            <!-- 
            <div class="ms-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam
                    }}
                    </option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div> -->
            <!-- <div class="ms-3">
                <button @click="clearFilter"
                    class="flex items-center ms-3 gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
                    <Icon icon="mdi:broom" width="24" height="24" />
                    เคลีย
                </button>
            </div> -->

            <!-- <div class="ms-3">
                <button @click="exportExcel"
                    class="flex items-center ms-3 gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
                    <Icon icon="mdi:file-excel" style="color: #00912f" width="24" height="24" />
                    Excel
                </button>
            </div> -->

        </div>

        <div class="overflow-x-auto rounded-xl" style="max-height: 480px; max-width: 90vw; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">เขต</th>
                        <th class="p-2 border">รหัสร้าน</th>
                        <th class="p-2 border">ชื่อร้าน</th>
                        <th class="p-2 border">ประเภท</th>
                        <th class="p-2 border">รูท</th>
                        <th class="p-2 border">วันที่สร้าง</th>
                        <th class="p-2 border">สถานะ</th>
                    </tr>
                </thead>
                <tbody>

                    <tr @click="$router.push(`/supervisor/storedetail/${prod.storeId}`)" v-for="(prod, i) in filteredOrders"
                        :key="prod.orderId" class="align-top">

                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.area }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.storeId }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.name }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.typeName }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.route }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ formatDate(prod.createdAt) }}</div>
                        </td>

                        <td class="border p-2 text-center whitespace-pre">
                            <div :class="{
                                'text-warning': prod.status === 'pending',
                                'text-green-700': prod.status === 'completed',
                                'text-red-700': prod.status === 'canceled'
                            }">
                                {{ prod.status }}</div>
                        </td>


                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useOrder } from '../../store/modules/order'
import { useFilter } from '../../store/modules/filter'
import { useStoresStore } from '../../store/modules/store'
import { Icon } from '@iconify/vue'

const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const startDate = ref('') // format: YYYY-MM
const endDate = ref('') // format: YYYY-MM
const searchQuery = ref('');

const cardData = ref([]);
const useOrderStore = useOrder()
const store = useStoresStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const selectedStatus = ref(route.query.status || '')
const zone = localStorage.getItem('zone')

const startday = computed(() => startDate.value.split('-')[2])
const startmonth = computed(() => startDate.value.split('-')[1])
const startyear = computed(() => startDate.value.split('-')[0])

const endday = computed(() => endDate.value.split('-')[2])
const endmonth = computed(() => endDate.value.split('-')[1])
const endyear = computed(() => endDate.value.split('-')[0])


// const month = computed(() => startDate.value.split('-')[1])
// const year = computed(() => startDate.value.split('-')[0])


const filteredOrders = computed(() => {
    // let data = useOrderStore.order.data;
    let data = store.storeNew.data
    // Search filter (text input)
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        data = data.filter(order =>
            (order.name || '').toLowerCase().includes(query) ||
            (order.area || '').toLowerCase().includes(query) ||
            (order.storeId || '').toLowerCase().includes(query) ||
            (order.createdAt || '').toLowerCase().includes(query)
        );
    }

    if (selectedArea.value) {
        data = data.filter(order => order.area === selectedArea.value);
    }

    if (selectedStatus.value) {
        data = data.filter(order => order.status === selectedStatus.value);
    }
    // --- Date range filter (client-side) ---
    const s = toDateOrNull(startDate.value)   // expects 'YYYY-MM-DD' from <input type="date">
    const e = toDateOrNull(endDate.value) ? endOfDay(endDate.value) : null

    if (s || e) {
        data = data.filter(order => {
            const od = toDateOrNull(order.createdAt)
            if (!od) return false
            if (s && od < s) return false
            if (e && od > e) return false
            return true
        })
    }

    // newest first
    // data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return data;
})

async function exportExcel() {

    await useOrderStore.downloadExcel(`${startyear.value}${startmonth.value}${startday.value}`, `${endyear.value}${endmonth.value}${endday.value}`)

    // await reportStore.downloadExcel(
    //     formatDate2(selectedDateStart.value),
    //     formatDate2(selectedDateEnd.value)
    // )
}

function toDateOrNull(val) {
    if (!val) return null
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
}

// make end-of-day inclusive for comparisons
function endOfDay(d) {
    const x = new Date(d)
    x.setHours(23, 59, 59, 999)
    return x
}

async function onMonthChange() {
    // ส่งค่า month, year ไป filter API หรือฟังก์ชันอื่น
    // ตัวอย่าง:

    // console.log('startDate:', startDate.value)
    // console.log('endDate:', endDate.value)
    if (startDate.value && endDate.value) {
        isLoading.value = true
        await useOrderStore.fetchOrder('', `${startyear.value}${startmonth.value}${startday.value}`, `${endyear.value}${endmonth.value}${endday.value}`)

        //     await useOrderStore.fetchOrder(period, startDate.value, endDate.value)
        //     cardData.value = useOrderStore.order.data
        isLoading.value = false
    }
    // console.log('เลือกเดือน:', month.value)
    // console.log('เลือกเดือน:', month.value)
    // console.log('เลือกปี:', year.value)

}



function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
}

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam(newVal);
    }
});


watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});




function formatCurrency(value) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    }).format(value || 0)
}



function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}

onMounted(async () => {
    isLoading.value = true
    // await filter.getTeam(selectedZone.value);
    // await filter.getArea(period, zone, '');
    await filter.getZone(period);
    // await useOrderStore.fetchOrder(period, '', '')
    await store.getCustomerAll('', '', '', '', '')
    // console.log(useOrderStore.order)
    // cardData.value = useOrderStore.order.data
    isLoading.value = false

})



</script>