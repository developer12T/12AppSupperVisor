<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div>
        <div class="flex justify-between">
            <div class="flex flex-wrap items-center gap-3 mb-3">
                <select class="select select-info text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone.zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
                <select v-if="areaList.length" class="select select-info text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in areaList" :key="area.area" :value="area.area">{{ area.area }}</option>
                </select>
                <select v-if="teamList.length" class="select select-info text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in teamList" :key="team.team" :value="team.team">{{ team.team }}</option>
                </select>
            </div>
            <div class="flex justify-end">
                <button class="btn btn-info" @click="handleFilter">มีร้าน {{ stores.length }} ร้าน</button>
            </div>
        </div>
        <div id="map" style="height: 500px; width: 100%;"></div>
        <div class="flex gap-2 items-center mt-2">
            <span v-for="(color, zone) in zoneColors" :key="zone" class="flex items-center">
                <span
                    :style="{ background: color, width: '18px', height: '18px', borderRadius: '100%', display: 'inline-block', marginRight: '6px', border: '1px solid #ccc' }"></span>
                {{ zone }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import LoadingOverlay from '../LoadingOverlay.vue'
import { useStoresStore } from '../../store/modules/store'
import { useFilter } from '../../store/modules/filter'
import { MarkerClusterer } from "@googlemaps/markerclusterer"

const storesStore = useStoresStore()
const filter = useFilter()
const stores = ref([])
const isLoading = ref(false)

const selectedZone = ref('')
const selectedArea = ref('')
const selectedTeam = ref('')

// For dropdowns
const areaList = ref([])
const teamList = ref([])

const GOOGLE_MAPS_API_KEY = 'AIzaSyAMMn98O_Z2GJwi_cN8lgTz9ufiF_k1B7w'
const mapStyle = [{ stylers: [{ saturation: -100 }, { lightness: 10 }] }]
let map = null
let clusterer = null

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const zoneColors = {
    BE: '#4285F4',   // กลาง - ฟ้า
    NE: '#34A853',   // อีสาน - เขียว
    NS: '#F9AB00',   // ใต้ - เหลืองทอง
    NH: '#9C27B0',   // เหนือ - ม่วง
    SH: '#FF7043',   // ตะวันออก - ส้ม
    CT: '#00ACC1',   // ตะวันตก - ฟ้าน้ำทะเล
    // เพิ่ม zone อื่นได้
}

watch(selectedZone, async (zone) => {
    selectedArea.value = ''
    selectedTeam.value = ''
    areaList.value = []
    teamList.value = []
    stores.value = []
    if (zone) {
        isLoading.value = true
        await filter.getArea(null, zone)
        areaList.value = filter.area || []
        await storesStore.getStoreMap(zone)
        stores.value = storesStore.storeMap
        renderGoogleMap()
        isLoading.value = false
    }
})
watch(selectedArea, async (area) => {
    selectedTeam.value = ''
    teamList.value = []
    stores.value = []
    if (area && selectedZone.value) {
        isLoading.value = true
        await filter.getTeam(selectedZone.value, area)
        teamList.value = filter.team || []
        await storesStore.getStoreMap(selectedZone.value, area)
        stores.value = storesStore.storeMap
        renderGoogleMap()
        isLoading.value = false
    }
})
watch(selectedTeam, async (team) => {
    if (team && selectedZone.value && selectedArea.value) {
        isLoading.value = true
        await storesStore.getStoreMap(selectedZone.value, selectedArea.value, team)
        stores.value = storesStore.storeMap
        renderGoogleMap()
        isLoading.value = false
    }
})

onMounted(async () => {
    isLoading.value = true
    await filter.getZone(period)
    await storesStore.getStoreMap('')
    stores.value = storesStore.storeMap
    loadGoogleMaps(GOOGLE_MAPS_API_KEY, renderGoogleMap)
    isLoading.value = false
})

function loadGoogleMaps(apiKey, callback) {
    if (window.google && window.google.maps) {
        callback()
        return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=th&callback=initMap`
    script.async = true
    window.initMap = callback
    document.head.appendChild(script)
}

function markerSvgIcon(color) {
    const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" fill="${color}" stroke="white" stroke-width="4"/>
      <circle cx="20" cy="20" r="6" fill="white"/>
    </svg>
    `
    return {
        url: 'data:image/svg+xml;base64,' + btoa(svg),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
    }
}

function getClusterIcon(color, count) {
    const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="#fff" stroke-width="3"/>
      <text x="20" y="23" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial" dominant-baseline="middle">${count}</text>
    </svg>
    `
    return "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svg)))
}

function renderGoogleMap() {
    const mapEl = document.getElementById('map')
    if (!mapEl) return
    mapEl.innerHTML = ""
    const center = { lat: 13.7563, lng: 100.5018 }
    map = new window.google.maps.Map(mapEl, {
        center,
        zoom: 7,
        styles: mapStyle
    })

    // Remove old clusterer if any
    if (clusterer) clusterer.clearMarkers()

    // สร้าง markers พร้อมสี
    const markers = stores.value.map(store => {
        let lat = typeof store.latitude === 'number' ? store.latitude : parseFloat(store.latitude)
        let lng = typeof store.longitude === 'number' ? store.longitude : parseFloat(store.longitude)
        if (isNaN(lat) || isNaN(lng)) return null

        const color = zoneColors[store.zone] || '#757575'
        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: store.name,
            icon: markerSvgIcon(color)
        })
        // แนบ zone ให้ marker เพื่อใช้กับ cluster renderer
        marker._zone = store.zone
        // เพิ่ม InfoWindow
        const infoWindow = new window.google.maps.InfoWindow({
            content: `
                <div style="text-align: center;">
                    <b>${store.name}</b><br>
                    <b>${store.storeId}</b>
                </div>
            `
        })
        marker.addListener('click', () => infoWindow.open(map, marker))
        return marker
    }).filter(Boolean)

    // Cluster สีตาม zone ที่เยอะสุดใน cluster
    clusterer = new MarkerClusterer({
        map,
        markers,
        renderer: {
            render({ count, markers, position }) {
                // นับ zone ใน cluster
                const zoneCount = {}
                markers.forEach(m => {
                    const z = m._zone || 'UNKNOWN'
                    zoneCount[z] = (zoneCount[z] || 0) + 1
                })
                // หา zone ที่เยอะสุด
                let maxZone = 'UNKNOWN', maxCount = 0
                for (const [z, c] of Object.entries(zoneCount)) {
                    if (c > maxCount) {
                        maxZone = z
                        maxCount = c
                    }
                }
                const color = zoneColors[maxZone] || '#757575'
                return new window.google.maps.Marker({
                    position,
                    icon: {
                        url: getClusterIcon(color, count),
                        scaledSize: new window.google.maps.Size(40, 40)
                    }
                })
            }
        }
    })
}

function handleFilter() {
    renderGoogleMap()
}
</script>
