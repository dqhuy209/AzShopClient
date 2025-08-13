import Axios from '@/services/Axios'

const getListCategory = () => {
  return Axios.getRequest(`/categories`)
}

const categoryService = {
  getListCategory,
}

export default categoryService
