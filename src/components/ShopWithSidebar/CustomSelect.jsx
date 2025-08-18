import React, { useState, useEffect, useRef } from 'react'

const CustomSelect = ({ options, onChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(() => {
    if (defaultValue) {
      const found = options.find(opt => opt.value === defaultValue)
      return found || options[0]
    }
    return options[0]
  })
  const selectRef = useRef(null)

  // Function to close the dropdown when a click occurs outside the component
  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // Cập nhật selectedOption khi defaultValue thay đổi
  useEffect(() => {
    if (defaultValue) {
      const found = options.find(opt => opt.value === defaultValue)
      if (found) {
        setSelectedOption(found)
      }
    }
  }, [defaultValue, options])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    toggleDropdown()

    // Gọi callback onChange nếu được cung cấp
    if (onChange) {
      onChange(option.value)
    }
  }

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative"
      ref={selectRef}
    >
      <div
        className={`select-selected whitespace-nowrap ${isOpen ? 'select-arrow-active' : ''
          }`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </div>
      <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
        {options.slice(1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${selectedOption === option ? 'same-as-selected' : ''
              }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomSelect
