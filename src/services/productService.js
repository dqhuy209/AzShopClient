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
const getListProductByType = (type) => {
  return Axios.getRequest(`/products/apple-watch?type=${type}`)
}
const productDetails = (id) => {
  return Axios.getRequest(`/products/${id}`)
}
const productService = {
  getListProducts,
  getListProductByType,
  productDetails,
}

export default productService
