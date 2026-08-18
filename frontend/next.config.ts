import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite exportar el servidor standalone (usado por el Dockerfile de Cloud Run)
  output: "standalone",

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

  // Redirecciones para el backend (evita problemas de CORS).
  // En producción apunta al backend de Cloud Run vía BACKEND_URL.
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;