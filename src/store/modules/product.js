import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    product: [],
    storeNew: [],
    message: '',
    statusCode: 0
  }),
  actions: {
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
    },
    async onOff (id, type, status, channel) {
      try {
        setChannel(channel)
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/product/onOff`,
          {
            id: `${id}`,
            type: `${type}`,
            status: `${status}`
          }
        )
        this.message = response.data.message
        this.statusCode = response.status
        // console.log('response', response.status)
      } catch (error) {
        console.error(error)
      }
    },
    async addNewProduct (channel,data) {
      try {
        setChannel(channel)
        const response = await api.post(`/api/cash/product/add`,data)
        // const result = response.data
        // this.product = result
        this.statusCode = response.status
        console.log('statusCode', this.statusCode)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
