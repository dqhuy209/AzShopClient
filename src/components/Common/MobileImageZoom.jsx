'use client'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Image from 'next/image'

/**
 * Component xử lý zoom ảnh cho mobile sử dụng thư viện react-medium-image-zoom
 * Hỗ trợ pinch zoom và pan mượt mà trên mobile
 */
const MobileImageZoom = ({ image, alt, priority = false, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" }) => {
  return (
    <Zoom
      // Cấu hình cho mobile
      openText="Phóng to"
      closeText="Đóng"
      // Tùy chỉnh style cho mobile
      classDialog="mobile-zoom-dialog"
      // Tùy chỉnh animation
      transitionDuration={200}
      // Tùy chỉnh zoom limits
      zoomMargin={40}
      // Tùy chỉnh style cho ảnh
      wrapStyle={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      // Tùy chỉnh cho mobile
      closeOnClickOutside={true}
      closeOnScroll={false}
      // Tùy chỉnh zoom behavior
      zoomImg={{
        src: image,
        alt: alt,
        style: {
          objectFit: 'contain',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }
      }}
    >
      <div className="relative w-full h-full max-w-4xl max-h-4xl">
        <Image
          src={image || '/next.svg'}
          alt={alt || 'Product image'}
          fill
          className="object-contain"
          quality={100}
          priority={priority}
          sizes={sizes}
          draggable={false}
        />
      </div>
    </Zoom>
  )
}

export default MobileImageZoom
