import React, { useRef } from 'react'
import { ThreeCanvas } from './ThreeCanvas'

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

type CulturalPropertyPopupProps = {
  name: string
  imageUrl: string
  url: string
  address: string
}

export const CulturalPropertyPopup: React.FC<CulturalPropertyPopupProps> = ({
  name,
  imageUrl,
  url,
  address,
}) => {
  return (
    <div className="w-full flex flex-col">
      <img src={imageUrl} alt={name} className="w-full h-[100px] object-contain rounded" />
      <h3 className="mt-2 mb-1 text-lg font-semibold">{name}</h3>
      <p className="mb-2 text-sm text-gray-600">{address}</p>
      <div className="mt-2 flex justify-center w-full">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-800 transition"
        >
          3Dモデルを見る
        </a>
      </div>
    </div>
  )
}

type CulturalPropertyThreeCanvasPopupProps = {
  id: number
  url: string
}

export const CulturalPropertyThreeCanvasPopup: React.FC<CulturalPropertyThreeCanvasPopupProps> = ({
  id,
  url,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={popupRef} className="w-full flex flex-col">
      <div className="flex justify-center w-full">
        {!id ? <Loading /> : <ThreeCanvas id={id} />}
      </div>
      <div className="mt-2 flex justify-center w-full">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-800 transition"
        >
          大きな画面で見る
        </a>
      </div>
    </div>
  )
}
