import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

const NavigationTab: React.FC = () => {
  const router = useRouter()

  const tabs = [
    { href: '/', label: '一覧をみる' },
    { href: '/map', label: '地図を見る' },
    { href: '/3d_map', label: '3D地図を見る' },
    { href: '/luma-list', label: '3Dモデルリスト' },
  ]

  return (
    <div className="flex justify-center flex-wrap border-b border-gray-300 py-2 mb-5">
      {tabs.map(({ href, label }) => {
        const isActive = router.pathname === href
        return (
          <Link key={href} href={href}>
            <button
              className={clsx(
                'px-5 py-2 mx-2 text-lg rounded transition-colors duration-300',
                isActive ? 'bg-blue-600 text-white' : 'bg-transparent text-black hover:bg-gray-200',
              )}
            >
              {label}
            </button>
          </Link>
        )
      })}
    </div>
  )
}

export default NavigationTab
