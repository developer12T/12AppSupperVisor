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
                <input v-model="form.applicableTo.store" class="input input-bordered w-full my-2"
                    placeholder="รหัสร้านค้า" />
                <VueMultiselect v-model="selectedTypeStore" :options="typeStoreWithLabel" :multiple="true"
                    track-by="label" :preserve-search="true" :clear-on-select="true" :close-on-select="false"
                    placeholder="เลือกประเภทร้านค้า" class="w-full mb-2" label="label" />
                <VueMultiselect v-model="selectedZone" :options="zone" :multiple="true" track-by="zone"
                    :preserve-search="true" :clear-on-select="true" :close-on-select="false" placeholder="เลือกโซน"
                    class="w-full mb-2" label="zone" />
                <VueMultiselect v-model="selectedArea" :options="area" :multiple="true" track-by="area"
                    :preserve-search="true" :clear-on-select="true" :close-on-select="false" placeholder="เลือกเขต"
                    class="w-full mb-2" label="area" />
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
import { ref, onMounted, computed } from 'vue'
import { useOption } from '../../store/modules/option'
import { useFilter } from '../../store/modules/filter'
import axios from 'axios'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { toast } from 'vue3-toastify';
const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');


const optionStore = useOption()
const filterStore = useFilter()

const selectedFlavour = ref([])
const selectedGroup = ref([])
const selectedSize = ref([])
const selectedBrand = ref([])
const selectedArea = ref([])
const selectedZone = ref([])
const selectedTypeStore = ref([])

const flavour = ref([])
const group = ref([])
const size = ref([])
const brand = ref([])
const area = ref([])
const zone = ref([])
const typeStore = ref([])

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

const submitForm = async () => {
    try {
        form.value.applicableTo.area = selectedArea.value.map(item => item.area)
        form.value.applicableTo.typeStore = selectedTypeStore.value.map(item => item.id)

    } catch (error) {
        toast(`${err}`, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        console.error(err)
    }
}

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

const typeStoreWithLabel = computed(() => {
    return typeStore.value.map(item => ({
        ...item,
        label: `${item.id} - ${item.name}`,
    }))
})


onMounted(async () => {
    await optionStore.getTypeStore()
    await filterStore.getZone(period)
    await filterStore.getArea(period, '')
    typeStore.value = optionStore.typeStore
    area.value = filterStore.area
    zone.value = filterStore.zone
})
</script>
