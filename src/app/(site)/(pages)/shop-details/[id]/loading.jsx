import React from 'react'

/**
 * Loading skeleton cho trang chi tiết sản phẩm
 * - Tận dụng cơ chế `app router` của Next.js: file `loading.jsx` hiển thị khi segment đang tải
 * - Thiết kế skeleton gần với layout thực tế để giảm cảm giác giật khi hydrate
 */
export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite">
      {/* Breadcrumb skeleton */}
      <section className="pt-5 lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="h-6 w-40 bg-gray-2 rounded animate-pulse" />
        </div>
      </section>

      {/* Nội dung chính skeleton */}
      <section className="relative pt-5 pb-20 overflow-hidden lg:pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            {/* Gallery skeleton */}
            <div className="lg:max-w-[570px] w-full">
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-row lg:flex-col gap-[8px] lg:gap-5 order-2 lg:order-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[60px] h-[60px] lg:w-20 lg:h-20 rounded-lg bg-gray-2 animate-pulse"
                    />
                  ))}
                </div>

                <div className="order-1 lg:order-2 relative z-1 overflow-hidden flex items-center justify-center w-full lg:minh-[512px] lg:min-h-[512px] bg-gray-2 rounded-lg shadow-1">
                  <div className="w-[80%] h-[80%] bg-gray-3 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Thông tin sản phẩm skeleton */}
            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-64 bg-gray-2 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-2 rounded animate-pulse" />
              </div>

              <div className="flex flex-col gap-4 p-6 mb-8 bg-gray-1 rounded-xl">
                <div className="h-6 w-40 bg-gray-2 rounded animate-pulse" />
                <div className="h-6 w-48 bg-gray-2 rounded animate-pulse" />
                <div className="h-6 w-56 bg-gray-2 rounded animate-pulse" />
              </div>

              <div className="mb-8">
                <div className="h-6 w-40 bg-gray-2 rounded mb-4 animate-pulse" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-5 w-32 bg-gray-2 rounded animate-pulse" />
                    <div className="h-5 w-40 bg-gray-2 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <div className="h-6 w-36 bg-gray-2 rounded mb-3 animate-pulse" />
                <div className="h-8 w-48 bg-gray-2 rounded mb-2 animate-pulse" />
                <div className="h-5 w-32 bg-gray-2 rounded animate-pulse" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="h-11 w-36 bg-gray-2 rounded-md animate-pulse" />
                <div className="h-11 w-44 bg-gray-2 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs skeleton */}
      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-6 w-28 bg-gray-2 rounded animate-pulse" />
            ))}
          </div>
          <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                <div className="max-w-[450px] min-w-[140px] w-full">
                  <div className="h-5 w-40 bg-gray-2 rounded animate-pulse" />
                </div>
                <div className="w-full">
                  <div className="h-5 w-3/4 bg-gray-2 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}


