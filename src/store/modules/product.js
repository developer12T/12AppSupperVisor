import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    productSKU: [],
    product: [],
    storeNew: [],
    message: '',
    statusCode: 0
  }),
  actions: {
    async deleteSKUProduct (channel, productId) {
      try {
        setChannel(channel)
        const response = await api.patch(`/api/cash/product/deleteSKUProduct`, {
          productId: productId
        })
        this.message = response.data.message
        this.statusCode = response.status
        console.log('response', response.status)
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
    },

    async addSKUFocus (channel, productList, target, period, zone, area) {
      try {
        setChannel(channel)
        const response = await api.post(`/api/cash/product/addskufocus`, {
          zone: zone,
          area: area,
          listProduct: productList,
          target: target,
          period: period
        })
        this.message = response.data.message
        this.statusCode = response.status
        console.log('response', response.status)
      } catch (error) {
        console.error(error)
      }
    },

    async getSkuProduct (period, channel) {
      try {
        setChannel(channel)
        const response = await api.get(
          `/api/cash/product/getSkuProduct?period=${period}`
        )
        const result = response.data.listProduct
        this.productSKU = result
        this.statusCode = response.status
        console.log('productSKU', this.productSKU)
      } catch (error) {
        console.error(error)
      }
    },

    async onOff (id, type, status, channel) {
      try {
        const user = localStorage.getItem('fullName')
        setChannel(channel)
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/product/onOff`,
          {
            id: `${id}`,
            type: `${type}`,
            status: `${status}`,
            user: user
          }
        )
        this.message = response.data.message
        this.statusCode = response.status
        // console.log('response', response.status)
      } catch (error) {
        console.error(error)
      }
    },
    async addNewProduct (channel, data) {
      try {
        setChannel(channel)
        const response = await api.post(`/api/cash/product/add`, data)
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
