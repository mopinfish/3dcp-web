import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const styles: { [key: string]: maplibregl.StyleSpecification } = {
  osm: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  konjaku: {
    version: 8,
    sources: {
      konjaku: {
        type: 'raster',
        tiles: ['https://cyberjapandata.gsi.go.jp/xyz/nankai/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '今昔マップ',
      },
    },
    layers: [
      {
        id: 'konjaku-layer',
        type: 'raster',
        source: 'konjaku',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  rekichizu: {
    version: 8,
    sources: {
      rekichizu: {
        type: 'raster',
        tiles: ['https://maps.gsi.go.jp/xyz/rekichizu/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: 'れきちず',
      },
    },
    layers: [
      {
        id: 'rekichizu-layer',
        type: 'raster',
        source: 'rekichizu',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
}

// Add PLATEAU source and layer to all styles
Object.values(styles).forEach(style => {
  style.sources.plateau = {
    type: 'vector',
    tiles: ['https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf'],
    minzoom: 10,
    maxzoom: 16,
    attribution: "データの出典:<a href='https://github.com/indigo-lab/plateau-tokyo23ku-building-mvt-2020'>plateau-tokyo23ku-building-mvt-2020 by indigo-lab</a> (<a href='https://www.mlit.go.jp/plateau/'>国土交通省 Project PLATEAU</a> のデータを加工して作成)",
  }
  style.layers.push({
    id: 'bldg',
    type: 'fill-extrusion',
    source: 'plateau',
    'source-layer': 'bldg',
    minzoom: 10,
    maxzoom: 20,
    paint: {
      'fill-extrusion-color': '#797979',
      'fill-extrusion-height': ['get', 'measuredHeight'],
    },
  })
})

const Map3D = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: styles.osm,
      center: [139.745461, 35.65856],
      zoom: 14,
      pitch: 45,
      maxPitch: 85,
    })

    mapInstance.addControl(new maplibregl.NavigationControl())

    mapInstance.on('load', async () => {
      const response = await fetch('./img/icon.png')
      const blob = await response.blob()
      const iconImage = await createImageBitmap(blob)
      mapInstance.addImage('facility_icon', iconImage as ImageBitmap)
      mapInstance.addSource('facility_point', {
        type: 'geojson',
        data: './tokyo_ks.geojson',
      })
      mapInstance.addLayer({
        id: 'facility_point',
        type: 'symbol',
        source: 'facility_point',
        layout: {
          'icon-image': 'facility_icon',
          'icon-size': 0.1,
        },
      })
    })

    mapInstance.on('click', 'facility_point', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const coordinates: [number, number] =
          feature.geometry.type === 'Point'
            ? ((feature.geometry as GeoJSON.Point).coordinates.slice(0, 2) as [number, number])
            : [0, 0]

        const name = feature.properties?.P12_001 || 'No name'

        new maplibregl.Popup().setLngLat(coordinates).setHTML(`<h3>${name}</h3>`).addTo(mapInstance)
      }
    })

    mapInstance.on('mouseenter', 'facility_point', () => {
      mapInstance.getCanvas().style.cursor = 'pointer'
    })
    mapInstance.on('mouseleave', 'facility_point', () => {
      mapInstance.getCanvas().style.cursor = ''
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  const switchStyle = (styleKey: 'osm' | 'konjaku' | 'rekichizu') => {
    if (map) {
      map.setStyle(styles[styleKey])
      
      // Re-add facility point layer after style change
      map.once('style.load', () => {
        map.addSource('facility_point', {
          type: 'geojson',
          data: './tokyo_ks.geojson',
        })
        map.addLayer({
          id: 'facility_point',
          type: 'symbol',
          source: 'facility_point',
          layout: {
            'icon-image': 'facility_icon',
            'icon-size': 0.1,
          },
        })
      })
    }
  }

  return (
    <>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <button onClick={() => switchStyle('osm')}>OpenStreetMap</button>
        <button onClick={() => switchStyle('konjaku')}>今昔マップ</button>
        <button onClick={() => switchStyle('rekichizu')}>れきちず</button>
      </div>
    </>
  )
}

export default Map3D
