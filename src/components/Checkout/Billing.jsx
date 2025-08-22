import React from 'react'

const Billing = () => {
  return (
    <div className="mt-5 lg:mt-9">
      <h2 className="font-semibold text-dark text-xl sm:text-2xl mb-5.5">
        Thông tin thanh toán
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col gap-5 mb-5 lg:flex-row sm:gap-8">
          <div className="w-full">
            <label htmlFor="fullName" className="block mb-2.5">
              Họ và tên <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Nguyễn Văn A"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Địa chỉ
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            placeholder="Số nhà, đường, phố"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Số điện thoại <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            id="phone"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            Email <span className="text-red">*</span>
          </label>

          <input
            type="email"
            name="email"
            id="email"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <div className="mb-5.5">
          <div>
            <label htmlFor="notes" className="block mb-2.5">
              Ghi chú
            </label>

            <textarea
              name="notes"
              id="notes"
              rows={5}
              placeholder="Notes about your order, e.g. speacial notes for delivery."
              className="w-full p-5 duration-200 border rounded-md outline-none border-gray-3 bg-gray-1 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
