<template>
    <div class="p-4 max-w-4xl mx-auto">
        <h1 class="text-xl font-bold mb-4">สร้างรายการโปรโมทชั่น</h1>

        <form @submit.prevent="submitForm" class="space-y-4">
            <input v-model="form.name" class="input input-bordered w-full" placeholder="Promotion Name" />
            <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                placeholder="Description"></textarea>

            <div class="grid grid-cols-3 gap-4">
                <select class="select  w-full" v-model="form.proType">
                    <option disabled value="">เลือกโปร</option>
                    <option value="free">Free</option>
                    <option value="amount">Amonut</option>
                    <option value="discount">Discount</option>
                </select>
                <!-- <input v-model="form.proType" class="input input-bordered w-full" placeholder="Promotion Type" /> -->
                <input v-model="form.proCode" class="input input-bordered w-full" placeholder="Promotion Code" />
                <input v-model="form.coupon" class="input input-bordered w-full" placeholder="Coupon" />
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold">เงื่อนไขร้านค้า</h2>
                <VueMultiselect v-model="selectedArea" :options="area" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์" label="area"
                    track-by="area" class="w-full my-2" />
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
                    track-by="flavourName" class="w-full my-2" />
                <VueMultiselect v-model="selectedSize" :options="size" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด" label="size" track-by="size"
                    class="w-full my-2" />
                <input v-model="form.conditions[0].productAmount" type="number" class="input input-bordered w-full my-2"
                    placeholder="Amount" />
                <input v-model="form.conditions[0].productQty" type="number" class="input input-bordered w-full"
                    placeholder="Quantity" />
            </div>

            <div v-for="(reward, index) in form.rewards" :key="index" class="border p-4 rounded">
                <div class="flex justify-between">
                    <h2 class="font-semibold">ของรางวัล {{ index + 1 }}</h2>
                    <button v-if="index !== 0" type="button" class="btn btn-error "
                        @click="deleteReward(index)">ลบของรางวัล</button>
                </div>
                <input v-model="reward.productId" class="input input-bordered w-full my-2" placeholder="Product ID" />
                <VueMultiselect v-model="selectedBrandReward[index]" :options="brandReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์"
                    label="brandName" track-by="brandName" class="w-full my-2" />
                <VueMultiselect v-model="selectedGroupReward[index]" :options="groupReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกกลุ่ม"
                    label="group" track-by="group" class="w-full my-2" />
                <VueMultiselect v-model="selectedFlavourReward[index]" :options="flavourReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกรสชาติ"
                    label="flavourName" track-by="flavourId" class="w-full my-2" />
                <VueMultiselect v-model="selectedSizeReward[index]" :options="sizeReward" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด"
                    label="size" track-by="size" class="w-full my-2" />
                <input v-model="reward.productGroup" class="input input-bordered w-full my-2"
                    placeholder="Product Group" />
                <input v-model="reward.productUnit" class="input input-bordered w-full"
                    placeholder="Unit (e.g., PCS)" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <label>Valid From:
                    <input type="date" v-model="form.validFrom" class="input input-bordered w-full" />
                </label>
                <label>Valid To:
                    <input type="date" v-model="form.validTo" class="input input-bordered w-full" />
                </label>
            </div>
            <button type="button" class="btn btn-secondary w-full" @click="addReward">+ เพิ่มของรางวัล</button>
            <button class="btn btn-primary w-full">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOption } from '../../store/modules/option'
import { usePromotionsStore } from '../../store/modules/promotion'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const router = useRouter()
const optionStore = useOption()
const promotionStore = usePromotionsStore()

const selectedFlavour = ref([])
const selectedGroup = ref([])
const selectedSize = ref([])
const selectedBrand = ref([])
const selectedArea = ref([])

const selectedFlavourReward = ref([])
const selectedGroupReward = ref([])
const selectedSizeReward = ref([])
const selectedBrandReward = ref([])

const flavour = ref([])
const group = ref([])
const size = ref([])
const brand = ref([])
const area = ref([])

const flavourReward = ref([])
const groupReward = ref([])
const sizeReward = ref([])
const brandReward = ref([])

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

const deleteReward = (index) => {
    form.value.rewards.splice(index, 1)
    selectedBrandReward.value.splice(index, 1)
    selectedGroupReward.value.splice(index, 1)
    selectedFlavourReward.value.splice(index, 1)
    selectedSizeReward.value.splice(index, 1)
}

const addReward = () => {
    form.value.rewards.push({
        productId: '',
        productGroup: '',
        productFlavour: '',
        productBrand: '',
        productSize: '',
        productUnit: 'PCS',
        productQty: 1,
        limitType: 'limited'
    })
    selectedBrandReward.value.push(null)
    selectedGroupReward.value.push(null)
    selectedFlavourReward.value.push(null)
    selectedSizeReward.value.push(null)
}

const submitForm = async () => {
    // print(form.value);
    form.value.conditions[0].productBrand = selectedBrand.value.map(item => item.brandName)
    form.value.conditions[0].productGroup = selectedGroup.value.map(item => item.group)
    form.value.conditions[0].productFlavour = selectedFlavour.value.map(item => item.flavourName)
    form.value.conditions[0].productSize = selectedSize.value.map(item => item.size)
    console.log(form.value)


    // try {
    //     await promotionStore.addPromotion('https://apps.onetwotrading.co.th/api/cash/promotion/add', form.value)
    //     router.push('/admin/promotion')
    // } catch (err) {
    //     console.error(err)
    // }
}

onMounted(async () => {
    await optionStore.getFlavour()
    await optionStore.getArea()
    await optionStore.getBrand()
    await optionStore.getGroup()
    await optionStore.getSize()

    flavour.value = optionStore.flavour
    area.value = optionStore.area
    brand.value = optionStore.brand
    group.value = optionStore.group
    size.value = optionStore.size

    flavourReward.value = optionStore.flavour
    brandReward.value = optionStore.brand
    groupReward.value = optionStore.group
    sizeReward.value = optionStore.size
})
</script>
