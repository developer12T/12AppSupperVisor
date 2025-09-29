import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useGiveAway = defineStore('giveaway', {
  state: () => ({
    giveaways: [],
    giveType: [],
    give: [],
    giveDetail: {},
    giveawaysDetail: {},
    message: '',
    status: 0
  }),
  actions: {
    async addGiveAway (data) {
      try {
        const response = await api.post(`/api/cash/give/addGiveType`, data)
        this.statusCode = response.status

        console.log('statusCode', this.status)
      } catch (error) {
        console.error(error)
      }
    },

    async giveOrder (period, start, end, selectArea, selectZone) {
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
        // const area = localStorage.getItem('area')
        // if (!/^\d{8}$/.test(start)) {
        //   const nowTH = new Date(
        //     new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
        //   )
        //   const y = nowTH.getFullYear()
        //   const m = String(nowTH.getMonth() + 1).padStart(2, '0')
        //   const d = String(nowTH.getDate()).padStart(2, '0') // ← ใช้ getDate() ไม่ใช่ getDay()
        //   start = `${y}${m}${d}` // YYYYMMDD
        //   end = `${y}${m}${d}` // YYYYMMDD
        // }
        const response = await api.get(
          `/api/cash/give/all?type=give&period=${period}&area=${area}&start=${start}&end=${end}&zone=${zone}`
        )

        this.give = response.data
        console.log('response', this.give)
      } catch (error) {
        console.error(error)
      }
    },

    async giveOrderDetail (orderId) {
      try {
        const response = await api.get(`/api/cash/give/detail/${orderId}`)

        console.log('response', response.data)
        this.giveDetail = response.data.data[0]
      } catch (error) {
        console.error(error)
      }
    },

    async getGiveType () {
      try {
        const response = await api.get(`/api/cash/give/getGiveType`)
        this.giveType = response.data.data
        console.log('giveType', this.giveType)
      } catch (error) {
        console.error(error)
      }
    },

    async getGiveAwayDetail (giveId) {
      try {
        const response = await api.get(`/api/cash/give/getGiveaways/${giveId}`)
        this.statusCode = response.status
        this.giveawaysDetail = response.data.data
        console.log('giveawaysDetail', this.giveawaysDetail)
      } catch (error) {
        console.error(error)
      }
    },
    async getGiveAwayPromotion () {
      try {
        const response = await api.get(`/api/cash/give/getGiveaways`)
        this.giveaways = response.data.data

        console.log('giveaways', this.giveaways)
      } catch (error) {
        console.error(error)
      }
    },
    async downloadExcel (start, end, giveName, area, team, zone) {
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
          `/api/cash/give/giveToExcel?channel=cash&startDate=${start}&endDate=${end}&giveName=${giveName}&area=${area}&team=${team}&zone=${zone}`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `GIVE_${start}_${end}.xlsx`) // ชื่อไฟล์
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
