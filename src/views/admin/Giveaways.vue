<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">เพิ่มรายการ GiveType</h1>

        <form @submit.prevent="submitGiveType" class="space-y-4">
            <input v-model="form.name" class="input input-bordered w-full" placeholder="ชื่อกิจกรรม" />
            <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                placeholder="คำอธิบาย"></textarea>

            <div class="grid grid-cols-2 gap-4">
                <input v-model="form.type" class="input input-bordered w-full" placeholder="ประเภท (type)" />
                <input v-model="form.remark" class="input input-bordered w-full" placeholder="หมายเหตุ (remark)" />
            </div>

            <input v-model="form.dept" class="input input-bordered w-full" placeholder="รหัสแผนก (dept)" />

            <!-- ApplicableTo Section -->
            <div class="border p-4 rounded mt-4">
                <h2 class="font-semibold mb-2">กำหนดเงื่อนไขร้านค้า (Applicable To)</h2>

                <VueMultiselect v-model="form.applicableTo.store" :options="storeOptions" :multiple="true"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกร้านค้า"
                    label="storeId" track-by="storeId" class="w-full mb-2" />

                <VueMultiselect v-model="form.applicableTo.typeStore" :options="typeStoreOptions" :multiple="true"
                    placeholder="เลือกประเภทร้านค้า" class="w-full mb-2" />

                <VueMultiselect v-model="form.applicableTo.zone" :options="zoneOptions" :multiple="true"
                    placeholder="เลือกโซน" class="w-full mb-2" />

                <VueMultiselect v-model="form.applicableTo.area" :options="areaOptions" :multiple="true"
                    placeholder="เลือกพื้นที่" class="w-full" />
            </div>

            <!-- เงื่อนไขการแจก -->
            <div class="border p-4 rounded mt-4">
                <h2 class="font-semibold">เงื่อนไขการแจก</h2>

                <input v-model="form.conditions[0].productGroup[0]" class="input input-bordered w-full my-2"
                    placeholder="ชื่อกลุ่มสินค้า (Product Group)" />
                <input v-model="form.conditions[0].productSize[0]" class="input input-bordered w-full"
                    placeholder="ขนาด (เช่น 75 G)" />
                <input v-model="form.conditions[0].productUnit[0]" class="input input-bordered w-full"
                    placeholder="หน่วยสินค้า (เช่น PCS)" />
                <input v-model.number="form.conditions[0].productQty" type="number" class="input input-bordered w-full"
                    placeholder="จำนวน" />
                <select v-model="form.conditions[0].limitType" class="select select-bordered w-full mt-2">
                    <option value="limited">limited</option>
                    <option value="unlimited">unlimited</option>
                </select>
            </div>

            <button class="btn btn-primary w-full mt-4" type="submit">ส่งข้อมูล</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

// --- Form Data ---
const form = ref({
    name: 'กิจกรรมตกแต่งร้านค้าสวยงาม',
    description: 'แจกผงปรุงรส 75 กรัม 1 ซองให้ร้านค้าสวยงาม',
    type: 'I16',
    remark: 'V16',
    dept: '09',
    applicableTo: {
        store: [],
        typeStore: [],
        zone: [],
        area: [],
    },
    conditions: [
        {
            productId: [],
            productGroup: ['ผงปรุงรส'],
            productFlavour: [],
            productBrand: [],
            productSize: ['75 G'],
            productUnit: ['PCS'],
            productQty: 1,
            productAmount: 0,
            limitType: 'limited',
        },
    ],
    status: 'active',
})

// --- Mock Options (เปลี่ยนเป็น API ได้ภายหลัง) ---
const storeOptions = [
    { storeId: 'V0000145464' },
    { storeId: 'VBE1231200' },
    { storeId: 'VTEST001' },
]

const typeStoreOptions = ['031', '045', '099']
const zoneOptions = ['BE', 'SH', 'NN']
const areaOptions = ['BE215', 'BE123', 'SH101']

// --- Submit Handler ---
const prepareFormData = () => {
    const cloned = JSON.parse(JSON.stringify(form.value))
    cloned.applicableTo.store = form.value.applicableTo.store.map(s => s.storeId)
    return cloned
}

const submitGiveType = async () => {
    try {
        const payload = prepareFormData()
        console.log('🔧 ส่งข้อมูล:', payload)
        await axios.post('https://your-api-url.com/givetype/add', payload)
        alert('✅ ส่งข้อมูลเรียบร้อยแล้ว')
    } catch (err) {
        console.error('❌ เกิดข้อผิดพลาด:', err)
        alert('❌ ส่งข้อมูลไม่สำเร็จ')
    }
}
</script>
