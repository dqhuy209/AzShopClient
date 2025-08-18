'use client'
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'
import { formatVND } from '@/utils/formatCurrency'


const PriceDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Ngưỡng giá cố định
  const MIN_PRICE = 1000
  const MAX_PRICE = 100000000
  const STEP = 1000

  const [toggleDropdown, setToggleDropdown] = useState(true)

  const [selectedPrice, setSelectedPrice] = useState({
    from: MIN_PRICE,
    to: MAX_PRICE,
  })

  // Đọc từ URL để đồng bộ slider lúc mount và khi URL đổi (back/forward)
  useEffect(() => {
    const urlMin = parseInt(searchParams.get('minPrice') || `${MIN_PRICE}`, 10)
    const urlMax = parseInt(searchParams.get('maxPrice') || `${MAX_PRICE}`, 10)
    const clampedMin = isNaN(urlMin) ? MIN_PRICE : Math.max(MIN_PRICE, Math.min(urlMin, MAX_PRICE))
    const clampedMax = isNaN(urlMax) ? MAX_PRICE : Math.max(MIN_PRICE, Math.min(urlMax, MAX_PRICE))
    // Đảm bảo min <= max
    const from = Math.min(clampedMin, clampedMax)
    const to = Math.max(clampedMin, clampedMax)
    setSelectedPrice({ from, to })
  }, [searchParams])

  // Build text hiển thị
  const priceLabel = useMemo(() => {
    const from = formatVND(selectedPrice.from)
    const to = formatVND(selectedPrice.to)
    return `${from} - ${to}`
  }, [selectedPrice])

  // Cập nhật URL với giá trị hiện tại
  const applyPriceFilter = () => {
    const url = new URL(pathname, window.location.origin)
    // Copy params hiện tại
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
    url.searchParams.set('minPrice', String(selectedPrice.from))
    url.searchParams.set('maxPrice', String(selectedPrice.to))
    url.searchParams.delete('page')
    router.push(url.pathname + url.search)
  }

  // Xóa bộ lọc giá khỏi URL
  const clearPriceFilter = () => {
    const url = new URL(pathname, window.location.origin)
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
    url.searchParams.delete('minPrice')
    url.searchParams.delete('maxPrice')
    url.searchParams.delete('page')
    router.push(url.pathname + url.search)
  }

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5"
      >
        <p className="text-dark">Giá</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          id="price-dropdown-btn"
          aria-label="button for price dropdown"
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
      <div className={`p-6 ${toggleDropdown ? 'block' : 'hidden'}`}>
        <div id="pricingOne">
          <div className="price-range">
            <RangeSlider
              id="range-slider-gradient"
              className="margin-lg"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={STEP}
              value={[selectedPrice.from, selectedPrice.to]}
              onInput={(e) => {
                const from = Math.max(MIN_PRICE, Math.min(e[0], MAX_PRICE))
                const to = Math.max(MIN_PRICE, Math.min(e[1], MAX_PRICE))
                setSelectedPrice({ from: Math.floor(from), to: Math.ceil(to) })
              }}
            />

            <div className="price-amount flex items-center justify-between pt-4">
              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  đ
                </span>
                <span id="minAmount" className="block px-3 py-1.5">
                  {formatVND(selectedPrice.from)}
                </span>
              </div>

              <div className="text-custom-xs text-dark-4 flex rounded border border-gray-3/80">
                <span className="block border-r border-gray-3/80 px-2.5 py-1.5">
                  đ
                </span>
                <span id="maxAmount" className="block px-3 py-1.5">
                  {formatVND(selectedPrice.to)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                type="button"
                className="px-3 py-2 rounded-md bg-blue text-white text-sm hover:bg-blue-600"
                onClick={applyPriceFilter}
              >
                Áp dụng
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-md border border-gray-200 text-sm hover:border-blue hover:text-blue"
                onClick={clearPriceFilter}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceDropdown
