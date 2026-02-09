<template>
    <div class="grid">
        <!-- product list -->
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
        <!-- add new -->
        <AddCard />
    </div>
</template>

<script setup>
import { ref } from 'vue'

// ✅ import components
import AddCard from '@/components/AddCard.vue'
import ProductCard from '@/components/ProductCard.vue'

// mock data (ปกติดึงจาก API / store)
const products = ref([
    {
        id: 'P001',
        name: 'FaThai Soup',
        image: 'https://picsum.photos/300/200?1',
        zone: 'BK',
        area: ['BK211', 'BK212']
    },
    {
        id: 'P002',
        name: 'FaThai Noodle',
        image: 'https://picsum.photos/300/200?2',
        zone: 'CT',
        area: ['BK211', 'BK212']
    }
])
</script>

<style scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
</style>