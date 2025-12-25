import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useRouteStore = defineStore('checkin', {
  state: () => ({
    routes: [],
    routesApproval: [],
    routeChanges: [],
    routeChangesNew: [],
    routeChangeStores: [],
    routeAddStores: [],
    polyline: [],
    routesStore: [],
    checkIn: [],
    total: [],
    routeInStore: [],
    routeAll: [],
    routeAlltoal: {},
    target: {},
    compare: {},
    visit: '',
    effective: '',
    totalStoreAll: 0,
    totalStorePending: 0,
    totalStoreSell: 0,
    totalStoreNotSell: 0,
    totalStoreCheckInNotSell: 0,
    message: '',
    statusCode: 0
  }),
  actions: {
    async getAreaApproval (period) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getAreaApproval?period=${period}`
        )
        console.log('routesApproval', response.data)
        this.routesApproval = response.data.data
      } catch (error) {
        this.routesApproval = []
        console.log(error)
      }
    },

    async getChangeNew (id) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRouteChange?id=${id}`
        )
        console.log('routeChangesNew', response.data)
        this.routeChangesNew = response.data.data.listStore
      } catch (error) {
        this.routeChangesNew = []
        console.log(error)
      }
    },

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

    async getRouteChangeStore (id) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRouteChange?id=${id}`
        )
        console.log('getRouteChangeStore', response.data)
        this.routeChangeStores = response.data.data.listStore
      } catch (error) {
        console.log(error)
      }
    },
    async getRouteChangeSale (period, zone, team, area) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRoute?area=${area}&period=${period}&zone=${zone}&team=${team}`
        )
        console.log('getRouteChangeSale', response.data)
        this.routeChanges = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async addStoreToRouteChange (routeId, storeId) {
      try {
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/addStoreToRouteChange`,
          {
            id: routeId,
            storeId: storeId
          }
        )

        console.log('addStoreToRouteChange', response.data)
        this.message = response.data.message
        this.statusCode = response.data.status
      } catch (error) {
        console.error('addStoreToRouteChange error:', error)

        // ✅ แยกกรณี error ให้ชัด
        if (error.response) {
          // backend ตอบมา (4xx / 5xx)
          this.message = error.response.data?.message || 'เกิดข้อผิดพลาดจากระบบ'
          this.statusCode = error.response.status
        } else if (error.request) {
          // request ออกไป แต่ไม่ได้ response กลับมา
          this.message = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
          this.statusCode = 503
        } else {
          // error จากฝั่ง frontend
          this.message = error.message || 'เกิดข้อผิดพลาด'
          this.statusCode = 500
        }
      }
    },
    async deleteStoreToRouteChange (routeId, storeId) {
      try {
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/deleteStoreToRouteChange`,
          {
            id: routeId,
            storeId: storeId
          }
        )

        console.log('deleteStoreToRouteChange', response.data)
        this.message = response.data.message
        this.statusCode = response.data.status
      } catch (error) {
        console.error('deleteStoreToRouteChange error:', error)
        // ✅ แยกกรณี error ให้ชัด
        if (error.response) {
          // backend ตอบมา (4xx / 5xx)
          this.message = error.response.data?.message || 'เกิดข้อผิดพลาดจากระบบ'
          this.statusCode = error.response.status
        } else if (error.request) {
          // request ออกไป แต่ไม่ได้ response กลับมา
          this.message = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
          this.statusCode = 503
        } else {
          // error จากฝั่ง frontend
          this.message = error.message || 'เกิดข้อผิดพลาด'
          this.statusCode = 500
        }
      }
    },
    async addNewStoreToRoute (routeId, storeId) {
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/api/cash/route/addNewStoreToRoute`,
          {
            id: routeId,
            storeId: storeId
          }
        )

        console.log('addNewStoreToRoute', response.data)
        this.message = response.data.message
        this.statusCode = response.data.status
      } catch (error) {
        console.error('addNewStoreToRoute error:', error)
        // ✅ แยกกรณี error ให้ชัด
        if (error.response) {
          // backend ตอบมา (4xx / 5xx)
          this.message = error.response.data?.message || 'เกิดข้อผิดพลาดจากระบบ'
          this.statusCode = error.response.status
        } else if (error.request) {
          // request ออกไป แต่ไม่ได้ response กลับมา
          this.message = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
          this.statusCode = 503
        } else {
          // error จากฝั่ง frontend
          this.message = error.message || 'เกิดข้อผิดพลาด'
          this.statusCode = 500
        }
      }
    },
    async getRouteChangeAreaManger (period, area, startDate, endDate) {
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

    async getNewStoreToRoute (period, zone, team, area) {
      try {
        const response = await api.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getNewStoreToRoute?period=${period}&area=${area}&zone=${zone}&team=${team}`
        )
        console.log('routeAddStores', response.data)
        this.routeAddStores = response.data.data
      } catch (error) {
        console.log(error)
      }
    },

    async approveNewStoreToRoute (id, status) {
      try {
        const user = localStorage.getItem('fullName')
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/approveNewStoreToRoute`,
          {
            id: id,
            user: user,
            status: status
          }
        )
        // console.log('routeAddStores', response.data)
        this.message = response.data.message
        this.statusCode = response.data.status
      } catch (error) {
        console.log(error)
      }
    },
    async getDayRoute (period, zone, team, area) {
      try {
        const response = await api.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/route/getRouteEffectiveByDay`,
          {
            zone: zone,
            area: area,
            period: period
          }
        )
        console.log('routeAll', response.data)
        // console.log('routeAlltotal', response.total)
        this.routeAll = response.data.data
        this.routeAlltoal = response.data.total
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
    async getRouteEffective (period, route, zone, team, area) {
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
