import Axios from '@/services/Axios'

const checkout = (payload) => {
  return Axios.postRequest(`/orders`, payload)
}
const uploadOrderImage = async (payload) => {
  const response = await fetch(
    'http://46.250.228.124:8089/api/orders/upload-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )
  return response.json()
}

const checkoutService = {
  checkout,
  uploadOrderImage,
}

export default checkoutService
