import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LumaSplatsThree } from '@lumaai/luma-web'
import { movie as movieService } from '@/domains/services'
import { Movie } from '@/domains/models'

type LumaThreeProps = { id: number; fullPage?: boolean }

export const ThreeCanvas: React.FC<LumaThreeProps> = ({ id, fullPage = false }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initThreeJS = useCallback(() => {
    if (!movie || !canvas.current || !movie.url) {
      setError('モデルURLが見つかりません')
      return
    }

    try {
      const renderer = new WebGLRenderer({ canvas: canvas.current, antialias: true })
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
  }, [movie])

  const actions = useMemo(
    () => ({
      onload: async () => {
        try {
          const movieData = await movieService.findMovie(id)
          setMovie(movieData)

          if (!fullPage && movieData) {
            // APIから取得したthumbnail_urlを使用
            // thumbnail_urlがない場合はnullのまま（プレースホルダーを表示）
            if (movieData.thumbnail_url) {
              setThumbnailUrl(movieData.thumbnail_url)
            }
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
    }),
    [fullPage, id, is3DLoaded, initThreeJS],
  )

  useEffect(() => {
    if (id) actions.onload()
  }, [actions, id])

  useEffect(() => {
    if (fullPage && movie) {
      actions.load3DModel()
    }
  }, [actions, movie, fullPage])

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

  const handleClick = () => {
    actions.load3DModel()
  }

  /**
   * サムネイル画像のエラーハンドリング
   * エラー時はサムネイルをクリアしてプレースホルダーを表示
   */
  const handleThumbnailError = () => {
    setThumbnailUrl(null)
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

      {!is3DLoaded && !fullPage && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="3D model thumbnail"
              className="w-full h-full object-cover"
              onError={handleThumbnailError}
              width={600}
              height={400}
              unoptimized={thumbnailUrl.startsWith('http')}
            />
          ) : (
            // プレースホルダー（サムネイルがない場合）
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
              <svg
                className="w-16 h-16 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
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
