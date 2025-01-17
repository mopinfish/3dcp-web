import { NextPage } from 'next'
import React, { useEffect, useRef } from 'react'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LumaSplatsThree } from '@lumaai/luma-web'
//import { LayoutWithFooter } from '@/components/layouts/Layout'

const LumaThree: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (!canvas.current) return
    const renderer = new WebGLRenderer({
      canvas: canvas.current,
      antialias: false,
    })

    renderer.setSize(window.innerWidth, window.innerHeight, false)

    const scene = new Scene()

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 2

    const controls = new OrbitControls(camera, canvas.current)
    controls.enableDamping = true

    const splat = new LumaSplatsThree({
      source: 'https://lumalabs.ai/capture/c07332cc-cfb7-4bb2-b4b8-e68dd13999ae',
    })
    scene.add(splat)

    renderer.setAnimationLoop(() => {
      controls.update()
      renderer.render(scene, camera)
    })
  }, [])
  return <canvas ref={canvas}></canvas>
}

const Luma: NextPage = () => {
  return (
    <>
      <LumaThree />
    </>
  )
}

export default Luma
