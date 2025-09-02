// frontend/next.config.js
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Wetter-Dashboard-Frontend-'; 

module.exports = {
  output: 'export',                 // generiert statische Dateien im Ordner "out"
  basePath: isProd ? `/${repo}` : '',    // wichtig für GitHub Pages unter /<repo>
  assetPrefix: isProd ? `/${repo}/` : '', // sorgt für korrekte Asset-URLs
  // images: { unoptimized: true }, // nur nötig, falls du next/image verwendest
};
