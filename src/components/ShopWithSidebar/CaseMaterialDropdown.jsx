'use client'
import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * Dropdown Chất liệu vỏ: danh sách cố định, click để toggle chọn/bỏ chọn
 * - Đồng bộ trực tiếp với URL param `caseMaterial`; giữ nguyên params khác; reset `page`
 */
const CaseMaterialDropdown = ({ targetPath }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Mặc định: mở khi URL đã có 'caseMaterial'
  const [toggleDropdown, setToggleDropdown] = useState(() => !!(typeof window !== 'undefined' && (new URLSearchParams(window.location.search)).get('caseMaterial')))

  // Danh sách chất liệu vỏ cố định theo yêu cầu
  const caseMaterials = ['Nhôm', 'Titan', 'Thép', 'Gốm']

  const activeCaseMaterial = searchParams.get('caseMaterial') || ''

  // Đồng bộ mở/đóng theo URL mỗi khi query đổi
  React.useEffect(() => {
    try {
      const has = !!(searchParams.get('caseMaterial'))
      setToggleDropdown(has)
    } catch { }
  }, [searchParams])

  // Toggle chọn chất liệu vỏ: bảo toàn query, reset page
  const toggleCase = (value) => {
    try {
      const url = new URL(pathname, window.location.origin)
      if (targetPath) url.pathname = targetPath
      searchParams.forEach((v, k) => url.searchParams.set(k, v))
      if (activeCaseMaterial === value) url.searchParams.delete('caseMaterial')
      else url.searchParams.set('caseMaterial', value)
      url.searchParams.delete('page')
      router.push(url.pathname + url.search)
    } catch (err) {
      console.error('Lỗi toggle chất liệu vỏ:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-1">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && 'shadow-filter'}`}
      >
        <p className="text-dark">Chất liệu vỏ</p>
        <button
          aria-label="button for case material dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && 'rotate-180'}`}
        >
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z" fill="" />
          </svg>
        </button>
      </div>

      {/* danh sách nút chất liệu vỏ */}
      <div className={`flex flex-wrap gap-2.5 p-6 ${toggleDropdown ? 'flex' : 'hidden'}`}>
        {caseMaterials.map((m) => (
          <label
            key={m}
            htmlFor={`case-${m}`}
            className={`cursor-pointer select-none flex items-center rounded-md ${activeCaseMaterial === m ? 'bg-blue text-white' : 'hover:bg-blue hover:text-white'}`}
            onClick={() => toggleCase(m)}
          >
            <div className="relative">
              <input type="radio" name="caseMaterial" id={`case-${m}`} className="sr-only" />
              <div className="text-custom-sm py-[5px] px-3.5 rounded-[5px]">{m}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default CaseMaterialDropdown


