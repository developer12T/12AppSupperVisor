<template>
    <div class="mb-6">
        <LineChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>

</template>

<script setup>
import LineChart from '../chart/LineChart.vue'
const headers = ['ขอสําเร็จรูป + ขอแยก', '17. ซุปน้ำ 25 มล.', '18. ผงเขย่า', '18. ผงเขย่า', '18. ผงเขย่า', '18. ผงเขย่า', '18. ผงเขย่า', 'สรุป']
const subHeaders = ['เป้าหมาย', 'ยอดขาย', 'คิดเป็น %']
const rows = [
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },

    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
]

// Sample chart data
const chartData = {
    labels: headers,
    datasets: [
        {
            label: 'คิดเป็น %',
            data: [12, 19, 3, 5, 2, 3, 25, 8],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
    ]
}



const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Performance Overview'
        }
    }
}
</script>