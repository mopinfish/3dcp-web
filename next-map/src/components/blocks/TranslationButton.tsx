import React, { useState } from 'react'
import styled from 'styled-components'
import { translatePage, restoreOriginalText } from '../../domains/services/translation'

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:active {
    background-color: #004494;
    transform: scale(0.98);
  }
`

const TranslationButton: React.FC = () => {
  const [isEnglish, setIsEnglish] = useState(false)

  const handleTranslate = async () => {
    if (isEnglish) {
      restoreOriginalText()
    } else {
      await translatePage('en')
    }
    setIsEnglish(!isEnglish)
  }

  return (
    <Button onClick={handleTranslate}>
      {isEnglish ? '戻す (Revert)' : 'Translate to English'}
    </Button>
  )
}

export default TranslationButton
