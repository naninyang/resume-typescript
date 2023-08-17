/** @type {import('next').NextConfig} */
const Dotenv = require('dotenv-webpack')
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false,
  },
  webpack: config => {
    config.plugins.push(new Dotenv({ silent: true }));
    config.resolve.fallback = { fs: false };
    return config;
  },
}

module.exports = nextConfig
