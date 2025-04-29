import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    product: [],
    storeNew: [],
    message: ''
  }),
  actions: {
    async getProductionAll () {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cash/product/get`,
          {
            type: 'sale',
            group: [],
            brand: [],
            size: [],
            flavour: []
          }
        )
        const result = response.data
        this.product = result
        console.log('products', this.product)
      } catch (error) {
        console.error(error)
      }
    },
    async onOff (id, type, status) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cash/product/onOff`,
          {
            id: `${id}`,
            type: `${type}`,
            status: `${status}`
          }
        )
        this.message = response.data.message
        console.log('message',response.data.message)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
