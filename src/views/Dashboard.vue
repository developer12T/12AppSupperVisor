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
import axios from 'axios'; // You forgot to import axios also!

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
                    label: 'BE215',
                    data: [40, 20, 12],
                    backgroundColor: '#9BD0F5'
                }, {
                    label: 'BE221',
                    data: [40, 20, 12],
                    backgroundColor: 'red'
                }],
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
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                console.log("Fetching API Data...");
                const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/cash/order/getSummaryItem?area=BE215&period=202504`);
                const apiData = response.data.data;
                this.lineData = {
                    labels: apiData.map(item => item.item),
                    datasets: [{
                        data: apiData.map(item => item.summary),
                        label: 'Line 1',
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        fill: true
                    }]
                };
                // this.lineData = {
                //     labels: apiData.map(item => item.item),
                //     datasets: [{
                //         data: apiData.map(item => item.summary),
                //         backgroundColor: 'rgba(75,192,192,0.4)',
                //         borderColor: 'rgba(75,192,192,1)',
                //         fill: true
                //     }]
                // };

            } catch (error) {
                console.error('Error fetching data:', error);
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
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Time</div>
                <select class="select select-info ms-3">
                    <option disabled selected>Pick a Framework</option>
                    <option>React</option>
                    <option>Vue</option>
                    <option>Angular</option>
                </select>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Area</div>
                <select class="select select-info ms-3">
                    <option disabled selected>Pick a Framework</option>
                    <option>React</option>
                    <option>Vue</option>
                    <option>Angular</option>
                </select>
            </div>

            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div>Zone</div>
                <select class="select select-info ms-3">
                    <option disabled selected>Pick a Framework</option>
                    <option>React</option>
                    <option>Vue</option>
                    <option>Angular</option>
                </select>
            </div>
            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48"
                :class="percentage > 70 ? 'border-2 border-green-500' : 'border-2 border-red-500'">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Visit</div>
                <div class="text-2xl font-bold">{{ percentage }}%</div>
            </div>
            <!-- Card 1 -->
            <!-- <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Visit</div>
                <div class="text-2xl font-bold">75.12%</div>
            </div> -->

            <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48"
                :class="percentageEf > 70 ? 'border-2 border-green-500' : 'border-2 border-red-500'">
                <div class="badge badge-primary mb-4 text-sm px-4 py-2">Effective</div>
                <div class="text-2xl font-bold">{{ percentageEf }}%</div>
            </div>

            <!-- Card 2 -->
            <!-- <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
                <div class="badge badge-success mb-4 text-sm px-4 py-2">Effective</div>
                <div class="text-2xl font-bold">45.12%</div>
            </div> -->
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div class="card bg-base-100 shadow-xl p-4">
            <h2 class="text-xl font-bold mb-2">Line Chart</h2>
            <Line :data="lineData2" :options="options" />
        </div>
    </div>
</template>
