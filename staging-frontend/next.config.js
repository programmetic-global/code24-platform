/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://staging.code24.dev' : '',
  env: {
    ELITE_WORKERS_API: process.env.NODE_ENV === 'production' 
      ? 'https://staging.code24.dev/elite' 
      : 'http://localhost:3000/elite'
  }
}

module.exports = nextConfig