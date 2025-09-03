import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import React from 'react'
import Image from 'next/image'

export function ZoomAbleImage({ src, alt }) {
  return (
    <TransformWrapper
      defaultScale={1}
      doubleClick={{ disabled: true }}
      wheel={{ disabled: true }}
      pinch={{ disabled: false }}
    >
      <TransformComponent>
        <Image
          src={src}
          alt={alt}
          width={300}
          height={300}
          draggable={false}
          className="object-contain pointer-events-auto"
        />
      </TransformComponent>
    </TransformWrapper>
  )
}
