<template>
    <div class="p-6">
        <h1 class="text-xl font-bold mb-4">
            รายการสินค้าที่ขาย (Table) วันที่ {{ route.params.date }}
        </h1>
        <!-- table -->
        <div class="flex justify-between">
            <div v-if="!groupedProductsSKU.length" class="text-gray-400 italic">
                ไม่มีข้อมูลสินค้า
            </div>
            <div v-else class="overflow-x-auto w-full" style="max-height: 480px;">
                <h3 lass="text-lg font-semibold mb-3">
                    รายการสินค้า SKU Focus ที่ขายได้
                </h3>
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>รหัสสินค้า</th>
                            <th>ชื่อสินค้า</th>
                            <th>จำนวนที่ขาย</th>
                            <th>เป้าหมาย</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(p, index) in groupedProductsSKU" :key="p.id">
                            <td>{{ index + 1 }} </td>
                            <td class="font-mono">{{ p.id }}</td>
                            <td>{{ p.name }}</td>
                            <td>
                                <span v-for="u in formatUnits(p.units)" :key="u.text"
                                    class="badge badge-outline badge-primary mr-2">
                                    {{ u.text }}
                                </span>
                            </td>
                            <td>{{ p.target }} PCS</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="!groupedProducts.length" class="text-gray-400 italic">
                ไม่มีรายการที่ขายได้
            </div>
            <div class="overflow-x-auto w-full" style="max-height: 480px;">
                <h3 lass="text-lg font-semibold mb-3">
                    รายการสินค้าที่ขายได้
                </h3>
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

const productALL = ref([])
const productSKU = ref([])

/**
 * โหลดข้อมูลจาก backend
 */
onMounted(async () => {
    await routeStores.getProductSoldByDayArea(
        route.params.area,
        route.params.date
    )
    await routeStores.getProductSoldByDayAreaSKU(
        route.params.area,
        route.params.date
    )
    productSKU.value = routeStores.productSKU
    productALL.value = routeStores.productAll
})

/**
 * รวมสินค้า (id + unit)
 */
const groupedProducts = computed(() => {
    const map = {}

    productALL.value.forEach(item => {
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
const groupedProductsSKU = computed(() => {
    const map = {}

    productSKU.value.forEach(item => {
        if (!map[item.id]) {
            map[item.id] = {
                id: item.id,
                name: item.name,
                target: item.target,
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
        .filter(u => units[u] !== undefined)
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
