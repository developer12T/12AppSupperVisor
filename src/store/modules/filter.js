import { defineStore } from 'pinia'
import api, { setChannel } from '../../utils/axios'

export const useFilter = defineStore('filters', {
  state: () => ({
    area: [],
    zone: [],
    team: [],
    brand: [],
    flavour: [],
    group: [],
    size: [],
    unit: [],
    message: ''
  }),
  actions: {
    async getBrand (group, flavour, size, unit) {
      try {
        const response = await api.post(`/api/cash/product/brandByFilter`, {
          flavour: flavour,
          size: size,
          group: group,
          unit: unit
        })
        const result = response.data.data
        this.brand = result
        console.log('getBrand', this.brand)
      } catch (error) {
        console.error(error)
      }
    },

    async getGroup (brand, flavour, size, unit) {
      try {
        const response = await api.post(`/api/cash/product/groupByFilter`, {
          flavour: flavour,
          size: size,
          brand: brand,
          unit: unit
        })
        const result = response.data.data
        this.group = result
        console.log('getGroup', this.group)
      } catch (error) {
        console.error(error)
      }
    },

    async getFlavour (brand, group, size, unit) {
      try {
        const response = await api.post(`/api/cash/product/flavourByFilter`, {
          group: group,
          size: size,
          brand: brand,
          unit: unit
        })
        const result = response.data.data
        this.flavour = result
        console.log('getFlavour', this.flavour)
      } catch (error) {
        console.error(error)
      }
    },

    async getSize (brand, group, flavour, unit) {
      try {
        const response = await api.post(`/api/cash/product/sizeByFilter`, {
          group: group,
          flavour: flavour,
          brand: brand,
          unit: unit
        })
        const result = response.data.data
        this.size = result
        console.log('getSize', this.size)
      } catch (error) {
        console.error(error)
      }
    },

    async getUnit (brand, group, flavour, size) {
      try {
        const response = await api.post(`/api/cash/product/brandByFilter`, {
          group: group,
          flavour: flavour,
          brand: brand,
          size: size
        })
        const result = response.data.data
        this.unit = result
        console.log('getUnit', this.unit)
      } catch (error) {
        console.error(error)
      }
    },

    async getZone (channel, period) {
      try {
        const platformType = localStorage.getItem('platformType')
        setChannel(channel)
        const response = await api.post(`/api/cash/user/getArea`, {
          zone: '',
          team: '',
          role: 'sale',
          platformType: platformType
        })
        const result = response.data.data
        this.zone = result
        console.log('Zones', response.data.data)
        console.log('Zones', this.zone)
      } catch (error) {
        console.error(error)
      }
    },

    async getArea (period, zone, team) {
      try {
        const platformType = localStorage.getItem('platformType')
        const response = await api.post(`/api/cash/user/getArea`, {
          zone: zone,
          team: team,
          role: 'sale',
          platformType: platformType
        })
        const result = response.data.data
        this.area = result
        // console.log('Areas', this.area)
      } catch (error) {
        console.error(error)
      }
    },
    async getTeam (zone) {
      try {
        let platformType = localStorage.getItem('platformType')

        if (platformType == 'ADMIN') {
          platformType = 'CASH'
        }
        const response = await api.get(
          `/api/cash/user/getTeam?zone=${zone}&platformType=${platformType}`
        )
        const result = response.data.data
        this.team = result
        console.log('Teams', this.team)
      } catch (error) {
        console.error(error)
      }
    },
    async getRoute () {
      try {
        const response = await api.get(`/api/cash/product/getProductSwitch`)
        const result = response.data
        this.product = result
        console.log('products', this.product)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
