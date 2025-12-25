/**
 * /cultural-properties/new/index.tsx
 *
 * 文化財登録フォーム画面
 *
 * Step 1: 文化財情報の入力
 * - 基本情報（名前、種別、住所など）
 * - 位置情報（緯度・経度）← 地図から選択可能
 * - 3D映像（任意、複数追加可能）
 * - スマートフォン対応のUI
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useCulturalPropertyForm } from '@/contexts/CulturalPropertyFormContext'
import { TextInput, TextArea, Select } from '@/components/common/FormField'
import { MovieListInput } from '@/components/movie/MovieListInput'
import {
  CULTURAL_PROPERTY_TYPES,
  CULTURAL_PROPERTY_CATEGORIES,
} from '@/domains/models/cultural_property'

// LocationPickerはクライアントサイドのみで動作（MapLibre GL）
const LocationPicker = dynamic(
  () => import('@/components/common/LocationPicker'),
  { ssr: false },
)

/**
 * 文化財種別のオプション
 */
const typeOptions = CULTURAL_PROPERTY_TYPES.map((type) => ({
  value: type,
  label: type,
}))

/**
 * 文化財カテゴリのオプション
 */
const categoryOptions = CULTURAL_PROPERTY_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

/**
 * フォームコンテンツ（Contextを使用）
 */
function FormContent() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    formData,
    updateCulturalProperty,
    addMovie,
    updateMovie,
    removeMovie,
  } = useCulturalPropertyForm()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/cultural-properties/new')
    }
  }, [authLoading, isAuthenticated, router])

  /**
   * 入力変更ハンドラ
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target

    // 数値フィールドの処理
    if (name === 'latitude' || name === 'longitude') {
      const numValue = value === '' ? 0 : parseFloat(value)
      updateCulturalProperty({ [name]: numValue })
    } else {
      updateCulturalProperty({ [name]: value })
    }

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  /**
   * 地図からの位置選択ハンドラ
   */
  const handleLocationChange = (lat: number, lng: number) => {
    updateCulturalProperty({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    })

    // エラーをクリア
    setErrors((prev) => {
      const next = { ...prev }
      delete next.latitude
      delete next.longitude
      return next
    })
  }

  /**
   * 逆ジオコーディングで住所が見つかった時のハンドラ
   */
  const handleAddressFound = (address: string) => {
    // 住所が未入力の場合のみ自動入力
    if (!formData.culturalProperty.address) {
      updateCulturalProperty({ address })

      // エラーをクリア
      setErrors((prev) => {
        const next = { ...prev }
        delete next.address
        return next
      })
    }
  }

  /**
   * フォームバリデーション
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const { culturalProperty } = formData

    if (!culturalProperty.name || culturalProperty.name.trim() === '') {
      newErrors.name = '名称は必須です'
    }

    if (!culturalProperty.type || culturalProperty.type.trim() === '') {
      newErrors.type = '種別は必須です'
    }

    if (!culturalProperty.address || culturalProperty.address.trim() === '') {
      newErrors.address = '住所は必須です'
    }

    if (!culturalProperty.latitude || culturalProperty.latitude === 0) {
      newErrors.latitude = '地図をタップして位置を選択してください'
    } else if (
      culturalProperty.latitude < -90 ||
      culturalProperty.latitude > 90
    ) {
      newErrors.latitude = '緯度は-90から90の範囲で入力してください'
    }

    if (!culturalProperty.longitude || culturalProperty.longitude === 0) {
      newErrors.longitude = '地図をタップして位置を選択してください'
    } else if (
      culturalProperty.longitude < -180 ||
      culturalProperty.longitude > 180
    ) {
      newErrors.longitude = '経度は-180から180の範囲で入力してください'
    }

    // URL形式チェック
    if (
      culturalProperty.url &&
      !culturalProperty.url.startsWith('http://') &&
      !culturalProperty.url.startsWith('https://')
    ) {
      newErrors.url = '有効なURLを入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * 確認画面へ進む
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (validateForm()) {
      router.push('/cultural-properties/new/confirm')
    }

    setIsSubmitting(false)
  }

  // 認証ローディング中
  if (authLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null
  }

  const { culturalProperty, movies } = formData

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="
              inline-flex items-center
              text-gray-600 hover:text-gray-900
              mb-4
              py-2
              -ml-2 px-2
              rounded-lg
              hover:bg-gray-100
              transition-colors duration-200
            "
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            新しい文化財を登録
          </h1>
          <p className="mt-2 text-base text-gray-600">
            文化財の情報を入力してください。
            <span className="text-red-500">*</span> は必須項目です。
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md">
                1
              </div>
              <span className="ml-2 text-sm font-semibold text-blue-600 hidden sm:inline">
                入力
              </span>
            </div>
            <div className="w-10 sm:w-16 h-1 bg-gray-200 mx-2 sm:mx-4 rounded"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded-full text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-400 hidden sm:inline">
                確認
              </span>
            </div>
            <div className="w-10 sm:w-16 h-1 bg-gray-200 mx-2 sm:mx-4 rounded"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded-full text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-400 hidden sm:inline">
                完了
              </span>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          {/* 基本情報セクション */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              基本情報
            </h2>

            <TextInput
              label="名称"
              name="name"
              value={culturalProperty.name}
              onChange={handleChange}
              placeholder="例: 〇〇神社本殿"
              required
              error={errors.name}
            />

            <TextInput
              label="名称（かな）"
              name="name_kana"
              value={culturalProperty.name_kana || ''}
              onChange={handleChange}
              placeholder="例: まるまるじんじゃほんでん"
            />

            <TextInput
              label="名称（通称）"
              name="name_gener"
              value={culturalProperty.name_gener || ''}
              onChange={handleChange}
              placeholder="例: 〇〇さん"
            />

            <TextInput
              label="名称（英語）"
              name="name_en"
              value={culturalProperty.name_en || ''}
              onChange={handleChange}
              placeholder="例: Main Hall of XX Shrine"
            />

            <Select
              label="種別"
              name="type"
              value={culturalProperty.type}
              onChange={handleChange}
              options={typeOptions}
              required
              error={errors.type}
            />

            <Select
              label="カテゴリ"
              name="category"
              value={culturalProperty.category || ''}
              onChange={handleChange}
              options={categoryOptions}
              placeholder="選択してください（任意）"
            />
          </div>

          {/* 所在地セクション */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              所在地
              <span className="text-red-500 ml-1 font-normal text-base">*</span>
            </h2>

            <TextInput
              label="場所名"
              name="place_name"
              value={culturalProperty.place_name || ''}
              onChange={handleChange}
              placeholder="例: 〇〇神社境内"
            />

            <TextInput
              label="住所"
              name="address"
              value={culturalProperty.address}
              onChange={handleChange}
              placeholder="例: 東京都千代田区..."
              required
              error={errors.address}
              description="地図で位置を選択すると自動入力されます"
            />

            {/* 地図による位置選択 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                位置を選択 <span className="text-red-500 font-normal">*</span>
              </label>
              <LocationPicker
                latitude={culturalProperty.latitude}
                longitude={culturalProperty.longitude}
                onLocationChange={handleLocationChange}
                onAddressFound={handleAddressFound}
                height="350px"
              />
              {(errors.latitude || errors.longitude) && (
                <p className="mt-3 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.latitude || errors.longitude}
                </p>
              )}
            </div>
          </div>

          {/* 追加情報セクション */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              追加情報
            </h2>

            <TextInput
              label="関連URL"
              name="url"
              type="url"
              value={culturalProperty.url || ''}
              onChange={handleChange}
              placeholder="https://..."
              error={errors.url}
              description="公式サイトなどの参考URL"
            />

            <TextArea
              label="備考"
              name="note"
              value={culturalProperty.note || ''}
              onChange={handleChange}
              placeholder="その他の情報があれば入力してください"
              rows={4}
            />
          </div>

          {/* 3D映像セクション */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              3D映像
              <span className="ml-2 text-sm font-normal text-gray-500">
                （任意）
              </span>
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Luma AIなどで生成した3D映像を追加できます。
            </p>

            <MovieListInput
              movies={movies}
              onAdd={addMovie}
              onUpdate={updateMovie}
              onRemove={removeMovie}
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-8">
            <Link
              href="/"
              className="
                w-full sm:w-auto
                px-6 py-3.5
                text-base font-medium text-center
                text-gray-700
                bg-white
                border-2 border-gray-300
                rounded-xl
                hover:bg-gray-50
                active:bg-gray-100
                transition-colors duration-200
              "
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full sm:w-auto
                px-8 py-3.5
                text-base font-semibold
                text-white
                bg-blue-600
                border-2 border-transparent
                rounded-xl
                hover:bg-blue-700
                active:bg-blue-800
                transition-all duration-200
                shadow-md hover:shadow-lg
                flex items-center justify-center
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  処理中...
                </>
              ) : (
                <>
                  確認画面へ
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </LayoutWithFooter>
  )
}

/**
 * ページコンポーネント
 */
export default function NewCulturalPropertyPage() {
  return <FormContent />
}
