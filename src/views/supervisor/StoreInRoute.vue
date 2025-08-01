<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Area Summary</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 rounded-xl shadow">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-3 py-2 text-left">Area</th>
                        <th v-for="r in rangeKeys" :key="r" class="px-3 py-2 text-center">{{ r }}</th>
                        <th class="px-3 py-2 text-center">R</th>
                        <th class="px-3 py-2 text-center">del</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.area" class="hover:bg-gray-50">
                        <td class="px-3 py-2 font-semibold">{{ item.area }}</td>
                        <td v-for="r in rangeKeys" :key="r" class="px-3 py-2 text-center">{{ item[r] ?? '-' }}</td>
                        <td class="px-3 py-2 text-center font-bold">{{ item.R }}</td>
                        <td class="px-3 py-2 text-center">{{ item.del }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ตัวอย่าง data จริงเอามาจาก props หรือ API ก็ได้
const data = ref([
    {
        "area": "BE211",
        "R01": 35, "R02": 36, "R03": 39, "R04": 36, "R05": 31, "R06": 42, "R07": 50, "R08": 36, "R09": 38, "R10": 37,
        "R11": 37, "R12": 39, "R13": 37, "R14": 33, "R15": 32, "R16": 32, "R17": 33, "R18": 39, "R19": 36, "R20": 33,
        "R21": 40, "R22": 36, "R23": 30, "R24": 29, "R25": 34,
        "R": 814, "del": 341
    },
    {
        "area": "BE212",
        "R01": 37, "R02": 28, "R03": 28, "R04": 29, "R05": 28, "R06": 31, "R07": 31, "R08": 32, "R09": 22, "R10": 38,
        "R11": 21, "R12": 21, "R13": 21, "R14": 21, "R15": 35, "R16": 22, "R17": 21, "R18": 20, "R19": 20, "R20": 37,
        "R21": 22, "R22": 21, "R23": 21, "R24": 50, "R25": 33,
        "R": 555, "del": 514
    }
])

// เอาเฉพาะ key R01-R25 เพื่อใช้เป็นหัวตาราง
const rangeKeys = computed(() =>
    Array.from({ length: 25 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`)
)
</script>

<style scoped>
th,
td {
    border-bottom: 1px solid #e5e7eb;
}
</style>
