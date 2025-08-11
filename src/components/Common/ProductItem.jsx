
import React from "react";
import Image from "next/image";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateitems } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { formatVND, formatVNDRounded } from "@/utils/formatCurrency";

const ProductItem = ({ item }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch();


  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
  };

  const handleitems = () => {
    dispatch(updateitems({ ...item }));
  };

  return (
    <div className="overflow-hidden transition-all duration-300 ease-out bg-white rounded-lg group shadow-1 hover:shadow-2">
      <div className="relative overflow-hidden flex items-center justify-center rounded-t-lg bg-gray-1 min-h-[200px] p-3">


        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={item?.images?.[0] || item.imgs?.previews?.[0] || "/placeholder.jpg"}
            alt={item?.name || item.title || ""}
            width={200}
            height={200}
            className="object-cover max-w-full max-h-full transition-transform duration-300 ease-out hover:scale-105"
          />
        </div>

        <div className="absolute bottom-0 left-0 flex items-center justify-center w-full gap-2 pb-3 duration-300 ease-linear translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-black/10 to-transparent">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-8 h-8 duration-300 ease-out transform bg-white rounded-lg shadow-2 text-dark-3 hover:bg-red hover:text-white hover:scale-110"
          >
            <svg
              className="fill-current"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666ZM2.57964 6.10786C3.66592 4.69661 5.43374 3.16666 8.00016 3.16666C10.5666 3.16666 12.3344 4.69661 13.4207 6.10786C13.7131 6.48772 13.8843 6.7147 13.997 6.9697C14.1023 7.20801 14.1668 7.49929 14.1668 8C14.1668 8.50071 14.1023 8.79199 13.997 9.0303C13.8843 9.28529 13.7131 9.51227 13.4207 9.89213C12.3344 11.3034 10.5666 12.8333 8.00016 12.8333C5.43374 12.8333 3.66592 11.3034 2.57964 9.89213C2.28725 9.51227 2.11599 9.28529 2.00334 9.0303C1.89805 8.79199 1.8335 8.50071 1.8335 8C1.8335 7.49929 1.89805 7.20801 2.00334 6.9697C2.11599 6.7147 2.28725 6.48772 2.57964 6.10786Z"
                fill=""
              />
            </svg>
          </button>

          <button
            onClick={() => handleAddToCart()}
            className="inline-flex items-center px-4 py-2 text-xs font-medium duration-300 ease-out transform bg-white rounded-lg text-dark-4 hover:bg-red hover:text-white hover:scale-105 shadow-2"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7" />
            </svg>
            Thêm vào giỏ
          </button>

        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="min-h-[1.2rem]">
          <h3
            className="text-sm font-semibold leading-tight transition-colors duration-300 cursor-pointer decoration-transparent text-dark-3 hover:text-red line-clamp-2"
            onClick={() => handleitems()}
          >
            <Link href="/shop-details" className="hover:underline">
              {item?.name || item.title}
            </Link>
          </h3>
        </div>

        {/* Category và Condition */}
        <div className="space-y-1">
          {item?.categoryName && (
            <p className="flex items-center text-xs text-meta-3">
              <svg className="w-3 h-3 mr-1 text-meta-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {item.categoryName}
            </p>
          )}

          {item?.currentCondition && (
            <p className="flex items-center text-xs text-green">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.currentCondition}
            </p>
          )}
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-gray-3">
          <div className="space-y-1.5">
            {/* Main Price Display */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-red">
                {formatVNDRounded.thousands(item?.finalPrice || item?.sellingPrice || item.discountedPrice)}
              </span>
              {item?.discountPercent > 0 && (
                <span className="text-sm font-medium line-through text-meta-4">
                  {formatVNDRounded.thousands(item?.sellingPrice || item.price)}
                </span>
              )}
            </div>

            {/* Discount Badge and Savings */}
            {item?.discountPercent > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center  py-0.5 text-xs font-medium rounded-md bg-red-50 text-meta-3">
                    Tiết kiệm {formatVNDRounded.thousands((item?.sellingPrice || item.price) - (item?.finalPrice || item.discountedPrice))}
                  </span>
                </div>

                {/* Rating or Stock Status */}
                <div className="flex items-center text-xs font-medium text-red-light">
                  GIẢM {item.discountPercent}%
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProductItem;
