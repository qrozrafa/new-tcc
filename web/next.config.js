/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
  images: {
    domains: ['localhost'],
    minimumCacheTTL: 0,
    unoptimized: true,
  },
}