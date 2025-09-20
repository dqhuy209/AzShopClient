'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css'
import Image from 'next/image'
import Link from 'next/link'

const HeroCarousel = ({ banners = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 sm:text-base">Đang tải banner...</p>
        </div>
      </div>
    )
  }

  // Hiển thị error state nếu có lỗi
  if (error) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-4xl text-red-500">⚠️</div>
          <p className="mb-2 text-sm text-gray-600 sm:text-base">Không thể tải banner</p>
          <p className="text-xs text-gray-400">Đang hiển thị banner mặc định</p>
        </div>
      </div>
    )
  }

  // Kiểm tra nếu không có banner thì hiển thị fallback
  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] bg-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-500 sm:text-base">Không có banner nào</p>
      </div>
    )
  }

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      modules={[Autoplay, Pagination, Navigation]}
      className="relative w-full hero-carousel"
      // Responsive breakpoints
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        1280: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        1500: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        1920: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      }}
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={banner.id || index} className="w-full">
          <div className="flex flex-col-reverse items-center w-full sm:flex-row">
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] relative">
              <Link
                href={
                  banner.linkUrl && banner.linkUrl.trim() !== ''
                    ? banner.linkUrl
                    : '/'
                }
                className="block w-full h-full"
              >
                <Image
                  src={banner.imageUrl || '/images/hero/banner.jpg'}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover object-center w-full h-full transition-transform duration-300 cursor-pointer sm:object-center md:object-center lg:object-center xl:object-center 2xl:object-center"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, (max-width: 1500px) 100vw, 100vw"
                />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* Phần tử pagination để Swiper gắn UI bullets (đặt ở đáy, giữa) */}
      <div className="swiper-pagination !bottom-3 left-1/2 -translate-x-1/2" />
    </Swiper>
  )
}

export default HeroCarousel
