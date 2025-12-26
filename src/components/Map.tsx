/**
 * Map.tsx
 * 
 * 2Dマップコンポーネント
 * 
 * ✅ Phase 2対応:
 * - ポップアップに文化財詳細ページへのリンクを追加
 * - ムービーがある場合は3Dビューアへのリンクも表示
 * - マーカークリック時のポップアップUIを改善
 * 
 * ✅ Phase 2-3対応:
 * - 3Dモデルがある文化財に「3D」バッジを表示
 * 
 * ✅ Phase 3-3対応:
 * - クラスタリング機能を追加（パフォーマンス改善）
 * - 1000件以上のマーカーでも軽快に動作
 * - ズームレベルに応じてクラスタを展開
 * - メモ化による再レンダリング最適化
 */

'use client'

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { CulturalProperties, CulturalProperty } from '@/domains/models/cultural_property'

type MapProps = { properties: CulturalProperties }

const Map = memo(function Map({ properties }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

  // GeoJSONデータをメモ化
  const geojsonData = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { type: 'FeatureCollection' as const, features: [] }
    }
    
    return {
      type: 'FeatureCollection' as const,
      features: properties.map((item) => {
        const hasMovies = item.movies && item.movies.length > 0
        return {
          type: 'Feature' as const,
          geometry: { 
            type: 'Point' as const, 
            coordinates: [item.longitude, item.latitude] 
          },
          properties: {
            id: item.id,
            name: item.name,
            address: item.address || '',
            type: item.type || '',
            hasMovies: hasMovies ? 1 : 0,
            movies: JSON.stringify(item.movies || []),
          },
        }
      }),
    }
  }, [properties])

  // ポップアップHTMLを生成
  const createPopupHTML = useCallback((property: CulturalProperty) => {
    const hasMovies = property.movies && property.movies.length > 0
    const thumbnailUrl = hasMovies && property.movies[0].thumbnail_url
      ? property.movies[0].thumbnail_url
      : null

    return `
      <div style="min-width: 250px; max-width: 300px; font-family: system-ui, sans-serif;">
        ${thumbnailUrl ? `
          <div style="width: 100%; height: 120px; background-color: #f3f4f6; border-radius: 8px; overflow: hidden; margin-bottom: 12px;">
            <img 
              src="${thumbnailUrl}" 
              alt="${property.name}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:#9ca3af;\\'>画像なし</div>'"
            />
          </div>
        ` : `
          <div style="width: 100%; height: 80px; background: linear-gradient(135deg, #e5e7eb, #d1d5db); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
        `}
        
        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #111827; line-height: 1.3;">
          ${property.name}
        </h3>
        
        ${property.type ? `
          <span style="display: inline-block; margin-bottom: 8px; padding: 2px 8px; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; border-radius: 9999px;">
            ${property.type}
          </span>
        ` : ''}
        
        ${property.address ? `
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
            📍 ${property.address}
          </p>
        ` : ''}
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a 
            href="/cultural-properties/${property.id}" 
            style="display: flex; align-items: center; justify-content: center; padding: 8px 16px; background-color: #2563eb; color: white; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#1d4ed8'"
            onmouseout="this.style.backgroundColor='#2563eb'"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 6px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            詳細情報を見る
          </a>
          
          ${hasMovies ? `
            <a 
              href="/luma/${property.movies[0].id}" 
              style="display: flex; align-items: center; justify-content: center; padding: 8px 16px; background-color: #7c3aed; color: white; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none; transition: background-color 0.2s;"
              onmouseover="this.style.backgroundColor='#6d28d9'"
              onmouseout="this.style.backgroundColor='#7c3aed'"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 6px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
              </svg>
              3Dモデルを見る
            </a>
          ` : ''}
        </div>
      </div>
    `
  }, [])

  // ポップアップのスタイルを適用
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'maplibre-popup-style'
    style.textContent = `
      .maplibregl-popup-close-button {
        font-size: 24px !important;
        width: 32px !important;
        height: 32px !important;
        line-height: 32px !important;
        padding: 0 !important;
        right: 4px !important;
        top: 4px !important;
        color: #6b7280 !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .maplibregl-popup-close-button:hover {
        background: #f3f4f6 !important;
        color: #111827 !important;
      }
      .maplibregl-popup-content {
        padding: 16px !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
      }
    `
    
    const existingStyle = document.getElementById('maplibre-popup-style')
    if (existingStyle) existingStyle.remove()
    
    document.head.appendChild(style)

    return () => {
      const styleEl = document.getElementById('maplibre-popup-style')
      if (styleEl) styleEl.remove()
    }
  }, [])

  // マップの初期化
  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return // 既に初期化済み

    console.log('=== Map initialization started ===')

    const initialCenter: [number, number] = [139.79667139325397, 35.71489576634944]
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
          { id: 'simple-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 22 },
        ],
      },
      center: initialCenter,
      zoom: 10, // 広域から表示開始
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      if (!map.current) return
      console.log('=== Map load event fired ===')
      setIsMapReady(true)
    })

    return () => {
      if (popupRef.current) popupRef.current.remove()
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      setIsMapReady(false)
    }
  }, [])

  // クラスタリング対応レイヤーの追加
  useEffect(() => {
    if (!map.current || !isMapReady) return
    if (properties.length === 0) return

    const mapInstance = map.current

    console.log('=== Setting up clustered layers ===')
    console.log('Properties count:', properties.length)

    // 既存のレイヤーとソースを削除
    const layersToRemove = [
      'clusters', 
      'cluster-count', 
      'unclustered-point', 
      'unclustered-point-3d',
      'cultural_properties',
      'cultural_properties_3d_badge',
    ]
    layersToRemove.forEach(layer => {
      if (mapInstance.getLayer(layer)) mapInstance.removeLayer(layer)
    })
    if (mapInstance.getSource('cultural-properties')) {
      mapInstance.removeSource('cultural-properties')
    }

    // クラスタリング対応のソースを追加
    mapInstance.addSource('cultural-properties', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 60,
      clusterProperties: {
        // クラスタ内の3Dモデル数を集計
        has3DCount: ['+', ['case', ['==', ['get', 'hasMovies'], 1], 1, 0]],
      },
    })

    // クラスタ円レイヤー
    mapInstance.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',  // 10件未満: シアン
          10, '#f1f075', // 10-50件: イエロー
          50, '#f28cb1', // 50件以上: ピンク
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          18,   // 10件未満
          10, 24, // 10-50件
          50, 32, // 50件以上
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
      },
    })

    // クラスタカウントレイヤー
    mapInstance.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'cultural-properties',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 13,
      },
      paint: {
        'text-color': '#333',
      },
    })

    // 非クラスタポイント（3Dモデルなし）
    mapInstance.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['all', 
        ['!', ['has', 'point_count']], 
        ['==', ['get', 'hasMovies'], 0]
      ],
      paint: {
        'circle-color': '#3b82f6',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    })

    // 非クラスタポイント（3Dモデルあり）
    mapInstance.addLayer({
      id: 'unclustered-point-3d',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['all', 
        ['!', ['has', 'point_count']], 
        ['==', ['get', 'hasMovies'], 1]
      ],
      paint: {
        'circle-color': '#22c55e',
        'circle-radius': 10,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
      },
    })

    console.log('=== Clustered layers added ===')

    // クラスタクリックでズームイン
    const handleClusterClick = async (e: maplibregl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      if (!features.length) return

      const clusterId = features[0].properties?.cluster_id
      const source = mapInstance.getSource('cultural-properties') as maplibregl.GeoJSONSource

      try {
        const zoom = await source.getClusterExpansionZoom(clusterId)
        const geometry = features[0].geometry as GeoJSON.Point

        mapInstance.easeTo({
          center: geometry.coordinates as [number, number],
          zoom: (zoom ?? 14) + 1,
        })
      } catch (err) {
        console.error('Failed to get cluster expansion zoom:', err)
      }
    }

    // 個別ポイントクリックでポップアップ
    const handlePointClick = (e: maplibregl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point', 'unclustered-point-3d'],
      })
      if (!features.length) return

      const feature = features[0]
      const id = feature.properties?.id
      if (!id) return

      const property = properties.find((p) => p.id === id)
      if (!property) return

      if (popupRef.current) popupRef.current.remove()

      const geometry = feature.geometry as GeoJSON.Point
      popupRef.current = new maplibregl.Popup({
        offset: 15,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '320px',
      })
        .setLngLat(geometry.coordinates as [number, number])
        .setHTML(createPopupHTML(property))
        .addTo(mapInstance)
    }

    // カーソルスタイル変更
    const setCursorPointer = () => { mapInstance.getCanvas().style.cursor = 'pointer' }
    const setCursorDefault = () => { mapInstance.getCanvas().style.cursor = '' }

    mapInstance.on('click', 'clusters', handleClusterClick)
    mapInstance.on('click', 'unclustered-point', handlePointClick)
    mapInstance.on('click', 'unclustered-point-3d', handlePointClick)
    
    mapInstance.on('mouseenter', 'clusters', setCursorPointer)
    mapInstance.on('mouseleave', 'clusters', setCursorDefault)
    mapInstance.on('mouseenter', 'unclustered-point', setCursorPointer)
    mapInstance.on('mouseleave', 'unclustered-point', setCursorDefault)
    mapInstance.on('mouseenter', 'unclustered-point-3d', setCursorPointer)
    mapInstance.on('mouseleave', 'unclustered-point-3d', setCursorDefault)

    return () => {
      mapInstance.off('click', 'clusters', handleClusterClick)
      mapInstance.off('click', 'unclustered-point', handlePointClick)
      mapInstance.off('click', 'unclustered-point-3d', handlePointClick)
      mapInstance.off('mouseenter', 'clusters', setCursorPointer)
      mapInstance.off('mouseleave', 'clusters', setCursorDefault)
      mapInstance.off('mouseenter', 'unclustered-point', setCursorPointer)
      mapInstance.off('mouseleave', 'unclustered-point', setCursorDefault)
      mapInstance.off('mouseenter', 'unclustered-point-3d', setCursorPointer)
      mapInstance.off('mouseleave', 'unclustered-point-3d', setCursorDefault)
    }
  }, [properties, geojsonData, isMapReady, createPopupHTML])

  // 現在地取得
  const handleGetCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('このブラウザは位置情報をサポートしていません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation([longitude, latitude])

        if (map.current) {
          new maplibregl.Marker({ color: '#ef4444' })
            .setLngLat([longitude, latitude])
            .addTo(map.current)
          
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
          })
        }
      },
      (error) => {
        console.error('現在地取得失敗:', error)
        alert('現在地の取得に失敗しました')
      },
    )
  }, [])

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 180px)' }}>
      {/* コントロールボタン */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button 
          onClick={handleGetCurrentLocation} 
          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 flex items-center cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          現在地
        </button>
      </div>

      {/* 凡例 */}
      <div className="absolute bottom-6 left-3 z-10 bg-white rounded-lg shadow-md p-3 text-xs">
        <div className="font-medium text-gray-700 mb-2">凡例</div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow flex-shrink-0"></span>
          <span className="text-gray-600">3Dモデルあり</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow flex-shrink-0"></span>
          <span className="text-gray-600">文化財</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow flex items-center justify-center text-[9px] font-bold text-gray-700 flex-shrink-0">n</span>
          <span className="text-gray-600">クラスタ（件数）</span>
        </div>
      </div>

      {/* 件数表示 */}
      {isMapReady && properties.length > 0 && (
        <div className="absolute top-3 right-14 z-10 bg-white rounded-lg shadow-md px-3 py-1.5 text-sm text-gray-700 font-medium">
          {properties.length.toLocaleString()} 件
        </div>
      )}

      {/* ローディング表示 */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 text-sm">マップを読み込み中...</p>
          </div>
        </div>
      )}

      {/* データ読み込み中 */}
      {isMapReady && properties.length === 0 && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-md px-4 py-2 text-sm text-gray-600 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          文化財データを読み込み中...
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
})

export default Map
