<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="flex justify-between">
        <div class="mb-2 flex justify-start">
            <div class="ms-2">
                <VueDatePicker v-model="selectedMonth" format="MM/yyyy" month-picker @update:model-value="onMonthChange" />
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedZone">
                    <option disabled value="">Select Zone</option>
                    <option value="all">ทั้งหมด</option>
                    <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedTeam">
                    <option disabled value="">Select Team</option>
                    <option value="all">ทั้งหมด</option>
                    <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
                    </option>
                </select>
            </div>
            <div class="ms-3">
                <select class="select select-info ms-3 text-center" v-model="selectedArea">
                    <option disabled value="">Select Area</option>
                    <option value="all">ทั้งหมด</option>
                    <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
                </select>
            </div>
            <div class="ms-5">
                <button @click="saveSendmoney" class="btn btn-success">อัพเดทยอด</button>
            </div>

        </div>
        <div>
            <div class="me-10">
                <select class="select select-info ms-3 text-center" v-model="selectedChannel">
                    <option disabled value="">Select Channel</option>
                    <option value="cash">CASH</option>
                    <option value="pc">PC</option>
                </select>
            </div>

        </div>

    </div>
    <div class="overflow-x-auto rounded-xl"
        style="min-height: 450px; max-height: 480px; max-width: 90vw; overflow-y: auto;">
        <table class="min-w-full border text-center text-sm bg-white">
            <thead class="bg-blue-800 text-white" style="position: sticky; top: 0; z-index: 10;">
                <tr>
                    <th class="p-2 border">คลัง</th>
                    <th class="p-2 border">Area</th>
                    <th class="p-2 border">รายชื่อ</th>
                    <th class="p-2 border">ยอดส่งเงิน</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(prod, i) in monthlyList" :key="prod.area + '-' + prod.date" class="align-top">
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.warehouse }}</div>
                    </td>
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.area }}</div>
                    </td>
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ prod.areaName }}</div>
                    </td>
                    <td class="border p-2 text-center whitespace-pre">
                        <div class="">{{ formatNumber(prod.sendmoney) }}</div>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>

</template>
<script setup>

import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useSendmoney } from '../../store/modules/sendmoney'
import { useFilter } from '../../store/modules/filter'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";
import { formatNumber, formatDate, formatCurrency, formatDateToYYYYMMDD, toDateOrNull, endOfDay, getTeam3, } from '../../utils/format'


const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const route = useRoute()
const router = useRouter()
const sendmoneyStore = useSendmoney()
const filter = useFilter()

const monthRange = ref();
const selectedZone = ref(route.query.zone || '')
const selectedTeam = ref(route.query.team || '')
const selectedArea = ref(route.query.area || '')
const isLoading = ref(false)
const selectedMonth = ref('')
const selectedChannel = ref('cash')


async function saveSendmoney() {
    try {
        await sendmoneyStore.saveSendmoneyMonthy(monthlyList.value);
        console.log('statusCode', sendmoneyStore.statusCode)

        if (sendmoneyStore.statusCode === 200) {
            toast('อัพเดทยอดสำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
        }
    } catch (error) {
        toast(error, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
    }

}


const monthlyList = computed(() => {
    let data = sendmoneyStore.sendmoneyMonthyData

    return data;
})


async function onMonthChange(value) {
    let dateObj = null;

    if (value instanceof Date) {
        dateObj = value;
    } else if (value?.year && value?.month) {
        dateObj = new Date(value.year, value.month, 1);
    } else if (value?.value instanceof Date) {
        dateObj = value.value;
    }

    if (!dateObj) return;

    const yyyy = dateObj.getFullYear();
    const mm = dateObj.getMonth() + 1;

    monthRange.value = value;
    isLoading.value = true
    // await sendmoney.downloadtoExcel(formatYMD(firstDate), formatYMD(endDate), false)
    // console.log(firstDate)
    // console.log(lastDate)
    // console.log(value)
    await sendmoneyStore.sendmoneySumByArea(selectedChannel.value, `${yyyy}${String(mm).padStart(2, '0')}`);

    isLoading.value = false
}


onMounted(async () => {
    isLoading.value = true
    await filter.getZone('cash', period);
    const today = new Date();
    selectedMonth.value = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');
    await sendmoneyStore.sendmoneySumByArea(selectedChannel.value, selectedMonth.value);
    isLoading.value = false
});
</script>