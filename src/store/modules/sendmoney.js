import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useSendmoney = defineStore('sendmoney', {
  state: () => ({
    sendmoney: [],
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
    }
  }
})
