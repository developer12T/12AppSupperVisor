import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useReport = defineStore('reports', {
  state: () => ({
    summaryProduct: [],
    summary18SKU: [],
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

    async getSummary18SKU (selectZone, selectArea, team) {
      try {
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
          `/api/cash/order/getSummary18SKU?zone=${zone}&team=${team}&area=${area}`
        )
        const result = response.data.data
        this.summary18SKU = result
        this.statusCode = response.status
        console.log('getSummary18SKU', this.summary18SKU)
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
    async getChecklist (startDate, endDate, zone, team, area) {
      try {
        // setChannel()
        const response = await api.get(
          `/api/cash/admin/reportCheck?start=${startDate}&end=${endDate}&zone=${zone}&team=${team}&area=${area}`
        )
        console.log(
          `/api/cash/admin/reportCheck?start=${startDate}&end=${endDate}&zone=${zone}&team=${team}&area=${area}`
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
