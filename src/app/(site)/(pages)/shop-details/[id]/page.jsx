import React from 'react'
import ShopDetails from '@/components/ShopDetails'
import productService from '@/services/productService'

export const metadata = {
  title: 'Az Shop | Đồng hồ AppleWatch giá tốt',
  description: 'Az Shop | Đồng hồ AppleWatch giá tốt',
}

export default async function ShopDetailsPage({ params }) {
  let productDetail = []
  const { id } = await params
  try {
    const response = await productService.productDetails(id)
    productDetail = response.data.data
  } catch (err) {
    console.error('Error fetching product details:', err)
  }
  return (
    <main>
      <ShopDetails product={productDetail} />
    </main>
  )
}
