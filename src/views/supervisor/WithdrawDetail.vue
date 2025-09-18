<template>
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
                    เลขใบเบิก (Withdraw)
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
                <button v-if="data.status === 'pending'"
                    class="rounded-xl px-4 py-2 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
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
        <!-- Info Section -->
        <div class="grid md:grid-cols-2 gap-5 mb-8">
            <Info label="ประเภท" :value="statusTH(data.withdrawType) ?? '-'" />
            <Info label="เบิกต้นทริป" :value="statusTH(data.newTrip)" />
            <Info label="Order Type" :value="data.orderTypeName ?? '-'" />
            <Info label="Area" :value="data.area ?? '-'" />
            <Info label="จากคลัง" :value="data.fromWarehouse ?? '-'" />
            <Info label="ถึงคลัง" :value="data.toWarehouse ?? '-'" />
            <Info label="Shipping ID" :value="data.shippingId ?? '-'" />
            <Info label="Shipping Route" :value="data.shippingRoute ?? '-'" />
            <Info label="Shipping Name" :value="data.shippingName || '-'" />
            <Info label="Send Address" :value="data.sendAddress || '-'" />
            <Info label="Create Date" :value="formatDate(data.createdAt) || '-'" />
            <Info label="Send Date" :value="formatDate(data.sendDate) || '-'" />
            <Info label="Remark" :value="data.remark || '-'" />
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
        <!-- Summary Section -->
        <div class="grid md:grid-cols-4 gap-5 bg-gray-50 rounded-xl p-4 shadow-inner">
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
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useWithdrawStore } from '../../store/modules/withdraw'
import Info from '../../views/Info.vue'

// Inline modern Info component with <script setup>
const withdrawStore = useWithdrawStore()
const route = useRoute()
const data = ref(null)
const showAlert = ref(false)
const status = ref('pending')
const router = useRouter()

const loadData = async () => {
    await withdrawStore.getWithdrawDetail('cash', route.params.id)
    data.value = withdrawStore.withdrawDetail
}

function onApproveClick() {
    showAlert.value = true
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
    await withdrawStore.approve('cash', route.params.id, statusBool)
    window.location.reload()
    // Optionally: send API request here!
    // await axios.post('/api/approve', { ... })
}
function exportData() {
    // เพิ่ม logic export excel/pdf หรือ copy
    alert('Export ยังไม่ได้ implement');
}
function refreshData() {
    loadData()
}
</script>
