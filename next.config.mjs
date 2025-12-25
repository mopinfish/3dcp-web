/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default nextConfig
