import React, { useEffect, useState } from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { Movie } from '@/domains/models/movie'
import Link from 'next/link'
import Image from 'next/image'

const LumaList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const movieResponse = await fetch('/data/luma-movies.json')
        if (!movieResponse.ok) throw new Error('Failed to fetch movies')
        const movieData = await movieResponse.json()
        setMovies(movieData)

        try {
          const thumbnailResponse = await fetch('/thumbnails/thumbnails.json')
          if (thumbnailResponse.ok) {
            const thumbnailData = await thumbnailResponse.json()
            const thumbnailMap: Record<number, string> = {}
            thumbnailData.forEach((thumbnail: { movieId: number; imageUrl: string }) => {
              thumbnailMap[thumbnail.movieId] = thumbnail.imageUrl
            })
            setThumbnails(thumbnailMap)
          }
        } catch (thumbnailError) {
          console.error('Error loading thumbnails:', thumbnailError)
        }
      } catch (error) {
        console.error('Error loading movies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-screen-xl mx-auto p-8">
          <h1 className="text-2xl mb-8 text-gray-800">Loading...</h1>
        </div>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <div className="max-w-screen-xl mx-auto p-8">
        <h1 className="text-2xl mb-8 text-gray-800">Luma.ai 3Dモデルリスト</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="w-full h-52 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {thumbnails[movie.id] ? (
                  <Image
                    src={thumbnails[movie.id]}
                    alt={movie.title || `Movie ${movie.id}`}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                  />
                ) : (
                  <span className="text-sm text-gray-600">{movie.title || `Movie ${movie.id}`}</span>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  3D
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {movie.title || `Movie ${movie.id}`}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{movie.note || ''}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/luma/${movie.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition"
                  >
                    3Dモデルを見る
                  </Link>

                  <a
                    href={movie.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition"
                  >
                    Luma.aiで見る
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutWithFooter>
  )
}

export default LumaList
