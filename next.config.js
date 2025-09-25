/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '46.250.228.124',
        port: '8089',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '46.250.228.124',
        port: '8089',
        pathname: '/uploads/**',
      },
      // Thêm các hostname khác nếu cần
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Cấu hình cho domain API mới
      {
        protocol: 'https',
        hostname: 'api.azshop168.vn',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'api.azshop168.vn',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
