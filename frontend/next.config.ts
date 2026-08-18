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

  // NOTA: el proxy a /api/* se maneja en src/app/api/[...path]/route.ts
  // (route handler), porque los rewrites no permiten inyectar headers.
  // Ese proxy agrega X-API-Key server-side para proteger el backend.
};

export default nextConfig;