/**
 * import.ts
 *
 * CSVインポートAPI呼び出しリポジトリ
 */

import {
  ImportPreviewResponse,
  ImportExecuteRequest,
  ImportExecuteResponse,
} from '@/domains/models/import'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * CSVインポートリポジトリ
 */
export const importRepository = {
  /**
   * CSVファイルをアップロードしてプレビューを取得
   *
   * @param file CSVファイル
   * @param token 認証トークン
   * @param options オプション
   * @returns プレビュー結果
   */
  async preview(
    file: File,
    token: string,
    options?: {
      encoding?: string
      checkDuplicates?: boolean
    }
  ): Promise<ImportPreviewResponse> {
    const formData = new FormData()
    formData.append('file', file)

    if (options?.encoding) {
      formData.append('encoding', options.encoding)
    }
    if (options?.checkDuplicates !== undefined) {
      formData.append('check_duplicates', String(options.checkDuplicates))
    }

    const response = await fetch(`${API_BASE_URL}/api/import/preview/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'プレビューの取得に失敗しました')
    }

    return response.json()
  },

  /**
   * インポートを実行
   *
   * @param request インポート実行リクエスト
   * @param token 認証トークン
   * @returns インポート結果
   */
  async execute(
    request: ImportExecuteRequest,
    token: string
  ): Promise<ImportExecuteResponse> {
    const response = await fetch(`${API_BASE_URL}/api/import/execute/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'インポートの実行に失敗しました')
    }

    return response.json()
  },
}

export default importRepository
