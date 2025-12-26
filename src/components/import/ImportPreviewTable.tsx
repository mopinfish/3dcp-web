/**
 * ImportPreviewTable.tsx
 *
 * インポートプレビューのテーブル表示コンポーネント
 */

import React, { useState, useMemo } from 'react'
import { ImportRow, ImportStatus } from '@/domains/models/import'

type ImportPreviewTableProps = {
  rows: ImportRow[]
  pageSize?: number
}

type FilterType = 'all' | 'valid' | 'warning' | 'error' | 'duplicate'

const statusConfig: Record<
  ImportStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  valid: {
    label: 'OK',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '✅',
  },
  warning: {
    label: '警告',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '⚠️',
  },
  error: {
    label: 'エラー',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: '❌',
  },
  duplicate: {
    label: '重複',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: '🔄',
  },
}

export const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({
  rows,
  pageSize = 20,
}) => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const filteredRows = useMemo(() => {
    if (filter === 'all') return rows
    const statusMap: Record<FilterType, ImportStatus | undefined> = {
      all: undefined,
      valid: 'valid',
      warning: 'warning',
      error: 'error',
      duplicate: 'duplicate',
    }
    return rows.filter((row) => row.status === statusMap[filter])
  }, [rows, filter])

  const totalPages = Math.ceil(filteredRows.length / pageSize)
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, currentPage, pageSize])

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const renderStatusBadge = (status: ImportStatus) => {
    const config = statusConfig[status]
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.icon} {config.label}
      </span>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* フィルター */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            すべて ({rows.length})
          </button>
          <button
            onClick={() => handleFilterChange('valid')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'valid'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
          >
            ✅ 有効 ({rows.filter((r) => r.status === 'valid').length})
          </button>
          <button
            onClick={() => handleFilterChange('warning')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            ⚠️ 警告 ({rows.filter((r) => r.status === 'warning').length})
          </button>
          <button
            onClick={() => handleFilterChange('error')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            ❌ エラー ({rows.filter((r) => r.status === 'error').length})
          </button>
          <button
            onClick={() => handleFilterChange('duplicate')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'duplicate'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            }`}
          >
            🔄 重複 ({rows.filter((r) => r.status === 'duplicate').length})
          </button>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">分類</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">住所</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">状態</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRows.map((row) => (
              <React.Fragment key={row.row_number}>
                <tr
                  className={`hover:bg-gray-50 cursor-pointer ${
                    row.status === 'error' ? 'bg-red-50' : ''
                  } ${row.status === 'duplicate' ? 'bg-orange-50' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === row.row_number ? null : row.row_number)}
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{row.row_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{row.name || '(名称なし)'}</div>
                    {row.name_kana && <div className="text-xs text-gray-500">{row.name_kana}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                    <div className="truncate max-w-xs">{row.category || '-'}</div>
                    <div className="text-xs text-gray-400">{row.type || '-'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    <div className="truncate max-w-xs">{row.address || '-'}</div>
                  </td>
                  <td className="px-4 py-3">{renderStatusBadge(row.status)}</td>
                </tr>

                {expandedRow === row.row_number && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium text-gray-600">住所:</span> {row.address || '-'}</div>
                          <div><span className="font-medium text-gray-600">座標:</span> {row.latitude && row.longitude ? `${row.latitude}, ${row.longitude}` : '-'}</div>
                          <div><span className="font-medium text-gray-600">場所:</span> {row.place_name || '-'}</div>
                          <div>
                            <span className="font-medium text-gray-600">URL:</span>{' '}
                            {row.url ? <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>リンク</a> : '-'}
                          </div>
                        </div>

                        {row.errors.length > 0 && (
                          <div className="p-2 bg-red-100 rounded">
                            <p className="text-xs font-medium text-red-800 mb-1">エラー:</p>
                            <ul className="list-disc list-inside text-xs text-red-700">
                              {row.errors.map((error, idx) => <li key={idx}>{error}</li>)}
                            </ul>
                          </div>
                        )}

                        {row.warnings.length > 0 && (
                          <div className="p-2 bg-yellow-100 rounded">
                            <p className="text-xs font-medium text-yellow-800 mb-1">警告:</p>
                            <ul className="list-disc list-inside text-xs text-yellow-700">
                              {row.warnings.map((warning, idx) => <li key={idx}>{warning}</li>)}
                            </ul>
                          </div>
                        )}

                        {row.duplicate_id && (
                          <div className="p-2 bg-orange-100 rounded">
                            <p className="text-xs text-orange-800">既存データ (ID: {row.duplicate_id}) と重複しています</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {filteredRows.length}件中 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRows.length)}件
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              前へ
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImportPreviewTable
