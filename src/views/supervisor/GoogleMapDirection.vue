<template>
    <div>
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
        <div class="w-full flex justify-between">
            <div ref="mapEl" style="width: 50%;" class="h-150"></div>

            <div class="w-1/2 p-2">
                <div class=" flex justify-between">
                    <div>
                        <div class="text-xl font-semibold text-green-700" v-if="distanceText">
                            🛣️ ระยะทางประมาณ: {{ distanceText }} A = จุดเก่า, B = จุดใหม่
                        </div>
                        <h1 class="text-xl font-bold mb-2">{{ route.query.id }} ประวัติการขอปรับ Location</h1>
                    </div>
                    <div>
                        <button @click="showConfirmationDialog('')" class="btn btn-success">อนุมัติ</button>
                        <button @click="showRejectionDialog('')" class="ms-3 btn btn-error">ไม่อนุมัติ</button>
                    </div>
                </div>
                <!-- optional search box -->
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black  flex items-center justify-center z-50">
        <div @click="showModal = false" class="absolute inset-0"></div>
        <img :src="modalImageSrc" class="max-w-full max-h-full z-10" />
    </div>
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
</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStoresStore } from '../../store/modules/store' // <-- adjust path to your Pinia store

const imageAPIPath = import.meta.env.VITE_API_IMAGE_URL;
const router = useRouter()
const route = useRoute()
const store = useStoresStore()

const id = ref('');
const status = ref('');

const isLoading = ref(false)

const map = ref(null)
const directionsService = ref(null)
const directionsRenderer = ref(null)

const mapEl = ref(null)
const distanceText = ref('')
const searchQuery = ref('')


const showModalConfirm = ref(false);
const showModalReject = ref(false);

const modalImageSrc = ref('');
const showModal = ref(false);

const filteredStores = computed(() => {
    const data = store.storeLatlong || []
    const q = (searchQuery.value || '').trim().toLowerCase()
    if (!q) return data
    return data.filter(s =>
        (s.storeId || '').toLowerCase().includes(q) ||
        (s.name || '').toLowerCase().includes(q)
    )
})

function goToMap(prod) {
    router.push({
        name: 'googleMapDirection',
        query: {
            originLat: prod.latitude,
            originLng: prod.longtitude,
            destLat: prod.latitudeOld,
            destLng: prod.longtitudeOld
        }
    })
}

function relativePath(path) {
    return path?.replace(/^.*?public\//, '') || ''
}

function statusClass(status) {
    return {
        'text-warning': status === 'pending',
        'text-green-700': status === 'completed',
        'text-green-700': status === 'approved',
        'text-red-700': status === 'canceled'
    }
}

function openModal(imagePath) {
    modalImageSrc.value = imageAPIPath + '/' + relativePath(imagePath);
    showModal.value = true;
}



function loadGoogleMapsApi() {
    return new Promise((resolve) => {
        if (window.google?.maps) return resolve()
        const script = document.createElement('script')
        // 👉 move the key to .env and inject at build time
        // e.g. VITE_GMAPS_KEY
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_KEY}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = resolve
        document.head.appendChild(script)
    })
}

function handleRowClick(prod) {
    const origin = {
        lat: parseFloat(prod.latitudeOld),
        lng: parseFloat(prod.longtitudeOld),
    }
    const destination = {
        lat: parseFloat(prod.latitude),
        lng: parseFloat(prod.longtitude),
    }

    if (
        Number.isNaN(origin.lat) || Number.isNaN(origin.lng) ||
        Number.isNaN(destination.lat) || Number.isNaN(destination.lng)
    ) {
        alert('พิกัดไม่ถูกต้อง')
        return
    }

    drawDirection(origin, destination)
}

function drawDirection(origin, destination) {
    directionsService.value.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.value.setDirections(response)
                const leg = response.routes[0]?.legs[0]
                if (leg?.distance?.text) {
                    distanceText.value = leg.distance.text
                }
            } else {
                alert('Directions request failed due to ' + status)
            }
        }
    )
}

// function initMap() {
//     const origin = {
//         lat: parseFloat(route.query.originLat),
//         lng: parseFloat(route.query.originLng)
//     }
//     const destination = {
//         lat: parseFloat(route.query.destLat),
//         lng: parseFloat(route.query.destLng)
//     }

//     if (
//         Number.isNaN(origin.lat) || Number.isNaN(origin.lng) ||
//         Number.isNaN(destination.lat) || Number.isNaN(destination.lng)
//     ) {
//         alert('Invalid coordinates provided in URL')
//         return
//     }

//     const map = new window.google.maps.Map(mapEl.value, {
//         zoom: 7,
//         center: origin
//     })

//     const directionsService = new window.google.maps.DirectionsService()
//     const directionsRenderer = new window.google.maps.DirectionsRenderer()
//     directionsRenderer.setMap(map)

//     directionsService.route(
//         {
//             origin,
//             destination,
//             travelMode: window.google.maps.TravelMode.DRIVING
//         },
//         (response, status) => {
//             if (status === 'OK') {
//                 directionsRenderer.setDirections(response)
//                 const leg = response.routes[0]?.legs[0]
//                 if (leg?.distance?.text) {
//                     distanceText.value = leg.distance.text
//                 }
//             } else {
//                 alert('Directions request failed due to ' + status)
//             }
//         }
//     )
// }

const cancelAction = () => {
    showModalConfirm.value = false;
    showModalReject.value = false;
};

function initMap() {
    const origin = {
        lat: parseFloat(route.query.originLat),
        lng: parseFloat(route.query.originLng),
    }
    const destination = {
        lat: parseFloat(route.query.destLat),
        lng: parseFloat(route.query.destLng),
    }

    if (
        Number.isNaN(origin.lat) || Number.isNaN(origin.lng) ||
        Number.isNaN(destination.lat) || Number.isNaN(destination.lng)
    ) {
        alert('Invalid coordinates provided in URL')
        return
    }

    map.value = new window.google.maps.Map(mapEl.value, {
        zoom: 7,
        center: origin,
    })

    directionsService.value = new window.google.maps.DirectionsService()
    directionsRenderer.value = new window.google.maps.DirectionsRenderer()
    directionsRenderer.value.setMap(map.value)

    drawDirection(origin, destination)
}


const approveStatus = async (status) => {
    try {
        isLoading.value = true;
        showModalConfirm.value = false;
        await store.approveLatlong({
            orderId: route.query.id,
            status: status,
        })
        isLoading.value = false;
        router.push('/supervisor/storeapprovelatlong')
    } catch (error) {
        console.log('Error confirming:', error);
        showModalConfirm.value = false;
        isLoading.value = false;
    }
};

// const rejectAction = async () => {
//     try {
//         isLoading.value = true
//         await store.updateStoreStatus({ storeId: storeId.value, status: '90' })
//         showModalConfirm.value = false;
//         isLoading.value = false
//         window.location.reload();
//     } catch (error) {
//         console.log('Error confirming:', error);
//         showModalConfirm.value = false;
//     }
// };


const showConfirmationDialog = (id) => {
    showModalConfirm.value = true;
    // storeId.value = id;
    // storeName.value = name;
};

const showRejectionDialog = (id) => {
    showModalReject.value = true;
    // storeId.value = id;
    // storeName.value = name;
};

onMounted(async () => {
    await loadGoogleMapsApi()
    initMap()
    await store.getStoreLatlong(`${route.query.storeId}`, '', '')
})

</script>
