import React from 'react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/contexts/AuthContext'
import '../styles/globals.css' // グローバルCSSのインポート

function MyApp({ Component, pageProps }: AppProps) {
  console.log('✅ _app.tsx is loaded') // ← これがポイント
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp