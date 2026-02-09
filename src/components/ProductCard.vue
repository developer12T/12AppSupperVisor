<template>
    <div class="product-card">
        <!-- image -->
        <div class="image-wrapper">
            <img :src="product.image" alt="product" class="product-image" />
        </div>

        <!-- info -->
        <div class="content">
            <h3 class="name">{{ product.name }}</h3>

            <div class="meta">
                <span class="badge zone">
                    Zone: {{ product.zone }}
                </span>

                <!-- multiple areas -->
                <span v-for="(a, index) in displayAreas" :key="index" class="badge area">
                    Area: {{ a }}
                </span>
            </div>
        </div>

        <!-- actions -->
        <div class="actions">
            <button class="edit-btn" @click="goToEdit">
                <Icon icon="mdi:pencil-outline" />
                Edit
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

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
const displayAreas = computed(() =>
    Array.isArray(props.product.area)
        ? props.product.area.filter(a => a)
        : []
)

const goToEdit = () => {
    router.push(`/products/${props.product.id}/edit`)
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
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    background: #3b82f6;
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
    background: #2563eb;
}
</style>
