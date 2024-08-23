import { Global, css } from '@emotion/react'
import { NextPage } from 'next'
import React from 'react'

import { App } from '../app/App'

// Cesiumが実行時にWeb Workerのためのスクリプトを読み込むために、「6.3.2　環境構築」
// で作成したpublic/cesiumの静的ファイルへのパスを指定します。
if (typeof window !== 'undefined') {
  window.CESIUM_BASE_URL = '/cesium'
}

const Index: NextPage = () => {
  return (
    <>
      <Global
        styles={css`
          html,
          body,
          #__next {
            width: 100%;
            height: 100%;
            margin: 0;
          }
        `}
      />
      <App />
    </>
  )
}

export default Index