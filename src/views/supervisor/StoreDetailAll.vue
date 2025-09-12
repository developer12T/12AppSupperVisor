<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="w-full">
        <h2 class="text-xl me-2 mb-2">รายละเอียดร้านค้า </h2>
        <div
            class="flex justify-between py-5 px-10  product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
            <div class="w-150">
                <div class="flex justify-start">
                    <h2 class="card-title me-2">{{ storeDetail.name }}</h2>
                    <div
                        :class="storeDetail.status == '20' ? 'badge badge-success' : storeDetail.status == '90' ? 'badge badge-error' : 'badge badge-warning'">
                        {{
                            storeDetail.status == '20' ? 'อนุมัติ' : storeDetail.status == '90' ? 'ไม่อนุมัติ' :
                                'ยังไม่ได้อนุมัติ'
                        }} </div>
                </div>
                <div class="flex justify-between ">
                    <div>
                        <p class="text-x text-gray-600 msb-1">รหัสร้านค้า: {{ storeDetail.storeId }}</p>
                        <p class="text-x text-gray-600 msb-1">รูท: {{ storeDetail.route }} </p>
                        <p class="text-x text-gray-600 msb-1">ประเภท: {{ storeDetail.typeName }}</p>
                        <p class="text-x text-gray-600 msb-1">lat: {{ storeDetail.latitude }}</p>
                        <!-- <p class="text-x text-gray-600 msb-1"> ผู้อนุมัติ: {{ storeDetail?.approve?.appPerson ??
                            'ไม่ระบุ' }}</p> -->
                    </div>
                    <div>
                        <p class="text-x text-gray-600 msb-1">เลขผู้เสียภาษี: {{ storeDetail.taxId }}</p>
                        <p class="text-x text-gray-600 msb-1">โซน: {{ storeDetail.zone }} เขต: {{ storeDetail.area }}
                        </p>
                        <p class="text-x text-gray-600 msb-1">เบอร์โทร: {{ storeDetail.tel }}</p>
                        <p class="text-x text-gray-600 msb-1">long: {{ storeDetail.longtitude }}</p>
                        <!-- <p class="text-x text-gray-600 msb-1">วันที่อนุมัติ: {{ formatDate(storeDetail.approve.dateAction) }}</p> -->
                    </div>
                </div>
                <p class="text-x text-gray-600">
                    ที่อยู่: {{ storeDetail.address }} {{ storeDetail.subDistrict }}
                    {{ storeDetail.district }} {{ storeDetail.province }} {{ storeDetail.postCode }}
                </p>
                <div class="card-actions justify-start mt-6">
                    <button class="btn btn-success"
                        @click="openGoogleMap(storeDetail.latitude, storeDetail.longtitude)">
                        <Icon icon="mdi:google" width="24" height="24" />
                        Google Map
                    </button>
                    <button class="btn btn-primary" @click="insertStoreToM3()">
                        <Icon icon="mdi:store-plus" width="24" height="24" />
                        นำเข้า M3
                    </button>
                </div>
            </div>
            <div>
                <div class="flex justify-start">
                    <figure class="" v-for="(caption, idx) in ['ภาพร้านค้า', 'ภ.พ. 20', 'สำเนาบัตรประชาชน']" :key="idx">
                        <div class="flex flex-col items-center pt-10">
                            <div
                                v-if="storeDetail.imageList && storeDetail.imageList[idx] && storeDetail.imageList[idx].path">
                                <img :src="'https://apps.onetwotrading.co.th/' + relativePath(storeDetail.imageList[idx].path)"
                                    alt="placeholder" :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                                    @click="openModal(storeDetail.imageList[idx].path)" />
                                <p class="text-sm text-gray-600 mt-1 text-center">{{ caption }}</p>
                            </div>
                            <div v-else>
                                <Icon icon="mdi:image-off-outline" width="150" height="150"
                                    :style="{ color: '#00569D' }" />
                                <p class="text-sm text-gray-600 mt-1 text-center">{{ caption }}</p>
                            </div>
                        </div>
                    </figure>
                </div>

            </div>
        </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>
    <div v-if="showModalConfirm" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4">ต้องการอนุมัติ ร้านค้า {{ storeName }}</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติรหัสร้านค้านี้ ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-error" @click="cancelAction">ยกเลิก</button>
                <button class="btn btn-primary" @click="confirmAction">อนุมัติร้านค้า</button>
            </div>
        </div>
    </div>

</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue'
import { ref, onMounted, computed, watch } from 'vue'
import { useStoresStore } from '../../store/modules/store'
import { useRouter, useRoute } from 'vue-router'
import { useFilter } from '../../store/modules/filter'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const isLoading = ref(false)
const store = useStoresStore()
const filter = useFilter()
const router = useRouter()
const route = useRoute()
const similarStore = ref([])
const storeDetail = computed(() => store.storeDetail || { imageList: [] }) // ป้องกัน undefined


const showModal = ref(false);
const showModalConfirm = ref(false);
const showModalReject = ref(false);
const modalImageSrc = ref('');
const storeId = ref('');
const storeName = ref('');

const selectedZone = ref('')
const selectedArea = ref('')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');



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
    await store.getDetailStore(route.params.storeid)
    await filter.getZone(period)
    // สมมุติให้ store.loadSimilarStore() เป็น method ดึงร้านค้าที่คล้ายกัน
    // await store.checkSimilarStore(route.params.storeid) || []
    // similarStore.value = store.similarStore
    isLoading.value = false
})



async function toggleSwitch(storeData, status) {
    switch (status) {
        case 'store':
            storeData.store.status = storeData.store.status == '20' ? '90' : '20'
            console.log(storeData.store.status)
            console.log(storeData.store.storeId)
            await store.updateStoreStatusNoNewId({ storeId: storeData.store.storeId, status: storeData.store.status });
            break;
        default:
            break;
    }
}


function openModal(imagePath) {
    modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
    showModal.value = true;
}

const confirmAction = async () => {
    try {
        isLoading.value = true;
        await store.updateStoreStatus({ storeId: storeId.value, status: '20' });
        showModalConfirm.value = false;
        router.replace({ name: 'StoreDetail', params: { storeid: store.newstoreId } });
        await store.getDetailStore(storeId.value); // เรียกฟังก์ชันโหลด detail ใหม่
        isLoading.value = false;
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
        isLoading.value = false;
    }
};

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        filter.getArea(period, newVal, '');
    }
});
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



function relativePath(imagePath) {
    if (imagePath && imagePath.includes("/public")) {
        return imagePath.split("/public")[1];
    } else {
        return "";
    }
}

const showRejectionDialog = (id, name) => {
    showModalReject.value = true;
    storeId.value = id;
    storeName.value = name;
};


const showConfirmationDialog = (id, name) => {
    showModalConfirm.value = true;
    storeId.value = id;
    storeName.value = name;
};

const openGoogleMap = (latitude, longitude) => {
    const latitudeF = parseFloat(latitude);   // example: San Francisco latitude;   
    const longitudeF = parseFloat(longitude);
    const url = `https://www.google.com/maps?q=${latitudeF},${longitudeF}`;
    window.open(url, '_blank');
};

const insertStoreToM3 = async () => {
    await store.insertToM3(route.params.storeid);
    if (store.statusCode == 201) {
        toast(`นำเข้าสำเร็จ!`, {
            "theme": toast.THEME.COLORED,
            "type": toast.TYPE.SUCCESS,
            "dangerouslyHTMLString": true
        })
    } else if (store.statusCode == 400) {
        toast(`มีร้านค้าอยู่แล้วใน M3`, {
            "theme": toast.THEME.COLORED,
            "type": toast.TYPE.ERROR,
            "dangerouslyHTMLString": true
        })
    } else {
        toast(`Error ${store.message}`, {
            "theme": toast.THEME.COLORED,
            "type": toast.TYPE.ERROR,
            "dangerouslyHTMLString": true
        })
    }
};

const cancelAction = () => {
    showModalConfirm.value = false;
    showModalReject.value = false;
};
</script>
