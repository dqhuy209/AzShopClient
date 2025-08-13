import React from 'react'
import Link from 'next/link'
import ProductItem from '@/components/Common/ProductItem'
import productService from '@/services/productService'

const limit = 8

export default async function NewArrival() {
  let productDetail = []
  try {
    const response = await productService.getListProductsNewArrivals(limit)
    productDetail = response.data.data
  } catch (error) {
    console.error('Error fetching product detail:', error)
  }

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl font-semibold xl:text-heading-5 text-dark">
              Hàng mới về
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
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
      </div>
    </section>
  )
}
