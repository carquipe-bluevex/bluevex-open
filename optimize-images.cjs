#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG/JPEG to WebP and AVIF formats
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assetsDir = path.join(__dirname, "src/assets");
const outputDir = path.join(__dirname, "src/assets");

// Critical images to optimize (highest priority)
const criticalImages = [
  "illustrations/blue_angels.png", // 2.5MB
  "hero/services.png", // 1.1MB
  "illustrations/support_tower_control.png", // 779KB
  "hero/planes.png", // Hero image
  "hero/clouds.png", // Hero decoration
  "illustrations/team.png", // 779KB
];

// All PNG/JPEG files (including duplicates we'll handle)
const allImages = [
  // Critical
  "illustrations/blue_angels.png",
  "hero/services.png",
  "illustrations/support_tower_control.png",
  "hero/planes.png",
  "hero/clouds.png",
  "illustrations/team.png",

  // Secondary (we'll keep PNGs but create WebP)
  "illustrations/projects_plane_construction.png",
  "illustrations/cto.png",
  "illustrations/license.png",
  "illustrations/footer.png",
];

// Logos (small, skip optimization)
const logoImages = [
  "business_isotype.png",
  "business_isotype_monochrome.png",
  "business_logo_negative.png",
  "business_logo_horizontal.png",
  "business_logo_vertical.png",
  "business_logo_horizontal_negative.png",
];

const logSizes = (original, webp, avif) => {
  const origSize = (original / 1024).toFixed(1);
  const webpSize = webp ? (webp / 1024).toFixed(1) : "N/A";
  const avifSize = avif ? (avif / 1024).toFixed(1) : "N/A";
  const webpReduction = webp
    ? (((original - webp) / original) * 100).toFixed(0)
    : "N/A";
  const avifReduction = avif
    ? (((original - avif) / original) * 100).toFixed(0)
    : "N/A";

  return `Original: ${origSize}KB | WebP: ${webpSize}KB (-${webpReduction}%) | AVIF: ${avifSize}KB (-${avifReduction}%)`;
};

async function optimizeImage(inputPath, baseOutputPath) {
  try {
    const fullInputPath = path.join(assetsDir, inputPath);
    const stats = fs.statSync(fullInputPath);
    const originalSize = stats.size;

    // Skip if file doesn't exist
    if (!fs.existsSync(fullInputPath)) {
      console.log(`❌ Archivo no encontrado: ${inputPath}`);
      return null;
    }

    // Skip small files (logos under 50KB)
    if (originalSize < 50000) {
      console.log(
        `⏭️  Saltando (pequeño): ${inputPath} (${(originalSize / 1024).toFixed(1)}KB)`,
      );
      return null;
    }

    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    const dirname = path.dirname(inputPath);

    console.log(`\n🔄 Optimizando: ${inputPath}`);

    // Create WebP
    const webpPath = path.join(outputDir, dirname, `${basename}.webp`);
    const webpBuffer = await sharp(fullInputPath)
      .webp({ quality: 80 })
      .toBuffer();
    fs.mkdirSync(path.dirname(webpPath), { recursive: true });
    fs.writeFileSync(webpPath, webpBuffer);

    // Create AVIF
    const avifPath = path.join(outputDir, dirname, `${basename}.avif`);
    const avifBuffer = await sharp(fullInputPath)
      .avif({ quality: 75 })
      .toBuffer();
    fs.writeFileSync(avifPath, avifBuffer);

    console.log(
      `   ${logSizes(originalSize, webpBuffer.length, avifBuffer.length)}`,
    );
    console.log(`   ✅ WebP: ${basename}.webp`);
    console.log(`   ✅ AVIF: ${basename}.avif`);

    return {
      original: inputPath,
      webp: path.join(dirname, `${basename}.webp`),
      avif: path.join(dirname, `${basename}.avif`),
      originalSize,
      webpSize: webpBuffer.length,
      avifSize: avifBuffer.length,
    };
  } catch (error) {
    console.error(`❌ Error al optimizar ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Iniciando optimización de imágenes...\n");

  const results = [];

  // Optimize critical images first
  console.log("📦 IMÁGENES CRÍTICAS (Alto impacto):");
  console.log("═".repeat(60));

  for (const img of criticalImages) {
    const result = await optimizeImage(img);
    if (result) results.push(result);
  }

  // Optimize other images
  console.log("\n\n📦 IMÁGENES SECUNDARIAS:");
  console.log("═".repeat(60));

  for (const img of allImages) {
    if (!criticalImages.includes(img)) {
      const result = await optimizeImage(img);
      if (result) results.push(result);
    }
  }

  // Summary
  console.log("\n\n📊 RESUMEN DE OPTIMIZACIÓN:");
  console.log("═".repeat(60));

  let totalOriginal = 0;
  let totalWebP = 0;
  let totalAVIF = 0;

  results.forEach((r) => {
    totalOriginal += r.originalSize;
    totalWebP += r.webpSize;
    totalAVIF += r.avifSize;
  });

  const webpReduction = ((totalOriginal - totalWebP) / totalOriginal) * 100;
  const avifReduction = ((totalOriginal - totalAVIF) / totalOriginal) * 100;

  console.log(`\nArchivos optimizados: ${results.length}`);
  console.log(`Original:  ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `WebP:      ${(totalWebP / 1024 / 1024).toFixed(2)}MB (-${webpReduction.toFixed(0)}%)`,
  );
  console.log(
    `AVIF:      ${(totalAVIF / 1024 / 1024).toFixed(2)}MB (-${avifReduction.toFixed(0)}%)`,
  );

  console.log("\n✅ Optimización completada.");
  console.log("\n📝 PRÓXIMOS PASOS:");
  console.log("   1. Revisar imágenes generadas en src/assets/");
  console.log("   2. Actualizar imports en componentes");
  console.log("   3. Remover archivos .jpeg duplicados manualmente");
  console.log("   4. Ejecutar: npm run build");
  console.log("   5. Verificar que no haya cambios visuales\n");

  // Generate component template
  console.log("📄 PLANTILLA PARA ACTUALIZAR COMPONENTES:\n");
  results.forEach((r) => {
    const name = path.basename(r.original, path.extname(r.original));
    const dir = path.dirname(r.original);
    console.log(`<!-- ${r.original} -->`);
    console.log(`<picture>`);
    console.log(`  <source srcset="/assets/${r.avif}" type="image/avif">`);
    console.log(`  <source srcset="/assets/${r.webp}" type="image/webp">`);
    console.log(`  <img src="/assets/${r.original}" alt="" loading="lazy" />`);
    console.log(`</picture>\n`);
  });
}

main().catch(console.error);
