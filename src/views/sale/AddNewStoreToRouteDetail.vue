<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="flex justify-between">
            <div class="flex justify-start">
                <h2 class="text-2xl font-bold mb-6">จัดร้านค้าเข้า Route</h2>
                <label class="input input-bordered flex items-center gap-2 w-64 ms-3">
                    <svg class="w-5 h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                            stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input v-model="searchQuery" type="search" class="grow" placeholder="Search" />

                </label>
                <button class="ms-3 btn btn-success">บันทึก</button>
            </div>
            <div class="flex justify-start">
                <SegmentSwitch v-model="mode" :counts="counts" />
            </div>

        </div>

        <div v-if="mode === 'all'" class="flex justify-between">
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

                <table class="table-auto w-full border shadow-md">
                    <thead class=" bg-gray-100">
                        <tr>
                            <th class="p-2 border">No.</th>
                            <th class="p-2 border">รหัสร้าน</th>
                            <th class="p-2 border">ชื่อร้าน</th>
                            <th class="p-2 border">ประเภท</th>
                            <th class="p-2 border">สถานะ</th>
                            <th class="p-2 border">ลบ</th>

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
                            <td class="p-2 border  text-center">
                                <button @click="deleteToStoreChange(item)" class="btn btn-active btn-error">>></button>
                            </td>
                            <!-- <td class="p-2 border">{{ item.date }}</td> -->
                        </tr>
                    </tbody>
                </table>

            </div>
            <div class="w-10"></div>
            <div class=" w-full ">
                <div class="flex justify-between">
                    <div>
                        <h1>
                            ร้านค้าทั้งหมดของเขต {{ area || '-' }}
                        </h1>

                    </div>
                    <div class="flex justify-between">
                        <h1>
                            {{ storeAllData?.length || 0 }} ร้านค้า

                        </h1>

                    </div>

                </div>

                <table class="table-auto w-full border shadow-md">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2 border">เพิ่ม</th>
                            <th class="p-2 border">No.</th>
                            <th class="p-2 border">รหัสร้าน</th>
                            <th class="p-2 border">ชื่อร้าน</th>
                            <th class="p-2 border">ประเภท</th>
                            <th class="p-2 border">จังหวัด</th>
                            <!-- <th class="p-2 border">สถานะ</th> -->
                            <!-- <th class="p-2 border">วันที่</th> -->

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in visibleRowsStoreAll" :key="item._id"
                            class="hover:bg-blue-50 cursor-pointer">
                            <td class="p-2 border">
                                <button @click="addToStoreChange(item)" class="btn btn-active btn-success">
                                    << </button>
                            </td>
                            <td class="p-2 border">{{ startIndex + index + 1 }}</td>
                            <td class="p-2 border">{{ item.storeId }}</td>
                            <td class="p-2 border">{{ item.name }}</td>
                            <td class="p-2 border">{{ item.typeName }}</td>
                            <td class="p-2 border">{{ item.province }}</td>
                            <!-- <td class="p-2 border">{{ item.statusText }}</td> -->
                            <!-- <td class="p-2 border">{{ item.date }}</td>  -->
                        </tr>
                    </tbody>
                </table>
                <div class="table-footer flex items-center justify-between mt-2">
                    <div class="rows">
                        Rows: {{ visibleRowsStoreAll.length }}
                    </div>

                    <div class="paging flex items-center gap-2">
                        <button class="btn sm" :disabled="page === 1" @click="page--">
                            Prev
                        </button>

                        <span>Page {{ page }}</span>

                        <button class="btn sm" :disabled="!hasNextPage" @click="page++">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="mode === 'approve'" class="">
            <div>
                <div class="flex jusitify-between w-full">
                    <div>
                        <h2 class="text-xl font-bold mb-6">ร้านค้าใหม่ที่ขออนุมัติเข้า Route
                        </h2>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold mb-6">{{
                            routeStores.routeAddStores.length }} ร้าน
                        </h2>
                    </div>
                </div>

                <table class="table-auto w-full border shadow-md">
                    <thead class=" bg-gray-100">
                        <tr>
                            <th class="p-2 border">No.</th>
                            <th class="p-2 border">รหัส</th>
                            <th class="p-2 border">รหัสร้าน</th>
                            <th class="p-2 border">ชื่อร้าน</th>
                            <th class="p-2 border">สถานะ</th>
                            <th class="p-2 border">วันที่อนุมัติ</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in routeStores.routeAddStores" :key="item._id"
                            class="hover:bg-blue-50 cursor-pointer">
                            <td class="p-2 border">{{ index + 1 }}</td>
                            <td class="p-2 border">{{ item.id }}</td>
                            <td class="p-2 border">{{ item.storeId }}</td>
                            <td class="p-2 border">{{ item.name }}</td>
                            <td class="p-2 border">{{ item.statusTH }}</td>
                            <td class="p-2 border text-center">{{ item.approve?.dateSend ?? '' }}</td>
                        </tr>
                    </tbody>
                </table>
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
import SegmentSwitch from '../../components/SegmentSwitch.vue'
import "vue3-toastify/dist/index.css";

const route = useRoute()
const mode = ref('all')



const isLoading = ref(false)
const selectedMonth = ref('') // format: YYYY-MM
const storeChange = ref([])

const month = computed(() => selectedMonth.value.split('-')[1])
const year = computed(() => selectedMonth.value.split('-')[0])
const getSafe = v => (typeof v === 'string' ? v : '');

const storeAllData = ref([]);
const routeStores = useRouteStore()
const store = useStoresStore()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


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

const counts = computed(() => ({
    approve: routeStores.routeAddStores.length
}))



const filteredRowsStoreAll = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    let data = store.storeNew?.data ?? []

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

watch(searchQuery, () => {
    page.value = 1
})


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
    return endIndex.value < storeAllData.length
})

const addToStoreChange = async (item) => {
    // 🔒 กันซ้ำ (ถ้ามีอยู่แล้วไม่เพิ่ม)
    const confirmed = confirm(
        `ยืนยันเพิ่มร้าน ${item.name || item.storeId} เข้า Route ${route.params.id} ?`
    )
    if (!confirmed) return
    const exists = storeChange.value.some(
        s => s.storeId === item.storeId
    )
    if (exists) return

    // ➕ เพิ่มเข้า storeChange
    storeChange.value.push({
        ...item,
        statusText: 'เพิ่มใหม่'
    })

    await routeStores.addNewStoreToRoute(
        route.params.id, item.storeId
    )
    await routeStores.getNewStoreToRoute(period, '', '', area)

    if (routeStores.statusCode === 200) {

        toast('เพิ่มร้านค้าสำเร็จ', {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.SUCCESS,
            dangerouslyHTMLString: true
        })
    }



    // ❌ เอาออกจาก storeAll (optional แต่แนะนำ)
    // store.storeAll = store.storeAll.filter(
    //     s => s.storeId !== item.storeId
    // )
}


const deleteToStoreChange = (item) => {
    const confirmed = confirm(
        `ยืนยันลบร้าน ${item.name || item.storeId} ออกจาก Route ?`
    )
    if (!confirmed) return

    storeChange.value = storeChange.value.filter(
        s => s.storeId !== item.storeId
    )
}


onMounted(async () => {
    isLoading.value = true
    await routeStores.getRouteChangeStore(route.params.id)
    await routeStores.getNewStoreToRoute(period, '', '', area)
    await store.getCustomerAll('cash', '', area, '', '', '', '')
    storeChange.value = routeStores.routeChangeStores
    storeAllData.value = store.storeNew.data
    // console.log()
    // cardData.value = routeStores.routeChanges

    isLoading.value = false
})

</script>
