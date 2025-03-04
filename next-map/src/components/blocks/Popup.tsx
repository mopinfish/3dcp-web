import React, { useRef } from 'react'
import { styled } from 'styled-components'
import { ThreeCanvas } from './ThreeCanvas'

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

const PopupCard = styled.div`
  width: 100%;
  :display: flex;
  flex-direction: column;
`

const PopupImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
`

const PopupTitle = styled.h3`
  margin: 10px 0 5px;
  font-size: 18px;
`

const PopupAddress = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
`

const PopupLinkWrapper = styled.div`
  margin: 10px 0 0;
  display: flex;
  justify-content: center;
  width: 100%;
`

const PopupLink = styled.a`
  display: inline-block;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
`

const PopupCanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

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
}: CulturalPropertyPopupProps) => {
  return (
    <PopupCard>
      <PopupImage src={imageUrl} alt={name} />
      <PopupTitle>{name}</PopupTitle>
      <PopupAddress>{address}</PopupAddress>
      <PopupLinkWrapper>
        <PopupLink href={url} target="_blank" rel="noopener noreferrer">
          3Dモデルを見る
        </PopupLink>
      </PopupLinkWrapper>
    </PopupCard>
  )
}

type CulturalPropertyThreeCanvasPopupProps = {
  id: number
  url: string
}

export const CulturalPropertyThreeCanvasPopup: React.FC<CulturalPropertyThreeCanvasPopupProps> = ({
  id,
  url,
}: CulturalPropertyThreeCanvasPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null)

  return (
    <PopupCard ref={popupRef}>
      <PopupCanvasWrapper>{!id ? <Loading /> : <ThreeCanvas id={id} />}</PopupCanvasWrapper>
      <PopupLinkWrapper>
        <PopupLink href={url} target="_blank" rel="noopener noreferrer">
          大きな画面で見る
        </PopupLink>
      </PopupLinkWrapper>
    </PopupCard>
  )
}
