import React from 'react'
import Header from '@/components/blocks/Header'

type LayoutProps = {
  children: React.ReactNode
}

/**
 * 基本レイアウト
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  )
}

/**
 * フッター付きレイアウト
 */
export function LayoutWithFooter({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 3DCP - 3D Cultural Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}