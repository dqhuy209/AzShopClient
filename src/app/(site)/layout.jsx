'use client'
import { useState, useEffect } from 'react'
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

import ScrollToTop from '@/components/Common/ScrollToTop'
import PreLoader from '@/components/Common/PreLoader'
import Head from 'next/head'

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning={true} className="font-bevietnam">
      <Head>
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
                    <Header />
                    {children}

                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                    <Toaster position="top-right" />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
