import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useRouteStore = defineStore('checkin', {
  state: () => ({
    routes: [],
    polyline: [],
    routesStore: [],
    checkIn: [],
    total: [],
    routeInStore: [],
    target: {},
    compare: {},
    visit: '',
    effective: '',
    totalStoreAll: 0,
    totalStorePending: 0,
    totalStoreSell: 0,
    totalStoreNotSell: 0,
    totalStoreCheckInNotSell: 0,
    message: ''
  }),
  actions: {
    async getPolyLine (period, area, startDate, endDate) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/polylineRoute?area=${area}&period=${period}&startDate=${startDate}&endDate=${endDate}`
        )
        console.log('polyline', response.data)
        this.polyline = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async getStoreInRoute (period, zone, team) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/checkroutestore?period=${period}&zone=${zone}&team=${team}`
        )
        this.routeInStore = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async getRoutesStore (period, zone) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/CheckRouteStore?zone=${zone}&period=${period}`
        )
        console.log('routesStore', response.data)
        this.routesStore = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async getRoutes (routeId) {
      try {
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/order/getSaleSummaryByStore`,
          {
            routeId: routeId
          }
        )
        console.log('routes', response.data)
        this.routes = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
    async getCheckin (period, zone, team, area) {
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/route/getRouteEffective`,
          {
            zone: zone,
            area: area,
            period: period
          }
        )

        this.checkIn = response.data.data
        this.total = response.data.total
        console.log('checkIn', this.checkIn)
        console.log('total', this.total)
      } catch (error) {
        console.error(error)
      }
    },
    async getRouteEffective (area, period, route, zone) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRouteEffectiveAll?area=${area}&period=${period}&day=${route}&zone=${zone}`
        )
        // console.log('response', response.data)
        this.visit = response.data.visit
        this.effective = response.data.effective
        this.totalStoreAll = response.data.totalStoreAll
        this.totalStoreSell = response.data.totalStoreSell
        this.totalStorePending = response.data.totalStorePending
        this.totalStoreNotSell = response.data.totalStoreNotSell
        this.totalStoreCheckInNotSell = response.data.totalStoreCheckInNotSell
        this.target = response.data.target
        this.compare = response.data.compare
      } catch (error) {
        console.error(error)
      }
    },
    async getExcelCheckin (area, period) {
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/route/getRouteEffective`,
          {
            // area: area,
            period: period,
            excel: 'true'
          },
          {
            responseType: 'blob' // สำคัญมาก! สำหรับไฟล์
          }
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `getRouteEffective_${period}.xlsx`) // ชื่อไฟล์
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
