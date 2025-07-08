import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useGiveAway = defineStore('giveaway', {
  state: () => ({
    giveaways: [],
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
    }
  }
})
