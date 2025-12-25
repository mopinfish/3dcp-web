/**
 * LocationPicker.tsx
 *
 * 地図から緯度経度を選択できるコンポーネント
 *
 * 機能:
 * - 地図クリックで緯度経度を選択
 * - 住所検索（ジオコーディング）で場所を検索・移動
 * - 選択した位置にマーカーを表示
 * - 緯度経度をフォームに自動入力
 * - スマートフォン対応のUI
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

type LocationPickerProps = {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
  onAddressFound?: (address: string) => void
  height?: string
}

/**
 * ジオコーディング結果の型
 */
type GeocodingResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

/**
 * 逆ジオコーディング結果の型
 */
type ReverseGeocodingResult = {
  display_name: string
  address: {
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
  }
}

// 初期中心位置（日本）
const DEFAULT_CENTER: [number, number] = [139.7671, 35.6812]

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  onAddressFound,
  height = '400px',
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)
  const isInitialized = useRef(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  /**
   * 逆ジオコーディング（緯度経度 → 住所）
   */
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!onAddressFound) return

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ja`,
          {
            headers: {
              'User-Agent': '3DCP-Web/1.0',
            },
          },
        )

        if (!response.ok) return

        const data: ReverseGeocodingResult = await response.json()

        if (data.display_name) {
          // 日本の住所形式に整形
          const address = data.address
          const parts = []

          if (address.state) parts.push(address.state)
          if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village)
          }
          if (address.suburb) parts.push(address.suburb)
          if (address.neighbourhood) parts.push(address.neighbourhood)
          if (address.road) parts.push(address.road)

          const formattedAddress =
            parts.length > 0 ? parts.join('') : data.display_name
          onAddressFound(formattedAddress)
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error)
      }
    },
    [onAddressFound],
  )

  /**
   * マーカーを更新
   */
  const updateMarker = useCallback(
    (lng: number, lat: number) => {
      if (!map.current) return

      // 既存のマーカーを削除
      if (marker.current) {
        marker.current.remove()
      }

      // 新しいマーカーを作成
      marker.current = new maplibregl.Marker({
        color: '#3B82F6',
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(map.current)

      // マーカーのドラッグ終了時のイベント
      marker.current.on('dragend', () => {
        const lngLat = marker.current?.getLngLat()
        if (lngLat) {
          onLocationChange(lngLat.lat, lngLat.lng)
          // 逆ジオコーディングで住所を取得
          reverseGeocode(lngLat.lat, lngLat.lng)
        }
      })
    },
    [onLocationChange, reverseGeocode],
  )

  /**
   * ジオコーディング（住所 → 緯度経度）
   */
  const searchAddress = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowResults(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=jp&limit=5&accept-language=ja`,
        {
          headers: {
            'User-Agent': '3DCP-Web/1.0',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data: GeocodingResult[] = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Geocoding error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  /**
   * 検索結果を選択
   */
  const selectResult = useCallback(
    (result: GeocodingResult) => {
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)

      // 地図を移動
      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: 17,
        })
      }

      // マーカーを更新
      updateMarker(lng, lat)

      // コールバックを呼び出し
      onLocationChange(lat, lng)

      // 住所をフォームに設定
      if (onAddressFound) {
        onAddressFound(result.display_name)
      }

      // 検索結果を非表示
      setShowResults(false)
      setSearchQuery(result.display_name)
    },
    [onLocationChange, onAddressFound, updateMarker],
  )

  /**
   * 地図の初期化
   */
  useEffect(() => {
    if (!mapContainer.current || isInitialized.current) return

    // 初期中心位置（既に値がある場合はその位置）
    const center: [number, number] =
      latitude !== 0 && longitude !== 0
        ? [longitude, latitude]
        : DEFAULT_CENTER

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: center,
      zoom: latitude !== 0 && longitude !== 0 ? 17 : 5,
    })

    // ナビゲーションコントロールを追加
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    isInitialized.current = true

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
        isInitialized.current = false
      }
    }
    // 初期化は一度だけ実行するため、依存配列は空にする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * 地図クリックイベントの設定
   */
  useEffect(() => {
    if (!map.current) return

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat

      // マーカーを更新
      updateMarker(lng, lat)

      // コールバックを呼び出し
      onLocationChange(lat, lng)

      // 逆ジオコーディングで住所を取得
      reverseGeocode(lat, lng)
    }

    map.current.on('click', handleClick)

    return () => {
      if (map.current) {
        map.current.off('click', handleClick)
      }
    }
  }, [onLocationChange, reverseGeocode, updateMarker])

  /**
   * 初期位置にマーカーを表示
   */
  useEffect(() => {
    if (!map.current || !isInitialized.current) return
    if (latitude === 0 && longitude === 0) return

    // マーカーがまだない場合のみ作成
    if (!marker.current) {
      updateMarker(longitude, latitude)
    }
    // 初期表示時のみ実行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized.current])

  /**
   * 緯度経度が外部から変更された場合
   */
  useEffect(() => {
    if (!map.current) return
    if (latitude === 0 && longitude === 0) return

    // 現在のマーカー位置と異なる場合のみ更新
    const currentMarkerPos = marker.current?.getLngLat()
    if (
      currentMarkerPos &&
      Math.abs(currentMarkerPos.lat - latitude) < 0.000001 &&
      Math.abs(currentMarkerPos.lng - longitude) < 0.000001
    ) {
      return
    }

    // マーカーを更新
    updateMarker(longitude, latitude)

    // 地図を移動
    const currentCenter = map.current.getCenter()
    const distance = Math.sqrt(
      Math.pow(currentCenter.lng - longitude, 2) +
        Math.pow(currentCenter.lat - latitude, 2),
    )

    // 現在の中心から十分離れている場合のみ移動
    if (distance > 0.001) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 17,
      })
    }
  }, [latitude, longitude, updateMarker])

  /**
   * Enterキーで検索
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchAddress()
    }
  }

  /**
   * 検索ボックス外クリックで結果を閉じる
   */
  const handleBlur = () => {
    // 少し遅延させてクリックイベントを処理
    setTimeout(() => {
      setShowResults(false)
    }, 200)
  }

  return (
    <div className="space-y-3">
      {/* 検索ボックス */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={handleBlur}
              placeholder="住所や場所名で検索"
              className="
                block w-full
                pl-11 pr-4 py-3
                text-base text-gray-900
                placeholder-gray-400
                bg-white
                border-2 border-gray-200
                rounded-lg
                transition-all duration-200
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>
          <button
            type="button"
            onClick={searchAddress}
            disabled={isSearching || !searchQuery.trim()}
            className="
              px-5 py-3
              text-base font-medium
              text-white
              bg-blue-600
              rounded-lg
              transition-all duration-200
              hover:bg-blue-700
              active:bg-blue-800
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex-shrink-0
              min-w-[80px]
              flex items-center justify-center
            "
          >
            {isSearching ? (
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              '検索'
            )}
          </button>
        </div>

        {/* 検索結果ドロップダウン */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => selectResult(result)}
                className={`
                  w-full px-4 py-3.5
                  text-left text-base
                  hover:bg-blue-50
                  active:bg-blue-100
                  transition-colors duration-150
                  ${index !== searchResults.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <span className="line-clamp-2">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}

        {/* 検索結果なし */}
        {showResults &&
          searchResults.length === 0 &&
          !isSearching &&
          searchQuery && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <p className="text-base text-gray-500 text-center">
                検索結果が見つかりませんでした
              </p>
            </div>
          )}
      </div>

      {/* 地図 */}
      <div
        ref={mapContainer}
        style={{ height }}
        className="rounded-lg border-2 border-gray-200 overflow-hidden"
      />

      {/* 操作説明 */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-sm text-blue-700 flex items-start">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            地図をタップして位置を選択するか、住所を検索してください。
            <br className="hidden sm:block" />
            マーカーはドラッグで移動できます。
          </span>
        </p>
      </div>

      {/* 選択中の座標 */}
      {latitude !== 0 && longitude !== 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              選択された位置
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-md px-3 py-2 border border-gray-200">
              <span className="text-xs text-gray-500 block">緯度</span>
              <span className="text-base font-mono font-medium text-gray-900">
                {latitude.toFixed(6)}
              </span>
            </div>
            <div className="bg-white rounded-md px-3 py-2 border border-gray-200">
              <span className="text-xs text-gray-500 block">経度</span>
              <span className="text-base font-mono font-medium text-gray-900">
                {longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationPicker
