<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    </div>
</template>
<script setup>

import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์

</script>