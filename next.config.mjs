/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        hostname: "t3.ftcdn.net",
        hostname: "static.vecteezy.com",
        hostname: "google.com",
        hostname: "generalecommerce.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
