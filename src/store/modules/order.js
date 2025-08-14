import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useOrder = defineStore('order', {
  state: () => ({
    order: [],
    orderDetail: {},
    message: ''
  }),
  actions: {
    async fetchOrder (period, start, end) {
      try {
        const response = await api.get(
          `api/cash/order/all?type=sale&period=${period}&start=${start}&end=${end}`
        )
        this.order = response.data
        console.log('response', this.order)
      } catch (error) {
        console.error(error)
      }
    },

    async fetchOrderDetail (orderId) {
      try {
        const response = await api.get(`/api/cash/order/detail/${orderId}`)
        console.log('response', response.data)
        this.orderDetail = response.data.data[0]
      } catch (error) {
        console.error(error)
      }
    }
  }
})
