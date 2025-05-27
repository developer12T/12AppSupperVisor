import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useOrder = defineStore('order', {
  state: () => ({
    order: [],
    orderDetail: {},
    message: ''
  }),
  actions: {
    async fetchOrder () {
      try {
        const response = await api.get('/order')
        this.order = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchOrderDetail (orderId) {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/cash/order/detail/${orderId}`
        )
        console.log('response', response.data)
        this.orderDetail = response.data.data[0]
      } catch (error) {
        console.error(error)
      }
    }
  }
})
