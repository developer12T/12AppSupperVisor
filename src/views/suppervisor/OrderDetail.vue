<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Order Detail</h1>

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="flex justify-center items-center p-6">
            <span class="loading loading-spinner loading-lg text-info"></span>
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Order Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 p-4 rounded-lg shadow">
                <div>
                    <p><strong>รหัสออเดอร์:</strong> {{ orderStore.orderDetail.orderId }}</p>
                    <p><strong>วันที่:</strong> {{ formatDate(orderStore.orderDetail.createdAt) }}</p>
                    <p><strong>สถานะ: </strong>
                        <span
                            :class="orderStore.orderDetail.status === 'approved' ? 'text-green-600' : 'text-yellow-600'">
                            {{ orderStore.orderDetail.status?.toUpperCase() }}
                        </span>
                    </p>
                    <p><strong>เซลล์:</strong> {{ orderStore.orderDetail.sale?.name || '-' }}</p>
                    <p><strong>คลัง:</strong> {{ orderStore.orderDetail.sale?.warehouse || '-' }}</p>
                    <p><strong>รูปแบบการจ่ายเงิน:</strong> {{ orderStore.orderDetail?.paymentMethod || '-' }}</p>
                </div>
                <div>
                    <p><strong>ชื่อร้าน:</strong> {{ orderStore.orderDetail.store?.name || '-' }}</p>
                    <p><strong>เขต:</strong> {{ orderStore.orderDetail.store?.area || '-' }}</p>
                    <p><strong>รหัสร้านค้า:</strong> {{ orderStore.orderDetail.store?.storeId || '-' }}</p>
                    <p><strong>เบอร์โทร:</strong> {{ orderStore.orderDetail.store?.tel || '-' }}</p>
                    <p><strong>ที่อยู่:</strong> {{ orderStore.orderDetail.store?.address || '-' }}</p>
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
                            <th class="text-center">Unit</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in orderStore.orderDetail.listProduct || []" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td class="text-center">{{ item.qty }}</td>
                            <td class="text-center">{{ item.unitName }}</td>
                            <td class="text-right">{{ formatCurrency(item.price) }}</td>
                            <td class="text-right">{{ formatCurrency(item.qty * item.price) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Summary -->
            <div class="mt-6 bg-base-100 p-4 rounded-lg shadow w-full md:w-1/2 ml-auto">

                <div class="flex justify-between mb-2">
                    <span>Total Excluding VAT:</span>
                    <span>{{ formatCurrency(orderStore.orderDetail.totalExVat || 0) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span>VAT:</span>
                    <span>{{ formatCurrency(orderStore.orderDetail.vat || 0) }}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span>Discount:</span>
                    <span>{{ formatCurrency(orderStore.orderDetail.discount || 0) }}</span>
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
                <!-- You can enable this if you want order approval -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '../../store/modules/order'

const isLoading = ref(false)
const orderStore = useOrder()
const route = useRoute()
const router = useRouter()

const orderId = computed(() => route.params.orderId)

onMounted(async () => {
    isLoading.value = true
    console.log('Fetching order:', orderId.value)
    await orderStore.fetchOrderDetail(orderId.value)
    console.log('orderStore:', orderStore.orderDetail)
    isLoading.value = false
})

// Computed fields for summary
const subtotal = computed(() =>
    (orderStore.orderDetail.listProduct || []).reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    )
)

const total = computed(() =>
    subtotal.value - (orderStore.orderDetail.discount || 0)
)

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(value || 0)
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
}

// Navigation
function goBack() {
    router.back()
}

function printPage() {
    window.print()
}

// Optional approval logic
// function approveOrder() {
//   orderStore.orderDetail.status = 'approved'
// }
</script>
