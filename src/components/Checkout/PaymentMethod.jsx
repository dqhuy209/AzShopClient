import React, { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import checkoutService from '@/services/checkout'
import toast from 'react-hot-toast'

const PaymentMethod = ({ onImageChange }) => {
  const [proofImage, setProofImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null) // Lưu URL ảnh từ server
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)


  // const qrImageSrc = useMemo(() => {
  //   return process.env.NEXT_PUBLIC_QR_IMAGE || '/images/checkout/bank.svg'
  // }, [])

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File ảnh quá lớn! Tối đa 10MB')
      return
    }

    // Preview ảnh ngay lập tức
    setProofImage(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      // Tạo FormData giống admin
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await checkoutService.uploadOrderImage(formData)
      // Lấy fileUrl từ response mới: data.data.fileUrl
      const imageUrl = data.data?.fileUrl

      if (!imageUrl) throw new Error('Không nhận được URL ảnh')

      setImageUrl(imageUrl)
      onImageChange?.(imageUrl) // Truyền fileUrl cho form với key orderImage
      toast.success('Tải ảnh thanh toán thành công!')
    } catch (error) {
      console.error('Lỗi upload ảnh:', error)
      toast.error('Lỗi khi tải ảnh lên server')
      setProofImage(null)
      fileInputRef.current.value = ''
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (proofImage) URL.revokeObjectURL(proofImage)
    setProofImage(null)
    setImageUrl(null)
    fileInputRef.current.value = ''
    onImageChange?.(null)
    toast.success('Xóa ảnh thanh toán thành công!')
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="text-xl font-semibold text-dark">Thanh toán</h3>
      </div>

      <div className="p-4 sm:p-8.5">


        <div className="p-4 border rounded-md border-gray-3 sm:p-5">
          <p className="mb-3 font-medium text-dark">Quét QR để thanh toán</p>
          <div className="flex items-start gap-5">
            <div className="p-3 border rounded-md bg-gray-1 border-gray-3">
              <Image src={'/images/checkout/ma-qr.jpg'} alt="qr" width={160} height={160} className="object-contain" />
            </div>

            <div className="flex-1">
              <p className="mb-3 text-sm text-meta-4">
                Vui lòng tải ảnh minh chứng thanh toán (biên lai/chụp màn hình). Ảnh chỉ dùng để xác thực đơn.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className={`inline-flex items-center justify-center px-4 py-2 font-medium duration-200 ease-out border rounded-md ${isUploading
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-white text-blue border-blue hover:bg-gray-1'
                    }`}
                >
                  {isUploading ? 'Đang tải...' : 'Tải ảnh thanh toán'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              {proofImage && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm">
                      {isUploading ? 'Đang tải ảnh lên server...' : 'Ảnh đã tải thành công:'}
                    </p>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1 text-xs font-medium text-white transition-colors border rounded-md bg-blue hover:bg-blue-light"
                      >
                        X
                      </button>
                    )}
                  </div>
                  <div className="relative w-[200px] h-[200px] overflow-hidden rounded border border-gray-3">
                    <Image
                      src={proofImage}
                      alt="payment-proof"
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    )}
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
