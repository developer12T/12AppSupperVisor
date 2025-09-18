import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useOrder = defineStore('order', {
  state: () => ({
    order: [],
    orderDetail: {},
    message: ''
  }),
  actions: {
    async fetchOrder (period, start, end) {
      try {
        let area = localStorage.getItem('area')
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
          `api/cash/order/all?type=sale&period=${period}&start=${start}&end=${end}&area=${area}`
        )
        this.order = response.data
        console.log('response', this.order)
      } catch (error) {
        console.error(error)
      }
    },

    async fetchOrderDetail (orderId) {
      try {
        const response = await api.get(`/api/cash/order/detail/${orderId}`)
        console.log('response', response.data)
        this.orderDetail = response.data.data[0]
      } catch (error) {
        console.error(error)
      }
    },
    async downloadExcel (start, end, area, team, zone) {
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
          `/api/cash/order/ordertoexcel?channel=cash&startDate=${start}&endDate=${end}&status=pending,approved,completed&area=${area}&team=${team}&zone=${zone}`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `ORDER_${start}_${end}.xlsx`) // ชื่อไฟล์
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
      }
    },

    async downloadExcelProduct (period, start, end, area, team, zone) {
      try {
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
          `/api/cash/order/getOrderExcelNew?period=${period}&area=${area}&excel=true`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Item_${start}_${end}.xlsx`) // ชื่อไฟล์
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
