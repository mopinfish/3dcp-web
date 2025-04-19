// CommonJSスタイルのインポート
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

// 環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') })

// APIホストを取得
const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

/**
 * HTTPリクエスト関数
 * @param {string} url
 * @param {string} method
 * @param {any} data
 * @returns {Promise<any>}
 */
async function request(url, method, data) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${url}`, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}

/**
 * GETリクエスト関数
 * @param {string} url
 * @returns {Promise<any>}
 */
async function get(url) {
  return request(url, 'GET')
}

/**
 * 映画リストを取得する関数
 * @returns {Promise<Array>}
 */
async function getMovies() {
  try {
    const url = `${HOST}/api/v1/movies`
    console.log(`Fetching movies from: ${url}`)
    const res = await get(url)
    return res.results || []
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}

/**
 * サンプルデータを生成する関数（APIが利用できない場合）
 * @returns {Array}
 */
function generateSampleData() {
  return [
    {
      id: 1,
      title: 'サンプル3Dモデル1',
      note: 'これはサンプルの3Dモデルです',
      url: 'https://lumalabs.ai/capture/ca05e3db-63ba-4272-943c-4b0627e19c4d',
    },
    {
      id: 2,
      title: 'サンプル3Dモデル2',
      note: 'これは別のサンプル3Dモデルです',
      url: 'https://lumalabs.ai/capture/e79f1d4d-2026-4c27-9cfe-98d429d9f927',
    },
    {
      id: 3,
      title: '東大寺大仏殿',
      note: '奈良時代に建立された東大寺の本堂',
      url: 'https://lumalabs.ai/capture/137d129a-4139-45d1-9cb2-5230ef4b19cf',
    },
  ]
}

/**
 * メイン関数
 */
async function main() {
  console.log('Generating Luma.ai movie list...')

  let movies = []

  // APIからデータを取得
  if (HOST) {
    movies = await getMovies()
  }

  // データが取得できなかった場合はサンプルデータを使用
  if (movies.length === 0) {
    console.log('No movies found or API not available. Using sample data instead.')
    movies = generateSampleData()
  }

  // 保存先のディレクトリを作成（存在しない場合）
  const dataDir = path.resolve(process.cwd(), 'public/data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // ファイルに保存
  const filePath = path.resolve(dataDir, 'luma-movies.json')
  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2))

  console.log(`Successfully generated movie list with ${movies.length} items.`)
  console.log(`Saved to: ${filePath}`)
}

// スクリプトを実行
main().catch((error) => {
  console.error('Error executing script:', error)
  process.exit(1)
})
