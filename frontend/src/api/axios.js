import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sunday-school-938e.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api