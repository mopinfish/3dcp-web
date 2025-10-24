import { ApiError } from './errors'

/**
 * HTTPライブラリ
 * APIリクエストを簡素化するためのユーティリティ
 */

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type RequestOptions = {
  method: RequestMethod
  headers?: Record<string, string>
  body?: string | FormData
}

/**
 * HTTPリクエストを実行する共通関数
 */
async function request<T>(url: string, options: RequestOptions): Promise<T> {
  const { method, headers = {}, body } = options

  // デフォルトヘッダー
  const defaultHeaders: Record<string, string> = {}

  // FormDataでない場合のみContent-Typeを設定
  if (!(body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Cookieを含める
  }

  if (body) {
    config.body = body instanceof FormData ? body : body
  }

  try {
    const response = await fetch(url, config)

    // レスポンスのContent-Typeを確認
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    if (!response.ok) {
      // エラーレスポンスの処理
      const errorData = isJson ? await response.json() : await response.text()
      
      // カスタムエラーをthrow
      throw new ApiError(response.status, errorData, `HTTP ${response.status}`)
    }

    // 成功レスポンスの処理
    if (response.status === 204 || !isJson) {
      // No Content または非JSON
      return {} as T
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    // ApiErrorの場合はそのままthrow
    if (error instanceof ApiError) {
      throw error
    }

    // ネットワークエラーなど
    console.error('HTTP Request Error:', error)
    throw new ApiError(0, { message: 'ネットワークエラーが発生しました' }, 'Network Error')
  }
}

/**
 * GETリクエスト
 */
export async function get<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(url, { method: 'GET', headers })
}

/**
 * POSTリクエスト
 */
export async function post<T>(
  url: string,
  data?: unknown | FormData,
  headers?: Record<string, string>,
): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data)
  return request<T>(url, { method: 'POST', headers, body })
}

/**
 * PUTリクエスト
 */
export async function put<T>(
  url: string,
  data?: unknown | FormData,
  headers?: Record<string, string>,
): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data)
  return request<T>(url, { method: 'PUT', headers, body })
}

/**
 * DELETEリクエスト
 */
export async function del<T>(url: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(url, { method: 'DELETE', headers })
}

/**
 * PATCHリクエスト
 */
export async function patch<T>(
  url: string,
  data?: unknown | FormData,
  headers?: Record<string, string>,
): Promise<T> {
  const body = data instanceof FormData ? data : JSON.stringify(data)
  return request<T>(url, { method: 'PATCH', headers, body })
}

export const Http = {
  get,
  post,
  put,
  delete: del,
  patch,
}