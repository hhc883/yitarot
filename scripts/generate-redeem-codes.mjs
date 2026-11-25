import crypto from 'node:crypto';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env.local')) loadEnvFile('.env.local');

const secret = process.env.REDEEM_SECRET_KEY?.trim();
if (!secret || secret.length < 32 || secret === 'yitarot-domestic-redeem-secret-key-2026') {
  console.error('请配置与生产站一致的独立 REDEEM_SECRET_KEY（至少 32 字符）。');
  process.exit(1);
}

const [tier = '100', quantity = '5'] = process.argv.slice(2);
const count = Number(quantity);
if (!['100', '500', '2000'].includes(tier) || !Number.isInteger(count) || count < 1 || count > 1000) {
  console.error('用法：node scripts/generate-redeem-codes.mjs <100|500|2000> [1–1000]');
  process.exit(1);
}

const codes = new Set();
while (codes.size < count) {
  // v2: 128 bits of randomness and 128-bit authentication tag.
  const salt = crypto.randomBytes(16).toString('hex').toUpperCase();
  const hash = crypto.createHmac('sha256', secret).update('v2:' + tier + ':' + salt)
    .digest('hex').slice(0, 32).toUpperCase();
  codes.add('YITA2-' + tier + '-' + salt + '-' + hash);
}
for (const code of codes) console.log(code);
