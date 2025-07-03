<template>
    <div class="flex  justify-start gap-6 ">
        <div class="flex flex-col mt-10 justify-start gap-6 mb-3">
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                    </option>
                </select>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
        </div>
        <div class="w-full">
            <LineChart :chart-data="chartData" :chart-options="chartOptions" />
        </div>

    </div>


</template>
<script setup>
import LineChart from '../chart/LineChart.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue';
import { useReport } from "../../store/modules/report";
import { useFilter } from '../../store/modules/filter'

const headers = ref([]); // ใส่ตัวอย่างเดือน
const summaryQty = ref([]); // ใส่ตัวอย่างเดือน
const summary = ref([]); // ใส่ตัวอย่างเดือน
const rawData = ref([]); // ใส่ตัวอย่างเดือน

const router = useRouter()
const route = useRoute()

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const filter = useFilter()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const subHeaders = ['เป้าหมาย', 'ยอดขาย', 'คิดเป็น %'];
const reportStore = useReport();



// chartData: อัปเดตอัตโนมัติตาม headers
const chartData = computed(() => ({
    labels: headers.value,
    datasets: [
        {
            label: 'Summmary QTY (PCS)',
            data: summaryQty.value, // ให้มีจำนวนเท่ากับ labels.length
            yAxisID: 'y1', // 👈 ใช้แกนขวา
            fill: false,
            borderColor: 'red',
            tension: 0.1,
        },
        {
            label: 'Summmary',
            data: summary.value, // ให้มีจำนวนเท่ากับ labels.length
            fill: false,
            yAxisID: 'y',
            borderColor: 'blue',
            tension: 0.1,

        },
    ],
}));

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Performance Overview',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',

            // Optional: ซ่อน grid ของแกนขวาเพื่อไม่ให้ซ้อนกับแกนซ้าย
            grid: {
                drawOnChartArea: false,
            },
        },
    }
};

watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    router.replace({
        query: {
            ...route.query,
            zone: newVal,
            area: '' // clear old area
        }
    });
    if (newVal) {
        filter.getArea(period, newVal);
        filter.getTeam(newVal);
    }
});


onMounted(async () => {
    try {

        await reportStore.getSummary18SKU('BE224')
        await filter.getZone(period);
        rawData.value = reportStore.summary18SKU
        await filter.getZone(period);
        if (selectedZone.value) {
            await filter.getArea(period, selectedZone.value);
        }

        headers.value = rawData.value.map(item => `${item.group} ${item.groupCodeM3}`)
        summaryQty.value = rawData.value.map(item => item.summaryQty)
        summary.value = rawData.value.map(item => item.summary)
    } catch (error) {
        console.error('Error fetching chart data:', error)
    }
})
</script>
