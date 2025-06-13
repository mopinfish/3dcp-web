import React from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css' // グローバルCSSのインポート

function MyApp({ Component, pageProps }: AppProps) {
  console.log('✅ _app.tsx is loaded') // ← ここがポイント
  return (
    <>
      <div className="text-4xl font-bold text-blue-600">Tailwind が効いている見出し</div>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
