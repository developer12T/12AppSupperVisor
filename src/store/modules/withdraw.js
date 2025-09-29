import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'
import socket, { setSocketChannel } from '../../utils/socket'

export const useWithdrawStore = defineStore('withdraws', {
  state: () => ({
    withdraw: [],
    withdrawDetail: {},
    count: 0,
    status: 0
  }),
  actions: {
    async approve (channel, id, status) {
      try {
        setChannel(channel)
        const user = localStorage.getItem('fullName')
        const response = await api.post(
          `/api/cash/distribution/approveWithdraw`,
          {
            orderId: id,
            status: status,
            user: user
          }
        )
        this.status = response.data.status
      } catch (error) {
        console.log(error)
      }
    },
    async cancelWithdraw (channel, id) {
      try {
        setChannel(channel)
        const user = localStorage.getItem('fullName')
        const response = await api.post(
          `/api/cash/distribution/cancelWithdraw`,
          {
            orderId: id,
            user: user
          }
        )
        this.status = response.data.status
      } catch (error) {
        console.log(error)
      }
    },
    async getWithdrawCreditTable (
      channel,
      period,
      selectZone,
      selectArea,
      team,
      start,
      end
    ) {
      try {
        // setChannel(channel)

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
          `/api/cash/distribution/getCredit?period=${period}&zone=${zone}&team=${team}&area=${area}&start=${start}1&end=${end}`
        )

        socket.on('store-updated', data => {
          console.log('store updated', data)
        })

        this.withdraw = response.data.data
        console.log('withdraw', this.withdraw)
      } catch (error) {
        this.withdraw = []
        console.log(error)
      }
    },

    async getWithdrawTable (
      channel,
      period,
      selectZone,
      selectArea,
      team,
      start,
      end
    ) {
      try {
        // setChannel(channel)

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
          `/api/cash/distribution/get?period=${period}&zone=${zone}&team=${team}&area=${area}&start=${start}1&end=${end}`
        )

        socket.on('store-updated', data => {
          console.log('store updated', data)
        })

        this.withdraw = response.data.data
        console.log('withdraw', this.withdraw)
      } catch (error) {
        this.withdraw = []
        console.log(error)
      }
    },
    async getWithdraw (
      channel,
      period,
      selectZone,
      selectArea,
      team,
      year,
      month,
      start,
      end
    ) {
      try {
        // setChannel(channel)

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
          `/api/cash/distribution/getsup?type=pending&period=${period}&zone=${zone}&team=${team}&area=${area}&year=${year}&month=${month}&start=${start}1&end=${end}`
        )

        socket.on('store-updated', data => {
          console.log('store updated', data)
        })

        this.withdraw = response.data.data
        console.log('withdraw', this.withdraw)
      } catch (error) {
        this.withdraw = []
        console.log(error)
      }
    },
    async getWithdrawDetail (channel, id) {
      try {
        setChannel(channel)
        const response = await api.get(`/api/cash/distribution/detail/${id}`)
        this.withdrawDetail = response.data.data[0]
        console.log('withdrawDetail', response.data.data[0])
      } catch (error) {
        console.log(error)
      }
    },

    async getCountPending (selectZone) {
      try {
        let zone = ''
        let area = ''
        // setChannel(channel)
        if (selectZone != '') {
          zone = selectZone
        } else {
          zone = localStorage.getItem('zone')
        }

        const response = await api.get(
          `/api/cash/distribution/getOrderPending?zone=${zone}`
        )

        this.count = response.data.data
        console.log('count', this.count)
      } catch (error) {
        console.log(error)
      }
    },
    async downloadExcelBackOrder (period) {
      try {
        // ถ้าไม่ได้ส่งมา หรือฟอร์แมตไม่ใช่ YYYYMMDD ให้ใช้ "วันนี้" ตามเวลาไทย
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
          `/api/cash/distribution/withdrawBackOrderToExcel?excel=true&period=${period}`,
          { responseType: 'blob' } // สำคัญมาก!
        )

        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `BackOrer${period}.xlsx`) // ชื่อไฟล์
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
