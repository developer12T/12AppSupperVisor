<template>
    <div class="p-6 bg-gray-50">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">รายการร้านค้าทั้งหมด</h2>
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
            <!-- <div class="w-65 ms-3">
                <VueDatePicker v-model="dateRange" format="dd/MM/yyyy" range :enable-time-picker="false"
                    @update:model-value="onMonthChange" />
            </div> -->

            <div class="ms-2">
                <VueDatePicker format="MM/yyyy" @update:model-value="onMonthChange" v-model="monthRange" month-picker />
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
            <div class="mx-3">
                <select class="select select-info ms-3 text-center" v-model="selectedChannel">
                    <option disabled value="">Select Channel</option>
                    <option value="cash">CASH</option>
                    <option value="pc">PC</option>
                </select>
            </div>
            <!-- <div class="mx-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                    <option disabled value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Cancel</option>
                </select>
            </div> -->

        </div>

        <div class="overflow-x-auto rounded-xl"
            style="min-width: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
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
                    <tr @click="$router.push(`/supervisor/storedetail/${prod.storeId}`)"
                        v-for="(prod, i) in filteredOrders" :key="prod.orderId" class="align-top">

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
        <div class="flex justify-start mt-2">

            <button @click="clearFilter"
                class="flex items-center gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
                <Icon icon="mdi:broom" width="24" height="24" />
                เคลีย
            </button>
            <!-- <div class="ms-2">
                <button class="btn btn-success text-white" @click="exportExcel">Export Excel To M3</button>
            </div>
            <div class="ms-2">
                <button class="btn btn-success text-white" @click="exportExcel">Export Excel Item</button>
            </div> -->
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { formatDate, formatCurrency, formatDateToYYYYMMDD, toDateOrNull, endOfDay, getTeam3, } from '../../utils/format'

const monthRange = ref();
const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const searchQuery = ref('');
const selectedChannel = ref('cash')

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

const dateRange = ref();
const startDate = computed(() => formatDateToYYYYMMDD(dateRange.value[0]))
const endDate = computed(() => formatDateToYYYYMMDD(dateRange.value[1]))

let debounceTimer = null

const filteredOrders = computed(() => {
    // let data = useOrderStore.order.data;
    let data = store.storeAll
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

    await useOrderStore.downloadExcel(`${startDate.value}`, `${endDate.value}`)

    // await reportStore.downloadExcel(
    //     formatDate2(selectedDateStart.value),
    //     formatDate2(selectedDateEnd.value)
    // )
}


async function onMonthChange(value) {
    let dateObj = null;
    if (value instanceof Date) {
        dateObj = value;
    } else if (value?.year && value?.month) {
        dateObj = new Date(value.year, value.month, 1);
    } else if (value?.value instanceof Date) {
        dateObj = value.value;
    }

    if (!dateObj) return;

    const yyyy = dateObj.getFullYear();
    const mm = dateObj.getMonth() + 1;

    // const firstDate = new Date(yyyy, mm - 1, 1);
    // const lastDate = new Date(yyyy, mm, 0);

    monthRange.value = value;
    console.log(formatYyyyMm(monthRange.value))

    await store.getStoreAll(`${selectedChannel.value}`, '', '', '', formatYyyyMm(monthRange.value).slice(0, 4), formatYyyyMm(monthRange.value).slice(4, 6), '')


    // ส่งค่า month, year ไป filter API หรือฟังก์ชันอื่น
    // ตัวอย่าง:

    // console.log('startDate:', startDate.value)
    // console.log('endDate:', endDate.value)
    // if (startDate.value && endDate.value) {
    //     isLoading.value = true
    //     await useOrderStore.fetchOrder('', `${startDate.value}`, `${endDate.value}`)
    //     isLoading.value = false
    // }
}

function formatYyyyMm(obj) {
    const y = obj.year;
    const m = String(obj.month + 1).padStart(2, "0");
    return `${y}${m}`;   // → "202508"
}



async function clearFilter() {
    isLoading.value = true
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    searchQuery.value = ''
    await store.getStoreAll(`${selectedChannel.value}`, '', '', '', period.slice(0, 4), period.slice(4, 6), '')
    isLoading.value = false
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
        filter.getTeam(selectedChannel.value, newVal);
    }
});


watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});

watch(selectedChannel, async (newVal) => {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    if (newVal) {
        await store.getStoreAll(`${selectedChannel.value}`, '', '', '', '', '', '')
    }
});



watch(searchQuery, (text) => {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
        await store.getStoreAll(
            `${selectedChannel.value}`,
            '',
            '',
            '',
            '',
            '',
            text
        )
    }, 1000)
})

onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash', period);
    await store.getStoreAll(`${selectedChannel.value}`, '', '', '', period.slice(0, 4), period.slice(4, 6), '')
    isLoading.value = false
})


</script>