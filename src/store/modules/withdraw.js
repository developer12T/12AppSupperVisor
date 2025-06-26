import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useWithdrawStore = defineStore('withdraws', {
  state: () => ({
    withdraw: [],
    withdrawDetail: {}
  }),
  actions: {
    async getWithdraw (channel, period) {
      try {
        // setChannel(channel)

        const area = localStorage.getItem('area')
        const zone = localStorage.getItem('zone')
        let filters
        if (area) {
          filters = area
        } else {
          filters = zone
        }

        const response = await api.get(
          `/api/cash/distribution/get?type=history&area=${filters}&period=${period}`
        )
        this.withdraw = response.data.data
        console.log('withdraw', withdraw)
      } catch (error) {
        console.log(error)
      }
    },
    async getWithdrawDetail (channel, id) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/distribution/detail/${id}`)
        this.withdrawDetail = response.data.data[0]
        console.log('withdrawDetail', response.data.data[0])
      } catch (error) {
        console.log(error)
      }
    }
  }
})
