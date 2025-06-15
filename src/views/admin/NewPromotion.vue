<template>
    <div class="p-4 max-w-4xl mx-auto">
        <h1 class="text-xl font-bold mb-4">สร้างรายการโปรโมทชั่น</h1>

        <form @submit.prevent="submitForm" class="space-y-4">
            <input v-model="form.name" class="input input-bordered w-full" placeholder="Promotion Name" />

            <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                placeholder="Description"></textarea>

            <div class="grid grid-cols-3 gap-4">
                <input v-model="form.proType" class="input input-bordered w-full" placeholder="Promotion Type" />
                <input v-model="form.proCode" class="input input-bordered w-full" placeholder="Promotion Code" />
                <input v-model="form.coupon" class="input input-bordered w-full" placeholder="Coupon" />
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold">เงื่อนไขร้านค้า</h2>
                <VueMultiselect v-model="selectedArea" :options="area" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์" label="area"
                    track-by="area" class="w-full my-2" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <label>Valid From:
                    <input type="date" v-model="form.validFrom" class="input input-bordered w-full" />
                </label>
                <label>Valid To:
                    <input type="date" v-model="form.validTo" class="input input-bordered w-full" />
                </label>
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold">เงื่อนไขสินค้า</h2>
                <VueMultiselect v-model="selectedBrand" :options="brand" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์" label="brandName"
                    track-by="brandName" class="w-full my-2" />
                <VueMultiselect v-model="selectedGroup" :options="group" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกกลุ่ม" label="group"
                    track-by="group" class="w-full my-2" />
                <VueMultiselect v-model="selectedFlavour" :options="flavour" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกรสชาติ" label="flavourName"
                    track-by="flavourId" class="w-full my-2" />
                <VueMultiselect v-model="selectedSize" :options="size" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด" label="size" track-by="size"
                    class="w-full my-2" />
                <input v-model="form.conditions[0].productAmount" type="number" class="input input-bordered w-full my-2"
                    placeholder="Amount" />
                <input v-model="form.conditions[0].productQty" type="number" class="input input-bordered w-full"
                    placeholder="Quantity" />
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold">ของรางวัล</h2>
                <label>รหัส
                    <input v-model="form.rewards[0].productId" class="input input-bordered w-full my-2"
                        placeholder="Product ID" />
                </label>
                <VueMultiselect v-model="selectedBrandReward" :options="brandReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์"
                    label="brandName" track-by="brandName" class="w-full my-2" />
                <VueMultiselect v-model="selectedGroupReward" :options="groupReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกกลุ่ม"
                    label="group" track-by="group" class="w-full my-2" />
                <VueMultiselect v-model="selectedFlavourReward" :options="flavourReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกรสชาติ"
                    label="flavourName" track-by="flavourId" class="w-full my-2" />
                <VueMultiselect v-model="selectedSizeReward" :options="sizeReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด"
                    label="size" track-by="size" class="w-full my-2" />
                <label>จำนวณ
                    <input v-model="form.rewards[0].productGroup" class="input input-bordered w-full my-2"
                        placeholder="Product Group" />
                </label>
                <label>หน่วย
                    <input v-model="form.rewards[0].productUnit" class="input input-bordered w-full"
                        placeholder="Unit (e.g., PCS)" />
                </label>
            </div>

            <button class="btn btn-primary w-full">Submit</button>
        </form>
    </div>
</template>

<script setup>

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useOption } from '../../store/modules/option';
import { usePromotionsStore } from '../../store/modules/promotion';
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const router = useRouter()


const optionStore = useOption()
const promotionStore = usePromotionsStore()


const selectedFlavour = ref([])
const selectedGroup = ref([])
const selectedSize = ref([])
const selectedBrand = ref([])
const selectedTypestore = ref([])
const selectedArea = ref([])


const selectedFlavourReward = ref([])
const selectedGroupReward = ref([])
const selectedSizeReward = ref([])
const selectedBrandReward = ref([])
const selectedTypestoreReward = ref([])
const selectedAreaReward = ref([])

const flavour = ref([])
const group = ref([])
const size = ref([])
const brand = ref([])
const area = ref([])
const typestore = ref([])


const flavourReward = ref([])
const groupReward = ref([])
const sizeReward = ref([])
const brandReward = ref([])
const areaReward = ref([])
const typestoreReward = ref([])
// const options = ['Bangkok', 'Chiang Mai', 'Phuket', 'Rayong']


const form = ref({
    name: '',
    description: '',
    proType: 'free',
    proCode: '',
    coupon: '',
    applicableTo: {
        store: [],
        typeStore: [],
        zone: [],
        area: []
    },
    except: [],
    conditions: [
        {
            productId: [],
            productGroup: [],
            productFlavour: [],
            productBrand: [],
            productSize: [],
            productUnit: [],
            productQty: 1,
            productAmount: 0
        }
    ],
    rewards: [
        {
            productId: '',
            productGroup: '',
            productFlavour: '',
            productBrand: '',
            productSize: '',
            productUnit: 'PCS',
            productQty: 1,
            limitType: 'limited'
        }
    ],
    discounts: [],
    validFrom: '',
    validTo: ''
})

// const submitForm = async () => {
//   try {
//     const response = await axios.post('/api/cash/promotion/add', form.value)
//     toast.success('เพิ่มโปรโมชั่นเรียบร้อยแล้ว')
//     router.push('/promotion') // ไปหน้ารายการโปรโมชั่นหลังเพิ่มเสร็จ
//   } catch (err) {
//     console.error(err)
//     toast.error('เกิดข้อผิดพลาดในการเพิ่มโปรโมชั่น')
//   }
// }


const submitForm = async () => {
    try {
        const response = await promotionStore.addPromotion('https://apps.onetwotrading.co.th/api/cash/promotion/add', form.value)
        router.push('/admin/promotion') // ไปหน้ารายการโปรโมชั่นหลังเพิ่มเสร็จ
    } catch (err) {
        console.error(err)

    }
}

onMounted(async () => {
    await optionStore.getFlavour()
    await optionStore.getArea()
    await optionStore.getBrand()
    await optionStore.getGroup()
    await optionStore.getSize()
    // await optionStore.getZone()
    flavour.value = optionStore.flavour
    area.value = optionStore.area
    brand.value = optionStore.brand
    group.value = optionStore.group
    size.value = optionStore.size


    flavourReward.value = optionStore.flavour
    areaReward.value = optionStore.area
    brandReward.value = optionStore.brand
    groupReward.value = optionStore.group
    sizeReward.value = optionStore.size
})



</script>
