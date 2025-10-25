/**
 * ユーザーモデル
 */
export type User = {
  id: number
  username: string
  email: string
  name: string
  bio: string
  avatar: string | null
  is_email_verified: boolean
  date_joined: string
  last_login: string | null
  created_at: string
  updated_at: string
}

/**
 * ログインレスポンス
 * バックエンドからのレスポンス形式に合わせて修正
 */
export type LoginResponse = {
  message: string
  token: string // access_token から token に変更
  user: User
}

/**
 * サインアップリクエスト
 */
export type SignUpRequest = {
  username: string
  email: string
  password: string
  password_confirm: string
  name?: string
}

/**
 * サインインリクエスト
 */
export type SignInRequest = {
  username: string
  password: string
}

/**
 * メール認証リクエスト
 */
export type VerifyEmailRequest = {
  token: string
}

/**
 * プロフィール更新リクエスト
 */
export type UpdateProfileRequest = {
  name?: string
  bio?: string
  avatar?: File
}

/**
 * パスワード変更リクエスト
 */
export type PasswordChangeRequest = {
  old_password: string
  new_password: string
  new_password_confirm: string
}
