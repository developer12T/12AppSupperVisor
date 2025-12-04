import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useStoresStore = defineStore('stores', {
  state: () => ({
    newstoreId: '',
    statusCode: 0,
    message: '',
    storeAll: [],
    storeLatlong: [],
    storeDetail: {},
    storeMap: [],
    storeNew: [],
    similarStore: [],
    policies: [],
    provice: [],
    district: [],
    subdistrict: [],
    zipcode: [],
    storeType: [],
    addedStoreInfo: {
      storeId: '',
      storeName: ''
    },
    count: 0,
    countLat: 0,
    latLongOrderDetail: {}
  }),
  actions: {
    async getStoreMap (zone) {
      try {
        const response = await api.get(
          `/api/cash/store/getStore?type=all&zone=${zone}&showMap=true`
        )
        const result = response.data.data
        this.storeMap = result
        console.log('storeMap', this.storeMap)
      } catch (error) {
        console.error(error)
      }
    },
    async editStore (channel, id, data) {
      try {
        const user = localStorage.getItem('fullName')

        const response = await api.patch(`/api/cash/store/editStore/${id}`, {
          name: data.name,
          taxId: data.taxId,
          tel: data.tel,
          address: data.address,
          subDistrict: data.subDistrict,
          district: data.district,
          province: data.province,
          provinceCode: data.provinceCode,
          postCode: data.postCode,
          user: user
        })

        this.message = response.data.message
        this.statusCode = response.data.status
        console.log('statusCode',  this.statusCode)
      } catch (error) {
        console.error(error)
      }
    },
    async getDetailStore (storeId) {
      try {
        const response = await api.get(`/api/cash/store/${storeId}`)
        const result = response.data.data
        this.storeDetail = result
        console.log('storeDetail', this.storeDetail)
      } catch (error) {
        console.error(error)
      }
    },
    async checkSimilarStore (storeId) {
      try {
        const response = await api.get(`/api/cash/store/check/${storeId}`)
        const result = response.data.data
        if (result.length > 0) {
          this.similarStore = result
        } else {
          this.similarStore = []
        }
        // this.similarStore = result
        console.log('similarStore', this.similarStore)
      } catch (error) {
        this.similarStore = []
        console.error(error)
      }
    },

    async getCustomerAll (channel, selectZone, selectArea, team, year, month) {
      try {
        setChannel(channel)
        //   const token = JSON.parse(localStorage.getItem('token'));
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
          `/api/cash/store/getStore?type=all&zone=${zone}&area=${area}&team=${team}&year=${year}&month=${month}`
        )

        const result = response.data
        this.storeNew = result
        console.log('storeNew', this.storeNew)
      } catch (error) {
        this.storeNew = []
        console.error(error)
      }
    },

    async updateStoreStatus (data) {
      try {
        // const area = localStorage.getItem('area')
        const user = localStorage.getItem('fullName')
        const response = await api.post(`/api/cash/store/updateStoreStatus`, {
          storeId: data.storeId,
          status: data.status,
          user: user
        })
        const result = response.data.storeId
        this.newstoreId = result
        console.log('newstoreId', this.newstoreId)
      } catch (error) {
        console.error(error)
      }
    },

    async approveLatlong (data) {
      try {
        const user = localStorage.getItem('fullName')
        const response = await api.post(`/api/cash/store/approveLatLongStore`, {
          orderId: data.orderId,
          status: data.status,
          user: user
        })
        // const result = response.data.storeId
        // this.newstoreId = result
        console.log('message', response.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateStoreStatusNoNewId (data) {
      try {
        // const area = localStorage.getItem('area')
        const user = localStorage.getItem('fullName')
        const response = await api.post(
          `/api/cash/store/updateStoreStatusNoNewId `,
          {
            storeId: data.storeId,
            status: data.status,
            user: user
          }
        )
        // const result = response.data.storeId
        // this.newstoreId = result
        console.log('newstoreId', response.data)
      } catch (error) {
        console.error(error)
      }
    },
    async rejectStore (data) {
      try {
        const area = localStorage.getItem('area')
        const response = await api.post(`/api/cash/store/rejectStore`, {
          storeId: data.storeId,
          area: area
        })
        console.log('response', response.data)
      } catch (error) {
        console.error(error)
      }
    },
    async downloadExcel (period) {
      try {
        if (!/^\d{6}$/.test(period)) {
          const nowTH = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
          )
          const y = nowTH.getFullYear()
          const m = String(nowTH.getMonth() + 1).padStart(2, '0')
          period = `${m}${y}` // MMYYYY
        }
        const response = await api.get(
          `/api/cash/store/storeToExcel?date=${period}`,
          { responseType: 'blob' } // สำคัญมาก!
        )
        // สร้าง URL ให้ browser โหลดไฟล์
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `store_${period}.xlsx`) // ชื่อไฟล์
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
      }
    },
    async insertToM3 (storeId) {
      this.isLoading = true
      this.message = ''
      this.statusCode = null

      try {
        const { data, status } = await api.post(
          '/api/cash/store/insertStoreToM3',
          { storeId }
        )

        this.message = data?.message ?? 'Success'
        this.statusCode = status

        console.log('message:', this.message)
        console.log('statusCode:', this.statusCode)

        return { ok: true, data, status }
      } catch (error) {
        const status = error?.response?.status ?? 0
        const message =
          error?.response?.data?.message ?? error?.message ?? 'Unexpected error'

        this.message = message
        this.statusCode = status

        console.error('[insertToM3] failed', {
          storeId,
          status,
          message,
          details: error?.response?.data ?? String(error)
        })

        return {
          ok: false,
          error: { status, message, data: error?.response?.data }
        }
      } finally {
        this.isLoading = false
      }
    },
    async getStoreLatlong (storeId, selectZone, selectArea) {
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
        // console.log(
        //   `/api/cash/store/getLatLongOrder?storeId=${storeId}&zone=${zone}&area=${area}`
        // )

        const response = await api.get(
          `/api/cash/store/getLatLongOrder?storeId=${storeId}&zone=${zone}&area=${area}`
        )
        const result = response.data.data
        this.storeLatlong = result
        console.log('storeLatlong', this.storeLatlong)
      } catch (error) {
        console.error(error)
      }
    },
    async getPendingStore (selectZone, selectArea) {
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
        // console.log(
        //   `/api/cash/store/getLatLongOrder?storeId=${storeId}&zone=${zone}&area=${area}`
        // )

        const response = await api.post(`/api/cash/store/getPendingStore`, {
          zone: zone
        })
        const result = response.data.count
        this.count = result
        console.log('Store count', this.count)
      } catch (error) {
        console.error(error)
      }
    },
    async getLatLongOrderPending (selectZone, selectArea) {
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
        // console.log(
        //   `/api/cash/store/getLatLongOrder?storeId=${storeId}&zone=${zone}&area=${area}`
        // )

        const response = await api.get(
          `/api/cash/store/getLatLongOrderPending?zone=${zone}`
        )
        const result = response.data.data
        this.countLat = result
        console.log('countLat', this.countLat)
      } catch (error) {
        console.error(error)
      }
    },
    async getLatLongOrderDetail (orderId) {
      try {
        // console.log('getLatLongOrderDetail called with', orderId)
        const response = await api.get(
          `/api/cash/store/getLatLongOrderDetail?orderId=${orderId}`
        )
        // console.log('API response:', response.data)
        const result = response.data.data
        this.latLongOrderDetail = result
        console.log('storeLatlongDetail', this.latLongOrderDetail)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
