'use client'
import React, { useEffect, useState, useMemo } from 'react'

import { useModalContext } from '@/app/context/QuickViewModalContext'
import { useAppSelector } from '@/redux/store'
import { addItemToCart } from '@/redux/features/cart-slice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { usePreviewSlider } from '@/app/context/PreviewSliderContext'
import { updateproductDetails } from '@/redux/features/product-details'
import { resetQuickView } from '@/redux/features/quickView-slice'
import productService from '@/services/productService'
import { formatVNDRounded } from '@/utils/formatCurrency'

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext()
  const { openPreviewModal, isModalPreviewOpen } = usePreviewSlider()
  const [quantity, setQuantity] = useState(1)
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)

  const dispatch = useDispatch()

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value)

  const [activePreview, setActivePreview] = useState(0)

  /**
   * Xây mảng media thống nhất cho gallery (video + ảnh)
   * - Video luôn ở đầu tiên để người dùng thấy ngay
   * - Mỗi phần tử có { type: 'image' | 'video', url: string }
   */
  const mediaItems = useMemo(() => {
    const displayProduct = productData || product
    const videoItems = (displayProduct?.videos || [])
      .filter(Boolean)
      .map((url) => ({ type: 'video', url }))
    const imageItems = (displayProduct?.images || [])
      .filter(Boolean)
      .map((url) => ({ type: 'image', url }))
    return [...videoItems, ...imageItems]
  }, [productData, product])

  // Handle close modal with proper cleanup
  const handleCloseModal = () => {
    closeModal()
    dispatch(resetQuickView())
    setProductData(null)
    setActivePreview(0)
    setQuantity(1)
    setCurrentProductId(null)
  }

  // fetch product details when modal opens
  useEffect(() => {
    if (isModalOpen && product?.id) {
      // Only fetch if this is a different product
      if (currentProductId !== product.id) {
        // Reset states when opening modal for new product
        setActivePreview(0)
        setQuantity(1)
        setProductData(null)
        setCurrentProductId(product.id)
        fetchProductDetails()
      }
    }
  }, [isModalOpen, product?.id, currentProductId])

  const fetchProductDetails = async () => {
    if (!product?.id) return

    try {
      setLoading(true)
      const response = await productService.productDetails(product.id)
      if (response.data?.success) {
        // Only update if this is still the current product
        if (currentProductId === product.id) {
          setProductData(response.data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setLoading(false)
    }
  }

  // preview modal - chỉ cho ảnh
  const handlePreviewSlider = () => {
    // Nếu đang chọn video thì không mở slider
    const currentItem = mediaItems[activePreview]
    if (!currentItem || currentItem.type !== 'image') return

    // Tính index trong mảng ảnh dựa trên vị trí hiện tại trong mediaItems
    // Vì video ở đầu nên cần tính lại index
    const imageIndex = mediaItems
      .slice(0, activePreview + 1)
      .filter((m) => m.type === 'image').length - 1

    const productToPreview = {
      ...(productData || product),
      initialSlideIndex: imageIndex < 0 ? 0 : imageIndex,
    }
    dispatch(updateproductDetails(productToPreview))
    openPreviewModal()
  }

  // add to cart
  const cartItems = useAppSelector((state) => state.cartReducer.items)

  const handleAddToCart = () => {
    const productToAdd = productData || product
    if (cartItems?.some((p) => p.id === productToAdd?.id)) {
      toast.error('Sản phẩm đã có trong giỏ hàng')
      return
    }
    dispatch(
      addItemToCart({
        id: productToAdd.id,
        name: productToAdd.name,
        price: productToAdd.sellingPrice,
        finalPrice: productToAdd.finalPrice,
        images: productToAdd.images,
        quantity,
      })
    )

    // Thông báo thành công khi thêm vào giỏ hàng từ QuickView
    toast.success('Đã thêm vào giỏ hàng')

    handleCloseModal()
  }

  useEffect(() => {
    // closing modal while clicking outside, nhưng không đóng khi PreviewSlider đang mở
    function handleClickOutside(event) {
      // Không đóng QuickViewModal nếu PreviewSlider đang mở
      if (isModalPreviewOpen) {
        return
      }

      // Không đóng nếu click vào preview-slider element
      if (event.target.closest('.preview-slider')) {
        return
      }

      if (!event.target.closest('.modal-content')) {
        handleCloseModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Clean up when component unmounts or modal closes
      if (!isModalOpen) {
        setQuantity(1)
        setProductData(null)
        setActivePreview(0)
        setCurrentProductId(null)
      }
    }
  }, [isModalOpen, closeModal, isModalPreviewOpen])

  const displayProduct = productData || product

  return (
    <div
      className={`${isModalOpen ? 'z-50' : 'hidden'
        } fixed inset-0 flex items-center justify-center p-4 bg-dark/70 z-9999`}
    >
      <div className="w-full max-w-[1100px] h-[600px] rounded-xl shadow-3 bg-white p-6 sm:p-8 relative modal-content">
        <button
          onClick={() => handleCloseModal()}
          aria-label="button for close modal"
          className="absolute z-10 flex items-center justify-center w-10 h-10 text-gray-600 duration-150 ease-in bg-gray-100 rounded-full top-2 right-2 hover:bg-red hover:text-white"
        >
          <svg
            className="fill-current"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
              fill=""
            />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-blue"></div>
          </div>
        ) : (
          <div className="flex gap-12.5 h-full">
            {/* Phần ảnh bên trái - lấp đầy toàn bộ chiều cao */}
            <div className="w-[526px] flex-shrink-0 h-full">
              <div className="flex h-full gap-5">
                <div className="flex flex-col gap-5">
                  {mediaItems.map((item, key) => (
                    <button
                      onClick={() => setActivePreview(key)}
                      key={key}
                      className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${activePreview === key && 'border-2 border-blue'
                        }`}
                    >
                      {item.type === 'video' ? (
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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.6)" />
                              <path d="M10 8L16 12L10 16V8Z" fill="#fff" />
                            </svg>
                          </span>
                        </>
                      ) : (
                        <Image
                          src={item.url || '/next.svg'}
                          alt="thumbnail"
                          width={61}
                          height={61}
                          className="object-cover aspect-square"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center justify-center flex-1 w-full overflow-hidden border rounded-lg z-1 bg-gray-1 border-gray-3">
                  <div>
                    {/* Nút phóng to chỉ hiển thị khi đang ở ảnh */}
                    {mediaItems[activePreview]?.type === 'image' && (
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-10 h-10 rounded-[5px] bg-white shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-8 right-4 lg:right-8 z-50"
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

                    {mediaItems[activePreview]?.type === 'video' ? (
                      <video
                        key={mediaItems[activePreview]?.url} // Thêm key để force re-render video
                        controls
                        className="object-contain max-w-full max-h-full"
                      >
                        <source src={mediaItems[activePreview]?.url} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    ) : (
                      <Image
                        src={
                          mediaItems[activePreview]?.url || '/next.svg'
                        }
                        alt="product-preview"
                        width={400}
                        height={400}
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Phần thông tin bên phải - scroll trong không gian cố định */}
            <div className="flex-1 max-w-[445px] w-full space-y-5 overflow-y-auto h-full">
              {/* Discount Badge */}
              {displayProduct?.discountPercent > 0 && (
                <div className="inline-flex items-center">
                  <span className="inline-block px-3 py-1 text-xs font-bold text-white rounded-lg shadow-md bg-red">
                    GIẢM {displayProduct.discountPercent}%
                  </span>
                </div>
              )}

              {/* Product Title */}
              <h3 className="text-2xl font-bold leading-tight text-dark">
                {displayProduct?.name || 'Tên sản phẩm'}
              </h3>

              {/* Product Info */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 border rounded-full border-green-light-2 bg-green-50">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_375_9221)">
                      <path
                        d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                        fill="#22AD5C"
                      />
                      <path
                        d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                        fill="#22AD5C"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_375_9221">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-sm text-[#22AD5C]">
                    {displayProduct?.currentCondition || 'Nguyên seal'}
                  </span>
                </div>

                {displayProduct?.categoryName && (
                  <div className="flex items-center gap-2 px-3 py-1 border rounded-full border-blue">
                    <span className="text-sm font-medium text-blue">
                      {displayProduct.categoryName}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {displayProduct?.description && (
                <div className="p-4 border-l-4 rounded-lg border-blue">
                  <p className="text-base leading-relaxed text-dark-2">
                    {displayProduct.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {(displayProduct?.screenSize || displayProduct?.caseMaterial || displayProduct?.color || displayProduct?.version || displayProduct?.modelV1) && (
                <div className="rounded-lg bg-gray-50 border-blue">
                  <h4 className="flex items-center gap-2 mb-3 text-lg font-bold text-dark">
                    <svg
                      className="w-5 h-5 text-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Thông tin sản phẩm
                  </h4>
                  <div className="space-y-3">
                    {/* Kích cỡ màn hình */}
                    {displayProduct.screenSize && (
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md">
                        <span className="font-medium text-dark-2">
                          Kích cỡ màn hình
                        </span>
                        <span className="px-3 py-1 font-medium rounded bg-gray-50 text-dark">
                          {displayProduct.screenSize}
                        </span>
                      </div>
                    )}

                    {/* Chất liệu vỏ */}
                    {displayProduct.caseMaterial && (
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md">
                        <span className="font-medium text-dark-2">
                          Chất liệu vỏ
                        </span>
                        <span className="px-3 py-1 font-medium rounded bg-gray-50 text-dark">
                          {displayProduct.caseMaterial}
                        </span>
                      </div>
                    )}

                    {/* Màu sắc */}
                    {displayProduct.color && (
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md">
                        <span className="font-medium text-dark-2">
                          Màu sắc
                        </span>
                        <span className="px-3 py-1 font-medium rounded bg-gray-50 text-dark">
                          {displayProduct.color}
                        </span>
                      </div>
                    )}

                    {/* Phiên bản */}
                    {displayProduct.version && (
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md">
                        <span className="font-medium text-dark-2">
                          Phiên bản
                        </span>
                        <span className="px-3 py-1 font-medium rounded bg-gray-50 text-dark">
                          {displayProduct.version}
                        </span>
                      </div>
                    )}

                    {/* Dòng máy */}
                    {displayProduct.modelV1 && (
                      <div className="flex items-center justify-between px-3 py-2 bg-white rounded-md">
                        <span className="font-medium text-dark-2">
                          Dòng máy
                        </span>
                        <span className="px-3 py-1 font-medium rounded bg-gray-50 text-dark">
                          {displayProduct.modelV1}
                        </span>
                      </div>
                    )}

                    {/* Hiển thị thông báo nếu không có thông tin */}
                    {!displayProduct.screenSize && !displayProduct.caseMaterial && !displayProduct.color && !displayProduct.version && !displayProduct.modelV1 && (
                      <div className="px-3 py-2 text-center">
                        <span className="text-sm text-meta-4">
                          Chưa có thông tin chi tiết cho sản phẩm này
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-dark">Giá bán</h4>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold text-red">
                    {formatVNDRounded.thousands(
                      displayProduct?.finalPrice ||
                      displayProduct?.sellingPrice ||
                      displayProduct.discountedPrice
                    )}
                  </span>
                  {displayProduct?.discountPercent > 0 && (
                    <span className="text-lg font-medium text-gray-500 line-through">
                      {formatVNDRounded.thousands(displayProduct.sellingPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => handleAddToCart()}
                  className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-white transition-colors duration-200 ease-out rounded-lg shadow-lg bg-gradient-to-r from-blue to-blue-light hover:from-blue-dark hover:to-blue-light"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7"
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickViewModal
