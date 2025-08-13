import React from 'react'
import HeroCarousel from './HeroCarousel'
import HeroFeature from './HeroFeature'
import Image from 'next/image'

const Hero = () => {
    return (
        <section
            className="overflow-hidden  pt-[10.5rem] sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4] mt-[-23px]">
            <div className="w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="flex flex-wrap gap-5">
                    <div className=" w-full">
                        <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
                            <HeroCarousel/>
                        </div>
                    </div>
                </div>
            </div>
            {/*<HeroFeature/>*/}
        </section>
    )
}

export default Hero
