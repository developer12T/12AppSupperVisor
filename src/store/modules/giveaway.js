import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useGiveAway = defineStore('giveaway', {
  state: () => ({
    area: [],
    zone: [],
    message: ''
  }),
  actions: {
    async addGiveAway (period) {
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
    }
  }
})
