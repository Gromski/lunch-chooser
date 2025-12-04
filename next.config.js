/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Environment variables exposed to client
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig



