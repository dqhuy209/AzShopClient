import Axios from "@/services/Axios";

const getListProductsNewArrivals = (param) => {
  return Axios.getRequest(`/products/latest?${param}`);
};

const productDetails = (id) => {
  return Axios.getRequest(`/products/${id}`);
};
const productService = {
  getListProductsNewArrivals,
  productDetails,
};

export default productService;
