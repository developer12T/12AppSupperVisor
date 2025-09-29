<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

    <button @click="goBack"
        class="flex items-center gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
    </button>
    <div v-if="data" class="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-2xl mt-10">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-extrabold tracking-tight mb-1">
                    รายละเอียดของตะกร้าสินค้า
                    <span class="">{{ data.storeId ?? '-' }}</span>

                </h2>
                <h2 class="text-2xl font-extrabold tracking-tight mb-1">
                    เขต
                    <span class="">{{ data.area }}</span>
                </h2>
                <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                    :class="statusTHBG(data.status)">
                    {{ data.statusTH }}
                </span>
            </div>
            <div class="flex gap-2">
            </div>
        </div>

        <!-- Product List Section -->
        <div class="mb-8">
            <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg width="20" height="20" fill="none" class="text-blue-400">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2" />
                    <rect x="7" y="7" width="6" height="6" rx="2" fill="currentColor" />
                </svg>
                รายการสินค้า
            </h3>
            <div class="overflow-x-auto rounded-lg border border-gray-100 shadow">
                <table class="min-w-full text-sm align-middle">
                    <thead class="sticky top-0 bg-gray-50">
                        <tr>
                            <th class="p-2 text-left">No</th>
                            <th class="p-2 text-left">สินค้า</th>
                            <th class="p-2 text-right">จำนวน</th>
                            <th class="p-2 text-left">หน่วย</th>
                            <th class="p-2 text-right">จำนวน (Pcs)</th>
                            <th class="p-2 text-right">ราคา/หน่วย</th>
                            <th class="p-2 text-right">รวม</th>
                            <th class="p-2 text-right">น้ำหนักรวม</th>
                            <th class="p-2 text-right">น้ำหนักสุทธิ</th>
                            <th class="p-2 text-right">รับจริง</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in data.listProduct ?? []" :key="item._id ?? idx"
                            class="hover:bg-blue-50">
                            <td class="border-t p-2">{{ idx + 1 }}</td>
                            <td class="border-t p-2">{{ item.name ?? '-' }}</td>
                            <td class="border-t p-2 text-right">{{ item.qty ?? 0 }}</td>
                            <td class="border-t p-2">{{ item.unit }}</td>
                            <td class="border-t p-2 text-right">{{ item.qtyPcs ?? 0 }}</td>
                            <td class="border-t p-2 text-right">{{ formatNumber(item.price) }}</td>
                            <td class="border-t p-2 text-right">{{ formatNumber(item.total) }}</td>
                            <td class="border-t p-2 text-right">{{ item.weightGross ?? 0 }}</td>
                            <td class="border-t p-2 text-right">{{ item.weightNet ?? 0 }}</td>
                            <td class="border-t p-2 text-right">{{ item.receiveQty ?? 0 }}</td>
                        </tr>
                        <tr v-if="!data.listProduct || data.listProduct.length === 0">
                            <td class="border-t p-2 text-center text-gray-400" colspan="14">ไม่มีสินค้า</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-6">
            <h2 class="text-lg font-semibold mb-2">Promotions</h2>

            <table class="table table-zebra w-full">
                <thead class="bg-base-200">
                    <tr>
                        <th class="text-left">No</th>
                        <th class="text-left">Pro ID</th>
                        <th class="text-left">Pro Code</th>
                        <th class="text-left">Promotion Name</th>
                        <th class="text-left">จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(promo, index) in data?.listPromotion || []" :key="promo.proId || index">

                        <!-- Summary Row -->
                        <tr class="hover font-semibold">
                            <td>{{ index + 1 }}</td>
                            <td>{{ promo.proId }}</td>
                            <td>{{ promo.proCode }}</td>
                            <td>{{ promo.proName }}</td>
                            <td>{{ promo.proQty ?? (promo.listProduct?.length || 0) }}</td>
                        </tr>

                        <!-- Detail Rows -->
                        <tr v-for="(p, i) in promo.listProduct || []" :key="p.id || p.productId || i"
                            class="bg-base-100">
                            <td class="pl-10">{{ i + 1 }}</td>
                            <td>{{ p.id ?? p.productId }}</td>
                            <td>{{ p.name ?? p.proName ?? '-' }}</td>
                            <td></td>
                            <td>{{ p.qty ?? p.quantity ?? 0 }} {{ p.unit }}</td>
                        </tr>

                        <!-- No products -->
                        <tr v-if="!promo.listProduct?.length" class="bg-base-100">
                            <td colspan="5" class="text-center text-base-content/60">
                                — ไม่มีรายการสินค้าในโปร —
                            </td>
                        </tr>

                    </template>
                </tbody>
            </table>

        </div>
        <!-- Summary Section -->
        <div class="grid md:grid-cols-4 gap-5 bg-gray-50 rounded-xl p-4 shadow-inner mt-4">
            <Info label="ยอดรวม (บาท)" :value="formatNumber(data.total)" highlight />
            <Info label="จำนวนรวม (กล่อง)" :value="formatNumber(data.totalQty)" />
            <Info label="น้ำหนักรวม (Gross)" :value="formatNumber(data.totalWeightGross)" />
            <Info label="น้ำหนักสุทธิ (Net)" :value="formatNumber(data.totalWeightNet)" />
            <Info label="รับจริง (บาท)" :value="formatNumber(data.receivetotal)" />
            <Info label="รับจริง (กล่อง)" :value="formatNumber(data.receivetotalQty)" />
            <Info label="รับจริง (Gross)" :value="formatNumber(data.receivetotalWeightGross)" />
            <Info label="รับจริง (Net)" :value="formatNumber(data.receivetotalWeightNet)" />
        </div>
    </div>
    <div v-else class="text-center mt-20 text-gray-400">ไม่มีข้อมูล</div>
    <!-- Custom Alert Dialog -->
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4">อนุมัติใบเบิก</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติใบเบิกนี้ ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-neutral" @click="showAlert = false">ยกเลิก</button>
                <button class="btn btn-error text-white" @click="approveStatus(false)">ไม่อนุมัติ</button>
                <button class="btn btn-primary" @click="approveStatus(true)">อนุมัติ</button>
            </div>
        </div>
    </div>
    <div v-if="showAlertCancel" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4 ">ยกเลิกใบเบิก</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกใบเบิกนี้ ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-error" @click="showAlertCancel = false">ยกเลิก</button>
                <button class="btn btn-primary" @click="cancelWithdraw(true)">ยืนยัน</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Info from '../../views/Info.vue'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { useCart } from '../../store/modules/cart'

// Inline modern Info component with <script setup>
const route = useRoute()
const data = ref(null)
const showAlert = ref(false)
const showAlertCancel = ref(false)
const status = ref('pending')
const router = useRouter()
const isLoading = ref(false)
const cartStore = useCart()


const loadData = async () => {
    isLoading.value = true
    await cartStore.getCartDetail(route.query.storeId, route.query.area);
    data.value = cartStore.detailCart
    console.log(data.value.listPromotion)
    isLoading.value = false
}

function onApproveClick() {
    showAlert.value = true
}

function statusTHBG(status) {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700'
        case 'approved': return 'bg-green-100 text-green-700'
        case 'rejected': return 'bg-red-100 text-red-700'
        case 'success': return 'bg-yellow-100 text-yellow-700'
        case 'confirm': return 'bg-blue-100 text-blue-700'
        case 'canceled': return 'bg-red-100 text-red-700'
        default: return status
    }
}


function onCancelClick() {
    showAlertCancel.value = true
}


const goBack = () => {
    router.back()
}

function statusTH(status) {
    switch (status) {
        case 'pending': return 'รอดำเนินการ'
        case 'approved': return 'อนุมัติ'
        case 'rejected': return 'ไม่อนุมัติ'
        case 'true': return 'เบิกต้นทริป'
        case 'false': return 'เบิกระหว่างทริป'
        case 'normal': return 'เบิกปกติ'
        case 'clearance': return 'ระบาย'
        case 'credit': return 'รับโอนจากเครดิต'
        default: return status
    }
}



function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}


onMounted(loadData)

function formatNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '-'
    return Number(val).toLocaleString()
}

function statusLabel(status) {
    if (status === 'success') return 'สำเร็จ'
    if (status === 'pending') return 'รอดำเนินการ'
    if (status === 'approved') return 'อนุมัติ'
    if (status === 'rejected') return 'ไม่อนุมัติ'
    return status || '-'
}

async function approveStatus(statusBool) {
    window.location.reload()

}
async function cancelWithdraw(statusBool) {
    window.location.reload()

}

function exportData() {
    // เพิ่ม logic export excel/pdf หรือ copy
    alert('Export ยังไม่ได้ implement');
}

function refreshData() {
    loadData()
}

</script>
