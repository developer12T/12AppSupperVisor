import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useCart = defineStore('cartSale', {
  state: () => ({
    detailCart: {},
    cart: [],
    count: 0,
    message: ''
  }),
  actions: {
    async getCartAll (selectZone) {
      try {
        let zone = ''
        let area = ''

        if (selectZone != '') {
          zone = selectZone
        } else {
          zone = localStorage.getItem('zone')
        }

        const response = await api.get(
          `/api/cash/cart/getCountCart?zone=${zone}`
        )
        const result = response.data.data
        this.cart = result
        // this.count = result
        console.log('Cart All', this.cart)
      } catch (error) {
        this.target = []
        console.error(error)
      }
    },
    async getCartDetail (storeId, area) {
      try {
        const response = await api.get(
          `/api/cash/cart/getCartDetail?area=${area}&storeId=${storeId}`
        )
        const result = response.data.data
        this.detailCart = result
        // this.count = result
        console.log('Detail Cart', this.detailCart)
      } catch (error) {
        this.target = []
        console.error(error)
      }
    }
  }
})
