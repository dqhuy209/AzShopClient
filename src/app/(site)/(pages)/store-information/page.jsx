import React from 'react'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Link from 'next/link'
import Image from 'next/image'

const StoreInformation = () => {
  return (
    <div>
      <Breadcrumb
        title={'Giới thiệu cửa hàng'}
        pages={['Giới thiệu cửa hàng']}
      />
      <div>
        <div className="w-full text-center mt-[20px]">
          <span className="text-2xl font-bold text-center">
            Địa chỉ cửa hàng
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-7.5">
          <Link
            target={'_blank'}
            href="https://www.facebook.com/groups/azshophn"
            className="flex items-center gap-2 pl-2 duration-200 ease-out text-dark hover:text-blue"
          >
            <Image
              src={'/images/icons/icon-group.png'}
              alt={'icon-group-facebook'}
              width={40}
              height={35}
            />
            <span className="text-black lg:hidden">Fanpage facebook</span>
          </Link>

          <Link
            target={'_blank'}
            href="https://www.facebook.com/AZShopHN168"
            className="flex items-center gap-2 pl-2 duration-200 ease-out text-dark hover:text-blue"
          >
            <Image
              src={'/images/icons/icon-facebook.png'}
              alt={'icon-cho-tot'}
              width={40}
              height={40}
            />
            <span className="text-black lg:hidden">FB cá nhân</span>
          </Link>
          <Link
            target={'_blank'}
            href="https://www.chotot.com/cua-hang-dien-tu/azshophn168"
            className="flex items-center gap-2 pl-2 duration-200 ease-out text-dark hover:text-blue"
          >
            <Image
              src={'/images/icons/icon-tot.png'}
              alt={'icon-cho-tot'}
              width={35}
              height={30}
              className="rounded-[10px]"
            />
            <span className="text-black lg:hidden">Cửa hàng chợ tốt</span>
          </Link>
          <Link
            target={'_blank'}
            href="https://www.tiktok.com/@azshop168hn"
            className="flex items-center gap-3 pl-2 duration-200 ease-out text-dark hover:text-blue"
          >
            <Image
              src={'/images/icons/tiktok.svg'}
              alt={'icon-tiktok'}
              width={30}
              height={30}
            />
            <span className="text-black lg:hidden">Tiktok</span>
          </Link>
          <Link
            target={'_blank'}
            href="https://zalo.me/0855382525"
            className="flex items-center gap-2 pl-2 duration-200 ease-out text-dark hover:text-blue"
          >
            <Image
              src={'/images/icons/Icon_of_Zalo.svg.webp'}
              alt={'icon-zalo'}
              width={35}
              height={30}
            />
            <span className="text-black lg:hidden">Zalo Chat</span>
          </Link>
        </div>
        <div className="w-full px-[15px] mt-[30px]">
          <span className="text-[16px] font-medium ">
            AzShop là hệ thống cửa hàng chuyên bán đồng hồ AppleWatch chính hãng.
          </span>
        </div>

        <div
          className="w-full flex items-center justify-center
         mx-auto my-[50px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4418.696262665472!2d105.80201397584051!3d20.988948189143635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbff6de7557%3A0x4dde2e8227c6b283!2zMWEgTmcuIDEyNCBOZ3V54buFbiBYaeG7g24sIEjhuqEgxJDDrG5oLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpIDEwMDAwLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1755231339023!5m2!1svi!2s"
            width={300}
            height={300}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="w-full px-[15px] mt-[30px]">
          <span className="text-[16px] font-medium ">
            Cam kết 100% hàng chính hãng. 100% chính hãng đền 1 tỷ nếu phát hiện
            hàng giả - hàng nhái (Đồng hồ bán ra có đầy đủ giấy tờ và phụ kiện
            đi kèm) Miễn phí vận chuyển (COD) toàn quốc Ship hàng nhanh chóng và
            hoàn toàn miễn phí khi mua hàng tại AzShop. 1 đổi 1 trong
            7 ngày Đổi mới trong vòng 7 ngày nếu có lỗi do nhà sản xuất. Chi
            tiết quý khách vui lòng liên hệ 0855382525
          </span>
        </div>
      </div>
    </div>
  )
}

export default StoreInformation
