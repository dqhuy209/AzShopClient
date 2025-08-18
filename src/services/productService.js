import Axios from '@/services/Axios'

const getListProducts = (param = {}) => {
  const queryString = new URLSearchParams(param).toString()
  return Axios.getRequest(`/products?${queryString}`)
}

const productDetails = (id) => {
  return Axios.getRequest(`/products/${id}`)
}
const productService = {
  getListProducts,
  productDetails,
}

export default productService
