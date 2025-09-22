'use client'

/**
 * Helpers dùng chung cho luồng filter/shop
 * - allowedParams: whitelist các tham số filter hợp lệ và cách chuyển đổi kiểu
 * - getPreservedUrl: tạo URL mới, preserve các tham số hợp lệ, cho phép override/xóa
 */

// Whitelist tham số filter, map value -> kiểu dữ liệu nhất quán
export const allowedParams = {
  isLatest: (v) => v === 'true',
  isFeatured: (v) => v === 'true',
  categoryId: (v) => v,
  minPrice: (v) => Number(v),
  maxPrice: (v) => Number(v),
  color: (v) => v,
  caseMaterial: (v) => v,
  modelV1: (v) => v,
  version: (v) => v,
  screenSize: (v) => v,
  keyword: (v) => v,
  sortBy: (v) => v,
  sortDir: (v) => v,
  feSort: (v) => v, // FE sort, không gửi API
  page: (v) => Math.max(0, Number(v) - 1), // one-based UI -> zero-based API
}

/**
 * Tạo URL mới và preserve toàn bộ query hợp lệ từ currentSearchParams.
 * Cho phép override các key cụ thể và xóa một số key chỉ định.
 * @param {string} basePath - pathname muốn điều hướng tới (vd: '/shop-with-sidebar')
 * @param {URLSearchParams} currentSearchParams - nguồn query hiện tại để preserve
 * @param {Record<string,string|number|boolean|null|undefined>} overrides - key cần set/override
 * @param {string[]} deletions - danh sách key cần xóa
 * @returns {URL}
 */
export function getPreservedUrl(
  basePath,
  currentSearchParams,
  overrides = {},
  deletions = []
) {
  // Tạo URL mới dựa trên basePath
  const url = new URL(
    basePath,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  )

  // Preserve toàn bộ query hợp lệ theo whitelist
  Object.keys(allowedParams).forEach((key) => {
    const value = currentSearchParams?.get?.(key)
    if (value != null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  // Xóa các key yêu cầu
  deletions.forEach((k) => url.searchParams.delete(k))

  // Apply overrides: nếu null/undefined/'' => delete, ngược lại set
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') url.searchParams.delete(k)
    else url.searchParams.set(k, String(v))
  })

  return url
}
