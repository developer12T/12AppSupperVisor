<template>
    <div class="flex justify-between">
        <h1 class="p-3 text-xl font-bold">เช็คอิน</h1>
        <input type="date" class="input" />
        <!-- <select class="select select-info ms-3">
            <option disabled selected>Pick a Framework</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
        </select> -->
    </div>
    <div v-for="route in routes" :key="route.id"
        class="product-landscape-card card card-side bg-base-100 shadow-xl w-full mb-4">
        <figure class="w-1/7">
            <!-- <div class="flex flex-col items-center pt-10">
                <div v-if="route.imageList[0]?.">
                    <img :src="'https://apps.onetwotrading.co.th/' + relativePath(customer.imageList[0]?.path)"
                        alt="placeholder" :style="{ width: '150px', height: '150px', objectFit: 'cover' }"
                        @click="openModal(customer.imageList[0]?.path)" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภาพร้านค้า</p>
                </div>
                <div v-else>
                    <Icon icon="mdi:image-off-outline" width="150" height="150" :style="{ color: '#00569D' }" />
                    <p class="text-sm text-gray-600 mt-1 text-center">ภาพร้านค้า</p>
                </div>
            </div> -->
        </figure>
        <div class="card-body w-3/4">
            <!-- <div class="flex justify-between items-start">
                <div class="flex">
                    <h2 class="card-title text-xl me-2">{{ route.name }} </h2>

                    <div
                        :class="customer.status == '20' ? 'badge badge-success' : customer.status == '15' ? 'badge badge-error' : 'badge badge-warning'">
                        {{
                            customer.status == '20' ? 'อนุมัติ' : customer.status == '15' ? 'ไม่อนุมัติ' :
                                'ยังไม่ได้อนุมัติ'
                        }} </div>
                </div>
                <div class="badge">{{ formatDate(customer.approve.dateAction) }}</div>
            </div> -->
            <p class="text-sm text-gray-600 msb-1">รหัสร้านค้า: {{ customer.storeId }}
            </p>

            <!-- <div class="card-actions justify-end">
                <button class="btn btn-success" @click="openGoogleMap(customer.latitude, customer.longtitude)">
                    Google Map
                </button>
                <button class="btn btn-error" @click="showConfirmationDialog(customer.storeId, customer.name)">
                    ไม่อนุมัติ
                </button>
                <button class="btn btn-primary" @click="showConfirmationDialog(customer.storeId, customer.name)">
                    อุนมัติร้านค้า
                </button>
            </div> -->
        </div>
    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRouteStore } from '../../store/modules/route'

const store = useRouteStore()
const routes = ref([])

onMounted(async () => {
    await store.getCheckin()
    routes.value = store.checkIn.data
})

</script>