import { createSlice } from '@reduxjs/toolkit'

/**
 * Redux slice quản lý sản phẩm checkout
 * - Lưu trữ sản phẩm được chọn để thanh toán
 * - Tự động xóa khi thoát checkout
 * - Đơn giản hóa logic chuyển đổi giữa mua ngay và giỏ hàng
 */
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    // Sản phẩm trong checkout (có thể là mua ngay hoặc từ giỏ hàng)
    items: [],
    // Tổng tiền
    totalPrice: 0,
    // Nguồn gốc: 'buyNow' | 'cart'
    source: null,
  },
  reducers: {
    /**
     * Thiết lập sản phẩm mua ngay vào checkout
     * @param {Object} state - State hiện tại
     * @param {Object} action - Action với payload là sản phẩm
     */
    setBuyNowCheckout: (state, action) => {
      state.items = [action.payload]
      state.totalPrice =
        action.payload.finalPrice ||
        action.payload.sellingPrice ||
        action.payload.price ||
        0
      state.source = 'buyNow'
    },

    /**
     * Thiết lập sản phẩm từ giỏ hàng vào checkout
     * @param {Object} state - Action với payload là danh sách sản phẩm
     */
    setCartCheckout: (state, action) => {
      state.items = action.payload
      state.totalPrice = action.payload.reduce((total, item) => {
        const unit = item.finalPrice || item.sellingPrice || item.price || 0
        return total + unit
      }, 0)
      state.source = 'cart'
    },

    /**
     * Xóa tất cả sản phẩm checkout (khi thoát hoặc hoàn thành đơn hàng)
     */
    clearCheckout: (state) => {
      state.items = []
      state.totalPrice = 0
      state.source = null
    },
  },
})

// Export actions
export const { setBuyNowCheckout, setCartCheckout, clearCheckout } =
  checkoutSlice.actions

// Export selectors
export const selectCheckoutItems = (state) => state.checkoutReducer.items
export const selectCheckoutTotalPrice = (state) =>
  state.checkoutReducer.totalPrice
export const selectIsBuyNowCheckout = (state) =>
  state.checkoutReducer.source === 'buyNow'

// Export reducer
export default checkoutSlice.reducer
