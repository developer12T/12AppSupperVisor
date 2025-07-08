<template>
    <div class="max-w-7xl mx-auto p-6">
        <div class="flex justify-between mb-4">
            <h1 class="text-2xl font-bold mb-4">กิจกรรมโปรโมชั่น</h1>
            <router-link to="/admin/giveaway">
                <button class="btn btn-primary">เพิ่มโปรโมชั่น</button>
            </router-link>
        </div>
        <table class="table-auto w-full border shadow-md">
            <thead class="bg-gray-100">
                <tr>
                    <th class="p-2 border">Give ID</th>
                    <th class="p-2 border">ชื่อกิจกรรม</th>
                    <th class="p-2 border">รายละเอียด</th>
                    <th class="p-2 border">ประเภท</th>
                    <th class="p-2 border">สินค้าเงื่อนไข</th>
                    <th class="p-2 border">สถานะ</th>
                    <th class="p-2 border">วันที่สร้าง</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in gives" :key="item._id" class="hover:bg-blue-50 cursor-pointer"
                    @click="goDetail(item)">
                    <td class="p-2 border">{{ item.giveId }}</td>
                    <td class="p-2 border">{{ item.name }}</td>
                    <td class="p-2 border">{{ item.description }}</td>
                    <td class="p-2 border">{{ item.type }}</td>
                    <td class="p-2 border">
                        <div v-for="cond in item.conditions" :key="cond._id">
                            <div v-if="cond.productGroup.length">กลุ่ม: {{ cond.productGroup.join(', ') }}</div>
                            <div v-if="cond.productSize.length">ขนาด: {{ cond.productSize.join(', ') }}</div>
                            <div v-if="cond.productUnit.length">หน่วย: {{ cond.productUnit.join(', ') }}</div>
                            <div>จำนวน: {{ cond.productQty }}</div>
                        </div>
                    </td>
                    <td class="p-2 border">
                        <span :class="item.status === 'active' ? 'text-green-600' : 'text-gray-500'">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="p-2 border">
                        {{ formatDate(item.createdAt) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGiveAway } from '../../store/modules/giveaway'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter();

const giveawayStore = useGiveAway()
const gives = ref([])


function goDetail(item) {
    router.push({ name: 'GiveDetail', params: { giveId: item.giveId } })
}

const fetchGives = async () => {
    try {
        // 👇 Replace with your real API endpoint!
        // const res = await axios.get('/api/give')
        await giveawayStore.getGiveAwayPromotion()
        gives.value = giveawayStore.giveaways

    } catch (err) {
        gives.value = [] // or show error
    }
}

const formatDate = dateStr => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric'
    })
}

onMounted(fetchGives)
</script>

<style scoped>
.table-auto th,
.table-auto td {
    text-align: left;
    vertical-align: top;
}
</style>
