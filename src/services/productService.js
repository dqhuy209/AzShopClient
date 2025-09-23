import Axios from '@/services/Axios'

const getListProducts = (param = {}) => {
  const usp = new URLSearchParams()
  Object.entries(param).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== '')
          usp.append(key, String(v))
      })
    } else {
      usp.append(key, String(value))
    }
  })
  return Axios.getRequest(`/products?${usp.toString()}`)
}
const getSuggestProducts = (param = {}) => {
  const usp = new URLSearchParams()
  Object.entries(param).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    usp.append(key, String(value))
  })
  return Axios.getRequest(`/suggest?${usp.toString()}`)
}
const productDetails = (id) => {
  return Axios.getRequest(`/products/${id}`)
}
const productService = {
  getListProducts,
  productDetails,
  getSuggestProducts,
}

export default productService
