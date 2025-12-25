import React from 'react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/contexts/AuthContext'
import { CulturalPropertyFormProvider } from '@/contexts/CulturalPropertyFormContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  console.log('✅ _app.tsx is loaded')
  return (
    <AuthProvider>
      <CulturalPropertyFormProvider>
        <Component {...pageProps} />
      </CulturalPropertyFormProvider>
    </AuthProvider>
  )
}

export default MyApp
