<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

    <div class=" map-distance-overlay">
        <div class="flex justify-between">
            <div>เขต : {{ route.params.area }} รวมระยะทาง: {{ totalKm }} กม.</div>
            <div> จำนวนที่เช็คอินทั้งหมด: {{ routeStore.polyline.length }} จุด</div>
        </div>


    </div>
    <div class="flex justify-start mt-3">
        <div class="flex justify-start ms-2">
            <div>
                <input type="date" v-model="startDate" @change="onMonthChange" class="border p-2 rounded" />
                <p>เลือกวันที่: {{ formatDate(startDate) }}</p>
            </div>
        </div>
        <div class="ms-2 pt-2">ถึง</div>
        <div class="flex justify-start ms-2">
            <div>
                <input type="date" v-model="endDate" @change="onMonthChange" class="border p-2 rounded" />
                <p>เลือกวันที่: {{ formatDate(endDate) }}</p>
            </div>
        </div>
    </div>

    <div class="flex justify-between">
        <div id="map" class="mt-5">
        </div>
        <div class="ms-3 overflow-auto rounded-xl shadow mb-4 mt-4 max-h-[70vh]">
            <table class=" table w-full min-w-[600px]">
                <thead>
                    <tr class="bg-primary text-white sticky top-0 left-0 z-50">
                        <th>No</th>
                        <th>Store ID</th>
                        <th>Store Name</th>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Status</th>

                    </tr>
                </thead>
                <tbody>
                    <tr @click="gotoPoint(idx)" class="hover:bg-blue-50 cursor-pointer"
                        v-for="(item, idx) in routeStore.polyline" :key="item.storeId">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ item.storeId }}</td>
                        <td>{{ item.storeName }}</td>
                        <td>{{ item.route }}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.statusText }}</td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-300" style="position: sticky; bottom: 0;  z-index: 2;">
                    <tr class="bg-gray-300 font-bold ">
                        <td colspan="2" class="border p-2 text-left">รวมซื้อ {{ totalSale }}</td>
                        <td colspan="2" class="border p-2 text-left">รวมไม่ซื้อ {{ totalNotSale }}</td>
                        <td colspan="2" class="border p-2 text-left">รวมทั้งหมด {{ total }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouteStore } from "../../store/modules/route";
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์


const routeStore = useRouteStore();
const totalKm = ref("—");
const router = useRouter()
const route = useRoute()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const points = ref([]);      // <-- อันนี้ไว้ใช้ v-for, markers, gotoPoint
let map;
let tileLayer;
let markersLayer;   // กลุ่ม marker ไว้เคลียร์ง่ายๆ
let polylineLayer;  // เส้น polyline ปัจจุบัน
let markers = [];   // อ้างอิงเพื่อ gotoPoint

const startDate = ref('') // format: YYYY-MM
const endDate = ref('') // format: YYYY-MM

const isLoading = ref(false)
const startday = computed(() => startDate.value.split('-')[2])
const startmonth = computed(() => startDate.value.split('-')[1])
const startyear = computed(() => startDate.value.split('-')[0])

const endday = computed(() => endDate.value.split('-')[2])
const endmonth = computed(() => endDate.value.split('-')[1])
const endyear = computed(() => endDate.value.split('-')[0])
const toYMD = (s) => (s || '').replaceAll('-', ''); // '2025-08-21' -> '20250821'

function makeSVGIcon(number, bgColor = "#00569D", fontColor = "#fff") {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="18" fill="${bgColor}" stroke="#333" stroke-width="2"/>
        <text x="21" y="27" text-anchor="middle" font-size="18" font-family="Arial" font-weight="bold" fill="${fontColor}">${number}</text>
    </svg>
    `;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}

function renderMap() {
    // เคลียร์เลเยอร์เก่า
    markersLayer?.clearLayers();
    if (polylineLayer) {
        map.removeLayer(polylineLayer);
        polylineLayer = null;
    }
    markers = [];

    // เติม marker ใหม่
    const latlngs = [];
    points.value.forEach((item, idx) => {
        const color =
            item.status === '3'
                ? '#198754'
                : item.status === '2'
                    ? '#9B1C1C'
                    : '#999999'
        const icon = L.icon({
            iconUrl: makeSVGIcon(idx + 1, color),
            iconSize: [40, 40],
            iconAnchor: [21, 21],
            popupAnchor: [0, -16],
        });
        const ll = [item.lat, item.lng];
        const m = L.marker(ll, { icon })
            .bindPopup(`<b>StoreID:</b> ${item.storeId}<br><b>Route:</b> ${item.route}<br><b>Date:</b> ${item.date}`);
        markersLayer.addLayer(m);
        markers.push(m);
        latlngs.push(ll);
    });

    // วาดเส้น
    if (latlngs.length > 0) {
        polylineLayer = L.polyline(latlngs, { weight: 4 }).addTo(map);
        if (latlngs.length > 1) map.fitBounds(polylineLayer.getBounds(), { padding: [24, 24] });
        else map.setView(latlngs[0], 15);
    }

    // คำนวณระยะทาง
    let sum = 0;
    for (let i = 1; i < points.value.length; i++) {
        sum += getDistance(
            points.value[i - 1].lat, points.value[i - 1].lng,
            points.value[i].lat, points.value[i].lng
        );
    }
    totalKm.value = latlngs.length ? (sum / 1000).toFixed(2) : '0.00';
}


async function onMonthChange() {
    if (!startDate.value || !endDate.value) return;

    // ตรวจช่วงวัน (กันผู้ใช้เลือก end < start)
    if (startDate.value > endDate.value) {
        alert('วันเริ่มต้องไม่เกินวันสิ้นสุด');
        return;
    }

    isLoading.value = true;
    try {
        const startStr = toYMD(startDate.value); // 'YYYYMMDD'
        const endStr = toYMD(endDate.value);   // 'YYYYMMDD'

        // ส่งไป backend (ซึ่งจะตีความเป็นวันไทย +07:00 อยู่แล้ว)
        await routeStore.getPolyLine(period, route.params.area, startStr, endStr);

        // map points ใหม่
        points.value = routeStore.polyline.map(item => ({
            lat: item.location[1],
            lng: item.location[0],
            storeId: item.storeId,
            storeName: item.storeName,
            route: item.route,
            date: item.date,
            statusText: item.statusText,
            status: item.status,
            note: item.note,
        }));

        renderMap();
    } finally {
        isLoading.value = false;
    }
}

function getDistance(lat1, lng1, lat2, lng2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);
    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function gotoPoint(idx) {
    const item = points.value[idx];
    if (!item) return;
    map.setView([item.lat, item.lng], 16, { animate: true });
    if (markers[idx]) {
        markers[idx].openPopup();
    }
}

const totalSale = computed(() => {
    return points.value.reduce((sum, order) => {
        return sum + (String(order.status) === '3' ? 1 : 0)
    }, 0)
})

const total = computed(() => {
    return points.value.reduce((sum, order) => {
        return sum + (['2', '3', '1'].includes(String(order.status)) ? 1 : 0)
    }, 0)
})

const totalNotSale = computed(() => {
    return points.value.reduce((sum, order) => {
        return sum + (String(order.status) === '2' ? 1 : 0)
    }, 0)
})

// onMounted(async () => {
//     await routeStore.getPolyLine(period, route.params.area, '', '');
//     points.value = routeStore.polyline.map(item => ({
//         lat: item.location[1],
//         lng: item.location[0],
//         storeId: item.storeId,
//         route: item.route,
//         date: item.date,
//     }));

//     // สร้างแผนที่
//     map = L.map("map").setView(points.value[0] ?? { lat: 13.7, lng: 100.6 }, 12);

//     // Tile layer
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors"
//     }).addTo(map);

//     // Add markers and save to array
//     markers = [];
//     points.value.forEach((item, idx) => {
//         const icon = L.icon({
//             iconUrl: makeSVGIcon(idx + 1),
//             iconSize: [40, 40],
//             iconAnchor: [21, 21],
//             popupAnchor: [0, -16],
//         });
//         const marker = L.marker([item.lat, item.lng], { icon })
//             .addTo(map)
//             .bindPopup(`<b>StoreID:</b> ${item.storeId}<br><b>Route:</b> ${item.route}<br><b>Date:</b> ${item.date}`);
//         markers.push(marker);
//     });

//     // Polyline
//     const latlngs = points.value.map(p => [p.lat, p.lng]);
//     const polylineL = L.polyline(latlngs, { color: "#FF0000", weight: 4 }).addTo(map);

//     if (latlngs.length > 1) map.fitBounds(polylineL.getBounds());

//     // Distance
//     let sum = 0;
//     for (let i = 1; i < points.value.length; i++) {
//         sum += getDistance(
//             points.value[i - 1].lat,
//             points.value[i - 1].lng,
//             points.value[i].lat,
//             points.value[i].lng
//         );
//     }
//     totalKm.value = (sum / 1000).toFixed(2);
// });



onMounted(async () => {
    // สร้าง map ครั้งเดียว
    map = L.map("map", { center: [13.7, 100.6], zoom: 12 });
    tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);

    // โหลดรอบแรก (ไม่มีช่วงวัน)
    await routeStore.getPolyLine(period, route.params.area, route.params.startDate, route.params.endDate);
    points.value = routeStore.polyline.map(item => ({
        lat: item.location[1],
        lng: item.location[0],
        storeId: item.storeId,
        storeName: item.storeName,
        route: item.route,
        date: item.date,
        statusText: item.statusText,
        status: item.status,
        note: item.note,
    }));

    renderMap();
});
</script>


<style>
#map {
    width: 100%;
    height: 70vh;
    border-radius: 10px;
    box-shadow: 0 2px 10px #0002;
}

/* overlay กล่องขวาล่าง */
.map-distance-overlay {
    right: 24px;
    bottom: 24px;

    background: #222b;
    color: #fff;
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 12px;
    padding: 12px 28px;
    box-shadow: 0 4px 16px #0004;
    pointer-events: none;
    user-select: none;
}
</style>
