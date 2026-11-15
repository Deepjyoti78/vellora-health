/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/facilities',
        destination: '/services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
