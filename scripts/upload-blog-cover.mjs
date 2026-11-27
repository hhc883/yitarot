import fs from 'node:fs';
import path from 'node:path';

/**
 * Load key=value pairs from .env.local when not already set in process.env.
 */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key] && val) {
      process.env[key] = val;
    }
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'image/png';
}

async function ensurePublicBucket(supabaseUrl, serviceKey, bucket) {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: bucket, name: bucket, public: true })
  });
  // 200/201 created, 409 already exists
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    if (!text.toLowerCase().includes('already exists')) {
      throw new Error(`Failed to ensure bucket "${bucket}" (${res.status}): ${text}`);
    }
  }
}

async function main() {
  loadEnvLocal();

  const [localFile, remoteName] = process.argv.slice(2);
  if (!localFile || !remoteName) {
    console.error('Usage: node scripts/upload-blog-cover.mjs <local-file> <remote-filename>');
    process.exit(1);
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment or .env.local');
    process.exit(1);
  }

  const absFile = path.resolve(localFile);
  if (!fs.existsSync(absFile)) {
    console.error(`File not found: ${absFile}`);
    process.exit(1);
  }

  const bucket = 'blog-covers';
  await ensurePublicBucket(supabaseUrl, serviceKey, bucket);

  const fileBuffer = fs.readFileSync(absFile);
  const contentType = getContentType(absFile);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${encodeURIComponent(remoteName)}`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: fileBuffer
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${remoteName}`;
  console.log(publicUrl);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
