import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useWithdrawStore = defineStore('withdraws', {
  state: () => ({
    withdraw: [],
    withdrawDetail: {},
    status: 0
  }),
  actions: {
    async approve (channel, id, status) {
      try {
        setChannel(channel)
        const response = await api.post(
          `/api/cash/distribution/approveWithdraw`,
          {
            orderId: id,
            status: status
          }
        )
        this.status = response.data.status
      } catch (error) {
        console.log(error)
      }
    },
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
          `/api/cash/distribution/get?type=pending&area=${filters}&period=${period}`
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
