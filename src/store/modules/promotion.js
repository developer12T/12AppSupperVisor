import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'
import PromotionDetails from '../../views/admin/PromotionDetails.vue'

export const usePromotionsStore = defineStore('promotions', {
  state: () => ({
    promotions: [],
    promotionDetail: [],
    message: '',
    statusCode: 0
  }),
  actions: {
    async getPromotionAll (channel) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/promotion/getPromotion`)
        const result = response.data
        this.promotions = result
        this.statusCode = response.status
        console.log('getPromotionAll', this.promotions)
        // console.log('response', response)
      } catch (error) {
        console.error(error)
      }
    },
    async addPromotion (data) {
      try {
        // setChannel(channel)
        const response = await api.post(`/api/cash/promotion/add`, data)
        this.statusCode = response.status
        // console.log('getPromotionAll', this.promotions)
        console.log('addPromotion', response)
      } catch (error) {
        console.error(error)
      }
    },
    async getPromotionDetail (channel, id) {
      try {
        setChannel(channel)
        const response = await api.get(
          `/api/cash/promotion/getPromotionDetail?proId=${id}`
        )
        const result = response.data.data
        this.promotionDetail = result
        console.log('getPromotionDetail', this.promotionDetail)
        // console.log('response', response)
      } catch (error) {
        console.error(error)
      }
    },
    async getRewardProduct (channel,proId) {
      try {
        setChannel(channel)
        const response = await api.post(
          '/api/cash/promotion/getReward',
          { proId }
        )
        const result = response.data.data
        // this.rewardProduct = result
        return result
        // console.log('rewardProduct', this.rewardProduct)
      } catch (error) {
        console.error(error)
      }

    }
  }
})
