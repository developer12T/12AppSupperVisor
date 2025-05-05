import { defineStore } from 'pinia'
import axios from 'axios'

export const useRouteStore = defineStore('checkin', {
  state: () => ({
    routes: [],
    checkIn: [],
    message: ''
  }),
  actions: {
    async getCheckin (period) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/geTimelineCheckin?area=BE&period=202504`
        )
        this.checkIn = response.data.message
      } catch (error) {
        console.error(error)
      }
    }
  }
})
