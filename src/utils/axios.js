import axios from 'axios'

let selectChannel = {}
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
}

const api = axios.create(selectChannel)

/* =========================================
 * 🔍 LOG REQUEST (Body, Params, Headers)
 * ========================================= */
api.interceptors.request.use(
  config => {
    console.group(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    )
    console.log('Headers:', config.headers)
    console.log('Params:', config.params)
    console.log('Body:', config.data)
    console.groupEnd()
    return config
  },
  error => Promise.reject(error)
)

/* =========================================
 * 🔍 LOG RESPONSE
 * ========================================= */
api.interceptors.response.use(
  response => {
    console.group(`✅ API Response: ${response.config.url}`)
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    console.groupEnd()
    return response
  },
  error => {
    console.group(`❌ API Error`)
    console.log('Message:', error.message)
    console.log('Config:', error.config)
    console.log('Response:', error.response)
    console.groupEnd()
    return Promise.reject(error)
  }
)

export function setChannel (channel) {
  api.defaults.headers['x-channel'] = channel
}

export default api
