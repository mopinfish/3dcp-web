/**
 * Map.tsx
 * 
 * 2Dマップコンポーネント
 * 
 * ✅ Phase 2対応:
 * - ポップアップに文化財詳細ページへのリンクを追加
 * - ムービーがある場合は3Dビューアへのリンクも表示
 * 
 * ✅ Phase 2-3対応:
 * - 3Dモデルがある文化財にバッジを表示
 * 
 * ✅ Phase 3-3対応:
 * - クラスタリング機能を追加（パフォーマンス改善）
 */

'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { CulturalProperties, CulturalProperty } from '@/domains/models/cultural_property'

type MapProps = { properties: CulturalProperties }

/**
 * 3Dバッジ画像を生成する関数
 */
function create3DBadgeImageData(): ImageData {
  const canvas = document.createElement('canvas')
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
  ctx.fillStyle = '#22c55e'
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  ctx.stroke()
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
            style="display: flex; align-items: center; justify-content: center; padding: 8px 16px; background-color: #2563eb; color: white; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none;"
          >
            詳細情報を見る
          </a>
          
          ${hasMovies ? `
            <a 
              href="/luma/${property.movies[0].id}" 
              style="display: flex; align-items: center; justify-content: center; padding: 8px 16px; background-color: #7c3aed; color: white; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none;"
            >
              3Dモデルを見る
            </a>
          ` : ''}
        </div>
      </div>
    `
  }, [])

  // ポップアップスタイル
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'maplibre-popup-style'
    style.textContent = `
      .maplibregl-popup-close-button {
        font-size: 24px !important;
        width: 32px !important;
        height: 32px !important;
        right: 4px !important;
        top: 4px !important;
      }
      .maplibregl-popup-content {
        padding: 16px !important;
        border-radius: 12px !important;
      }
    `
    const existingStyle = document.getElementById('maplibre-popup-style')
    if (existingStyle) existingStyle.remove()
    document.head.appendChild(style)
    return () => {
      const s = document.getElementById('maplibre-popup-style')
      if (s) s.remove()
    }
  }, [])

  // マップ初期化
  useEffect(() => {
    if (!mapContainer.current || map.current) return

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
      zoom: 10,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', async () => {
      if (!map.current) return
      
      try {
        // マーカー画像を読み込み
        const image = await map.current.loadImage('/img/marker_icon.png')
        map.current.addImage('property_icon', image.data)
        
        // 3Dバッジを生成
        const badgeImageData = create3DBadgeImageData()
        map.current.addImage('3d_badge', {
          width: badgeImageData.width,
          height: badgeImageData.height,
          data: new Uint8Array(badgeImageData.data),
        })
        
        setIsMapReady(true)
      } catch (error) {
        console.error('Failed to load marker images:', error)
        setIsMapReady(true)
      }
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

  // プロパティ変更時にレイヤー更新
  useEffect(() => {
    if (!map.current || !isMapReady || properties.length === 0) return

    const mapInstance = map.current

    // GeoJSONデータ作成
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: properties.map((item) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [item.longitude, item.latitude] },
        properties: {
          id: item.id,
          name: item.name,
          address: item.address,
          type: item.type,
          hasMovies: item.movies && item.movies.length > 0,
        },
      })),
    }

    // 既存レイヤー/ソース削除
    const layersToRemove = ['clusters', 'cluster-count', 'unclustered-point', 'unclustered-point-3d', '3d-badge-layer']
    layersToRemove.forEach(id => {
      if (mapInstance.getLayer(id)) mapInstance.removeLayer(id)
    })
    if (mapInstance.getSource('cultural-properties')) {
      mapInstance.removeSource('cultural-properties')
    }

    // クラスタリング対応ソース追加
    mapInstance.addSource('cultural-properties', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })

    // クラスタ円
    mapInstance.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step', ['get', 'point_count'],
          '#51bbd6', 10,
          '#f1f075', 30,
          '#f28cb1'
        ],
        'circle-radius': [
          'step', ['get', 'point_count'],
          15, 10, 20, 30, 25
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    })

    // クラスタ数字
    mapInstance.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'cultural-properties',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12,
      },
    })

    // 通常ポイント（3Dなし）
    mapInstance.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['all', ['!', ['has', 'point_count']], ['!=', ['get', 'hasMovies'], true]],
      paint: {
        'circle-color': '#3b82f6',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    })

    // 3Dありポイント（緑）
    mapInstance.addLayer({
      id: 'unclustered-point-3d',
      type: 'circle',
      source: 'cultural-properties',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'hasMovies'], true]],
      paint: {
        'circle-color': '#22c55e',
        'circle-radius': 10,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
      },
    })

    // 3Dバッジ
    mapInstance.addLayer({
      id: '3d-badge-layer',
      type: 'symbol',
      source: 'cultural-properties',
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'hasMovies'], true]],
      layout: {
        'icon-image': '3d_badge',
        'icon-size': 0.35,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom-left',
        'icon-offset': [12, -8],
      },
    })

    // クリックハンドラ
    const onClusterClick = (e: maplibregl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['clusters'] })
      if (!features.length) return
      
      const clusterId = features[0].properties?.cluster_id
      const source = mapInstance.getSource('cultural-properties') as maplibregl.GeoJSONSource
      
      source.getClusterExpansionZoom(clusterId).then(zoom => {
        const geo = features[0].geometry as GeoJSON.Point
        mapInstance.easeTo({
          center: geo.coordinates as [number, number],
          zoom: (zoom ?? 14) + 1,
        })
      }).catch(err => console.error(err))
    }

    const onPointClick = (e: maplibregl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, { 
        layers: ['unclustered-point', 'unclustered-point-3d', '3d-badge-layer'] 
      })
      if (!features.length) return

      const id = features[0].properties?.id
      if (!id) return

      const property = properties.find(p => p.id === id)
      if (!property) return

      if (popupRef.current) popupRef.current.remove()

      const geo = features[0].geometry as GeoJSON.Point
      popupRef.current = new maplibregl.Popup({ offset: 15, maxWidth: '320px' })
        .setLngLat(geo.coordinates as [number, number])
        .setHTML(createPopupHTML(property))
        .addTo(mapInstance)
    }

    const setCursor = (cursor: string) => () => {
      mapInstance.getCanvas().style.cursor = cursor
    }

    mapInstance.on('click', 'clusters', onClusterClick)
    mapInstance.on('click', 'unclustered-point', onPointClick)
    mapInstance.on('click', 'unclustered-point-3d', onPointClick)
    mapInstance.on('click', '3d-badge-layer', onPointClick)
    
    mapInstance.on('mouseenter', 'clusters', setCursor('pointer'))
    mapInstance.on('mouseleave', 'clusters', setCursor(''))
    mapInstance.on('mouseenter', 'unclustered-point', setCursor('pointer'))
    mapInstance.on('mouseleave', 'unclustered-point', setCursor(''))
    mapInstance.on('mouseenter', 'unclustered-point-3d', setCursor('pointer'))
    mapInstance.on('mouseleave', 'unclustered-point-3d', setCursor(''))
    mapInstance.on('mouseenter', '3d-badge-layer', setCursor('pointer'))
    mapInstance.on('mouseleave', '3d-badge-layer', setCursor(''))

    return () => {
      mapInstance.off('click', 'clusters', onClusterClick)
      mapInstance.off('click', 'unclustered-point', onPointClick)
      mapInstance.off('click', 'unclustered-point-3d', onPointClick)
      mapInstance.off('click', '3d-badge-layer', onPointClick)
    }
  }, [properties, isMapReady, createPopupHTML])

  // 現在地取得
  const handleGetCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('このブラウザは位置情報をサポートしていません')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (map.current) {
          new maplibregl.Marker({ color: '#ef4444' })
            .setLngLat([longitude, latitude])
            .addTo(map.current)
          map.current.flyTo({ center: [longitude, latitude], zoom: 15 })
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
      {/* コントロール */}
      <div className="absolute top-3 left-3 z-10">
        <button 
          onClick={handleGetCurrentLocation} 
          className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 flex items-center cursor-pointer"
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
          <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></span>
          <span className="text-gray-600">3Dモデルあり</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></span>
          <span className="text-gray-600">文化財</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow flex items-center justify-center text-[9px] font-bold text-gray-700">n</span>
          <span className="text-gray-600">クラスタ</span>
        </div>
      </div>

      {/* 件数 */}
      {isMapReady && properties.length > 0 && (
        <div className="absolute top-3 right-14 z-10 bg-white rounded-lg shadow-md px-3 py-1.5 text-sm text-gray-700 font-medium">
          {properties.length.toLocaleString()} 件
        </div>
      )}

      {/* ローディング */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 text-sm">マップを読み込み中...</p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
