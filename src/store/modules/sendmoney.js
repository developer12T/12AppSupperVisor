import { defineStore } from 'pinia'
import api from '../../utils/axios'
import Sendmoney from '../../views/supervisor/Sendmoney.vue'

export const useRouteStore = defineStore('checkin', {
  state: () => ({
    routes: [],
    sendmoney: [],
    statusCode: 0,
    message: ''
  })
})
