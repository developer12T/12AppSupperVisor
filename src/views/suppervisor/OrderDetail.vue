<template>
    <!-- <div class="p-6">
        <h1 class="text-2xl font-bold">Order Detail: {{ orderId }}</h1>
        <p>This is the detail page for route <strong>{{ orderId }}</strong>.</p>
    </div> -->

    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Order Detail</h1>

        <!-- Order Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 p-4 rounded-lg shadow">
            <div>
                <p><strong>Order ID:</strong> {{ order.id }}</p>
                <p><strong>Date:</strong> {{ order.datetime }}</p>
                <p><strong>Status:</strong>
                    <span :class="order.status === 'approved' ? 'text-green-600' : 'text-yellow-600'">
                        {{ order.status }}
                    </span>
                </p>
            </div>
            <div>
                <p><strong>Store Name:</strong> {{ order.storeName }}</p>
                <p><strong>Phone:</strong> {{ order.phone }}</p>
                <p>
                    <strong>Location: </strong>
                    <a :href="order.mapLink" target="_blank" class="text-blue-600 underline">Google Map</a>
                </p>
            </div>
        </div>

        <!-- Product List -->
        <div class="mt-6">
            <h2 class="text-lg font-semibold mb-2">Products</h2>
            <table class="table table-zebra w-full">
                <thead class="bg-base-200">
                    <tr>
                        <th class="text-left">No</th>
                        <th class="text-left">Product ID</th>
                        <th class="text-left">Product Name</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in order.items" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.name }}</td>
                        <td class="text-center">{{ item.qty }}</td>
                        <td class="text-right">{{ formatCurrency(item.price) }}</td>
                        <td class="text-right">{{ formatCurrency(item.qty * item.price) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Summary -->
        <div class="mt-6 bg-base-100 p-4 rounded-lg shadow w-full md:w-1/2 ml-auto">
            <div class="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between mb-2">
                <span>Discount:</span>
                <span>{{ formatCurrency(order.discount) }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{{ formatCurrency(total) }}</span>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex gap-2">
            <button class="btn btn-outline" @click="goBack">Back</button>
            <button class="btn btn-info" @click="printPage">Print</button>
            <button v-if="order.status !== 'approved'" class="btn btn-success" @click="approveOrder">
                Approve
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Sample order data
const order = ref({
    id: 'ORD-20250522-001',
    datetime: '2025-05-22 14:00',
    status: 'pending',
    storeName: 'Fresh Mart',
    phone: '081-234-5678',
    mapLink: 'https://maps.google.com/?q=13.7563,100.5018',
    discount: 50,
    items: [
        { name: 'Product A', qty: 2, price: 100 },
        { name: 'Product B', qty: 1, price: 250 },
        { name: 'Product C', qty: 5, price: 20 }
    ]
})

// Computed fields
const subtotal = computed(() =>
    order.value.items.reduce((sum, item) => sum + item.qty * item.price, 0)
)
const total = computed(() => subtotal.value - order.value.discount)

function formatCurrency(value) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(value || 0)
}

const router = useRouter()
function goBack() {
    router.back()
}
function printPage() {
    window.print()
}
function approveOrder() {
    order.value.status = 'approved'
}

const route = useRoute()
const orderId = route.params.orderId
</script>
