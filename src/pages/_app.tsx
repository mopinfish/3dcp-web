import React from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css' // グローバルCSSのインポート

function MyApp({ Component, pageProps }: AppProps) {
  console.log('✅ _app.tsx is loaded') // ← ここがポイント
  return <Component {...pageProps} />
}

export default MyApp
