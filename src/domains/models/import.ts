/**
 * import.ts
 *
 * CSVインポート機能のドメインモデル定義
 */

/**
 * インポート行のステータス
 */
export type ImportStatus = 'valid' | 'error' | 'duplicate' | 'warning'

/**
 * インポート対象の1行
 */
export type ImportRow = {
  row_number: number
  status: ImportStatus
  name: string | null
  name_kana: string | null
  name_en: string | null
  category: string | null
  type: string | null
  place_name: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  url: string | null
  note: string | null
  errors: string[]
  warnings: string[]
  duplicate_id: number | null
}

/**
 * プレビュー結果
 */
export type ImportPreviewResult = {
  filename: string
  total_rows: number
  valid_rows: number
  error_rows: number
  duplicate_rows: number
  warning_rows: number
  columns_detected: string[]
  rows: ImportRow[]
}

/**
 * プレビューAPIレスポンス
 */
export type ImportPreviewResponse = {
  success: boolean
  preview?: ImportPreviewResult
  session_id?: string
  error?: string
}

/**
 * インポート実行リクエスト
 */
export type ImportExecuteRequest = {
  session_id: string
  skip_errors?: boolean
  skip_duplicates?: boolean
  selected_rows?: number[]
}

/**
 * インポート実行結果
 */
export type ImportExecuteResult = {
  success: boolean
  imported_count: number
  skipped_count: number
  error_count: number
  duplicate_count: number
  errors: Array<{
    row?: number
    name?: string
    error?: string
    message?: string
  }>
  created_ids: number[]
}

/**
 * インポート実行APIレスポンス
 */
export type ImportExecuteResponse = {
  success: boolean
  result?: ImportExecuteResult
  error?: string
}

/**
 * インポート画面の状態
 */
export type ImportState =
  | 'idle'           // 初期状態
  | 'uploading'      // アップロード中
  | 'previewing'     // プレビュー解析中
  | 'previewed'      // プレビュー完了
  | 'importing'      // インポート中
  | 'completed'      // 完了
  | 'error'          // エラー
