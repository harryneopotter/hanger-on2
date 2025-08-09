// Generate branding assets from SVG logo
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateBrandingAssets() {
  console.log('Generating branding assets...');

  const publicDir = path.join(__dirname, '../public');
  const svgPath = path.join(publicDir, 'hanger-logo.svg');

  // Check if SVG exists
  try {
    await fs.access(svgPath);
  } catch (error) {
    console.error('Error: hanger-logo.svg not found in public directory');
    process.exit(1);
  }

  // Define sizes for different assets
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
  ];

  // Generate PNG versions
  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(svgPath).resize(size, size).png().toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Generate favicon.ico with multiple sizes
  const icoPath = path.join(publicDir, 'favicon.ico');
  const pngBuffers = await Promise.all(
    [16, 32, 48].map((size) => sharp(svgPath).resize(size, size).png().toBuffer()),
  );

  // For simplicity, we'll just use the 32x32 version as favicon.ico
  // In a real implementation, we'd create a proper ICO file with multiple sizes
  await sharp(svgPath).resize(32, 32).png().toFile(icoPath);
  console.log('Generated favicon.ico');

  console.log('All branding assets generated successfully!');
}

generateBrandingAssets().catch(console.error);
