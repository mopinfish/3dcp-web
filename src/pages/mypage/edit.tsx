import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { UpdateProfileRequest } from '@/domains/models/user'
import * as authRepo from '@/infrastructures/repositories/auth'

function EditProfileContent() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()

  const [formData, setFormData] = useState<{
    name: string
    bio: string
    avatar: File | null
  }>({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: null,
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  /**
   * フォーム入力変更ハンドラー
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  /**
   * アバター画像変更ハンドラー
   */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイルサイズチェック(5MB以下)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: 'ファイルサイズは5MB以下にしてください',
        }))
        return
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          avatar: '画像ファイルを選択してください',
        }))
        return
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }))

      // プレビュー表示
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // エラーをクリア
      if (errors.avatar) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.avatar
          return newErrors
        })
      }
    }
  }

  /**
   * バリデーション
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.name && formData.name.length > 100) {
      newErrors.name = '名前は100文字以内で入力してください'
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = '自己紹介は500文字以内で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * フォーム送信ハンドラー
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // トークンを取得
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('認証トークンが見つかりません')
      }

      // 🔧 修正: 変更されたフィールドのみを送信する
      const updateData: UpdateProfileRequest = {}

      // 名前が変更されている場合のみ追加
      if (formData.name !== (user?.name || '')) {
        updateData.name = formData.name
      }

      // bioが変更されている場合のみ追加
      if (formData.bio !== (user?.bio || '')) {
        updateData.bio = formData.bio
      }

      // アバターが選択されている場合は追加
      if (formData.avatar) {
        updateData.avatar = formData.avatar
      }

      // 🔧 修正: 何も変更されていない場合の処理
      if (Object.keys(updateData).length === 0) {
        setSuccessMessage('変更はありませんでした')
        setIsLoading(false)

        // 2秒後にマイページへリダイレクト
        setTimeout(() => {
          router.push('/mypage')
        }, 2000)
        return
      }

      console.log('Updating profile with data:', updateData)

      // プロフィール更新
      await authRepo.updateProfile(token, updateData)

      // ユーザー情報を再取得
      await refreshUser()

      setSuccessMessage('プロフィールを更新しました')

      // 2秒後にマイページへリダイレクト
      setTimeout(() => {
        router.push('/mypage')
      }, 2000)
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({
        submit: 'プロフィールの更新に失敗しました。もう一度お試しください。',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/mypage"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="ml-2">マイページへ戻る</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">プロフィールを編集</h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              トップページ
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            {/* 成功メッセージ */}
            {successMessage && (
              <div className="mb-6 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* アバター画像 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">アバター画像</label>
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    画像を選択
                  </label>
                  <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF形式。最大5MB。</p>
                </div>
              </div>
              {errors.avatar && <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>}
            </div>

            {/* 名前 */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="山田 太郎"
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* 自己紹介 */}
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="自己紹介を入力してください"
              />
              <p className="mt-2 text-xs text-gray-500">{formData.bio.length} / 500文字</p>
              {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio}</p>}
            </div>

            {/* エラーメッセージ */}
            {errors.submit && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/mypage"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  )
}
