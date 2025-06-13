import React from 'react'
import Header from '../blocks/Header'

interface LayoutWithFooterProps {
  children: React.ReactNode
}

export const LayoutWithFooter: React.FC<LayoutWithFooterProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 p-8">{children}</main>
    <footer className="bg-gray-800 text-white p-4 text-center">©︎ OPEN3D Map</footer>
  </div>
)
