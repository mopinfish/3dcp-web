'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

export default function GLBViewer({ url }: { url: string }) {
  return (
    <Canvas style={{ height: '100vh', width: '100%' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
