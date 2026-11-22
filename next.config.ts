import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: '/:lang/fatemaster/:path*',
        destination: '/:lang/east/:path*',
        permanent: true,
      },
      {
        source: '/:lang/fatemaster',
        destination: '/:lang/east',
        permanent: true,
      },
      {
        source: '/api/fatemaster/:path*',
        destination: '/api/east/:path*',
        permanent: true,
      },
      {
        source: '/:lang/calculator/bazi',
        destination: '/:lang/east/bazi',
        permanent: true,
      },
      {
        source: '/:lang/calculator/iching',
        destination: '/:lang/east/liuyao',
        permanent: true,
      },
      {
        source: '/:lang/calculator',
        destination: '/:lang/east',
        permanent: true,
      },
      {
        source: '/:lang/compatibility/:slug*',
        destination: '/:lang/east/compatibility',
        permanent: true,
      },
      {
        source: '/:lang/compatibility',
        destination: '/:lang/east/compatibility',
        permanent: true,
      },
      {
        source: '/:lang/knowledge',
        destination: '/:lang/east',
        permanent: true,
      },
      {
        source: '/:lang/about',
        destination: '/:lang',
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
