/** @type {import('next').NextConfig} */
const { withPayload } = require('@payloadcms/next/withPayload')

const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = withPayload(nextConfig)

