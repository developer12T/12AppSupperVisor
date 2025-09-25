<template>
    <div class="flex justify-between">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">อนุมัติ Location ร้านค้า</h2>
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
        <div class="flex justify-start">
            <div class="ms-3" v-if="userRole != 'supervisor'">
                <div>
                    <input type="month" v-model="selectedMonth" @change="onMonthChange" class="border p-2 rounded" />
                    <!-- ตัวอย่างแสดงค่าที่เลือก -->
                    <p>Month: {{ month }}, Year: {{ year }}</p>
                </div>
            </div>
            <button class="btn btn-success text-white" @click="exportExcel">Export Excel</button>

        </div>

    </div>
    <div class="overflow-x-auto rounded-xl"
        style="min-width: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border">Id</th>
                    <th class="p-2 border">รหัสร้าน</th>
                    <th class="p-2 border">เขต</th>
                    <th class="p-2 border">ชื่อร้าน</th>
                    <th class="p-2 border">ที่อยู่</th>
                    <th class="p-2 border">ประเภท</th>
                    <th class="p-2 border">ดูรูปภาพ</th>
                    <th class="p-2 border">สถานะ</th>
                    <th class="p-2 border">รายละเอียด</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(prod, i) in filteredStores" :key="prod.orderId" class="align-top">
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.orderId }}</div>
                    </td>
                    <td class="border p-2 text-left whitespace-pre">
                        <div class="">{{ prod.storeId }}</div>
                    </td>
                    <td class="border p-2 text-left whitespace-pre">
                        <div class="">{{ prod.area }}</div>
                    </td>
                    <td class="border p-2 text-left whitespace-pre">
                        <div class="">{{ prod.name }}</div>
                    </td>
                    <td class="border p-2 text-left whitespace-pre">
                        <div class="">{{ prod.address }}</div>
                    </td>
                    <td class="border p-2 text-left whitespace-pre">
                        <div class="">{{ prod.typeName }}</div>
                    </td>

                    <td class="border p-2 text-center whitespace-pre">
                        <img :src="`${imageAPIPath}` + relativePath(prod.imageList[0]?.path)" alt="placeholder"
                            :style="{ width: '75px', height: '75px', objectFit: 'cover' }"
                            @click="openModal(prod.imageList[0]?.path)" />
                    </td>

                    <td class="border p-2 text-center whitespace-pre">
                        <div :class="{
                            'text-warning': prod.status === 'pending',
                            'text-green-700': prod.status === 'completed',
                            'text-green-700': prod.status === 'approved',
                            'text-red-700': prod.status === 'canceled'
                        }">
                            {{ prod.statusTH }}</div>
                    </td>
                    <td class="border p-2 text-center whitespace-pre">
                        <div class=""> <button class="btn btn-success" @click="$router.push({
                            name: 'googleMapDirection',
                            query: {
                                originLat: prod.latitude,
                                originLng: prod.longtitude,
                                destLat: prod.latitudeOld,
                                destLng: prod.longtitudeOld,
                                id: prod.orderId,
                                storeId: prod.storeId
                            }
                        })">
                                ดูรายละเอียด
                            </button>
                        </div>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>

</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { Icon } from '@iconify/vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useStoresStore } from '../../store/modules/store'
import { useRouter, useRoute } from 'vue-router'
import { useFilter } from '../../store/modules/filter'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Slide } from 'vue3-toastify'


const selectedMonth = ref('') // format: YYYY-MM
const imageAPIPath = import.meta.env.VITE_API_IMAGE_URL;

const month = computed(() => selectedMonth.value.split('-')[1])
const year = computed(() => selectedMonth.value.split('-')[0])
const getSafe = v => (typeof v === 'string' ? v : '');


const store = useStoresStore()
const filter = useFilter()

const router = useRouter()
const route = useRoute()

const customers = ref([])
dayjs.extend(utc)
dayjs.extend(timezone)

const userRole = localStorage.getItem('role')
const searchQuery = ref('');
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const showModal = ref(false);
const showModalConfirm = ref(false);
const showModalReject = ref(false);
const modalImageSrc = ref('');
const storeId = ref('');
const storeName = ref('');
const isLoading = ref(false)
const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const zone = localStorage.getItem('zone')


async function exportExcel() {
    await store.downloadExcel(`${month.value}${year.value}`)
    // await reportStore.downloadExcel(
    //     formatDate2(selectedDateStart.value),
    //     formatDate2(selectedDateEnd.value)
    // )
}



async function onMonthChange() {
    // ส่งค่า month, year ไป filter API หรือฟังก์ชันอื่น
    // ตัวอย่าง:
    isLoading.value = true
    console.log('เลือกเดือน:', month.value)
    console.log('เลือกปี:', year.value)
    // console.log('selectedMonth:', selectedMonth.value)
    await store.getCustomerAll(selectedZone.value, selectedArea.value, selectedTeam.value, year.value, month.value)
    customers.value = store.storeNew.data
    isLoading.value = false
}


const openGoogleMap = (latitude, longitude) => {
    // const latitude = 37.7749;   // example: San Francisco
    // const longitude = -122.4194;
    const latitudeF = parseFloat(latitude);   // example: San Francisco latitude;   
    const longitudeF = parseFloat(longitude);
    const url = `https://www.google.com/maps?q=${latitudeF},${longitudeF}`;
    window.open(url, '_blank');
};

const showRejectionDialog = (id, name) => {
    showModalReject.value = true;
    storeId.value = id;
    storeName.value = name;
};



const confirmAction = async () => {
    console.log('storeId', storeId.value);
    // console.log('area', area);
    try {
        isLoading.value = true
        await store.updateStoreStatus({ storeId: storeId.value, status: '20' })
        showModalConfirm.value = false;
        isLoading.value = false
        window.location.reload();
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
    }
};

const rejectAction = async () => {
    try {
        isLoading.value = true
        await store.updateStoreStatus({ storeId: storeId.value, status: '90' })
        showModalConfirm.value = false;
        isLoading.value = false
        window.location.reload();
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
    }
};


const cancelAction = () => {
    showModalConfirm.value = false;
    showModalReject.value = false;
};

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, selectedZone.value, newVal);
        await store.getCustomerAll(selectedZone.value, selectedArea.value, newVal, getSafe(year.value),
            getSafe(month.value),)
        customers.value = store.storeNew.data
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    if (newVal) {
        isLoading.value = true
        await store.getCustomerAll(selectedZone.value, newVal, selectedTeam.value, getSafe(year.value),
            getSafe(month.value))
        customers.value = store.storeNew.data
        isLoading.value = false
    }
});

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = ''
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, newVal, selectedTeam.value);
        await filter.getTeam(newVal);
        await store.getCustomerAll(newVal, selectedArea.value, selectedTeam.value, getSafe(year.value),
            getSafe(month.value))
        customers.value = store.storeNew.data
        isLoading.value = false
    }
});

const filteredStores = computed(() => {
    let data = store.storeLatlong;
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        data = data.filter(store =>
            (store.storeId || '').toLowerCase().includes(query) ||
            (store.name || '').toLowerCase().includes(query)
        );
    }
    return data;
});



onMounted(async () => {
    isLoading.value = true
    await store.getStoreLatlong('', '', '')
    await filter.getZone(period);

    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }

    customers.value = store.storeLatlong
    isLoading.value = false
    // console.log("store.storeAll", store.storeNew)
    console.log("customers", customers.value)
})

function openModal(imagePath) {
    modalImageSrc.value = imageAPIPath + relativePath(imagePath);
    showModal.value = true;
}


function formatDate(utcDateStr) {
    return dayjs.utc(utcDateStr).tz('Asia/Bangkok').format('DD-MM-YYYY HH:mm:ss')
}


function addToCart(productId) {
    console.log('Add to cart:', productId)
    // You can add real logic here, like dispatching to a cart store or API call
}

function relativePath(imagePath) {
    if (imagePath && imagePath.includes("/public")) {
        return imagePath.split("/public")[1];
    } else {
        return "";
    }
}
</script>

<style scoped>
.product-landscape-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    width: 100%;
}

.product-landscape-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.product-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
}

img {
    transition: transform 0.2s ease;
}

img:hover {
    transform: scale(1.03);
}
</style>