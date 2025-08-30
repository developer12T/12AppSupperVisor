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
    },
    async downloadExcel (start, end) {
      try {
        // ถ้าไม่ได้ส่งมา หรือฟอร์แมตไม่ใช่ YYYYMMDD ให้ใช้ "วันนี้" ตามเวลาไทย
        if (!/^\d{8}$/.test(start)) {
          const nowTH = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
          )
          const y = nowTH.getFullYear()
          const m = String(nowTH.getMonth() + 1).padStart(2, '0')
          const d = String(nowTH.getDate()).padStart(2, '0') // ← ใช้ getDate() ไม่ใช่ getDay()
          start = `${y}${m}${d}` // YYYYMMDD
          end = `${y}${m}${d}` // YYYYMMDD
        }

        const response = await api.get(
          `/api/cash/refund/refundExcel?channel=cash&startDate=${start}&endDate=${end}`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `REFUND_${start}_${end}.xlsx`) // ชื่อไฟล์
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
