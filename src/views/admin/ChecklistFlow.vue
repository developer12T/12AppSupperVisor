<template>
    <div class="flex items-center mb-4 gap-5">
        <div>
            <label for="dateStart" class="block mb-2 font-bold">เลือกวันที่เริ่ม</label>
            <input id="dateStart" type="date" v-model="selectedDateStart" class="border rounded p-2" />
            <div v-if="selectedDateStart" class="mt-4">
                วันที่เริ่ม: <span class="font-semibold">{{ formatDate(selectedDateStart) }}</span>
            </div>
        </div>
        <div>
            <label for="dateEnd" class="block mb-2 font-bold">เลือกวันที่สิ้นสุด</label>
            <input id="dateEnd" type="date" v-model="selectedDateEnd" class="border rounded p-2" />
            <div v-if="selectedDateEnd" class="mt-4">
                วันที่สิ้นสุด: <span class="font-semibold">{{ formatDate(selectedDateEnd) }}</span>
            </div>
        </div>
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
        <button class="btn btn-success text-white" @click="exportExcel">Export Excel</button>
        <button class="btn btn-primary text-white" @click="searchChecklist">ค้นหา</button>
    </div>

    <table class="table-auto border-collapse w-full">
        <thead>
            <tr>
                <th class="border p-2 text-center">เขต</th>
                <th class="border p-2 text-center">การเปิดร้านค้า</th>
                <th class="border p-2 text-center">การเข้าเยี่ยม</th>
                <th class="border p-2 text-center">การเปิดขาย</th>
                <th class="border p-2 text-center">การเบิก</th>
                <th class="border p-2 text-center">การคืนสินค้า</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in tableData" :key="item.area">
                <td class="border p-2 text-center">{{ item.area }}</td>
                <td class="border p-2 text-center" :class="{
                    'bg-red-200 text-red-700': item.store === 0,
                    'bg-green-200 text-green-700': item.store === 1
                }">{{ item.store }}</td>
                <td class="border p-2 text-center" :class="{
                    'bg-red-200 text-red-700': item.Route === 0,
                    'bg-green-200 text-green-700': item.Route === 1
                }">{{ item.Route }}</td>
                <td class="border p-2 text-center" :class="{
                    'bg-red-200 text-red-700': item.order === 0,
                    'bg-green-200 text-green-700': item.order === 1
                }">{{ item.order }}</td>
                <td class="border p-2 text-center" :class="{
                    'bg-red-200 text-red-700': item.distribution === 0,
                    'bg-green-200 text-green-700': item.distribution === 1
                }">{{ item.distribution }}</td>
                <td class="border p-2 text-center" :class="{
                    'bg-red-200 text-red-700': item.refund === 0,
                    'bg-green-200 text-green-700': item.refund === 1
                }">{{ item.refund }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useReport } from '../../store/modules/report'
import { useFilter } from '../../store/modules/filter'

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const reportStore = useReport()
const filter = useFilter()
const router = useRouter()
const route = useRoute()

const tableData = ref([])
const selectedDateStart = ref('')
const selectedDateEnd = ref('')

const userRole = localStorage.getItem('role')

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

// ฟังก์ชัน format วันที่ (dd-mm-yyyy)
function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
}

// ฟังก์ชัน format yyyy-mm-dd สำหรับส่งไปหลังบ้าน
function formatDate2(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

async function searchChecklist() {
    if (selectedDateStart !== undefined && selectedDateStart) {
        await reportStore.getChecklist(
            formatDate2(selectedDateStart.value),
            formatDate2(selectedDateEnd.value),
            selectedZone.value,
            selectedTeam.value,
            selectedArea.value
        )
    }

    tableData.value = reportStore.checklist
}

// dummy function (ใส่โค้ด export excel จริงตรงนี้)
async function exportExcel() {
    await reportStore.downloadExcel(
        formatDate2(selectedDateStart.value),
        formatDate2(selectedDateEnd.value)
    )
}

watch(selectedTeam, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    if (newVal) {
        filter.getArea(period, selectedZone.value, newVal);
    }
});


watch(selectedZone, async (newVal) => {
    selectedArea.value = '' // Reset area when zone changes
    // router.replace({
    //     query: {
    //         ...route.query,
    //         zone: newVal,
    //         area: '' // clear old area
    //     }
    // });
    if (newVal) {
        filter.getArea(period, newVal, selectedTeam.value);
        filter.getTeam(newVal);
    }
});

onMounted(async () => {
    await reportStore.getChecklist('', '', '', '', '')
    await filter.getZone(period);
    tableData.value = reportStore.checklist
})
</script>
