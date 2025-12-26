/**
 * user.ts
 *
 * ユーザー関連のサービス層
 *
 * ✅ 新規追加:
 * - アクティブユーザー一覧取得
 */

import { UserRepository } from '../repositories'
import { ActiveUsers } from '../models/active_user'

type Repositories = {
  user: UserRepository | null
}

export default class UserService {
  constructor(
    readonly repositories: Repositories = {
      user: null,
    },
  ) {}

  /**
   * アクティブユーザーを取得（ホーム画面用）
   * @param limit 取得件数（デフォルト: 5）
   */
  async getActiveUsers(limit: number = 5): Promise<ActiveUsers> {
    try {
      const result = await this.repositories.user?.findActiveUsers({ limit })
      if (!result) return []
      return result.users
    } catch (e) {
      console.error(e)
      return []
    }
  }
}
