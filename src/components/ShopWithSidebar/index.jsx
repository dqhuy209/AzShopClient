'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Breadcrumb from '../Common/Breadcrumb'
import SortButtons from './SortButtons'
import Sidebar from './Sidebar'
import ProductItem from '../Common/ProductItem'
import Pagination from '../Common/Pagination'
import productService from '@/services/productService'
import categoryService from '@/services/categoryService'
import { allowedParams, getPreservedUrl as getPreservedUrlShared } from '@/utils/shopFilters'

// dùng allowedParams từ helper chung để đồng bộ whitelist

const ShopWithSidebar = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [productSidebar, setProductSidebar] = useState(false)
  const [stickyMenu, setStickyMenu] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  // số phần tử mỗi trang là hằng số; không cần state
  const itemsPerPage = 12

  // Helper: build params từ URL theo whitelist, convert kiểu dữ liệu nhất quán
  const buildApiParams = React.useCallback((searchParamsObj) => {
    const result = { size: itemsPerPage }
    Object.entries(allowedParams).forEach(([key, transform]) => {
      // Hỗ trợ nhiều giá trị cùng key: dùng getAll, nếu >1 thì giữ mảng
      const all = searchParamsObj.getAll(key)
      // Bỏ qua tham số chỉ dành cho FE
      if (key === 'feSort') return
      if (all.length > 1) {
        const values = all
          .filter((v) => v != null && v !== '')
          .map((v) => transform(v))
        if (values.length) result[key] = values
      } else {
        const raw = searchParamsObj.get(key)
        if (raw != null && raw !== '') {
          result[key === 'page' ? 'page' : key] = transform(raw)
        }
      }
    })
    // Đảm bảo isLatest/isFeatured không đồng thời true
    if (result.isLatest) result.isFeatured = false
    if (result.isFeatured) result.isLatest = false
    return result
  }, [])

  // Helper: tạo URL mới và preserve toàn bộ query hợp lệ, cho phép override/delete
  const getPreservedUrl = React.useCallback((overrides = {}, deletions = []) => {
    // preserve query hiện tại dựa trên whitelist, basePath = pathname hiện tại
    return getPreservedUrlShared(pathname, searchParams, overrides, deletions)
  }, [pathname, searchParams])

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true)
    } else {
      setStickyMenu(false)
    }
  }

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)


  //  categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError(null)

      const response = await categoryService.getListCategory()
      setCategories(response.data.data || [])
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục:', err)
      setCategoriesError(
        'Không thể tải danh sách danh mục. Vui lòng thử lại sau.'
      )
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  // danh sách sản phẩm dựa trên tham số (tối ưu bằng whitelist + helper)
  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Cập nhật trang hiện tại từ URL (one-based cho UI)
      const pageDisplay = parseInt(searchParams.get('page') || '1')
      setCurrentPage(isNaN(pageDisplay) ? 1 : pageDisplay)

      // Build params gửi API dựa trên whitelist
      const params = buildApiParams(searchParams)

      const response = await productService.getListProducts(params)
      setProducts(response.data.data.content)
      setTotalProducts(response.data.data.totalElements)
      setTotalPages(response.data.data.totalPages)
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err)
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.')
      setProducts([])
      setTotalProducts(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [searchParams, buildApiParams])

  // thay đổi trang
  const handlePageChange = (newPage) => {
    // Tạo URL mới, preserve toàn bộ query hợp lệ và set page mới
    const url = getPreservedUrl({ page: newPage.toString() })

    router.push(url.pathname + url.search)
  }

  // thay đổi danh mục
  const handleCategoryChange = (category) => {
    const categoryId = category.id || category._id || category.categoryId

    if (
      selectedCategory &&
      (selectedCategory.id === categoryId ||
        selectedCategory._id === categoryId ||
        selectedCategory.categoryId === categoryId)
    ) {
      // Bỏ chọn danh mục và xóa categoryId, page; preserve query còn lại
      setSelectedCategory(null)
      const url = getPreservedUrl({}, ['categoryId', 'page'])
      router.push(url.pathname + url.search)
    } else {
      // Chọn danh mục mới
      setSelectedCategory(category)
      // Cập nhật URL với categoryId mới, reset page; preserve query còn lại
      const url = getPreservedUrl({ categoryId: categoryId.toString() }, ['page'])
      router.push(url.pathname + url.search)
    }
  }

  // Hàm xóa tất cả bộ lọc
  const clearAllFilters = () => {
    setSelectedCategory(null)
    // Xóa TẤT CẢ các tham số lọc/sort đã whitelist
    const url = new URL(pathname, window.location.origin)
    Object.keys(allowedParams).forEach((key) => {
      url.searchParams.delete(key)
    })
    router.push(url.pathname + url.search)
  }

  // Hàm gộp để lấy thông tin breadcrumb dựa trên tham số
  const getBreadcrumbInfo = () => {
    const isLatest = searchParams.get('isLatest')
    const isFeatured = searchParams.get('isFeatured')
    const categoryId = searchParams.get('categoryId')

    // Xác định loại breadcrumb dựa trên tham số
    if (isLatest === 'true') {
      return {
        title: 'Sản phẩm mới nhất',
        pages: ['shop', '/', 'sản phẩm mới nhất'],
      }
    }

    if (isFeatured === 'true') {
      return {
        title: 'Sản phẩm bán chạy',
        pages: ['shop', '/', 'sản phẩm bán chạy'],
      }
    }

    if (categoryId) {
      return {
        title: 'Danh mục sản phẩm',
        pages: ['shop', '/', 'danh mục'],
      }
    }

    // Mặc định cho tất cả sản phẩm
    return {
      title: 'Tất cả sản phẩm',
      pages: ['shop', '/', 'tất cả sản phẩm'],
    }
  }

  useEffect(() => {
    // Lấy danh sách categories khi component mount
    fetchCategories()
  }, [])

  useEffect(() => {
    // Reset về trang 1 khi các tham số khác thay đổi (không phải page)
    const isLatest = searchParams.get('isLatest')
    const isFeatured = searchParams.get('isFeatured')
    const categoryId = searchParams.get('categoryId')
    const page = searchParams.get('page')

    // Cập nhật selectedCategory từ URL
    if (categoryId) {
      const category = categories.find(
        (cat) =>
          cat.id == categoryId ||
          cat._id == categoryId ||
          cat.categoryId == categoryId
      )
      setSelectedCategory(category || null)
    } else {
      setSelectedCategory(null)
    }

    // Nếu thay đổi tham số khác page, reset về trang 1
    if (!page) {
      setCurrentPage(1)
    }

    // Lấy danh sách sản phẩm khi component mount hoặc tham số thay đổi
    fetchProducts()
  }, [searchParams, categories, fetchProducts])

  useEffect(() => {
    window.addEventListener('scroll', handleStickyMenu)

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest('.sidebar-content')) {
        setProductSidebar(false)
      }
    }

    if (productSidebar) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <>
      <Breadcrumb
        title={getBreadcrumbInfo().title}
        pages={getBreadcrumbInfo().pages}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-10 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <Sidebar
              productSidebar={productSidebar}
              stickyMenu={stickyMenu}
              setProductSidebar={setProductSidebar}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              fetchCategories={fetchCategories}
              clearAllFilters={clearAllFilters}
            />
            {/* <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg p-[10px] lg:pl-3 lg:pr-2.5 lg:py-4.5 mb-6 bg-[#ededed]">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center w-full gap-4">
                    <SortButtons
                      productSidebar={productSidebar}
                      setProductSidebar={setProductSidebar}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Content Start --> */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-blue"></div>
                  <span className="ml-3 text-gray-600">
                    Đang tải sản phẩm...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="mb-2 text-xl text-red-500">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-6 py-2 mt-4 text-white transition-colors rounded-md bg-blue hover:bg-blue-600"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="mb-4 text-6xl text-gray-400">📦</div>
                    <p className="mb-2 text-lg text-gray-600">
                      Không tìm thấy sản phẩm
                    </p>
                    <p className="mb-4 text-gray-500">
                      Vui lòng thử lại với bộ lọc khác
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9">
                  {(() => {
                    // FE sort theo tham số feSort
                    const feSort = searchParams.get('feSort')
                    const displayed = [...products]
                    if (feSort === 'priceAsc') {
                      displayed.sort(
                        (a, b) => (a.finalPrice ?? a.sellingPrice ?? 0) - (b.finalPrice ?? b.sellingPrice ?? 0)
                      )
                    } else if (feSort === 'priceDesc') {
                      displayed.sort(
                        (a, b) => (b.finalPrice ?? b.sellingPrice ?? 0) - (a.finalPrice ?? a.sellingPrice ?? 0)
                      )
                    }
                    return displayed.map((item, key) => (
                      <ProductItem item={item} key={key} />
                    ))
                  })()}
                </div>
              )}
              {/* <!-- Products Grid Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="mt-15">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalProducts}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  showInfo={false}
                  className="items-center justify-center"
                />
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default ShopWithSidebar
