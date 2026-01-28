<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

    <h1 class="text-2xl font-bold mb-2">RouteID : {{ route.params.id }}</h1>
    <h1 class="text-2xl font-bold mb-2">Area : {{ route.params.id.slice(6, 11) }}</h1>



    <div class="overflow-x-auto rounded-xl"
        style="min-width: 450px; max-height: 545px; max-width: 95vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border w-[80px]">StoreID</th>
                    <th class="p-2 border w-[80px]">Name</th>
                    <th class="p-2 border w-[80px]">Phone</th>
                    <th class="p-2 border w-[80px]">Address</th>
                    <th class="p-2 border w-[120px]">Status</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="prod in filteredStores" :key="prod.storeInfo.storeId" class="align-middle">
                    <td class="border p-2 text-center">
                        {{ prod.storeInfo.storeId }}
                    </td>

                    <td class="border p-2 text-center">
                        {{ prod.storeInfo.name }}
                    </td>
                    <td class="border p-2 text-center">
                        {{ prod.storeInfo.tel }}
                    </td>
                    <td class="border p-2 text-left">
                        {{ prod.storeInfo.address }}
                    </td>


                    <!-- ✅ Status + Toggle -->
                    <td class="border p-2">
                        <div class="flex items-center justify-center gap-3">

                            <!-- text -->
                            <span class="text-xs font-semibold"
                                :class="prod.lockStore ? 'text-gray-400' : 'text-green-600'">
                                {{ prod.lockStore ? 'ล็อค' : 'เปิด'
                                }}
                            </span>

                            <!-- switch -->
                            <button type="button" @click="toggleStoreLock(prod)"
                                class="relative inline-flex h-5 w-9 items-center rounded-full transition"
                                :class="prod.lockStore ? 'bg-gray-400' : 'bg-green-500'">
                                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                                    :class="prod.lockStore ? 'translate-x-1' : 'translate-x-4'" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<script setup>

import LoadingOverlay from '../LoadingOverlay.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useRouter, useRoute } from 'vue-router'

import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css"


const routeStores = useRouteStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const area = route.params.id.slice(6, 11)

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const toggleStoreLock = async (prod) => {
    const original = prod.lockStore
    prod.lockStore = !prod.lockStore

    try {
        await routeStores.editLockRoute(period, area, route.params.id, prod.storeInfo.storeId, 'store', '', prod.lockStore)
        if (routeStores.statusCode === 200) {
            toast('เปลี่ยนสถานะ Store สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
        }
    } catch (err) {
        // rollback
        prod.lockStore = original
        console.error(err)
    }
}


const filteredStores = computed(() => {
    let data = routeStores.storeLocks;
    // const query = searchQuery.value.trim().toLowerCase();
    // if (query) {
    //     data = data.filter(store =>
    //         (store.storeId || '').toLowerCase().includes(query) ||
    //         (store.name || '').toLowerCase().includes(query)
    //     );
    // }
    return data;
});

onMounted(async () => {
    // isLoading.value = true

    await routeStores.getStoreLock(period, area, route.params.id)
    // cardData.value = routeStores.routeLocks

    // isLoading.value = false
    console.log("area", area)
})

</script>