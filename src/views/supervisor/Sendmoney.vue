<template>
    <div class="">
        <!-- Stat Cards -->
        <div class="grid grid-cols-4 gap-4">
            <div class="bg-blue-500 text-white rounded-xl flex items-center px-6 py-4 gap-3 w-full">
                <i class="fa fa-clock text-2xl"></i>
                <div class="flex flex-col flex-1">
                    <div class="flex justify-between w-full">
                        <span class="font-bold text-xl">ผลต่าง</span>
                        <span class="text-xl font-semibold">2117</span>
                    </div>
                </div>
            </div>
            <div class="bg-red-500 text-white rounded-xl flex items-center px-6 py-4 gap-3 w-full">
                <i class="fa fa-clock text-2xl"></i>
                <div class="flex flex-col flex-1">
                    <div class="flex justify-between w-full">
                        <span class="font-bold text-xl">จ่ายเงินล่าช้า</span>
                        <span class="text-xl font-semibold">2117</span>
                    </div>
                </div>
            </div>
            <div class="bg-gray-500 text-white rounded-xl flex items-center px-6 py-4 gap-3 w-full">
                <i class="fa fa-clock text-2xl"></i>
                <div class="flex flex-col flex-1">
                    <div class="flex justify-between w-full">
                        <span class="font-bold text-xl">รอบันทึก</span>
                        <span class="text-xl font-semibold">2117</span>
                    </div>
                </div>
            </div>
            <div class="bg-yellow-500 text-white rounded-xl flex items-center px-6 py-4 gap-3 w-full">
                <i class="fa fa-clock text-2xl"></i>
                <div class="flex flex-col flex-1">
                    <div class="flex justify-between w-full">
                        <span class="font-bold text-xl">รอการอนุมัติ</span>
                        <span class="text-xl font-semibold">2117</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <!-- <div class="flex gap-4 items-center">
            <div>
                <label class="block font-bold mb-1">Year</label>
                <select v-model="filters.year" class="select select-bordered w-32">
                    <option value="2025">2025</option>
                </select>
            </div>
            <div>
                <label class="block font-bold mb-1">Channel</label>
                <select v-model="filters.channel" class="select select-bordered w-40">
                    <option value="">เลือกทั้งหมด</option>
                </select>
            </div>
            <div>
                <label class="block font-bold mb-1">Zone</label>
                <select v-model="filters.zone" class="select select-bordered w-32">
                    <option value="">เลือกทั้งหมด</option>
                </select>
            </div>
            <div>
                <label class="block font-bold mb-1">Area</label>
                <select v-model="filters.area" class="select select-bordered w-32">
                    <option value="">เลือกทั้งหมด</option>
                </select>
            </div>
        </div> -->

        <!-- Chart -->
        <div class="flex  justify-between gap-6 ">
            <div class="flex flex-col mt-10 justify-start gap-6 mb-3">
                <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                    <button class="btn btn-primary" @click="clearSelect">ล้างตัวเลือก</button>
                </div>
                <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                    <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
                        <option disabled value="">Select Zone</option>
                        <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                    </select>
                </div>
                <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                    <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                        <option disabled value="">Select Team</option>
                        <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam
                            }}
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
            <div class="max-h-[calc(100vh-150px)] w-full bg-white rounded-xl p-10 mt-4">
                <LineChart :chart-data="chartData" :chart-options="chartOptions" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LineChart from '../chart/LineChart.vue'
import { useRouter, useRoute } from 'vue-router'
import { useFilter } from '../../store/modules/filter'

const router = useRouter()
const route = useRoute()
const filter = useFilter()

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

// Filters
const filters = ref({
    year: '2025',
    channel: '',
    zone: '',
    area: '',
})

// Chart Data (fix ตามตัวอย่าง)
const chartData = computed(() => ({
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    datasets: [
        {
            label: 'QR Payment',
            data: [275300, 172900, 164700, 0, 0, 0, 0, 0, 0, 0, 20000, 30000],
            borderColor: '#3399ff',
            backgroundColor: '#3399ff33',
            tension: 0.2,
            pointRadius: 6,
            pointBackgroundColor: '#17bebb',
            datalabels: {
                anchor: 'end',
                align: 'top',
                font: { weight: 'bold', size: 16 },
                formatter: v => v === 0 ? '.00' : formatValue(v)
            }
        },
        {
            label: 'Money',
            data: [2400000, 1100000, 961900, 0, 0, 0, 0, 0, 0, 0, 0, 30000],
            borderColor: '#ffa600',
            backgroundColor: '#ffa60033',
            tension: 0.2,
            pointRadius: 6,
            pointBackgroundColor: '#ff9100',
            datalabels: {
                anchor: 'end',
                align: 'top',
                font: { weight: 'bold', size: 16 },
                formatter: v => v === 0 ? '.00' : formatValue(v)
            }
        }
    ]
}))

function formatValue(val) {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M'
    if (val >= 1_000) return (val / 1_000).toFixed(1) + 'K'
    return val
}

// Chart options
const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
            callbacks: {
                label: ctx => {
                    let val = ctx.parsed.y
                    return ctx.dataset.label + ': ' + (val ? val.toLocaleString() : '0')
                }
            }
        },
        datalabels: {
            color: '#111',
            font: { weight: 'bold', size: 16 },
            formatter: v => v === 0 ? '.00' : formatValue(v)
        }
    },
    scales: {
        y: {
            ticks: {
                callback: value =>
                    value >= 1_000_000 ? (value / 1_000_000) + 'M'
                        : value >= 1_000 ? (value / 1_000) + 'K'
                            : value
            }
        }
    }
}
</script>
