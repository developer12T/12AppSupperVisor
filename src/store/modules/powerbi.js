import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'


export const usePowerBi = defineStore('powerBiUpdate', {
  state: () => ({
    message: '',
    statusCode: 0
  }),
  actions: {
    async updateRouteToM3DBPRD_BK (period) {
      try {
        const response = await api.post(
          `/api/cash/route/updateRouteToM3DBPRD_BK`,
          {
            period: period
          }
        )
        // const result = response.data
        this.statusCode = response.data.status
        this.message = response.data.message
        // console.log('target', this.target)
      } catch (error) {
        this.statusCode = 500
        this.message = 'Error updating route to M3 DB PRD BK'

        console.error(error)
      }
    },

    async updateOrderDistribution (period) {
      try {
        const response = await api.post(
          `/api/cash/order/updateOrderDistribution`,
          {
            period: period
          }
        )
        this.statusCode = response.data.status
        this.message = response.data.message
        // console.log('targetProduct', this.targetProduct)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
