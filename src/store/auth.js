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
              'x-channel': 'cash'
            }
          }
        )
        console.log(response.data.data[0])
        const result = response.data.data[0]
        // console.log(result)
        if (result) {
          this.username = result.data[0].username
          this.saleCode = result.data[0].saleCode
          this.salePayer = result.data[0].salePayer
          this.fullName = result.data[0].fullName
          this.tel = result.data[0].tel
          this.area = result.data[0].area
          this.zone = result.data[0].zone
          this.warehouse = result.data[0].warehouse
          this.token = result.data[0].token
          this.role = result.data[0].role

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
          this.statusCode = response.data.status
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
