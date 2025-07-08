<template>
    <div class="max-w-6xl mx-auto p-6 mt-8 bg-white rounded-xl shadow space-y-4">
        <h1 class="text-2xl font-bold mb-2">{{ data.name }}</h1>
        <p class="text-gray-700 mb-2">{{ data.description }}</p>
        <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="font-semibold">Give ID:</span> {{ data.giveId }}</div>
            <div><span class="font-semibold">ประเภทกิจกรรม:</span> {{ data.type }}</div>
            <div><span class="font-semibold">หมายเหตุ:</span> {{ data.remark }}</div>
            <div><span class="font-semibold">แผนก:</span> {{ data.dept }}</div>
            <div><span class="font-semibold">สถานะ: </span>
                <span :class="data.status === 'active' ? 'text-green-600' : 'text-gray-400'">
                    {{ data.status }}
                </span>
            </div>
            <div><span class="font-semibold">สร้างเมื่อ:</span> {{ formatDate(data.createdAt) }}</div>
        </div>
        <div>
            <h2 class="font-bold text-lg mt-4 mb-2">เงื่อนไขสินค้า (Conditions)</h2>
            <div v-for="(cond, idx) in data.conditions" :key="cond._id" class="border p-3 rounded-lg mb-2 bg-gray-50">
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <div>
                        <span class="font-semibold">กลุ่มสินค้า:</span> {{ cond.productGroup.join(', ') || '-' }}
                    </div>
                    <div>
                        <span class="font-semibold">ขนาด:</span> {{ cond.productSize.join(', ') || '-' }}
                    </div>
                    <div>
                        <span class="font-semibold">หน่วย:</span> {{ cond.productUnit.join(', ') || '-' }}
                    </div>
                    <div>
                        <span class="font-semibold">จำนวน:</span> {{ cond.productQty }}
                    </div>
                    <div>
                        <span class="font-semibold">ประเภท:</span> {{ cond.limitType }}
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h2 class="font-bold mt-4 mb-2 text-lg">ขอบเขตที่ใช้ (Applicable To)</h2>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div><span class="font-semibold">Store:</span> {{ data.applicableTo.store.join(', ') || '-' }}</div>
                <div><span class="font-semibold">TypeStore:</span> {{ data.applicableTo.typeStore.join(', ') || '-' }}
                </div>
                <div><span class="font-semibold">Zone:</span> {{ data.applicableTo.zone.join(', ') || '-' }}</div>
                <div><span class="font-semibold">Area:</span> {{ data.applicableTo.area.join(', ') || '-' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useGiveAway } from '../../store/modules/giveaway'

const giveawayStore = useGiveAway()
const route = useRoute()

// ตัวอย่าง fetch data จาก API
const data = ref({
    applicableTo: { store: [], typeStore: [], zone: [], area: [] },
    _id: '',
    giveId: '',
    name: '',
    description: '',
    type: '',
    remark: '',
    dept: '',
    conditions: [],
    status: '',
    updatedAt: '',
    createdAt: '',
    __v: 0
})

async function fetchData() {
    await giveawayStore.getGiveAwayDetail(route.params.giveId)
    data.value = giveawayStore.giveawaysDetail
    // ปกติจะเปลี่ยน URL ด้านล่างนี้ให้เป็น API ของจริง
    // const res = await fetch('/api/campaign/6833d31efbd047c8c0bfb758')
    // data.value = await res.json()
    // 👇 MOCK ตัวอย่างใช้แทน API จริง
    // data.value = {
    //     applicableTo: { store: [], typeStore: [], zone: [], area: [] },
    //     _id: "6833d31efbd047c8c0bfb758",
    //     giveId: "GIVE-202505-0001",
    //     name: "กิจกรรมตกแต่งร้านค้าสวยงาม",
    //     description: "แจกผงปรุงรส 75 กรัม 1 ซองให้ร้านค้าสวยงาม",
    //     type: "I16",
    //     remark: "V16",
    //     dept: "09",
    //     conditions: [
    //         {
    //             productId: [],
    //             productGroup: ["ผงปรุงรส"],
    //             productFlavour: [],
    //             productBrand: [],
    //             productSize: ["75 G"],
    //             productUnit: ["PCS"],
    //             productQty: 1,
    //             productAmount: 0,
    //             limitType: "limited",
    //             lot: [],
    //             _id: "6833d31efbd047c8c0bfb759"
    //         }
    //     ],
    //     status: "active",
    //     updatedAt: "2025-05-26T02:34:06.714Z",
    //     createdAt: "2025-05-26T02:34:06.714Z",
    //     __v: 0
    // }
}

function formatDate(dt) {
    return dt ? new Date(dt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

onMounted(() => {
    fetchData()
})
</script>
