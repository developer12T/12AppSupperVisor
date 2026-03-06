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
        <!-- <button class="btn btn-primary text-white" @click="goToAddProduct">เพิ่มสินค้า</button> -->
    </div>
    <div class="flex justify-between">
        <div class="w-full overflow-x-auto" style="max-height: 480px;">
            <div v-for="product in filteredProducts" :key="product.id"
                class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
                <figure class="w-1/5 flex items-center justify-center">
                    <img v-if="!noPicIds.includes(product.id)"
                        :src="`https://apps.onetwotrading.co.th/images/products/${product.id}.webp`" alt="placeholder"
                        :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                        @error="onImgError(product.id)" />
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
                    <p class="text-sm text-gray-600 msb-1">Gross: {{ product.weightGross }} Net: {{ product.weightNet }}
                    </p>
                </div>
                <button @click="addtoProdcutZone(product)"
                    class="flex items-center p-2 mb-4 bg-gray-200 text-gray-500 rounded-lg hover:bg-base-300">
                    <Icon :icon="'bi:chevron-right'" class="h-5 w-5" />
                </button>
            </div>
        </div>
        <div class="ms-5 w-full">
            <h2 class="font-semibold mb-2">สินค้าที่เลือก</h2>

            <div v-if="selectedProducts.length">
                <ul class="mb-3 space-y-2 overflow-x-auto" style="max-height: 400px;">
                    <li v-for="p in selectedProducts" :key="p.id"
                        class="flex justify-between items-center bg-base-200 p-2 rounded">
                        <span class="text-sm">
                            {{ p.id }} - {{ p.name }}
                        </span>
                        <button class="btn btn-xs btn-ghost text-error" @click="removeProduct(p.id)">
                            ✕
                        </button>
                    </li>
                </ul>

                <VueMultiselect v-model="selectedZone" :options="zones" :multiple="true" track-by="zone" label="zone"
                    placeholder="เลือกโซน" class="w-full mb-2" />


                <VueMultiselect v-model="selectedArea" :options="areas" :multiple="true" track-by="area" label="area"
                    placeholder="เลือกพื้นที่" class="w-full mb-2" />

                <label class="input input-bordered flex items-center gap-2 w-64">
                    🎯 Target:
                    <input min="0" v-model="target" type="number" class="grow" placeholder="Target" />
                    PCS
                </label>
                <button class="btn btn-primary btn-sm mt-3" @click="saveZone" :disabled="!selectedZone.length">
                    Add to Selected Zone
                </button>
            </div>
            <div v-else class="text-gray-400 italic">
                ยังไม่ได้เลือกสินค้า
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
import VueMultiselect from 'vue-multiselect'

import 'vue-multiselect/dist/vue-multiselect.css'
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
const target = ref(0)

const router = useRouter()
const route = useRoute()

const selectedBrand = ref(route.query.brand || '')
const selectedGroup = ref(route.query.group || '')
const selectedFlavour = ref(route.query.flavour || '')
const selectedSize = ref(route.query.size || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const zones = ref([])
const areas = ref([])
const selectedZone = ref([])
const selectedArea = ref([])
const selectedProducts = ref([])


function onImgError(id) {
    // เพิ่ม id ลง array ถ้ายังไม่มี (Vue detect ได้แน่นอน)
    if (!noPicIds.value.includes(id)) {
        noPicIds.value = [...noPicIds.value, id];
    }
}

const removeProduct = (productId) => {
    selectedProducts.value = selectedProducts.value.filter(p => p.id !== productId)
}

const addtoProdcutZone = (product) => {
    const exists = selectedProducts.value.some(p => p.id === product.id)
    if (exists) {
        toast.warning('สินค้านี้ถูกเลือกแล้ว')
        return
    }

    selectedProducts.value.push({
        ...product,
        zones: product.zones ? [...product.zones] : []
    })

    toast.info(`เพิ่ม ${product.name} แล้ว`)
}


watch(selectedZone, async (newZones) => {
    // ถ้ายังไม่เลือก zone
    if (!newZones || !newZones.length) {
        areas.value = []
        selectedArea.value = []
        return
    }

    // แปลง zone object → string[]
    const zoneList = newZones.map(z => z.zone)

    // 🔹 เรียก API / store เพื่อดึง area ตาม zone
    await filter.getAreaArray(zoneList, '')

    // สมมติ filter.area = [{ area: 'BK211' }, { area: 'BK212' }]
    areas.value = filter.area

    // รีเซ็ต area ที่เลือก (กันค่าเก่า)
    selectedArea.value = []
})


const saveZone = () => {
    // ✅ แปลง zone object → string[]
    const zones = selectedZone.value.map(z => z.zone)
    const products = selectedProducts.value.map(z => z.id)
    const areas = selectedArea.value.map(z => z.area)

    console.log('selectedProducts', products)
    console.log('selectedZone', zones)
    console.log('selectedArea', areas)

    productStore.addSKUFocus(selectedChannel.value, products, target.value, period, zones, areas)
        .then(() => {
            toast.success('บันทึกข้อมูลเรียบร้อย')
            // เคลียร์ข้อมูล
            selectedProducts.value = []
            selectedZone.value = []
            target.value = 0
        })
        .catch((error) => {
            toast.error(`เกิดข้อผิดพลาด: ${error.message || error}`)
        })
    // console.log('target', target.value)
    // console.log('selectedZone', selectedZone.value)

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
    await filter.getZone('cash', period);
    products.value = productStore.product.data
    zones.value = filter.zone
    isLoading.value = false
})

</script>
