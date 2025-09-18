import { defineStore } from 'pinia'
import api from '../../utils/axios'

export const useUser = defineStore('users', {
  state: () => ({
    user: [],
    statusCode: '',
    message: ''
  }),
  actions: {
    async getUser () {
      try {
        const response = await api.get(`/api/cash/user/getUser`)
        const result = response.data.data

        this.user = result
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    },
    async patchPassword (username, password) {
      try {
        const response = await api.patch(`/api/cash/user/updateUserOne`, {
          username: username,
          password: password
        })
        const result = response.data.data

        // this.user = result
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
