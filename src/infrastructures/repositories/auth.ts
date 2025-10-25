/**
 * auth.ts
 *
 * 認証関連のAPIリポジトリ
 * バックエンドのAuth APIとの通信を担当
 */

import { Http } from '@/infrastructures/lib'
import {
  User,
  LoginResponse,
  SignUpRequest,
  SignInRequest,
  VerifyEmailRequest,
  UpdateProfileRequest,
} from '@/domains/models/user'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

/**
 * サインアップAPI
 * 新規ユーザー登録
 */
export async function signUp(data: SignUpRequest): Promise<{ message: string; user: User }> {
  const url = `${HOST}/api/v1/auth/signup/`

  try {
    const result = await Http.post<{ message: string; user: User }>(url, data)
    console.log('authRepo: signUp API call successful')
    return result
  } catch (error) {
    console.error('authRepo: signUp API call failed:', error)
    throw error
  }
}

/**
 * サインインAPI
 * ユーザー名またはメールアドレスとパスワードでログイン
 *
 * CRITICAL: この関数はエラーをthrowする可能性があります
 * 呼び出し元でtry-catchを使用してエラーハンドリングを行ってください
 */
export async function signIn(data: SignInRequest): Promise<LoginResponse> {
  const url = `${HOST}/api/v1/auth/signin/`

  console.log('authRepo: signIn API call started')
  console.log('authRepo: URL:', url)
  console.log('authRepo: Request data:', { username: data.username, password: '***' })

  try {
    // CRITICAL: 型パラメータを正しく設定(Promiseでラップしない)
    const result = await Http.post<LoginResponse>(url, data)

    console.log('authRepo: signIn API call successful')
    console.log('authRepo: Response has token:', !!result.token)
    console.log('authRepo: Response has user:', !!result.user)

    return result
  } catch (error) {
    console.error('authRepo: signIn API call failed')
    console.error('authRepo: Error details:', error)

    // エラーを再throwして呼び出し元でハンドリング
    throw error
  }
}

/**
 * ログアウトAPI
 * サーバー側のトークンを無効化
 *
 * @param token - 認証トークン
 */
export async function logout(token: string): Promise<{ message: string }> {
  const url = `${HOST}/api/v1/auth/signout/`

  console.log('authRepo: logout API call started')

  const headers = {
    Authorization: `Token ${token}`,
  }

  try {
    const result = await Http.post<{ message: string }>(url, {}, headers)
    console.log('authRepo: logout API call successful')
    return result
  } catch (error) {
    console.error('authRepo: logout API call failed:', error)
    // ログアウトは失敗してもエラーを無視
    // クライアント側で状態をクリアすれば問題ない
    return { message: 'ログアウトしました' }
  }
}

/**
 * ユーザー情報取得API
 * 現在ログイン中のユーザー情報を取得
 *
 * @param token - 認証トークン
 */
export async function getCurrentUser(token: string): Promise<User> {
  const url = `${HOST}/api/v1/auth/profile/`

  console.log('authRepo: getCurrentUser API call started')

  const headers = {
    Authorization: `Token ${token}`,
  }

  try {
    const result = await Http.get<User>(url, headers)
    console.log('authRepo: getCurrentUser API call successful')
    return result
  } catch (error) {
    console.error('authRepo: getCurrentUser API call failed:', error)
    throw error
  }
}

/**
 * 認証チェックAPI
 * トークンが有効かどうかを確認
 */
export async function checkAuth(token: string): Promise<User> {
  const url = `${HOST}/api/v1/auth/check/`

  console.log('authRepo: checkAuth API call started')

  const headers = {
    Authorization: `Token ${token}`,
  }

  try {
    const result = await Http.get<User>(url, headers)
    console.log('authRepo: checkAuth API call successful')
    return result
  } catch (error) {
    console.error('authRepo: checkAuth API call failed:', error)
    throw error
  }
}

/**
 * メール認証API
 * メール認証トークンを検証
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
  const url = `${HOST}/api/v1/auth/verify-email/`

  console.log('authRepo: verifyEmail API call started')

  try {
    const result = await Http.post<{ message: string }>(url, data)
    console.log('authRepo: verifyEmail API call successful')
    return result
  } catch (error) {
    console.error('authRepo: verifyEmail API call failed:', error)
    throw error
  }
}

/**
 * メール認証再送信API
 * メール認証メールを再送信
 */
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  const url = `${HOST}/api/v1/auth/resend-verification/`

  console.log('authRepo: resendVerificationEmail API call started')

  try {
    const result = await Http.post<{ message: string }>(url, { email })
    console.log('authRepo: resendVerificationEmail API call successful')
    return result
  } catch (error) {
    console.error('authRepo: resendVerificationEmail API call failed:', error)
    throw error
  }
}

/**
 * プロフィール更新API
 * ユーザープロフィールを更新
 *
 * @param token - 認証トークン
 * @param data - 更新するプロフィールデータ
 */
export async function updateProfile(token: string, data: UpdateProfileRequest): Promise<User> {
  const url = `${HOST}/api/v1/auth/profile/`

  console.log('authRepo: updateProfile API call started')
  console.log('authRepo: Update data:', {
    hasName: 'name' in data,
    hasBio: 'bio' in data,
    hasAvatar: 'avatar' in data,
  })

  const headers = {
    Authorization: `Token ${token}`,
  }

  // FormDataを使用して画像アップロードに対応
  const formData = new FormData()

  // 🔧 修正: undefined や null でない限り、値を追加
  if (data.name !== undefined && data.name !== null) {
    formData.append('name', data.name)
  }
  if (data.bio !== undefined && data.bio !== null) {
    formData.append('bio', data.bio)
  }
  if (data.avatar) {
    formData.append('avatar', data.avatar)
  }

  // デバッグ: FormDataの内容をログ出力
  console.log('authRepo: FormData contents:')
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, typeof value === 'string' ? value : '[File]')
  }

  try {
    // 🔧 重要な修正: PUTの代わりにPATCHを使用（部分更新）
    const result = await Http.patch<User>(url, formData, headers)
    console.log('authRepo: updateProfile API call successful')
    return result
  } catch (error) {
    console.error('authRepo: updateProfile API call failed:', error)
    throw error
  }
}

/**
 * パスワード変更API
 * ユーザーのパスワードを変更
 *
 * @param token - 認証トークン
 * @param oldPassword - 現在のパスワード
 * @param newPassword - 新しいパスワード
 */
export async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string; token: string }> {
  const url = `${HOST}/api/v1/auth/change-password/`

  console.log('authRepo: changePassword API call started')

  const headers = {
    Authorization: `Token ${token}`,
  }

  const data = {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPassword,
  }

  try {
    const result = await Http.post<{ message: string; token: string }>(url, data, headers)
    console.log('authRepo: changePassword API call successful')
    return result
  } catch (error) {
    console.error('authRepo: changePassword API call failed:', error)
    throw error
  }
}
