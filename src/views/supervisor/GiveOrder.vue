<template>
    <div class="p-6 bg-gray-50">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <div class="flex justify-between">
            <!-- <h2 class="text-2xl font-bold mb-6">รายการตัดแจก</h2> -->
            <div class="flex justify-start">

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
                <div class="w-65 ms-3">
                    <VueDatePicker v-model="dateRange" format="dd/MM/yyyy" range :enable-time-picker="false"
                        @update:model-value="onMonthChange" />
                </div>
                <!-- <div class="flex justify-start ms-2">
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
                </div> -->
                <div class="ms-3" v-if="userRole != 'supervisor'">
                    <select class="select select-info ms-3 text-center" v-model="selectedGiveId">
                        <option disabled value="">Select Zone</option>
                        <option v-for="giveType in giveStore.giveType" :key="giveType" :value="giveType.type">{{ giveType.name }}</option>
                    </select>
                </div>
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
                </div>

                <!-- <input type="date" v-model="startDate" class="input input-bordered w-full" /> -->

                <div class="ms-3" v-if="userRole != 'supervisor'">
                    <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                        <option disabled value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Cancel</option>
                    </select>
                </div>
            </div>

        </div>

        <div class="overflow-x-auto rounded-xl mt-5" style="max-height: 450px; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">Order</th>
                        <th class="p-2 border">เขต</th>
                        <th class="p-2 border">รหัสร้าน</th>
                        <th class="p-2 border">ชื่อร้าน</th>
                        <th class="p-2 border">วันที่สั่ง</th>
                        <th class="p-2 border">รายการ</th>
                        <th class="p-2 border">สถานะ</th>
                        <th class="p-2 border">ยอดรวม</th>
                    </tr>
                </thead>
                <tbody>

                    <tr @click="$router.push(`/supervisor/give/${prod.orderId}`)" v-for="(prod, i) in filteredOrders"
                        :key="prod.orderId" class="align-top">
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.orderId }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.area }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.storeId }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.storeName }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ formatDate(prod.createAt) }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.listProduct }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div :class="{
                                'text-warning': prod.status === 'pending',
                                'text-green-700': prod.status === 'completed',
                                'text-red-700': prod.status === 'canceled'
                            }">
                                {{ prod.status }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ formatCurrency(prod.total) }}</div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
        <div class="flex justify-start mt-2">
            <button @click="clearFilter"
                class="flex items-center ms-3 gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
                <Icon icon="mdi:broom" width="24" height="24" />
                เคลีย
            </button>
            <div class="ms-2">
                <button class="btn btn-success text-white" @click="exportExcel">Export Excel To M3</button>
            </div>
            <div class="ms-2">
                <button class="btn btn-success text-white" @click="exportExcel">Export Excel Item</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useOrder } from '../../store/modules/order'
import { useGiveAway } from '../../store/modules/giveaway'
import { useFilter } from '../../store/modules/filter'
import { Icon } from '@iconify/vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const startDate = ref('') // format: YYYY-MM
const endDate = ref('') // format: YYYY-MM
const exportDate = ref('') // format: YYYY-MM
const searchQuery = ref('');

const cardData = ref([]);
const useOrderStore = useOrder()
const giveStore = useGiveAway()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const selectedGiveId = ref('')
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

const dateRange = ref();


const filteredOrders = computed(() => {
    // let data = giveStore.give.data
    let data = Array.isArray(giveStore.give?.data) ? [...giveStore.give.data] : []

    // Search filter (text input)
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        data = data.filter(order =>
            (order.orderId || '').toLowerCase().includes(query) ||
            (order.area || '').toLowerCase().includes(query) ||
            (order.storeId || '').toLowerCase().includes(query)

        );
    }

    if (selectedArea.value) {
        data = data.filter(order => order.area === selectedArea.value);
    }

    if (selectedStatus.value) {
        data = data.filter(order => order.status === selectedStatus.value);
    }

    // --- Date range filter (client-side) ---
    const startDateRange = dateRange.value?.[0]
        ? formatDateToYYYYMMDD(dateRange.value[0])
        : null

    const endDateRange = dateRange.value?.[1]
        ? formatDateToYYYYMMDD(dateRange.value[1])
        : null


    const s = toDateOrNull(startDateRange)   // expects 'YYYY-MM-DD' from <input type="date">
    const e = toDateOrNull(endDateRange) ? endOfDay(endDateRange) : null

    if (s || e) {
        data = data.filter(order => {
            const od = toDateOrNull(order.createAt)
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
    await giveStore.downloadExcel(`${startyear.value}${startmonth.value}${startday.value}`, `${endyear.value}${endmonth.value}${endday.value}`)
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
    isLoading.value = true
    await giveStore.giveOrder('', `${formatDateToYYYYMMDD(dateRange.value[0])}`, `${formatDateToYYYYMMDD(dateRange.value[1])}`)
    isLoading.value = false

}
function formatDateToYYYYMMDD(date) {
    if (!(date instanceof Date)) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
}


async function clearFilter() {
    isLoading.value = true;
    dateRange.value = ''
    startDate.value = ''
    endDate.value = ''
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    selectedStatus.value = ''
    await useOrderStore.fetchOrder(period, '', '')
    isLoading.value = false;
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
    await giveStore.getGiveType();
    // await useOrderStore.fetchOrder(period, '', '')

    await giveStore.giveOrder('202508')
    // console.log(giveStore.give)
    // cardData.value = giveStore.give.data
    isLoading.value = false

})



</script>