import { createSlice } from '@reduxjs/toolkit'

/**
 * Redux slice quản lý chức năng "Mua ngay"
 * - Lưu trữ sản phẩm được chọn để mua ngay
 * - Không ảnh hưởng đến giỏ hàng hiện tại
 * - Tự động xóa khi hoàn thành đơn hàng
 */
const buyNowSlice = createSlice({
  name: 'buyNow',
  initialState: {
    // Sản phẩm được chọn để mua ngay
    product: null,
    // Trạng thái đang trong quá trình mua ngay
    isBuyNowMode: false,
  },
  reducers: {
    /**
     * Thiết lập sản phẩm để mua ngay
     * @param {Object} state - State hiện tại
     * @param {Object} action - Action với payload là sản phẩm
     */
    setBuyNowProduct: (state, action) => {
      state.product = action.payload
      state.isBuyNowMode = true
    },

    /**
     * Xóa sản phẩm mua ngay (sau khi hoàn thành đơn hàng)
     */
    clearBuyNowProduct: (state) => {
      state.product = null
      state.isBuyNowMode = false
    },

    /**
     * Reset về trạng thái ban đầu
     */
    resetBuyNow: (state) => {
      state.product = null
      state.isBuyNowMode = false
    },
  },
})

// Export actions
export const { setBuyNowProduct, clearBuyNowProduct, resetBuyNow } =
  buyNowSlice.actions

// Export selectors
export const selectBuyNowProduct = (state) => state.buyNowReducer.product
export const selectIsBuyNowMode = (state) => state.buyNowReducer.isBuyNowMode

// Export reducer
export default buyNowSlice.reducer
