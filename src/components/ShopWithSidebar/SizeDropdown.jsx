'use client'
import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SizeDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [toggleDropdown, setToggleDropdown] = useState(true)

  // Lấy trạng thái version hiện tại từ URL
  const activeVersion = searchParams.get('version') || ''

  // Chọn/bỏ chọn version và đồng bộ URL (reset page, preserve params khác)
  const toggleVersion = (value) => {
    const url = new URL(pathname, window.location.origin)
    searchParams.forEach((v, k) => url.searchParams.set(k, v))
    if (activeVersion === value) {
      // đang chọn lại => bỏ chọn
      url.searchParams.delete('version')
    } else {
      url.searchParams.set('version', value)
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
        <p className="text-dark">Phiên bản</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          aria-label="button for size dropdown"
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

      {/* // <!-- dropdown menu --> */}
      <div
        className={`flex-wrap gap-2.5 p-6 ${toggleDropdown ? 'flex' : 'hidden'
          }`}
      >
        {/* eSIM */}
        <label
          htmlFor="version-esim"
          className={`cursor-pointer select-none flex items-center rounded-md ${activeVersion === 'esim' ? 'bg-blue text-white' : 'hover:bg-blue hover:text-white'
            }`}
          onClick={() => toggleVersion('esim')}
        >
          <div className="relative">
            <input type="radio" name="version" id="version-esim" className="sr-only" />
            <div className="text-custom-sm py-[5px] px-3.5 rounded-[5px]">
              eSIM
            </div>
          </div>
        </label>

        {/* GPS */}
        <label
          htmlFor="version-gps"
          className={`cursor-pointer select-none flex items-center rounded-md ${activeVersion === 'gps' ? 'bg-blue text-white' : 'hover:bg-blue hover:text-white'
            }`}
          onClick={() => toggleVersion('gps')}
        >
          <div className="relative">
            <input type="radio" name="version" id="version-gps" className="sr-only" />
            <div className="text-custom-sm py-[5px] px-3.5 rounded-[5px]">
              GPS
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

export default SizeDropdown
