/**
 * /cultural-properties/[id]/edit.tsx
 *
 * 文化財編集画面
 * - 既存の文化財情報を編集
 * - 所有者のみ編集可能
 * - 3D映像の追加・紐付け・解除機能
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { TextInput, TextArea, Select } from '@/components/common/FormField'
import {
  CulturalProperty,
  CulturalPropertyUpdateRequest,
  CULTURAL_PROPERTY_TYPES,
  CULTURAL_PROPERTY_CATEGORIES,
} from '@/domains/models/cultural_property'
import { Movie } from '@/domains/models/movie'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import * as MovieRepository from '@/infrastructures/repositories/movie'

const LocationPicker = dynamic(
  () => import('@/components/common/LocationPicker'),
  { ssr: false },
)

const typeOptions = CULTURAL_PROPERTY_TYPES.map((type) => ({ value: type, label: type }))
const categoryOptions = CULTURAL_PROPERTY_CATEGORIES.map((cat) => ({ value: cat, label: cat }))

export default function EditCulturalPropertyPage() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  const [property, setProperty] = useState<CulturalProperty | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  // ムービー関連
  const [linkedMovies, setLinkedMovies] = useState<Movie[]>([])
  const [unlinkedMovies, setUnlinkedMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [showAddMovieForm, setShowAddMovieForm] = useState(false)
  const [showLinkMovieModal, setShowLinkMovieModal] = useState(false)
  const [newMovieData, setNewMovieData] = useState({ url: '', title: '', note: '' })
  const [movieErrors, setMovieErrors] = useState<Record<string, string>>({})
  const [isAddingMovie, setIsAddingMovie] = useState(false)

  const [formData, setFormData] = useState({
    name: '', name_kana: '', name_gener: '', name_en: '',
    type: '', category: '', place_name: '', address: '',
    latitude: 0, longitude: 0, url: '', note: '',
  })

  const fetchProperty = useCallback(async () => {
    if (!id || typeof id !== 'string') return
    setIsLoading(true)
    try {
      const data = await CulturalPropertyRepository.getById(parseInt(id, 10))
      setProperty(data)
      setFormData({
        name: data.name || '', name_kana: data.name_kana || '',
        name_gener: data.name_gener || '', name_en: data.name_en || '',
        type: data.type || '', category: data.category || '',
        place_name: data.place_name || '', address: data.address || '',
        latitude: data.latitude || 0, longitude: data.longitude || 0,
        url: data.url || '', note: data.note || '',
      })
      if (data.movies) setLinkedMovies(data.movies)
    } catch (error) {
      console.error('Failed to fetch property:', error)
      setErrors({ general: '文化財の取得に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const fetchUnlinkedMovies = useCallback(async () => {
    setMoviesLoading(true)
    try {
      const response = await MovieRepository.getMy()
      setUnlinkedMovies(response.results.filter((m) => !m.cultural_property))
    } catch (error) {
      console.error('Failed to fetch movies:', error)
    } finally {
      setMoviesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/signin?redirect=/cultural-properties/${id}/edit`)
      return
    }
    if (router.isReady && id) {
      fetchProperty()
      fetchUnlinkedMovies()
    }
  }, [authLoading, isAuthenticated, router, id, fetchProperty, fetchUnlinkedMovies])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next })
  }

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: parseFloat(lat.toFixed(6)), longitude: parseFloat(lng.toFixed(6)) }))
    setErrors((prev) => { const next = { ...prev }; delete next.latitude; delete next.longitude; return next })
  }

  const handleAddressFound = (address: string) => {
    if (!formData.address) setFormData((prev) => ({ ...prev, address }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = '名称は必須です'
    if (!formData.type?.trim()) newErrors.type = '種別は必須です'
    if (!formData.address?.trim()) newErrors.address = '住所は必須です'
    if (!formData.latitude) newErrors.latitude = '地図をタップして位置を選択してください'
    if (!formData.longitude) newErrors.longitude = '地図をタップして位置を選択してください'
    if (formData.url && !formData.url.startsWith('http')) newErrors.url = '有効なURLを入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !property) return
    setIsSaving(true)
    setSuccessMessage('')
    try {
      const updateData: CulturalPropertyUpdateRequest = {
        name: formData.name, name_kana: formData.name_kana || undefined,
        name_gener: formData.name_gener || undefined, name_en: formData.name_en || undefined,
        type: formData.type, category: formData.category || undefined,
        place_name: formData.place_name || undefined, address: formData.address,
        latitude: formData.latitude, longitude: formData.longitude,
        url: formData.url || undefined, note: formData.note || undefined,
      }
      await CulturalPropertyRepository.update(property.id, updateData)
      setSuccessMessage('保存しました')
      setTimeout(() => router.push('/mypage'), 2000)
    } catch (error) {
      console.error('Failed to update property:', error)
      setErrors({ general: '保存に失敗しました。再度お試しください。' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddMovie = async () => {
    const newErrors: Record<string, string> = {}
    if (!newMovieData.url?.trim()) newErrors.url = 'URLは必須です'
    else if (!newMovieData.url.startsWith('http')) newErrors.url = '有効なURLを入力してください'
    if (Object.keys(newErrors).length > 0) { setMovieErrors(newErrors); return }
    setIsAddingMovie(true)
    setMovieErrors({})
    try {
      const createdMovie = await MovieRepository.create({
        url: newMovieData.url, title: newMovieData.title || undefined,
        note: newMovieData.note || undefined, cultural_property: property?.id,
      })
      setLinkedMovies((prev) => [...prev, createdMovie])
      setNewMovieData({ url: '', title: '', note: '' })
      setShowAddMovieForm(false)
    } catch (error) {
      console.error('Failed to add movie:', error)
      setMovieErrors({ general: 'ムービーの追加に失敗しました' })
    } finally {
      setIsAddingMovie(false)
    }
  }

  const handleLinkMovie = async (movie: Movie) => {
    try {
      await MovieRepository.update(movie.id, { cultural_property: property?.id })
      setLinkedMovies((prev) => [...prev, { ...movie, cultural_property: property?.id }])
      setUnlinkedMovies((prev) => prev.filter((m) => m.id !== movie.id))
      setShowLinkMovieModal(false)
    } catch (error) {
      console.error('Failed to link movie:', error)
      alert('紐付けに失敗しました')
    }
  }

  const handleUnlinkMovie = async (movie: Movie) => {
    if (!window.confirm(`「${movie.title || '3D映像'}」の紐付けを解除しますか？`)) return
    try {
      await MovieRepository.update(movie.id, { cultural_property: undefined })
      setLinkedMovies((prev) => prev.filter((m) => m.id !== movie.id))
      setUnlinkedMovies((prev) => [...prev, { ...movie, cultural_property: null }])
    } catch (error) {
      console.error('Failed to unlink movie:', error)
      alert('紐付け解除に失敗しました')
    }
  }

  const handleDeleteMovie = async (movie: Movie) => {
    if (!window.confirm(`「${movie.title || '3D映像'}」を削除しますか？この操作は取り消せません。`)) return
    try {
      await MovieRepository.remove(movie.id)
      setLinkedMovies((prev) => prev.filter((m) => m.id !== movie.id))
    } catch (error) {
      console.error('Failed to delete movie:', error)
      alert('削除に失敗しました')
    }
  }

  if (authLoading || isLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </LayoutWithFooter>
    )
  }

  if (!isAuthenticated) return null

  if (!property) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">文化財が見つかりませんでした</p>
          <Link href="/mypage" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">マイページに戻る</Link>
        </div>
      </LayoutWithFooter>
    )
  }

  const isOwner = property.created_by?.id === user?.id
  if (!isOwner && property.created_by) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="bg-red-50 rounded-xl p-6">
            <p className="text-lg font-medium text-red-800">この文化財を編集する権限がありません</p>
            <Link href="/mypage" className="mt-4 inline-flex items-center text-red-600 hover:text-red-800">マイページに戻る</Link>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Link href="/mypage" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 py-2 -ml-2 px-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">文化財を編集</h1>
          <p className="mt-2 text-base text-gray-600">「{property.name}」の情報を編集します</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
            <p className="mt-1 text-sm text-green-700 ml-7">まもなくマイページへ移動します...</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 基本情報 */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              基本情報
            </h2>
            <TextInput label="名称" name="name" value={formData.name} onChange={handleChange} placeholder="例: 〇〇神社本殿" required error={errors.name} />
            <TextInput label="名称（かな）" name="name_kana" value={formData.name_kana} onChange={handleChange} placeholder="例: まるまるじんじゃほんでん" />
            <TextInput label="名称（通称）" name="name_gener" value={formData.name_gener} onChange={handleChange} placeholder="例: 〇〇さん" />
            <TextInput label="名称（英語）" name="name_en" value={formData.name_en} onChange={handleChange} placeholder="例: Main Hall of XX Shrine" />
            <Select label="種別" name="type" value={formData.type} onChange={handleChange} options={typeOptions} required error={errors.type} />
            <Select label="カテゴリ" name="category" value={formData.category} onChange={handleChange} options={categoryOptions} placeholder="選択してください（任意）" />
          </div>

          {/* 所在地 */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              所在地
            </h2>
            <TextInput label="場所名" name="place_name" value={formData.place_name} onChange={handleChange} placeholder="例: 〇〇神社境内" />
            <TextInput label="住所" name="address" value={formData.address} onChange={handleChange} placeholder="例: 東京都千代田区..." required error={errors.address} />
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">位置を選択 <span className="text-red-500">*</span></label>
              <LocationPicker latitude={formData.latitude} longitude={formData.longitude} onLocationChange={handleLocationChange} onAddressFound={handleAddressFound} height="350px" />
              {(errors.latitude || errors.longitude) && <p className="mt-3 text-sm text-red-600">{errors.latitude || errors.longitude}</p>}
            </div>
          </div>

          {/* 3D映像 */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-5 sm:mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                3D映像
                {linkedMovies.length > 0 && <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{linkedMovies.length}</span>}
              </h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLinkMovieModal(true)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  既存を紐付け
                </button>
                <button type="button" onClick={() => setShowAddMovieForm(true)} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  新規追加
                </button>
              </div>
            </div>

            {linkedMovies.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p className="mt-3 text-gray-500">紐付けられた3D映像はありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedMovies.map((movie) => (
                  <div key={movie.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{movie.title || `3D映像 #${movie.id}`}</p>
                        <p className="text-xs text-gray-500 truncate">{movie.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Link href={`/luma/${movie.id}`} target="_blank" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="表示">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      <button type="button" onClick={() => handleUnlinkMovie(movie)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="紐付け解除">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDeleteMovie(movie)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="削除">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddMovieForm && (
              <div className="mt-5 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <h3 className="text-sm font-semibold text-purple-900 mb-4">新しい3D映像を追加</h3>
                {movieErrors.general && <p className="mb-3 text-sm text-red-600">{movieErrors.general}</p>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL <span className="text-red-500">*</span></label>
                    <input type="url" value={newMovieData.url} onChange={(e) => setNewMovieData((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://lumalabs.ai/capture/..." className={`w-full px-4 py-3 text-base border-2 rounded-lg ${movieErrors.url ? 'border-red-300' : 'border-gray-200'} focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`} />
                    {movieErrors.url && <p className="mt-1 text-sm text-red-600">{movieErrors.url}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input type="text" value={newMovieData.title} onChange={(e) => setNewMovieData((prev) => ({ ...prev, title: e.target.value }))} placeholder="映像のタイトル" className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                    <textarea value={newMovieData.note} onChange={(e) => setNewMovieData((prev) => ({ ...prev, note: e.target.value }))} placeholder="映像についての説明" rows={2} className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => { setShowAddMovieForm(false); setNewMovieData({ url: '', title: '', note: '' }); setMovieErrors({}) }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">キャンセル</button>
                  <button type="button" onClick={handleAddMovie} disabled={isAddingMovie} className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 ${isAddingMovie ? 'opacity-50 cursor-not-allowed' : ''}`}>{isAddingMovie ? '追加中...' : '追加する'}</button>
                </div>
              </div>
            )}
          </div>

          {/* 追加情報 */}
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              追加情報
            </h2>
            <TextInput label="関連URL" name="url" type="url" value={formData.url} onChange={handleChange} placeholder="https://..." error={errors.url} description="公式サイトなどの参考URL" />
            <TextArea label="備考" name="note" value={formData.note} onChange={handleChange} placeholder="その他の情報があれば入力してください" rows={4} />
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-8">
            <Link href="/mypage" className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-center text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">キャンセル</Link>
            <button type="submit" disabled={isSaving} className={`w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 border-2 border-transparent rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSaving ? (<><svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>保存中...</>) : (<><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>保存する</>)}
            </button>
          </div>
        </form>

        {/* 既存ムービー紐付けモーダル */}
        {showLinkMovieModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowLinkMovieModal(false)} />
              <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">既存の3D映像を紐付け</h3>
                    <button type="button" onClick={() => setShowLinkMovieModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {moviesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">読み込み中...</p>
                    </div>
                  ) : unlinkedMovies.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      <p className="mt-3 text-gray-500">紐付け可能な3D映像がありません</p>
                      <p className="mt-1 text-sm text-gray-400">新規追加から3D映像を作成してください</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {unlinkedMovies.map((movie) => (
                        <button key={movie.id} type="button" onClick={() => handleLinkMovie(movie)} className="w-full flex items-center p-3 bg-gray-50 rounded-xl hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-colors text-left">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{movie.title || `3D映像 #${movie.id}`}</p>
                            <p className="text-xs text-gray-500 truncate">{movie.url}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWithFooter>
  )
}
