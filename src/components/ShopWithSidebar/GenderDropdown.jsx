'use client'
import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Dropdown kích thước màn hình - chọn 1, toggle chọn/bỏ như giao diện cũ
const ScreenSizeDropdown = ({ targetPath }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [toggleDropdown, setToggleDropdown] = useState(true)

  const sizes = ['38mm', '40mm', '41mm', '42mm', '44mm', '45mm', '46mm', '49mm']
  const activeSize = searchParams.get('screenSize') || ''

  const toggleSize = (value) => {
    const url = new URL(pathname, window.location.origin)
    if (targetPath) url.pathname = targetPath
    searchParams.forEach((v, k) => url.searchParams.set(k, v))
    if (activeSize === value) {
      url.searchParams.delete('screenSize')
    } else {
      url.searchParams.set('screenSize', value)
    }
    url.searchParams.delete('page')
    router.push(url.pathname + url.search)
  }

  return (
    <div className="bg-white rounded-lg shadow-1">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && 'shadow-filter'
          }`}
      >
        <p className="text-dark">Kích thước màn hình</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          aria-label="button for screen size dropdown"
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
      <div
        className={`flex flex-wrap gap-2.5 p-6 ${toggleDropdown ? 'flex' : 'hidden'
          }`}
      >
        {sizes.map((size) => (
          <label
            key={size}
            htmlFor={`screen-${size}`}
            className={`cursor-pointer select-none flex items-center rounded-md ${activeSize === size ? 'bg-blue text-white' : 'hover:bg-blue hover:text-white'
              }`}
            onClick={() => toggleSize(size)}
          >
            <div className="relative">
              <input type="radio" name="screenSize" id={`screen-${size}`} className="sr-only" />
              <div className="text-custom-sm py-[5px] px-3.5 rounded-[5px]">
                {size}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default ScreenSizeDropdown
