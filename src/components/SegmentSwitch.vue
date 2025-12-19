<template>
    <div class="relative inline-flex items-center bg-slate-900 rounded-lg p-1">
        <!-- Indicator -->
        <div class="absolute h-10 w-10 bg-slate-600 rounded-md transition-all duration-300" :style="indicatorStyle" />

        <!-- Buttons -->
        <button v-for="(item, index) in items" :key="item.value"
            class="relative z-10 w-10 h-8 flex items-center justify-center text-white opacity-60 hover:opacity-100"
            :class="{ 'opacity-100': modelValue === item.value }" @click="$emit('update:modelValue', item.value)">
            <Icon :icon="item.icon" class="w-4 h-4" />

            <!-- Badge -->
            <span v-if="badgeCount(item.value) > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
               bg-red-500 text-white text-[10px] font-bold
               rounded-full flex items-center justify-center leading-none">
                {{ badgeText(badgeCount(item.value)) }}
            </span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

// const props = defineProps({
//     modelValue: {
//         type: String,
//         required: true
//     }
// })

const props = defineProps({
    modelValue: { type: String, required: true },

    // ✅ counts ของแต่ละปุ่ม
    // ตัวอย่าง: { menu: 2, json: 0, grid: 12 }
    counts: { type: Object, default: () => ({}) },

    // ✅ ถ้าเกินนี้ให้โชว์เป็น "99+"
    maxBadge: { type: Number, default: 99 }
})

defineEmits(['update:modelValue'])

const items = [
    { value: 'all', icon: 'mdi:menu' },
    { value: 'approve', icon: 'mdi:approve' },
]

const activeIndex = computed(() =>
    items.findIndex(i => i.value === props.modelValue)
)

const indicatorStyle = computed(() => ({
    transform: `translateX(${activeIndex.value * 2.5}rem)`
}))

const badgeCount = (key) => Number(props.counts?.[key] ?? 0)

const badgeText = (n) => (n > props.maxBadge ? `${props.maxBadge}+` : String(n))

</script>
