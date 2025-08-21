import { createSelector, createSlice } from '@reduxjs/toolkit'

/**
 * Làm sạch dữ liệu giỏ hàng từ nhiều nguồn (localStorage/phiên cũ):
 * - Bỏ phần tử không có id
 * - Loại trùng theo id (giữ mục đầu tiên)
 * - Chuẩn hoá field và ÉP quantity = 1 theo business rule: sản phẩm là duy nhất
 */
export const sanitizeCartItems = (rawItems = []) => {
  const itemsArray = Array.isArray(rawItems) ? rawItems : []
  const mapById = new Map()

  for (const raw of itemsArray) {
    if (raw?.id == null) continue
    if (mapById.has(raw.id)) continue

    // Chuẩn hoá giá trị để tránh NaN
    const normalized = {
      id: raw.id,
      title: raw.title ?? raw.name ?? '',
      price: Number(raw.price ?? raw.sellingPrice ?? raw.finalPrice ?? 0) || 0,
      discountedPrice:
        Number(raw.discountedPrice ?? raw.finalPrice ?? raw.price ?? 0) || 0,
      quantity: 1, // luôn là 1
      images: raw.images,
    }

    mapById.set(raw.id, normalized)
  }

  return Array.from(mapById.values())
}

// NOTE:
// - Hỗ trợ khởi tạo từ localStorage để không cần đăng nhập vẫn giữ giỏ hàng
// - Bọc trong try/catch để tránh crash khi JSON lỗi hoặc không tồn tại
const initialState = {
  // Luôn trả về mảng hợp lệ để tránh NaN, undefined
  items:
    typeof window !== 'undefined'
      ? (() => {
          try {
            const raw = localStorage.getItem('cartItems')
            const parsed = raw ? JSON.parse(raw) : []
            return sanitizeCartItems(parsed)
          } catch (e) {
            return []
          }
        })()
      : [],
  /**
   * Danh sách id sản phẩm được chọn để thanh toán
   * - Mặc định chọn tất cả khi khởi tạo để trải nghiệm giống hiện tại
   */
  selectedIds:
    typeof window !== 'undefined'
      ? (() => {
          try {
            const rawSelected = localStorage.getItem('cartSelectedIds')
            if (rawSelected) return JSON.parse(rawSelected)
            const rawItems = localStorage.getItem('cartItems')
            const parsedItems = rawItems ? JSON.parse(rawItems) : []
            return sanitizeCartItems(parsedItems).map((it) => it.id)
          } catch (e) {
            return []
          }
        })()
      : [],
}

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      // Chuẩn hoá dữ liệu đầu vào từ nhiều nguồn (shop, best seller, quick view, API mới)
      const payload = action.payload || {}

      // Ưu tiên trường id và các biến thể đặt tên
      const id = payload.id
      if (id == null) return

      const title = payload.title ?? payload.name ?? ''

      // Giá gốc và giá sau giảm; ép kiểu số để tránh NaN do string
      const rawOriginalPrice =
        payload.price ?? payload.sellingPrice ?? payload.finalPrice ?? 0
      const rawDiscountPrice =
        payload.discountedPrice ?? payload.finalPrice ?? payload.price ?? 0

      const price = Number(rawOriginalPrice) || 0
      const discountedPrice = Number(rawDiscountPrice) || 0

      // Ảnh có thể ở `imgs.*` (data cũ) hoặc `images[]` (API mới)
      const images = payload.images

      const quantity = Number(payload.quantity) || 1

      const existingItem = state.items.find((item) => item.id === id)

      if (existingItem) {
        // Với business rule: chỉ bán 1 sản phẩm duy nhất, không tăng số lượng
        existingItem.quantity = 1
      } else {
        state.items.push({
          id,
          title,
          price,
          discountedPrice,
          quantity: 1,
          images,
        })
        // Mặc định chọn luôn item mới thêm
        if (!state.selectedIds.includes(id)) {
          state.selectedIds.push(id)
        }
      }
    },
    removeItemFromCart: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter((item) => item.id !== itemId)
      state.selectedIds = state.selectedIds.filter((id) => id !== itemId)
    },
    updateCartItemQuantity: (state, action) => {
      const { id } = action.payload
      const existingItem = state.items.find((item) => item.id === id)

      if (existingItem) {
        // Business rule: sản phẩm là duy nhất → quantity luôn là 1
        existingItem.quantity = 1
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = []
      state.selectedIds = []
    },

    // Toggle chọn/bỏ chọn 1 sản phẩm theo id
    toggleSelectItem: (state, action) => {
      const itemId = action.payload
      if (state.selectedIds.includes(itemId)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== itemId)
      } else {
        state.selectedIds.push(itemId)
      }
    },
    // Chọn tất cả sản phẩm hiện có trong giỏ
    selectAllItems: (state) => {
      state.selectedIds = state.items.map((it) => it.id)
    },
    // Bỏ chọn tất cả
    deselectAllItems: (state) => {
      state.selectedIds = []
    },
  },
})

export const selectCartItems = (state) => state.cartReducer.items
export const selectSelectedIds = (state) => state.cartReducer.selectedIds

// Lấy danh sách item đã chọn
export const selectSelectedItems = (state) => {
  const selectedIds = state.cartReducer.selectedIds
  const items = state.cartReducer.items
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) return []
  const set = new Set(selectedIds)
  return items.filter((it) => set.has(it.id))
}

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  // Tính tổng giá an toàn: ưu tiên discountedPrice -> finalPrice -> price
  return items.reduce((total, item) => {
    const unit =
      Number(item?.discountedPrice ?? item?.finalPrice ?? item?.price) || 0
    const qty = Number(item?.quantity) || 1
    return total + unit * qty
  }, 0)
})

// Tổng tiền của các item đã chọn
export const selectSelectedTotalPrice = createSelector(
  [selectSelectedItems],
  (items) => {
    return items.reduce((total, item) => {
      const unit =
        Number(item?.discountedPrice ?? item?.finalPrice ?? item?.price) || 0
      const qty = Number(item?.quantity) || 1
      return total + unit * qty
    }, 0)
  }
)

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  toggleSelectItem,
  selectAllItems,
  deselectAllItems,
} = cart.actions
export default cart.reducer
