import React from "react";
import Checkout from "@/components/Checkout";

export const metadata = {
  title: "Checkout Page | NextCommerce Nextjs E-commerce template",
  description: "This is Checkout Page for NextCommerce Template",
  // other metadata
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
