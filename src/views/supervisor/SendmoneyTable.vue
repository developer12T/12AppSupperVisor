<template>
    <LoadingOverlay :show="isLoading" text="กำลังโหลดข้อมูล..." />
    <div class="mb-2 flex justify-start">
        <select v-model="viewType" class="select select-bordered ">
            <option value="daily">รายวัน (Daily)</option>
            <option value="monthly">รายเดือน/สรุป (Monthly Summary)</option>
        </select>
        <select class="select select-info ms-3 text-center mb-3" v-model="selectedZone">
            <option disabled value="">Select Zone</option>
            <option v-for="zone in filter.zone" :key="zone" :value="zone.zone">{{ zone.zone }}</option>
        </select>
        <select class="select select-info ms-3 text-center" v-model="selectedTeam">
            <option disabled value="">Select Team</option>
            <option v-for="team in filter.team" :key="team.saleTeam" :value="team.saleTeam">{{ team.saleTeam }}
            </option>
        </select>
        <select class="select select-info ms-3 text-center" v-model="selectedArea">
            <option disabled value="">Select Area</option>
            <option v-for="area in filter.area" :key="area" :value="area.area">{{ area.area }}</option>
        </select>
    </div>


    <div class="overflow-x-auto">
        <table class="table table-zebra w-full text-xs">
            <thead class="bg-base-200">
                <tr>
                    <th v-if="viewType === 'daily'">วันที่</th>
                    <th v-else>พื้นที่</th>
                    <th v-if="viewType === 'daily'">สถานะ</th>
                    <th class="text-right">ส่งเงิน</th>
                    <th class="text-right">ยอดขาย</th>
                    <th class="text-right">ผลต่าง</th>
                    <th class="text-right">ยอดเปลี่ยน</th>
                    <th class="text-right">คืนดี</th>
                    <th class="text-right">คืนเสีย</th>
                </tr>
            </thead>
            <tbody>
                <!-- แสดง daily หรือ monthly -->
                <tr v-if="viewType === 'daily'" v-for="(item, idx) in dailyList" :key="item.date + idx">
                    <td>{{ item.date }}</td>
                    <td v-if="viewType === 'daily'">
                        <span :class="item.status === 'ส่งเงินแล้ว'
                            ? 'badge badge-success'
                            : 'badge badge-warning'">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="text-right">{{ item.sendmoney ? item.sendmoney.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.summary ? item.summary.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.diff ? item.diff.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.change ? item.change.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.good ? item.good.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.damaged ? item.damaged.toLocaleString() : '-' }}</td>
                </tr>
                <tr v-else v-for="(item, idx) in monthlyList" :key="item.area + idx">
                    <td>{{ item.area }}</td>

                    <td class="text-right">{{ item.sendmoney ? item.sendmoney.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.summary ? item.summary.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.diff ? item.diff.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.change ? item.change.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.good ? item.good.toLocaleString() : '-' }}</td>
                    <td class="text-right">{{ item.damaged ? item.damaged.toLocaleString() : '-' }}</td>
                </tr>
            </tbody>
            <!-- footer ถ้าอยากใส่รวม -->
            <tfoot class="bg-base-300 font-bold">
                <tr>
                    <td :colspan="viewType === 'daily' ? 2 : 1" class="text-center">รวม</td>
                    <td class="text-right">{{ sums.sumSendMoney.toLocaleString() }}</td>
                    <td class="text-right">{{ sums.sumSummary.toLocaleString() }}</td>
                    <td class="text-right">{{ sums.sumSummaryDif.toLocaleString() }}</td>
                    <td class="text-right">{{ sums.sumChange.toLocaleString() }}</td>
                    <td class="text-right">{{ sums.sumGood.toLocaleString() }}</td>
                    <td class="text-right">{{ sums.sumDamaged.toLocaleString() }}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup>
import LoadingOverlay from '../LoadingOverlay.vue' // ปรับ path ตามโปรเจกต์
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useFilter } from '../../store/modules/filter'
import { useSendmoney } from '../../store/modules/sendmoney'

const router = useRouter()
const route = useRoute()
const filter = useFilter()
const sendmoney = useSendmoney()
const isLoading = ref(false);
const viewType = ref('monthly')

const selectedZone = ref(route.query.zone || '')
const selectedArea = ref(route.query.area || '')
const selectedTeam = ref(route.query.team || '')

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

// ข้อมูลสำหรับรายวัน
const dailyList = computed(() => sendmoney.dailyData)
// ข้อมูลสำหรับรายเดือน (map ให้ใช้งานกับ v-for)
const monthlyList = computed(() =>
    sendmoney.monthlyData.map(d => ({
        area: d.area,
        ...d.monthly
    }))
)

// รวมยอด (footer)
const sums = computed(() => {
    if (viewType.value === 'daily') {
        return {
            sumSendMoney: sendmoney.dailyData.sumSendMoney || 0,
            sumSummary: sendmoney.dailyData.sumSummary || 0,
            sumSummaryDif: sendmoney.dailyData.sumSummaryDif || 0,
            sumChange: sendmoney.dailyData.sumChange || 0,
            sumGood: sendmoney.dailyData.sumGood || 0,
            sumDamaged: sendmoney.dailyData.sumDamaged || 0,
        }
    } else {
        const total = {
            sumSendMoney: 0,
            sumSummary: 0,
            sumSummaryDif: 0,
            sumChange: 0,
            sumGood: 0,
            sumDamaged: 0,
        }
        monthlyList.value.forEach(item => {
            total.sumSendMoney += item.sendmoney || 0
            total.sumSummary += item.summary || 0
            total.sumSummaryDif += item.diff || 0
            total.sumChange += item.change || 0
            total.sumGood += item.good || 0
            total.sumDamaged += item.damaged || 0
        })
        return total
    }
})

// ========== onMounted ==========

onMounted(async () => {
    isLoading.value = true;
    await filter.getZone(period);
    isLoading.value = false;
    // preload team/area สำหรับ zone แรก (ถ้ามี)
    if (selectedZone.value) {
        await filter.getTeam(selectedZone.value)
        await filter.getArea(period, selectedZone.value, selectedTeam.value)
        // preload monthly
        await fetchMonthlySummary()
    }
})

// ========== watcher ==========

watch(selectedZone, async (newVal) => {
    selectedArea.value = ''
    selectedTeam.value = ''
    if (newVal) {
        isLoading.value = true;
        await filter.getTeam(newVal)
        await filter.getArea(period, newVal, selectedTeam.value)
        await fetchMonthlySummary()
        isLoading.value = false;
    }
})

watch(selectedTeam, async (newVal) => {
    selectedArea.value = ''
    if (selectedZone.value && newVal) {
        isLoading.value = true;
        await filter.getArea(period, selectedZone.value, newVal)
        await fetchMonthlySummary()
        isLoading.value = false;
    }
})

watch(selectedArea, async (newVal) => {
    if (newVal) {
        isLoading.value = true;
        await fetchMonthlySummary()
        await sendmoney.summaryDaily(newVal)
        isLoading.value = false;
    }
})

// ========== ดึง summary ตาม filter ==========

async function fetchMonthlySummary() {
    // ถ้า filter.area เป็น array ของ object [{ area: 'BE221' }, ...]
    let areaArr = filter.area
    if (Array.isArray(areaArr) && areaArr.length > 0 && typeof areaArr[0] === 'object') {
        areaArr = areaArr.map(a => a.area)
    }
    // ตอนนี้ areaArr เป็น array ของ string แล้ว
    let areaStr = Array.isArray(areaArr) ? areaArr.join(',') : areaArr
    if (!areaStr) return
    await sendmoney.summaryMonthlyByZone(areaStr)

}

</script>
