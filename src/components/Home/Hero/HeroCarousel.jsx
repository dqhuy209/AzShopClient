'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css/pagination'
import 'swiper/css'
import Image from 'next/image'
import Link from 'next/link'

const HeroCarousel = ({ banners = [] }) => {
  // Kiểm tra nếu không có banner thì hiển thị loading hoặc fallback
  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-[550px] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Đang tải banner...</p>
      </div>
    )
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={banner.id || index}>
          <div className="flex items-center flex-col-reverse sm:flex-row">
            <div className="w-full h-[550px] lg:h-[600px] relative">
              {/* Banner luôn clickable: có linkUrl thì navigate đến đó, không có thì navigate đến home */}
              <Link href={banner.linkUrl && banner.linkUrl.trim() !== '' ? banner.linkUrl : '/'}>
                <Image
                  src={banner.imageUrl || '/images/hero/banner.jpg'}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-center lg:object-cover cursor-pointer transition-transform hover:scale-105"
                  priority={index === 0} // Ưu tiên load banner đầu tiên
                />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroCarousel
