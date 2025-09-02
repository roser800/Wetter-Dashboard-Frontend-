// next.config.js
// WICHTIG: Repo-Name exakt setzen (inkl. Bindestrich am Ende)
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Wetter-Dashboard-Frontend-'; // <- ggf. anpassen, falls dein Repo anders heißt

module.exports = {
  output: 'export',                       // statischer Export (Ordner "out")
  basePath: isProd ? `/${repo}` : '',     // notwendig für GitHub Pages unter /<repo>
  assetPrefix: isProd ? `/${repo}/` : '', // korrekte Pfade für JS/CSS/Assets
  // images: { unoptimized: true },       // nur nötig, wenn du next/image benutzt
};
