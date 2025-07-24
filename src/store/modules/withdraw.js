import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'
import socket, { setSocketChannel } from '../../utils/socket'

export const useWithdrawStore = defineStore('withdraws', {
  state: () => ({
    withdraw: [],
    withdrawDetail: {},
    status: 0
  }),
  actions: {
    async approve (channel, id, status) {
      try {
        setChannel(channel)
        const response = await api.post(
          `/api/cash/distribution/approveWithdraw`,
          {
            orderId: id,
            status: status
          }
        )
        this.status = response.data.status
      } catch (error) {
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
      month
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
          `/api/cash/distribution/get?type=pending&period=${period}&zone=${zone}&team=${team}&area=${area}&year=${year}&month=${month}`
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
    }
  }
})
