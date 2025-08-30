import React from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import Link from 'next/link'

const MailSuccess = () => {
  return (
    <>
      <Breadcrumb title={'Đặt hàng thành công'} pages={['Đặt hàng thành công']} />
      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="px-4 py-10 bg-white rounded-xl shadow-1 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <svg
                className="w-20 h-20 mx-auto mb-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <h2 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                Đặt hàng thành công!
              </h2>

              <h3 className="mb-3 text-xl font-medium text-dark sm:text-2xl">
                Cảm ơn bạn đã đặt hàng
              </h3>

              <p className="max-w-[491px] w-full mx-auto mb-7.5">
                Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white duration-200 ease-out rounded-md bg-blue hover:bg-blue-dark"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6654 9.37502C17.0105 9.37502 17.2904 9.65484 17.2904 10C17.2904 10.3452 17.0105 10.625 16.6654 10.625H8.95703L8.95703 15C8.95703 15.2528 8.80476 15.4807 8.57121 15.5774C8.33766 15.6742 8.06884 15.6207 7.89009 15.442L2.89009 10.442C2.77288 10.3247 2.70703 10.1658 2.70703 10C2.70703 9.83426 2.77288 9.67529 2.89009 9.55808L7.89009 4.55808C8.06884 4.37933 8.33766 4.32586 8.57121 4.42259C8.80475 4.51933 8.95703 4.74723 8.95703 5.00002L8.95703 9.37502H16.6654Z"
                    fill=""
                  />
                </svg>
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default MailSuccess
