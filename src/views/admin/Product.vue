<template>
    <div v-for="product in products" class="product-landscape-card card card-side bg-base-100 shadow-xl w-full">
        <figure class="w-1/4">
            <!-- <img :src="product.imageUrl || '/api/placeholder/300/200'" :alt="product.name"
                class="h-full w-full object-cover" /> -->

            <img src="https://jobbkk.com/upload/employer/0D/53D/03153D/images/202045.webp" class="product-image" />
        </figure>
        <div class="card-body w-3/4">
            <div class="flex justify-between items-start">
                <h2 class="card-title text-xl font-bold">{{ product.name }}</h2>
                <div class="badge badge-secondary">{{ product.category }}</div>
            </div>
            <p class="text-sm text-gray-600 mt-1 mb-2">{{ product.description }}</p>
            <div class="flex items-center mb-2">
                <div class="rating rating-sm">
                    <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400"
                        :checked="product.rating >= 1" disabled />
                    <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400"
                        :checked="product.rating >= 2" disabled />
                    <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400"
                        :checked="product.rating >= 3" disabled />
                    <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400"
                        :checked="product.rating >= 4" disabled />
                    <input type="radio" name="rating" class="mask mask-star-2 bg-orange-400"
                        :checked="product.rating >= 5" disabled />
                </div>
                <span class="text-sm ml-2">({{ product.reviewCount }} reviews)</span>
            </div>
            <div class="flex items-center justify-between mb-2">
                <div class="text-lg font-bold text-primary">
                    {{ formatPrice(product.price) }}
                </div>
                <div v-if="product.inStock" class="badge badge-success gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block w-4 h-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    In Stock
                </div>
                <div v-else class="badge badge-error gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block w-4 h-4 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                    Out of Stock
                </div>
            </div>
            <div class="card-actions justify-end mt-2">
                <button class="btn btn-outline btn-sm" @click="addToWishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <button class="btn btn-primary" :disabled="!product.inStock" @click="addToCart">
                    Add to cart
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStoresStore } from '../../store/modules/store';

const store = useStoresStore();
const products = ref([])

const customerAll = computed(() => {
    return store.storeAll;
});

onMounted(() => {
    store.getCustomerAll();
    products.value = store.storeAll
});


export default {
    name: 'ProductLandscapeCard',
    props: {
        product: {
            type: Object,
            required: true,
            default: () => ({
                id: 1,
                name: 'Product Name',
                description: 'This is a sample product description. It showcases the product features and benefits.',
                price: 29.99,
                imageUrl: '',
                category: 'Electronics',
                rating: 4,
                reviewCount: 42,
                inStock: true
            })
        }
    },
    methods: {
        formatPrice(price) {
            return `$${price.toFixed(2)}`;
        },
        addToCart() {
            this.$emit('add-to-cart', this.product.id);
        },
        addToWishlist() {
            this.$emit('add-to-wishlist', this.product.id);
        }
    }
}
</script>

<style scoped>
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
</style>