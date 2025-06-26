<template>
  <div class="flex flex-col mb-2">
    <span class="text-xs text-gray-500">{{ label }}</span>
    <span :class="highlight ? 'text-xl font-bold text-blue-600' : 'text-base text-gray-900'">
      {{ value }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '-' },
  highlight: { type: Boolean, default: false }
})
</script>