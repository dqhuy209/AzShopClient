'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/ShopWithSidebar/Sidebar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import categoryService from '@/services/categoryService'
import { allowedParams, getPreservedUrl as getPreservedUrlShared } from '@/utils/shopFilters'

export default function FooterMobile() {
  // router & query hiện tại để build URL preserve
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const [productSidebar, setProductSidebar] = useState(false)
  const [stickyMenu, setStickyMenu] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)
  // Dùng để force remount Sidebar mỗi lần mở, đảm bảo UI filter reset theo URL hiện tại
  const [sidebarOpenCount, setSidebarOpenCount] = useState(0)
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
      const url = getPreservedUrlShared('/shop-with-sidebar', searchParams, {}, ['categoryId', 'page'])
      router.push(url.pathname + url.search)
    } else {
      // Chọn danh mục mới
      setSelectedCategory(category)
      // Cập nhật URL với categoryId mới, reset page; preserve query còn lại
      const url = getPreservedUrlShared('/shop-with-sidebar', searchParams, { categoryId: categoryId.toString() }, ['page'])
      router.push(url.pathname + url.search)
    }
  }
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
  const clearAllFilters = () => {
    setSelectedCategory(null)
    // Xóa TẤT CẢ các tham số lọc/sort đã whitelist
    const url = new URL('/shop-with-sidebar', window.location.origin)
    Object.keys(allowedParams).forEach((key) => {
      url.searchParams.delete(key)
    })
    router.push(url.pathname + url.search)
  }

  const handleShowSearch = () => {
    const willOpen = !productSidebar
    setProductSidebar(willOpen)
    if (willOpen) {
      // Mỗi lần mở, tăng key để remount Sidebar -> các dropdown đọc URL hiện tại
      setSidebarOpenCount((n) => n + 1)
      // Đồng bộ selectedCategory theo URL hiện tại
      try {
        const categoryId = searchParams.get('categoryId')
        if (categoryId && categories.length > 0) {
          const category = categories.find(
            (cat) =>
              cat.id == categoryId || cat._id == categoryId || cat.categoryId == categoryId
          )
          setSelectedCategory(category || null)
        } else {
          setSelectedCategory(null)
        }
      } catch (err) {
        console.error('Lỗi đồng bộ danh mục theo URL khi mở sidebar:', err)
      }
    }
  }

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true)
    } else {
      setStickyMenu(false)
    }
  }
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
  const pathname = usePathname()
  // preload categories khi mount để tránh loading lâu khi mở sidebar
  useEffect(() => {
    fetchCategories()
  }, [])

  if (pathname === '/shop-with-sidebar') {
    return null
  }
  return (
    <>
      <div className={'z-[999999]'}>
        <div className="z-[9999999] lg:hidden w-full bg-white h-[56px] fixed bottom-0 border-t border-t-[#000] grid grid-cols-4">
          <button
            onClick={handleShowSearch}
            className="flex flex-col items-center justify-center col-span-1"
          >
            <div className={'relative w-[24px] h-[24px]'}>
              <Image
                src={'/images/icons/icon-search-black.svg'}
                alt={'search'}
                fill
              />
            </div>
            <span className="text-[13px] font-bold text-black">Tìm kiếm</span>
          </button>
          <Link
            href={'/store-information'}
            className="flex flex-col items-center justify-center col-span-1"
          >
            <div className={'relative w-[24px] h-[24px]'}>
              <Image src={'/images/icons/icon-shop.svg'} alt={'shop'} fill />
            </div>
            <span className="text-[13px] font-bold text-black">Cửa hàng</span>
          </Link>
          <Link
            href={'tel:0855382525'}
            className="flex flex-col items-center justify-center col-span-1"
          >
            <div className={'relative w-[24px] h-[24px]'}>
              <Image src={'/images/icons/icon-phone.svg'} alt={'phone'} fill />
            </div>
            <span className="text-[13px] font-bold text-black">
              0855.38.2525
            </span>
          </Link>
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center justify-center col-span-1"
          >
            <div className={'relative w-[24px] h-[24px]'}>
              <Image
                src={'/images/icons/icon-top.svg'}
                alt={'next-to-top'}
                fill
              />
            </div>
            <span className="text-[13px] font-bold text-black">Top</span>
          </button>
          <div className="z-[999999]">
            <Sidebar
              key={`sidebar-${sidebarOpenCount}`}
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
              // Khi dùng trong FooterMobile, yêu cầu mọi filter điều hướng về trang shop
              targetPath={'/shop-with-sidebar'}
            />
          </div>
        </div>
      </div>
    </>
  )
}
