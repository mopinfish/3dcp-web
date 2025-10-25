/**
 * API エラークラス
 */
export class ApiError extends Error {
  public status: number
  public data: unknown

  constructor(status: number, data: unknown, message?: string) {
    super(message || 'API Error')
    this.name = 'ApiError'
    this.status = status
    this.data = data

    // TypeScriptのプロトタイプチェーンを正しく維持
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  /**
   * エラーメッセージを取得
   */
  getErrorMessage(): string {
    // data が文字列の場合
    if (typeof this.data === 'string') {
      return this.data
    }

    // data がオブジェクトの場合
    if (typeof this.data === 'object' && this.data !== null) {
      const dataObj = this.data as Record<string, unknown>

      // non_field_errors を優先
      if (dataObj.non_field_errors && Array.isArray(dataObj.non_field_errors)) {
        return dataObj.non_field_errors.join(', ')
      }

      // detail フィールド
      if (dataObj.detail) {
        return String(dataObj.detail)
      }

      // message フィールド
      if (dataObj.message) {
        return String(dataObj.message)
      }

      // error フィールド
      if (dataObj.error) {
        return String(dataObj.error)
      }

      // フィールドエラーの場合(username, password など)
      const fieldErrors: string[] = []
      for (const [field, errors] of Object.entries(dataObj)) {
        if (Array.isArray(errors)) {
          fieldErrors.push(`${field}: ${errors.join(', ')}`)
        } else if (typeof errors === 'string') {
          fieldErrors.push(`${field}: ${errors}`)
        }
      }

      if (fieldErrors.length > 0) {
        return fieldErrors.join('\n')
      }

      // その他の場合はJSON文字列化
      return JSON.stringify(this.data)
    }

    return 'An unknown error occurred'
  }
}
