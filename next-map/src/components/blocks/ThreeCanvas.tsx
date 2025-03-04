import React, { useEffect, useRef, useState } from 'react'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LumaSplatsThree } from '@lumaai/luma-web'
import { movie as movieService } from '@/domains/services'
import { Movie } from '@/domains/models'
import { styled } from 'styled-components'

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

type LumaThreeProps = {
  id: number
  width?: number
  height?: number
}

export const ThreeCanvas: React.FC<LumaThreeProps> = ({ id, width = 200, height = 200 }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    if (!canvas.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(canvas.current);

    return () => observer.disconnect(); // クリーンアップ
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await movieService.findMovie(id)
      setMovie(movie)
    }
    fetchMovie()
  }, [])

  useEffect(() => {
    if (!movie || !canvas.current) return

    const source = movie.url ?? 'https://lumalabs.ai/capture/c07332cc-cfb7-4bb2-b4b8-e68dd13999ae'

    const newRenderer = new WebGLRenderer({
      canvas: canvas.current,
      antialias: false,
    })

    const scene = new Scene()

    const newCamera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
    newCamera.position.z = 2

    const controls = new OrbitControls(newCamera, canvas.current)
    controls.enableDamping = true

    const splat = new LumaSplatsThree({
      source: source,
    })
    scene.add(splat)

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      newRenderer.render(scene, newCamera)
    }

    animate()

    return () => {
      controls.dispose()
      newRenderer.dispose()
    }
  }, [movie, width, height])

  return <Canvas ref={canvas} width={width} height={height} />
}
