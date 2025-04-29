<template>
    <div class="flex justify-between">
        <h1 class="p-3 text-xl font-bold">อนุมัติร้านค้าใหม่</h1>
        <input type="date" class="input" />
        <!-- <select class="select select-info ms-3">
            <option disabled selected>Pick a Framework</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
        </select> -->
    </div>
    <div v-for="customer in customers" :key="customer.id"
        class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
        <figure class="w-1/7">
            <div class="flex flex-col items-center pt-10">
                <div v-if="customer.imageList[0]?.pathยังไม่ได้อนุมัติ">
                    <img :src="'https://apps.onetwotrading.co.th/' + relativePath(customer.imageList[0]?.path)"
                        alt="placeholder" :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                        @click="openModal(customer.imageList[0]?.path)" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภาพร้านค้า</p>
                </div>
                <div v-else>
                    <Icon icon="mdi:image-off-outline" width="150" height="150" :style="{ color: '#00569D' }" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภาพร้านค้า</p>
                </div>
            </div>
        </figure>
        <figure class="w-1/7">
            <div class="flex flex-col items-center pt-10">
                <div v-if="customer.imageList[1]?.path">
                    <img :src="'https://apps.onetwotrading.co.th/' + relativePath(customer.imageList[1]?.path)"
                        alt="placeholder" :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                        @click="openModal(customer.imageList[1]?.path)" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภ.พ. 20</p>
                </div>
                <div v-else>
                    <Icon icon="mdi:image-off-outline" width="150" height="150" :style="{ color: '#00569D' }" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภ.พ. 20</p>
                </div>
            </div>
        </figure>
        <figure class="w-1/7">
            <div class="flex flex-col items-center pt-10">
                <div v-if="customer.imageList[2]?.path">
                    <img :src="'https://apps.onetwotrading.co.th/' + relativePath(customer.imageList[2]?.path)"
                        alt="placeholder" :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                        @click="openModal(customer.imageList[2]?.path)" />
                    <p class="text-sm text-gray-600 mt-1 text-center">สำเนาบัตรประชาชน</p>
                </div>
                <div v-else>
                    <Icon icon="mdi:image-off-outline" width="150" height="150" :style="{ color: '#00569D' }" />
                    <p class="text-sm text-gray-600 mt-1 text-center">สำเนาบัตรประชาชน</p>
                </div>
            </div>
        </figure>
        <div class="card-body w-3/4">
            <div class="flex justify-between items-start">
                <div class="flex">
                    <h2 class="card-title text-xl me-2">{{ customer.name }} </h2>

                    <div
                        :class="customer.status == '20' ? 'badge badge-success' : customer.status == '15' ? 'badge badge-error' : 'badge badge-warning'">
                        {{
                            customer.status == '20' ? 'อนุมัติ' : customer.status == '15' ? 'ไม่อนุมัติ' :
                                'ยังไม่ได้อนุมัติ'
                        }} </div>
                </div>
                <div class="badge">{{ formatDate(customer.approve.dateAction) }}</div>
            </div>
            <p class="text-sm text-gray-600 msb-1">รหัสร้านค้า: {{ customer.storeId }}
            </p>
            <p class="text-sm text-gray-600 msb-1">รูท: {{ customer.route }}
            </p>
            <p class="text-sm text-gray-600 msb-1">ประเภท: {{ customer.typeName }}</p>
            <p class="text-sm text-gray-600 msb-1">เบอร์โทร: {{ customer.tel }}</p>
            <p class="text-sm text-gray-600">ที่อยู่: {{ customer.address }} {{ customer.subDistrict }} {{
                customer.district }}
                {{ customer.province }} {{ customer.postCode }}</p>
            <div class="card-actions justify-end">
                <button class="btn btn-success" @click="openGoogleMap(customer.latitude, customer.longtitude)">
                    Google Map
                </button>
                <button class="btn btn-error" @click="showConfirmationDialog(customer.storeId, customer.name)">
                    ไม่อนุมัติ
                </button>
                <button class="btn btn-primary" @click="showConfirmationDialog(customer.storeId, customer.name)">
                    อุนมัติร้านค้า
                </button>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>

    <div v-if="showModalConfirm" class="fixed inset-0  bg-black flex items-center justify-center z-50">
        <!-- Overlay -->
        <div class="bg-white p-6 rounded opacity-100 shadow-lg w-1/3 max-w-md">
            <h3 class="text-lg font-semibold mb-4">ต้องการอนุมัติ ร้านค้า {{ storeName }}</h3>
            <p class="mb-4"> รหัสร้านค้า: {{ storeId }}</p>
            <div class="flex justify-between">
                <button @click="cancelAction" class="btn btn-error">ยกเลิก</button>
                <button @click="confirmAction" class="btn btn-primary">อุนมัติร้านค้า</button>
            </div>
        </div>
    </div>
    <div v-if="showModalConfirm" class="fixed inset-0  bg-black flex items-center justify-center z-50">
        <!-- Overlay -->
        <div class="bg-white p-6 rounded opacity-100 shadow-lg w-1/3 max-w-md">
            <h3 class="text-lg font-semibold mb-4">ไม่อนุมัติร้านค้า {{ storeName }}</h3>
            <p class="mb-4"> รหัสร้านค้า: {{ storeId }}</p>

            <div class="flex justify-between">
                <button @click="cancelAction" class="btn btn-error">ยกเลิก</button>
                <button @click="rejectAction" class="btn btn-primary">ยืนยัน</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useStoresStore } from '../../store/modules/store'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'


const store = useStoresStore()
const customers = ref([])
dayjs.extend(utc)
dayjs.extend(timezone)

const showModal = ref(false);
const showModalConfirm = ref(false);
const modalImageSrc = ref('');
const storeId = ref('');
const storeName = ref('');
const area = localStorage.getItem('area')

const openGoogleMap = (latitude, longitude) => {
    // const latitude = 37.7749;   // example: San Francisco
    // const longitude = -122.4194;

    const latitudeF = parseFloat(latitude);   // example: San Francisco latitude;   
    const longitudeF = parseFloat(longitude);
    const url = `https://www.google.com/maps?q=${latitudeF},${longitudeF}`;
    window.open(url, '_blank');
};

const showConfirmationDialog = (id, name) => {
    showModalConfirm.value = true;
    storeId.value = id;
    storeName.value = name;
};

const confirmAction = async () => {
    console.log('storeId', storeId.value);
    console.log('area', area);
    try {
        await store.updateStoreStatus({ storeId: storeId.value })
        showModalConfirm.value = false;
        window.location.reload();
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
    }
};

const rejectAction = async () => {
    try {
        await store.rejectStore({ storeId: storeId.value })
        showModalConfirm.value = false;
        window.location.reload();
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
    }
};


const cancelAction = () => {
    showModalConfirm.value = false;
};

onMounted(async () => {
    await store.getCustomerAll()
    customers.value = store.storeNew.data
    // console.log("store.storeAll", store.storeNew)
    // console.log("customers", customers.storeNew)
})

function openModal(imagePath) {
    modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
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