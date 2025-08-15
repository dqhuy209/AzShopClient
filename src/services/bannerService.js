import Axios from '@/services/Axios'

const getBanner = () => {
  return Axios.getRequest(`/banners`)
}
const getPolicy = () => {
  return Axios.getRequest(`/policies/all?page=0&size=1000`)
}

const bannerService = {
  getBanner,
  getPolicy,
}

export default bannerService
