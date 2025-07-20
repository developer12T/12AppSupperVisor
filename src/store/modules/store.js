import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useStoresStore = defineStore('stores', {
  state: () => ({
    newstoreId: '',
    storeAll: [],
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
    }
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
        this.similarStore = result
        console.log('similarStore', this.similarStore)
      } catch (error) {
        console.error(error)
      }
    },

    async getCustomerAll (selectZone, selectArea, team, year, month) {
      try {
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
          `/api/cash/store/getStore?type=new&zone=${zone}&area=${area}&team=${team}&year=${year}&month=${month}`
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
    async rejectStore (data) {
      try {
        const area = localStorage.getItem('area')
        const response = await api.post(`/api/cash/store/rejectStore`, {
          storeId: data.storeId,
          area: area
        })
        // const response = await axios.post(
        //   `${import.meta.env.VITE_API_URL}/api/cash/store/rejectStore`,
        //   {
        //     storeId: data.storeId,
        //     area: area
        //   },
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'x-channel': 'cash'
        //     }
        //   }
        // )
        console.log('response', response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
