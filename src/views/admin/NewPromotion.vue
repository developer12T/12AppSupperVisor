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
                    <option value="amount">Amount</option>
                    <option value="discount">Discount</option>
                </select>
                <input v-model="form.proCode" class="input input-bordered w-full" placeholder="Promotion Code" />
                <input v-model="form.coupon" class="input input-bordered w-full" placeholder="Coupon" />
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold">เงื่อนไขร้านค้า</h2>
                <VueMultiselect v-model="selectedArea" :options="area" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกพื้นที่" label="area"
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
                <VueMultiselect v-model="selectedUnit" :options="unit" :multiple="true" :close-on-select="false"
                    :clear-on-select="true" :preserve-search="true" placeholder="เลือกยูนิต" label="unit"
                    track-by="unit" class="w-full my-2" />
                <input v-model="form.conditions[0].productQty" type="number" class="input input-bordered w-full"
                    placeholder="Quantity" />
            </div>

            <div v-for="(reward, index) in form.rewards" :key="index" class="border p-4 rounded">
                <div class="flex justify-between">
                    <h2 class="font-semibold">ของรางวัล {{ index + 1 }}</h2>
                    <button v-if="index !== 0" type="button" class="btn btn-error text-white"
                        @click="deleteReward(index)">ลบของรางวัล</button>
                </div>

                <input v-model="reward.productId" class="input input-bordered w-full my-2" placeholder="Product ID" />

                <VueMultiselect v-model="selectedBrandReward[index]" :options="brandReward[index]" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกแบรนด์"
                    label="brandName" track-by="brandName" class="w-full my-2" />
                <VueMultiselect v-model="selectedGroupReward[index]" :options="groupReward[index]" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกกลุ่ม"
                    label="group" track-by="group" class="w-full my-2" />
                <VueMultiselect v-model="selectedFlavourReward[index]" :options="flavourReward[index]" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกรสชาติ"
                    label="flavour" track-by="flavour" class="w-full my-2" />
                <VueMultiselect v-model="selectedSizeReward[index]" :options="sizeReward[index]" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกขนาด"
                    label="size" track-by="size" class="w-full my-2" />
                <VueMultiselect v-model="selectedUnitReward[index]" :options="unitReward[index]" :multiple="false"
                    :close-on-select="false" :clear-on-select="true" :preserve-search="true" placeholder="เลือกยูนิต"
                    label="unit" track-by="unit" class="w-full my-2" />
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOption } from '../../store/modules/option'
import { usePromotionsStore } from '../../store/modules/promotion'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { toast } from 'vue3-toastify';

const router = useRouter()
const optionStore = useOption()
const promotionStore = usePromotionsStore()

const selectedFlavour = ref([])
const selectedGroup = ref([])
const selectedSize = ref([])
const selectedBrand = ref([])
const selectedUnit = ref([])
const selectedArea = ref([])

const selectedFlavourReward = ref([null])
const selectedGroupReward = ref([null])
const selectedSizeReward = ref([null])
const selectedBrandReward = ref([null])
const selectedUnitReward = ref([null])

const flavour = ref([])
const group = ref([])
const size = ref([])
const brand = ref([])
const area = ref([])
const unit = ref([])

const flavourReward = ref([[]])
const groupReward = ref([[]])
const sizeReward = ref([[]])
const brandReward = ref([[]])
const unitReward = ref([[]])

const form = ref({
    name: '',
    description: '',
    proType: '',
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
            productUnit: 'ซอง',
            productQty: 1,
            limitType: 'limited'
        }
    ],
    discounts: [],
    validFrom: '',
    validTo: ''
})

const addReward = () => {
    form.value.rewards.push({
        productId: '',
        productGroup: '',
        productFlavour: '',
        productBrand: '',
        productSize: '',
        productUnit: 'ซอง',
        productQty: 1,
        limitType: 'limited'
    })

    // options per reward
    brandReward.value.push(brand.value)
    groupReward.value.push(group.value)
    flavourReward.value.push(flavour.value)
    sizeReward.value.push(size.value)
    unitReward.value.push(unit.value)
    // selection per reward
    selectedBrandReward.value.push(null)
    selectedGroupReward.value.push(null)
    selectedFlavourReward.value.push(null)
    selectedSizeReward.value.push(null)
    selectedUnitReward.value.push(null)
    // setup watcher
    const index = form.value.rewards.length - 1
    setupRewardWatch(index)
}

const deleteReward = (index) => {
    form.value.rewards.splice(index, 1)
    selectedBrandReward.value.splice(index, 1)
    selectedGroupReward.value.splice(index, 1)
    selectedFlavourReward.value.splice(index, 1)
    selectedSizeReward.value.splice(index, 1)
    selectedUnitReward.value.splice(index, 1)
    brandReward.value.splice(index, 1)
    groupReward.value.splice(index, 1)
    flavourReward.value.splice(index, 1)
    sizeReward.value.splice(index, 1)
    unitReward.value.splice(index, 1)
}

function setupRewardWatch(index) {
    // WATCH Brand เปลี่ยน
    watch(
        () => selectedBrandReward.value[index],
        async (newVal) => {
            await optionStore.getGroupFilter(form.value.rewards[index].productSize, newVal.brandName, form.value.rewards[index].productFlavour, form.value.rewards[index].productUnit)
            await optionStore.getFlavourFilter(form.value.rewards[index].productSize, newVal.brandName, form.value.rewards[index].productGroup, form.value.rewards[index].productUnit)
            await optionStore.getSizeFilter(form.value.rewards[index].productGroup, newVal.brandName, form.value.rewards[index].productFlavour, form.value.rewards[index].productUnit)
            await optionStore.getUnitFilter(form.value.rewards[index].productGroup, newVal.brandName, form.value.rewards[index].productFlavour, form.value.rewards[index].productSize)

            groupReward.value[index] = []
            flavourReward.value[index] = []
            sizeReward.value[index] = []
            unitReward.value[index] = []

            selectedGroupReward.value[index] = null
            selectedFlavourReward.value[index] = null
            selectedSizeReward.value[index] = null
            selectedUnitReward.value[index] = null

            groupReward.value[index] = optionStore.groupFilter || []
            flavourReward.value[index] = optionStore.flavourFilter || []
            sizeReward.value[index] = optionStore.sizeFilter || []
            unitReward.value[index] = optionStore.unitFilter || []

            // selectedGroupReward.value[index] = null
            // selectedFlavourReward.value[index] = null
            // selectedSizeReward.value[index] = null

            // set productBrand ใน reward

            form.value.rewards[index].productBrand = newVal.brandName
            form.value.rewards[index].productSize = ''
            form.value.rewards[index].productGroup = ''
            form.value.rewards[index].productFlavour = ''
            form.value.rewards[index].productUnit = ''
        },
        { immediate: true }
    )
    // WATCH Group เปลี่ยน
    watch(
        () => selectedGroupReward.value[index],
        async (newVal) => {
            await optionStore.getFlavourFilter(form.value.rewards[index].productSize, form.value.rewards[index].productBrand, newVal.group, form.value.rewards[index].productUnit)
            await optionStore.getSizeFilter(newVal.group, form.value.rewards[index].productBrand, form.value.rewards[index].productFlavour, form.value.rewards[index].productUnit)
            await optionStore.getUnitFilter(newVal.group, form.value.rewards[index].productBrand, form.value.rewards[index].productFlavour, form.value.rewards[index].productSize)


            flavourReward.value[index] = []
            sizeReward.value[index] = []
            unitReward.value[index] = []

            selectedFlavourReward.value[index] = null
            selectedSizeReward.value[index] = null
            selectedUnitReward.value[index] = null

            flavourReward.value[index] = optionStore.flavourFilter || []
            sizeReward.value[index] = optionStore.sizeFilter || []
            unitReward.value[index] = optionStore.unitFilter || []


            form.value.rewards[index].productGroup = newVal.group
            form.value.rewards[index].productSize = ''
            form.value.rewards[index].productFlavour = ''
            form.value.rewards[index].productUnit = ''

        },
        { immediate: true }
    )

    // WATCH Flavour เปลี่ยน
    watch(
        () => selectedFlavourReward.value[index],
        async (newVal) => {
            await optionStore.getSizeFilter(form.value.rewards[index].productGroup, form.value.rewards[index].productBrand, newVal.flavourName, form.value.rewards[index].productUnit)
            await optionStore.getUnitFilter(form.value.rewards[index].productGroup, form.value.rewards[index].productBrand, newVal.flavourName, form.value.rewards[index].productSize)

            sizeReward.value[index] = []
            unitReward.value[index] = []

            sizeReward.value[index] = optionStore.sizeFilter || []
            unitReward.value[index] = optionStore.unitFilter || []

            selectedSizeReward.value[index] = null
            selectedUnitReward.value[index] = null

            form.value.rewards[index].productFlavour = newVal.flavour
            form.value.rewards[index].productSize = ''
            form.value.rewards[index].productUnit = ''
        },
        { immediate: true }
    )



    // WATCH Size เปลี่ยน ถ้าต้องการเพิ่ม logic พิเศษ
    watch(
        () => selectedSizeReward.value[index],
        (newVal) => {

        },
        { immediate: true }
    )
}

const submitForm = async () => {
    // --- เช็ค required fields ก่อน submit ---
    if (!form.value.name) {
        toast('กรุณากรอกชื่อโปรโมทชั่น', {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        return
    }
    if (!selectedBrand.value.length) {
        toast('กรุณาเลือกแบรนด์ในเงื่อนไขสินค้า', {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        return
    }
    if (!form.value.validFrom || !form.value.validTo) {
        toast('กรุณาระบุวันเริ่มต้นและวันสิ้นสุด', {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        return
    }
    // (สามารถเพิ่ม validation field ที่ต้องการได้อีก)

    // --- เตรียมข้อมูลให้พร้อมก่อนส่ง ---
    form.value.conditions[0].productBrand = selectedBrand.value.map(item => item.brandName)
    form.value.conditions[0].productGroup = selectedGroup.value.map(item => item.group)
    form.value.conditions[0].productFlavour = selectedFlavour.value.map(item => item.flavourName)
    form.value.conditions[0].productSize = selectedSize.value.map(item => item.size)
    form.value.conditions[0].productUnit = selectedUnit.value.map(item => item.unit)
    form.value.applicableTo.area = selectedArea.value.map(item => item.area)
    console.log(form.value)

    try {
        // await promotionStore.addPromotion('https://apps.onetwotrading.co.th/api/cash/promotion/add', form.value)
        await promotionStore.addPromotion(form.value)
        if (promotionStore.statusCode == 201) {
            toast('เพิ่มโปรโมทชั่นใหม่สำเร็จ', {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.SUCCESS,
                dangerouslyHTMLString: true
            })
            // --- delay 1.5 วินาที ก่อน push ---
            setTimeout(() => {
                router.push('/admin/promotion')
            }, 1500)
        } else {
            toast(`เพิ่มโปรโมทชั่นใหม่ไม่สำเร็จ (${promotionStore.statusCode})`, {
                theme: toast.THEME.COLORED,
                type: toast.TYPE.ERROR,
                dangerouslyHTMLString: true
            })
        }
    } catch (err) {
        toast(`${err}`, {
            theme: toast.THEME.COLORED,
            type: toast.TYPE.ERROR,
            dangerouslyHTMLString: true
        })
        console.error(err)
    }
}


// const submitForm = async () => {
//     form.value.conditions[0].productBrand = selectedBrand.value.map(item => item.brandName)
//     form.value.conditions[0].productGroup = selectedGroup.value.map(item => item.group)
//     form.value.conditions[0].productFlavour = selectedFlavour.value.map(item => item.flavourName)
//     form.value.conditions[0].productSize = selectedSize.value.map(item => item.size)
//     form.value.applicableTo.area = selectedArea.value.map(item => item.area)
//     console.log(form.value)
//     try {
//         // await promotionStore.addPromotion('https://apps.onetwotrading.co.th/api/cash/promotion/add', form.value)
//         await promotionStore.addPromotion(form.value)
//         // console.log(promotionStore.statusCode)
//         if (promotionStore.statusCode == 201) {
//             toast(`เพิ่มโปรโมทชั่นใหม่สำเร็จ`, {
//                 "theme": toast.THEME.COLORED,
//                 "type": toast.TYPE.SUCCESS,
//                 "dangerouslyHTMLString": true
//             })
//             router.push('/admin/promotion')
//         } else {
//             toast(`เพิ่มโปรโมทชั่นใหม่ไม่สำเร็จ ${promotionStore.statusCode}`, {
//                 "theme": toast.THEME.COLORED,
//                 "type": toast.TYPE.ERROR,
//                 "dangerouslyHTMLString": true
//             })
//         }


//         // 
//     } catch (err) {
//         toast(`${err}`, {
//             "theme": toast.THEME.COLORED,
//             "type": toast.TYPE.ERROR,
//             "dangerouslyHTMLString": true
//         })
//         console.error(err)
//     }
// }

onMounted(async () => {
    await optionStore.getFlavour()
    await optionStore.getArea()
    await optionStore.getBrand()
    await optionStore.getGroup()
    await optionStore.getSize()
    await optionStore.getUnitFilter('', '', '', '')

    flavour.value = optionStore.flavour
    area.value = optionStore.area
    brand.value = optionStore.brand
    group.value = optionStore.group
    size.value = optionStore.size
    unit.value = optionStore.unitFilter

    // สำหรับ reward แรก
    // flavourReward.value[0] = optionStore.flavour
    brandReward.value[0] = optionStore.brand
    // groupReward.value[0] = optionStore.group
    // sizeReward.value[0] = optionStore.size

    setupRewardWatch(0)
})
</script>
