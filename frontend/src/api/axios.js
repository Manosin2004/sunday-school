import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sundayschool.rf.gd/api',
  headers: { 'Content-Type': 'text/plain' }
})

export default api