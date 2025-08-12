import Axios from "@/services/Axios";

const getListProductsNewArrivals = (param) => {
  return Axios.getRequest(`/products/latest?${param}`);
};

const getListProductsBestSeller = (param) => {
  return Axios.getRequest(`/products/latest?${param}`);
};

const productDetails = (id) => {
  return Axios.getRequest(`/products/${id}`);
};
const productService = {
  getListProductsNewArrivals,
  getListProductsBestSeller,
  productDetails,
};

export default productService;
