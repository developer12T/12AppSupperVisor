<template>
    <div class="p-6 bg-gray-50">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <button class="btn btn-success" @click="goToLineCheckin">
            ดู Line การเช็คอินรวม
        </button>
        <div class="overflow-x-auto rounded-xl mt-5"
            style="min-height: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
            <table class="min-w-full border text-center text-sm bg-white">
                <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                    <tr>
                        <th class="p-2 border">No.</th>
                        <th class="p-2 border">ชื่อร้าน</th>
                        <th class="p-2 border">รหัสร้าน</th>
                        <th class="p-2 border">ที่อยู่</th>
                        <th class="p-2 border">Route</th>
                        <th class="p-2 border">เบอร์ร้าน</th>
                        <th class="p-2 border">สถานะ</th>
                        <th class="p-2 border">วันที่เช็คอิน</th>
                        <th class="p-2 border">ภาพการเช็คอิน</th>
                        <th class="p-2 border">ยอด</th>
                        <th class="p-2 border">Google map</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in routeStore.storeCheckIN" :key="item._id">
                        <td class="p-2 border">{{ index + 1 }}</td>
                        <td class="p-2 border">{{ item.storeName }}</td>
                        <td class="p-2 border">{{ item.storeId }}</td>
                        <td class="p-2 border">{{ item.storeAddress }}</td>
                        <td class="p-2 border">R{{ item.routeDay }}</td>
                        <td class="p-2 border">{{ item.phone }}</td>
                        <td class="p-2 border">{{ item.statusText }}</td>
                        <td class="p-2 border">
                            {{ formatDateTime(item.checkinDatetime) }}
                        </td>
                        <td class="p-2 border ">
                            <img :src="`${item.imageLink}`" alt="placeholder"
                                :style="{ width: '50px', height: '50px', objectFit: 'cover' }"
                                @click="openModal(item.imageLink)" />

                        </td>

                        <td class="p-2 border">{{ item.sum }}</td>
                        <td class="p-2 border">
                            <button class="btn btn-success" @click="openMap(item.mapLink)">
                                Google Map
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>
</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useRouteStore } from '../../store/modules/route'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const routeStore = useRouteStore()
const showModal = ref(false);
const modalImageSrc = ref('');


const formatDateTime = (value) => {
    if (!value) return '-'

    const d = new Date(value.replace(' ', 'T')) // รองรับ "YYYY-MM-DD HH:mm:ss"
    return new Intl.DateTimeFormat('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

const openMap = (url) => {
    if (!url) return
    window.open(url, '_blank')
}


function openModal(imagePath) {
    modalImageSrc.value = imagePath;
    showModal.value = true;
}

const formatToYYYYMMDD = (ddmmyyyy) => {
    if (!ddmmyyyy) return ''
    const [dd, mm, yyyy] = ddmmyyyy.split('-')
    return `${yyyy}${mm}${dd}`
}

const goToLineCheckin = () => {
    const yyyymmdd = formatToYYYYMMDD(route.params.date)

    const routeData = router.resolve({
        name: 'lineCheckin',
        params: {
            area: route.params.area,
            startDate: yyyymmdd,
            endDate: yyyymmdd
        }
    })
    window.open(routeData.href, '_blank')
}

onMounted(async () => {
    isLoading.value = true
    await routeStore.getStoreCheckinByDayArea(route.params.area, route.params.date)
    isLoading.value = false
})

</script>