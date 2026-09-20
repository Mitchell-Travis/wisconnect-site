const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGitHubPages ? '/wisconnect-site' : '';

module.exports = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};
