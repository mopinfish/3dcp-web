export const translateText = async (text: string, targetLang: string = 'en'): Promise<string> => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|${targetLang}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.responseData.translatedText || text // 翻訳失敗時は元のテキストを返す
  } catch (error) {
    console.error('翻訳エラー:', error)
    return text // エラー時は元のテキスト
  }
}

export const translatePage = async (targetLang: string = 'en'): Promise<void> => {
  const elements = document.querySelectorAll('h1, h2, h3, p, span, div, li, a') // 翻訳対象の要素
  const elementsList: HTMLElement[] = Array.from(elements) as HTMLElement[]
  for (const el of elementsList) {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      // テキストノードのみ処理
      el.dataset.originalText = el.textContent || '' // 元のテキストを保存
      el.textContent = await translateText(el.textContent || '', targetLang)
    }
  }
}

export const restoreOriginalText = (): void => {
  document.querySelectorAll('[data-original-text]').forEach((el) => {
    el.textContent = (el as HTMLElement).dataset.originalText || '' // 保存した元のテキストに戻す
  })
}
