/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.cdn.filesafe.space",
        pathname: "/1cnqPfm56RHZ8BgjIGp0/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
