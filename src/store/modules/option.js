import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useOption = defineStore('options', {
  state: () => ({
    area: [],
    typeStore: [],
    zone: [],
    brandFilter: [],
    brand: [],
    flavourFilter: [],
    flavour: [],
    sizeFilter: [],
    size: [],
    groupFilter: [],
    group: [],
    unitFilter: [],
    message: '',
    statusCode: null
  }),
  actions: {
    async getTypeStore (period) {
      try {
        const response = await api.get(
          `/api/cash/store/getTypeStore`
        )
        const result = response.data.deletedStore
        this.typeStore = result
        console.log('typeStore', this.typeStore)
      } catch (error) {
        console.error(error)
      }
    },
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
        const response = await api.get(`/api/cash/order/getGroup`)
        const result = response.data.data
        this.group = result
        console.log('getGroup', this.group)
      } catch (error) {
        console.error(error)
      }
    },
    async getBrand () {
      try {
        const response = await api.get(`/api/cash/product/groupBrandId`)
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
        const response = await api.get(`/api/cash/user/getAreaAll`)
        const result = response.data.data
        this.area = result
        console.log('getArea', this.area)
      } catch (error) {
        console.error(error)
      }
    },
    async getGroupFilter (size, brand, flavour, unit) {
      try {
        const response = await api.post(`/api/cash/product/groupByFilter`, {
          size: size,
          brand: brand,
          flavour: flavour,
          unit: unit
        })

        const result = response.data.data
        this.groupFilter = result
        console.log('c', this.groupFilter)
      } catch (error) {
        console.error(error)
      }
    },
    async getFlavourFilter (size, brand, group, unit) {
      try {
        const response = await api.post(`/api/cash/product/flavourByFilter`, {
          size: size,
          brand: brand,
          group: group,
          unit: unit
        })

        const result = response.data.data
        this.flavourFilter = result
        console.log('getFlavourFilter', this.flavourFilter)
      } catch (error) {
        console.error(error)
      }
    },
    async getBrandFilter (size, group, flavour, unit) {
      try {
        const response = await api.post(`/api/cash/product/brandByFilter`, {
          size: size,
          group: group,
          flavour: flavour,
          unit: unit
        })

        const result = response.data.data
        this.brandFilter = result
        console.log('getBrandFilter', this.brandFilter)
      } catch (error) {
        console.error(error)
      }
    },
    async getSizeFilter (group, brand, flavour, unit) {
      try {
        const response = await api.post(`/api/cash/product/sizeByFilter`, {
          group: group,
          brand: brand,
          flavour: flavour,
          unit: unit
        })

        const result = response.data.data
        this.sizeFilter = result
        console.log('getSizeFilter', this.sizeFilter)
      } catch (error) {
        console.error(error)
      }
    },
    async getUnitFilter (group, brand, flavour, size) {
      try {
        const response = await api.post(`/api/cash/product/unitByFilter`, {
          group: group,
          brand: brand,
          flavour: flavour,
          size: size
        })

        const result = response.data.data
        this.unitFilter = result
        console.log('getSizeFilter', this.sizeFilter)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
