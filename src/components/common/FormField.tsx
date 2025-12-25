/**
 * FormField.tsx
 *
 * フォームフィールドの共通コンポーネント
 *
 * - ラベル、入力フィールド、エラーメッセージを統一的に表示
 * - 必須マーク、説明文の表示に対応
 */

import React, { ReactNode } from 'react'

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
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
  rows = 3,
  disabled = false,
  maxLength,
}: TextAreaProps) {
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
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
  return (
    <FormField
      label={label}
      name={name}
      required={required}
      error={error}
      description={description}
    >
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
