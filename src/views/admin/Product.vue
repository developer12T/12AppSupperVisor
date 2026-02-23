<template>
    <div v-if="showAlert" role="alert" class="alert alert-warning mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ alertMessage }}</span>
        <button @click="showAlert = false" class="btn btn-sm ml-auto">Dismiss</button>
    </div>
    <div class="flex justify-between items-center p-3">
        <div class="flex items-center gap-6  w-4/6">
            <h1 class="text-xl font-bold">จัดการสินค้า</h1>
            <select class="select select-info w-1/6" v-model="selectedChannel">
                <option disabled value="">Select Channel</option>
                <option value="cash">Cash</option>
                <option value="pc">PC</option>
            </select>

            <select class="select select-info w-1/6" v-model="selectedBrand">
                <option disabled value="">Brand</option>
                <option v-for="item in filter.brand" :key="item" :value="item.brand">{{ item.brand }}</option>

            </select>
            <select class="select select-info w-1/6" v-model="selectedGroup">
                <option disabled value="">Group</option>
                <option v-for="item in filter.group" :key="item" :value="item.group">{{ item.group }}</option>
            </select>
            <select class="select select-info w-1/6" v-model="selectedFlavour">
                <option disabled value="">Flavour</option>
                <option v-for="item in filter.flavour" :key="item" :value="item.flavour">{{ item.flavour }}</option>
            </select>
            <select class="select select-info w-1/6" v-model="selectedSize">
                <option disabled value="">Size</option>
                <option v-for="item in filter.size" :key="item" :value="item.size">{{ item.size }}</option>
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
        <button class="btn btn-primary text-white" @click="goToAddProduct">เพิ่มสินค้า</button>
    </div>

    <div v-for="product in filteredProducts" :key="product.id"
        class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
        <figure class="w-1/5 flex items-center justify-center">
            <img v-if="!noPicIds.includes(product.id)"
                :src="`https://apps.onetwotrading.co.th/images/products/${product.id}.webp`" alt="placeholder"
                :style="{ width: '150px', height: '150px', objectFit: 'cover' }" @error="onImgError(product.id)" />
            <div v-else
                style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center;">
                <Icon icon="mdi:image-off" :width="150" :height="150" style="color: #ccc;" />
            </div>
        </figure>
        <div class="card-body w-1/4">
            <p class="text-sm text-gray-600 msb-1">รหัสสินค้า: {{ product.id }}</p>
            <p class="text-sm text-gray-600 msb-1">ชื่อสินค้า: {{ product.name }}</p>
            <p class="text-sm text-gray-600 msb-1">กลุ่ม: {{ product.group }} รสชาติ: {{ product.flavour }}</p>
            <p class="text-sm text-gray-600 msb-1">ขนาด: {{ product.size }} ประเภท: {{ product.type }}</p>
            <p class="text-sm text-gray-600 msb-1">Gross: {{ product.weightGross }} Net: {{ product.weightNet }}</p>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'sale')">
                <p class="text-sm text-gray-600 msb-1">เปิดขาย</p>
                <Icon :icon="product.statusSale == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusSale == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'refund')">
                <p class="text-sm text-gray-600 msb-1">เปิดคืน</p>
                <Icon :icon="product.statusRefund == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusRefund == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
        <div class="card-body w-1/15">
            <div class="pt-10 cursor-pointer" @click="toggleSwitch(product, 'withdraw')">
                <p class="text-sm text-gray-600 msb-1">เปิดเบิก</p>
                <Icon :icon="product.statusWithdraw == 'Y' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'" width="50"
                    height="50" :style="{ color: product.statusWithdraw == 'Y' ? 'green' : 'gray' }" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useProductsStore } from '../../store/modules/product';
import { useFilter } from '../../store/modules/filter'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const noPicIds = ref([]) // เปลี่ยนเป็น Array (Reactive กับ Vue!)
const productStore = useProductsStore()
const products = ref([])
const showAlert = ref(false)
const alertMessage = ref('Warning: Invalid email address!')
const searchQuery = ref('');
const selectedChannel = ref('cash');
const filter = useFilter()
const isLoading = ref(false)

const router = useRouter()
const route = useRoute()

const selectedBrand = ref(route.query.brand || '')
const selectedGroup = ref(route.query.group || '')
const selectedFlavour = ref(route.query.flavour || '')
const selectedSize = ref(route.query.size || '')

function goToAddProduct() {
    router.push('/admin/addNewProduct')
}

function onImgError(id) {
    // เพิ่ม id ลง array ถ้ายังไม่มี (Vue detect ได้แน่นอน)
    if (!noPicIds.value.includes(id)) {
        noPicIds.value = [...noPicIds.value, id];
    }
}

const filteredProducts = computed(() => {
    let data = productStore.product.data;

    // Search filter (text input)
    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
        data = data.filter(product =>
            (product.name || '').toLowerCase().includes(query) ||
            (product.id || '').toLowerCase().includes(query) ||
            (product.group || '').toLowerCase().includes(query) ||
            (product.flavour || '').toLowerCase().includes(query) ||
            (product.size || '').toLowerCase().includes(query) ||
            (product.type || '').toLowerCase().includes(query)
        );
    }

    // Brand filter
    if (selectedBrand.value) {
        data = data.filter(product => product.brand === selectedBrand.value);
    }

    // Group filter
    if (selectedGroup.value) {
        data = data.filter(product => product.group === selectedGroup.value);
    }

    // Flavour filter
    if (selectedFlavour.value) {
        data = data.filter(product => product.flavour === selectedFlavour.value);
    }

    // Size filter
    if (selectedSize.value) {
        data = data.filter(product => product.size === selectedSize.value);
    }

    return data;
});


async function triggerAlert(product, status, onOff) {
    try {
        await productStore.onOff(product.id, status, onOff, selectedChannel.value)
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
            product.statusSale = product.statusSale == 'Y' ? 'N' : 'Y'
            triggerAlert(product, 'sale', product.statusSale)
            break;
        case 'withdraw':
            product.statusWithdraw = product.statusWithdraw == 'Y' ? 'N' : 'Y'
            triggerAlert(product, 'withdraw', product.statusWithdraw)
            break;
        case 'refund':
            product.statusRefund = product.statusRefund == 'Y' ? 'N' : 'Y'
            triggerAlert(product, 'refund', product.statusRefund)
            break;
        default:
            break;
    }
}

watch(selectedChannel, async (newVal) => {
    if (newVal) {
        await productStore.getProductionAll(selectedChannel.value)
        products.value = productStore.product.data
        noPicIds.value = [] // เคลียร์ id รูปไม่เจอเมื่อเปลี่ยน channel
    }
});

watch(selectedBrand, async (newVal) => {
    selectedGroup.value = ''
    selectedFlavour.value = ''
    selectedSize.value = ''
    if (newVal) {
        await filter.getGroup(newVal, selectedFlavour.value, selectedSize.value, '')
    }
});


watch(selectedGroup, async (newVal) => {
    selectedFlavour.value = ''
    selectedSize.value = ''
    if (newVal) {
        await filter.getFlavour(selectedBrand.value, newVal, selectedSize.value, '')
    }
});

watch(selectedFlavour, async (newVal) => {
    selectedSize.value = ''
    if (newVal) {
        await filter.getSize(selectedBrand.value, selectedGroup.value, newVal, '')
    }
});

onMounted(async () => {
    isLoading.value = true
    await productStore.getProductionAll('cash')
    await filter.getBrand('', '', '', '')
    await filter.getGroup('', '', '', '')
    await filter.getFlavour('', '', '', '')
    await filter.getSize('', '', '', '')
    products.value = productStore.product.data
    isLoading.value = false
})

</script>
