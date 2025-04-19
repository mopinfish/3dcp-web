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
  display: block;
`

type ThreeContainerProps = {
  $fullPage?: boolean;
}

const ThreeContainer = styled.div<ThreeContainerProps>`
  width: 100%;
  height: ${props => props.$fullPage ? 'calc(100vh - 180px)' : '300px'};
  position: relative;
  cursor: pointer;
`

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
`

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  z-index: 10;
`

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  z-index: 5;

  &::after {
    content: '▶';
    display: block;
    margin-left: 5px;
  }
`

type LumaThreeProps = {
  id: number;
  fullPage?: boolean;
}

export const ThreeCanvas: React.FC<LumaThreeProps> = ({ id, fullPage = false }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const sceneRef = useRef<Scene | null>(null)

  const actions = {
    onload: async () => {
      const movie = await movieService.findMovie(id)
      setMovie(movie)
      
      // サムネイルのURLを設定
      setThumbnailUrl(`/thumbnails/movie-${id}.jpg`)
    },
    load3DModel: () => {
      if (is3DLoaded) return // すでに読み込み済みの場合は何もしない
      
      setIsLoading(true)
      setTimeout(() => {
        initThreeJS()
        setIsLoading(false)
        setIs3DLoaded(true)
      }, 100)
    }
  }

  useEffect(() => {
    actions.onload()
    
    // フルページモードの場合は自動的に3Dモデルを読み込む
    if (fullPage) {
      actions.load3DModel()
    }
  }, [])

  useEffect(() => {
    // ウィンドウリサイズ時にレンダラーのサイズを更新
    const handleResize = () => {
      if (containerRef.current && rendererRef.current && cameraRef.current && is3DLoaded) {
        const { clientWidth, clientHeight } = containerRef.current;
        
        // レンダラーのサイズを更新
        rendererRef.current.setSize(clientWidth, clientHeight, false);
        
        // カメラのアスペクト比を更新
        cameraRef.current.aspect = clientWidth / clientHeight;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [is3DLoaded]);

  const initThreeJS = () => {
    if (!movie || !canvas.current) return
    const source = movie.url ?? 'https://lumalabs.ai/capture/c07332cc-cfb7-4bb2-b4b8-e68dd13999ae'

    const renderer = new WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
      alpha: true
    })
    rendererRef.current = renderer;

    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current
      renderer.setSize(clientWidth, clientHeight, false)
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }

    const scene = new Scene()
    sceneRef.current = scene;

    // アスペクト比を適切に設定
    const aspect = containerRef.current 
      ? containerRef.current.clientWidth / containerRef.current.clientHeight 
      : window.innerWidth / window.innerHeight
      
    const camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
    cameraRef.current = camera;
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
    
    // クリーンアップ関数
    return () => {
      renderer.dispose()
      renderer.setAnimationLoop(null)
      rendererRef.current = null;
      cameraRef.current = null;
      sceneRef.current = null;
    }
  }

  const handleClick = () => {
    actions.load3DModel()
  }

  return (
    <ThreeContainer ref={containerRef} onClick={handleClick} $fullPage={fullPage}>
      {!is3DLoaded && thumbnailUrl && (
        <ThumbnailContainer>
          <ThumbnailImage 
            src={thumbnailUrl} 
            alt="3D model thumbnail" 
            onError={() => setThumbnailUrl('/thumbnails/simple-thumbnail.jpg')} 
          />
          <PlayButton />
        </ThumbnailContainer>
      )}
      
      {isLoading && (
        <LoadingOverlay>
          <div>読み込み中...</div>
        </LoadingOverlay>
      )}
      
      <Canvas ref={canvas} style={{ display: is3DLoaded ? 'block' : 'none' }} />
    </ThreeContainer>
  )
}
