<template>
    <div style="position: relative;">
        <div id="map"></div>
        <div class="map-distance-overlay">
            รวมระยะทาง: {{ totalKm }} กม.
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Loader } from "@googlemaps/js-api-loader"
import { useRouteStore } from '../../store/modules/route'

const routeStore = useRouteStore();

let waypoints = routeStore.polyline.map(item => ({
    lat: item.location[1],
    lng: item.location[0],
}))


const apiKey = import.meta.env.VITE_GMAPS_KEY // <-- ใส่ของจริงตรงนี้

// state สำหรับระยะทาง
const totalKm = ref('—')

// ฟังก์ชันสร้าง SVG marker ที่มีเลข, สีพื้น, สีตัวอักษร
function makeSVGIcon(number, bgColor = "#00569D", fontColor = "#fff") {
    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
    <circle cx="21" cy="21" r="18" fill="${bgColor}" stroke="#333" stroke-width="2"/>
    <text x="21" y="27" text-anchor="middle" font-size="18" font-family="Arial" font-weight="bold" fill="${fontColor}">${number}</text>
  </svg>
  `
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg)
}

onMounted(async () => {
    await routeStore.getPolyLine("202507", "CT223");
    const loader = new Loader({
        apiKey,
        version: "weekly",
    })

    await loader.load()

    const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: waypoints[0] ?? { lat: 13.7, lng: 100.6 },
        mapTypeId: "roadmap",
    })

    waypoints = routeStore.polyline.map(item => ({
        lat: item.location[1],
        lng: item.location[0],
    }))


    // ใส่ Marker ทุกจุด
    // Marker แบบ SVG (เลข, สีพื้น, สี font)
    routeStore.polyline.forEach((item, idx) => {
        const iconUrl = makeSVGIcon(idx + 1) // #ff6600 คือพื้น, #fff คือตัวอักษร
        const marker = new window.google.maps.Marker({
            position: { lat: item.location[1], lng: item.location[0] },
            map,
            icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(40, 40),
                labelOrigin: new window.google.maps.Point(21, 21),
                anchor: new window.google.maps.Point(21, 21)
            },
            title: item.storeId,
        })
        const info = new window.google.maps.InfoWindow({
            content: `<b>StoreID:</b> ${item.storeId}<br><b>Route:</b> ${item.route}`,
        })
        marker.addListener("click", () => info.open(map, marker))
    })

    // === Snap เส้น polyline ตามถนนจริง ===
    if (waypoints.length >= 2) {
        const directionsService = new window.google.maps.DirectionsService()
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true, // ไม่วาด marker ทับ (เพราะเราวางเอง)
            polylineOptions: {
                strokeColor: "#FF0000",
                strokeWeight: 4,
            }
        })



        // จำกัด Waypoints ต่อ 1 request ได้แค่ 23 จุดเท่านั้น!
        const origin = waypoints[0]
        const destination = waypoints[waypoints.length - 1]
        const middlePoints = waypoints.slice(1, -1).map(wp => ({ location: wp, stopover: false }))

        directionsService.route({
            origin,
            destination,
            waypoints: middlePoints,
            travelMode: "DRIVING",
            optimizeWaypoints: false,
        }, (result, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(result)

                // === คำนวณระยะทางรวม ===
                const legs = result.routes[0].legs
                let totalDistance = 0
                for (const leg of legs) {
                    totalDistance += leg.distance.value // หน่วยเมตร
                }
                // const totalKm = (totalDistance / 1000).toFixed(2)

                // // แสดงระยะทางรวมใน InfoWindow ตรงจุดปลายทาง
                // const infoWindow = new window.google.maps.InfoWindow({
                //     content: `<b>รวมระยะทาง: ${totalKm} กม.</b>`,
                //     position: destination,
                // })
                // infoWindow.open(map)

                totalKm.value = (totalDistance / 1000).toFixed(2)

                // log ใน console ด้วย
                console.log('รวมระยะทาง (กม.):', totalKm)
            } else {
                totalKm.value = "—"
                alert("Directions request failed: " + status)
            }
        })
    }
})
</script>

<style>
#map {
    width: 100%;
    height: 80vh;
    border-radius: 10px;
    box-shadow: 0 2px 10px #0002;
}

html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
}

/* --- overlay กล่องขวาล่าง --- */
.map-distance-overlay {
    position: absolute;
    right: 24px;
    bottom: 24px;
    z-index: 100;
    background: #222b;
    color: #fff;
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 12px;
    padding: 12px 28px;
    box-shadow: 0 4px 16px #0004;
    pointer-events: none;
    /* คลิกทะลุ */
    user-select: none;
}
</style>
