<template>
    <div v-if="data" class="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-2xl mt-10">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-extrabold tracking-tight mb-1">
                    เลขใบขออนุมัติ (Adjust Stock)
                    <span class="text-gray-400">#{{ data.orderId ?? '-' }}</span>
                </h2>
                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full" :class="{
                    'bg-green-100 text-green-600': data.status === 'success' || data.status === 'approved',
                    'bg-yellow-100 text-yellow-600': data.status === 'pending',
                    'bg-red-100 text-red-600': data.status !== 'success' && data.status !== 'pending' && data.status !== 'approved'
                }">
                    {{ statusLabel(data.status) }}
                </span>
            </div>
            <div class="flex gap-2">
                <button class="rounded-xl px-4 py-2 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                    @click="onApproveClick">
                    อนุมัติใบเบิก
                </button>
                <button class="rounded-xl px-4 py-2 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                    @click="exportData">
                    Export
                </button>
                <button class="rounded-xl px-4 py-2 bg-gray-50 text-gray-600 font-medium hover:bg-gray-100 transition"
                    @click="refreshData">
                    Refresh
                </button>
            </div>
        </div>
    </div>
</template>