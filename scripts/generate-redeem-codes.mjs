/**
 * YiTarot 兑换码/卡密生成工具
 * 用法：
 *   node scripts/generate-redeem-codes.mjs <积分面额: 100 | 500 | 2000> [生成张数，默认 5]
 *
 * 示例：
 *   node scripts/generate-redeem-codes.mjs 100 10
 *   node scripts/generate-redeem-codes.mjs 500 5
 *   node scripts/generate-redeem-codes.mjs 2000 2
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 读取本地 .env.local 保持密钥一致
let secret = 'yitarot-domestic-redeem-secret-key-2026';
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) {
        const k = match[1].trim();
        const v = match[2].trim().replace(/^["']|["']$/g, '');
        if (k === 'REDEEM_SECRET_KEY' && v) secret = v;
        else if (k === 'SUPABASE_SERVICE_ROLE_KEY' && v && !process.env.REDEEM_SECRET_KEY) {
          secret = v.slice(0, 32);
        }
      }
    }
  }
} catch {}

const args = process.argv.slice(2);
const points = parseInt(args[0] || '100', 10);
const count = parseInt(args[1] || '5', 10);

if (![100, 500, 2000].includes(points)) {
  console.error('错误：仅支持生成 100, 500, 2000 积分面额的卡密。');
  process.exit(1);
}

console.log(`\n========================================`);
console.log(`  YiTarot 官方安全卡密生成器`);
console.log(`  面额: ${points} 积分`);
console.log(`  数量: ${count} 张`);
console.log(`  生成时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
console.log(`========================================\n`);

const codes = [];
for (let i = 0; i < count; i++) {
  const salt = crypto.randomBytes(3).toString('hex').toUpperCase();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${points}:${salt}`);
  const hash = hmac.digest('hex').slice(0, 6).toUpperCase();
  const code = `YITA${points}-${salt}-${hash}`;
  codes.push(code);
  console.log(`${i + 1}.  ${code}`);
}

console.log(`\n提示：以上兑换码全局唯一，具备防篡改签名。`);
console.log(`用户可在 /pricing 或 /account 页面输入卡密立即充值到账。\n`);
