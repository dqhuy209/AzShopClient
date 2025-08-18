'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'


const SortButtons = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Tạo URL mới giữ nguyên tham số hiện tại rồi áp cập nhật
  const navigateWithParams = (updates, keysToDelete = []) => {
    const url = new URL(pathname, window.location.origin)
    // Sao chép params hiện tại
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
    // Áp các cập nhật
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, String(value))
      }
    })
    // Xóa các khóa không dùng
    keysToDelete.forEach((key) => url.searchParams.delete(key))
    // Reset về trang 1 khi đổi sort
    url.searchParams.delete('page')
    router.push(url.pathname + url.search)
  }

  // Tất cả: xóa mọi sort/filter liên quan tới phần yêu cầu
  const handleAll = () => navigateWithParams({}, ['isLatest', 'isFeatured', 'sortBy', 'sortDir'])

  const handleBestSelling = () => {
    const isFeaturedActive = searchParams.get('isFeatured') === 'true'
    if (isFeaturedActive) {
      handleAll()
    } else {
      // Bật bán chạy nhất, giữ nguyên sortBy/sortDir hiện tại nếu có
      navigateWithParams({ isFeatured: 'true' }, ['isLatest'])
    }
  }

  const handleLatest = () => {
    const isLatestActive = searchParams.get('isLatest') === 'true'
    if (isLatestActive) {
      // Toggle về tất cả sản phẩm
      handleAll()
    } else {
      // Bật hàng mới về, giữ nguyên sortBy/sortDir hiện tại nếu có
      navigateWithParams({ isLatest: 'true' }, ['isFeatured'])
    }
  }

  const handlePriceAsc = () =>
    // Chỉ cập nhật sort, không động tới isLatest/isFeatured
    navigateWithParams({ sortBy: 'price', sortDir: 'asc' })

  const handlePriceDesc = () =>
    // Chỉ cập nhật sort, không động tới isLatest/isFeatured
    navigateWithParams({ sortBy: 'price', sortDir: 'desc' })

  // Trạng thái active theo URL hiện tại
  const isFeaturedActive = searchParams.get('isFeatured') === 'true'
  const isLatestActive = searchParams.get('isLatest') === 'true'
  const sortBy = searchParams.get('sortBy')
  const sortDir = searchParams.get('sortDir')
  const isPriceAsc = sortBy === 'price' && sortDir === 'asc'
  const isPriceDesc = sortBy === 'price' && sortDir === 'desc'
  const isAllActive = !isFeaturedActive && !isLatestActive && !sortBy && !sortDir

  // Helper render nút với style active
  const Button = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-md border text-sm transition-colors ${active
        ? 'bg-blue text-white border-blue'
        : 'bg-white text-dark border-gray-200 hover:border-blue hover:text-blue'
        }`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button active={isAllActive} onClick={handleAll}>Tất cả sản phẩm</Button>
      <Button active={isFeaturedActive} onClick={handleBestSelling}>Bán chạy nhất</Button>
      <Button active={isLatestActive} onClick={handleLatest}>Hàng mới về</Button>
      <Button active={isPriceAsc} onClick={handlePriceAsc}>Giá tăng dần</Button>
      <Button active={isPriceDesc} onClick={handlePriceDesc}>Giá giảm dần</Button>
    </div>
  )
}

export default SortButtons


