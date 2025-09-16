import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useSale = defineStore('targetSale', {
  state: () => ({
    target: {},
    targetProduct: [],
    message: ''
  }),
  actions: {
    async getTarget (startDate, endDate, area) {
      try {
        const response = await api.get(
          `/api/cash/order/getTarget?area=${area}&startDate=${startDate}&endDate=${endDate}`
        )
        const result = response.data
        this.target = result
        console.log('target', this.target)
      } catch (error) {
        this.target = []
        console.error(error)
      }
    },

    async getTargetProduct (period, area, team, zone) {
      try {
        const response = await api.get(
          `/api/cash/order/getTargetProduct?period=${period}&area=${area}&team=${team}&zone=${zone}`
        )
        const result = response.data.data
        this.targetProduct = result
        console.log('targetProduct', this.targetProduct)
      } catch (error) {
        this.targetProduct = []
        console.error(error)
      }
    }
  }
})
