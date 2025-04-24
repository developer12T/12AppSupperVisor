import { defineStore } from 'pinia'
import axios from 'axios'

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
    async getCustomerAll () {
      try {
        //   const token = JSON.parse(localStorage.getItem('token'));
        const area = localStorage.getItem('area')
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/cash/store/getStore?type=new&area=${area}`
        )
        const result = response.data
        this.storeNew = result
        console.log('storeNew', this.storeNew)
      } catch (error) {
        console.error(error)
      }
    },
    async updateStoreStatus (data) {
      try {
        const area = localStorage.getItem('area')
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cash/store/updateStoreStatus`,
          {
            storeId: data.storeId,
            area: area
          }
        )
        console.log('response', response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
