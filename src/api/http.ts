import axios from 'axios'

const BASE_PREFIX = '/api'
const API_KEY = 'ak_T8CrYrUXvnf9zgPfIPLODRD8oxSgGrrq_1776705166'  // Your API key

const axiosInstance = axios.create({
  baseURL: BASE_PREFIX,
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

const service = {
  get: (url: string, params?: any) => axiosInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  delete: (url: string, data?: any) => axiosInstance.delete(url, data),
}

export default service
