import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useOption = defineStore('options', {
  state: () => ({
    area: [],
    zone: [],
    brand: [],
    flavour: [],
    size: [],
    group: [],
    message: '',
    statusCode: null
  }),
  actions: {
    async getZone (period) {
      try {
        const response = await api.get(
          `/api/cash/route/getZone?period=${period}`
        )
        const result = response.data.data
        this.zone = result
        console.log('Zones', this.zone)
      } catch (error) {
        console.error(error)
      }
    },
    async getGroup () {
      try {
        const response = await api.get(
          `/api/cash/order/getGroup`
        )
        const result = response.data.data
        this.group = result
        console.log('getGroup', this.group)
      } catch (error) {
        console.error(error)
      }
    },
    async getBrand () {
      try {
        const response = await api.get(
          `/api/cash/product/groupBrandId`
        )
        const result = response.data.data
        this.brand = result
        console.log('getBrand', this.brand)
      } catch (error) {
        console.error(error)
      }
    },
    async getFlavour () {
      try {
        const response = await api.get(`/api/cash/product/groupFlavourId`)
        const result = response.data.data
        this.flavour = result
        console.log('getFlavour', this.flavour)
      } catch (error) {
        console.error(error)
      }
    },
    async getSize () {
      try {
        const response = await api.get(`/api/cash/product/groupSize`)
        const result = response.data.data
        this.size = result
        console.log('getSize', this.size)
      } catch (error) {
        console.error(error)
      }
    },
    async getArea () {
      try {
        const response = await api.get(
          `/api/cash/user/getAreaAll`
        )
        const result = response.data.data
        this.area = result
        console.log('getArea', this.area)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
