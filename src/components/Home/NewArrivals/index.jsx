"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import productService from "@/services/productService";

import shopData from "@/components/Shop/shopData";

const NewArrival = () => {
  // State để lưu thông tin chi tiết sản phẩm
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const limit = 8;

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await productService.getListProductsNewArrivals(limit);
        console.log(response.data.data)
        setProductDetail(response.data.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, []);
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
          {/* <!-- New Arrivals item --> */}
          {loading ? (
            // Loading skeleton
            Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 mb-3 bg-gray-200 rounded-lg"></div>
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : productDetail && productDetail.length > 0 ? (
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
  );
};

export default NewArrival;
