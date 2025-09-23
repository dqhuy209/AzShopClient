'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductItem from '@/components/Common/ProductItem'
import productService from '@/services/productService'
import Image from 'next/image'
import './index.css'

export default function NewArrival() {
  const [productDetail, setProductDetail] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await productService.getListProducts({
          limit: 12,
          // isLatest: true,
          // isFeatured: true,
        })

        setProductDetail(response.data.data.content)
      } catch (error) {
        console.error('Error fetching product detail:', error)
        setError('Không thể tải danh sách sản phẩm')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="flex items-center justify-between mb-7">
          <div className={'flex items-center gap-x-[10px]'}>
            <div className="img-blink-wrapper">
              <Image
                src={'/images/icons/icon-new.svg'}
                alt={'icon-new'}
                width={55}
                height={55}
                className={'blink-icon'}
              />
            </div>
            <h2 className="text-xl font-semibold xl:text-heading-5 text-dark">
              Hàng mới về
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar?isLatest=true"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[10px] lg:gap-x-7.5 gap-y-9">
            {[...Array(8)].map((_, index) => (
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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[10px] lg:gap-x-7.5 gap-y-9">
            {productDetail && productDetail.length > 0 ? (
              productDetail.map((product, id) => (
                <ProductItem item={product} key={product.id || id} />
              ))
            ) : (
              <div className="py-8 text-center col-span-full">
                <p className="text-gray-500">Không có sản phẩm mới nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
