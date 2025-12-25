/**
 * CulturalPropertyFormContext.tsx
 *
 * 文化財登録フォームの状態管理用Context
 *
 * 登録フローでは複数画面にまたがるフォームデータを管理するため、
 * Context APIを使用してデータを共有します。
 *
 * フロー:
 * 1. /cultural-properties/new - 入力フォーム
 * 2. /cultural-properties/new/confirm - 確認画面
 * 3. /cultural-properties/new/complete - 完了画面
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { CulturalPropertyCreateRequest } from '@/domains/models/cultural_property'
import { MovieFormData } from '@/domains/models/movie'

/**
 * フォームデータの型定義
 */
export type CulturalPropertyFormData = {
  // 文化財情報
  culturalProperty: CulturalPropertyCreateRequest
  // ムービー情報（複数）
  movies: MovieFormData[]
}

/**
 * フォームの初期値
 */
const initialFormData: CulturalPropertyFormData = {
  culturalProperty: {
    name: '',
    name_kana: '',
    name_gener: '',
    name_en: '',
    category: '',
    type: '',
    place_name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    url: '',
    note: '',
    tags: [],
  },
  movies: [],
}

/**
 * Contextの型定義
 */
type CulturalPropertyFormContextType = {
  // フォームデータ
  formData: CulturalPropertyFormData
  // フォームデータを設定
  setFormData: React.Dispatch<React.SetStateAction<CulturalPropertyFormData>>
  // 文化財情報を更新
  updateCulturalProperty: (
    data: Partial<CulturalPropertyCreateRequest>,
  ) => void
  // ムービーを追加
  addMovie: (movie: MovieFormData) => void
  // ムービーを更新
  updateMovie: (index: number, movie: MovieFormData) => void
  // ムービーを削除
  removeMovie: (index: number) => void
  // フォームをリセット
  resetForm: () => void
  // フォームが有効かどうか
  isFormValid: () => boolean
  // 作成された文化財ID（完了画面で使用）
  createdId: number | null
  setCreatedId: (id: number | null) => void
}

/**
 * Context作成
 */
const CulturalPropertyFormContext = createContext<
  CulturalPropertyFormContextType | undefined
>(undefined)

/**
 * Provider Props
 */
type CulturalPropertyFormProviderProps = {
  children: ReactNode
}

/**
 * Provider コンポーネント
 */
export function CulturalPropertyFormProvider({
  children,
}: CulturalPropertyFormProviderProps) {
  const [formData, setFormData] =
    useState<CulturalPropertyFormData>(initialFormData)
  const [createdId, setCreatedId] = useState<number | null>(null)

  /**
   * 文化財情報を更新
   */
  const updateCulturalProperty = useCallback(
    (data: Partial<CulturalPropertyCreateRequest>) => {
      setFormData((prev) => ({
        ...prev,
        culturalProperty: {
          ...prev.culturalProperty,
          ...data,
        },
      }))
    },
    [],
  )

  /**
   * ムービーを追加
   */
  const addMovie = useCallback((movie: MovieFormData) => {
    setFormData((prev) => ({
      ...prev,
      movies: [...prev.movies, movie],
    }))
  }, [])

  /**
   * ムービーを更新
   */
  const updateMovie = useCallback((index: number, movie: MovieFormData) => {
    setFormData((prev) => ({
      ...prev,
      movies: prev.movies.map((m, i) => (i === index ? movie : m)),
    }))
  }, [])

  /**
   * ムービーを削除
   */
  const removeMovie = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      movies: prev.movies.filter((_, i) => i !== index),
    }))
  }, [])

  /**
   * フォームをリセット
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setCreatedId(null)
  }, [])

  /**
   * フォームのバリデーション
   */
  const isFormValid = useCallback((): boolean => {
    const { culturalProperty } = formData

    // 必須フィールドのチェック
    if (!culturalProperty.name || culturalProperty.name.trim() === '') {
      return false
    }
    if (!culturalProperty.type || culturalProperty.type.trim() === '') {
      return false
    }
    if (!culturalProperty.address || culturalProperty.address.trim() === '') {
      return false
    }
    if (!culturalProperty.latitude || !culturalProperty.longitude) {
      return false
    }

    // ムービーのバリデーション（ムービーがある場合のみ）
    for (const movie of formData.movies) {
      if (!movie.url || movie.url.trim() === '') {
        return false
      }
    }

    return true
  }, [formData])

  const value: CulturalPropertyFormContextType = {
    formData,
    setFormData,
    updateCulturalProperty,
    addMovie,
    updateMovie,
    removeMovie,
    resetForm,
    isFormValid,
    createdId,
    setCreatedId,
  }

  return (
    <CulturalPropertyFormContext.Provider value={value}>
      {children}
    </CulturalPropertyFormContext.Provider>
  )
}

/**
 * Context使用用フック
 */
export function useCulturalPropertyForm(): CulturalPropertyFormContextType {
  const context = useContext(CulturalPropertyFormContext)

  if (context === undefined) {
    throw new Error(
      'useCulturalPropertyForm must be used within a CulturalPropertyFormProvider',
    )
  }

  return context
}
