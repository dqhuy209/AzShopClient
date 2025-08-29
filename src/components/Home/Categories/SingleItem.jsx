import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SingleItem = ({ item }) => {
  return (
    <Link
      href={`/shop-with-sidebar?categoryId=${item.id}`}
      className="flex flex-col items-center group"
    >
      <div className="w-[150px] h-[150px] bg-[#F2F3F8]  rounded-[16px] flex items-center justify-center mb-4">
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
          className="inline-block font-semibold text-center text-dark bg-gradient-to-r from-blue to-blue
         bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500
          hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue"
        >
          {item.name}
        </h3>
      </div>
    </Link>
  )
}

export default SingleItem
