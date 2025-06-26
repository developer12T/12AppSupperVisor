import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useStockStore = defineStore('stock', {
  state: () => ({
    stock: {},
    stockDetail: {},
    message: ''
  }),
  actions: {
    async getStock (period) {
      try {
        const response = await api.post(`/api/cash/stock/getStockQty`, {
          area: 'SH223',
          period: '202506'
        })
        const result = response.data
        this.stock = result
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
    async getStockDetail () {
      try {
        const response = await api.get(`/api/cash/promotion/getPromotion`)
        const result = response.data
        this.stock = result
      } catch (error) {
        console.log(error)
      }
    }
  }
})
