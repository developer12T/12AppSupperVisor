<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="mb-2 flex justify-start">
        <div class="w-65 ms-3">
            <VueDatePicker v-model="dateRange" format="dd/MM/yyyy" :flow="['start', 'end']"
                @update:model-value="onDateChange" range :enable-time-picker="false" :timezone="'Asia/Bangkok'" />
        </div>
        <div class="ms-2">
            <VueDatePicker v-model="monthRange" format="MM/yyyy" month-picker @update:model-value="onMonthChange" />
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
    <div class="overflow-x-auto rounded-xl"
        style="min-height: 450px; max-height: 480px; max-width: 90vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border">เขตการขาย</th>
                    <th class="p-2 border">วันที่</th>
                    <th class="p-2 border">ยอดขาย</th>
                    <th class="p-2 border">ผลต่างใบเปลี่ยน</th>
                    <th class="p-2 border">รวมยอดขาย</th>
                    <th class="p-2 border">ยอดชำระเงิน</th>
                    <th class="p-2 border">ยอดบันทึก</th>
                    <th class="p-2 border">ยอดส่งเงิน ขาด - เกิน</th>
                    <th class="p-2 border">รูปภาพ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(prod, i) in dailyList" :key="prod.area + '-' + prod.date" class="align-top">
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.area }}</div>
                    </td>
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.date }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sale) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.change - prod.refund) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.totalSale) }}</div>
                    </td>
                    <td class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sendmoney) }}</div>
                    </td>
                    <td @click="openAlert(prod.area, prod.date, prod.sale, (prod.change - prod.refund), prod.totalSale, prod.sendmoney, prod.sendmoneyAcc, (prod?.image && prod.image[0]) || '')"
                        class="text-right border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sendmoneyAcc) }}</div>
                    </td>
                    <td :class="{
                        'bg-green-100 text-green-700': prod.diff > 0,
                        'bg-red-100 text-red-700': prod.diff < 0,
                    }" class="text-right border p-2 text-center whitespace-pre">
                        <div>{{ formatNumber(prod.diff) }}</div>
                    </td>
                    <!-- <td class="text-center border p-2 text-center whitespace-pre">
                        <button class="btn btn-primary"
                            @click="openImageModal(prod, (prod?.image && prod.image[0]) || '')">ดูรูปภาพ</button>
                    </td> -->
                    <td class="text-center border p-2 text-center whitespace-pre">
                        <button class="btn btn-primary"
                            @click="openModal((prod?.image && prod.image[0]) || '')">ดูรูปภาพ</button>
                    </td>
                </tr>
            </tbody>
            <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                <tr class="bg-gray-300 font-bold ">
                    <td class="border p-2 text-center">รวม</td>
                    <td class="border p-2 text-center"></td>
                    <td class="border p-2 text-center">{{ formatNumber(Sumsale) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalRefund) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalSale) }}</td>
                    <td class="border p-2 text-center">{{ formatNumber(totalSendmoney) }}</td>
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
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>

    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-[1000px]">
            <div class="flex  justify-between">
                <h2 class="font-bold text-lg mb-4">บันทึกยอดส่งเงิน
                    <br>เขต: {{ selectedAreaModel }} วันที่ {{ selectedDate }}
                </h2>
                <div>
                    <button class="me-2 btn btn-primary" @click="rotateAndOpen(modalImageSrc)"> หมุนรูป </button>
                    <button class="btn btn-primary" @click="openImage(modalImageSrc)"> เปิดใหม่</button>
                </div>
            </div>

            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style=" top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">ยอดขาย</th>
                        <th class="p-2 border">ผลต่างใบเปลี่ยน</th>
                        <th class="p-2 border">รวมยอดขาย</th>
                        <th class="p-2 border">ยอดชำระ</th>
                        <th class="p-2 border">ยอดบันทึก</th>
                        <th class="p-2 border">รูป</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border p-2 text-center whitespace-pre">
                            {{ formatNumber(saleShow) }}
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            {{ formatNumber(diffShow) }}
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            {{ formatNumber(totalSaleShow) }}
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            {{ formatNumber(sendmoneyShow) }}
                        </td>
                        <td class="border p-2 text-center whitespace-pre">
                            {{ formatNumber(sendmoneyAccShow) }}
                        </td>
                        <td>
                            <img :src="modalImageSrc" :style="{
                                transform: `rotate(${rotateDeg}deg)`
                            }" class="max-w-[100px] max-h-full z-10" />

                            <!-- <img :src="modalImageSrc"
                                class="max-w-[100px] max-h-full z-10 transition-transform duration-300" :style="{
                                    transform: `rotate(${rotateDeg}deg) scale(${isHover ? 10 : 1})`,
                                    transformOrigin: 'center center'
                                }" @mouseenter="isHover = true" @mouseleave="isHover = false" /> -->
                        </td>
                    </tr>
                </tbody>
            </table>

            <h4 class="mt-3">กรุณาใส่ยอดส่งเงิน</h4>
            <input @keyup.enter="saveSendmoney" type="number" v-model="sendmoneySave"
                class=" bg-black-50 border border-black-300  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required />
            <div class="flex justify-end gap-2 mt-4">
                <button class="btn btn-success" @click="showAlert = false">บันทึก</button>
                <button class="btn btn-neutral" @click="showAlert = false">ยกเลิก</button>
            </div>
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



const isHover = ref(false);
const router = useRouter()
const route = useRoute()
const filter = useFilter()
const sendmoney = useSendmoney()
const isLoading = ref(false);
const viewType = ref('monthly')
const modalImageSrc = ref('');
const selectedDate = ref('');
const selectedAreaModel = ref('');
const sendmoneySave = ref('');

const saleShow = ref('');
const totalSaleShow = ref('');
const diffShow = ref('');
const sendmoneyShow = ref('');
const sendmoneyAccShow = ref('');

function formatYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
}



const flow = ['month', 'year', 'calendar'];


async function saveSendmoney() {
    await sendmoney.updateSendmoneyAcc(selectedAreaModel.value, selectedDate.value, sendmoneySave.value)
    
    await sendmoney.downloadtoExcel(formatDateToYYYYMMDD(dateRange.value[0]), formatDateToYYYYMMDD(dateRange.value[1]), false, '', selectedArea.value)
   
    showAlert.value = false
    // ... โค้ดบันทึก
}


const dateRange = ref();
const monthRange = ref();
const rotateDeg = ref(0);

// default today
const now = new Date();
dateRange.value = [now, now];

const selectedZone = ref(route.query.zone || '')
// const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

// ถ้า month-picker ของ Nop ใช้ string:

const sendmoneyModal = ref('')

const showImageModal = ref(false)
const selectedImages = ref([])
const selectedArea = ref('')
const selectedAreaImage = ref('')
const showModal = ref(false);
const showAlert = ref(false);

function rotateAndOpen(path) {
    // const fullUrl = 'https://apps.onetwotrading.co.th' + relativePath(path);
    // console.log(fullUrl)
    rotateDeg.value = (rotateDeg.value + 90) % 360;
    // openRotatedImage(path);
}

function openImage(path) {
    // const fullUrl = 'https://apps.onetwotrading.co.th' + relativePath(path);
    // console.log(fullUrl)
    // rotateDeg.value = (rotateDeg.value + 90) % 360;
    openRotatedImage(path, rotateDeg.value);
}



function openImageModal(prod) {
    sendmoneyModal.value = prod.sendmoney
    selectedAreaImage.value = prod.area
    selectedImages.value = prod.image || []
    showImageModal.value = true
}


async function selectedMonth(value) {
    console.log('value from datepicker:', value)
}


function openRotatedImage(imgUrl, rotateDeg = 90) {
    // const img = new Image();
    // img.crossOrigin = "anonymous"; // ป้องกัน CORS ถ้ามี

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    // console.log(imgUrl);

    img.onload = () => console.log("OK");
    img.onerror = () => console.log("CORS BLOCK");

    img.onload = () => {
        // สร้าง canvas เท่าขนาดรูป
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // หมุน 90 องศา: สลับ width/height
        canvas.width = img.height;
        canvas.height = img.width;

        // ย้ายจุดหมุนไป center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // หมุน
        ctx.rotate((rotateDeg * Math.PI) / 180);

        // วาดรูปกลับเข้ามาที่ canvas
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // แปลงเป็นรูปใหม่ (Base64)
        const rotatedUrl = canvas.toDataURL("image/jpeg");

        // เปิดแท็บใหม่โชว์รูปเลย
        const newWin = window.open();
        newWin.document.write(`<img src="${rotatedUrl}" style="max-width:100%; height:auto;" />`);
    };

    img.src = imgUrl;
}




// function onDateChange(value) {
//     dateRange.value = value;
//     console.log(value)

//     if (value && value[0]) {
//         const d = new Date(value[0]);
//         monthRange.value = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
//         console.log('monthRange', monthRange)
//     }
// }

async function onDateChange(value) {
    dateRange.value = value;

    if (value && value[0]) {
        const d = value[0];

        monthRange.value = {
            month: d.getMonth(),   // 0–11
            year: d.getFullYear()
        };

        await sendmoney.downloadtoExcel(formatDateToYYYYMMDD(value[0]), formatDateToYYYYMMDD(value[1]), false, '', selectedArea.value)

    }
}

function openModal(imagePath) {
    modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
    showModal.value = true;
}


function openAlert(area, date, sale, diff, totalSale, sendmoney, sendmoneyAcc, imagePath) {
    selectedAreaModel.value = area;
    selectedDate.value = date;
    saleShow.value = sale;
    diffShow.value = diff;
    totalSaleShow.value = totalSale;
    sendmoneyShow.value = sendmoney;
    sendmoneyAccShow.value = sendmoneyAcc;
    modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
    // modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
    showAlert.value = true;
}


function relativePath(imagePath) {
    if (imagePath && imagePath.includes("/public")) {
        return imagePath.split("/public")[1];
    } else {
        return "";
    }
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
    return data;
})


const Sumsale = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.sale) || 0)
    }, 0)
})

const totalRefund = computed(() => {
    return dailyList.value.reduce((sum, order) => {
        return sum + (Number(order.change) - Number(order.refund) || 0)
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

function formatYyyyMm(obj) {
    const y = obj.year;
    const m = String(obj.month + 1).padStart(2, "0");
    return `${y}${m}`;   // → "202508"
}

onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash', period);
    await sendmoney.downloadtoExcel('', '', false, '', '')
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

watch(selectedArea, async (newVal) => {
    if (newVal) {
        // console.log(formatYyyyMm(monthRange.value))
        // console.log(monthRange.value)
        await sendmoney.downloadtoExcel(formatDateToYYYYMMDD(dateRange.value[0]), formatDateToYYYYMMDD(dateRange.value[1]), false, '', selectedArea.value)
    }
});

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});




// async function onMonthChange(value) {
//     monthRange.value = value;
//     console.log(value)

//     if (value) {
//         const [mm, yyyy] = value.split('/');
//         const newDate = new Date(`${yyyy}-${mm}-01T00:00:00`);

//         // set dateRange ให้กระโดดไปเดือนเดียวกัน
//         dateRange.value = [newDate, newDate];
//     }
//     // console.log(dateRange.value);
//     // isLoading.value = true
//     // await sendmoney.downloadtoExcel(startDate.value, endDate.value, false)
//     // isLoading.value = false
// }


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

    const firstDate = new Date(yyyy, mm - 1, 1);
    const lastDate = new Date(yyyy, mm, 0);

    monthRange.value = value;
    dateRange.value = [firstDate, lastDate];
    isLoading.value = true
    // await sendmoney.downloadtoExcel(formatYMD(firstDate), formatYMD(endDate), false)
    // console.log(firstDate)
    // console.log(lastDate)
    // console.log(value)
    await sendmoney.downloadtoExcel(formatYMD(firstDate), formatYMD(lastDate), false, '', selectedArea.value)

    isLoading.value = false
}


</script>
