'use client'
import React, { useState, useEffect } from 'react'
import HeroCarousel from './HeroCarousel'
import bannerService from '@/services/bannerService'

const Hero = () => {
  // State để quản lý banners và loading
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Effect để fetch banners khi component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await bannerService.getBanner()

        if (response.data.success && response.data.data?.content) {
          const bannerData = response.data.data.content.map(banner => ({
            id: banner.id,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl
          }))
          setBanners(bannerData)
        } else {
          setBanners([
            {
              id: 1,
              imageUrl: '/images/hero/banner.jpg',
              linkUrl: '/home'
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        setError(error)
        setBanners([
          {
            id: 1,
            imageUrl: '/images/hero/banner.jpg',
            linkUrl: '/home'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  return (
    <section className="overflow-hidden pt-[71px] lg:mt-[-23px] lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="relative overflow-hidden bg-white z-1">
              <HeroCarousel banners={banners} loading={loading} error={error} />
            </div>
          </div>
        </div>
      </div>
      {/*<HeroFeature/>*/}
    </section>
  )
}

export default Hero
