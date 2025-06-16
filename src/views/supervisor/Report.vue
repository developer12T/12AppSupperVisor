<template>
    <div class="overflow-auto max-h-[calc(100vh-150px)] max-w-[calc(100vw-100px)] rounded-box">
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

            <!-- Table Body -->
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

            <!-- Summary Footer -->
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
import { ref, computed, onMounted } from 'vue'
import { useReport } from '../../store/modules/report'

const isLoading = ref(false)
const reportStore = useReport()

onMounted(async () => {
    isLoading.value = true
    await reportStore.getSummaryProduct('SH') // fetch from API
    isLoading.value = false
})

const summaryProduct = computed(() => reportStore.summaryProduct || [])

const extractProductsAndSubs = (data) => {
    if (!data.length) return { headers: [], subHeaders: [], productsMap: {} }

    const sample = data[0]
    const fields = Object.keys(sample).filter(k => k !== 'area')

    const productsMap = {}

    fields.forEach(key => {
        const match = key.match(/^(TRAGET|SELL|PERCENT|TRAGET STORE|STORE|PERCENT STORE) (.+)$/)
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
        'TRAGET STORE', 'STORE', 'PERCENT STORE'
    ]

    return { headers: sortedProducts, subHeaders, productsMap }
}

// extract headers/subHeaders reactively
const structure = computed(() => extractProductsAndSubs(summaryProduct.value))
const headers = computed(() => structure.value.headers)
const subHeaders = computed(() => structure.value.subHeaders)
const productsMap = computed(() => structure.value.productsMap)

const rows = computed(() =>
    summaryProduct.value.map(item => {
        const data = headers.value.flatMap(product =>
            subHeaders.value.map(sub => {
                const key = productsMap.value[product]?.[sub]
                const value = key ? item[key] : ''
                return typeof value === 'number' ? (sub.includes('PERCENT') ? value.toFixed(2) + ' %' : value.toFixed(2)) : value
            })
        )
        return { area: item.area, data }
    })
)

const summaryRow = computed(() =>
    new Array(headers.value.length * subHeaders.value.length).fill('0')
)
</script>
