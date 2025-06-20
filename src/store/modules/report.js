import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useReport = defineStore('reports', {
  state: () => ({
    summaryProduct: [],
    zone: [],
    checklist: [],
    message: '',
    statusCode: 0
  }),
  actions: {
    async getSummaryProduct (area) {
      try {
        const response = await api.get(
          `/api/cash/order/getSummaryProduct?zone=${area}`
        )
        const result = response.data.data
        this.summaryProduct = result
        this.statusCode = response.status
        console.log('summaryProduct', this.summaryProduct)
      } catch (error) {
        console.error(error)
      }
    },
    async getProductionAll (channel) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/product/getProductSwitch`)
        const result = response.data
        this.product = result
        this.statusCode = response.status
        console.log('products', this.product)
      } catch (error) {
        console.error(error)
      }
    },
    async getChecklist (startDate, endDate) {
      try {
        // setChannel()
        const response = await api.get(
          `/api/cash/admin/reportCheck?start=${startDate}&end=${endDate}`
        )
        const result = response.data.data
        this.checklist = result
        this.statusCode = response.status
        console.log('getChecklist', this.checklist)
      } catch (error) {
        console.error(error)
      }
    },
    async downloadExcel (startDate, endDate) {
      try {
        const response = await api.get(
          `/api/cash/admin/reportCheckExcel?start=${startDate}&end=${endDate}&channel=cash`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `report_${startDate}_${endDate}.xlsx`) // ชื่อไฟล์
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
