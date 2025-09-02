import { Menu } from '@/types/Menu'

export const menuData = [
  {
    id: 1,
    title: 'Popular',
    newTab: false,
    path: '/',
  },
  {
    id: 2,
    title: 'Shop',
    newTab: false,
    path: '/shop-with-sidebar',
  },
  {
    id: 3,
    title: 'Contact',
    newTab: false,
    path: '/contact',
  },
  {
    id: 6,
    title: 'pages',
    newTab: false,
    path: '/',
    submenu: [
      {
        id: 61,
        title: 'Shop With Sidebar',
        newTab: false,
        path: '/shop-with-sidebar',
      },
      {
        id: 62,
        title: 'Shop Without Sidebar',
        newTab: false,
        path: '/shop-without-sidebar',
      },
      {
        id: 64,
        title: 'Checkout',
        newTab: false,
        path: '/checkout',
      },
      {
        id: 65,
        title: 'Cart',
        newTab: false,
        path: '/cart',
      },
      {
        id: 66,
        title: 'Wishlist',
        newTab: false,
        path: '/wishlist',
      },
      {
        id: 67,
        title: 'Sign in',
        newTab: false,
        path: '/signin',
      },
      {
        id: 68,
        title: 'Sign up',
        newTab: false,
        path: '/signup',
      },
      {
        id: 69,
        title: 'My Account',
        newTab: false,
        path: '/my-account',
      },
      {
        id: 70,
        title: 'Contact',
        newTab: false,
        path: '/contact',
      },
      {
        id: 62,
        title: 'Error',
        newTab: false,
        path: '/error',
      },
      {
        id: 63,
        title: 'Mail Success',
        newTab: false,
        path: '/mail-success',
      },
    ],
  },
  {
    id: 7,
    title: 'blogs',
    newTab: false,
    path: '/',
    submenu: [
      {
        id: 71,
        title: 'Blog Grid with sidebar',
        newTab: false,
        path: '/blogs/blog-grid-with-sidebar',
      },
      {
        id: 72,
        title: 'Blog Grid',
        newTab: false,
        path: '/blogs/blog-grid',
      },
      {
        id: 73,
        title: 'Blog details with sidebar',
        newTab: false,
        path: '/blogs/blog-details-with-sidebar',
      },
      {
        id: 74,
        title: 'Blog details',
        newTab: false,
        path: '/blogs/blog-details',
      },
    ],
  },
]

// TODO: gắn link

export const menuDataHeader = [
  {
    id: 1,
    title: 'Trang chủ',
    newTab: false,
    path: '/',
  },
  {
    id: 2,
    title: 'Apple Watch Thời Trang',
    newTab: false,
    // Gắn link lọc theo yêu cầu: 1 trong 2 điều kiện màu hồng hoặc vỏ thép
    // Backend kỳ vọng OR giữa các thuộc tính, nên truyền cả 2 tham số
    path: '/shop-with-sidebar?color=hong&caseMaterial=thep',
  },
  {
    id: 3,
    title: 'Apple Watch Thể Thao',
    newTab: false,
    // Gắn link theo OR: truyền nhiều key modelV1 để thể hiện IN (ultra OR se1 OR se2)
    path: '/shop-with-sidebar?modelV1=ultra&modelV1=se1&modelV1=se2',
  },
  {
    id: 4,
    title: 'Về Chúng Tôi',
    newTab: false,
    path: '/',
  },
  {
    id: 5,
    title: 'Chính sách',
    newTab: false,
    path: '/blogs/blog-details',
  },
]
