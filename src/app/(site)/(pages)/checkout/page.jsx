import React from 'react'
import Checkout from '@/components/Checkout'

export const metadata = {
  title: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  description: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  icons: {
    icon: '/images/logo/logo.jpg', // favicon chính
    shortcut: '/images/logo/logo.jpg', // icon shortcut
    apple: '/images/logo/logo.jpg', // icon khi add to home screen trên iOS
  },
  // other metadata
}

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  )
}

export default CheckoutPage
