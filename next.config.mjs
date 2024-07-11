/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdpccjmmscweuqgcgbks.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
