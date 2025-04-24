<script lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar, Line, Scatter, Pie } from 'vue-chartjs'
import axios from 'axios'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'App',
    components: {
        Line,
        Bar
    },
    data() {
        return {
            barData: {
                labels: ['January', 'February', 'March'],
                datasets: [{
                    data: [40, 20, 12],
                    backgroundColor: '#9BD0F5'
                }]
            },
            lineData: {
                labels: ['January', 'February', 'March'],
                datasets: [{
                    data: [10, 30, 20],
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    fill: true
                }]
            },
            options: {
                responsive: true
            },
            mounted() {
                this.fetchData();
            },
            methods: {
                async fetchData() {
                    try {
                        const response = await axios.get<ApiResponse>('http://localhost:8005/api/cash/order/getSummaryItem?area=BE215&period=202504');
                        const apiData = response.data.data;

                        // this.barData.labels = apiData.map(item => item.item);
                        // this.barData.datasets[0].data = apiData.map(item => item.count);

                        this.lineData.labels = apiData.map(item => item.item);
                        this.lineData.datasets[0].data = apiData.map(item => item.summary);

                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }
            }
        }
    }
}
</script>

<template>
    <div class="flex items-center mb-6">
        <div>Area</div>
        <select class="select select-info ms-3">
            <option disabled selected>Pick a Framework</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
        </select>
    </div>

    <div class="max-w-5xl mx-auto p-8">
        <h1 class="text-3xl font-bold mb-8">Badge Dashboard</h1>

        <div class="flex justify-end gap-6">
            <!-- Card 1 -->
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Visit</div>
                <div class="text-2xl font-bold">1,240</div>
            </div>

            <!-- Card 2 -->
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div class="badge badge-success mb-4 text-sm px-4 py-2">Effective</div>
                <div class="text-2xl font-bold">$18,500</div>
            </div>
        </div>
    </div>
    <div class="max-w-5xl mx-auto p-8">
        <h1 class="text-3xl font-bold mb-8">Badge Dashboard</h1>

        <div class="flex gap-6">
            <!-- Card 1 -->
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-1/2">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Visit</div>
                <div class="text-2xl font-bold">1,240</div>
            </div>

            <!-- Card 2 -->
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-1/2">
                <div class="badge badge-success mb-4 text-sm px-4 py-2">Effective</div>
                <div class="text-2xl font-bold">$18,500</div>
            </div>
        </div>
    </div>

    <div class="p-8">
        <h1 class="text-3xl font-bold mb-8">Badge Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Badge 1 -->
            <div class="card bg-base-100 shadow-xl p-6 flex flex-col items-center">
                <div class="badge badge-primary text-lg mb-2">Visit</div>
                <div class="text-2xl font-bold">1,240</div>
            </div>

            <!-- Badge 2 -->
            <div class="card bg-base-100 shadow-xl p-6 flex flex-col items-center">
                <div class="badge badge-success text-lg mb-2">Effective</div>
                <div class="text-2xl font-bold">$18,500</div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Bar Chart</h2>
            <Bar :data="barData" :options="options" />
        </div>

        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Line Chart</h2>
            <Line :data="lineData" :options="options" />
        </div>
    </div>
</template>
