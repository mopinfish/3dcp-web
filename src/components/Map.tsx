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
 * ✅ バグ修正:
 * - マップ初期化とレイヤー追加のタイミングを修正
 * - 画像読み込み完了後にレイヤーを追加するように変更
 * - ポップアップの閉じるボタンサイズを拡大
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { CulturalProperties, CulturalProperty } from '@/domains/models/cultural_property'

type MapProps = { properties: CulturalProperties }

/**
 * 3Dバッジ画像を生成する関数
 * Canvasを使用して「3D」と書かれた緑色のバッジを作成
 */
function create3DBadgeImageData(): ImageData {
  const canvas = document.createElement('canvas')
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  // 背景の円（緑色）
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
  ctx.fillStyle = '#22c55e' // green-500
  ctx.fill()
  
  // 白い縁取り
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  ctx.stroke()
  
  // テキスト「3D」
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('3D', size / 2, size / 2)
  
  return ctx.getImageData(0, 0, size, size)
}

export default function Map({ properties }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

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
    // ポップアップの閉じるボタンを大きくするCSSを追加
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
    
    // 既存のスタイルがあれば削除
    const existingStyle = document.getElementById('maplibre-popup-style')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    document.head.appendChild(style)

    return () => {
      const styleEl = document.getElementById('maplibre-popup-style')
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [])

  // マップの初期化
  useEffect(() => {
    if (!mapContainer.current) return

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
      zoom: 13,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', async () => {
      if (!map.current) return

      console.log('=== Map load event fired ===')

      try {
        // マーカー画像の読み込み
        const image = await map.current.loadImage('/img/marker_icon.png')
        map.current.addImage('property_icon', image.data)
        map.current.addImage('property_icon_3d', image.data)
        
        const selectedImage = await map.current.loadImage('/img/selected_marker_icon.png')
        map.current.addImage('selected_property_icon', selectedImage.data)

        // 3Dバッジ画像を生成して追加
        const badgeImageData = create3DBadgeImageData()
        map.current.addImage('3d_badge', {
          width: badgeImageData.width,
          height: badgeImageData.height,
          data: new Uint8Array(badgeImageData.data),
        })
        
        console.log('=== Marker images and 3D badge loaded ===')

        // マップ準備完了
        setIsMapReady(true)
        console.log('=== Map is ready ===')
      } catch (error) {
        console.error('Failed to load marker images:', error)
      }
    })

    return () => {
      if (popupRef.current) {
        popupRef.current.remove()
      }
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      setIsMapReady(false)
    }
  }, [])

  // プロパティが変更されたらレイヤーを更新
  useEffect(() => {
    if (!map.current || !isMapReady || properties.length === 0) {
      console.log('=== Skipping layer update ===', { 
        hasMap: !!map.current, 
        isMapReady, 
        propertiesLength: properties.length 
      })
      return
    }

    console.log('=== Updating cultural properties layer ===')
    console.log('Properties count:', properties.length)

    // 3Dモデルの有無をカウント
    const propertiesWithMovies = properties.filter(p => p.movies && p.movies.length > 0)
    console.log('Properties with movies:', propertiesWithMovies.length)

    // GeoJSON フィーチャーコレクションに変換
    const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: properties.map((item) => {
        const hasMovies = item.movies && item.movies.length > 0
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [item.longitude, item.latitude] },
          properties: {
            id: item.id,
            name: item.name,
            address: item.address,
            type: item.type,
            movies: JSON.stringify(item.movies),
            images: item.images,
            hasMovies: hasMovies,
            icon: 'property_icon',
          },
        }
      }),
    }

    console.log('GeoJSON features:', geojsonData.features.length)

    // 既存のレイヤーとソースを削除
    if (map.current.getLayer('cultural_properties_3d_badge')) {
      map.current.removeLayer('cultural_properties_3d_badge')
    }
    if (map.current.getLayer('cultural_properties')) {
      map.current.removeLayer('cultural_properties')
    }
    if (map.current.getSource('cultural-properties')) {
      map.current.removeSource('cultural-properties')
    }

    // ソースを追加
    map.current.addSource('cultural-properties', {
      type: 'geojson',
      data: geojsonData,
    })

    // マーカーレイヤーを追加
    map.current.addLayer({
      id: 'cultural_properties',
      type: 'symbol',
      source: 'cultural-properties',
      layout: { 
        'icon-image': 'property_icon', 
        'icon-size': 0.2, 
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    })

    // 3Dバッジレイヤーを追加（ムービーがある文化財のみ）
    map.current.addLayer({
      id: 'cultural_properties_3d_badge',
      type: 'symbol',
      source: 'cultural-properties',
      filter: ['==', ['get', 'hasMovies'], true],
      layout: {
        'icon-image': '3d_badge',
        'icon-size': 0.4,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom-left',
        'icon-offset': [40, -60],
      },
    })

    console.log('=== Layers added successfully ===')

    // クリックイベントハンドラー
    const handleClick = (event: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      if (!event.features || !map.current) return
      const feature = event.features[0]
      const id = feature.properties?.id

      if (!id) return

      const property = properties.find((p) => p.id === id)
      if (!property) return

      // 既存のポップアップを閉じる
      if (popupRef.current) {
        popupRef.current.remove()
      }

      // 新しいポップアップを作成
      popupRef.current = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '320px',
      })
        .setLngLat([property.longitude, property.latitude])
        .setHTML(createPopupHTML(property))
        .addTo(map.current)
    }

    // カーソルスタイルの変更
    const handleMouseEnter = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer'
      }
    }

    const handleMouseLeave = () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = ''
      }
    }

    map.current.on('click', 'cultural_properties', handleClick)
    map.current.on('click', 'cultural_properties_3d_badge', handleClick)
    map.current.on('mouseenter', 'cultural_properties', handleMouseEnter)
    map.current.on('mouseenter', 'cultural_properties_3d_badge', handleMouseEnter)
    map.current.on('mouseleave', 'cultural_properties', handleMouseLeave)
    map.current.on('mouseleave', 'cultural_properties_3d_badge', handleMouseLeave)

    // クリーンアップ
    return () => {
      if (map.current) {
        map.current.off('click', 'cultural_properties', handleClick)
        map.current.off('click', 'cultural_properties_3d_badge', handleClick)
        map.current.off('mouseenter', 'cultural_properties', handleMouseEnter)
        map.current.off('mouseenter', 'cultural_properties_3d_badge', handleMouseEnter)
        map.current.off('mouseleave', 'cultural_properties', handleMouseLeave)
        map.current.off('mouseleave', 'cultural_properties_3d_badge', handleMouseLeave)
      }
    }
  }, [properties, isMapReady, createPopupHTML])

  // 現在地取得
  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('このブラウザは位置情報をサポートしていません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation([longitude, latitude])

        // 現在地マーカーを追加
        if (map.current) {
          new maplibregl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])
            .addTo(map.current)
          
          // 現在地に移動
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
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* コントロールボタン */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={handleGetCurrentLocation} 
          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer"
        >
          📍 現在地取得
        </button>
      </div>
      
      {/* ローディング表示 */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 text-sm">マップを読み込み中...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
    </div>
  )
}
