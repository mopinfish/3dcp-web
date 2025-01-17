'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import styled from 'styled-components'
import { CulturalProperties } from '@/domains/models/cultural_property'

const PopupCard = styled.div`
  width: 100%;
  padding: 10px;
`

const PopupImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
`

const PopupTitle = styled.h3`
  margin: 10px 0 5px;
  font-size: 18px;
`

const PopupAddress = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
`

const PopupLink = styled.a`
  display: inline-block;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
`

const PopupHtml: React.FC<{ name: string; imageUrl: string; url: string; address: string }> = ({
  name,
  imageUrl,
  url,
  address,
}) => {
  return (
    <PopupCard>
      <PopupImage src={imageUrl} alt={name} />
      <PopupTitle>{name}</PopupTitle>
      <PopupAddress>{address}</PopupAddress>
      <PopupLink href={url} target="_blank" rel="noopener noreferrer">
        3Dモデルを見る
      </PopupLink>
    </PopupCard>
  )
}

type MapProps = {
  properties: CulturalProperties
}

export default function Map({ properties }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

  // GeoJSONフィーチャーコレクションに変換
  const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: properties.map((item) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude],
      },
      properties: {
        id: item.id,
        name: item.name,
        address: item.address,
        movies: item.movies,
        images: item.images,
        // その他必要なプロパティを追加
      },
    })),
  }

  useEffect(() => {
    if (properties && mapContainer.current) {
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
        center: [139.7975443779719, 35.678396026551994],
        zoom: 13,
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
      map.current.on('load', async () => {
        if (map.current === null) return

        // 地図の読み込み完了後に実行
        const image = await map.current.loadImage('/img/marker_icon.png')
        map.current.addImage('property_icon', image.data)

        // ソースを追加
        map.current.addSource('cultural-properties', {
          type: 'geojson',
          data: geojsonData,
        })

        // ポイントを表示するレイヤーの追加
        map.current.addLayer({
          id: 'cultural_properties',
          type: 'symbol',
          source: 'cultural-properties',
          layout: {
            'icon-image': 'property_icon',
            'icon-size': 0.2,
          },
        })
      })

      map.current.on('click', 'cultural_properties', (event) => {
        if (event.features === undefined) return
        const feature = event.features[0]
        const coordinates = event.lngLat
        const property = feature.properties
        const name = property.name
        const movie = JSON.parse(property.movies)[0]
        const imageUrl = JSON.parse(property.images)[0]?.image ?? '/img/noimage.png'
        const url = '/luma/' + movie.id
        const address = property.address

        // ポップアップを表示する
        new maplibregl.Popup({
          offset: 10, // ポップアップの位置
          closeButton: false, // 閉じるボタンの表示
        })
          .setLngLat(coordinates)
          .setHTML(renderToStaticMarkup(<PopupHtml name={name} imageUrl={imageUrl} url={url} address={address} />))
          .addTo(map.current!)
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [properties])

  return <div ref={mapContainer} style={{ width: '100wh', height: '100vh' }} />
}
