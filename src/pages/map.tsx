/**
 * map.tsx
 *
 * 2Dマップ画面
 *
 * ✅ Phase 2対応:
 * - 全ての文化財を表示（getAllPropertiesを使用）
 * - 3Dモデルがある文化財には「3D」バッジを表示
 * 
 * ✅ Phase 3-3対応:
 * - タグによるフィルタリング機能を追加
 */

import React, { useState, useEffect, useCallback } from 'react'
import Map from '../components/Map'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'
import SearchConditionTab from '@/components/blocks/SearchConditionTab'
import { TagFilter } from '@/components/common'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'

const MapScreen = () => {
  const [properties, setProperties] = useState<CulturalProperties>([])
  const [allProperties, setAllProperties] = useState<CulturalProperties>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初期データ読み込み
  useEffect(() => {
    setIsLoading(true)
    culturalPropertyService
      .getAllProperties()
      .then((data) => {
        setAllProperties(data)
        setProperties(data)
      })
      .catch((error) => {
        console.error('Error fetching cultural properties:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // タグでフィルタリング
  const handleTagSelect = useCallback(async (tagIds: number[]) => {
    setSelectedTagIds(tagIds)
    
    if (tagIds.length === 0) {
      // タグが選択されていない場合は全件表示
      setProperties(allProperties)
    } else {
      // タグでフィルタリング
      setIsLoading(true)
      try {
        // 最初のタグIDでフィルタリング（単一タグ選択の場合）
        const filtered = await CulturalPropertyRepository.getByTag(tagIds[0])
        setProperties(filtered)
      } catch (error) {
        console.error('Error filtering by tag:', error)
        setProperties(allProperties)
      } finally {
        setIsLoading(false)
      }
    }
  }, [allProperties])

  // SearchConditionTabからの更新ハンドラ
  const handleUpdateProperties = useCallback((newProperties: CulturalProperties) => {
    setProperties(newProperties)
    // 検索条件タブで更新された場合はタグフィルタをクリア
    setSelectedTagIds([])
  }, [])

  return (
    <LayoutWithFooter>
      <NavigationTab />
      {/* 検索条件タブ */}
      <SearchConditionTab onUpdateProperties={handleUpdateProperties} />
      
      {/* タグフィルター */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <TagFilter 
          selectedTagIds={selectedTagIds}
          onTagSelect={handleTagSelect}
        />
      </div>

      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-lg shadow-lg px-6 py-4 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">読み込み中...</span>
        </div>
      )}

      <Map properties={properties} />
    </LayoutWithFooter>
  )
}

export default MapScreen
