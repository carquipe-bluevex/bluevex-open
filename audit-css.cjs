#!/usr/bin/env node

/**
 * CSS Audit Script
 * Encuentra clases definidas que no se usan en el HTML
 */

const fs = require("fs");
const path = require("path");

// Leer todos los archivos .astro
const astroDir = path.join(__dirname, "src");
let htmlContent = "";

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (
      file.endsWith(".astro") ||
      file.endsWith(".ts") ||
      file.endsWith(".tsx")
    ) {
      const content = fs.readFileSync(fullPath, "utf-8");
      htmlContent += content + "\n";
    }
  });
}

console.log("📋 Auditando CSS sin usar...\n");
console.log("════════════════════════════════════════════════════════\n");

walkDir(astroDir);

// Clases para buscar
const classesToCheck = [
  // De index.astro
  { name: "service-panel", type: "❌ Dead code" },
  { name: "service-panel__icon", type: "❌ Dead code" },
  { name: "service-panel__lines", type: "❌ Dead code" },
  { name: "service-panel__accent", type: "❌ Dead code" },

  // De global.css
  { name: "grid-3", type: "⚠️  Unused utility" },
  { name: "grid-4", type: "⚠️  Unused utility" },

  // Validar que se usan
  { name: "grid-2", type: "✅ Used" },
  { name: "container", type: "✅ Used" },
];

console.log("🔍 CLASES ENCONTRADAS:\n");

let deadCodeFound = 0;
let unusedUtilities = 0;

classesToCheck.forEach(({ name, type }) => {
  const regex = new RegExp(`\\b${name}\\b`, "g");
  const matches = htmlContent.match(regex);

  if (matches) {
    console.log(`✅ ${name.padEnd(25)} — ${type} (${matches.length} usos)`);
  } else {
    console.log(`❌ ${name.padEnd(25)} — SIN USAR`);
    if (type.includes("Dead")) deadCodeFound++;
    if (type.includes("Unused")) unusedUtilities++;
  }
});

console.log("\n════════════════════════════════════════════════════════\n");
console.log(`📊 RESUMEN:\n`);
console.log(`   Dead code classes:    ${deadCodeFound}`);
console.log(`   Unused utilities:     ${unusedUtilities}`);
console.log(`   Total CSS to remove:  ${deadCodeFound + unusedUtilities}`);

console.log("\n📝 CLASES QUE SE PUEDEN REMOVER:\n");

if (deadCodeFound > 0) {
  console.log("   🔴 De src/pages/index.astro (líneas 376-416):");
  console.log("      • .service-panel");
  console.log("      • .service-panel__icon");
  console.log("      • .service-panel__lines");
  console.log("      • .service-panel__lines span (y variantes)");
  console.log("      • .service-panel__accent (si existe)");
}

if (unusedUtilities > 0) {
  console.log("\n   🟡 De src/styles/global.css (líneas 137-147):");
  console.log("      • .grid-3 (líneas 137-141)");
  console.log("      • .grid-4 (líneas 143-147)");
}

console.log("\n📐 ESTIMADO DE AHORRO:\n");
console.log("   .service-panel* (43 líneas):  ~1.2 KB");
console.log("   .grid-3 + .grid-4 (11 líneas): ~0.3 KB");
console.log("   ────────────────────────────────────");
console.log("   Total estimado:                ~1.5 KB");

console.log("\n   Con minificación y gzip: ~0.4 KB\n");

console.log("🎯 SIGUIENTES PASOS:\n");
console.log("   1. Remover .service-panel* de index.astro");
console.log("   2. Remover .grid-3 y .grid-4 de global.css");
console.log("   3. Ejecutar: npm run build");
console.log("   4. Verificar visualmente que todo funciona");
console.log("   5. Medir tamaño final de CSS\n");
