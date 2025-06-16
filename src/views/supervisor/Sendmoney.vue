<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Send Money Table</h2>

        <div class="overflow-x-auto">
            <table class="table table-zebra w-full border border-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th>#</th>
                        <th>Route</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in sendMoneyList" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.route }}</td>
                        <td>{{ formatCurrency(item.amount) }}</td>
                        <td>{{ formatDate(item.date) }}</td>
                        <td>
                            <span :class="statusColor(item.status)">
                                {{ item.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const sendMoneyList = ref([
    { id: 1, route: 'SH224', amount: 1200, date: '2025-06-16', status: 'pending' },
    { id: 2, route: 'SH225', amount: 900, date: '2025-06-15', status: 'sent' },
    { id: 3, route: 'SH226', amount: 750, date: '2025-06-14', status: 'failed' },
])

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'THB',
    }).format(value)
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('en-GB', options)
}

function statusColor(status) {
    switch (status) {
        case 'pending':
            return 'text-yellow-600 font-semibold'
        case 'sent':
            return 'text-green-600 font-semibold'
        case 'failed':
            return 'text-red-600 font-semibold'
        default:
            return ''
    }
}
</script>

<style scoped>
.table th,
.table td {
    padding: 0.75rem;
    text-align: left;
}
</style>
