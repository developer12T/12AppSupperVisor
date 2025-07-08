<!-- components/LineChart.vue -->
<template>
    <Line :data="chartData" :options="chartOptions" :plugins="[ChartDataLabels]" />
</template>

<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js'
import { Line } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels,)

const props = defineProps({
    chartData: Object,
    chartOptions: Object
})
</script>