import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useOrder = defineStore('order', {
  state: () => ({
    order: [],
    orderDetail: {},
    message: '',
    statusCode: 0
  }),
  actions: {
    async editStoreOrder (channel, id, data) {
      try {
        const user = localStorage.getItem('fullName')

        const response = await api.patch(
          `/api/cash/order/editOrderSale/${id}`,
          {
            name: data.name,
            address: data.address,
            taxId: data.taxId,
            tel: data.tel,
            user: user
          }
        )

        this.message = response.data.message
        this.statusCode = response.data.status
        console.log('statusCode', this.statusCode)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchOrder (channel, period, start, end, selectArea, selectZone) {
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

        // let area = localStorage.getItem('area')
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
          `api/cash/order/all?type=sale&period=${period}&start=${start}&end=${end}&area=${area}&zone=${zone}`
        )
        this.order = response.data
        console.log('response', this.order)
      } catch (error) {
        this.order = []
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
    async downloadExcel (channel, start, end, area, team, zone) {
      try {
        // const platformType = localStorage.getItem('platformType')
        // let channel = ''
        // switch (platformType) {
        //   case 'CASH':
        //     channel = 'cash'
        //     break
        //   case 'PC':
        //     channel = 'pc'
        //     break
        //   default:
        //     channel = 'cash'
        //     break
        // }
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
          `/api/cash/order/ordertoexcel?channel=${channel}&startDate=${start}&endDate=${end}&status=pending,approved,completed&area=${area}&team=${team}&zone=${zone}`,
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
