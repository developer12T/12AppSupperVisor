import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useSendmoney = defineStore('sendmoney', {
  state: () => ({
    sendmoney: [],
    monthlyData: [],
    dailyData: [],
    statusCode: 0,
    message: ''
  }),
  actions: {
    async getSendmoney () {
      try {
        const area = localStorage.getItem('area')
        const zone = localStorage.getItem('zone')
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/sendmoney/getAllSendMoney?zone=${zone}&area=${area}`
        )
        console.log('getSendmoney', response.data)
        this.sendmoney = response.data.data
      } catch (error) {
        console.error(error)
      }
    },

    async summaryMonthlyByZone (areas) {
      try {
        // const area = localStorage.getItem('area')
        // const zone = localStorage.getItem('zone')
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/order/summaryMonthlyByZone?areas=${areas}`
        )
        console.log('summaryMonthlyByZone', response.data)
        this.monthlyData = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
    async summaryDaily (area) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/order/summaryDaily?area=${area}`
        )
        console.log('summaryDaily', response.data)
        this.dailyData = response.data.data
      } catch (error) {
        console.error(error)
      }
    },

    async downloadtoExcel (start, end, excel, period, area) {
      try {
        if (period) {
          start = ''
          end = ''
        } else {
          period = ''
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
        }

        // const response = await api.get(
        //   `${
        //     import.meta.env.VITE_API_URL
        //   }/api/cash/sendmoney/sendmoneyToExcel?start=${start}&end=${end}&excel=${excel}`
        // )

        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/sendmoney/sendmoneyToExcel?start=${start}&end=${end}&excel=${excel}&period=${period}&area=${area}`
        )
        this.dailyData = []

        if (excel) {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `SendMoney_${start}_${end}.xlsx`) // ชื่อไฟล์
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } else {
          console.log('summaryDaily', response.data)

          this.dailyData = response.data.data
        }
      } catch (error) {
        this.dailyData = []
        console.error(error)
      }
    }
    
  }
})
