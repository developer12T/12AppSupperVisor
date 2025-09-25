<!-- <script lang="ts">
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
import { ref } from 'vue'

const loading = ref(true)

// Your JSON data
const chartDataSource = [
    { count: 1, time: '01:00' },
    { count: 5, time: '02:00' },
    { count: 2, time: '14:00' },
    { count: 3, time: '16:00' }
]


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
        Bar,
        Scatter
    },
    data() {
        return {
            percentage: 75.12,
            percentageEf: 45.12,
            barData: {
                labels: ['January', 'February', 'March'],
                datasets: [{
                    data: [40, 20, 12],
                    backgroundColor: '#9BD0F5'
                }]
            },
            lineData: {
                labels: chartDataSource.map(item => item.time),
                datasets: [{
                    data: chartDataSource.map(item => item.count),
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
                        console.log("apiData");
                        const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/cash/order/getSummaryItem?area=BE215&period=202504`);
                        const apiData = response.data.data;
                        console.log("apiData", apiData);

                        // this.barData.labels = apiData.map(item => item.item);
                        // this.barData.datasets[0].data = apiData.map(item => item.count);

                        // this.lineData.labels = apiData.map(item => item.item);
                        // this.lineData.datasets[0].data = apiData.map(item => item.summary);

                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }
            }
        }
    }
}
</script> -->

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
} from 'chart.js';
import { Bar, Line, Scatter } from 'vue-chartjs';
import api from '../utils/axios'
import { ref, onMounted } from 'vue'
import { useFilter } from '../store/modules/filter' // path to your store
import { useRouteStore } from '../store/modules/route' // path to your store

// Define interface
interface ApiItem {
    item: string;
    count: number;
    unit: string;
    summary: number;
}

interface ApiResponse {
    status: number;
    message: string;
    data: ApiItem[];
}

// ChartJS registration
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// const fetchPosts = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cash/product/all`)
//         posts.value = response.data
//     } catch (error) {
//         console.error('Error fetching posts:', error)
//     }
// }

// onMounted(() => {
//     fetchPosts()
// })

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

export default {
    name: 'App',
    components: {
        Line,
        Bar,
        Scatter
    },
    data() {
        return {
            isLoading: false, // to track loading state
            selectedType: '',
            percentage: 0,
            percentageEf: 0,
            selectedZone: '',
            selectedArea: '',
            // selectedChannel: '',
            filter: useFilter(), // bind filter store here
            routeStore: useRouteStore(), // bind filter store here
            barData: {
                labels: [],
                datasets: [],
                // labels: ['January', 'February', 'March'],
                // datasets: [{
                //     data: [40, 20, 12],
                //     backgroundColor: 'red'
                // }]
            },
            lineData: {
                labels: [],
                datasets: [{
                    data: [],
                    label: 'Line 1',
                    backgroundColor: 'rgba(75,192,192,0.4)', // Keep the same
                    borderColor: 'rgba(75,192,192,1)',       // Keep the same
                    fill: true,
                }]
            },
            lineData2: {
                labels: ['R01', 'R02', 'R03'],
                datasets: [{
                    data: [40, 20, 12],
                    label: 'BE221',
                    backgroundColor: 'rgba(75,192,192,0.4)', // Keep the same
                    borderColor: 'rgba(75,192,192,1)',       // Keep the same
                    fill: true,
                }, {
                    data: [10, 15, 12],
                    label: 'BE215',
                    backgroundColor: 'rgba(75,192,192,0.4)', // Keep the same
                    borderColor: 'rgba(75,192,192,1)',       // Keep the same
                    fill: true,
                }, {
                    data: [20, 17, 18],
                    label: 'BE216',
                    backgroundColor: 'rgba(75,192,192,0.4)', // Keep the same
                    borderColor: 'rgba(75,192,192,1)',       // Keep the same
                    fill: true,
                }]
            },
            options: {
                responsive: true
            }
        };
    },
    mounted() {
        this.selectedType = 'year';
        // this.filter.getZone(period);
        this.fetchData();
    },
    watch: {
        selectChannel() {
            if (newVal) {

            }
        },
        selectedZone(newVal) {
            this.selectedArea = ''
            if (newVal) {
                this.filter.getArea(period, newVal, '');
                this.fetchData();
            }
        },
        selectedArea() {
            this.fetchData();
        }
    },
    methods: {

        async fetchData() {
            try {
                this.isLoading = true;
                await this.filter.getZone(period); // Load zones
                await this.routeStore.getRouteEffective('', period, '', '');

                let query = `/api/cash/order/getSummarybyArea?period=${period}&year=2025&type=${this.selectedType}`;

                if (this.selectedZone) {
                    query += `&zone=${this.selectedZone}`;
                }

                if (this.selectedArea) {
                    query += `&area=${this.selectedArea}`;
                }

                console.log("$query", query);
                console.log("Fetching API Data for type:", this.selectedType);
                const responseBarChart = await api.get(
                    query
                )
                const apiDataBar = responseBarChart.data.data;
                console.log(apiDataBar);


                // const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/cash/order/getSummaryItem?area=BE215&period=202504`);
                // const apiDataLine = response.data.data;
                // this.lineData = {
                //     labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
                //     datasets: apiDataBar.map(item => ({
                //         label: item.area,
                //         data: item.summary,
                //         backgroundColor: getRandomColor() // หรือสีคงที่ตามต้องการ
                //     }))
                // };

                // this.barData = {
                //     labels: Array.from({ length: 27 }, (_, i) => `R${i + 1}`),
                //     datasets: apiDataBar.map(item => ({
                //         label: item.area,
                //         data: item.summary,
                //         backgroundColor: getRandomColor() // หรือสีคงที่ตามต้องการ
                //     }))
                // }

                this.barData = {
                    labels: Array.from({ length: apiDataBar[0].summary.length }, (_, i) => `${i + 1}`),
                    datasets: apiDataBar.map(item => ({
                        label: item.zone,
                        data: item.summary,
                        backgroundColor: getRandomColor() // หรือสีคงที่ตามต้องการ
                    }))
                };

                function getRandomColor() {
                    const r = Math.floor(Math.random() * 200);
                    const g = Math.floor(Math.random() * 200);
                    const b = Math.floor(Math.random() * 200);
                    return `rgba(${r}, ${g}, ${b})`;
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.isLoading = false; // Stop loading
            }
        }
    }
}
</script>

<template>
    <div class="flex items-center mb-6">

    </div>
    <div class="p-1">
        <div class="flex justify-end gap-6">
            <!-- <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Channel</div>
                <select class="select select-info ms-3" v-model="selectedChannel">
                    <option disabled value="">Select Chennel</option>
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                </select>
            </div> -->
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Zone</div>
                <select class="select select-info ms-3" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Area</div>
                <select class="select select-info ms-3" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>

            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48"
                :class="routeStore.visit > 70 ? 'border-2 border-green-500' : 'border-2 border-red-500'">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Visit</div>
                <div v-if="isLoading" class="skeleton h-8 w-24 rounded"></div>
                <div v-else class="text-2xl font-bold">
                    {{ Number(routeStore.visit || 0).toFixed(2) }}%
                </div>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48"
                :class="routeStore.effective > 70 ? 'border-2 border-green-500' : 'border-2 border-red-500'">

                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Effective</div>

                <div v-if="isLoading" class="skeleton h-8 w-24 rounded"></div>

                <div v-else class="text-2xl font-bold">
                    {{ Number(routeStore.effective || 0).toFixed(2) }}%
                </div>
            </div>
            <!-- Card 2 -->
            <!-- <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div class="badge badge-success mb-4 text-sm px-4 py-2">Effective</div>
                <div class="text-2xl font-bold">45.12%</div>
            </div> -->
        </div>
    </div>
    <!-- <div class="card bg-base-100 shadow-xl p-4">
        <h2 class="text-xl font-bold mb-2">Line Chart</h2>
        <Line :data="lineData" :options="options" />
    </div> -->
    <div class="card bg-base-100 shadow-xl p-4">
        <h2 class="text-xl font-bold mb-2">Summary By Area</h2>
        <div class="flex justify-end gap-6">
            <select class="select select-info ms-3" :disabled="isLoading" v-model="selectedType" @change="fetchData">
                <option disabled selected>Select Type</option>
                <option value="year">Year</option>
                <option value="route">Route</option>
            </select>
        </div>

        <div class="text-center p-5" v-if="isLoading">
            <div class="flex flex-col justify-center items-center h-40 space-y-2">
                <span class="loading loading-spinner loading-lg text-info"></span>
                <span class="text-sm text-gray-500">Loading chart data...</span>
            </div>

        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-xl p-4">
                <h2 class="text-xl font-bold mb-2">Line Chart</h2>
                <Bar :data="barData" :options="options" />
            </div>
            <div class="card bg-base-100 shadow-xl p-4">
                <h2 class="text-xl font-bold mb-2">Line Chart</h2>
                <Line :data="barData" :options="options" />
            </div>
        </div>
    </div>
    <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Bar Chart</h2>
            <Bar :data="barData" :options="options" />
        </div>

        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Line Chart</h2>
            <Line :data="lineData" :options="options" />
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Line Chart</h2>
            <Line :data="lineData2" :options="options" />
        </div>
    </div> -->
</template>
