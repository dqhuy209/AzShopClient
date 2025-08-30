import { configureStore } from '@reduxjs/toolkit'

import quickViewReducer from './features/quickView-slice'
import cartReducer from './features/cart-slice'
import wishlistReducer from './features/wishlist-slice'
import productDetailsReducer from './features/product-details'

import { useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
})

// Đồng bộ giỏ hàng vào localStorage mỗi khi state thay đổi (chạy phía client)
if (typeof window !== 'undefined') {
  try {
    store.subscribe(() => {
      const items = store.getState().cartReducer.items
      localStorage.setItem('cartItems', JSON.stringify(items))
    })
  } catch (e) {
    // Bỏ qua lỗi localStorage (ví dụ: quota, privacy mode)
  }
}

export const useAppSelector = useSelector
export const useAppDispatch = useDispatch
