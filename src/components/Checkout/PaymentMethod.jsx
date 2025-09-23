import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import checkoutService from '@/services/checkout'
import toast from 'react-hot-toast'

const PaymentMethod = ({ onImageChange }) => {
  const [proofImage, setProofImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState(null)
  const handleUploadClick = () => fileInputRef.current?.click()


  const openPreview = (src) => {
    if (!src) return
    setPreviewSrc(src)
    setIsImagePreviewOpen(true)
  }

  const closePreview = () => {
    setIsImagePreviewOpen(false)
    setTimeout(() => setPreviewSrc(null), 150)
  }


  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closePreview()
    }
    if (isImagePreviewOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isImagePreviewOpen])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File ảnh quá lớn! Tối đa 10MB')
      return
    }

    setProofImage(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await checkoutService.uploadOrderImage(formData)
      const imageUrl = data.data?.fileUrl

      if (!imageUrl) throw new Error('Không nhận được URL ảnh')

      setImageUrl(imageUrl)
      onImageChange?.(imageUrl)
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

              <button
                type="button"
                onClick={() => openPreview('/images/checkout/ma-qr.jpg')}
                className="block focus:outline-none"
                title="Nhấn để xem ảnh lớn"
              >
                <Image src={'/images/checkout/ma-qr.jpg'} alt="qr" width={160} height={160} className="object-contain cursor-pointer" />
              </button>
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

                    <button
                      type="button"
                      onClick={() => openPreview(proofImage)}
                      className="block w-full h-full focus:outline-none"
                    >
                      <Image
                        src={proofImage}
                        alt="payment-proof"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full cursor-pointer"
                      />
                    </button>
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

      {isImagePreviewOpen && previewSrc && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex items-center justify-center w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closePreview}
              className="absolute z-10 w-8 h-8 bg-white rounded-full shadow -top-3 -right-3 text-dark hover:bg-gray-1"
              aria-label="Đóng"
              title="Đóng"
            >
              ×
            </button>
            <Image
              src={previewSrc}
              alt="preview"
              width={1000}
              height={1000}
              className="max-h-[85vh] w-auto h-auto object-contain rounded"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethod
