<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="flex mt-10 justify-start gap-6 mb-3">
        <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
            <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
                <option disabled value="">Select Zone</option>
                <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
            </select>
        </div>
        <!-- <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
            <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                <option disabled value="">Select Team</option>
                <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">
                    {{ team.saleTeam }}
                </option>
            </select>
        </div>
        <div class="bg-base-100 shadow-md rounded-xl p-6 flex flex-col items-center w-48">
            <select class="select select-info ms-3 text-center" v-model="selectedArea">
                <option disabled value="">Select Area</option>
                <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
            </select>
        </div> -->
    </div>

    <!-- Table -->
    <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)] rounded-box">
        <table class="table border-separate border-spacing-0 min-w-[1800px] border border-black">
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
                <tr>
                    <template v-for="(product, pIndex) in headers" :key="'group-' + pIndex">
                        <th v-for="(sub, sIndex) in subHeaders" :key="`sub-${pIndex}-${sIndex}`"
                            class="sticky top-[35px] z-30 bg-primary text-white text-center p-2 border border-black">
                            {{ sub }}
                        </th>
                    </template>
                </tr>
            </thead>

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
import { ref, computed, onMounted, watch } from 'vue'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { useRouter, useRoute } from 'vue-router'
import { useReport } from '../../store/modules/report'
import { useFilter } from '../../store/modules/filter'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const reportStore = useReport()
const filter = useFilter()

const today = new Date()
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0')

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

watch(selectedZone, async (newVal) => {
    selectedArea.value = ''
    isLoading.value = true
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: ''
    //     }
    // })
    if (newVal) {
        await filter.getArea(period, newVal)
        await filter.getTeam(newVal)
        await reportStore.getSummaryProduct(newVal)
    }
    isLoading.value = false
})

// ✅ Mock data example (replace with API call as needed)
const summaryProduct = computed(() => reportStore.summaryProduct || [])

const extractProductsAndSubs = (data) => {
    if (!data.length) return { headers: [], subHeaders: [], productsMap: {} }

    const sample = data[0]
    const fields = Object.keys(sample).filter(k => k !== 'area')

    const productsMap = {}

    fields.forEach(key => {
        const match = key.match(/^(TRAGET|SELL|PERCENT|TRAGET_STORE|STORE|PERCENT_STORE) (.+)$/)
        if (match) {
            const subKey = match[1]
            const productName = match[2]
            if (!productsMap[productName]) productsMap[productName] = {}
            productsMap[productName][subKey] = key
        }
    })

    const sortedProducts = Object.keys(productsMap).sort()
    const subHeaders = [
        'TRAGET', 'SELL', 'PERCENT',
        'TRAGET_STORE', 'STORE', 'PERCENT_STORE'
    ]

    return { headers: sortedProducts, subHeaders, productsMap }
}

const structure = computed(() => extractProductsAndSubs(summaryProduct.value))
const headers = computed(() => structure.value.headers)
const subHeaders = computed(() => structure.value.subHeaders)
const productsMap = computed(() => structure.value.productsMap)

const rows = computed(() =>
    summaryProduct.value.map(item => {
        const data = headers.value.flatMap(product =>
            subHeaders.value.map(sub => {
                const key = productsMap.value[product]?.[sub]
                let value = key ? item[key] : ''
                // ถ้า value เป็น number และเป็น 0
                if (typeof value === 'number') {
                    if (value === 0) return '-'
                    return sub.includes('PERCENT')
                        ? value.toFixed(2) + ' %'
                        : value.toFixed(2)
                }
                // ถ้า value เป็น string และเท่ากับ "0" หรือ "0.00" ก็แสดง "-"
                if (value === '0' || value === '0.00') return '-'
                return value
            })
        )
        return { area: item.area, data }
    })
)

const summaryRow = computed(() =>
    new Array(headers.value.length * subHeaders.value.length).fill('0')
)

onMounted(async () => {
    isLoading.value = true
    await filter.getZone(period)
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value)
    }
    isLoading.value = false
})
</script>
