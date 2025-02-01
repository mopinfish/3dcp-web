import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LumaSplatsThree } from '@lumaai/luma-web'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { movie as movieService } from '@/domains/services'
import { Movie } from '@/domains/models'
import { styled } from 'styled-components'

const ThreeCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`

type LumaThreeProps = {
  id: number
}

const LumaThree: React.FC<LumaThreeProps> = ({ id }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [movie, setMovie] = React.useState<Movie | null>(null)

  const actions = {
    onload: async () => {
      const movie = await movieService.findMovie(id)
      setMovie(movie)
    },
  }

  useEffect(() => {
    actions.onload()
  }, [])

  useEffect(() => {
    if (!movie || !canvas.current) return
    const source = movie.url ?? 'https://lumalabs.ai/capture/c07332cc-cfb7-4bb2-b4b8-e68dd13999ae'

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
      source: source,
    })
    scene.add(splat)

    renderer.setAnimationLoop(() => {
      controls.update()
      renderer.render(scene, camera)
    })
  }, [movie])

  return <ThreeCanvas ref={canvas} />
}

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

const Luma: NextPage = () => {
  const router = useRouter()
  const { movie_id } = router.query
  console.log('movie_id', movie_id)

  return (
    <LayoutWithFooter>
      {!movie_id ? <Loading /> : <LumaThree id={Number(movie_id)} />}
    </LayoutWithFooter>
  )
}

export default Luma
