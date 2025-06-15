import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const usePromotionsStore = defineStore('promotions', {
  state: () => ({
    promotions: [],
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
        console.log('response', response)
      } catch (error) {
        console.error(error)
      }
    },
    async addPromotion (channel, data) {
      try {
        setChannel(channel)
        const response = await api.post(`/api/cash/promotion/add`, data)
        this.statusCode = response.status
        // console.log('getPromotionAll', this.promotions)
        console.log('response', response)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
