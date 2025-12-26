/**
 * import.tsx
 *
 * 文化財CSVインポートページ
 */

import React, { useState, useCallback, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layouts/Layout'
import FileUploadArea from '@/components/import/FileUploadArea'
import ImportPreviewSummary from '@/components/import/ImportPreviewSummary'
import ImportPreviewTable from '@/components/import/ImportPreviewTable'
import {
  ImportState,
  ImportPreviewResult,
  ImportExecuteResult,
} from '@/domains/models/import'
import importRepository from '@/infrastructures/repositories/import'

// LocalStorageのキー（AuthContextと同じ）
const TOKEN_KEY = 'auth_token'

const ImportPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  const [state, setState] = useState<ImportState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [result, setResult] = useState<ImportExecuteResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skipErrors, setSkipErrors] = useState(true)
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // トークンをLocalStorageから取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      setToken(storedToken)
    }
  }, [user])

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setPreview(null)
    setSessionId(null)
    setResult(null)
    setError(null)
    setState('idle')
  }, [])

  const handlePreview = useCallback(async () => {
    if (!selectedFile || !token) return
    setState('previewing')
    setError(null)
    try {
      const response = await importRepository.preview(selectedFile, token)
      if (response.success && response.preview && response.session_id) {
        setPreview(response.preview)
        setSessionId(response.session_id)
        setState('previewed')
      } else {
        setError(response.error || 'プレビューの取得に失敗しました')
        setState('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setState('error')
    }
  }, [selectedFile, token])

  const handleImport = useCallback(async () => {
    if (!sessionId || !token) return
    setState('importing')
    setError(null)
    try {
      const response = await importRepository.execute(
        { session_id: sessionId, skip_errors: skipErrors, skip_duplicates: skipDuplicates },
        token
      )
      if (response.success && response.result) {
        setResult(response.result)
        setState('completed')
      } else {
        setError(response.error || 'インポートに失敗しました')
        setState('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setState('error')
    }
  }, [sessionId, token, skipErrors, skipDuplicates])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
    setSessionId(null)
    setResult(null)
    setError(null)
    setState('idle')
  }, [])

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h1>
          <p className="text-gray-600 mb-6">CSVインポート機能を利用するにはログインしてください。</p>
          <Link href="/signin" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ログイン
          </Link>
        </div>
      </Layout>
    )
  }

  // ローディング状態
  const isProcessing = state === 'uploading' || state === 'previewing' || state === 'importing'

  return (
    <Layout>
      <Head>
        <title>文化財CSVインポート | 3D文化財共有サイト</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">トップ</Link></li>
            <li>/</li>
            <li className="text-gray-800">文化財CSVインポート</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📥 文化財CSVインポート</h1>

        {/* 完了状態 */}
        {state === 'completed' && result && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">インポート完了</h2>
              <p className="text-green-700">{result.imported_count.toLocaleString()}件の文化財データを登録しました</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">インポート結果</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-green-600">{result.imported_count}</div>
                  <div className="text-green-600">成功</div>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-gray-600">{result.skipped_count}</div>
                  <div className="text-gray-600">スキップ</div>
                </div>
                <div className="bg-red-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-red-600">{result.error_count}</div>
                  <div className="text-red-600">エラー</div>
                </div>
                <div className="bg-orange-50 p-3 rounded text-center">
                  <div className="text-lg font-bold text-orange-600">{result.duplicate_count}</div>
                  <div className="text-orange-600">重複</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/map" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">文化財一覧へ</Link>
              <button onClick={handleReset} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">続けてインポート</button>
              <Link href="/mypage" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">マイページへ</Link>
            </div>
          </div>
        )}

        {/* プレビュー確認状態 */}
        {state === 'previewed' && preview && (
          <div className="space-y-6">
            <ImportPreviewSummary preview={preview} />
            <ImportPreviewTable rows={preview.rows} />
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">インポートオプション</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" checked={skipErrors} onChange={(e) => setSkipErrors(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">エラー行をスキップしてインポート</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={skipDuplicates} onChange={(e) => setSkipDuplicates(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">重複行をスキップしてインポート</span>
                </label>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
              <button onClick={handleReset} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">← 戻る</button>
              <button onClick={handleImport} disabled={preview.valid_rows + preview.warning_rows === 0} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                有効なデータをインポート（{(preview.valid_rows + preview.warning_rows).toLocaleString()}件）
              </button>
            </div>
          </div>
        )}

        {/* 初期状態・エラー状態 */}
        {(state === 'idle' || state === 'error') && (
          <div className="space-y-6">
            <FileUploadArea onFileSelect={handleFileSelect} disabled={false} />
            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">選択されたファイル</p>
                    <p className="text-sm text-blue-600">{selectedFile.name}</p>
                    <p className="text-xs text-blue-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="text-blue-600 hover:text-blue-800">✕</button>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div className="flex justify-center">
              <button onClick={handlePreview} disabled={!selectedFile || !token} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                CSVファイルを解析
              </button>
            </div>
          </div>
        )}

        {/* ローディング状態 */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">
              {state === 'uploading' && 'アップロード中...'}
              {state === 'previewing' && 'CSVを解析中...'}
              {state === 'importing' && 'インポート中...'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ImportPage
