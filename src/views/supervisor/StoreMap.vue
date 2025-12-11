<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div>
        <div class="flex justify-between">
            <div class="flex justify-start mb-3">
                <div class="ms-3" v-if="userRole != 'supervisor'">
                    <select class="select select-info ms-3 text-center" v-model="selectedZone">
                        <option disabled value="">Select Zone</option>
                        <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                    </select>
                </div>
                
            </div>
            <div class="flex justify-end">
                <button class="btn btn-info" @click="handleFilter">มีร้านอยู่ทั้งหมด {{ stores.length }} ร้าน</button>
            </div>
        </div>
        <div id="map" style="height: 600px; width: 100%;"></div>
    </div>
</template>
<script setup>
// main.js or in your component <script> section
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import { useStoresStore } from '../../store/modules/store'
import LoadingOverlay from '../LoadingOverlay.vue'
import { useFilter } from '../../store/modules/filter'
import { useRouter, useRoute } from 'vue-router'




const storesStore = useStoresStore()
const stores = ref([]);
const isLoading = ref(false)
const filter = useFilter()

const router = useRouter()
const route = useRoute()

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


// const stores = [
//     { name: 'Store 1', lat: 13.7563, lng: 100.5018 },
//     { name: 'Store 2', lat: 13.7577, lng: 100.4981 },
//     // ...add your 1700 store objects here
// ]

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = ''
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, newVal, selectedTeam.value);
        await filter.getTeam('cash',newVal);
        await storesStore.getStoreMap(newVal)
        stores.value = storesStore.storeMap
        initLeafletMap({
            stores: stores.value,
            mapId: 'map',
            center: [13.7563, 100.5018],
            zoom: 7,
            tile: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
        isLoading.value = false
    }
});


onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash',period);
    await storesStore.getStoreMap('BE')
    stores.value = storesStore.storeMap
    initLeafletMap({
        stores: stores.value,
        mapId: 'map',
        center: [13.7563, 100.5018],
        zoom: 7,
        tile: 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}@2x?access_token=https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}@2x?access_token=AIzaSyAMMn98O_Z2GJwi_cN8lgTz9ufiF_k1B7w'
    })
    isLoading.value = false
})


function initLeafletMap({
    stores,
    mapId = 'map',
    center = [13.7563, 100.5018],
    zoom = 7,
    tile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}) {
    // (Optional) Clean up map instance if hot-reload
    if (window.__leafletMapInstance) {
        window.__leafletMapInstance.remove()
        window.__leafletMapInstance = null
    }

    const map = L.map(mapId).setView(center, zoom)

    L.tileLayer(tile, {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const markers = L.markerClusterGroup()

    stores.forEach(store => {
        // Null safety
        if (
            typeof store.latitude === 'number' && !isNaN(store.latitude) &&
            typeof store.longtitude === 'number' && !isNaN(store.longtitude)
        ) {
            const marker = L.marker([store.latitude, store.longtitude])
                .bindPopup(`
          <div style="text-align: center;">
            <b>${store.name}</b>
          </div>
          <div style="text-align: center;">
            <b>${store.storeId}</b>
          </div>
        `)
            markers.addLayer(marker)
        }
    })

    map.addLayer(markers)
    window.__leafletMapInstance = map
}
</script>

<style>
#map {
    height: 600px;
    width: 100%;
}
</style>