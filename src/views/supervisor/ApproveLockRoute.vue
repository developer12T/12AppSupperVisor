<template>
    <div class="flex justify-between">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    </div>

    <div class="flex justify-start">
        <h2 class="text-2xl font-bold mb-6">อนุมัติ Location ร้านค้า</h2>
        <label class="input ms-3 input-bordered flex items-center gap-2 w-64">
            <svg class="w-5 h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input v-model="searchQuery" type="search" class="grow" placeholder="Search" />
        </label>
        <div class="ms-3" v-if="userRole != 'supervisor'">
            <select class="select select-info ms-3 text-center" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
            </select>
        </div>
        <div class="ms-3">
            <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                <option disabled value="">Select Team</option>
                <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                </option>
            </select>
        </div>
        <div class="ms-3">
            <select class="select select-info ms-3 text-center" v-model="selectedArea">
                <option disabled value="">Select Area</option>
                <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
            </select>
        </div>
    </div>
</template>


<script setup>
import LoadingOverlay from '../LoadingOverlay.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useStoresStore } from '../../store/modules/store'
import { useRouter, useRoute } from 'vue-router'
import { useFilter } from '../../store/modules/filter'


const router = useRouter()
const route = useRoute()

const filter = useFilter()
const isLoading = ref(false)
const userRole = localStorage.getItem('role')
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const zone = localStorage.getItem('zone')


onMounted(async () => {
    // isLoading.value = true
    await filter.getZone('cash', period);


    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }

    // isLoading.value = false
    // console.log("store.storeAll", store.storeNew)
})


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
        await filter.getTeam('ADMIN', newVal);
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    if (newVal) {
        // isLoading.value = true
        // isLoading.value = false
    }
});




</script>