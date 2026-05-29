const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['shiki'],
  outputFileTracingRoot: path.resolve(__dirname)
};

module.exports = nextConfig;
