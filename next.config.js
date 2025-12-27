/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['shiki'],
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },
};

module.exports = nextConfig;
