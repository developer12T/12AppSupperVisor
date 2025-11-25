<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="w-full">
        <h2 class="text-xl me-2 mb-2">รายละเอียดร้านค้า </h2>
        <div class=" py-5 px-10  product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
            <div class="w-[700px]">
                <p class="text-x text-gray-600 msb-1">
                    ชื่อร้านค้า:
                    <span v-if="!isEdit">{{ storeDetail.name }}</span>
                    <input v-else v-model="editForm.name" class="input input-bordered w-full max-w-xs" />
                </p>
                <p class="text-x text-gray-600 msb-1">
                    เลขผู้เสียภาษี:
                    <span v-if="!isEdit">{{ storeDetail.taxId }}</span>
                    <input v-else v-model="editForm.taxId" class="input input-bordered w-full max-w-xs" />
                </p>
                <p class="text-x text-gray-600 msb-1">โซน: {{ storeDetail.zone }} เขต: {{ storeDetail.area }}
                </p>
                <p class="text-x text-gray-600 msb-1">รหัสร้านค้า: {{ storeDetail.storeId }}</p>
                <p class="text-x text-gray-600 msb-1">รูท: {{ storeDetail.route }} </p>
                <p class="text-x text-gray-600 msb-1">ประเภท: {{ storeDetail.typeName }}</p>
                <p class="text-x text-gray-600 msb-1">lat: {{ storeDetail.latitude }}</p>
                <p class="text-x text-gray-600">
                    ที่อยู่:
                    <span v-if="!isEdit">
                        {{ storeDetail.address }} {{ storeDetail.subDistrict }}
                        {{ storeDetail.district }} {{ storeDetail.province }} {{ storeDetail.postCode }}
                    </span>
                    <!-- <textarea v-else v-model="editForm.address" class="textarea textarea-bordered w-full"></textarea> -->
                    <!-- จังหวัด -->

                <div v-else>
                    <input v-model="editForm.address" class="input input-bordered w-full max-w-xs" />
                    <div class="mt-3">
                        <select v-model="province" @change="onProvinceChange" class="me-4 select select-bordered">
                            <option value="">เลือกจังหวัด</option>
                            <option v-for="p in provinceList" :key="p" :value="p">
                                {{ p }}
                            </option>
                        </select>
                        <select v-model="amphoe" @change="onAmphoeChange" class="select select-bordered">
                            <option value="">เลือกอำเภอ</option>
                            <option v-for="a in amphoeList" :key="a" :value="a">
                                {{ a }}
                            </option>
                        </select>
                    </div>
                    <div class="mt-3">
                        <!-- ตำบล -->
                        <select v-model="district" @change="onDistrictChange" class=" me-4 select select-bordered">
                            <option value="">เลือกตำบล</option>
                            <option v-for="d in districtList" :key="d" :value="d">
                                {{ d }}
                            </option>
                        </select>

                        <!-- Zipcode -->
                        <input class="input input-bordered" v-model="zipcode" placeholder="รหัสไปรษณีย์" readonly />
                    </div>

                    <button class="btn btn-success mt-3" @click="openConfrim">
                        <Icon icon="mdi:content-save" width="24" height="24" />
                        บันทึก
                    </button>
                </div>
                </p>
                <div class="card-actions justify-start mt-6">
                    <button class="btn btn-success"
                        @click="openGoogleMap(storeDetail.latitude, storeDetail.longtitude)">
                        <Icon icon="mdi:google" width="24" height="24" />
                        Google Map
                    </button>
                    <div v-if="platformType == 'PC'">
                        <select class="select select-info ms-3 text-center" v-model="selectedZone">
                            <option disabled value="">Select Zone</option>
                            <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                        </select>
                    </div>
                    <div v-if="platformType == 'PC'">
                        <select class="select select-info ms-3 text-center" v-model="selectedArea">
                            <option disabled value="">Select Area</option>
                            <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                        </select>
                    </div>
                    <div v-if="platformType == 'PC'">
                        <button class="btn btn-warning">
                            <Icon icon="mdi:email-sent" width="24" height="24" />
                            Sent to Store Cash
                        </button>
                    </div>
                    <button v-if="storeDetail.status == '20' && userRole == 'admin'" class="btn btn-primary"
                        @click="insertStoreToM3()">
                        <Icon icon="mdi:store-plus" width="24" height="24" />
                        นำเข้า M3
                    </button>
                    <button v-if="storeDetail.status == '20' && (userRole == 'admin' || userRole == 'supervisor' ||
                        userRole == 'area_manager' || userRole == 'sale_manager')" class="btn btn-warning"
                        @click="enableEdit()">
                        <Icon icon="mdi:lead-pencil" width="24" height="24" />
                        {{ isEdit ? "ปิดแก้ไข" : "แก้ไข" }}
                    </button>
                </div>
            </div>
            <div>
                <div class="flex justify-end">
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
    <div v-if="editMode" class="fixed inset-0 bg-black bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 class="text-xl font-semibold mb-4">ยืนยันการบันทึกข้อมูล</h2>
            <div class="flex justify-end space-x-2">
                <button type="button" class="btn" @click="editMode = false">ยกเลิก</button>
                <button type="submit" @click="editStore" class="btn btn-primary">บันทึก</button>
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
import addressData from "../../data/thai-address.json";  // ไฟล์ JSON ที่เก็บข้อมูล

const province = ref("");
const amphoe = ref("");
const district = ref("");
const zipcode = ref("");

const provinceList = ref([]);
const amphoeList = ref([]);
const districtList = ref([]);


const isLoading = ref(false)
const store = useStoresStore()
const filter = useFilter()
const router = useRouter()
const route = useRoute()
const similarStore = ref([])
const storeDetail = computed(() => store.storeDetail || { imageList: [] }) // ป้องกัน undefined


const showModal = ref(false);
const editMode = ref(false)
const showModalConfirm = ref(false);
const showModalReject = ref(false);
const modalImageSrc = ref('');
const storeId = ref('');
const storeName = ref('');

const selectedZone = ref('')
const selectedArea = ref('')
const today = new Date();
const zone = localStorage.getItem('zone')
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const userRole = localStorage.getItem('role')
const platformType = localStorage.getItem('platformType')
const isEdit = ref(false)

const editForm = ref({
    name: storeDetail.name,
    taxId: storeDetail.taxId,
    tel: storeDetail.tel,
    address: storeDetail.address,
})

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
    await filter.getZone('cash', period)
    await filter.getArea(period, zone, '');
    // สมมุติให้ store.loadSimilarStore() เป็น method ดึงร้านค้าที่คล้ายกัน
    // await store.checkSimilarStore(route.params.storeid) || []
    // similarStore.value = store.similarStore
    provinceList.value = [...new Set(addressData.map(i => i.province))];
    isLoading.value = false
})



async function toggleSwitch(storeData, status) {
    switch (status) {
        case 'store':
            storeData.store.status = storeData.store.status == '20' ? '90' : '20'
            // console.log(storeData.store.status)
            // console.log(storeData.store.storeId)
            await store.updateStoreStatusNoNewId({ storeId: storeData.store.storeId, status: storeData.store.status });
            break;
        default:
            break;
    }
}

function onProvinceChange() {
    amphoe.value = "";
    district.value = "";
    zipcode.value = "";

    amphoeList.value = [
        ...new Set(
            addressData
                .filter(i => i.province === province.value)
                .map(i => i.amphoe)
        )
    ];
}
function onAmphoeChange() {
    district.value = "";
    zipcode.value = "";

    districtList.value = [
        ...new Set(
            addressData
                .filter(i => i.province === province.value && i.amphoe === amphoe.value)
                .map(i => i.district)
        )
    ];
}

function onDistrictChange() {
    const match = addressData.find(
        i =>
            i.province === province.value &&
            i.amphoe === amphoe.value &&
            i.district === district.value
    );

    zipcode.value = match?.zipcode || "";
}

function openConfrim() {
    editMode.value = true;
}

function openModal(imagePath) {
    modalImageSrc.value = 'https://apps.onetwotrading.co.th/' + relativePath(imagePath);
    showModal.value = true;
}


function enableEdit() {
    if (!isEdit.value) {
        storeDetail
        isEdit.value = true
        // province.value = storeDetail.value.province
        // amphoe.value = storeDetail.value.subDistrict
        // district.value = storeDetail.value.district
        // zipcode.value = storeDetail.value.postCode
        // console.log(storeDetail)

        editForm.value = {
            name: storeDetail.value.name,
            taxId: storeDetail.value.taxId,
            tel: storeDetail.value.tel,
            address: storeDetail.value.address,
        }
    } else {
        isEdit.value = false
    }
}


async function editStore() {
    try {
        const zipStr = (zipcode?.value ?? "").toString();

        const data = {
            name: editForm.value.name ?? "",
            taxId: editForm.value.taxId ?? "",
            tel: editForm.value.tel ?? "",
            address: editForm.value.address ?? "",
            province: province?.value ?? "",
            provinceCode: zipStr.slice(0, 2),
            subDistrict: amphoe?.value ?? "",
            district: district?.value ?? "",
            postCode: zipStr,
        };

        const data2 = {
            name: editForm.value.name ?? "",
            taxId: editForm.value.taxId ?? "",
            tel: editForm.value.tel ?? "",
            address: editForm.value.address ?? "",
        };

        // 🔥 เช็คว่ามีข้อมูลที่อยู่ครบจริง ๆ
        const hasFullAddress =
            !!province?.value &&
            !!zipcode?.value &&
            !!amphoe?.value &&
            !!district?.value;

        editMode.value = false;
        isLoading.value = true;

        // 🔥 ส่ง API ตามเงื่อนไข
        if (hasFullAddress) {
            await store.editStore("cash", route.params.storeid, data);

            toast(`บันทึกสำเร็จ (อัปเดตข้อมูลที่อยู่ครบ)`, {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true,
            });

        } else {
            await store.editStore("cash", route.params.storeid, data2);

            toast(`บันทึกสำเร็จ (อัปเดตเฉพาะข้อมูลร้าน เพราะที่อยู่ไม่ครบ)`, {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.WARNING,
                dangerouslyHTMLString: true,
            });
        }

        // 🔄 โหลดข้อมูลใหม่
        await store.getDetailStore(route.params.storeid);
        isLoading.value = false;

    } catch (error) {
        console.error(error);

        toast(`เกิดข้อผิดพลาด: ${error.message}`, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true,
        });

        isLoading.value = false;
    }
}


function cancelEdit() {
    isEdit.value = false
}


const confirmAction = async () => {
    try {
        isLoading.value = true;
        await store.updateStoreStatus({ storeId: storeId.value, status: '20' });
        showModalConfirm.value = false;
        console.log(store.newstoreId)
        // router.replace({ name: 'StoreDetail', params: { storeid: store.newstoreId } });
        // await store.getDetailStore(storeId.value); // เรียกฟังก์ชันโหลด detail ใหม่
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
