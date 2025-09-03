'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import React, { useCallback, useRef, useEffect, useState } from 'react'
import 'swiper/css/navigation'
import 'swiper/css'
import Image from 'next/image'

import { usePreviewSlider } from '@/app/context/PreviewSliderContext'
import { useAppSelector } from '@/redux/store'
import { ZoomAbleImage } from '@/components/Common/TransformWrapper'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider()

  const data = useAppSelector((state) => state.productDetailsReducer.value)

  const sliderRef = useRef(null)

  // State cho desktop zoom (giữ nguyên logic cũ)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Ngăn scroll trang khi modal mở
  useEffect(() => {
    if (isModalPreviewOpen) {
      // Lưu trạng thái scroll hiện tại
      const scrollY = window.scrollY

      // Thêm class overflow-hidden để ngăn scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      // Cleanup function để khôi phục scroll khi modal đóng
      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        // Khôi phục vị trí scroll
        window.scrollTo(0, scrollY)
      }
    }
  }, [isModalPreviewOpen])

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return
    sliderRef.current.swiper.slidePrev()
    // Reset pan khi chuyển slide
    setPanPosition({ x: 0, y: 0 })
  }, [])

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return
    sliderRef.current.swiper.slideNext()
    // Reset pan khi chuyển slide
    setPanPosition({ x: 0, y: 0 })
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 0.5)
      // Reset pan position when zooming out to normal
      if (newZoom <= 1) {
        setPanPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }, [])

  // Helper function để tính toán giới hạn pan dựa trên zoom level
  const calculatePanLimits = useCallback((zoom) => {
    // Khi zoom càng cao, cho phép pan xa hơn để xem được toàn bộ ảnh
    const baseLimit = 300
    return baseLimit * Math.max(0, zoom - 1)
  }, [])

  // Mouse drag handlers để di chuyển trong ảnh khi zoom
  const handleMouseDown = useCallback(
    (e) => {
      if (zoomLevel > 1) {
        e.preventDefault()
        e.stopPropagation() // Ngăn Swiper nhận event
        setIsDragging(true)
        setDragStart({
          x: e.clientX - panPosition.x,
          y: e.clientY - panPosition.y,
        })

        // Disable Swiper completely khi bắt đầu drag
        if (sliderRef.current) {
          sliderRef.current.swiper.allowTouchMove = false
          sliderRef.current.swiper.allowSlideNext = false
          sliderRef.current.swiper.allowSlidePrev = false
        }
      }
    },
    [zoomLevel, panPosition]
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && zoomLevel > 1) {
        e.preventDefault()
        e.stopPropagation() // Ngăn Swiper nhận event
        // Calculate new position
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Sử dụng helper function để tính giới hạn
        const maxPan = calculatePanLimits(zoomLevel)

        const constrainedX = Math.max(-maxPan, Math.min(maxPan, newX))
        const constrainedY = Math.max(-maxPan, Math.min(maxPan, newY))

        setPanPosition({
          x: constrainedX,
          y: constrainedY,
        })
      }
    },
    [isDragging, dragStart, zoomLevel, calculatePanLimits]
  )

  const handleMouseUp = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation() // Ngăn Swiper nhận event
        setIsDragging(false)

        // Re-enable Swiper chỉ khi zoom level = 1
        if (sliderRef.current) {
          const shouldEnableSwiper = zoomLevel <= 1
          sliderRef.current.swiper.allowTouchMove = shouldEnableSwiper
          sliderRef.current.swiper.allowSlideNext = shouldEnableSwiper
          sliderRef.current.swiper.allowSlidePrev = shouldEnableSwiper
        }
      }
    },
    [isDragging, zoomLevel]
  )

  // Handle close modal properly
  const handleCloseModal = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      closePreviewModal()
    },
    [closePreviewModal]
  )

  // Set initial slide khi modal mở hoặc data thay đổi
  useEffect(() => {
    if (
      isModalPreviewOpen &&
      sliderRef.current &&
      data?.initialSlideIndex !== undefined
    ) {
      // Đảm bảo swiper đã được khởi tạo
      const timer = setTimeout(() => {
        if (sliderRef.current && sliderRef.current.swiper) {
          sliderRef.current.swiper.slideTo(data.initialSlideIndex, 0)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isModalPreviewOpen, data?.initialSlideIndex, data?.id]) // Thêm data.id để trigger khi product thay đổi

  // Reset zoom và pan khi modal đóng
  useEffect(() => {
    if (!isModalPreviewOpen) {
      setZoomLevel(1)
      setPanPosition({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }, [isModalPreviewOpen])

  // Add mouse event listeners
  useEffect(() => {
    if (isModalPreviewOpen) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isModalPreviewOpen, handleMouseMove, handleMouseUp])

  // Control Swiper based on zoom level
  useEffect(() => {
    if (sliderRef.current) {
      const shouldEnableSwiper = zoomLevel <= 1
      sliderRef.current.swiper.allowTouchMove = shouldEnableSwiper
      sliderRef.current.swiper.allowSlideNext = shouldEnableSwiper
      sliderRef.current.swiper.allowSlidePrev = shouldEnableSwiper
    }
  }, [zoomLevel])

  return (
    <div
      className={`preview-slider w-full h-screen z-[99999] inset-0 flex justify-center items-center bg-black bg-opacity-90 ${
        isModalPreviewOpen ? 'fixed' : 'hidden'
      }`}
      onMouseDown={(e) => {
        // Ngăn background clicks khi zoom
        if (zoomLevel > 1 && !e.target.closest('.image-container')) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleCloseModal}
        aria-label="Close preview"
        className="absolute z-50 flex items-center justify-center w-12 h-12 text-white duration-150 ease-in bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
      >
        <svg
          className="fill-current"
          width="24"
          height="24"
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

      {/* Zoom Controls - chỉ hiển thị trên desktop */}
      <div className="absolute z-50 flex-col hidden gap-2 top-4 left-4 lg:flex">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="flex items-center justify-center w-12 h-12 text-white duration-150 ease-in bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="flex items-center justify-center w-12 h-12 text-white duration-150 ease-in bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          onClick={handleZoomReset}
          aria-label="Reset zoom"
          className="flex items-center justify-center w-12 h-12 text-xs font-bold text-white duration-150 ease-in bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
        >
          1:1
        </button>
      </div>

      {/* Navigation Buttons - chỉ hiện khi không zoom và chỉ trên desktop */}
      {zoomLevel <= 1 && (
        <>
          <button
            className="absolute z-40 hidden p-3 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full cursor-pointer left-16 top-1/2 hover:bg-opacity-70 lg:block"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="absolute z-40 hidden p-3 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full cursor-pointer right-4 top-1/2 hover:bg-opacity-70 lg:block"
            onClick={handleNext}
            aria-label="Next image"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center w-full h-full max-w-6xl p-4 overflow-hidden">
        <Swiper
          key={`${data?.id}-${data?.initialSlideIndex}`} // Force re-render when product or slide changes
          ref={sliderRef}
          slidesPerView={1}
          spaceBetween={20}
          loop={false} // Tạm tắt loop để test
          className="w-full h-full"
          allowTouchMove={zoomLevel <= 1} // Disable swipe when zoomed
          touchMoveStopPropagation={zoomLevel > 1} // Prevent touch interference when panning
          simulateTouch={zoomLevel <= 1} // Disable simulate touch when zoomed
          grabCursor={zoomLevel <= 1} // Disable grab cursor when zoomed
          initialSlide={data?.initialSlideIndex || 0} // Set initial slide directly
        >
          {data?.images && data.images.length > 0 ? (
            data.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center w-full h-full overflow-hidden">
                  <div
                    className="relative w-full flex justify-center items-center h-full max-w-4xl transition-transform duration-200 ease-in-out select-none image-container max-h-4xl"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                      cursor:
                        zoomLevel > 1
                          ? isDragging
                            ? 'grabbing'
                            : 'grab'
                          : 'default',
                      transitionDuration: isDragging ? '0ms' : '200ms', // Smooth transition khi không drag
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={(e) => {
                      // Ngăn touch events khi zoom để tránh conflict với Swiper
                      if (zoomLevel > 1) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                    }}
                  >
                    <TransformWrapper
                      defaultScale={1}
                      doubleClick={{ disabled: true }}
                      wheel={{ disabled: true }}
                      pinch={{ disabled: false }}
                    >
                      <TransformComponent>
                        <img
                          src={image || '/next.svg'}
                          alt={`${data.name || 'Product'} image ${index + 1}`}
                          className="object-contain pointer-events-none my-auto  lg:hidden"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                    <Image
                      src={image || '/next.svg'}
                      alt={`${data.name || 'Product'} image ${index + 1}`}
                      className="object-contain pointer-events-none hidden lg:block"
                      fill
                      quality={100}
                      priority={index === (data.initialSlideIndex || 0)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      draggable={false}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : // Fallback to legacy imgs structure if new images array is not available
          data?.imgs?.previews && data.imgs.previews.length > 0 ? (
            data.imgs.previews.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center w-full h-full overflow-hidden">
                  <div
                    className="relative w-full h-full max-w-4xl transition-transform duration-200 ease-in-out image-container max-h-4xl"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                      cursor:
                        zoomLevel > 1
                          ? isDragging
                            ? 'grabbing'
                            : 'grab'
                          : 'default',
                      transitionDuration: isDragging ? '0ms' : '200ms', // Smooth transition khi không drag
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={(e) => {
                      // Ngăn touch events khi zoom để tránh conflict với Swiper
                      if (zoomLevel > 1) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                    }}
                  >
                    <Image
                      src={image || '/next.svg'}
                      alt={`${data.title || 'Product'} image ${index + 1}`}
                      fill
                      className="object-contain pointer-events-none"
                      quality={100}
                      priority={index === (data.initialSlideIndex || 0)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      draggable={false}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            // Ultimate fallback
            <SwiperSlide>
              <div className="flex items-center justify-center w-full h-full overflow-hidden">
                <div
                  className="relative w-full h-full max-w-4xl transition-transform duration-200 ease-in-out image-container max-h-4xl"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                    cursor:
                      zoomLevel > 1
                        ? isDragging
                          ? 'grabbing'
                          : 'grab'
                        : 'default',
                    transitionDuration: isDragging ? '0ms' : '200ms', // Smooth transition khi không drag
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={(e) => {
                    // Ngăn touch events khi zoom để tránh conflict với Swiper
                    if (zoomLevel > 1) {
                      e.preventDefault()
                      e.stopPropagation()
                    }
                  }}
                >
                  <Image
                    src="/next.svg"
                    alt="Product image"
                    fill
                    className="object-contain pointer-events-none"
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    draggable={false}
                  />
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  )
}

export default PreviewSliderModal
