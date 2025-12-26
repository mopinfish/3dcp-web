/**
 * /movies/new/index.tsx
 *
 * ムービー新規登録ページ
 * ステップウィザード形式で3Dモデルを登録
 * 
 * Step 1: 3DモデルURL入力
 * Step 2: 詳細情報入力（タイトル、備考）
 * Step 3: 文化財との紐付け（オプション）
 * Step 4: 確認・完了
 * 
 * ✅ SNSシェア機能追加:
 * - 完了画面でSNSシェアボタンを表示
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { TextInput, TextArea } from '@/components/common/FormField'
import { Movie, MovieCreateRequest } from '@/domains/models/movie'
import { CulturalProperty } from '@/domains/models/cultural_property'
import * as MovieRepository from '@/infrastructures/repositories/movie'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import SnsShareButtons from '@/components/blocks/SnsShareButtons'

type Step = 1 | 2 | 3 | 4

type FormData = {
  url: string
  title: string
  note: string
  cultural_property_id: number | null
}

const STEPS = [
  { number: 1, title: '3DモデルURL', description: 'Luma AIのURLを入力' },
  { number: 2, title: '詳細情報', description: 'タイトルと説明を入力' },
  { number: 3, title: '文化財と紐付け', description: '任意で文化財を選択' },
  { number: 4, title: '確認・完了', description: '内容を確認して登録' },
]

export default function NewMoviePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    note: '',
    cultural_property_id: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdMovie, setCreatedMovie] = useState<Movie | null>(null)

  // 文化財選択用
  const [myProperties, setMyProperties] = useState<CulturalProperty[]>([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/movies/new')
    }
  }, [authLoading, isAuthenticated, router])

  // マイ文化財を取得
  const fetchMyProperties = useCallback(async () => {
    setPropertiesLoading(true)
    try {
      const response = await CulturalPropertyRepository.getMy()
      setMyProperties(response.results)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setPropertiesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyProperties()
    }
  }, [isAuthenticated, fetchMyProperties])

  // URLからクエリパラメータを取得（文化財ページからの遷移用）
  useEffect(() => {
    if (router.isReady && router.query.cultural_property_id) {
      const cpId = parseInt(router.query.cultural_property_id as string, 10)
      if (!isNaN(cpId)) {
        setFormData(prev => ({ ...prev, cultural_property_id: cpId }))
      }
    }
  }, [router.isReady, router.query])

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Step 1のバリデーション
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.url.trim()) {
      newErrors.url = 'URLは必須です'
    } else if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      newErrors.url = '有効なURLを入力してください'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 次のステップへ
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  // 前のステップへ
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  // 文化財を選択
  const handleSelectProperty = (property: CulturalProperty | null) => {
    setFormData(prev => ({
      ...prev,
      cultural_property_id: property?.id || null,
    }))
  }

  // 登録処理
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrors({})

    try {
      const createData: MovieCreateRequest = {
        url: formData.url,
        title: formData.title || undefined,
        note: formData.note || undefined,
        cultural_property: formData.cultural_property_id || undefined,
      }

      const movie = await MovieRepository.create(createData)
      setCreatedMovie(movie)
      setCurrentStep(4)
    } catch (error) {
      console.error('Failed to create movie:', error)
      setErrors({ general: '登録に失敗しました。再度お試しください。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // シェア用のURL
  const getShareUrl = () => {
    if (typeof window !== 'undefined' && createdMovie) {
      // 紐付いている文化財がある場合はそのページ、なければ3DモデルページのURLを使用
      if (createdMovie.cultural_property) {
        return `${window.location.origin}/cultural-properties/${createdMovie.cultural_property}`
      }
      return `${window.location.origin}/luma/${createdMovie.id}`
    }
    return ''
  }

  // ローディング中
  if (authLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </LayoutWithFooter>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // 選択中の文化財を取得
  const selectedProperty = myProperties.find(p => p.id === formData.cultural_property_id)

  // 検索でフィルタリング
  const filteredProperties = myProperties.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/mypage"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 py-2 -ml-2 px-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            3Dモデルを新規登録
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Luma AIで作成した3Dモデルを登録します
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      ${currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                      ${currentStep === step.number ? 'ring-4 ring-blue-100' : ''}
                    `}
                  >
                    {createdMovie && step.number === 4 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`mt-2 text-xs text-center hidden sm:block ${
                    currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* エラーメッセージ */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Step 1: URL入力 */}
        {currentStep === 1 && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              3DモデルのURLを入力
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Luma AIで作成した3Dモデルの共有URLを入力してください
            </p>

            <TextInput
              label="3DモデルURL"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://lumalabs.ai/capture/..."
              required
              error={errors.url}
              description="Luma AIの共有URLをコピーして貼り付けてください"
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                💡 Luma AIのURLを取得する方法
              </h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Luma AIで3Dモデルを作成する</li>
                <li>作成したモデルのページを開く</li>
                <li>「共有」ボタンをクリック</li>
                <li>URLをコピーしてここに貼り付け</li>
              </ol>
            </div>
          </div>
        )}

        {/* Step 2: 詳細情報入力 */}
        {currentStep === 2 && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              詳細情報を入力
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              3Dモデルのタイトルや説明を入力してください（任意）
            </p>

            <TextInput
              label="タイトル"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例: 〇〇寺の本堂"
              description="3Dモデルの名前を入力してください"
            />

            <TextArea
              label="備考"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="撮影日や撮影条件など、メモがあれば入力してください"
              rows={4}
            />
          </div>
        )}

        {/* Step 3: 文化財との紐付け */}
        {currentStep === 3 && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              文化財と紐付ける（任意）
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              この3Dモデルを既存の文化財と紐付けることができます。後から設定することも可能です。
            </p>

            {/* 選択中の文化財 */}
            {selectedProperty && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                      {selectedProperty.movies?.[0]?.thumbnail_url ? (
                        <img
                          src={selectedProperty.movies[0].thumbnail_url}
                          alt={selectedProperty.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{selectedProperty.name}</p>
                      <p className="text-sm text-blue-700">{selectedProperty.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectProperty(null)}
                    className="text-blue-600 hover:text-blue-800 p-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* 検索 */}
            {!selectedProperty && (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="文化財を検索..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 文化財一覧 */}
                {propertiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">読み込み中...</p>
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p>登録済みの文化財がありません</p>
                    <Link
                      href="/cultural-properties/new"
                      className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      文化財を登録する
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredProperties.map((property) => (
                      <button
                        key={property.id}
                        onClick={() => handleSelectProperty(property)}
                        className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer text-left"
                      >
                        <div className="w-10 h-10 rounded bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                          {property.movies?.[0]?.thumbnail_url ? (
                            <img
                              src={property.movies[0].thumbnail_url}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{property.name}</p>
                          <p className="text-sm text-gray-500 truncate">{property.address}</p>
                        </div>
                        {property.movies && property.movies.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            3D: {property.movies.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* スキップボタン */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={handleNextStep}
                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
              >
                スキップして後で設定する →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 確認・完了 */}
        {currentStep === 4 && (
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            {createdMovie ? (
              // 登録完了
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  登録が完了しました！
                </h2>
                <p className="text-gray-600 mb-6">
                  3Dモデルの登録が完了しました。サムネイルは自動生成されます。
                </p>

                {/* SNSシェアボタン */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">
                    🎉 登録した3Dモデルをシェアしましょう！
                  </p>
                  <SnsShareButtons
                    url={getShareUrl()}
                    title={createdMovie.title || '3Dモデル'}
                    description={createdMovie.note || undefined}
                    hashtags={['3D文化財']}
                    shareType="registration_complete"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href={`/luma/${createdMovie.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    3Dモデルを見る
                  </Link>
                  {createdMovie.cultural_property && (
                    <Link
                      href={`/cultural-properties/${createdMovie.cultural_property}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      文化財を見る
                    </Link>
                  )}
                  <Link
                    href="/movies/new"
                    onClick={() => {
                      setFormData({ url: '', title: '', note: '', cultural_property_id: null })
                      setCurrentStep(1)
                      setCreatedMovie(null)
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    続けて登録する
                  </Link>
                  <Link
                    href="/mypage"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    マイページへ
                  </Link>
                </div>
              </div>
            ) : (
              // 確認画面
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  内容を確認
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  以下の内容で登録します。よろしければ「登録する」ボタンをクリックしてください。
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">3DモデルURL</p>
                    <p className="text-gray-900 break-all">{formData.url}</p>
                  </div>

                  {formData.title && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">タイトル</p>
                      <p className="text-gray-900">{formData.title}</p>
                    </div>
                  )}

                  {formData.note && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">備考</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.note}</p>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">紐付け文化財</p>
                    {selectedProperty ? (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-gray-200 mr-3 overflow-hidden">
                          {selectedProperty.movies?.[0]?.thumbnail_url ? (
                            <img
                              src={selectedProperty.movies[0].thumbnail_url}
                              alt={selectedProperty.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedProperty.name}</p>
                          <p className="text-sm text-gray-500">{selectedProperty.address}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">なし（後から設定可能）</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ナビゲーションボタン */}
        {!createdMovie && (
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ← 戻る
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl
                  hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    登録中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    登録する
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </LayoutWithFooter>
  )
}
