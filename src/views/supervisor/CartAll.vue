<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />

        <div class="flex justify-start">
            <h2 class="text-2xl font-bold mb-6">ตะกร้าคงค้างของ Sale</h2>
            <div class="ms-3" v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam
                        }}
                    </option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
            <div class="ms-3">
                <button @click="clearFilter"
                    class="flex items-center ms-3 gap-2 px-5 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 transition duration-150 border border-gray-200 text-gray-700 font-medium text-base active:scale-95">
                    <Icon icon="mdi:broom" width="24" height="24" />
                    เคลีย
                </button>
            </div>
        </div>

        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div v-for="item in cartStore.cart" :key="item.area"
                class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
                <div @click=" $router.push({
                    name: 'CartDetail', query: {
                        storeId: item.storeId,
                        area: item.area,
                    }
                })">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg text-gray-700">เขต</span>
                        <span class="text-sm text-gray-500">{{ item.area }}</span>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">รหัสร้าน:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                item.storeId }}
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">ประเภท:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                item.type }}
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">รายการขาย:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                item.listProduct.length }}
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">รายการโปรโมทชั่น:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                item.listPromotion.length }}
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">ยอดรวม:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                item.total }}
                                บาท</span>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="text-sm text-gray-500">วันที่กด:
                        </div>
                        <div>
                            <span class="font-semibold">{{
                                formatDate(item.createdAt) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { ref, computed, onMounted, watch } from 'vue'
import { useCart } from '../../store/modules/cart'
import { useFilter } from '../../store/modules/filter'

import { Icon } from '@iconify/vue'


const filter = useFilter()
const userRole = localStorage.getItem('role')
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const selectedMonth = ref('') // format: YYYY-MM

const month = computed(() => selectedMonth.value.split('-')[1])
const year = computed(() => selectedMonth.value.split('-')[0])
const getSafe = v => (typeof v === 'string' ? v : '');

const cardData = ref([]);
const cartStore = useCart()
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')
const zone = localStorage.getItem('zone')

function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    window.location.assign('/supervisor/withdraw')
}


onMounted(async () => {
    isLoading.value = true
    if (userRole == 'supervisor' || userRole == 'area_manager') {
        await filter.getTeam(zone);
        await filter.getArea(period, zone, '');
    }
    await filter.getTeam(selectedZone.value);
    await filter.getArea(period, zone, '');
    if (route.query.area) {

    }
    await filter.getZone(period);
    await cartStore.getCartAll('');
    // cardData.value = withdrawStore.withdraw
    isLoading.value = false
})

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
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
        case 'success': return 'รอ Sale กดรับสินค้า'
        case 'confirm': return 'รับสินค้าเรียบร้อย'
        case 'canceled': return 'ยกเลิกใบเบิก'
        default: return status
    }
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




watch(() => route.query.zone, (val) => {
    selectedZone.value = val || ''
})

watch(() => route.query.area, (val) => {
    selectedArea.value = val || ''
})
watch(() => route.query.team, (val) => {
    selectedTeam.value = val || ''
})


watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    selectedTeam.value = ''
    router.replace({
        query: {
            ...route.query,
            zone: newVal,
            team: '',
            area: '',
        }
    });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, newVal, selectedTeam.value);
        await filter.getTeam(newVal);
        await withdrawStore.getWithdraw('cash', period, newVal, selectedArea.value, selectedTeam.value, '', '', '', '')
        cardData.value = withdrawStore.withdraw
        isLoading.value = false
    }
});


watch(selectedTeam, async (newVal) => {
    selectedArea.value = ''
    router.replace({
        query: {
            ...route.query,
            zone: selectedZone.value,
            team: newVal,
            area: '',
        }
    });
    if (newVal) {
        isLoading.value = true
        await filter.getArea(period, selectedZone.value, newVal);
        await withdrawStore.getWithdraw('cash', period, selectedZone.value, selectedArea.value, newVal, '', '', '', '')
        cardData.value = withdrawStore.withdraw
        isLoading.value = false
    }
});

watch(selectedArea, async (newVal) => {
    router.replace({
        query: {
            ...route.query,
            zone: selectedZone.value,
            team: selectedTeam.value,
            area: newVal,
        }
    });
    if (newVal) {
        isLoading.value = true
        console.log(selectedZone.value, newVal, selectedTeam.value)
        await withdrawStore.getWithdraw('cash', period, selectedZone.value, newVal, selectedTeam.value, '', '', '', '')
        cardData.value = withdrawStore.withdraw
        isLoading.value = false
    }
});

</script>
