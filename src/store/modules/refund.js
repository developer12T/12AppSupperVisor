import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useRefundStock = defineStore('refund', {
  state: () => ({
    refund: [],
    refundDetail: {},
    message: '',
    statusCode: 0
  }),
  actions: {
    async getRefundAll (channel, area, period) {
      try {
        setChannel(channel)
        const response = await api.get(
          `/api/cash/refund/all?type=refund&area=${area}&period=${period}`
        )
        this.refund = response.data.data
        this.message = response.data.message
        console.log('refund', this.refund)
      } catch (error) {
        console.log(error)
      }
    },

    async approveRefund (channel, orderId, status) {
      try {
        setChannel(channel)
        const response = await api.post(`/api/cash/refund/updateStatus`, {
          orderId: orderId,
          status: status
        })
        // this.adjuststock = response.data.data
        this.message = response.data.message
        console.log('updateStatus', this.message)
      } catch (error) {
        console.log(error)
      }
    },

    async getRefundDetail (channel, orderId) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/refund/detail/${orderId}`)
        this.refundDetail = response.data
        this.message = response.data.message
        console.log('refundDetail', this.refundDetail)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
