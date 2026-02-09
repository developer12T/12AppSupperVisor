<template>
    <div class="p-6">
        <h1 class="text-xl font-bold mb-4">
            รายการสินค้าที่ขาย (Table) วันที่ {{ route.params.date }}
        </h1>

        <!-- empty state -->
        <div v-if="!groupedProducts.length" class="text-gray-400 italic">
            ไม่มีข้อมูลสินค้า
        </div>

        <!-- table -->
        <div v-else class="overflow-x-auto" style="max-height: 480px;">
            <div class="flex justify-between">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>รหัสสินค้า</th>
                            <th>ชื่อสินค้า</th>
                            <th>จำนวนที่ขาย</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(p, index) in groupedProducts" :key="p.id">
                            <td>{{ index + 1 }}</td>
                            <td class="font-mono">{{ p.id }}</td>
                            <td>{{ p.name }}</td>
                            <td>
                                <span v-for="u in formatUnits(p.units)" :key="u.text"
                                    class="badge badge-outline badge-primary mr-2">
                                    {{ u.text }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="ms-6 table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>รหัสสินค้า</th>
                            <th>ชื่อสินค้า</th>
                            <th>จำนวนที่ขาย</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(p, index) in groupedProducts" :key="p.id">
                            <td>{{ index + 1 }}</td>
                            <td class="font-mono">{{ p.id }}</td>
                            <td>{{ p.name }}</td>
                            <td>
                                <span v-for="u in formatUnits(p.units)" :key="u.text"
                                    class="badge badge-outline badge-primary mr-2">
                                    {{ u.text }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '../../store/modules/route'

const route = useRoute()
const routeStores = useRouteStore()

const rawData = ref([])

/**
 * โหลดข้อมูลจาก backend
 */
onMounted(async () => {
    await routeStores.getProductSoldByDayArea(
        route.params.area,
        route.params.date
    )
    rawData.value = routeStores.productSKU
})

/**
 * รวมสินค้า (id + unit)
 */
const groupedProducts = computed(() => {
    const map = {}

    rawData.value.forEach(item => {
        if (!map[item.id]) {
            map[item.id] = {
                id: item.id,
                name: item.name,
                units: {}
            }
        }

        map[item.id].units[item.unit] =
            (map[item.id].units[item.unit] || 0) + item.qty
    })

    return Object.values(map)
})

/**
 * เรียง + format unit
 */
const formatUnits = (units) => {
    const priority = ['CTN', 'PCS', 'BAG', 'BOT', 'PAC', 'CRT', 'SET']

    return priority
        .filter(u => units[u])
        .map(u => ({
            unit: u,
            qty: units[u],
            text: `${units[u]} ${u}`
        }))
}
</script>

<style scoped>
table th {
    background-color: #f9fafb;
}
</style>
