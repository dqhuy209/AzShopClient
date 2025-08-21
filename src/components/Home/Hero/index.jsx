import React from 'react'
import HeroCarousel from './HeroCarousel'
import bannerService from '@/services/bannerService'

const Hero = async () => {
  let banners = []

  try {
    // Call API banner ở đây - Server Side
    const response = await bannerService.getBanner()

    // Kiểm tra response và extract data cần thiết
    if (response.data.success && response.data.data?.content) {
      // Chỉ lấy imageUrl và linkUrl từ mỗi banner
      banners = response.data.data.content.map(banner => ({
        id: banner.id,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl
      }))
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
    // Fallback về banner mặc định nếu API lỗi
    banners = [
      {
        id: 1,
        imageUrl: '/images/hero/banner.jpg',
        linkUrl: '/home'
      }
    ]
  }


  return (
    <section className="overflow-hidden pt-[71px] lg:mt-[-23px] lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="relative overflow-hidden bg-white z-1">
              <HeroCarousel banners={banners} />
            </div>
          </div>
        </div>
      </div>
      {/*<HeroFeature/>*/}
    </section>
  )
}

export default Hero
