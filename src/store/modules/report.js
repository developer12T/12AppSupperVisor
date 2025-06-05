import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useReport = defineStore('reports', {
  state: () => ({
    summaryProduct: [],
    zone: [],
    message: '',
    statusCode: 0
  }),
  actions: {
    async getSummaryProduct (area) {
      try {
        const response = await api.get(
          `/api/cash/order/getSummaryProduct?zone=${area}`
        )
        const result = response.data.data
        this.summaryProduct = result
        this.statusCode = response.status
        console.log('summaryProduct', this.summaryProduct)
      } catch (error) {
        console.error(error)
      }
    },
    async getProductionAll (channel) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/product/getProductSwitch`)
        const result = response.data
        this.product = result
        this.statusCode = response.status
        console.log('products', this.product)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
