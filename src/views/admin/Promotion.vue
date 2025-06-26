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
            <h1 class="text-xl font-bold">โปรโมชั่น</h1>
            <select class="select select-info w-2/6" v-model="selectedChannel">
                <option disabled value="">Select Channel</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
            </select>
            <router-link to="/admin/newpromotion">
                <button class="btn btn-primary">เพิ่มโปรโมชั่น</button>
            </router-link>

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

    <div v-for="promotion in filteredPromotions" :key="promotion.id"
        class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">

        <div class="card-body w-1/4">
            <router-link :to="`/admin/promotiondetails/${promotion.proId}`">
            <h2 class="text-xl text-gray-800 msb-1">โปรโมชั่น: {{ promotion.proId }}
            </h2>
            <p class="text-sm text-gray-600 msb-1">ชื่อ: {{ promotion.name }}
            </p>
            <p class="text-sm text-gray-600 msb-1">รายละเอียด: {{ promotion.description }}
            </p>
            </router-link>
        </div>

    </div>


</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue';
import { usePromotionsStore } from '../../store/modules/promotion';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";


const promotionStore = usePromotionsStore()
const promotions = ref([])
const showAlert = ref(false)
const alertMessage = ref('Warning: Invalid email address!')
const searchQuery = ref('');
const selectedChannel = ref('cash');

// const productStore = useProductsStore()
// const products = ref([])
// const showAlert = ref(false)
// const alertMessage = ref('Warning: Invalid email address!')
// const searchQuery = ref('');
// const selectedChannel = ref('cash');



const filteredPromotions = computed(() => {
    const query = searchQuery.value.toLowerCase();
    if (query != '') {
        return promotionStore.promotions.data.filter(promotion =>
            promotion.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    } else {
        return promotionStore.promotions.data
    }
});



// watch(selectedChannel, async (newVal) => {
//     if (newVal) {
//         productStore.getProductionAll(selectedChannel.value)
//         products.value = productStore.product.data
//     }
// });


onMounted(async () => {
    await promotionStore.getPromotionAll('cash')
    promotions.value = promotionStore.promotions.data
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
