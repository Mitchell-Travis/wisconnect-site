const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

module.exports = {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/wisconnect-site' : '',
  assetPrefix: isGitHubPages ? '/wisconnect-site/' : '',
  images: { unoptimized: true },
};
