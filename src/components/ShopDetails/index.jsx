'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import Image from 'next/image'
import { usePreviewSlider } from '@/app/context/PreviewSliderContext'
import { useDispatch } from 'react-redux'
import { updateproductDetails } from '@/redux/features/product-details'
import { addItemToCart } from '@/redux/features/cart-slice'
import { useAppSelector } from '@/redux/store'
import toast from 'react-hot-toast'

const ShopDetails = ({ product }) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items)

  const { openPreviewModal } = usePreviewSlider()
  const [previewImg, setPreviewImg] = useState(0)
  const [activePreview, setActivePreview] = useState(0)
  /**
   * Xây mảng media thống nhất cho gallery (video + ảnh)
   * - Video luôn ở đầu tiên để người dùng thấy ngay
   * - Mỗi phần tử có { type: 'image' | 'video', url: string }
   */
  const mediaItems = useMemo(() => {
    const videoItems = (product.videos || [])
      .filter(Boolean)
      .map((url) => ({ type: 'video', url }))
    const imageItems = (product.images || [])
      .filter(Boolean)
      .map((url) => ({ type: 'image', url }))
    return [...videoItems, ...imageItems]
  }, [product.images, product.videos])
  const dispatch = useDispatch()

  const tabs = [
    {
      id: 'tabOne',
      title: 'Mô tả sản phẩm',
    },
    {
      id: 'tabTwo',
      title: 'Thông tin chi tiết',
    },
  ]
  const [activeTab, setActiveTab] = useState('tabOne')

  // Đồng bộ activePreview với previewImg và khởi tạo mặc định
  useEffect(() => {
    setActivePreview(previewImg)
  }, [previewImg])

  /**
   * Mở modal preview slider CHỈ cho ảnh
   * - Tính chỉ số slide theo mảng ảnh (bỏ qua các phần tử video trong mediaItems)
   */
  const handlePreviewSlider = () => {
    // Nếu đang chọn video thì không mở slider
    const currentItem = mediaItems[activePreview]
    if (!currentItem || currentItem.type !== 'image') return

    // Tính index trong mảng ảnh dựa trên vị trí hiện tại trong mediaItems
    // Vì video ở đầu nên cần tính lại index
    const imageIndex =
      mediaItems.slice(0, activePreview + 1).filter((m) => m.type === 'image')
        .length - 1

    const productToPreview = {
      ...product,
      initialSlideIndex: imageIndex < 0 ? 0 : imageIndex,
    }
    dispatch(updateproductDetails(productToPreview))
    openPreviewModal()
  }
  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    // Nếu sản phẩm đã có, chỉ thông báo và không dispatch (bán 1 sản phẩm duy nhất)
    if (cartItems?.some((p) => p.id === product?.id)) {
      toast.error('Sản phẩm đã có trong giỏ hàng')
      return
    }
    dispatch(
      addItemToCart({
        ...product,
        quantity: 1,
      })
    )
    toast.success('Thêm sản phẩm vào giỏ hàng thành công')
  }


  if (!product || Object.keys(product).length === 0) {
    return (
      <>
        <Breadcrumb title={'Shop Details'} pages={['shop details']} />
        <section className="relative pt-5 pb-20 overflow-hidden lg:pt-20 xl:pt-28">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-lg text-gray-600">Không tìm thấy sản phẩm</p>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }


  return (
    <>
      <Breadcrumb title={'Shop Details'} pages={['shop details']} />
      <section className="relative pt-5 pb-20 overflow-hidden lg:pt-20 xl:pt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            <div className="lg:max-w-[570px] w-full">
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-row lg:flex-col gap-[8px] lg:gap-5 order-2 lg:order-1">
                  {mediaItems.map((item, key) => (
                    <button
                      onClick={() => {
                        setPreviewImg(key)
                        setActivePreview(key)
                      }}
                      key={key}
                      className={`relative flex items-center justify-center w-[60px] h-[60px] lg:w-20 lg:h-20  overflow-hidden rounded-lg bg-gray-2
                       ease-out duration-200 hover:border-2 hover:border-blue ${activePreview === key && 'border-2 border-blue'
                        }`}
                    >
                      {item.type === 'image' ? (
                        <Image
                          src={item.url || '/placeholder.jpg'}
                          alt="thumbnail"
                          width={61}
                          height={61}
                          className="object-cover aspect-square"
                        />
                      ) : (
                        <>
                          {/* Hiển thị poster frame thật của video */}
                          <video
                            className="object-cover w-full h-full aspect-square"
                            muted
                            playsInline
                            preload="metadata"
                          >
                            <source src={item.url} type="video/mp4" />
                          </video>
                          {/* Icon play để phân biệt video */}
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                fill="rgba(0,0,0,0.6)"
                              />
                              <path d="M10 8L16 12L10 16V8Z" fill="#fff" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="order-1 lg:order-2 relative z-1 overflow-hidden flex items-center justify-center w-full lg:minh-[512px] lg:min-h-[512px] bg-gray-2 rounded-lg shadow-1">
                  <div>
                    {/* Nút phóng to chỉ hiển thị khi đang ở ảnh */}
                    {mediaItems[activePreview]?.type === 'image' && (
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    )}

                    {mediaItems[activePreview]?.type === 'image' ? (
                      <Image
                        src={
                          mediaItems[activePreview]?.url ||
                          mediaItems.find((m) => m.type === 'image')?.url ||
                          '/placeholder.jpg'
                        }
                        alt="product-preview"
                        width={400}
                        height={400}
                        className="object-cover max-w-full max-h-full"
                      />
                    ) : (
                      <video
                        key={mediaItems[activePreview]?.url} // Thêm key để force re-render video
                        controls
                        className="object-contain max-w-full max-h-full"
                      >
                        <source
                          src={mediaItems[activePreview]?.url}
                          type="video/mp4"
                        />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    )}
                  </div>
                </div>
              </div>

              {/* Phần video đã được gom vào chung gallery ở trên */}
            </div>

            {/* <!-- product content --> */}
            <div className="max-w-[539px] w-full">
              {/* Tiêu đề và badge giảm giá */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold leading-tight sm:text-3xl xl:text-4xl text-dark">
                  {product.name || 'Tên sản phẩm'}
                </h2>
                {product.discountPercent > 0 && (
                  <div className="inline-flex px-4 py-2 text-base font-semibold text-white rounded-lg shadow-lg bg-red-light">
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thông tin cơ bản */}
              <div className="flex flex-col gap-4 p-6 mb-8 bg-gray-1 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-body">
                    Tình trạng:
                  </span>
                  <span className="px-3 py-1 text-base font-semibold rounded-full text-blue bg-blue-light-5">
                    {product.currentCondition || 'Không xác định'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-body">
                    Danh mục:
                  </span>
                  <span className="px-3 py-1 text-base font-semibold rounded-full text-green bg-green-light-6">
                    {product.categoryName || 'Chưa phân loại'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green"
                  >
                    <path
                      d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-base font-medium text-body">
                    Trạng thái:
                  </span>
                  <span className="text-base font-semibold text-green">
                    {product.statusDisplayName || 'Không xác định'}
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                {/* Phần giá */}
                <div className="mb-8">
                  <h4 className="mb-4 text-lg font-semibold text-dark">
                    Thông tin giá
                  </h4>

                  {/* Giá chính */}
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-3xl font-bold text-red">
                      {product.finalPrice?.toLocaleString('vi-VN') ||
                        product.sellingPrice?.toLocaleString('vi-VN') ||
                        0}{' '}
                      ₫
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="text-lg font-medium line-through text-meta-4">
                        {product.sellingPrice?.toLocaleString('vi-VN') || 0} ₫
                      </span>
                    )}
                  </div>

                  {/* Tiết kiệm */}
                  {product.discountPercent > 0 && (
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded bg-green-light-6 text-green">
                      Tiết kiệm{' '}
                      {(
                        (product.sellingPrice || 0) - (product.finalPrice || 0)
                      ).toLocaleString('vi-VN')}{' '}
                      ₫
                    </div>
                  )}
                </div>
                {/* Nút hành động */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-3 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark"
                  >
                    Mua ngay
                  </a>
                  <button
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center px-8 py-3 font-medium duration-200 ease-out bg-white border rounded-md text-blue border-blue hover:bg-gray-1"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* <!--== tab header start ==--> */}
          <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${activeTab === item.id
                  ? 'text-blue before:w-full'
                  : 'text-dark before:w-0'
                  }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* <!--== tab header end ==--> */}

          {/* <!--== tab content start ==--> */}
          {/* <!-- tab content one start --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5  ${activeTab === 'tabOne' ? 'flex' : 'hidden'
                }`}
            >
              <div className="w-full p-4 mt-10 bg-white rounded-lg sm:p-6">
                <h2 className="text-2xl font-medium text-dark mb-7">
                  Mô tả chi tiết:
                </h2>
                {product.description ? (
                  <p className="mb-6">{product.description}</p>
                ) : (
                  <p className="mb-6">
                    Chưa có mô tả chi tiết cho sản phẩm này.
                  </p>
                )}
              </div>


            </div>
          </div>
          {/* <!-- tab content one end --> */}

          {/* <!-- tab content two start --> */}
          <div>
            <div
              className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${activeTab === 'tabTwo' ? 'block' : 'hidden'
                }`}
            >
              {/* Thông tin sản phẩm chi tiết */}


              <div className="space-y-0">
                {/* Kích cỡ màn hình */}
                {product.screenSize && (
                  <div className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm font-medium sm:text-base text-dark">
                        Kích cỡ màn hình:
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-body">
                        {product.screenSize}
                      </p>
                    </div>
                  </div>
                )}

                {/* Chất liệu vỏ */}
                {product.caseMaterial && (
                  <div className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm font-medium sm:text-base text-dark">
                        Chất liệu vỏ:
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-body">
                        {product.caseMaterial}
                      </p>
                    </div>
                  </div>
                )}

                {/* Màu sắc */}
                {product.color && (
                  <div className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm font-medium sm:text-base text-dark">
                        Màu sắc:
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-body">
                        {product.color}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phiên bản */}
                {product.version && (
                  <div className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm font-medium sm:text-base text-dark">
                        Phiên bản:
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-body">
                        {product.version}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dòng máy */}
                {product.modelV1 && (
                  <div className="flex px-4 py-4 rounded-md even:bg-gray-1 sm:px-5">
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm font-medium sm:text-base text-dark">
                        Dòng máy:
                      </p>
                    </div>
                    <div className="w-full">
                      <p className="text-sm sm:text-base text-body">
                        {product.modelV1}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hiển thị thông báo nếu không có thông tin */}
                {!product.screenSize && !product.caseMaterial && !product.color && !product.version && !product.modelV1 && (
                  <div className="py-8 text-center">
                    <p className="text-base text-meta-4">
                      Chưa có thông tin chi tiết cho sản phẩm này.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <!-- tab content two end --> */}
        </div>
      </section>
    </>
  )
}

export default ShopDetails
