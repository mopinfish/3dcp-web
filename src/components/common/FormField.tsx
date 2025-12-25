/**
 * FormField.tsx
 *
 * フォームフィールドの共通コンポーネント
 *
 * - ラベル、入力フィールド、エラーメッセージを統一的に表示
 * - 必須マーク、説明文の表示に対応
 * - スマートフォンでも入力しやすいUIデザイン
 */

import React, { ReactNode } from 'react'

/**
 * 共通のインプットスタイル
 * - 十分なパディングでタッチしやすく
 * - 16px以上のフォントサイズでiOSのズームを防止
 * - 明確なボーダーとフォーカス状態
 */
const baseInputStyles = `
  block w-full
  px-4 py-3
  text-base text-gray-900
  placeholder-gray-400
  bg-white
  border-2 border-gray-200
  rounded-lg
  transition-all duration-200
  outline-none
  appearance-none
`

const focusStyles = `
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-500/20
`

const errorStyles = `
  border-red-400
  focus:border-red-500
  focus:ring-red-500/20
`

const disabledStyles = `
  bg-gray-50
  text-gray-500
  cursor-not-allowed
  border-gray-200
`

/**
 * 基本のFormFieldProps
 */
type FormFieldProps = {
  label: string
  name: string
  required?: boolean
  error?: string
  description?: string
  children: ReactNode
}

/**
 * フォームフィールドラッパー
 */
export function FormField({
  label,
  name,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1 font-normal">*</span>
        )}
      </label>

      {children}

      {description && (
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
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
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * テキスト入力フィールド
 */
type TextInputProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  type?: 'text' | 'email' | 'url' | 'number'
  disabled?: boolean
  maxLength?: number
}

export function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  type = 'text',
  disabled = false,
  maxLength,
}: TextInputProps) {
  const inputClassName = `
    ${baseInputStyles}
    ${error ? errorStyles : focusStyles}
    ${disabled ? disabledStyles : ''}
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      description={description}
    >
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="off"
        className={inputClassName}
      />
    </FormField>
  )
}

/**
 * テキストエリアフィールド
 */
type TextAreaProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  rows?: number
  disabled?: boolean
  maxLength?: number
}

export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  rows = 4,
  disabled = false,
  maxLength,
}: TextAreaProps) {
  const textareaClassName = `
    ${baseInputStyles}
    ${error ? errorStyles : focusStyles}
    ${disabled ? disabledStyles : ''}
    resize-none
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      description={description}
    >
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={textareaClassName}
      />
    </FormField>
  )
}

/**
 * セレクトフィールド
 */
type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  disabled?: boolean
}

export function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = '選択してください',
  required = false,
  error,
  description,
  disabled = false,
}: SelectProps) {
  const selectClassName = `
    ${baseInputStyles}
    ${error ? errorStyles : focusStyles}
    ${disabled ? disabledStyles : ''}
    pr-10
    bg-no-repeat
    cursor-pointer
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      description={description}
    >
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClassName}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px 20px',
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </FormField>
  )
}

/**
 * 読み取り専用フィールド（確認画面用）
 */
type ReadOnlyFieldProps = {
  label: string
  value: string | number | null | undefined
  emptyText?: string
}

export function ReadOnlyField({
  label,
  value,
  emptyText = '未設定',
}: ReadOnlyFieldProps) {
  const displayValue =
    value !== null && value !== undefined && value !== '' ? value : emptyText
  const isEmpty = displayValue === emptyText

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd
        className={`text-base ${isEmpty ? 'text-gray-400 italic' : 'text-gray-900'}`}
      >
        {displayValue}
      </dd>
    </div>
  )
}

/**
 * 隠しフィールド
 */
type HiddenInputProps = {
  name: string
  value: string | number
}

export function HiddenInput({ name, value }: HiddenInputProps) {
  return <input type="hidden" name={name} value={value} />
}

export default FormField
