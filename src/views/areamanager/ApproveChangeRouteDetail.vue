<template>
    <div class="p-6 bg-gray-50 ">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-start">
            <h2 class="text-2xl font-bold me-2">จัดร้านค้าเข้า Route</h2>
            <button @click="openSupervisor(item)" class="btn btn-active btn-success">
                ดูไลน์การเดินทางทั้งหมด
                <Icon icon="mdi:routes" width="24" height="24" />
            </button>
        </div>

        <div class="flex justify-between">
            <div class="w-full ">
                <div class="flex justify-between">
                    <div>
                        <h1>
                            ร้านค้าก่อนหน้ามีทั้งหมด
                        </h1>
                    </div>
                    <div>
                        <h1>
                            {{ storeChange.length }} ร้านค้า
                        </h1>

                    </div>

                </div>
                <div class="overflow-x-auto rounded-xl" style="max-height: 450px; max-width: 90vw; overflow-y: auto;">
                    <table class="table-auto w-full border shadow-md">
                        <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">

                            <tr>
                                <th class="p-2 border">No.</th>
                                <th class="p-2 border">รหัสร้าน</th>
                                <th class="p-2 border">ชื่อร้าน</th>
                                <th class="p-2 border">ประเภท</th>
                                <th class="p-2 border">สถานะ</th>
                                <!-- <th class="p-2 border">Route Show</th> -->
                                <th class="p-2 border">Google Map</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in storeChange" :key="item._id"
                                class="hover:bg-blue-50 cursor-pointer">
                                <td class="p-2 border">{{ index + 1 }}</td>
                                <td class="p-2 border">{{ item.storeId }}</td>
                                <td class="p-2 border">{{ item.name }}</td>
                                <td class="p-2 border">{{ item.typeName }}</td>
                                <td class="p-2 border">{{ item.statusText }}</td>
                                <!-- <td class="p-2 border  text-center">
                                    <button @click="openAlertDelete(item)" class="btn btn-active btn-success">
                                        <Icon icon="mdi:routes" width="24" height="24" />
                                    </button>
                                </td> -->
                                <td class="p-2 border  text-center">
                                    <button @click="openAlertDelete(item)" class="btn btn-active btn-success">
                                        <Icon icon="mdi:google" width="24" height="24" />
                                    </button>
                                </td>
                                <!-- <td class="p-2 border">{{ item.date }}</td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4"> ย้ายร้าน</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติร้าน ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-success" @click="addToStoreChange()">ย้ายร้าน</button>
                <button class="btn btn-neutral" @click="showAlert = false">ยกเลิก</button>
            </div>
        </div>
    </div>
    <div v-if="showAlertD" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4"> ลบร้านนี้ออก</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบ ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-error" @click="deleteToStoreChange()">ลบร้าน</button>
                <button class="btn btn-neutral" @click="showAlertD = false">ยกเลิก</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useFilter } from '../../store/modules/filter'
import { useRouteStore } from '../../store/modules/route'
import { useStoresStore } from '../../store/modules/store'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const route = useRoute()
const router = useRouter()
const showAlert = ref(false)
const showAlertD = ref(false)
const isLoading = ref(false)
const selectedMonth = ref('') // format: YYYY-MM
const storeChange = ref([])
const itemSelected = ref()

const month = computed(() => selectedMonth.value.split('-')[1])
const year = computed(() => selectedMonth.value.split('-')[0])
const getSafe = v => (typeof v === 'string' ? v : '');

const storeAllData = ref([]);
const routeStores = useRouteStore()
const store = useStoresStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() - 2).padStart(2, '0');


const zone = localStorage.getItem('zone')
const area = localStorage.getItem('area')
const channel = localStorage.getItem('channel')
const platformType = localStorage.getItem('platformType')
const searchQuery = ref('');

// ---- Paging ----
const page = ref(1)
const pageSize = ref(25)
const startIndex = computed(() => (page.value - 1) * pageSize.value)
const endIndex = computed(() => page.value * pageSize.value)
const filteredRowsStoreAll = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    let data = store.storeAll

    if (!query) return data

    return data.filter(item =>
        String(item.name || '').toLowerCase().includes(query) ||
        String(item.storeId || '').toLowerCase().includes(query)
    )
})

const visibleRowsStoreAll = computed(() => {
    return filteredRowsStoreAll.value.slice(
        startIndex.value,
        endIndex.value
    )
})

const openSupervisor = (area) => {
    const route = router.resolve(`/areamanager/changeroute/${area}`)
    window.open(route.href, '_blank')
}


watch(searchQuery, () => {
    page.value = 1
})


function openAlert(item) {
    itemSelected.value = item;
    showAlert.value = true;
}

function openAlertDelete(item) {
    itemSelected.value = item;
    showAlertD.value = true;

}

const allowedSortKeys = [
    'period',
    'zone',
    'area',
    'productGroup',
    'storeId',
    'target',
    'actual',
    'unit',
    'attainment',
    'variance'
]
const hasNextPage = computed(() => {
    return endIndex.value < store.storeAll.length
})

const addToStoreChange = async () => {
    try {
        // 🔒 กันซ้ำ (ถ้ามีอยู่แล้วไม่เพิ่ม
        await routeStores.addStoreToRouteChange(route.params.id, itemSelected.value.storeId)

        if (routeStores.statusCode === 201) {
            // ➕ เพิ่มเข้า storeChange
            storeChange.value.push({
                ...itemSelected.value,
                statusText: 'เพิ่มใหม่'
            })
            toast('เพิ่มร้านค้าเข้า Route สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
        } else if (routeStores.statusCode === 409) {
            toast('ร้านค้านี้มีอยู่ใน Route แล้ว', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.WARNING,
                dangerouslyHTMLString: true
            })
        } else {
            toast('เกิดข้อผิดพลาดในการเพิ่มร้านค้า', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.ERROR,
                dangerouslyHTMLString: true
            })
        }
        showAlert.value = false;
    } catch (error) {
        toast(error, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        console.error('Error adding store to route change:', error);
    }
}


const deleteToStoreChange = async () => {
    try {
        await routeStores.deleteStoreToRouteChange(route.params.id, itemSelected.value.storeId)

        if (routeStores.statusCode === 200) {
            toast('ลบร้านค้าออกจาก Route สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
        }
        storeChange.value = storeChange.value.filter(
            s => s.storeId !== itemSelected.value.storeId
        )
        showAlertD.value = false;
    } catch (error) {
        toast(error, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        // console.error('Error adding store to route change:', error);
    }

}


onMounted(async () => {

    isLoading.value = true
    await routeStores.getRouteChangeStore(route.params.id)
    await routeStores.getChangeNew(route.params.id)
    await store.getStoreAll('cash', '', area, '', '', '', '')
    storeChange.value = routeStores.routeChangesNew.length > 0 ? routeStores.routeChangesNew : routeStores.routeChangeStores
    storeAllData.value = store.storeAll
    // console.log()
    // cardData.value = routeStores.routeChanges

    isLoading.value = false
})

</script>
