/**
 * Automated SEO & Metadata Verification Script
 * Scans src/app/[lang] pages, sitemap.ts, robots.ts, manifest.ts, and opengraph-image.tsx
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const langAppDir = path.join(root, 'src', 'app', '[lang]');

const requiredInfra = [
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/manifest.ts',
  'src/app/opengraph-image.tsx',
  'src/lib/seo/metadata.ts',
  'src/components/seo/JsonLd.tsx'
];

let failures = 0;

console.log('==========================================');
console.log('   YiTatro Automated SEO Health Check     ');
console.log('==========================================\n');

for (const rel of requiredInfra) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`✗ Missing SEO infrastructure file: ${rel}`);
    failures++;
  } else {
    console.log(`✓ Found ${rel}`);
  }
}

const pageFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === 'page.tsx') {
      pageFiles.push(full);
    }
  }
}
walk(langAppDir);

const missingMeta = [];
for (const file of pageFiles) {
  const rel = path.relative(langAppDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const hasMeta =
    content.includes('generateMetadata') || content.includes('export const metadata');
  if (!hasMeta) {
    missingMeta.push(rel);
  }
}

console.log(`\n✓ Scanned ${pageFiles.length} localized route pages under src/app/[lang]/`);
if (missingMeta.length > 0) {
  console.warn(`! Pages without explicit generateMetadata (${missingMeta.length}):`);
  for (const m of missingMeta) {
    console.warn(`  - ${m}`);
  }
}

if (failures > 0) {
  console.error(`\n[FAIL] ${failures} SEO infrastructure checks failed.`);
  process.exit(1);
}

console.log('\n[OK] All core SEO infrastructure & route verifications passed!');
