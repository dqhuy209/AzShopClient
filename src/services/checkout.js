import Axios from '@/services/Axios'

const checkout = (payload) => {
  return Axios.postRequest(`/orders`, payload)
}
const uploadOrderImage = (payload) => {
  return Axios.postRequest(`/order`, payload)
}

const checkoutService = {
  checkout,
  uploadOrderImage,
}

export default checkoutService
