import axios from 'axios'

let axiosInstance = null
let headers = {
  'Cache-Control': 'no-cache',
}

const setHeaders = (inputHeaders) => {
  headers = { ...headers, ...inputHeaders }
  getInstance().defaults.headers.common = headers
}

const getHeaders = () => headers

const getInstance = () => {
  if (axiosInstance) {
    return axiosInstance
  }

  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: getHeaders(),
    timeout: 30000,
  })

  // Request interceptor - không cần token cho client
  axiosInstance.interceptors.request.use(
    (config) => {
      // Log request for development
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Log error for development
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `❌ API Error: ${error.response?.status || 'Network Error'} ${
            error.config?.url
          }`
        )
      }

      // Handle common errors
      if (error.response?.status === 404) {
        console.error('Resource not found')
      } else if (error.response?.status >= 500) {
        console.error('Server error occurred')
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

const getRequest = (endpointApiUrl, payload = {}, config = {}) =>
  getInstance().get(endpointApiUrl, {
    params: payload,
    ...config,
  })

const postRequest = (endpointApiUrl, payload = {}, config = {}) =>
  getInstance().post(endpointApiUrl, payload, config)

const putRequest = (endpointApiUrl, payload = {}, config = {}) =>
  getInstance().put(endpointApiUrl, payload, config)

const delRequest = (endpointApiUrl, payload = {}, config = {}) =>
  getInstance().delete(endpointApiUrl, { data: payload, ...config })

const patchRequest = (endpointApiUrl, payload = {}, config = {}) =>
  getInstance().patch(endpointApiUrl, payload, config)

export const Axios = {
  axiosInstance,
  getHeaders,
  setHeaders,
  getRequest,
  postRequest,
  putRequest,
  delRequest,
  patchRequest,
}

export default Axios
