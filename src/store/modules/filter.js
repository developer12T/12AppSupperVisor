import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useFilter = defineStore('filters', {
  state: () => ({
    area: [],
    zone: [],
    team: [],
    message: ''
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
    async getArea (period, zone, team) {
      try {
        const response = await api.get(
          `/api/cash/route/getArea?zone=${zone}&period=${period}&team=${team}`
        )
        const result = response.data.data
        this.area = result
        console.log('Areas', this.area)
      } catch (error) {
        console.error(error)
      }
    },
    async getTeam (zone) {
      try {
        const response = await api.get(`/api/cash/user/getTeam?zone=${zone}`)
        const result = response.data.data
        this.team = result
        console.log('Teams', this.team)
      } catch (error) {
        console.error(error)
      }
    },
    async getRoute () {
      try {
        const response = await api.get(`/api/cash/product/getProductSwitch`)
        const result = response.data
        this.product = result
        console.log('products', this.product)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
