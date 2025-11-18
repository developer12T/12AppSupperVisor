<template>
    <div class="p-6 bg-gray-50">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">รายการใบเบิก</h2>
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

            <!-- <input type="date" v-model="startDate" class="input input-bordered w-full" /> -->

            <div class="mx-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedStatus">
                    <option disabled value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Cancel</option>
                </select>
            </div>


        </div>

        <div class="overflow-x-auto rounded-xl"
            style="min-height: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">Order ID</th>
                        <!-- <th class="p-2 border">Low Status</th>
                        <th class="p-2 border">Heigh Status</th> -->
                        <th class="p-2 border">เขต</th>
                        <th class="p-2 border">ประเภท</th>
                        <th class="p-2 border">ชื่อประเภท</th>
                        <th class="p-2 border">ประเภทเบิก</th>
                        <th class="p-2 border">ต้นทริป</th>
                        <th class="p-2 border">วันที่สั่ง</th>
                        <th class="p-2 border">วันที่รับ</th>
                        <!-- <th class="p-2 border">รายการ</th>
                        <th class="p-2 border">รายการใน M3</th> -->
                        <th class="p-2 border">สถานะ</th>
                        <th class="p-2 border">น้ำหนักรวม</th>
                        <th class="p-2 border">น้ำหนักรวมสุทธิ</th>
                    </tr>
                </thead>
                <tbody>

                    <tr @click="$router.push(`/supervisor/withdraw/${prod.orderId}`)"
                        v-for="(prod, i) in filteredOrders" :key="prod.orderId" class="align-top">
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.orderId }}</div>
                        </td>

                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.area }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.orderType }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ prod.orderTypeName }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ statusTH(prod.withdrawType) }}</div>
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            <div class="">{{ statusTH(prod.newTrip) }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.formmatDate }}</div>
                        </td>
                        <td class="border p-2 text-left whitespace-pre">
                            <div class="">{{ prod.sendDate }}</div>
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
                            <div class="">{{ formatNumber(prod.totalWeightNet) }}</div>
                        </td>
                        <td class="border p-2 text-right whitespace-pre">
                            <div class="">{{ formatNumber(prod.totalWeightGross) }}</div>
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr class="bg-gray-300 font-bold ">
                        <td colspan="9" class="border p-2 text-center">รวมน้ำหนัก</td>
                        <td class="border p-2 text-center">{{ formatNumber(totalOrderNet) }}</td>
                        <td class="border p-2 text-center">{{ formatNumber(totalOrderGross) }}</td>
                    </tr>

                </tfoot>
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
                <VueDatePicker format="MM/yyyy" @update:model-value="onBackOrderMonth" v-model="monthRange"
                    month-picker />
            </div>
            <div class="ms-2">
                <button class="btn btn-success text-white" @click="exportExcelBackOrder">Export Back Order</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
// import { useOrder } from '../../store/modules/order'
import { useWithdrawStore } from '../../store/modules/withdraw'
import { useFilter } from '../../store/modules/filter'
import { Icon } from '@iconify/vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { formatDate, formatDateToYYYYMMDD, formatNumber, toDateOrNull, endOfDay, getTeam3, } from '../../utils/format'


const filter = useFilter()
const userRole = localStorage.getItem('role')
const selectedChannel = ref('cash')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const searchQuery = ref('');
const dateRange = ref();
const monthRange = ref();
const cardData = ref([]);
// const useOrderStore = useOrder()
const withdrawStore = useWithdrawStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0')
let periodBackOrder = ref(today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0'));


const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const selectedStatus = ref(route.query.status || '')
const zone = localStorage.getItem('zone')

const startDate = computed(() =>
    dateRange.value?.[0] ? formatDateToYYYYMMDD(dateRange.value[0]) : null
)

const endDate = computed(() =>
    dateRange.value?.[1] ? formatDateToYYYYMMDD(dateRange.value[1]) : null
)


// const month = computed(() => startDate.value.split('-')[1])
// const year = computed(() => startDate.value.split('-')[0])

function statusTH(status) {
    switch (status) {
        case 'pending': return 'รอดำเนินการ'
        case 'approved': return 'อนุมัติ'
        case 'rejected': return 'ไม่อนุมัติ'
        case 'true': return 'เบิกต้นทริป'
        case 'false': return 'เบิกระหว่างทริป'
        case 'normal': return 'เบิกปกติ'
        case 'clearance': return 'ระบาย'
        case 'credit': return 'รับโอนจากเครดิต'
        default: return status
    }
}



const filteredOrders = computed(() => {
    // let data = withdrawStore.withdraw;
    let data = Array.isArray(withdrawStore?.withdraw) ? [...withdrawStore.withdraw] : []
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

    if (selectedZone.value) {
        data = data.filter(order =>
            (order.area || '').startsWith(selectedZone.value)
        )
    }

    if (selectedArea.value) {
        data = data.filter(order => order.area === selectedArea.value);
    }

    if (selectedTeam.value) {
        console.log()
        data = data.filter(order =>
            getTeam3(order.area) === selectedTeam.value
        )
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
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return data;
})

// ✅ คำนวณผลรวม total ของทุก order หลัง filter
const totalOrderGross = computed(() => {
    return filteredOrders.value.reduce((sum, order) => {
        if (order.status !== "canceled") {
            return sum + (Number(order.totalWeightGross) || 0)
        }
        return sum
        //   return sum + (Number(order.total) || 0)
    }, 0)
})

// ✅ คำนวณผลรวม total ของทุก order หลัง filter
const totalOrderNet = computed(() => {
    return filteredOrders.value.reduce((sum, order) => {
        if (order.status !== "canceled") {
            return sum + (Number(order.totalWeightNet) || 0)
        }
        return sum
        //   return sum + (Number(order.total) || 0)
    }, 0)
})

async function exportExcel() {


}
async function exportExcelBackOrder() {
    await withdrawStore.downloadExcelBackOrder(periodBackOrder.value);
}

async function onMonthChange() {
    isLoading.value = true
    if (startDate.value && endDate.value) {
        await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, '', '', '', '', `${startDate.value}`, `${endDate.value}`)
    } else {
        await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, period, '', '', '', '', '')

    }
    console.log("onMonthChange")
    isLoading.value = false
}

watch(selectedChannel, async (newVal) => {
    if (newVal) {
        if (startDate.value && endDate.value) {
            await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, '', '', '', '', `${startDate.value}`, `${endDate.value}`)
        } else {
            await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, period, '', '', '', '', '')
        }
    }
});


async function onBackOrderMonth(value) {
    console.log('value from datepicker:', value)
    // console.log(monthRange)
    // console.log(monthRange.value[1])

    // const formatted = `${monthRange.value.year}${String(monthRange.value.month + 1).padStart(2, '0')}`
    // console.log(formatted) // 👉 "202508"


    // กรณี month - picker จะส่ง { month: 8, year: 2025 }
    if (value && value.year && value.month !== undefined) {
        const formatted = `${value.year}${String(value.month + 1).padStart(2, '0')}`
        console.log(formatted) // 👉 "202508"
        periodBackOrder.value = formatted;
    }

    // ถ้า VueDatePicker ส่ง Date object แทน (เช่น new Date(2025, 7))
    else if (value instanceof Date) {
        const year = value.getFullYear()
        const month = String(value.getMonth() + 1).padStart(2, '0')
        const formatted = `${year}${month}`
        periodBackOrder.value = formatted;
        console.log(formatted)
    }
}

async function clearFilter() {
    isLoading.value = true;
    dateRange.value = ''
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    selectedStatus.value = ''
    await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, period, '', '', '', '', '')
    isLoading.value = false;
}

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
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

onMounted(async () => {
    isLoading.value = true
    // await filter.getTeam(selectedZone.value);
    // await filter.getArea(period, zone, '');
    await filter.getZone('cash',period);
    await withdrawStore.getWithdrawTable(`${selectedChannel.value}`, period, '', '', '', '', '')
    console.log(withdrawStore.withdraw)
    // cardData.value = withdrawStore.withdraw.data
    isLoading.value = false

})



</script>