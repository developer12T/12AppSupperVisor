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
                <div class="ms-3" v-if="userRole != 'supervisor'">
                    <select class="select select-info ms-3 text-center" v-model="selectedGiveId">
                        <option disabled value="">เลือกประเภทตัดแจก</option>
                        <option v-for="giveType in giveStore.giveType" :key="giveType" :value="giveType.name">{{
                            giveType.name }}</option>
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
                <div class="mx-3">
                    <select class="select select-info ms-3 text-center" v-model="selectedChannel">
                        <option disabled value="">Select Channel</option>
                        <option value="cash">CASH</option>
                        <option value="pc">PC</option>
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

        <div class="overflow-x-auto rounded-xl mt-5" style="min-width: 450px; max-height: 450px; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">Order</th>
                        <th class="p-2 border">เขต</th>
                        <th class="p-2 border">รหัสร้าน</th>
                        <th class="p-2 border">ชื่อร้าน</th>
                        <th class="p-2 border">ชื่อตัดแจก</th>
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
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.giveName }}</div>
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
import { formatDate, formatCurrency, formatDateToYYYYMMDD, toDateOrNull, endOfDay, getTeam3, } from '../../utils/format'


const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
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
const selectedChannel = ref('cash')
const zone = localStorage.getItem('zone')

const startDate = computed(() =>
    dateRange.value?.[0] ? formatDateToYYYYMMDD(dateRange.value[0]) : null
)

const endDate = computed(() =>
    dateRange.value?.[1] ? formatDateToYYYYMMDD(dateRange.value[1]) : null
)

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

    if (selectedArea.value) {
        data = data.filter(order => order.area === selectedArea.value);
    }


    if (selectedGiveId.value) {
        data = data.filter(order => order.giveInfo.name === selectedGiveId.value);
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

watch(selectedChannel, async (newVal) => {
    if (newVal) {
        await giveStore.giveOrder(`${selectedChannel.value}`, '', `${startDate.value}`, `${endDate.value}`, '', '')
    }
});

async function exportExcel() {
    await giveStore.downloadExcel(`${selectedChannel.value}`, `${startDate.value}`, `${endDate.value}`, `${selectedGiveId.value}`, `${selectedArea.value}`, `${selectedTeam.value}`, `${selectedZone.value}`)
}

async function onMonthChange() {
    isLoading.value = true
    await giveStore.giveOrder(`${selectedChannel.value}`, '', `${startDate.value}`, `${endDate.value}`, '', '')
    isLoading.value = false

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
    await giveStore.giveOrder(`${selectedChannel.value}`, period, '', '', '', '')
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
        selectedTeam.value = ''
        selectedArea.value = ''
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




onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash',period);
    await giveStore.getGiveType();
    await giveStore.giveOrder(`${selectedChannel.value}`, period, '', '', '', '')
    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }
    isLoading.value = false

})



</script>