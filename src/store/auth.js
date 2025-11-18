import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    validateLogin: null,
    statusCode: 0
  }),
  getters: {
    isLoggedIn: state => state.user
  },
  actions: {
    async login (userLogin, passwordLogin) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + '/api/cash/login',
          { username: userLogin, password: passwordLogin },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
        console.log(response.data['data'][0])
        const result = response.data['data'][0]
        // console.log(result)
        if (result) {
          this.username = result.username
          this.saleCode = result.saleCode
          this.salePayer = result.salePayer
          this.fullName = result.fullName
          this.tel = result.tel
          this.area = result.area
          this.zone = result.zone
          this.warehouse = result.warehouse
          this.token = result.token
          this.role = result.role
          this.platformType = result.platformType

          localStorage.setItem('saleCode', this.saleCode)
          localStorage.setItem('fullName', this.fullName)
          localStorage.setItem('username', this.username)
          localStorage.setItem('salePayer', JSON.stringify(this.salePayer))
          localStorage.setItem('name', JSON.stringify(this.user))
          localStorage.setItem('tel', this.tel)
          localStorage.setItem('zone', this.zone)
          localStorage.setItem('area', this.area)
          localStorage.setItem('warehouse', this.warehouse)
          localStorage.setItem('token', JSON.stringify(this.token))
          localStorage.setItem('role', this.role)
          localStorage.setItem('platformType', this.platformType)
          this.statusCode = response.data['status']
        } else {
          this.validateLogin = user.message
          this.logout()
        }
        console.log('login', response.data)
      } catch (error) {
        console.log(error)
      }
    },

    logout () {
      this.saleCode = null
      this.salePayer = null
      this.user = null
      this.tel = null
      this.zone = null
      this.area = null
      this.warehouse = null
      this.token = null
      localStorage.clear()
    }
  }
})
