/**
 * AuthContext.tsx
 *
 * 認証状態を管理するContextとProvider
 * ユーザーのサインイン・サインアウト・認証状態の確認を行う
 *
 * ✅ 修正内容:
 * - signIn関数がエラーをthrowする代わりに、結果オブジェクト{ success, error }を返すように変更
 * - signUp関数も同様に結果オブジェクトを返すように変更
 * - これによりNext.jsの開発モードでError Overlayが表示されなくなる
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import * as authRepo from '@/infrastructures/repositories/auth'
import type { User, SignInRequest, SignUpRequest } from '@/domains/models/user'
import { ApiError } from '@/infrastructures/lib/errors'

/**
 * 認証結果の型定義
 */
type AuthResult<T = void> = {
  success: boolean
  error?: ApiError | Error
  data?: T
}

/**
 * 認証コンテキストの型定義
 */
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (data: SignInRequest) => Promise<AuthResult>
  signUp: (data: SignUpRequest) => Promise<AuthResult<{ message: string; user: User }>>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

/**
 * 認証コンテキスト
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * LocalStorageキー
 */
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * 認証プロバイダーのProps
 */
type AuthProviderProps = {
  children: ReactNode
}

/**
 * 認証プロバイダー
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /**
   * トークンをLocalStorageから取得
   */
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  /**
   * トークンをLocalStorageに保存
   */
  const setTokenToStorage = (token: string, refreshToken?: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      }
    }
  }

  /**
   * トークンをLocalStorageから削除
   */
  const removeToken = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  }

  /**
   * ユーザー情報を取得
   */
  const fetchUser = useCallback(async (token: string): Promise<User | null> => {
    try {
      const userData = await authRepo.getCurrentUser(token)
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Failed to fetch user:', error)
      removeToken()
      setUser(null)
      return null
    }
  }, [])

  /**
   * ユーザー情報を再取得
   */
  const refreshUser = async (): Promise<void> => {
    const token = getToken()
    if (token) {
      await fetchUser(token)
    }
  }

  /**
   * サインイン
   *
   * ✅ 重要な変更:
   * - エラーをthrowする代わりに、結果オブジェクト{ success, error }を返す
   * - これによりNext.jsの開発モードでError Overlayが表示されなくなる
   */
  const signIn = async (data: SignInRequest): Promise<AuthResult> => {
    try {
      console.log('AuthContext: signIn started')

      // バックエンドからのレスポンス形式:
      // {
      //   "message": "ログインに成功しました。",
      //   "token": "...",
      //   "user": {...}
      // }
      const response = await authRepo.signIn(data)

      console.log('AuthContext: signIn API response received')
      console.log('AuthContext: Token:', response.token ? '***' : 'missing')
      console.log('AuthContext: User:', response.user ? response.user.username : 'missing')

      // トークンを保存
      setTokenToStorage(response.token)

      // ユーザー情報を設定
      setUser(response.user)

      console.log('AuthContext: signIn completed successfully')

      // ✅ 成功時は success: true を返す
      return { success: true }
    } catch (error) {
      // エラーログを出力
      console.error('AuthContext: signIn error:', error)
      console.error('AuthContext: Error type:', typeof error)
      console.error('AuthContext: Is ApiError:', error instanceof ApiError)

      // ✅ エラーをthrowせずに、結果オブジェクトで返す
      if (error instanceof ApiError) {
        console.error('AuthContext: Returning ApiError with status:', error.status)
        return { success: false, error }
      } else if (error instanceof Error) {
        console.error('AuthContext: Returning Error:', error.message)
        return { success: false, error }
      } else {
        // 不明なエラーの場合は新しいErrorを作成
        console.error('AuthContext: Unknown error type, creating new Error')
        return {
          success: false,
          error: new Error('サインインに失敗しました'),
        }
      }
    }
  }

  /**
   * サインアップ
   *
   * ✅ エラーをthrowせずに結果オブジェクトを返すように変更
   */
  const signUp = async (
    data: SignUpRequest,
  ): Promise<AuthResult<{ message: string; user: User }>> => {
    try {
      console.log('AuthContext: signUp started')
      const response = await authRepo.signUp(data)
      console.log('AuthContext: signUp completed successfully')

      // ✅ 成功時は success: true とデータを返す
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('AuthContext: signUp error:', error)

      // ✅ エラーをthrowせずに結果オブジェクトで返す
      if (error instanceof ApiError) {
        return { success: false, error }
      } else if (error instanceof Error) {
        return { success: false, error }
      } else {
        return {
          success: false,
          error: new Error('サインアップに失敗しました'),
        }
      }
    }
  }

  /**
   * ログアウト
   */
  const logout = async (): Promise<void> => {
    const token = getToken()

    if (token) {
      try {
        await authRepo.logout(token)
      } catch (error) {
        console.error('Logout API failed, but continuing with local logout:', error)
      }
    }

    // ローカルの状態をクリア
    removeToken()
    setUser(null)
  }

  /**
   * 初回マウント時にトークンの有効性を確認
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()

      if (token) {
        await fetchUser(token)
      }

      setIsLoading(false)
    }

    initAuth()
  }, [fetchUser])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuthフック
 * 認証コンテキストを使用するためのカスタムフック
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
