<template>
    <div class="flex justify-start gap-6 mb-3">


    </div>
    <div class="overflow-x-auto rounded-xl mt-5"
        style="min-height: 450px; max-height: 450px; max-width: 90vw; overflow-y: auto;">
        <div class="flex items-center mb-4 gap-5">
            <div v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                    </option>
                </select>
            </div>
            <div v-if="userRole != 'supervisor'">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>

        </div>
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-primary text-white sticky top-0 z-10">
                <tr>
                    <th class="text-center p-2 ">Area</th>
                    <th class="text-center p-2 ">ร้านค้าทั้งหมด</th>
                    <th class="text-center p-2 ">จำนวนรูท</th>
                    <th class="text-center p-2 ">จำนวนที่ปรับ</th>
                    <th class="text-center p-2 ">ร้านค้าใหม่ทั้งหมด</th>
                    <th class="text-center p-2 ">สถานะ</th>
                    <th class="text-center p-2 ">อนุมัติ</th>
                    <th class="text-center p-2 ">อนุมัติ</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="(item, index) in filteredData" :key="index" class="hover:bg-gray-50 cursor-pointer">
                    <td class="p-2 border">{{ item.area }}</td>
                    <td class="p-2 border">{{ item.storeCount }}</td>
                    <td class="p-2 border">{{ item.routeCount }}</td>
                    <td class="p-2 border">{{ item.addStoreToRoute }}</td>
                    <td class="p-2 border">{{ item.storeNew }}</td>
                    <td :class="statusTHBG(item.statusTH)" class="p-2 border">{{ item.statusTH }}</td>
                    <td class="p-2 border  text-center">
                        <button @click="openAlert(item)" class="btn btn-primary">อนุมัติ</button>
                    </td>
                    <td class="p-2 border  text-center">
                        <button @click="openSupervisor(item.area)" class="btn btn-primary">ดูรายละเอียด</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h2 class="font-bold text-lg mb-4"> อนุมัติการปรับรูท {{ itemSelected?.area }}</h2>
            <p class="mb-6">คุณแน่ใจหรือไม่ว่าต้องการอนุมัติการปรับรูท ?</p>
            <div class="flex justify-end gap-2">
                <button class="btn btn-success" @click="addToStoreChange()">อนุมัติ</button>
                <button class="btn btn-neutral" @click="showAlert = false">ยกเลิก</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouteStore } from '../../store/modules/route'
import { useFilter } from '../../store/modules/filter'
import { getTeam3 } from '../../utils/format'


const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const router = useRouter()
const route = useRoute()
const routeStore = useRouteStore()
const filter = useFilter()
const isLoading = ref(false);
const selectedRoute = ref(null)
const showExcel = ref(null)
const totalRow = ref('')
const showAlert = ref('')
const itemSelected = ref()

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')


function statusTHBG(status) {
    switch (status) {
        case 'รอดำเนินการ': return 'bg-yellow-100 text-yellow-700'
        case 'อนุมัติ': return 'bg-green-100 text-green-700'
        default: return status
    }
}

function openAlert(item) {
    itemSelected.value = item;
    showAlert.value = true;
}


const filteredData = computed(() => {
    let data = routeStore.routesApproval


    if (selectedZone.value) {
        data = data.filter(order =>
            (order.area || '').startsWith(selectedZone.value)
        )
    }


    if (selectedArea.value) {
        console.log()
        data = data.filter(order =>
            order.area === selectedArea.value
        )
    }

    if (selectedTeam.value) {
        console.log()
        data = data.filter(order =>
            getTeam3(order.area) === selectedTeam.value
        )
    }
    return data;
})


function clearFilter() {
    selectedZone.value = ''
    selectedArea.value = ''
    selectedTeam.value = ''
    showExcel.value = ''
    router.replace({
        query: {
            zone: '',
            area: '',
            team: ''
        }
    });
    window.location.assign('/areamanager/changeroute')
}


const openSupervisor = (area) => {
    const route = router.resolve(`/areamanager/changeroute/${area}`)
    window.open(route.href, '_blank')
}

onMounted(async () => {
    isLoading.value = true;
    await filter.getZone('cash', period);
    filter.getTeam('cash', selectedZone.value);
    console.log('selectedArea.value', selectedArea.value)
    if (selectedZone.value) {
        await filter.getArea(period, selectedZone.value, selectedTeam.value);
    }

    await routeStore.getAreaApproval(period);

    isLoading.value = false;
    // showExcel.value = 'true'
})


watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    router.replace({
        query: {
            ...route.query,
            area: '',
            team: newVal
        }
    });
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});

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
    selectedArea.value = ''
    selectedTeam.value = ''
    router.replace({
        query: {
            ...route.query,
            zone: newVal,
            area: '',
            team: ''
        }
    });
    if (newVal) {
        // await routeStore.getCheckin(period, selectedZone.value, selectedTeam.value, selectedArea.value);

        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam('cash', newVal);
    }
});

watch(selectedArea, async (newVal) => {
    router.replace({
        query: {
            ...route.query,
            area: newVal
        }
    });
    if (newVal) {
        isLoading.value = true;
        await filter.getZone('cash', period);
        // if (selectedZone.value) {
        //     await filter.getArea(period, selectedZone.value, selectedArea.value);

        // }
        if (selectedArea.value) {
            // await routeStore.getCheckin(period, selectedArea.value);
            showExcel.value = 'true'
        }

        isLoading.value = false;
    }
});

</script>
