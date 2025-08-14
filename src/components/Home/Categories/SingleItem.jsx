import React from 'react'
import Image from 'next/image'

const SingleItem = ({ item }) => {
  return (
    <a href="#" className="flex flex-col items-center group">
      <div className="w-[200px] h-[200px] bg-[#F2F3F8]  rounded-[16px] flex items-center justify-center mb-4">
        <div className="w-[130px] h-[130px] relative">
          <Image
            src={item.imageUrl}
            alt="Category"
            fill
            className={'object-cover'}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <h3
          className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue
         bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500
          hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue"
        >
          {item.name}
        </h3>
      </div>
    </a>
  )
}

export default SingleItem
