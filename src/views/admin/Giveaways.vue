<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">เพิ่มรายการ GiveType</h1>

        <form @submit.prevent="submitForm" class="space-y-4">
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
                <VueMultiselect v-model="selectedTypeStore" :options="typeStoreWithLabel" :multiple="true" track-by="id"
                    :preserve-search="true" :clear-on-select="true" :close-on-select="false"
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
                <VueMultiselect v-model="selectedBrand" :options="brand" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์" label="brandName"
                    track-by="brandName" class="w-full my-2" />
                <VueMultiselect v-model="selectedGroup" :options="group" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกกลุ่ม" label="group"
                    track-by="group" class="w-full my-2" />
                <VueMultiselect v-model="selectedFlavour" :options="flavour" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกรสชาติ" label="flavourName"
                    track-by="flavourName" class="w-full my-2" />
                <VueMultiselect v-model="selectedSize" :options="size" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด" label="size" track-by="size"
                    class="w-full my-2" />
                <VueMultiselect v-model="selectedUnit" :options="unit" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกยูนิต" label="unit"
                    track-by="unit" class="w-full my-2" />
                <input v-model.number="form.conditions[0].productQty" type="number" class="input input-bordered w-full"
                    placeholder="จำนวน" />
                <input v-model.number="form.conditions[0].productAmount" type="number"
                    class="input my-2 input-bordered w-full" placeholder="ราคารวม" />
                <select v-model="form.conditions[0].limitType" class="select select-bordered w-full mt-2">
                    <option value="limited">limited</option>
                    <option value="unlimited">unlimited</option>
                </select>
            </div>

            <button class="btn btn-primary w-full mt-4" type="submit">+ เพิ่มโปรโมชั่นแจกสินค้า</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOption } from '../../store/modules/option'
import { useFilter } from '../../store/modules/filter'
import { useGiveAway } from '../../store/modules/giveaway'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";

const today = new Date();
const period = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0');

const optionStore = useOption()
const filterStore = useFilter()
const giveawayStore = useGiveAway()

const router = useRouter()

const selectedArea = ref([])
const selectedZone = ref([])
const selectedTypeStore = ref([])

const selectedFlavour = ref([])
const selectedGroup = ref([])
const selectedSize = ref([])
const selectedBrand = ref([])
const selectedUnit = ref([])

const area = ref([])
const zone = ref([])
const typeStore = ref([])

const flavour = ref([])
const group = ref([])
const size = ref([])
const brand = ref([])
const unit = ref([])

// ** ใช้ computed ให้อ่านค่าแบบ reactive ได้ **
const typeStoreWithLabel = computed(() => {
    return typeStore.value.map(item => ({
        ...item,
        label: `${item.id} - ${item.name}`,
    }))
})

// --- Form Data ---
const form = ref({
    name: '',
    description: '',
    type: '',
    remark: '',
    dept: '',
    applicableTo: {
        store: [],
        typeStore: [],
        zone: [],
        area: [],
    },
    conditions: [
        {
            productId: [],
            productGroup: [],
            productFlavour: [],
            productBrand: [],
            productSize: [],
            productUnit: [],

            limitType: 'limited',
        },
    ],
    status: 'active',
})


watch(selectedZone, async (newVal) => {
    const zoneString = newVal.map(item => item.zone).join(',')
    await filterStore.getArea(period, zoneString)
    area.value = filterStore.area
    // console.log('selectedZone', zoneString)
})



const submitForm = async () => {
    try {

        form.value.applicableTo.typeStore = selectedTypeStore.value.map(item => item.id)
        form.value.applicableTo.area = selectedArea.value.map(item => item.area)
        form.value.applicableTo.zone = selectedZone.value.map(item => item.zone)

        form.value.conditions[0].productBrand = selectedBrand.value.map(item => item.brandName)
        form.value.conditions[0].productGroup = selectedGroup.value.map(item => item.group)
        form.value.conditions[0].productFlavour = selectedFlavour.value.map(item => item.flavourName)
        form.value.conditions[0].productSize = selectedSize.value.map(item => item.size)
        form.value.conditions[0].productUnit = selectedUnit.value.map(item => item.unit)

        await giveawayStore.addGiveAway(form.value)
        if (giveawayStore.statusCode == 201) {
            toast('เพิ่มโปรโมทชั่นใหม่สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
            // --- delay 1.5 วินาที ก่อน push-- -
            setTimeout(() => {
                router.push('/admin/giveawayall')
            }, 1500)
        } else {
            // toast(`เพิ่มโปรโมทชั่นใหม่ไม่สำเร็จ (${giveawayStore.statusCode})`, {
            //     theme: toast.THEME.COLORED,
            //     type: toast.TYPE.ERROR,
            //     dangerouslyHTMLString: true
            // })
        }
    } catch (err) {
        console.error('❌ เกิดข้อผิดพลาด:', err)
        // toast('❌ ส่งข้อมูลไม่สำเร็จ', {
        //     theme: toast.THEME.COLORED,
        //     type: toast.TYPE.ERROR,
        //     dangerouslyHTMLString: true
        // })
    }
}

// --- onMounted โหลด options ---
onMounted(async () => {
    await optionStore.getTypeStore()
    await filterStore.getZone(period)
    await filterStore.getArea(period, '', '')

    await optionStore.getBrand()
    await optionStore.getGroup()
    await optionStore.getSize()
    await optionStore.getUnitFilter('', '', '', '')
    await optionStore.getFlavour()

    typeStore.value = optionStore.typeStore
    area.value = filterStore.area
    zone.value = filterStore.zone

    flavour.value = optionStore.flavour
    brand.value = optionStore.brand
    group.value = optionStore.group
    size.value = optionStore.size
    unit.value = optionStore.unitFilter
})
</script>
