<template>
    <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)]  rounded-box">
        <table class="table border-separate border-spacing-0 min-w-[1800px] border border-black">
            <!-- Main Header -->
            <thead>
                <tr>
                    <th rowspan="2"
                        class="sticky top-0 left-0 z-50 bg-primary text-white text-center p-2 min-w-[120px] border border-black shadow-md">
                        AREA
                    </th>
                    <th v-for="(product, pIndex) in headers" :key="pIndex"
                        class="sticky top-0 z-40 bg-primary text-white text-center p-2 border border-black"
                        :colspan="subHeaders.length">
                        {{ product }}
                    </th>
                </tr>

                <!-- Sub Header -->
                <tr>
                    <template v-for="(product, pIndex) in headers" :key="'group-' + pIndex">
                        <th v-for="(sub, sIndex) in subHeaders" :key="`sub-${pIndex}-${sIndex}`"
                            class="sticky top-[35px] z-30 bg-primary text-white text-center p-2 border border-black">
                            {{ sub }}
                        </th>
                    </template>
                </tr>
            </thead>

            <!-- Body -->
            <tbody>
                <tr v-for="(row, rIndex) in rows" :key="rIndex">
                    <td class="sticky left-0 z-30 bg-white text-center p-2 border border-black shadow-md">
                        {{ row.area }}
                    </td>
                    <td v-for="(value, dIndex) in row.data" :key="dIndex" class="text-center p-2 border border-black"
                        :class="value.includes('%') ? 'text-red-500 font-semibold' : ''">
                        {{ value }}
                    </td>
                </tr>
            </tbody>
            <!-- Summary Row (tfoot) -->
            <tfoot>
                <tr>
                    <td
                        class="sticky left-0 bottom-0 z-40 bg-base-200 font-bold text-center p-2 border border-black shadow-md">
                        Summary
                    </td>
                    <td v-for="(value, index) in summaryRow" :key="'summary-' + index"
                        class="sticky bottom-0 z-30 bg-base-200 text-center p-2 border border-black font-semibold text-blue-800">
                        {{ value }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup>
const headers = [
    '01. ผงปรุงฟ้าไทย 75 G',
    '02. ผงปรุงฟ้าไทย 165 G',
    '03. ผงปรุงฟ้าไทย 400 G',
    '04. ผงปรุงฟ้าไทย 1000 G',
    '05. ผงปรุงฟ้าไทย แพ็ค'
]

const subHeaders = [
    'เป้าหมาย จำนวน(หีบ)',
    'ยอดขาย ที่ทำได้(หีบ)',
    'คิดเป็น % (หีบ)',
    'เป้าหมาย จำนวนร้านค้า',
    'จำนวนร้านค้า ที่ทำได้',
    'คิดเป็น % (ร้าน)'
]

const rows = Array.from({ length: 20 }, (_, i) => ({
    area: `CT${100 + i}`,
    data: Array(headers.length * subHeaders.length).fill('0.00 %')
}))

// Summary row (mocked for now)
const summaryRow = Array(headers.length * subHeaders.length).fill('0')
summaryRow[2] = '100.00 %' // example % column
summaryRow[5] = '8.33 %'
</script>
