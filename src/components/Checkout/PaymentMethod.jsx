import React, { useMemo, useRef, useState } from 'react'
import Image from 'next/image'


const PaymentMethod = () => {
  const [proofImage, setProofImage] = useState(null)
  const fileInputRef = useRef(null)

  // Ảnh QR có thể cấu hình qua ENV, fallback ảnh tĩnh trong public
  const qrImageSrc = useMemo(() => {
    return process.env.NEXT_PUBLIC_QR_IMAGE || '/images/checkout/bank.svg'
  }, [])

  const handleUploadClick = () => {
    try {
      fileInputRef.current?.click()
    } catch (e) {
      // no-op: tránh crash trên môi trường không hỗ trợ
    }
  }

  const handleFileChange = (e) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setProofImage(url)
    } catch (err) {
      // Giữ im lặng, không lộ thông tin nhạy cảm
    }
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="text-xl font-semibold text-dark">Phương thức thanh toán</h3>
      </div>

      <div className="p-4 sm:p-8.5">


        {/* QR và upload minh chứng thanh toán */}
        <div className="p-4 border rounded-md border-gray-3 sm:p-5">
          <p className="mb-3 font-medium text-dark">Quét QR để thanh toán</p>
          <div className="flex items-start gap-5">
            <div className="p-3 border rounded-md bg-gray-1 border-gray-3">
              <Image src={qrImageSrc} alt="qr" width={160} height={160} className="object-contain" />
            </div>

            <div className="flex-1">
              <p className="mb-3 text-sm text-meta-4">
                Vui lòng tải ảnh minh chứng thanh toán (biên lai/chụp màn hình). Ảnh chỉ dùng để xác thực đơn.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center justify-center px-4 py-2 font-medium duration-200 ease-out bg-white border rounded-md text-blue border-blue hover:bg-gray-1"
                >
                  Tải ảnh thanh toán
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {proofImage && (
                <div className="mt-4">
                  <p className="mb-2 text-sm">Ảnh đã chọn:</p>
                  <div className="w-[200px] h-[200px] overflow-hidden rounded border border-gray-3">
                    <Image
                      src={proofImage}
                      alt="payment-proof"
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethod
