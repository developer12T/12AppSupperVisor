<template>
    <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)] border border-black rounded-box">
        <table class="table table-zebra border-collapse min-w-[1200px] border border-black">
            <!-- Header 1 -->
            <thead>
                <tr>
                    <th
                        class="sticky top-0 left-0 z-[50] bg-primary text-white p-2 min-w-[150px] text-left border border-black">
                        ZONE
                    </th>
                    <th
                        class="sticky top-0 left-[150px] z-[40] bg-primary text-white p-2 min-w-[150px] text-left border border-black">
                        Sub-ZONE
                    </th>
                    <th v-for="(header, index) in headers" :key="index"
                        class="sticky top-0 z-[30] bg-primary text-white text-center p-2 border border-black"
                        :colspan="subHeaders.length">
                        {{ header }}
                    </th>
                </tr>
                <!-- Header 2 -->
                <tr>
                    <th class="sticky top-[35px] left-0 z-[40] bg-primary text-white p-2 border border-black"></th>
                    <th class="sticky top-[35px] left-[150px] z-[30] bg-primary text-white p-2 border border-black">
                    </th>
                    <th v-for="(subHeader, index) in headers.length * subHeaders.length" :key="index"
                        class="sticky top-[35px] z-[20] bg-primary text-white p-2 text-center border border-black">
                        {{ subHeaders[index % subHeaders.length] }}
                    </th>
                </tr>
            </thead>
            <!-- Body -->
            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                    <td class="sticky left-0 bg-base-100 p-2 z-[20] border border-black">{{ row.zone }}</td>
                    <td class="sticky left-[150px] bg-base-100 p-2 z-[10] border border-black">{{ row.subZone }}</td>
                    <td v-for="(value, colIndex) in row.data" :key="colIndex"
                        class="text-center p-2 border border-black">
                        {{ value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
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
    {
        zone: 'โซน A',
        subZone: 'สาขา 1',
        data: Array(headers.length * subHeaders.length).fill('0.00 %'),
    },
    // เพิ่ม rows ตามต้องการ
]
</script>