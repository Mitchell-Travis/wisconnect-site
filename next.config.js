const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';
const basePath = isGitHubPages ? '/wisconnect-site' : '';

module.exports = {
  ...(!isDevelopment && { output: 'export' }),
  devIndicators: false, // Keep the local Next.js badge clear of mobile navigation.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  ...(
    isDevelopment
      ? {
          async rewrites() {
            return [
              { source: '/auth/:path*/', destination: 'http://127.0.0.1:8001/auth/:path*' },
              { source: '/_local_api/:path*/', destination: 'http://127.0.0.1:8001/:path*' },
            ];
          },
        }
      : {}
  ),
};
