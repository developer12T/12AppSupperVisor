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
    async getRefundAll (channel, period, selectZone, team, selectArea) {
      try {
        setChannel(channel)
        let zone = ''
        let area = ''
        if (selectZone != '') {
          zone = selectZone
        } else {
          zone = localStorage.getItem('zone')
        }

        if (selectArea != '') {
          area = selectArea
        } else {
          area = localStorage.getItem('area')
        }
        const response = await api.get(
          `/api/cash/refund/all?type=refund&zone=${zone}&team=${team}&area=${area}&period=${period}`
        )
        this.refund = response.data.data
        this.message = response.data.message
        console.log('refund', this.refund)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // กรณี 404 - ไม่พบข้อมูล
          this.refund = []
          this.message = 'ไม่พบข้อมูลการคืนเงิน'
        } else {
          // กรณี error อื่นๆ
          this.refund = []
          this.message = 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        }
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
