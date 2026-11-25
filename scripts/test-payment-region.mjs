import assert from 'node:assert/strict';
import test from 'node:test';
import { detectPaymentRegion } from '../src/lib/payments/region.ts';
import { isPaymentTier, PAYMENT_TIERS } from '../src/lib/payments/catalog.ts';
import { parseAmountInMinorUnits, secureHttpsUrl } from '../src/lib/payments/shared.ts';

test('geography is independent of language and only uses the selected edge', () => {
  const headers = new Headers({
    'x-vercel-ip-country': 'CN', 'cf-ipcountry': 'US', 'accept-language': 'en'
  });
  assert.equal(detectPaymentRegion(headers, { vercel: '1' }), 'domestic');
  assert.equal(detectPaymentRegion(headers, { vercel: '1', geoSource: 'cloudflare' }), 'overseas');
  assert.equal(detectPaymentRegion(headers, {}), null);
  assert.equal(detectPaymentRegion(headers, { geoSource: 'self-hosted' }), null);
  assert.equal(detectPaymentRegion(new Headers({ 'accept-language': 'zh-CN' }), { vercel: '1' }), null);
});

test('mainland China alone uses CNY; unknown edge locations require a choice', () => {
  for (const country of ['hk', 'MO', 'TW', 'US']) {
    assert.equal(detectPaymentRegion(new Headers({ 'cf-ipcountry': country }), { geoSource: 'cloudflare' }), 'overseas');
  }
  for (const country of ['XX', 'T1', 'cn, us', '', 'CN1', 'ZZ']) {
    assert.equal(detectPaymentRegion(new Headers({ 'cf-ipcountry': country }), { geoSource: 'cloudflare' }), null);
  }
  assert.equal(detectPaymentRegion(new Headers({ 'cf-ipcountry': 'cn' }), { geoSource: 'cloudflare' }), 'domestic');
});

test('exact decimal amounts, known checkout tiers, HTTPS checkout addresses', () => {
  assert.equal(parseAmountInMinorUnits('29.90'), PAYMENT_TIERS[100].cny);
  assert.equal(parseAmountInMinorUnits(29.9), PAYMENT_TIERS[100].cny);
  for (const value of ['29.900', '2.99e1', '29.9x', '-29.90', {}, null]) assert.equal(parseAmountInMinorUnits(value), null);
  for (const value of ['100', 100.1, [], 'constructor', null]) assert.equal(isPaymentTier(value), false);
  assert.equal(isPaymentTier(100), true);
  assert.equal(secureHttpsUrl('https://example.test/checkout'), 'https://example.test/checkout');
  assert.equal(secureHttpsUrl('https://other.test@example.test/checkout'), null);
  assert.equal(secureHttpsUrl('javascript:alert(1)'), null);
});
