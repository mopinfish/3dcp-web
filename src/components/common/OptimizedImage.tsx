/**
 * OptimizedImage.tsx
 * 
 * 最適化された画像コンポーネント
 * 
 * ✅ Phase 3-3対応:
 * - 遅延読み込み対応
 * - エラーハンドリング
 * - フォールバック画像
 * - ローディング状態表示
 */

import React, { useState, memo } from 'react'
import Image, { ImageProps } from 'next/image'
import clsx from 'clsx'

type OptimizedImageProps = Omit<ImageProps, 'onError' | 'onLoad'> & {
  fallbackSrc?: string
  fallbackElement?: React.ReactNode
  showLoadingState?: boolean
  containerClassName?: string
}

/**
 * 最適化された画像コンポーネント
 */
const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  fallbackSrc,
  fallbackElement,
  showLoadingState = true,
  containerClassName,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // エラー時のフォールバック表示
  if (hasError) {
    if (fallbackSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt}
          className={className}
        />
      )
    }
    
    if (fallbackElement) {
      return <>{fallbackElement}</>
    }
    
    // デフォルトのフォールバック
    return (
      <div
        className={clsx(
          'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200',
          containerClassName
        )}
      >
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  // 外部URLかどうかを判定
  const isExternal = typeof src === 'string' && src.startsWith('http')

  return (
    <div className={clsx('relative', containerClassName)}>
      {/* ローディング状態 */}
      {showLoadingState && isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <Image
        {...props}
        src={src}
        alt={alt}
        className={clsx(
          className,
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100 transition-opacity duration-300'
        )}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={isExternal}
      />
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

/**
 * サムネイル用の最適化画像
 */
export const ThumbnailImage: React.FC<{
  src?: string | null
  alt: string
  className?: string
  priority?: boolean
}> = memo(({ src, alt, className, priority = false }) => {
  if (!src) {
    return (
      <div
        className={clsx(
          'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200',
          className
        )}
      >
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={clsx('object-cover', className)}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  )
})

ThumbnailImage.displayName = 'ThumbnailImage'

/**
 * アバター用の最適化画像
 */
export const AvatarImage: React.FC<{
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = memo(({ src, alt, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-2xl',
  }

  if (!src) {
    return (
      <div
        className={clsx(
          'rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold',
          sizeClasses[size],
          textSizeClasses[size],
          className
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  const pixelSize = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96,
  }

  return (
    <div className={clsx('rounded-full overflow-hidden', sizeClasses[size], className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={pixelSize[size]}
        height={pixelSize[size]}
        className="w-full h-full object-cover"
      />
    </div>
  )
})

AvatarImage.displayName = 'AvatarImage'

export default OptimizedImage
