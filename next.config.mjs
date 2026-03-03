/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["framer-motion", "motion", "motion-dom", "motion-utils"],
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
