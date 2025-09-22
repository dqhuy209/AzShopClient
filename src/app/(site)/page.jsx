import Home from '@/components/Home'

export const metadata = {
  title: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  description:
    'Mua đồng hồ Apple Watch chính hãng giá tốt tại Az Shop. Đa dạng mẫu mã, bảo hành uy tín.',

  // Favicon và icon các loại
  icons: {
    icon: '/images/logo/logo.jpg', // favicon chính
    shortcut: '/images/logo/logo.jpg', // icon shortcut
    apple: '/images/logo/logo.jpg', // icon khi add to home screen trên iOS
  },

  // Open Graph cho Facebook, Zalo, LinkedIn
  openGraph: {
    title: 'Az Shop | Đồng hồ AppleWatch giá tốt',
    description:
      'Mua đồng hồ Apple Watch chính hãng giá tốt tại Az Shop. Đa dạng mẫu mã, bảo hành uy tín.',
    url: 'https://azshop.vn', // thay bằng domain thật
    siteName: 'Az Shop',
    images: [
      {
        url: '/images/logo/logo.jpg', // ảnh share
        width: 800,
        height: 600,
        alt: 'Az Shop Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

}

export default function HomePage() {
  return (
    <main>
      <Home />
    </main>
  )
}
