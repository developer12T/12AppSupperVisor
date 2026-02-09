<template>
    <div class="wrapper">
        <div class="add-box" @click="goToCreate">
            <Icon icon="mdi:plus" class="plus-icon" />
            <span class="label">Add New</span>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()

const goToCreate = () => {
    router.push('/admin/sku-focus/create')
}
</script>

<style scoped>
.wrapper {
    padding: 24px;
}

.add-box {
    width: 240px;
    height: 240px;
    border: 2px dashed #d1d5db;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.add-box:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.plus-icon {
    font-size: 48px;
    color: #9ca3af;
}

.label {
    margin-top: 8px;
    font-size: 14px;
    color: #6b7280;
}
</style>
