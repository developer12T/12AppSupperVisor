<template>
    <div class="product-card">
        <!-- image -->
        <div class="image-wrapper">
            <img :src="product.image" alt="product" class="product-image" />
        </div>

        <!-- info -->
        <div class="content">
            <h3 class="name"> {{ product.name }}</h3>
            <h3 class="name">รหัสสินค้า : {{ product.id }}</h3>
            <h3 class="name">🎯 Target: {{ product.target }}</h3>
            <div class="meta">

                <!-- multiple zones -->
                <span v-for="(a, index) in displayZones" :key="index" class="badge zone">
                    Zone: {{ a }}
                </span>
                <!-- multiple areas -->
                <!-- <span v-for="(a, index) in displayAreas" :key="index" class="badge area">
                    Area: {{ a }}
                </span> -->

            </div>
        </div>

        <!-- actions -->
        <div class="actions">
            <button class="edit-btn" @click="deleteProduct">
                <Icon icon="mdi:trash" />
                Delete
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useProductsStore } from '../store/modules/product'

const router = useRouter()
const productsStore = useProductsStore()

const props = defineProps({
    product: {
        type: Object,
        required: true,
        /*
          {
            id: 'P001',
            name: 'Product Name',
            image: 'https://...',
            zone: 'BK',
            area: 'BK211'
          }
        */
    }
})

/**
 * กรองค่า area ที่เป็น "" หรือ null ออก
 */
// const displayAreas = computed(() =>
//     Array.isArray(props.product.area)
//         ? props.product.area.filter(a => a)
//         : []
// )

const displayZones = computed(() =>
    Array.isArray(props.product.zone)
        ? props.product.zone.filter(a => a)
        : []
)


const goToEdit = () => {
    router.push(`/admin/sku-focus/${props.product.id}/edit`)
}

const deleteProduct = () => {
    try {
        productsStore.deleteSKUProduct('cash', props.product.id)
        alert('ลบสินค้าสำเร็จ')
        // รีเฟรชหน้า
        router.go(0)
    } catch (error) {
        console.error(error)
    }
}


</script>

<style scoped>
.product-card {
    width: 240px;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
}

.product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.image-wrapper {
    height: 140px;
    width: 100%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
}

.content {
    padding: 12px;
    flex: 1;
}

.name {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #111827;
}

.meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.badge {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #374151;
}

.badge.zone {
    background: #eff6ff;
    color: #2563eb;
}

.badge.area {
    background: #ecfeff;
    color: #0e7490;
}

.actions {
    padding: 12px;
    border-top: 1px solid #e5e7eb;
}

.edit-btn {
    width: 100%;
    border: none;
    background: #FF0000;
    color: white;
    padding: 8px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
}

.edit-btn:hover {
    background: #ff2828;
}
</style>
