import React, { useEffect, useRef, useState } from 'react'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LumaSplatsThree } from '@lumaai/luma-web'
import { movie as movieService } from '@/domains/services'
import { Movie } from '@/domains/models'

type LumaThreeProps = {
  id: number
  fullPage?: boolean
}

export const ThreeCanvas: React.FC<LumaThreeProps> = ({ id, fullPage = false }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const [error, setError] = useState<string | null>(null)

  const actions = {
    onload: async () => {
      try {
        const movieData = await movieService.findMovie(id)
        setMovie(movieData)

        if (!fullPage) {
          setThumbnailUrl(`/thumbnails/movie-${id}.jpg`)
        }
      } catch (err) {
        console.error('Error loading movie data:', err)
        setError('データの読み込みに失敗しました')
      }
    },
    load3DModel: () => {
      if (is3DLoaded) return
      setIsLoading(true)
      setTimeout(() => {
        try {
          initThreeJS()
          setIsLoading(false)
          setIs3DLoaded(true)
        } catch (err) {
          console.error('Error initializing ThreeJS:', err)
          setError('3Dモデルの読み込みに失敗しました')
          setIsLoading(false)
        }
      }, 100)
    },
  }

  useEffect(() => {
    if (id) actions.onload()
  }, [id])

  useEffect(() => {
    if (fullPage && movie) {
      actions.load3DModel()
    }
  }, [movie, fullPage])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvas.current && is3DLoaded) {
        const { clientWidth, clientHeight } = containerRef.current
        rendererRef.current?.setSize(clientWidth, clientHeight, false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [is3DLoaded])

  const initThreeJS = () => {
    if (!movie || !canvas.current || !movie.url) {
      setError('モデルURLが見つかりません')
      return
    }

    try {
      const renderer = new WebGLRenderer({
        canvas: canvas.current,
        antialias: true,
      })
      rendererRef.current = renderer

      const { clientWidth, clientHeight } = containerRef.current ?? {
        clientWidth: window.innerWidth,
        clientHeight: window.innerHeight,
      }

      renderer.setSize(clientWidth, clientHeight, false)

      const scene = new Scene()
      const aspect = clientWidth / clientHeight
      const camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
      camera.position.z = 2

      const controls = new OrbitControls(camera, canvas.current)
      controls.enableDamping = true

      const splat = new LumaSplatsThree({ source: movie.url })
      scene.add(splat)

      renderer.setAnimationLoop(() => {
        controls.update()
        renderer.render(scene, camera)
      })
    } catch (err) {
      console.error('Error in initThreeJS:', err)
      setError('3Dモデルの初期化に失敗しました')
    }
  }

  const handleClick = () => {
    actions.load3DModel()
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative w-full ${
        fullPage ? 'h-[calc(100vh-180px)]' : 'h-[300px]'
      } cursor-pointer`}
    >
      {error && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-lg z-10">
          {error}
        </div>
      )}

      {!is3DLoaded && thumbnailUrl && !fullPage && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={thumbnailUrl}
            alt="3D model thumbnail"
            className="w-full h-full object-cover"
            onError={() => setThumbnailUrl('/thumbnails/simple-thumbnail.jpg')}
          />
          <div className="absolute top-1/2 left-1/2 w-[60px] h-[60px] bg-black/50 rounded-full flex items-center justify-center text-white text-2xl z-5 transform -translate-x-1/2 -translate-y-1/2">
            ▶
          </div>
        </div>
      )}

      {isLoading && !error && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-lg z-10">
          読み込み中...
        </div>
      )}

      <canvas
        ref={canvas}
        className="w-full h-full block"
        style={{ display: is3DLoaded || fullPage ? 'block' : 'none' }}
      />
    </div>
  )
}
