/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.STATIC_EXPORT === 'true',
  },
  // Uncomment the following line to enable static exports
  // output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
};

module.exports = nextConfig
