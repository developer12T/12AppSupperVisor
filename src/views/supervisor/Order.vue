<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">รายการขาย</h2>
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
            <div class="ms-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                    <option disabled value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Cancel</option>
                </select>
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
        <div class="overflow-x-auto rounded-xl" style="max-height: 480px; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">Order</th>
                        <th class="p-2 border">เขต</th>
                        <th class="p-2 border">รหัสร้าน</th>
                        <th class="p-2 border">วันที่สั่ง</th>
                        <th class="p-2 border">รายการ</th>
                        <th class="p-2 border">สถานะ</th>
                        <th class="p-2 border">ยอดรวม</th>
                    </tr>
                </thead>
                <tbody>

                    <tr @click="$router.push(`/supervisor/order/${prod.orderId}`)" v-for="(prod, i) in filteredOrders"
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
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ formatDate(prod.createdAt) }}</div>
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

        <!-- <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
            <div v-for="item in cardData" :key="item.orderId"
                class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
                <router-link :to="`/supervisor/withdraw/${item.orderId}`">
                    <div class="flex justify-end">
                        <div class="text-sm text-gray-500">วันที่สั่ง: <span class="font-semibold">{{
                            formatDate(item.createdAt)
                                }}</span></div>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg text-gray-700">Order</span>
                        <span class="text-sm text-gray-500">{{ item.orderId }}</span>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">เขต: <span class="font-semibold">{{ item.area }}</span>
                        </div>
                        <div class="text-sm text-gray-500">ร้าน: <span class="font-semibold">{{ item.storeId
                                }}</span>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <div class="text-sm text-green-500">ยอดรวม: <span class="text-xl font-semibold">{{ item.total
                                }}</span>
                        </div>
                    </div>
                </router-link>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useOrder } from '../../store/modules/order'
import { useFilter } from '../../store/modules/filter'
import { Icon } from '@iconify/vue'

const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const selectedMonth = ref('') // format: YYYY-MM
const searchQuery = ref('');

const cardData = ref([]);
const useOrderStore = useOrder()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const selectedStatus = ref(route.query.status || '')
const zone = localStorage.getItem('zone')


const filteredOrders = computed(() => {
    let data = useOrderStore.order.data;
    // Search filter (text input)
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        data = data.filter(order =>
            (order.orderId || '').toLowerCase().includes(query) ||
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

    return data;
})

async function exportExcel() {

    // await reportStore.downloadExcel(
    //     formatDate2(selectedDateStart.value),
    //     formatDate2(selectedDateEnd.value)
    // )
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
    await useOrderStore.fetchOrder(period)
    console.log(useOrderStore.order)
    cardData.value = useOrderStore.order.data
    isLoading.value = false

})



</script>