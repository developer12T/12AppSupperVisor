<template>
  <div v-if="data" class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
    <template v-if="isLoading">
      <div class="text-center text-gray-500 py-16">Loading...</div>
    </template>
    <template v-else>
      <h2 class="text-2xl font-bold mb-2">{{ data.name || '-' }}</h2>
      <p class="mb-2 text-gray-600">{{ data.description || '-' }}</p>

      <div class="mb-3">
        <span class="font-semibold">Promotion Code: </span>
        <span class="ml-2">{{ data.proCode || '-' }}</span>
      </div>
      <div class="mb-3">
        <span class="font-semibold">Promotion Type: </span>
        <span class="ml-2">{{ data.proType || '-' }}</span>
      </div>
      <div class="mb-3 flex flex-wrap gap-6">
        <div>
          <span class="font-semibold">Status: </span>
          <span :class="data.status === 'active' ? 'text-green-600' : 'text-red-500'">
            {{ data.status || '-' }}
          </span>
        </div>
        <div>
          <span class="font-semibold">เริ่มวันที่: </span>
          <span>{{ formatDate(data.validFrom) }}</span>
        </div>
        <div>
          <span class="font-semibold">จนถึงวันที่: </span>
          <span>{{ formatDate(data.validTo) }}</span>
        </div>
      </div>

      <div class="mb-4" v-if="data.applicableTo">
        <h3 class="font-bold mb-1">Applicable To</h3>
        <ul class="list-disc ml-6">
          <li>
            เป็นโปรโมชั่นร้านค้าใหม่:
            <span :class="data.applicableTo.isNewStore ? 'text-green-600' : 'text-gray-500'">
              {{ data.applicableTo.isNewStore ? 'ใช่' : 'ไม่' }}
            </span>
          </li>
          <li>
            เป็นโปรโมชั่นร้านค้าสวยงาม:
            <span :class="data.applicableTo.isbeauty ? 'text-green-600' : 'text-gray-500'">
              {{ data.applicableTo.isbeauty ? 'ใช่' : 'ไม่' }}
            </span>
          </li>
          <li>
            ร้านค้าใหม่ที่ใช้ในโปรโมชั่น:
            <template
              v-if="Array.isArray(data.applicableTo.completeStoreNew) && data.applicableTo.completeStoreNew.length">
              <ul class="list-decimal ml-6">
                <li v-for="store in data.applicableTo.completeStoreNew" :key="store">{{ store }}</li>
              </ul>
            </template>
            <template v-else>
              <span class="text-gray-400">-</span>
            </template>
          </li>
        </ul>
      </div>

      <div class="mb-4">
        <h3 class="font-bold mb-1">เงื่อนไขสินค้า</h3>
        <div v-for="(cond, idx) in data.conditions || []" :key="cond._id || idx"
          class="mb-2 pl-3 border-l-4 border-blue-300">
          <p>Product ID: <span class="">{{ cond.productId ?? '-' }}</span></p>
          <p>Product Group: <span>{{ cond.productGroup ?? '-' }}</span></p>
          <p>Product Flavour: <span>{{ cond.productFlavour ?? '-' }}</span></p>
          <p>Product Brand: <span>{{ cond.productBrand ?? '-' }}</span></p>
          <p>Product Size: <span>{{ cond.productSize ?? '-' }}</span></p>
          <p>Unit: <span>{{ cond.productUnit ?? '-' }}</span></p>
          <p>Product Qty: <span class="font-semibold">{{ cond.productQty ?? '-' }}</span></p>
          <p>Product Amount: <span class="font-semibold">{{ cond.productAmount ?? '-' }}</span> บาท</p>
        </div>
        <div v-if="!data.conditions?.length" class="text-gray-400 pl-3">-</div>
      </div>

      <div class="mb-4">
        <h3 class="font-bold mb-1">ของรางวัล</h3>
        <div v-for="(reward, idx) in data.rewards || []" :key="reward._id || idx"
          class="mb-5 pl-3 border-l-4 border-green-300">
          <p>No: <span class="">{{ idx + 1 ?? '-' }}</span></p>
          <p>Product ID: <span class="font-semibold">{{ reward.productId ?? '-' }}</span></p>
          <p>Product Group: <span>{{ reward.productGroup ?? '-' }}</span></p>
          <p>Product Flavour: <span>{{ reward.productFlavour ?? '-' }}</span></p>
          <p>Product Brand: <span>{{ reward.productBrand ?? '-' }}</span></p>
          <p>Product Size: <span>{{ reward.productSize ?? '-' }}</span></p>
          <p>Unit: <span>{{ reward.productUnit ?? '-' }}</span></p>
          <p>Qty: <span>{{ reward.productQty ?? '-' }}</span></p>
          <p>Limit Type: <span>{{ reward.limitType ?? '-' }}</span></p>
        </div>
        <div v-if="!data.rewards?.length" class="text-gray-400 pl-3">-</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { usePromotionsStore } from '../../store/modules/promotion'

const route = useRoute()
const promotionStore = usePromotionsStore()

const data = ref(null)
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  // defaultData structure for fallback/merge
  const defaultData = {
    applicableTo: {
      store: [],
      typeStore: [],
      zone: [],
      area: [],
      isNewStore: false,
      isbeauty: false,
      completeStoreBeauty: [],
      completeStoreNew: [],
    },
    conditions: [],
    rewards: [],
    name: '',
    description: '',
    proCode: '',
    proType: '',
    status: '',
    validFrom: '',
    validTo: '',
  }
  try {
    await promotionStore.getPromotionDetail('cash', route.params.proId)
    const detail = promotionStore.promotionDetail
    console.log('detail', detail)
    if (detail) {
      data.value = {
        ...defaultData,
        ...detail,
        applicableTo: {
          ...defaultData.applicableTo,
          ...(detail.applicableTo || {}),
        },
        conditions: detail.conditions ?? [],
        rewards: detail.rewards ?? [],
      }
    } else {
      data.value = defaultData
    }
  } catch (e) {
    data.value = defaultData
  } finally {
    isLoading.value = false
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

</script>
