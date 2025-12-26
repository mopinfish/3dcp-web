/**
 * /luma/[movie_id].tsx
 *
 * 3Dモデル（Luma AI）表示ページ
 * - 3Dモデルをフルスクリーンで表示
 * - SNSシェアボタンを常時表示
 */

import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { ThreeCanvas } from '@/components/blocks/ThreeCanvas'
import SnsShareButtons from '@/components/blocks/SnsShareButtons'
import { Movie } from '@/domains/models/movie'
import * as MovieRepository from '@/infrastructures/repositories/movie'

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

const Luma: NextPage = () => {
  const router = useRouter()
  const [movieId, setMovieId] = useState<number | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [showSharePanel, setShowSharePanel] = useState(false)

  useEffect(() => {
    if (router.isReady && router.query.movie_id) {
      const id = Number(router.query.movie_id)
      console.log('movie_id set to:', id)
      setMovieId(id)

      // 3Dモデルの情報を取得
      MovieRepository.find(id)
        .then((data) => {
          setMovie(data)
        })
        .catch((error) => {
          console.error('Failed to fetch movie:', error)
        })
    }
  }, [router.isReady, router.query.movie_id])

  // シェア用のURL（クライアントサイドで取得）
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }

  // シェア用のタイトル
  const getShareTitle = () => {
    if (movie?.title) {
      return `${movie.title} | 3DCP - 3D Cultural Properties`
    }
    return '3Dモデル | 3DCP - 3D Cultural Properties'
  }

  if (!movieId) {
    return (
      <LayoutWithFooter>
        <Loading />
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      {/* OGP用のHead */}
      <Head>
        <title>{movie?.title || '3Dモデル'} | 3DCP - 3D Cultural Properties</title>
        <meta
          name="description"
          content={movie?.note || '3D Cultural Propertiesで3Dモデルを閲覧'}
        />
        <meta property="og:title" content={getShareTitle()} />
        <meta
          property="og:description"
          content={movie?.note || '3D Cultural Propertiesで3Dモデルを閲覧'}
        />
        <meta property="og:type" content="article" />
        {movie?.thumbnail_url && (
          <meta property="og:image" content={movie.thumbnail_url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* 3Dビューア */}
      <div className="relative">
        <ThreeCanvas id={movieId} fullPage={true} />

        {/* シェアボタン（常時表示、右下に固定） */}
        <div className="fixed bottom-4 right-4 z-50">
          {/* シェアパネル */}
          {showSharePanel && (
            <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[280px] animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  この3Dモデルをシェア
                </h3>
                <button
                  onClick={() => setShowSharePanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="閉じる"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SnsShareButtons
                url={getShareUrl()}
                title={movie?.title || '3Dモデル'}
                description={movie?.note || undefined}
                hashtags={['3D文化財']}
                shareType="3d_model"
                compact={true}
              />
            </div>
          )}

          {/* シェアボタン（トグル） */}
          <button
            onClick={() => setShowSharePanel(!showSharePanel)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              showSharePanel
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="シェア"
            title="この3Dモデルをシェア"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* フェードインアニメーション用スタイル */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </LayoutWithFooter>
  )
}

export default Luma
