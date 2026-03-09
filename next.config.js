const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['shiki'],
  outputFileTracingRoot: path.resolve(__dirname)
};

module.exports = nextConfig;
