<template>

    <div v-if="showAlert" role="alert" class="alert alert-warning mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 
        1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
        0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ alertMessage }}</span>
        <button @click="showAlert = false" class="btn btn-sm ml-auto">Dismiss</button>
    </div>
    <div class="flex justify-between items-center p-3">
        <div class="flex items-center gap-3  w-2/6">
            <h1 class="text-xl font-bold">จัดการสินค้า</h1>
            <select class="select select-info w-2/6" v-model="selectedChannel">
                <option disabled value="">Select Channel</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
            </select>
        </div>

        <label class="input input-bordered flex items-center gap-2 w-64">
            <svg class="w-5 h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input v-model="searchQuery" type="search" class="grow" placeholder="Search" />
        </label>
    </div>

    <div v-for="product in filteredProducts" :key="product.id"
        class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
        <figure class="w-1/5">
            <img src="https://jobbkk.com/upload/employer/0D/53D/03153D/images/202045.webp" alt="placeholder"
                :style="{ width: '150px', height: '150px', objectFit: 'cover' }" />
        </figure>
        <div class="card-body w-1/4">
            <p class="text-sm text-gray-600 msb-1">รหัสสินค้า: {{ product.id }}
            </p>
            <p class="text-sm text-gray-600 msb-1">ชื่อสินค้า: {{ product.name }}
            </p>
            <p class="text-sm text-gray-600 msb-1">กลุ่ม: {{ product.group }} รสชาติ: {{ product.flavour }}
            </p>
            <p class="text-sm text-gray-600 msb-1">ขนาด: {{ product.size }} ประเภท: {{ product.type }}
            </p>
            <p class="text-sm text-gray-600 msb-1">Gross: {{ product.weightGross }} Net: {{ product.weightNet }}
            </p>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'sale')">
                <p class="text-sm text-gray-600 msb-1">เปิดขาย
                </p>

                <Icon :icon="product.statusSale == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusSale == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'refund')">
                <p class="text-sm text-gray-600 msb-1">เปิดคืน
                </p>
                <Icon :icon="product.statusRefund == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusRefund == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'withdraw')">
                <p class="text-sm text-gray-600 msb-1">เปิดเบิก
                </p>
                <Icon :icon="product.statusWithdraw == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusWithdraw == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
    </div>


</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useProductsStore } from '../../store/modules/product';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const productStore = useProductsStore()
const products = ref([])
const showAlert = ref(false)
const alertMessage = ref('Warning: Invalid email address!')
const searchQuery = ref('');
const selectedChannel = ref('cash');



const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (query != '') {
        return productStore.product.data.filter(product =>
            product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.flavour.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.size.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            product.name.includes(searchQuery.value)
        );
    } else {
        return productStore.product.data
    }
});

async function triggerAlert(product, status, onOff) {
    try {

        // store.onOff(product.id, status, onOff)
        await productStore.onOff(product.id, status, onOff, selectedChannel.value)
        console.log('statusCode', productStore.statusCode)
        if (productStore.statusCode == 200) {
            toast(`อัพเดทสถานะ "${status}" สินค้า  ID ${product.id} สำเร็จ!`, {
                "theme": toast.THEME.COLORED,
                "type": toast.TYPE.SUCCESS,
                "dangerouslyHTMLString": true
            })
        } else {
            toast(`${productStore.message}!`, {
                "theme": toast.THEME.COLORED,
                "type": toast.TYPE.ERROR,
                "dangerouslyHTMLString": true
            })
        }

    } catch (error) {
        toast(`${error}!`, {
            "theme": toast.THEME.COLORED,
            "type": toast.TYPE.ERROR,
            "dangerouslyHTMLString": true
        })
    }
}
function toggleSwitch(product, status) {
    switch (status) {
        case 'sale':
            if (product.statusSale == 'Y') {
                product.statusSale = 'N'
                triggerAlert(product, 'sale', 'N')
            } else {
                product.statusSale = 'Y'
                triggerAlert(product, 'sale', 'Y')
            }
            break;
        case 'withdraw':
            if (product.statusWithdraw == 'Y') {
                product.statusWithdraw = 'N'
                triggerAlert(product, 'withdraw', 'N')
            } else {
                product.statusWithdraw = 'Y'
                triggerAlert(product, 'withdraw', 'Y')
            }
            break;
        case 'refund':
            if (product.statusRefund == 'Y') {
                product.statusRefund = 'N'
                triggerAlert(product, 'refund', 'N')
            } else {
                product.statusRefund = 'Y'
                triggerAlert(product, 'refund', 'Y')
            }
            break;
        default:
            break;
    }
}

watch(selectedChannel, async (newVal) => {
    if (newVal) {
        productStore.getProductionAll(selectedChannel.value)
        products.value = productStore.product.data
    }
});


onMounted(async () => {
    await productStore.getProductionAll('cash')
    products.value = productStore.product.data
})

</script>

<style scoped>
.toggle-fade-enter-active,
.toggle-fade-leave-active {
    transition: all 0.3s ease;
}

.toggle-fade-enter-from,
.toggle-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.product-landscape-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    width: 100%;
}

.product-landscape-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.product-image {
    width: 200px;
    height: 200px;
    object-fit: cover;
}

img {
    transition: transform 0.2s ease;
}

img:hover {
    transform: scale(1.03);
}
</style>
