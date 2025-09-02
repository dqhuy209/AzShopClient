'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

/**
 * Component Sidebar chứa các bộ lọc sản phẩm
 * @param {Object} props - Props của component
 * @param {boolean} props.productSidebar - Trạng thái hiển thị sidebar
 * @param {Function} props.setProductSidebar - Hàm set trạng thái sidebar
 */

const SortButtons = ({ productSidebar, setProductSidebar }) => {
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
  const handleAll = () => {
    // Nếu đang ở "Bán chạy nhất/Hàng mới về" và có sort giá, khi về "Tất cả" sẽ xóa luôn feSort
    const isFeaturedActive = searchParams.get('isFeatured') === 'true'
    const isLatestActive = searchParams.get('isLatest') === 'true'
    const deletions = ['isLatest', 'isFeatured', 'sortBy', 'sortDir']
    if (isFeaturedActive || isLatestActive) deletions.push('feSort')
    navigateWithParams({}, deletions)
  }

  const handleBestSelling = () => {
    const isFeaturedActive = searchParams.get('isFeatured') === 'true'
    if (isFeaturedActive) {
      // Đang ở chế độ này rồi => không làm gì (giữ nguyên)
      return
    }
    // Bật bán chạy nhất, reset feSort để tránh xung đột sort FE
    navigateWithParams({ isFeatured: 'true' }, ['isLatest', 'feSort'])
  }

  const handleLatest = () => {
    const isLatestActive = searchParams.get('isLatest') === 'true'
    if (isLatestActive) {
      // Đang ở chế độ này rồi => không làm gì (giữ nguyên)
      return
    }
    // Bật hàng mới về, reset feSort để tránh xung đột sort FE
    navigateWithParams({ isLatest: 'true' }, ['isFeatured', 'feSort'])
  }

  const handlePriceAsc = () => {
    // FE sort: nếu đang priceAsc thì bỏ sort, ngược lại set priceAsc
    const current = searchParams.get('feSort')
    if (current === 'priceAsc') {
      navigateWithParams({}, ['feSort', 'sortBy', 'sortDir'])
    } else {
      navigateWithParams({ feSort: 'priceAsc' }, ['sortBy', 'sortDir'])
    }
  }

  const handlePriceDesc = () => {
    // FE sort: nếu đang priceDesc thì bỏ sort, ngược lại set priceDesc
    const current = searchParams.get('feSort')
    if (current === 'priceDesc') {
      navigateWithParams({}, ['feSort', 'sortBy', 'sortDir'])
    } else {
      navigateWithParams({ feSort: 'priceDesc' }, ['sortBy', 'sortDir'])
    }
  }

  // Trạng thái active theo URL hiện tại
  const isFeaturedActive = searchParams.get('isFeatured') === 'true'
  const isLatestActive = searchParams.get('isLatest') === 'true'
  const feSort = searchParams.get('feSort')
  const isPriceAsc = feSort === 'priceAsc'
  const isPriceDesc = feSort === 'priceDesc'
  // "Tất cả" active khi không bật 2 chế độ kia, bất kể feSort
  const isAllActive = !isFeaturedActive && !isLatestActive

  // Helper render nút với style active
  const Button = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-[4px] rounded-[4px] py-[6px] lg:px-[12px] lg:py-[10px] text-sm transition-colors flex items-center gap-x-[4px] group ${active
        ? 'bg-blue text-white border-gray-200'
        : 'hover:text-blue bg-white '
        }`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex items-start md:items-center justify-between gap-x-[20px] w-full">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button active={isAllActive} onClick={handleAll}>
          <div className="w-[20px] h-[20px]">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.9844 10C21.9473 8.68893 21.8226 7.85305 21.4026 7.13974C20.8052 6.12523 19.7294 5.56066 17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.27063 5.56066 3.19479 6.12523 2.5974 7.13974C2 8.15425 2 9.41667 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C10.1779 21.5393 11.0557 22 12 22C12.9443 22 13.8221 21.5393 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C21.8226 16.1469 21.9473 15.3111 21.9844 14"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`stroke-[#000]  transition-colors ${isAllActive ? 'stroke-[#fff] group-hover:stroke-[#fff]' : 'group-hover:stroke-[#dd2439]'}`}
              />
              <path
                d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`stroke-[#000] group-hover:stroke-[#dd2439] transition-colors' ${isAllActive ? 'stroke-[#fff] group-hover:stroke-[#fff]' : 'group-hover:stroke-[#dd2439]'}`}
              />
            </svg>
          </div>
          Tất cả sản phẩm
        </Button>
        <Button active={isFeaturedActive} onClick={handleBestSelling}>
          <div className="w-[20px] h-[20px]">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.03954 7.77203C3.57986 8.32856 2.35002 8.60682 2.05742 9.54773C1.76482 10.4886 2.60325 11.4691 4.2801 13.4299L4.71392 13.9372C5.19043 14.4944 5.42868 14.773 5.53586 15.1177C5.64305 15.4624 5.60703 15.8341 5.53498 16.5776L5.4694 17.2544C5.21588 19.8706 5.08912 21.1787 5.85515 21.7602C6.62118 22.3417 7.77268 21.8115 10.0757 20.7512L10.6715 20.4768C11.3259 20.1755 11.6531 20.0248 12 20.0248C12.3469 20.0248 12.6741 20.1755 13.3285 20.4768L13.9243 20.7512C16.2273 21.8115 17.3788 22.3417 18.1449 21.7602C18.9109 21.1787 18.7841 19.8706 18.5306 17.2544M19.7199 13.4299C21.3968 11.4691 22.2352 10.4886 21.9426 9.54773C21.65 8.60682 20.4201 8.32856 17.9605 7.77203L17.3241 7.62805C16.6251 7.4699 16.2757 7.39083 15.9951 7.17781C15.7144 6.96479 15.5345 6.64193 15.1745 5.99623L14.8468 5.40837C13.5802 3.13612 12.9469 2 12 2C11.0531 2 10.4198 3.13613 9.15316 5.40838"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`stroke-[#000]  transition-colors transition-colors' ${isFeaturedActive ? 'stroke-[#fff] group-hover:stroke-[#fff]' : 'group-hover:stroke-[#dd2439]'}`}
              />
            </svg>
          </div>
          Bán chạy nhất
        </Button>
        <Button active={isLatestActive} onClick={handleLatest}>
          <div className="w-[20px] h-[20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                className={`stroke-[#000] transition-colors ${isLatestActive ? 'stroke-[#fff] group-hover:stroke-[#fff]' : ' group-hover:stroke-[#dd2439]'}`}
                fill="currentColor"
                d="M18.25 4a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75ZM4 18.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75ZM8.28 7.22a.75.75 0 0 0-1.06 1.06l6.5 6.5a.75.75 0 1 0 1.06-1.06l-6.5-6.5Z"
              />
            </svg>
          </div>
          Hàng mới về
        </Button>
        <Button active={isPriceAsc} onClick={handlePriceAsc}>
          <div className="w-[20px] h-[20px]">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={` transition-colors ${isPriceAsc ? 'fill-[#fff] group-hover:fill-[#fff] ' : 'group-hover:fill-[#dd2439] '}`}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.00002 5C7.00002 4.44772 6.5523 4 6.00002 4C5.44773 4 5.00002 4.44772 5.00002 5V16.5858L3.7071 15.2929C3.31658 14.9024 2.68341 14.9024 2.29289 15.2929C1.90237 15.6834 1.90237 16.3166 2.2929 16.7071L5.29291 19.7071C5.68344 20.0976 6.3166 20.0976 6.70713 19.7071L9.70713 16.7071C10.0977 16.3166 10.0977 15.6834 9.70713 15.2929C9.3166 14.9024 8.68344 14.9024 8.29291 15.2929L7.00002 16.5858V5ZM13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8H14C14.5523 8 15 7.55228 15 7C15 6.44772 14.5523 6 14 6H13ZM13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13ZM13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18H21C21.5523 18 22 17.5523 22 17C22 16.4477 21.5523 16 21 16H13Z"
                fill={isPriceAsc ? '#fff' : '#000'}
              />
            </svg>
          </div>
          Giá tăng dần
        </Button>
        <Button active={isPriceDesc} onClick={handlePriceDesc}>
          <div className="w-[20px] h-[20px]">
            <svg width="20px" height="20px" viewBox="0 0 512 512" version="1.1">
              <title>sort-descending</title>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="add"
                  fill={isPriceDesc ? '#fff' : '#000'} // Dynamic fill based on `isLatestActive`
                  transform="translate(64.000000, 106.666667)"
                >
                  <path
                    className={`stroke-[#000] transition-colors ${isPriceDesc ? 'stroke-[#fff] group-hover:fill-[#fff] ' : 'group-hover:fill-[#dd2439] '}`}
                    d="M-4.26325641e-14,213.333333 L106.666667,213.333333 L106.666667,256 L-4.26325641e-14,256 L-4.26325641e-14,213.333333 Z M-4.26325641e-14,149.333333 L149.333333,149.333333 L149.333333,106.666667 L-4.26325641e-14,106.666667 L-4.26325641e-14,149.333333 Z M-4.26325641e-14,42.6666667 L192,42.6666667 L192,-2.84217094e-14 L-4.26325641e-14,-2.84217094e-14 L-4.26325641e-14,42.6666667 Z M368.916693,189.31904 L320,238.235733 L320,-2.84217094e-14 L277.333333,-2.84217094e-14 L277.333333,238.235733 L228.41664,189.31904 L198.250027,219.485653 L298.666667,320 L399.083307,219.485653 L368.916693,189.31904 Z"
                    id="Shape"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          Giá giảm dần
        </Button>
      </div>
      <div
        className="xl:hidden w-fit"
        onMouseDown={(e) => {
          // Ngăn outside-click handler (mousedown) đóng/mở ngược trạng thái
          e.preventDefault()
          e.stopPropagation()
          setProductSidebar((prev) => !prev)
        }}
      >
        <div className="!w-[25px] !h-[25px] lg:w-[30px] lg:h-[30px] overflow-hidden relative">
          <Image
            src={'/images/icons/icon-filter.svg'}
            alt={'filter'}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default SortButtons
