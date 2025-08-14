'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css/pagination'
import 'swiper/css'

import Image from 'next/image'

const HeroCarousal = () => {
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
      className="hero-carousel "
    >
      {[1, 2].map((item, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center flex-col-reverse sm:flex-row">
            <div className={'w-full h-[550px] lg:h-[600px]'}>
              <Image
                src="/images/hero/banner.jpg"
                alt="headphone"
                fill
                className={'object-center lg:object-cover'}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroCarousal
