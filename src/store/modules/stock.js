import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useStockStore = defineStore('stock', {
  state: () => ({
    stock: {},
    stockSummary: {},
    stockDetail: {},
    stockIn: {},
    stockOut: {},
    balance: {},
    sumStockIn: 0,
    sumStockOut: 0,
    sumBalance: 0,
    adjuststock: [],
    message: ''
  }),
  actions: {
    async getAdjustStock (channel, zone, teamm, area, period) {
      try {
        setChannel(channel)
        const response = await api.get(
          `/api/cash/stock/getAdjustStock?type=adjuststock&period=${period}&zone=${zone}&team=${teamm}&area=${area}`
        )
        this.adjuststock = response.data.data
        this.message = response.data.message
        console.log('adjuststock', this.adjuststock)
      } catch (error) {
        console.log(error)
      }
    },
    async getStock (area, period) {
      try {
        const response = await api.post(`/api/cash/stock/getStockQty`, {
          area: area,
          period: period
        })
        const result = response.data
        this.stock = result
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
    async getStockDetail () {
      try {
        const response = await api.get(`/api/cash/promotion/getPromotion`)
        const result = response.data
        this.stock = result
      } catch (error) {
        console.log(error)
      }
    },
    async stockToExcel (area, period) {
      try {
        const response = await api.post(`/api/cash/stock/stockToExcel`, {
          area: area,
          period: period
        })
        // const result = response.data
        console.log('stockToExcel', response.data)
        this.stockSummary = response.data.data
        this.stockIn = response.data.data.stockIn
        this.stockOut = response.data.data.stockOut
        this.balance = response.data.data.balance
        this.sumStockIn = response.data.data.sumStockIn
        this.sumStockOut = response.data.data.sumStockOut
        this.sumBalance = response.data.data.sumBalance

        console.log('stockOut', this.stockOut)
      } catch (error) {
        console.log(error)
      }
    },
    async downloadExcel (area, period) {
      try {
        const response = await api.post(
          `/api/cash/stock/stockToExcel`,
          {
            area: area,
            period: period,
            excel: true
          },
          { responseType: 'blob' }
        )

        // ดึงชื่อไฟล์จาก header ถ้ามี
        let fileName = `stock_${area}_${period}.xlsx`
        const disposition = response.headers['content-disposition']
        if (disposition) {
          const match = disposition.match(/filename="?([^"]+)"?/)
          if (match && match[1]) fileName = decodeURIComponent(match[1])
        }

        // กำหนด mime type เป็น excel
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName) // ชื่อไฟล์
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // ให้ browser ได้เริ่มดาวน์โหลดก่อน แล้วค่อย revoke (ป้องกัน bug บางตัว)
        setTimeout(() => window.URL.revokeObjectURL(url), 200)
      } catch (error) {
        console.error(error)
        alert('Download failed!')
      }
    }
  }
})
