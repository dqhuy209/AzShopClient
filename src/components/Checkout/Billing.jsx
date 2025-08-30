import React from 'react'

const Billing = ({ register, errors }) => {
  return (
    <div className="lg:mt-[-52px]">
      <h2 className="font-semibold text-dark text-xl sm:text-2xl mb-5.5">
        Thông tin thanh toán
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
          <div className="w-full">
            <label htmlFor="customerName" className="block mb-2.5">
              Họ và tên <span className="text-red">*</span>
            </label>

            <input
              type="text"
              {...register('customerName', {
                required: 'Họ và tên là bắt buộc',
                minLength: { value: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
              })}
              placeholder="Nguyễn Văn A"
              className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${errors.customerName ? 'border-red' : 'border-gray-3'
                }`}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red">{errors.customerName.message}</p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="customerAddress" className="block mb-2.5">
            Địa chỉ
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            {...register('customerAddress', {
              required: 'Địa chỉ là bắt buộc',
              minLength: { value: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
            })}
            placeholder="Số nhà, đường, phố, quận/huyện, tỉnh/thành phố"
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${errors.customerAddress ? 'border-red' : 'border-gray-3'
              }`}
          />
          {errors.customerAddress && (
            <p className="mt-1 text-sm text-red">{errors.customerAddress.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="customerPhone" className="block mb-2.5">
            Số điện thoại <span className="text-red">*</span>
          </label>

          <input
            type="tel"
            {...register('customerPhone', {
              required: 'Số điện thoại là bắt buộc',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải có 10-11 chữ số'
              }
            })}
            placeholder="0123456789"
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${errors.customerPhone ? 'border-red' : 'border-gray-3'
              }`}
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red">{errors.customerPhone.message}</p>
          )}
        </div>

        <div className="mb-5.5">
          <label htmlFor="customerEmail" className="block mb-2.5">
            Email <span className="text-red">*</span>
          </label>

          <input
            type="email"
            {...register('customerEmail', {
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ'
              }
            })}
            placeholder="example@email.com"
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${errors.customerEmail ? 'border-red' : 'border-gray-3'
              }`}
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red">{errors.customerEmail.message}</p>
          )}
        </div>

        <div className="mb-5.5">
          <div>
            <label htmlFor="notes" className="block mb-2.5">
              Ghi chú
            </label>

            <textarea
              {...register('notes')}
              rows={5}
              placeholder="Ghi chú về đơn hàng, ví dụ: ghi chú đặc biệt cho việc giao hàng."
              className="w-full p-5 duration-200 border rounded-md outline-none border-gray-3 bg-gray-1 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
