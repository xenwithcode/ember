import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir imágenes externas (Unsplash para las actividades)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // Redirecciones para el backend (evita problemas de CORS en dev)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;