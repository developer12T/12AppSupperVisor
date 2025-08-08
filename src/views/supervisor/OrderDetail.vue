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
            <div class="mt-6">
                <h2 class="text-lg font-semibold mb-2">Promotions</h2>

                <table class="table table-zebra w-full">
                    <thead class="bg-base-200">
                        <tr>
                            <th class="text-left w-10"></th>
                            <th class="text-left">No</th>
                            <th class="text-left">Pro ID</th>
                            <th class="text-left">Pro Code</th>
                            <th class="text-left">Promotion Name</th>
                            <th class="text-left">จำนวน</th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="(promo, index) in (orderStore.orderDetail?.listPromotions || [])"
                            :key="promo.proId || index">
                            <!-- Summary row -->
                            <tr class="hover">
                                <td class="align-top">
                                    <button class="btn btn-xs" @click="toggle(index)">
                                        {{ expanded[index] ? '−' : '+' }}
                                    </button>
                                </td>
                                <td class="align-top">{{ index + 1 }}</td>
                                <td class="align-top">{{ promo.proId }}</td>
                                <td class="align-top">{{ promo.proCode }}</td>
                                <td class="align-top">{{ promo.proName }}</td>
                                <td class="align-top">
                                    {{ promo.proQty ?? (promo.listProduct?.length || 0) }}
                                </td>
                            </tr>

                            <!-- Detail row: listProduct -->
                            <tr v-show="expanded[index]">
                                <td colspan="6" class="bg-base-100">
                                    <div class="p-3 rounded-lg">
                                        <div class="font-semibold mb-2">รายการสินค้าในโปร</div>

                                        <table class="table w-full">
                                            <thead>
                                                <tr>
                                                    <th class="text-left">#</th>
                                                    <th class="text-left">Product ID</th>
                                                    <th class="text-left">Name</th>
                                                    <th class="text-left">Qty</th>
                                                    <th class="text-left">Unit</th>
                                                    <th class="text-left">Note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(p, i) in (promo.listProduct || [])"
                                                    :key="p.id || p.productId || i">
                                                    <td>{{ i + 1 }}</td>
                                                    <td>{{ p.id ?? p.productId }}</td>
                                                    <td>{{ p.name ?? p.proName ?? '-' }}</td>
                                                    <td>{{ p.qty ?? p.quantity ?? 0 }}</td>
                                                    <td>{{ p.unit ?? p.obUnit ?? '-' }}</td>
                                                    <td>{{ p.note ?? '-' }}</td>
                                                </tr>
                                                <tr v-if="!(promo.listProduct && promo.listProduct.length)">
                                                    <td colspan="6" class="text-center text-base-content/60">
                                                        — ไม่มีรายการสินค้าในโปร —
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <!-- Empty state -->
                        <tr v-if="!(orderStore.orderDetail?.listPromotions?.length)">
                            <td colspan="6" class="text-center text-base-content/60">
                                — ไม่มีโปรโมชัน —
                            </td>
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '../../store/modules/order'

const isLoading = ref(false)
const orderStore = useOrder()
const route = useRoute()
const router = useRouter()

const orderId = computed(() => route.params.orderId)

const expanded = reactive({})
const toggle = (i) => (expanded[i] = !expanded[i])

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
