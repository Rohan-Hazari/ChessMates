/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "uploadthing.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "utfs.io",
      },
    ],
  },
};
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;
