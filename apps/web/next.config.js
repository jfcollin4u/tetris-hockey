/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tetris-hockey/shared'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
