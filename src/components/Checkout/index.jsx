'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Breadcrumb from '../Common/Breadcrumb'
import PaymentMethod from './PaymentMethod'
import Billing from './Billing'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
  selectSelectedItems,
  selectSelectedTotalPrice,
  removeItemFromCart
} from '@/redux/features/cart-slice'
import { useRouter } from 'next/navigation'
import { formatVND } from '@/utils/formatCurrency'
import checkoutService from '@/services/checkout'
import bannerService from '@/services/bannerService'
import toast from 'react-hot-toast'



const Checkout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectSelectedItems)
  const totalPrice = useAppSelector(selectSelectedTotalPrice)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [policies, setPolicies] = useState([])
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await bannerService.getPolicy()
        setPolicies(response.data.data.content)
      } catch (error) {
        console.error('Error fetching policies:', error)
      }
    }
    fetchPolicies()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      notes: '',
    }
  })

  const onSubmit = async (data) => {
    // Kiểm tra giỏ hàng
    if (!cartItems || cartItems.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm')
      return
    }

    const orderData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      paymentMethod: 'COD',
      notes: data.notes,
      // orderImage: data.orderImage,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: 1
      }))
    }

    try {
      setIsSubmitting(true)
      // Gọi API checkout
      await checkoutService.checkout(orderData)

      // Xóa những sản phẩm đã được đặt hàng khỏi giỏ hàng
      cartItems.forEach(item => {
        dispatch(removeItemFromCart(item.id))
      })

      // Chuyển hướng đến trang thành công
      router.push('/mail-success')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng')
      console.error('Lỗi đặt hàng:', error)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg">
            <div className="w-12 h-12 mb-4 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">Đang xử lý đơn hàng...</p>
          </div>
        </div>
      )}
      <Breadcrumb title={'Checkout'} pages={['checkout']} />
      <section className="py-[10px] lg:py-20 overflow-hidden bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Billing
                  register={register}
                  errors={errors}
                />
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
                            item?.discountedPrice ??
                            item?.finalPrice ??
                            item?.price
                          ) || 0
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-5 border-b border-gray-3"
                          >
                            <div>
                              <p className="text-dark-5 line-clamp-1">
                                {item.title || 'Sản phẩm'}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-right text-blue">
                                {formatVND(unit)}
                              </p>
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
                        <p className="text-xl font-semibold text-dark">
                          Thành tiền
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-right text-blue">
                          {formatVND(totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  disabled={isSubmitting || !cartItems || cartItems.length === 0}
                  className="flex justify-center w-full px-6 py-3 mt-7.5 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Policy Modal */}
      {showPolicyModal && !isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowPolicyModal(false)}></div>
          <div className="relative z-50 w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-white rounded-lg p-8">
            <button
              onClick={() => setShowPolicyModal(false)}
              className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-6 text-2xl font-bold">Chính sách và Điều khoản</h2>
            <div className="space-y-6">
              {policies.map((policy, index) => (
                <div key={index} className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold">{policy.title}</h3>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: policy.content }} />
                </div>
              ))}
            </div>

            <div className="flex items-center mt-6 space-x-4">
              <input
                type="checkbox"
                id="agreePolicy"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="agreePolicy" className="text-sm">
                Tôi đã đọc và đồng ý với các điều khoản và chính sách trên
              </label>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Đóng
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!agreedToPolicy || isSubmitting}
                className="px-4 py-2 text-white rounded-md bg-blue hover:bg-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout
