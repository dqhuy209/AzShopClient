import React from "react";
import ShopDetails from "@/components/ShopDetails";
import productService from "@/services/productService";

export const metadata = {
  title: "Shop Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Details Page for NextCommerce Template",
};

export default async function ShopDetailsPage({ params }) {
  let productDetail = [];
  const { id } = await params;
  try {
    const response = await productService.productDetails(id);
    productDetail = response.data.data;
  } catch (err) {
    console.error("Error fetching product details:", err);
  }
  return (
    <main>
      <ShopDetails product={productDetail} />
    </main>
  );
};

