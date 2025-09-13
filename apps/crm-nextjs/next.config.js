/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove experimental appDir for Next.js 14
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig
