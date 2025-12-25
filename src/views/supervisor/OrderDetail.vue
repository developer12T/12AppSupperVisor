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
                    <p><strong>เขต:</strong>
                        {{ orderStore.orderDetail.store?.area || '-' }}</p>
                    <p><strong>รหัสร้านค้า:</strong>
                        <span>
                            {{ orderStore.orderDetail.store?.storeId || '-' }}
                        </span>
                    </p>
                    <p><strong>ชื่อร้าน:</strong>
                        <span v-if="!isEdit">{{ orderStore.orderDetail.store?.name || '-' }}</span>

                        <input v-else v-model="editForm.name" class="input input-bordered w-full max-w-xs" />
                    </p>

                    <p><strong>เลขผู้เสียภาษี:</strong>
                        <span v-if="!isEdit"> {{ orderStore.orderDetail.store?.taxId || '-' }}</span>
                        <input v-else v-model="editForm.taxId" class="input input-bordered w-full max-w-xs" />
                    </p>
                    <p><strong>เบอร์โทร:</strong>
                        <span v-if="!isEdit">
                            {{ orderStore.orderDetail.store?.tel || '-' }}
                        </span>
                        <input v-else v-model="editForm.tel" class="input input-bordered w-full max-w-xs" />

                    </p>

                    <p><strong>ที่อยู่:</strong>
                        <span v-if="!isEdit">
                            {{ orderStore.orderDetail.store?.address || '-' }}
                        </span>
                        <textarea v-else v-model="editForm.address"
                            class="textarea textarea-bordered w-full"></textarea>
                    </p>
                    <div class="mt-3">
                        <button
                            v-if="userRole == 'admin' || userRole == 'supervisor' || userRole == 'area_manager' || userRole == 'sale_manager'"
                            class="w-[150px] btn btn-warning" @click="enableEdit()">
                            <Icon icon="mdi:lead-pencil" width="24" height="24" />
                            {{ isEdit ? "ปิดแก้ไข" : "แก้ไข" }}
                        </button>
                        <button v-if="isEdit" class="btn btn-success ms-3" @click="openConfrim">
                            <Icon icon="mdi:content-save" width="24" height="24" />
                            บันทึก
                        </button>
                    </div>
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
                            <th class="text-left">No</th>
                            <th class="text-left">Pro ID</th>
                            <th class="text-left">Pro Code</th>
                            <th class="text-left">Promotion Name</th>
                            <th class="text-left">จำนวน</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(promo, index) in orderStore.orderDetail?.listPromotions || []"
                            :key="promo.proId || index">

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
    <div v-if="editMode" class="fixed inset-0 bg-black bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 class="text-xl font-semibold mb-4">ยืนยันการบันทึกข้อมูล</h2>
            <div class="flex justify-end space-x-2">
                <button type="button" class="btn" @click="editMode = false">ยกเลิก</button>
                <button type="submit" @click="editStore" class="btn btn-primary">บันทึก</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '../../store/modules/order'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify';

const isLoading = ref(false)
const orderStore = useOrder()
const route = useRoute()
const router = useRouter()
const userRole = localStorage.getItem('role')
const editMode = ref(false)


const orderId = computed(() => route.params.orderId)

const expanded = reactive({})
const toggle = (i) => (expanded[i] = !expanded[i])


const province = ref("");
const amphoe = ref("");
const district = ref("");
const zipcode = ref("");

const provinceList = ref([]);
const amphoeList = ref([]);
const districtList = ref([]);

const isEdit = ref(false)

const editForm = ref({
    name: "",
    taxId: "",
    tel: "",
    address: "",
})

function openConfrim() {
    editMode.value = true;
}



onMounted(async () => {
    isLoading.value = true
    console.log('Fetching order:', orderId.value)
    await orderStore.fetchOrderDetail(orderId.value)
    console.log('orderStore:', orderStore.orderDetail)
    isLoading.value = false
})

function enableEdit() {
    if (!isEdit.value) {
        isEdit.value = true
        editForm.value = {
            name: orderStore.orderDetail.store?.name,
            taxId: orderStore.orderDetail.store?.taxId,
            tel: orderStore.orderDetail.store?.tel,
            address: orderStore.orderDetail.store?.address,
        }
    } else {
        isEdit.value = false
    }
}



async function editStore() {
    try {
        const zipStr = (zipcode?.value ?? "").toString();

        const data = {
            name: editForm.value.name ?? "",
            taxId: editForm.value.taxId ?? "",
            tel: editForm.value.tel ?? "",
            address: editForm.value.address ?? "",
            province: province?.value ?? "",
            provinceCode: zipStr.slice(0, 2),
            subDistrict: district?.value ?? "",
            district: amphoe?.value ?? "",
            postCode: zipStr,
        };

        const data2 = {
            name: editForm.value.name ?? "",
            taxId: editForm.value.taxId ?? "",
            tel: editForm.value.tel ?? "",
            address: editForm.value.address ?? "",
        };

        // 🔥 เช็คว่ามีข้อมูลที่อยู่ครบจริง ๆ
        const hasFullAddress =
            !!province?.value &&
            !!zipcode?.value &&
            !!amphoe?.value &&
            !!district?.value;

        editMode.value = false;
        isLoading.value = true;
        isEdit.value = false;

        // 🔥 ส่ง API ตามเงื่อนไข

        await orderStore.editStoreOrder("cash", route.params.orderId, data2);

        // toast(`บันทึกสำเร็จ`, {
        //     theme: toast.THEME.COLORED,
        //     type: toast.TYPE.WARNING,
        //     dangerouslyHTMLString: true,
        // });


        // 🔄 โหลดข้อมูลใหม่
        await orderStore.fetchOrderDetail(orderId.value)
        isLoading.value = false;

    } catch (error) {
        console.error(error);

        toast(`เกิดข้อผิดพลาด: ${error.message}`, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true,
        });

        isLoading.value = false;
    }
}


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
