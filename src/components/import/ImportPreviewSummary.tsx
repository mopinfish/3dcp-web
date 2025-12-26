/**
 * ImportPreviewSummary.tsx
 *
 * インポートプレビューのサマリー表示コンポーネント
 */

import React from 'react'
import { ImportPreviewResult } from '@/domains/models/import'

type ImportPreviewSummaryProps = {
  preview: ImportPreviewResult
}

export const ImportPreviewSummary: React.FC<ImportPreviewSummaryProps> = ({
  preview,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 プレビュー結果
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          ファイル: <span className="font-medium">{preview.filename}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 総件数 */}
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-700">
            {preview.total_rows.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">📄 総件数</div>
        </div>

        {/* 有効 */}
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {preview.valid_rows.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1">✅ 有効</div>
        </div>

        {/* 警告 */}
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {preview.warning_rows.toLocaleString()}
          </div>
          <div className="text-xs text-yellow-600 mt-1">⚠️ 警告</div>
        </div>

        {/* エラー + 重複 */}
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {(preview.error_rows + preview.duplicate_rows).toLocaleString()}
          </div>
          <div className="text-xs text-red-600 mt-1">
            ❌ エラー ({preview.error_rows}) / 🔄 重複 ({preview.duplicate_rows})
          </div>
        </div>
      </div>

      {/* インポート可能件数 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          インポート可能:{' '}
          <span className="font-bold text-green-600">
            {(preview.valid_rows + preview.warning_rows).toLocaleString()}件
          </span>
        </p>
      </div>
    </div>
  )
}

export default ImportPreviewSummary
