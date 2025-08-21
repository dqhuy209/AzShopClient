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
  const [itemsPerPage] = useState(12)

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

  const genders = [
    {
      name: 'Men',
      products: 10,
    },
    {
      name: 'Women',
      products: 23,
    },
    {
      name: 'Unisex',
      products: 8,
    },
  ]

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

  // danh sách sản phẩm dựa trên tham số
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Lấy các tham số từ URL
      const isLatest = searchParams.get('isLatest')
      const isFeatured = searchParams.get('isFeatured')
      const categoryId = searchParams.get('categoryId')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const page = searchParams.get('page') || '1'

      // Cập nhật trang hiện tại từ URL
      setCurrentPage(parseInt(page))

      // Xây dựng object tham số cho API
      const params = {
        page: parseInt(page) - 1, // API sử dụng zero-based indexing
        size: itemsPerPage,
      }

      // Đọc tham số sortBy/sortDir từ URL (ưu tiên) nếu có
      const sortBy = searchParams.get('sortBy')
      const sortDir = searchParams.get('sortDir')
      if (sortBy) params.sortBy = sortBy
      if (sortDir) params.sortDir = sortDir

      if (isLatest === 'true') {
        params.isLatest = true
        params.isFeatured = false
      }

      if (isFeatured === 'true') {
        params.isFeatured = true
        params.isLatest = false
      }

      if (categoryId) {
        params.categoryId = categoryId
      }

      // Gắn filter giá nếu có
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice

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
  }

  // thay đổi trang
  const handlePageChange = (newPage) => {
    // tạo URL mới với tham số trang
    const url = new URL(pathname, window.location.origin)

    // giữ nguyên các tham số hiện tại
    if (searchParams.get('isLatest')) url.searchParams.set('isLatest', 'true')
    if (searchParams.get('isFeatured'))
      url.searchParams.set('isFeatured', 'true')
    if (searchParams.get('categoryId'))
      url.searchParams.set('categoryId', searchParams.get('categoryId'))
    if (searchParams.get('sortBy'))
      url.searchParams.set('sortBy', searchParams.get('sortBy'))
    if (searchParams.get('sortDir'))
      url.searchParams.set('sortDir', searchParams.get('sortDir'))
    if (searchParams.get('minPrice'))
      url.searchParams.set('minPrice', searchParams.get('minPrice'))
    if (searchParams.get('maxPrice'))
      url.searchParams.set('maxPrice', searchParams.get('maxPrice'))

    url.searchParams.set('page', newPage.toString())

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
      // Bỏ chọn danh mục
      setSelectedCategory(null)
      // Xóa tham số categoryId khỏi URL
      const url = new URL(pathname, window.location.origin)
      if (searchParams.get('isLatest')) url.searchParams.set('isLatest', 'true')
      if (searchParams.get('isFeatured'))
        url.searchParams.set('isFeatured', 'true')
      if (searchParams.get('sortBy'))
        url.searchParams.set('sortBy', searchParams.get('sortBy'))
      if (searchParams.get('sortDir'))
        url.searchParams.set('sortDir', searchParams.get('sortDir'))
      if (searchParams.get('minPrice'))
        url.searchParams.set('minPrice', searchParams.get('minPrice'))
      if (searchParams.get('maxPrice'))
        url.searchParams.set('maxPrice', searchParams.get('maxPrice'))
      url.searchParams.delete('categoryId')
      url.searchParams.delete('page')
      router.push(url.pathname + url.search)
    } else {
      // Chọn danh mục mới
      setSelectedCategory(category)
      // Cập nhật URL với categoryId mới
      const url = new URL(pathname, window.location.origin)
      if (searchParams.get('isLatest')) url.searchParams.set('isLatest', 'true')
      if (searchParams.get('isFeatured'))
        url.searchParams.set('isFeatured', 'true')
      if (searchParams.get('sortBy'))
        url.searchParams.set('sortBy', searchParams.get('sortBy'))
      if (searchParams.get('sortDir'))
        url.searchParams.set('sortDir', searchParams.get('sortDir'))
      if (searchParams.get('minPrice'))
        url.searchParams.set('minPrice', searchParams.get('minPrice'))
      if (searchParams.get('maxPrice'))
        url.searchParams.set('maxPrice', searchParams.get('maxPrice'))
      url.searchParams.set('categoryId', categoryId.toString())
      url.searchParams.delete('page')
      router.push(url.pathname + url.search)
    }
  }

  // Hàm xóa tất cả bộ lọc
  const clearAllFilters = () => {
    setSelectedCategory(null)
    const url = new URL(pathname, window.location.origin)
    // Giữ nguyên các tham số khác
    if (searchParams.get('isLatest')) url.searchParams.set('isLatest', 'true')
    if (searchParams.get('isFeatured'))
      url.searchParams.set('isFeatured', 'true')
    url.searchParams.delete('categoryId')
    if (searchParams.get('sortBy'))
      url.searchParams.set('sortBy', searchParams.get('sortBy'))
    if (searchParams.get('sortDir'))
      url.searchParams.set('sortDir', searchParams.get('sortDir'))
    if (searchParams.get('minPrice'))
      url.searchParams.set('minPrice', searchParams.get('minPrice'))
    if (searchParams.get('maxPrice'))
      url.searchParams.set('maxPrice', searchParams.get('maxPrice'))
    url.searchParams.delete('page')
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
  }, [searchParams, categories])

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
              genders={genders}
              clearAllFilters={clearAllFilters}
            />
            {/* <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg p-[10px] lg:pl-3 lg:pr-2.5 lg:py-4.5 mb-6 bg-[#ededed]">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <SortButtons
                      productSidebar={productSidebar}
                      setProductSidebar={setProductSidebar}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Content Start --> */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
                  <span className="ml-3 text-gray-600">
                    Đang tải sản phẩm...
                  </span>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="mt-4 px-6 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <p className="text-gray-600 text-lg mb-2">
                      Không tìm thấy sản phẩm
                    </p>
                    <p className="text-gray-500 mb-4">
                      Vui lòng thử lại với bộ lọc khác
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9">
                  {products.map((item, key) => (
                    <ProductItem item={item} key={key} />
                  ))}
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
                  className="justify-center items-center"
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
