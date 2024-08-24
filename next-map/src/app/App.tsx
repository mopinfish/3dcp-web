import React from 'react'

import { Camera } from './Camera'
import { Clock } from './Clock'
import { Lighting } from './Lighting'
import { MapboxImagery } from './MapboxImagery'
import { Viewer } from './Viewer'

export const App: React.FC = () => {
  return (
    <Viewer>
      <Camera />
      <Clock />
      <Lighting />
      <MapboxImagery
        accessToken="pk.eyJ1IjoibW9waW5maXNoIiwiYSI6ImNqZGZreGVuajBhNjIyd29idXI3ZHFxNm4ifQ._edxUwp0j5sAl7FsK9oyrA"
        username="shotamatsuda"
        styleId="cl9302ng4000915rmrwd0m710"
      />
    </Viewer>
  )
}
