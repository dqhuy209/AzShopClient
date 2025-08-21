import React from 'react'
import SingleItem from './SingleItem'
import Link from 'next/link'
import productService from '@/services/productService'
import Image from 'next/image'
import ProductItem from '@/components/Common/ProductItem'

export default async function BestSeller() {
  let productDetail = []
  try {
    const response = await productService.getListProducts({
      limit: 8,
      isLatest: false,
      isFeatured: true,
    })
    productDetail = response.data.data.content
  } catch (error) {
    console.error('Error fetching best seller products:', error)
  }
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
