'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// targetPath: khi có, luôn điều hướng đến trang này khi áp dụng/xóa bộ lọc
const ColorsDropdwon = ({ targetPath }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [toggleDropdown, setToggleDropdown] = useState(true)
  const [colorInput, setColorInput] = useState('')
  const [caseMaterialInput, setCaseMaterialInput] = useState('')

  // Đồng bộ input với URL khi mount hoặc khi URL thay đổi
  useEffect(() => {
    const urlColor = searchParams.get('color') || ''
    const urlCaseMaterial = searchParams.get('caseMaterial') || ''
    setColorInput(urlColor)
    setCaseMaterialInput(urlCaseMaterial)
  }, [searchParams])

  // Áp dụng bộ lọc color lên URL (giữ nguyên params khác, reset page)
  const applyColorFilter = () => {
    try {
      const url = new URL(pathname, window.location.origin)
      if (targetPath) url.pathname = targetPath
      // Sao chép params hiện tại
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value)
      })
      const colorValue = colorInput?.trim()
      const caseValue = caseMaterialInput?.trim()
      // color
      if (colorValue) url.searchParams.set('color', colorValue)
      else url.searchParams.delete('color')
      // caseMaterial
      if (caseValue) url.searchParams.set('caseMaterial', caseValue)
      else url.searchParams.delete('caseMaterial')
      url.searchParams.delete('page')
      router.push(url.pathname + url.search)
    } catch (err) {
      console.error('Lỗi áp dụng bộ lọc màu:', err)
    }
  }

  // Xóa bộ lọc color khỏi URL (giữ nguyên params khác, reset page)
  const clearColorFilter = () => {
    try {
      const url = new URL(pathname, window.location.origin)
      if (targetPath) url.pathname = targetPath
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value)
      })
      url.searchParams.delete('color')
      url.searchParams.delete('caseMaterial')
      url.searchParams.delete('page')
      router.push(url.pathname + url.search)
    } catch (err) {
      console.error('Lỗi xóa bộ lọc màu:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-1">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && 'shadow-filter'
          }`}
      >
        <p className="text-dark">Màu sắc - Chất liệu vỏ  </p>
        <button
          aria-label="button for colors dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && 'rotate-180'
            }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* <!-- dropdown menu --> */}
      <div className={`p-6 ${toggleDropdown ? 'block' : 'hidden'}`}>
        <div className="flex flex-col gap-3">
          {/* Ô nhập màu (color) và chất liệu vỏ (caseMaterial) */}
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Màu sắc "
            className="w-full px-3 py-2 border rounded-md outline-none border-gray-3/80 focus:border-blue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyColorFilter()
              }
            }}
          />
          <input
            type="text"
            value={caseMaterialInput}
            onChange={(e) => setCaseMaterialInput(e.target.value)}
            placeholder="Chất liệu vỏ "
            className="w-full px-3 py-2 border rounded-md outline-none border-gray-3/80 focus:border-blue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyColorFilter()
              }
            }}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm text-white rounded-md bg-blue hover:bg-blue-600"
              onClick={applyColorFilter}
            >
              Áp dụng
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:border-blue hover:text-blue"
              onClick={clearColorFilter}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorsDropdwon
