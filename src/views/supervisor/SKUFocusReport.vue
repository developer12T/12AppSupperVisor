<template>
    <div class="p-6">
        <h1 class="text-xl font-bold mb-4">รายการสินค้าที่ขาย วันที่ {{ route.params.date }}</h1>

        <!-- empty state -->
        <div v-if="!groupedProducts.length" class="text-gray-400 italic">
            ไม่มีข้อมูลสินค้า
        </div>

        <!-- cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="p in groupedProducts" :key="p.id" class="card bg-base-100 shadow-md p-4">
                <img v-if="!noPicIds.includes(p.id)"
                    :src="`https://apps.onetwotrading.co.th/images/products/${p.id}.webp`" alt="placeholder"
                    :style="{ width: '150px', height: '150px', objectFit: 'cover' }" @error="onImgError(p.id)" />
                <h3 class="font-semibold text-lg">
                    {{ p.name }}
                </h3>

                <p class="text-sm text-gray-500">
                    รหัสสินค้า: {{ p.id }}
                </p>

                <div class="mt-3 flex flex-wrap gap-2">
                    <span v-for="u in formatUnits(p.units)" :key="u.text" class="badge badge-outline badge-primary">
                        {{ u.text }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const routeStores = useRouteStore()
/**
 * 🔹 ตัวอย่างข้อมูลจาก API
 * (ของจริงให้ replace ด้วย response จาก backend)
 */
const rawData = ref([])
const noPicIds = ref([])

/**
 * 🔹 mock data (ลบทิ้งได้)
 */



function onImgError(id) {
    // เพิ่ม id ลง array ถ้ายังไม่มี (Vue detect ได้แน่นอน)
    if (!noPicIds.value.includes(id)) {
        noPicIds.value = [...noPicIds.value, id];
    }
}
onMounted(async () => {
    // isLoading.value = true
    await routeStores.getProductSoldByDayArea(route.params.area, route.params.date)
    rawData.value = routeStores.productSKU
    // isLoading.value = false
})

/**
 * ✅ รวมสินค้า
 * - key = product id
 * - รวม qty แยกตาม unit
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

        if (!map[item.id].units[item.unit]) {
            map[item.id].units[item.unit] = 0
        }

        map[item.id].units[item.unit] += item.qty
    })

    return Object.values(map)
})

/**
 * ✅ format unit สำหรับแสดงผล
 * - CTN มาก่อน
 * - PCS หลังสุด
 */
const formatUnits = (units) => {
    const priority = ['CTN', 'PCS', "BAG", "BOT", "PAC", "CRT", "SET"]

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
.card {
    border-radius: 12px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}
</style>
