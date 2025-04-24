<template>
    <div :class="skeletonClass" :style="skeletonStyle"></div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '1rem',
    },
    borderRadius: {
        type: String,
        default: '0.25rem',
    },
    class: {
        type: String,
        default: '',
    },
})

const { width, height, borderRadius, class: className } = toRefs(props)

const skeletonStyle = computed(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
}))

const skeletonClass = computed(() =>
    `bg-gray-300 animate-pulse ${className.value}`
)
</script>

<style>
.animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>