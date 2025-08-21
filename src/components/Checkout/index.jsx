'use client'
import React from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import PaymentMethod from './PaymentMethod'
import Billing from './Billing'
import { useAppSelector } from '@/redux/store'
import { selectSelectedItems, selectSelectedTotalPrice } from '@/redux/features/cart-slice'
import { formatVND } from '@/utils/formatCurrency'

const Checkout = () => {
  // Lấy dữ liệu giỏ hàng từ Redux để hiển thị đúng như trang giỏ hàng
  const cartItems = useAppSelector(selectSelectedItems)
  const totalPrice = useAppSelector(selectSelectedTotalPrice)

  return (
    <>
      <Breadcrumb title={'Checkout'} pages={['checkout']} />
      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">

                {/* <!-- billing details --> */}
                <Billing />
              </div>
              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="text-xl font-semibold text-dark">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Sản phẩm</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-right text-dark">
                          Thành tiền
                        </h4>
                      </div>
                    </div>

                    {/* <!-- danh sách sản phẩm giống giỏ hàng --> */}
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item) => {
                        const unit =
                          Number(
                            item?.discountedPrice ?? item?.finalPrice ?? item?.price
                          ) || 0
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-5 border-b border-gray-3"
                          >
                            <div>
                              <p className="text-dark-5 line-clamp-1">{item.title || 'Sản phẩm'}</p>
                            </div>
                            <div>
                              <p className="text-right text-blue">{formatVND(unit)}</p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="py-6 text-center text-meta-4">
                        Không có sản phẩm trong đơn hàng.
                      </div>
                    )}

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="text-xl font-semibold text-dark">Thành tiền</p>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-right text-blue">{formatVND(totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  className="flex justify-center w-full px-6 py-3 mt-7.5 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Checkout
