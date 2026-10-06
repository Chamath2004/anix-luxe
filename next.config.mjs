/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/anix-luxe",
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }]
  }
};
export default nextConfig;
