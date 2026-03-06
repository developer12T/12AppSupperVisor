<template>
    <LoadingOverlay :show="isLoading" text="กำลัง Update ข้อมูล..." />

    <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
            <div class="text-2xl font-semibold text-gray-600 mb-2">
                Update ข้อมูล PowerBI
            </div>
            <div class="text-sm text-gray-400">
                update ข้อมูลจาก M3DBPRD_BK และ Order Distribution
            </div>
            <VueDatePicker v-model="monthRange" format="MM/yyyy" month-picker @update:model-value="onMonthChange" />
            <div class="flex justify-between mt-3">
                <button class="btn btn-primary" @click="updateRouteToM3DBPRD_BK">Update Route</button>
                <button class="btn btn-secondary" @click="updateOrderDistribution">Update Withdraw</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { usePowerBi } from '../../store/modules/powerbi';
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์

import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";


const powerBiStore = usePowerBi()
const today = new Date();
const period = ref(today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0'));
const monthRange = ref();
const isLoading = ref(false)

async function updateRouteToM3DBPRD_BK() {
    try {
        isLoading.value = true;
        await powerBiStore.updateRouteToM3DBPRD_BK(period.value)

        if (powerBiStore.statusCode !== 200) {
            toast.error(`Error: ${powerBiStore.message}`)
        } else {
            toast.success('Update Route สำเร็จ')
        }
        isLoading.value = false;
    } catch (error) {
        console.error(error)
    }
}

async function updateOrderDistribution() {
    try {
        isLoading.value = true;
        await powerBiStore.updateOrderDistribution(period.value)
        if (powerBiStore.statusCode !== 200) {
            toast.error(`Error: ${powerBiStore.message}`)
        } else {
            toast.success('Update Order Distribution สำเร็จ')
        }
        isLoading.value = false;
    } catch (error) {
        console.error(error)
    }
}



async function onMonthChange(value) {
    try {
        let dateObj = null;
        console.log('Selected month:', value)

        // if (value instanceof Date) {
        //     dateObj = value;
        // } else if (value?.year && value?.month) {
        //     dateObj = new Date(value.year, value.month, 1);
        // } else if (value?.value instanceof Date) {
        //     dateObj = value.value;
        // }
        dateObj = new Date(value.year, value.month, 1);

        console.log('Parsed date object:', dateObj)


        if (!dateObj) return;

        const yyyy = dateObj.getFullYear();
        const mm = dateObj.getMonth() + 1;

        period.value = `${yyyy}${String(mm).padStart(2, '0')}`;
        console.log('Selected month:', period.value)

    } catch (error) {
        console.error(error)
    }
}


</script>
