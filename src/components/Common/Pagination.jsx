'use client'
import React from 'react'

/**
 * Component Pagination dùng chung cho toàn bộ ứng dụng
 * Hỗ trợ điều hướng trang với giao diện đẹp và responsive
 * 
 * @param {Object} props - Các props của component
 * @param {number} props.currentPage - Trang hiện tại (bắt đầu từ 1)
 * @param {number} props.totalPages - Tổng số trang
 * @param {number} props.totalItems - Tổng số item
 * @param {number} props.itemsPerPage - Số item trên mỗi trang
 * @param {Function} props.onPageChange - Callback khi thay đổi trang
 * @param {boolean} props.showInfo - Có hiển thị thông tin trang không (mặc định: true)
 * @param {string} props.className - CSS class tùy chỉnh
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showInfo = true,
  className = ''
}) => {
  // Tính toán thông tin hiển thị
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Tạo danh sách các trang để hiển thị
  const getVisiblePages = () => {
    const delta = 2 // Số trang hiển thị xung quanh trang hiện tại
    const range = []
    const rangeWithDots = []

    // Thêm các trang xung quanh trang hiện tại
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    // Thêm trang đầu nếu cần
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    // Thêm các trang trong khoảng
    rangeWithDots.push(...range)

    // Thêm trang cuối nếu cần
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  // Xử lý sự kiện thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  // Nếu chỉ có 1 trang hoặc không có item nào, không hiển thị pagination
  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {/* Thông tin trang */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-medium text-dark">{startItem}-{endItem}</span> trong{' '}
          <span className="font-medium text-dark">{totalItems}</span> sản phẩm
        </div>
      )}

      {/* Điều hướng trang */}
      <div className="bg-white shadow-1 rounded-md p-2">
        <ul className="flex items-center gap-1">
          {/* Nút Previous */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Trang trước"
              className={`flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] transition-colors ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:text-white hover:bg-blue text-gray-600'
                }`}
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </li>

          {/* Các số trang */}
          {visiblePages.map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="flex py-1.5 px-3.5 text-gray-400">
                  {page}
                </span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] transition-colors ${page === currentPage
                    ? 'bg-blue text-white'
                    : 'hover:text-white hover:bg-blue text-gray-600'
                    }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Nút Next */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Trang tiếp theo"
              className={`flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] transition-colors ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:text-white hover:bg-blue text-gray-600'
                }`}
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Pagination
