'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import productService from '@/services/productService'
import Image from 'next/image'
import ProductItem from '@/components/Common/ProductItem'

export default function BestSeller() {
  // State để lưu trữ danh sách sản phẩm và trạng thái loading
  const [productDetail, setProductDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dữ liệu sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await productService.getListProducts({
          limit: 8,
          isLatest: false,
          isFeatured: true,
        })

        setProductDetail(response.data.data.content)
      } catch (error) {
        console.error('Error fetching best seller products:', error)
        setError('Không thể tải danh sách sản phẩm bán chạy')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, []) // Chỉ chạy một lần khi component mount

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="flex items-center justify-between mb-10">
          <div className={'flex items-center gap-x-[10px]'}>
            <div>
              <Image
                src={'/images/icons/icon-fire.svg'}
                alt={'icon-fire'}
                width={65}
                height={65}
                className="blink-icon"
              />
            </div>
            <h2 className="text-xl font-semibold xl:text-heading-5 text-dark">
              Bán chạy nhất
            </h2>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[10px] lg:gap-7.5">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 mb-3 bg-gray-200 rounded-lg"></div>
                <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="py-8 text-center col-span-full">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[10px] lg:gap-7.5">
            {productDetail && productDetail.length > 0 ? (
              productDetail.map((product, id) => (
                <ProductItem item={product} key={product.id || id} />
              ))
            ) : (
              <div className="py-8 text-center col-span-full">
                <p className="text-gray-500">Không có sản phẩm bán chạy nào</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12.5">
          <Link
            href="/shop-with-sidebar?isFeatured=true"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  )
}
