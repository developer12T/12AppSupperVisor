import axios from 'axios'
let selectChannel = {}
const zone = localStorage.getItem('zone')
const platformType = localStorage.getItem('platformType')

selectChannel.baseURL = import.meta.env.VITE_API_URL

switch (platformType) {
  case 'PC':
    selectChannel.headers = {
      'Content-Type': 'application/json',
      'x-channel': 'pc'
    }
    break
  case 'CASH':
    selectChannel.headers = {
      'Content-Type': 'application/json',
      'x-channel': 'cash'
    }
    break
  default:
    selectChannel.headers = {
      'Content-Type': 'application/json',
      'x-channel': 'cash'
    }
    break
}

const api = axios.create(selectChannel)

export function setChannel (channel) {
  api.defaults.headers['x-channel'] = channel
}

export default api
