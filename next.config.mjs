/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: false,
  },
  images: {
    remotePatterns: [
      // ローカル開発用
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // バックエンドAPI（本番環境）
      {
        protocol: 'https',
        hostname: '3dcp-api.fly.dev',
      },
      // バックエンドAPI（開発環境）
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      // Luma AI CDN（サムネイル画像）
      {
        protocol: 'https',
        hostname: 'cdn-luma.com',
      },
    ],
  },
}

export default nextConfig
