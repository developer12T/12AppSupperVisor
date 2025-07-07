import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useStoresStore = defineStore('stores', {
  state: () => ({
    storeAll: [],
    storeNew: [],
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
        const user = localStorage.getItem('user')
        const response = await api.post(`/api/cash/store/updateStoreStatus`, {
          storeId: data.storeId,
          status: data.status,
          user: user
        })
        console.log('response', response.data)
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
