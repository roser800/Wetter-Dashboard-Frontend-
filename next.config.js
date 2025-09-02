// next.config.js
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Wetter-Dashboard-Frontend-'; // exakt wie dein Repo heißt (inkl. letztem Bindestrich!)

module.exports = {
  output: 'export',                      // erzeugt statische Seite in "out/"
  basePath: isProd ? `/${repo}` : '',    // wichtig für Pages unter /<repo>
  assetPrefix: isProd ? `/${repo}/` : '',// korrigiert URLs für CSS/JS
  // images: { unoptimized: true },       // nur falls du next/image nutzt
};
