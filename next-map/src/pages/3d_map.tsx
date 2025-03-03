import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const Map3D = dynamic(() => import('../components/blocks/3dMap'), {
  ssr: false,
})

const MapScreen3D: NextPage = () => {
  return (
    <div>
      <Head>
        <title>PLATEAU 3D都市モデル表示</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Map3D />
    </div>
  )
}

export default MapScreen3D
