<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="mb-2 flex justify-start">
        <div class="w-65 ms-3">
            <VueDatePicker v-model="dateRange" format="dd/MM/yyyy" range :enable-time-picker="false"
                @update:model-value="onMonthChange" />
        </div>
        <div class="ms-3">
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
    </div>
    <div class="overflow-x-auto rounded-xl"
        style="min-height: 450px; max-height: 480px; max-width: 90vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border">เขตการขาย</th>
                    <th class="p-2 border">ยอดขาย</th>
                    <th class="p-2 border">ผลต่างใบเปลี่ยน</th>
                    <th class="p-2 border">รวมยอดขาย</th>
                    <th class="p-2 border">ยอดชำระเงิน</th>
                    <th class="p-2 border">ยอดส่งเงิน ขาด - เกิน</th>
                    <th class="p-2 border">รูปภาพ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(prod, i) in dailyList" :key="prod.area" class="align-top">
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.area }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sale) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.refund) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.totalSale) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sendmoney) }}</div>
                    </td>
                    <td :class="{
                        'bg-green-100 text-green-700': prod.diff > 0,
                        'bg-red-100 text-red-700': prod.diff < 0,
                    }" class="text-right border p-2 text-center whitespace-pre">
                        <div>{{ formatNumber(prod.diff) }}</div>
                    </td>
                    <td class="text-center border p-2 text-center whitespace-pre">
                        <button class="btn btn-primary" @click="openImageModal(prod)">ดูรูปภาพ</button>
                    </td>
                </tr>
            </tbody>
            <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                <tr class="bg-gray-300 font-bold ">
                    <td class="border p-2 text-center">รวม</td>
                    <td class="border p-2 text-center">{{ formatNumber(Sumsale) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalRefund) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalSale) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalSendmoney) }}</td>
                    <td :class="{
                        'bg-green-100 text-green-700': totalDiff >= 0,
                        'bg-red-100 text-red-700': totalDiff < 0,
                    }" class="border p-2 text-center">{{ formatNumber(totalDiff) }}</td>
                    <td class="border p-2 text-center"></td>
                </tr>
            </tfoot>

        </table>
    </div>
    <!-- Modal -->
    <div v-if="showImageModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
            <h2 class="text-xl font-semibold mb-4">รูปภาพการส่งเงิน - {{ selectedAreaImage }} ยอดรวมส่ง {{
                formatNumber(sendmoneyModal) }}
            </h2>
            <button class="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl"
                @click="showImageModal = false">&times;</button>
            <table class="min-w-full border text-center text-sm bg-white">
                <thead>
                    <tr>
                        <th class="p-2 border">วันที่</th>
                        <th class="p-2 border">รูป</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(img, index) in selectedImages" :key="index">
                        <td class="p-2 border">{{ extractDate(img) }}</td>
                        <td class="p-2 border flex justify-center">
                            <a :href="toImageUrl(img)" target="_blank" rel="noopener noreferrer">
                                <img :src="toImageUrl(img)"
                                    class="w-50 h-auto rounded shadow hover:scale-105 transition" />
                            </a>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>


</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useFilter } from '../../store/modules/filter'
import { useSendmoney } from '../../store/modules/sendmoney'
import { formatNumber, formatDate, formatCurrency, formatDateToYYYYMMDD, toDateOrNull, endOfDay, getTeam3, } from '../../utils/format'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



const router = useRouter()
const route = useRoute()
const filter = useFilter()
const sendmoney = useSendmoney()
const isLoading = ref(false);
const viewType = ref('monthly')
const dateRange = ref();

const selectedZone = ref(route.query.zone || '')
// const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const sendmoneyModal = ref('')

const showImageModal = ref(false)
const selectedImages = ref([])
const selectedArea = ref('')
const selectedAreaImage = ref('')

function openImageModal(prod) {
    sendmoneyModal.value = prod.sendmoney
    selectedAreaImage.value = prod.area
    selectedImages.value = prod.image || []
    showImageModal.value = true
}



// ดึงวันที่จากชื่อไฟล์
function extractDate(path) {
    const match = path.match(/-(\d{8})-/)
    const raw = match[1] // → '20250916'
    const year = raw.slice(0, 4)
    const month = raw.slice(4, 6)
    const day = raw.slice(6, 8)

    return `${day}-${month}-${year}` // → '16-09-2025'
    // return match ? formatDate(match[1]) : ''
}


// แปลง path เป็น URL สำหรับ <img>
function toImageUrl(path) {
    return path.replace('/var/www/12AppAPI/public', 'https://apps.onetwotrading.co.th')
}
// ข้อมูลสำหรับรายวัน
const dailyList = computed(() => {
    let data = sendmoney.dailyData
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
    return data;
})


const Sumsale = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.sale) || 0)
    }, 0)
})

const totalRefund = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.refund) || 0)
    }, 0)
})

const totalSendmoney = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.sendmoney) || 0)
    }, 0)
})

const totalSale = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.totalSale) || 0)
    }, 0)
})

const totalDiff = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.diff) || 0)
    }, 0)
})

// ข้อมูลสำหรับรายเดือน (map ให้ใช้งานกับ v-for)

const startDate = computed(() => formatDateToYYYYMMDD(dateRange.value[0]))
const endDate = computed(() => formatDateToYYYYMMDD(dateRange.value[1]))

onMounted(async () => {
    isLoading.value = true
    await filter.getZone(period);
    await sendmoney.downloadtoExcel('', '', false)
    isLoading.value = false
})

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
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




async function onMonthChange() {
    isLoading.value = true
    await sendmoney.downloadtoExcel(startDate.value, endDate.value, false)
    isLoading.value = false
}

</script>
