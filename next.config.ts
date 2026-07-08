import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // www → domínio principal (308 permanente) — evita conteúdo duplicado no Google
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.usemoema.com.br" }],
        destination: "https://usemoema.com.br/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
