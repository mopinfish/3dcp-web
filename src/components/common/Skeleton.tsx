/**
 * Skeleton.tsx
 * 
 * 共通のスケルトンUIコンポーネント
 * 
 * ✅ Phase 3-3対応:
 * - ローディング中のプレースホルダー表示
 * - アニメーション付き
 * - 様々なサイズに対応
 */

import React from 'react'
import clsx from 'clsx'

type SkeletonProps = {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

/**
 * 基本スケルトンコンポーネント
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  }
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }
  
  const style: React.CSSProperties = {
    width: width,
    height: height,
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}

/**
 * カード型スケルトン
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('bg-white rounded-xl border border-gray-100 overflow-hidden', className)}>
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      <div className="p-4">
        <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  )
}

/**
 * リストアイテム型スケルトン
 */
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('flex items-center p-2', className)}>
      <Skeleton variant="rounded" className="w-12 h-12 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <Skeleton variant="text" className="h-4 w-3/4 mb-1" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
  )
}

/**
 * ユーザーアイテム型スケルトン
 */
export const UserItemSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('flex items-center p-2', className)}>
      <Skeleton variant="circular" className="w-6 h-6 mr-2" />
      <Skeleton variant="circular" className="w-10 h-10 mr-3" />
      <div className="flex-1">
        <Skeleton variant="text" className="h-4 w-1/3 mb-1" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
      <Skeleton variant="rounded" className="w-12 h-6" />
    </div>
  )
}

/**
 * プロフィールヘッダー型スケルトン
 */
export const ProfileHeaderSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('flex flex-col sm:flex-row items-center sm:items-start gap-6', className)}>
      <Skeleton variant="circular" className="w-24 h-24 sm:w-32 sm:h-32" />
      <div className="flex-1 text-center sm:text-left">
        <Skeleton variant="text" className="h-8 w-48 mb-2 mx-auto sm:mx-0" />
        <Skeleton variant="text" className="h-4 w-32 mb-4 mx-auto sm:mx-0" />
        <div className="flex justify-center sm:justify-start gap-6 mb-4">
          <Skeleton variant="rounded" className="w-16 h-16" />
          <Skeleton variant="rounded" className="w-16 h-16" />
        </div>
        <Skeleton variant="text" className="h-4 w-40 mx-auto sm:mx-0" />
      </div>
    </div>
  )
}

/**
 * グリッドスケルトン（複数カード）
 */
export const GridSkeleton: React.FC<{
  count?: number
  columns?: string
  className?: string
}> = ({
  count = 8,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  className,
}) => {
  return (
    <div className={clsx('grid gap-4', columns, className)}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
