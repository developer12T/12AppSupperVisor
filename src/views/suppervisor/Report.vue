<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">📊 SUMMARY Daily Report</h2>
        </div>

        <div class="overflow-x-auto">
            <table class="table table-zebra w-full text-sm">
                <thead>
                    <tr>
                        <th>Area</th>
                        <th>75g หมู</th>
                        <th>75g ไก่</th>
                        <th>75g เห็ดหอม</th>
                        <th>75g รวม</th>
                        <th>165g หมู</th>
                        <th>165g ไก่</th>
                        <th>165g เห็ดหอม</th>
                        <th>165g รวม</th>
                        <th>รวมทั้งหมด</th>
                        <th>เป้าหมาย</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                        <th>% ที่ได้</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, i) in reportData" :key="i">
                        <td>{{ row.area }}</td>
                        <td>{{ row["75g"].pork }}</td>
                        <td>{{ row["75g"].chicken }}</td>
                        <td>{{ row["75g"].mushroom }}</td>
                        <td>{{ row["75g"].total }}</td>
                        <td>{{ row["165g"].pork }}</td>
                        <td>{{ row["165g"].chicken }}</td>
                        <td>{{ row["165g"].mushroom }}</td>
                        <td>{{ row["165g"].total }}</td>
                        <td>{{ row.total }}</td>
                        <td>{{ row.target }}</td>
                        <td>{{ row.percentage.toFixed(2) }}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const reportData = [
    {
        area: "BE101",
        "75g": { pork: 718, chicken: 183, mushroom: 338, total: 2072 },
        "150g": { veg: 0, total: 0 },
        "165g": {
            pork: 3941, chicken: 417, mushroom: 718, light: 3997, oil: 1399, total: 10472
        },
        total: 12544,
        target: 1000,
        percentage: 1254.40
    },
    {
        area: "BE111",
        "75g": { pork: 211, chicken: 66, mushroom: 275, total: 919 },
        "150g": { veg: 0, total: 0 },
        "165g": {
            pork: 1445, chicken: 368, mushroom: 693, light: 1857, oil: 794, total: 5157
        },
        total: 6076,
        target: 190,
        percentage: 3197.89
    }
];
</script>