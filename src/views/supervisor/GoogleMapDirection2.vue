<template>
    <div>
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="w-full flex justify-between">
            <div ref="mapEl" style="width: 50%; height: 600px" class="relative z-0"></div>

            <div class="w-1/2 p-2">
                <div class="flex justify-between">
                    <div>
                        <div class="text-xl font-semibold text-green-700" v-if="distanceText">
                            🛣️ ระยะทางประมาณ: {{ distanceText }}
                        </div>
                        <h1 class="text-xl font-bold mb-2">{{ route.query.id }} ประวัติการขอปรับ Location</h1>
                    </div>
                    <div
                        v-if="store.latLongOrderDetail && !['approved', 'rejected'].includes(store.latLongOrderDetail.status)">
                        <button @click="showConfirmationDialog" class="btn btn-success">อนุมัติ</button>
                        <button @click="showRejectionDialog" class="ms-3 btn btn-error">ไม่อนุมัติ</button>
                    </div>
                </div>

                <input v-model="searchQuery" placeholder="ค้นหาร้าน (รหัส/ชื่อ)"
                    class="mb-2 w-full border p-2 rounded" />

                <table class="min-w-full h-120 border text-center text-sm bg-white">
                    <thead class="bg-blue-800 text-white sticky top-0 z-10">
                        <tr>
                            <th class="p-2 border">Id</th>
                            <th class="p-2 border">รหัสร้าน</th>
                            <th class="p-2 border">เขต</th>
                            <th class="p-2 border">ชื่อร้าน</th>
                            <th class="p-2 border">ที่อยู่</th>
                            <th class="p-2 border">ประเภท</th>
                            <th class="p-2 border">ดูรูปภาพ</th>
                            <th class="p-2 border">สถานะ</th>
                            <th class="p-2 border">ดู Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(prod, i) in filteredStores" :key="prod.orderId" class="align-top">
                            <td class="border p-2">{{ prod.orderId }}</td>
                            <td class="border p-2 text-left">{{ prod.storeId }}</td>
                            <td class="border p-2 text-left">{{ prod.area }}</td>
                            <td class="border p-2 text-left">{{ prod.name }}</td>
                            <td class="border p-2 text-left">{{ prod.address || '-' }}</td>
                            <td class="border p-2 text-left">{{ prod.typeName }}</td>
                            <td class="border p-2 text-center whitespace-pre">
                                <img :src="`${imageAPIPath}/` + relativePath(prod.imageList[0]?.path)" alt="placeholder"
                                    :style="{ width: '75px', height: '75px', objectFit: 'cover' }"
                                    @click="openModal(prod.imageList[0]?.path)" />
                            </td>
                            <td class="border p-2">
                                <div :class="statusClass(prod.status)">
                                    {{ prod.statusTH }}
                                </div>
                            </td>
                            <td>
                                <div class="btn btn-error">
                                    <Icon @click="handleRowClick(prod)" icon="mdi:map-marker-radius-outline" width="24"
                                        height="24" style="color: #8700ff" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ภาพ Popup -->
        <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div @click="showModal = false" class="absolute inset-0"></div>
            <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
        </div>

        <!-- Confirm Modal -->
        <div v-if="showModalConfirm" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <h2 class="font-bold text-lg mb-4">ต้องการอนุมัติ Location ร้านค้า</h2>
                <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติ Location ร้านค้านี้ ?</p>
                <div class="flex justify-end gap-2">
                    <button class="btn btn-error" @click="cancelAction">ยกเลิก</button>
                    <button class="btn btn-primary" @click="approveStatus(true)">อนุมัติร้านค้า</button>
                </div>
            </div>
        </div>

        <!-- Reject Modal -->
        <div v-if="showModalReject" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                <h2 class="font-bold text-lg mb-4">ไม่อนุมัติ Location ร้านค้า</h2>
                <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการไม่อนุมัติ Location ร้านค้านี้ ?</p>
                <div class="flex justify-end gap-2">
                    <button class="btn" @click="cancelAction">ยกเลิก</button>
                    <button class="btn btn-primary" @click="approveStatus(false)">ยืนยัน</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStoresStore } from '../../store/modules/store'
import { Icon } from '@iconify/vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const imageAPIPath = import.meta.env.VITE_API_IMAGE_URL
const router = useRouter()
const route = useRoute()
const store = useStoresStore()

const isLoading = ref(false)
const mapEl = ref(null)
const map = ref(null)
const distanceText = ref('')
const searchQuery = ref('')
const showModalConfirm = ref(false)
const showModalReject = ref(false)
const modalImageSrc = ref('')
const showModal = ref(false)

const filteredStores = computed(() => {
    const data = store.storeLatlong || []
    const q = (searchQuery.value || '').trim().toLowerCase()
    if (!q) return data
    return data.filter(s =>
        (s.storeId || '').toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q)
    )
})

function relativePath(path) {
    return path?.replace(/^.*?public\//, '') || ''
}

function statusClass(status) {
    return {
        'text-warning': status === 'pending',
        'text-green-700': ['approved', 'completed'].includes(status),
        'text-red-700': status === 'canceled',
    }
}

function openModal(imagePath) {
    modalImageSrc.value = imageAPIPath + '/' + relativePath(imagePath)
    showModal.value = true
}

function handleRowClick(prod) {
    if (!map.value) return

    const origin = {
        lat: parseFloat(prod.latitudeOld),
        lng: parseFloat(prod.longtitudeOld)
    }
    const destination = {
        lat: parseFloat(prod.latitude),
        lng: parseFloat(prod.longtitude)
    }

    if (
        Number.isNaN(origin.lat) || Number.isNaN(origin.lng) ||
        Number.isNaN(destination.lat) || Number.isNaN(destination.lng)
    ) {
        alert('พิกัดไม่ถูกต้อง')
        return
    }

    map.value.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.value.removeLayer(layer)
        }
    })

    map.value.setView(origin, 15)
    drawDirection(origin, destination)
}


function drawDirection(origin, destination) {
    if (!map.value) return

    const markerA = L.marker([origin.lat, origin.lng], {
        title: 'A: จุดเก่า',
        icon: L.divIcon({
            className: 'custom-marker custom-marker-old',
            html: `
        <div class="badge bg-error text-black text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-white">
          จุดเก่า
        </div>
      `,
            iconSize: [40, 10],
            iconAnchor: [15, 30]
        })
    }).addTo(map.value)

    const markerB = L.marker([destination.lat, destination.lng], {
        title: 'B: จุดใหม่',
        icon: L.divIcon({
            className: 'custom-marker custom-marker-old',
            html: `
        <div class="badge bg-error text-black text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-white">
          จุดใหม่
        </div>
      `,
            iconSize: [50, 10],
            iconAnchor: [15, 30]
        })
    }).addTo(map.value)

    const latlngs = [[origin.lat, origin.lng], [destination.lat, destination.lng]]
    L.polyline(latlngs, { color: 'blue' }).addTo(map.value)

    const distance = map.value.distance([origin.lat, origin.lng], [destination.lat, destination.lng])
    distanceText.value = `${distance.toFixed(2)} ม.`
}

function initMap() {
    const origin = {
        lat: parseFloat(route.query.originLat),
        lng: parseFloat(route.query.originLng)
    }
    const destination = {
        lat: parseFloat(route.query.destLat),
        lng: parseFloat(route.query.destLng)
    }

    if (Number.isNaN(origin.lat) || Number.isNaN(destination.lat)) {
        alert('Invalid coordinates provided')
        return
    }

    map.value = L.map(mapEl.value).setView([origin.lat, origin.lng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value)

    drawDirection(origin, destination)
}

const cancelAction = () => {
    showModalConfirm.value = false
    showModalReject.value = false
}

const approveStatus = async (status) => {
    try {
        isLoading.value = true
        showModalConfirm.value = false
        await store.approveLatlong({
            orderId: route.query.id,
            status: status,
        })
        isLoading.value = false
        router.push('/supervisor/storeapprovelatlong')
    } catch (error) {
        console.log('Error:', error)
        isLoading.value = false
    }
}

const showConfirmationDialog = () => {
    showModalConfirm.value = true
}

const showRejectionDialog = () => {
    showModalReject.value = true
}

onMounted(async () => {
    initMap()
    await store.getStoreLatlong(`${route.query.storeId}`, '', '')
    await store.getLatLongOrderDetail(`${route.query.id}`)
})
</script>

<style scoped>
.custom-marker .marker-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /* ทำให้เป็นวงกลม */
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
}

/* วงกลมสีแดงสำหรับจุดเก่า */
.custom-marker-old .marker-label {
    background-color: #ef4444;
    /* แดง */
}

/* วงกลมสีเขียวสำหรับจุดใหม่ */
.custom-marker-new .marker-label {
    background-color: #22c55e;
    /* เขียว */
}
</style>
