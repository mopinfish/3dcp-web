/**
 * ActiveUserRanking.tsx
 *
 * アクティブユーザーランキングコンポーネント
 * APIからアクティブユーザーを取得して表示
 * 
 * ✅ Phase 3対応:
 * - ユーザー名をクリックするとプロフィールページに遷移
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { user as userService } from '@/domains/services'
import { ActiveUsers } from '@/domains/models/active_user'

type Props = {
  /** 表示件数（デフォルト: 5） */
  limit?: number
  /** タイトル（デフォルト: アクティブユーザー） */
  title?: string
  /** タイトルアイコン */
  icon?: React.ReactNode
}

const ActiveUserRanking: React.FC<Props> = ({
  limit = 5,
  title = 'アクティブユーザー',
  icon = '👥',
}) => {
  const [users, setUsers] = useState<ActiveUsers>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userService.getActiveUsers(limit)
        setUsers(data)
      } catch (err) {
        console.error('アクティブユーザーの取得エラー:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">アクティブなユーザーはまだいません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      
      <div className="space-y-3">
        {users.map((user, index) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* 順位バッジ */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 ${
              index === 0 ? 'bg-yellow-400 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-700' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-gray-600'
            }`}>
              {index + 1}
            </div>
            
            {/* アバター */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex-shrink-0">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name || user.username}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized={user.avatar_url.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
                  {(user.name || user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* ユーザー情報 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate hover:text-blue-600">
                {user.name || user.username}
              </p>
              <p className="text-xs text-gray-500">
                文化財: {user.cultural_property_count}件 / 3Dモデル: {user.movie_count}件
              </p>
            </div>
            
            {/* 合計登録数 */}
            <div className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              {user.total_count}件
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ActiveUserRanking
