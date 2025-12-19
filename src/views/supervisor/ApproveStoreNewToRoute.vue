<template>
    <div>
        <div class="flex jusitify-between w-full">
            <div>
                <h2 class="text-xl font-bold mb-6">ร้านค้าใหม่ที่ขออนุมัติเข้า Route
                </h2>
            </div>
            <div>
                <h2 class="text-xl font-bold mb-6">
                    {{ routeStores.routeAddStores.length }} ร้าน
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
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useStoresStore } from '../../store/modules/store'
import { toast } from 'vue3-toastify';
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
