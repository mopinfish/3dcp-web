import { Global, css } from '@emotion/react'
import { NextPage } from 'next'
import React from 'react'

import Map from '../components/Map'

const Home: NextPage = () => {
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
      <h1>My Map</h1>
      <Map />
    </>
  )
}

export default Home
