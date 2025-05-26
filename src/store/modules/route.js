import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useRouteStore = defineStore('checkin', {
  state: () => ({
    routes: [],
    checkIn: [],
    visit: '',
    effective: '',
    message: ''
  }),
  actions: {
    async getCheckin (period, area) {
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/route/getRouteEffective`,
          {
            area: area,
            period: period
          }
        )
        console.log('response', response.data)
        this.checkIn = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async getRouteEffective (area, period, route, zone) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRouteEffectiveAll?area=${area}&period=${period}&day=${route}&zone=${zone}`
        )
        console.log('response', response.data)
        this.visit = response.data.visit
        this.effective = response.data.effective
      } catch (error) {
        console.error(error)
      }
    }
  }
})
