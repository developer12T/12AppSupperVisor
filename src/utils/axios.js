import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-channel': 'cash'
  }
})

export function setChannel (channel) {
  api.defaults.headers['x-channel'] = channel
}

export default api
