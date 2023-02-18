import axios from 'axios'

import { getToken } from '@/utils/token'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000
})

// 拦截器
instance.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['token'] = getToken()
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
instance.interceptors.response.use(
  result => {
    return result.data
  },
  err => {
    return Promise.reject(err)
  }
)
export default instance
