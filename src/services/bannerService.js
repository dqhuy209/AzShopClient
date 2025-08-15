import Axios from '@/services/Axios'

const getBanner = () => {
  return Axios.getRequest(`/banners`)
}

const bannerService = {
  getBanner,
}

export default bannerService
