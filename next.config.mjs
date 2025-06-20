/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: false,
  },
  images: {
    domains: ['localhost'],
  },
  eslint: {
    // ✅ Flat Config を使うならオプションごと削除 or minimal に
    dirs: ['src'], // 対象ディレクトリだけ指定（必要なら）
  },
}

export default nextConfig
