<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Send Money</h2>

        <div class="overflow-x-auto">
            <table class="table table-zebra w-full border border-gray-300">
                <thead class="bg-gray-200">
                    <tr>
                        <th>No.</th>
                        <th>รูท</th>
                        <th>ยอดส่ง</th>
                        <th>ยออดรวม</th>
                        <th>รูปภาพ</th>
                        <th>วันที่</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in sendMoneyList" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.area }}</td>
                        <td>{{ formatCurrency(item.sendmoney) }}</td>
                        <td>{{ formatCurrency(item.sendmoney) }}</td>
                        <td>
                            <img @click="openPreview(filePathToUrl(item.imageList[0].path))"
                                :src="filePathToUrl(item.imageList[0].path)" alt="placeholder"
                                :style="{ width: '75px', height: '75px', objectFit: 'cover' }" />
                        </td>
                        <td>{{ formatDate(item.createdAt) }}</td>
                        <!-- <td>
                            <span :class="statusColor(item.status)">
                                {{ item.status }}
                            </span>
                        </td> -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-if="previewImg" @click.self="closePreview"
        style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000">
        <img :src="previewImg" style="max-width:90vw;max-height:90vh;border-radius:16px;background:#fff" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSendmoney } from '../../store/modules/sendmoney'


function filePathToUrl(filePath) {
    return filePath.replace('/var/www/12AppAPI/public', 'https://apps.onetwotrading.co.th')
}


const previewImg = ref(null)
function openPreview(src) {
    previewImg.value = src
}
function closePreview() {
    previewImg.value = null
}

const sendmoneyStore = useSendmoney()

const sendMoneyList = ref([])

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'THB',
    }).format(value)
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateStr).toLocaleDateString('th-TH', options)
}

function statusColor(status) {
    switch (status) {
        case 'pending':
            return 'text-yellow-600 font-semibold'
        case 'sent':
            return 'text-green-600 font-semibold'
        case 'failed':
            return 'text-red-600 font-semibold'
        default:
            return ''
    }
}

onMounted(async () => {
    await sendmoneyStore.getSendmoney();
    sendMoneyList.value = sendmoneyStore.sendmoney
})
</script>

<style scoped>
.table th,
.table td {
    padding: 0.75rem;
    text-align: left;
}
</style>
