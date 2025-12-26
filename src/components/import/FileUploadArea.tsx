/**
 * FileUploadArea.tsx
 *
 * CSVファイルアップロードエリアコンポーネント
 * ドラッグ&ドロップまたはクリックでファイルを選択
 */

import React, { useCallback, useState, useRef } from 'react'

type FileUploadAreaProps = {
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  accept = '.csv',
  maxSizeMB = 10,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      // ファイル拡張子チェック
      if (!file.name.toLowerCase().endsWith('.csv')) {
        return 'CSVファイルのみアップロード可能です'
      }

      // ファイルサイズチェック
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        return `ファイルサイズが${maxSizeMB}MBを超えています`
      }

      return null
    },
    [maxSizeMB]
  )

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      onFileSelect(file)
    },
    [validateFile, onFileSelect]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [disabled, handleFile]
  )

  const handleClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
      // 同じファイルを再選択できるようにリセット
      e.target.value = ''
    },
    [handleFile]
  )

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center
          cursor-pointer transition-colors duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* アイコン */}
        <div className="mb-4">
          <svg
            className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* テキスト */}
        <p className="mb-2 text-sm text-gray-600">
          <span className="font-semibold">クリックしてファイルを選択</span>
          <span className="hidden sm:inline"> または ドラッグ&ドロップ</span>
        </p>
        <p className="text-xs text-gray-500">
          CSVファイル（最大{maxSizeMB}MB）
        </p>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 対応フォーマット説明 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">対応フォーマット</h4>
        <p className="text-xs text-gray-600 mb-2">
          デジタル庁 自治体標準データセット形式（文化財）に対応しています。
        </p>
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">必須カラム:</p>
          <ul className="list-disc list-inside ml-2 space-y-0.5">
            <li>名称</li>
            <li>種類</li>
            <li>所在地_連結表記（または住所）</li>
            <li>緯度</li>
            <li>経度</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FileUploadArea
