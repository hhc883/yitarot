import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: '/:lang/calculator/bazi',
        destination: '/:lang/fatemaster/bazi',
        permanent: true,
      },
      {
        source: '/:lang/calculator/iching',
        destination: '/:lang/fatemaster/liuyao',
        permanent: true,
      },
      {
        source: '/:lang/calculator',
        destination: '/:lang/fatemaster',
        permanent: true,
      },
      {
        source: '/:lang/compatibility/:slug*',
        destination: '/:lang/fatemaster/compatibility',
        permanent: true,
      },
      {
        source: '/:lang/compatibility',
        destination: '/:lang/fatemaster/compatibility',
        permanent: true,
      },
      {
        source: '/:lang/knowledge',
        destination: '/:lang/fatemaster',
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
