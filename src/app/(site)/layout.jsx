'use client'
import { useState, useEffect } from 'react'
import Script from 'next/script' // Chèn script Meta Pixel theo cách tối ưu cho Next
import { usePathname } from 'next/navigation' // Theo dõi đổi route để bắn lại PageView
import '../css/euclid-circular-a-font.css'
import '../css/style.css'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

import { ModalProvider } from '../context/QuickViewModalContext'
import { CartModalProvider } from '../context/CartSidebarModalContext'
import { ReduxProvider } from '@/redux/provider'
import QuickViewModal from '@/components/Common/QuickViewModal'
import CartSidebarModal from '@/components/Common/CartSidebarModal'
import { PreviewSliderProvider } from '../context/PreviewSliderContext'
import PreviewSliderModal from '@/components/Common/PreviewSlider'
import { Toaster } from 'react-hot-toast'

import PreLoader from '@/components/Common/PreLoader'
import Head from 'next/head'
import FooterMobile from '@/components/Common/FooterMobile'

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true)

  /**
   * Component nhỏ bắn lại PageView khi URL thay đổi (SPA navigation)
   * - Giữ đơn giản, fail gracefully, không gây crash UI
   */
  function PixelPageView() {
    const pathname = usePathname()
    useEffect(() => {
      try {
        // Bắn lại PageView để theo dõi chuyển trang nội bộ của Next App Router
        window.fbq && window.fbq('track', 'PageView')
      } catch (err) {
        // Ghi log nhẹ, tránh lộ thông tin nhạy cảm
        console.warn('Meta Pixel PageView on route change failed')
      }
    }, [pathname])
    return null
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning={true} className="font-bevietnam">
      {/*
        Meta Pixel Code
        - Dùng next/script với strategy "afterInteractive" để tải sau khi hydration, không chặn render
        - Pixel ID: 1980003336098417 (do bạn cung cấp)
      */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
                  !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '760425283483013');
          fbq('track', 'PageView');
        `}
      </Script>
      <Head>
        {/* Fallback khi tắt JS để vẫn ghi nhận PageView - phải đặt trong <Head> để tránh lỗi hydration */}
        <noscript>
          <img height="1" width="1" alt="" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1980003336098417&ev=PageView&noscript=1" />
        </noscript>
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap&subset=vietnamese"
          rel="stylesheet"
        />
      </Head>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    {/* Theo dõi PageView khi chuyển route trong SPA */}
                    <PixelPageView />
                    <Header />
                    {children}

                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 1500,
                      }}
                    />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            {/*<ScrollToTop />*/}
            <FooterMobile />
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
