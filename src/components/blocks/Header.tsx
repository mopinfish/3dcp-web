import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="relative w-20 h-20">
        <Image
          src="/img/logo.png"
          alt="OPEN3D Map Logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </Link>

      <nav>
        <ul className="flex flex-col md:flex-row list-none p-0">
          <li className="mb-2 md:mb-0 md:mr-4">
            <Link href="/" className="text-gray-800 no-underline font-bold">
              Home
            </Link>
          </li>
          <li className="mb-2 md:mb-0 md:mr-4">
            <Link href="/about" className="text-gray-800 no-underline font-bold">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
