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
import {
  selectBuyNowProduct,
  selectIsBuyNowMode,
  clearBuyNowProduct
} from '@/redux/features/buyNow-slice'
import { useRouter } from 'next/navigation'
import { formatVND } from '@/utils/formatCurrency'
import checkoutService from '@/services/checkout'
import bannerService from '@/services/bannerService'
import toast from 'react-hot-toast'



const Checkout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Lấy dữ liệu từ Redux store
  const cartItems = useAppSelector(selectSelectedItems)
  const totalPrice = useAppSelector(selectSelectedTotalPrice)
  const buyNowProduct = useAppSelector(selectBuyNowProduct)
  const isBuyNowMode = useAppSelector(selectIsBuyNowMode)

  // Xác định items và total price dựa trên mode
  const currentItems = isBuyNowMode ? (buyNowProduct ? [buyNowProduct] : []) : cartItems
  const currentTotalPrice = isBuyNowMode
    ? (buyNowProduct ? (buyNowProduct.finalPrice || buyNowProduct.sellingPrice || buyNowProduct.price || 0) : 0)
    : totalPrice

  // Kiểm tra trạng thái form để hiển thị nút thanh toán
  const isFormValid = () => {
    const requiredFields = ['customerName', 'customerPhone', 'customerAddress']
    const hasEmptyRequiredFields = requiredFields.some(field => !watch(field)?.trim())

    if (hasEmptyRequiredFields) return false

    // Kiểm tra email format nếu có nhập
    const email = watch('customerEmail')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false

    return true
  }

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

  // Kiểm tra khi vào trang checkout
  useEffect(() => {
    // Nếu không có items nào (cả giỏ hàng và mua ngay) thì chuyển về trang chủ
    if (!currentItems || currentItems.length === 0) {
      toast.error('Không có sản phẩm để thanh toán')
      router.push('/')
      return
    }

  }, [currentItems, isBuyNowMode, buyNowProduct, cartItems, router])

  // Xử lý khi người dùng muốn quay lại
  const handleGoBack = () => {
    if (isBuyNowMode) {
      // Nếu đang ở chế độ mua ngay, xóa sản phẩm và quay về trang chủ
      dispatch(clearBuyNowProduct())
      router.push('/')
    } else {
      // Nếu đang ở chế độ giỏ hàng, quay về trang giỏ hàng
      router.push('/cart')
    }
  }

  // Kiểm tra form validation trước khi mở modal policy
  const handleOpenPolicyModal = () => {
    // Kiểm tra các trường bắt buộc
    const requiredFields = ['customerName', 'customerPhone', 'customerAddress']
    const emptyFields = requiredFields.filter(field => !watch(field)?.trim())

    if (emptyFields.length > 0) {
      const fieldNames = {
        customerName: 'Họ tên',
        customerPhone: 'Số điện thoại',
        customerAddress: 'Địa chỉ'
      }
      const missingFields = emptyFields.map(field => fieldNames[field]).join(', ')
      toast.error(`Vui lòng điền: ${missingFields}`)
      return
    }

    // Kiểm tra email format nếu có nhập
    const email = watch('customerEmail')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email không đúng định dạng')
      return
    }

    // Nếu tất cả đều hợp lệ, mở modal
    setShowPolicyModal(true)
  }

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
    // Kiểm tra items
    if (!currentItems || currentItems.length === 0) {
      toast.error('Không có sản phẩm để đặt hàng')
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
      items: currentItems.map(item => ({
        productId: item.id,
        quantity: 1
      }))
    }

    try {
      setIsSubmitting(true)
      // Gọi API checkout
      await checkoutService.checkout(orderData)

      if (isBuyNowMode) {
        // Nếu là mua ngay, xóa sản phẩm mua ngay
        dispatch(clearBuyNowProduct())
      } else {
        // Nếu là giỏ hàng thường, xóa những sản phẩm đã được đặt hàng
        currentItems.forEach(item => {
          dispatch(removeItemFromCart(item.id))
        })
      }

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999999">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-dark">
                        Đơn hàng của bạn
                      </h3>
                      {isBuyNowMode && (
                        <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-blue">
                          Mua ngay
                        </span>
                      )}
                    </div>
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
                    {currentItems && currentItems.length > 0 ? (
                      currentItems.map((item) => {
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
                                {item.title || item.name || 'Sản phẩm'}
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
                          {formatVND(currentTotalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- Thông báo trường bắt buộc --> */}
                <div className="p-3 mt-4 text-xs rounded-md text-meta-4 bg-gray-1">
                  <p className="mb-1 font-medium">Trường bắt buộc:</p>
                  <p>• Họ tên • Số điện thoại • Địa chỉ</p>
                  <p className="mt-1">• Email (nếu có) phải đúng định dạng</p>
                </div>

                {/* <!-- checkout button --> */}
                <button
                  type="button"
                  onClick={handleOpenPolicyModal}
                  disabled={isSubmitting || !currentItems || currentItems.length === 0 || !isFormValid()}
                  className={`flex justify-center w-full px-6 py-3 mt-7.5 font-medium duration-200 ease-out rounded-md transition-all ${isSubmitting || !currentItems || currentItems.length === 0 || !isFormValid()
                    ? 'bg-gray-5 text-gray-6 cursor-not-allowed'
                    : 'bg-blue hover:bg-blue-dark text-white cursor-pointer'
                    }`}
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
        <div className="fixed inset-0 flex items-center justify-center mt-10 z-999999">
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
