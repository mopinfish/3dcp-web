import React from 'react'
import dynamic from 'next/dynamic'

const GLBViewer = dynamic(() => import('../components/blocks/GlbViewer'), {
  ssr: false,
})

export default function Page() {
  console.log('GLB Viewer Page Loaded')
  return <GLBViewer url="/data/kanmin_hub.glb" />
}
