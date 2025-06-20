<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <h2 class="text-2xl font-bold mb-6">ใบเบิก</h2>
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div v-for="item in cardData" :key="item.orderId"
                class="bg-white rounded-xl shadow p-6 border flex flex-col gap-2">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold text-lg text-gray-700">เลขใบเบิก</span>
                    <span class="text-sm text-gray-500">{{ item.orderId }}</span>
                </div>
                <div class="text-sm text-gray-500">พื้นที่: <span class="font-semibold">{{ item.area }}</span></div>
                <div class="text-sm text-gray-500">ประเภท: <span class="font-semibold">{{ item.orderTypeName }}</span>
                </div>
                <div class="text-sm text-gray-500">วันที่ส่ง: <span class="font-semibold">{{ formatDate(item.sendDate)
                }}</span></div>
                <div class="text-sm text-gray-500">จำนวนทั้งหมด: <span class="font-semibold">{{ item.total }}</span>
                </div>
                <div>
                    <span class="inline-block rounded px-3 py-1 text-xs font-bold" :class="{
                        'bg-yellow-100 text-yellow-700': item.status === 'pending',
                        'bg-green-100 text-green-700': item.status === 'sent',
                        'bg-red-100 text-red-700': item.status === 'failed'
                    }">
                        {{ statusTH(item.status) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const cardData = [
    {
        area: "BE224",
        orderId: "W680622401",
        orderType: "T04",
        orderTypeName: "รับของเอง",
        sendDate: "2025-05-21",
        total: 1,
        status: "pending"
    },
    {
        area: "BE224",
        orderId: "W680622402",
        orderType: "T04",
        orderTypeName: "รับของเอง",
        sendDate: "2025-06-27",
        total: 5,
        status: "pending"
    },
    {
        area: "BE224",
        orderId: "W680622403",
        orderType: "T04",
        orderTypeName: "รับของเอง",
        sendDate: "2025-06-18",
        total: 10,
        status: "pending"
    }
]

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
        case 'sent': return 'ส่งแล้ว'
        case 'failed': return 'ล้มเหลว'
        default: return status
    }
}
</script>
