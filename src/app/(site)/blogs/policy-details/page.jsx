import BlogDetails from '@/components/BlogDetails'
import React from 'react'

export const metadata = {
  title: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  description: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  icons: {
    icon: '/images/logo/logo.jpg', // favicon chính
    shortcut: '/images/logo/logo.jpg', // icon shortcut
    apple: '/images/logo/logo.jpg', // icon khi add to home screen trên iOS
  },
}

const BlogDetailsPage = () => {
  return (
    <main>
      <BlogDetails />
    </main>
  )
}

export default BlogDetailsPage
