<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

    <div class="grid">
        <!-- product list -->
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
        <!-- add new -->
        <AddCard />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useProductsStore } from '../../store/modules/product.js'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์

// ✅ import components
import AddCard from '@/components/AddCard.vue'
import ProductCard from '@/components/ProductCard.vue'

// mock data (ปกติดึงจาก API / store)

const productStores = useProductsStore()
const isLoading = ref(false)
const channel = ref('cash')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const products = ref([])


onMounted(async () => {
    isLoading.value = true
    await productStores.getSkuProduct(period, channel.value)
    products.value = productStores.productSKU
    isLoading.value = false
})


</script>

<style scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
</style>