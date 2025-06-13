import React, { useState } from 'react'
import { translatePage, restoreOriginalText } from '../../domains/services/translation'

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
    <button
      onClick={handleTranslate}
      className="fixed bottom-5 right-5 bg-blue-600 text-white border-none px-5 py-3 text-base rounded-lg shadow-md transition-all duration-200 hover:bg-blue-800 hover:scale-105 active:bg-blue-900 active:scale-95"
    >
      {isEnglish ? '戻す (Revert)' : 'Translate to English'}
    </button>
  )
}

export default TranslationButton
