/**
 * cultural_property.ts
 *
 * 文化財（CulturalProperty）のサービス層
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 具体的なユースケースを実装
 * - Repository層は汎用的なAPI、Service層で具体的なパラメータを指定
 */

import { CulturalPropertyRepository } from '../repositories'
import { CulturalProperties } from '../models/cultural_property'

type Repositories = {
  cultural_property: CulturalPropertyRepository | null
}

export default class CulturalPropertyService {
  constructor(
    readonly repositories: Repositories = {
      cultural_property: null,
    },
  ) {}

  /**
   * ムービー付きの文化財を取得（一覧画面用 - 旧index.tsx）
   */
  async getProperties(): Promise<CulturalProperties> {
    const props = { has_movies: 'true' }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 全ての文化財を取得（マップ画面用）
   */
  async getAllProperties(): Promise<CulturalProperties> {
    const props = {}
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 最新の文化財を取得（ホーム画面用）
   * @param limit 取得件数（デフォルト: 5）
   */
  async getLatestProperties(limit: number = 5): Promise<CulturalProperties> {
    const props = {
      ordering: '-updated_at',
      limit: limit.toString(),
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * ムービー付きの最新文化財を取得（ホーム画面用）
   * @param limit 取得件数（デフォルト: 5）
   */
  async getLatestPropertiesWithMovies(limit: number = 5): Promise<CulturalProperties> {
    const props = {
      has_movies: 'true',
      ordering: '-updated_at',
      limit: limit.toString(),
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 位置情報で文化財を検索
   */
  async getPropertiesByLocation(lat: number, lon: number, distance: number): Promise<CulturalProperties> {
    const props = {
      lat: lat.toString(),
      lon: lon.toString(),
      distance: distance.toString(),
      has_movies: 'true',
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 位置情報で全ての文化財を検索（マップ画面用）
   */
  async getAllPropertiesByLocation(lat: number, lon: number, distance: number): Promise<CulturalProperties> {
    const props = {
      lat: lat.toString(),
      lon: lon.toString(),
      distance: distance.toString(),
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * タグで文化財を検索
   */
  async getPropertiesByTag(tagId: number): Promise<CulturalProperties> {
    const props = {
      tag_id: tagId.toString(),
      has_movies: 'true',
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 文化財を検索
   */
  async searchProperties(query: string): Promise<CulturalProperties> {
    const props = {
      search: query,
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }
}
