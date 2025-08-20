'use client'
import React from 'react'
import CategoryDropdown from './CategoryDropdown'
import GenderDropdown from './GenderDropdown'
import SizeDropdown from './SizeDropdown'
import ColorsDropdwon from './ColorsDropdwon'
import PriceDropdown from './PriceDropdown'

/**
 * Component Sidebar chứa các bộ lọc sản phẩm
 * @param {Object} props - Props của component
 * @param {boolean} props.productSidebar - Trạng thái hiển thị sidebar
 * @param {boolean} props.stickyMenu - Trạng thái sticky menu
 * @param {Function} props.setProductSidebar - Hàm set trạng thái sidebar
 * @param {Array} props.categories - Danh sách danh mục
 * @param {boolean} props.categoriesLoading - Trạng thái loading danh mục
 * @param {string|null} props.categoriesError - Lỗi khi tải danh mục
 * @param {Object|null} props.selectedCategory - Danh mục được chọn
 * @param {Function} props.handleCategoryChange - Hàm xử lý thay đổi danh mục
 * @param {Function} props.fetchCategories - Hàm tải lại danh mục
 * @param {Array} props.genders - Danh sách giới tính
 * @param {Function} props.clearAllFilters - Hàm xóa tất cả bộ lọc
 */

const Sidebar = ({
  productSidebar,
  stickyMenu,
  setProductSidebar,
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategory,
  handleCategoryChange,
  fetchCategories,
  genders,
  clearAllFilters,
}) => {
  return (
    <div
      className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
        productSidebar
          ? 'translate-x-0 bg-white p-5 h-screen overflow-y-auto'
          : '-translate-x-full'
      }`}
    >
      {/* Nút toggle sidebar cho mobile */}
      <button
        onClick={() => setProductSidebar(!productSidebar)}
        aria-label="button for product sidebar toggle"
        className={`hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
          stickyMenu
            ? 'lg:top-20 sm:top-34.5 top-35'
            : 'lg:top-24 sm:top-39 top-37'
        }`}
      >
        <svg
          className="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
            fill=""
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
            fill=""
          />
        </svg>
      </button>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-6">
          {/* Filter box - Header và nút Clear All */}
          <div className="bg-white shadow-1 rounded-lg py-4 px-5">
            <div className="flex items-center justify-between">
              <p>Filters:</p>
              <button
                className="text-blue hover:text-blue-600 transition-colors"
                onClick={clearAllFilters}
              >
                Clean All
              </button>
            </div>
          </div>

          {/* Category box - Bộ lọc danh mục */}
          {categoriesLoading ? (
            <div className="bg-white shadow-1 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue"></div>
                <span className="ml-3 text-gray-600">Đang tải danh mục...</span>
              </div>
            </div>
          ) : categoriesError ? (
            <div className="bg-white shadow-1 rounded-lg p-6">
              <div className="text-center">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-gray-600 text-sm mb-3">{categoriesError}</p>
                <button
                  onClick={fetchCategories}
                  className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <CategoryDropdown
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          ) : (
            <div className="bg-white shadow-1 rounded-lg p-6">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">📂</div>
                <p className="text-gray-600 text-sm">Không có danh mục nào</p>
              </div>
            </div>
          )}

          {/* Gender box - Bộ lọc giới tính */}
          <GenderDropdown genders={genders} />

          {/* Size box - Bộ lọc kích thước */}
          <SizeDropdown />

          {/* Color box - Bộ lọc màu sắc */}
          <ColorsDropdwon />

          {/* Price range box - Bộ lọc khoảng giá */}
          <PriceDropdown />
        </div>
      </form>
    </div>
  )
}

export default Sidebar
