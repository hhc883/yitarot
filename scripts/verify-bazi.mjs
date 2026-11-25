/**
 * Standalone BaZi & Daily-BaZi Regression Verification Script
 * Runs via `node scripts/verify-bazi.mjs` using the repo's installed `typescript` + `lunar-typescript`.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { Solar, LunarUtil } = require("lunar-typescript");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadTsModule(relPath, localOverrides = {}) {
  const fullPath = path.join(rootDir, relPath);
  const source = fs.readFileSync(fullPath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: fullPath,
  });

  const mod = { exports: {} };
  const customRequire = (specifier) => {
    if (localOverrides[specifier]) {
      return localOverrides[specifier];
    }
    return require(specifier);
  };

  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, customRequire, mod);
  return mod.exports;
}

const bazi = loadTsModule("src/lib/metaphysics/bazi.ts");
const dailyBazi = loadTsModule("src/lib/metaphysics/daily-bazi.ts", {
  "./bazi": bazi,
});

console.log("=== YiTatro BaZi & Daily-BaZi Regression Suite ===");

// 1. Four Pillars, HideGan, ShiShen, Day Master, Minute Param, Surface 8-char Distribution
{
  const solar = Solar.fromYmdHms(1996, 8, 18, 12, 35, 0);
  const ec = solar.getLunar().getEightChar();

  const res = bazi.calculateBaZi(1996, 8, 18, 12, 35);
  assert.equal(res.birthSolar.minute, 35, "calculateBaZi 5th parameter minute must be preserved");
  assert.equal(res.yun, null, "calculateBaZi without gender must not guess DaYun");

  assert.equal(res.pillars.year.gan + res.pillars.year.zhi, ec.getYear());
  assert.equal(res.pillars.month.gan + res.pillars.month.zhi, ec.getMonth());
  assert.equal(res.pillars.day.gan + res.pillars.day.zhi, ec.getDay());
  assert.equal(res.pillars.hour.gan + res.pillars.hour.zhi, ec.getTime());

  assert.equal(res.pillars.day.ganShiShenZh, "日主");
  assert.equal(res.pillars.day.ganShiShenEn, "Day Master");
  assert.equal(res.pillars.year.ganShiShenZh, ec.getYearShiShenGan());
  assert.equal(res.pillars.month.ganShiShenZh, ec.getMonthShiShenGan());
  assert.equal(res.pillars.hour.ganShiShenZh, ec.getTimeShiShenGan());

  assert.deepEqual(res.pillars.year.hideGan, ec.getYearHideGan());
  assert.deepEqual(res.pillars.month.hideGan, ec.getMonthHideGan());
  assert.deepEqual(res.pillars.day.hideGan, ec.getDayHideGan());
  assert.deepEqual(res.pillars.hour.hideGan, ec.getTimeHideGan());

  assert.deepEqual(res.pillars.year.hideGanShiShenZh, ec.getYearShiShenZhi());
  assert.deepEqual(res.pillars.month.hideGanShiShenZh, ec.getMonthShiShenZhi());
  assert.deepEqual(res.pillars.day.hideGanShiShenZh, ec.getDayShiShenZhi());
  assert.deepEqual(res.pillars.hour.hideGanShiShenZh, ec.getTimeShiShenZhi());

  const totalSurfaceCount = res.fiveElements.reduce((sum, item) => sum + item.count, 0);
  assert.equal(totalSurfaceCount, 8, "Surface Five Elements must sum to 8 characters");
  assert.ok(
    typeof res.surfaceElementsNoteZh === "string" && res.surfaceElementsNoteZh.trim().length > 0 &&
    typeof res.surfaceElementsNoteEn === "string" && res.surfaceElementsNoteEn.trim().length > 0 &&
    typeof res.elementRecommendationsZh === "string" && res.elementRecommendationsZh.trim().length > 0 &&
    typeof res.elementRecommendationsEn === "string" && res.elementRecommendationsEn.trim().length > 0 &&
    !/(?:属于|为|即|定)喜用|缺什么补什么/.test(res.elementRecommendationsZh) &&
    !/counts (?:can|do) determine.*Yong\s*Shen/i.test(res.elementRecommendationsEn),
    "Surface Five Elements notes and recommendations must be non-empty without claiming YongShen from surface counts"
  );
  assert.ok(res.dominantElement, "Legacy dominantElement field preserved");
  assert.ok("lackingElement" in res, "Legacy lackingElement field preserved");

  assert.throws(
    () => bazi.calculateBaZi(2025, 2, 30, 12, 0),
    /Non-existent solar calendar date/,
    "Invalid date must throw rather than guess"
  );
  assert.throws(
    () => bazi.calculateBaZi(1996, 8, 18, Number.NaN, 0),
    /valid integers/,
    "Missing/NaN hour must throw rather than guess"
  );
  console.log("✓ [1] Four Pillars, HideGan/ShiShen, 5th minute param, surface-8 notes & validation passed");
}

// 2. DaYun via EightChar.getYun(gender, sect)
{
  const maleRes = bazi.calculateBaZi(1996, 8, 18, 12, 35, { gender: "male", yunSect: 1 });
  const femaleYun = bazi.calculateBaZiYun(1996, 8, 18, 12, 35, "female", 2);

  assert.ok(maleRes.yun, "DaYun should be populated when gender is provided");
  assert.equal(maleRes.yun.forward, true, "1996 (Yang year) male should be forward");
  assert.equal(femaleYun.forward, false, "1996 (Yang year) female should be backward");
  assert.equal(maleRes.yun.steps.length, 10);
  assert.equal(femaleYun.steps.length, 10);

  const libYun = Solar.fromYmdHms(1996, 8, 18, 12, 35, 0)
    .getLunar()
    .getEightChar()
    .getYun(1, 1);
  const libDaYun = libYun.getDaYun(11);
  assert.equal(maleRes.yun.startYearOffset, libYun.getStartYear());
  assert.equal(maleRes.yun.startMonthOffset, libYun.getStartMonth());
  assert.equal(maleRes.yun.startDayOffset, libYun.getStartDay());
  assert.equal(maleRes.yun.startSolarYmd, libYun.getStartSolar().toYmd());
  assert.equal(maleRes.yun.steps[0].ganZhi, libDaYun[1].getGanZhi());
  assert.equal(maleRes.yun.steps[0].startAge, libDaYun[1].getStartAge());
  assert.equal(maleRes.yun.steps[0].endAge, libDaYun[1].getEndAge());
  assert.ok(maleRes.yun.ageCaliberZh.includes("虚岁"), "Age caliber must be labeled");

  console.log("✓ [2] DaYun (sect=1 & sect=2, forward/backward, ages & caliber) matched lunar-typescript");
}

// 3. Daily BaZi: 12 periods stemName, Ten Gods vs Day Master, and 23:00 Zi-hour boundary
{
  const daytime = new Date(2026, 10, 25, 14, 15, 0); // 2026-11-25 14:15
  const before23 = new Date(2026, 10, 25, 22, 59, 0); // 2026-11-25 22:59
  const after23 = new Date(2026, 10, 25, 23, 30, 0); // 2026-11-25 23:30
  const nextEarly = new Date(2026, 10, 26, 0, 30, 0); // 2026-11-26 00:30

  const dayReading = dailyBazi.calculateDailyBaziFortune(1996, 8, 18, 12, daytime);
  const pre23Reading = dailyBazi.calculateDailyBaziFortune(1996, 8, 18, 12, before23);
  const post23Reading = dailyBazi.calculateDailyBaziFortune(1996, 8, 18, 12, after23);
  const nextReading = dailyBazi.calculateDailyBaziFortune(1996, 8, 18, 12, nextEarly);

  assert.equal(dayReading.hourlyTimeline.length, 12);
  const dmStem = dayReading.userDayMaster.stem;

  for (const period of dayReading.hourlyTimeline) {
    assert.ok(period.stemName.length === 1, `stemName must not be blank (got '${period.stemName}')`);
    const ec = Solar.fromYmdHms(2026, 11, 25, period.sampleHour, 0, 0)
      .getLunar()
      .getEightChar();
    assert.equal(period.stemName, ec.getTimeGan());
    assert.equal(period.ganZhi, ec.getTime());
    assert.equal(period.tenGodZh, LunarUtil.SHI_SHEN[dmStem + period.stemName]);
  }

  // Verify 23:00 boundary behavior (sect=2: day pillar stays on 2026-11-25, hour pillar switches to 2026-11-26's Zi stem)
  assert.equal(pre23Reading.isLateZiHour, false);
  assert.equal(post23Reading.isLateZiHour, true);
  assert.equal(post23Reading.queryDate.day, 25);
  assert.equal(post23Reading.todayGanZhi.day, dayReading.todayGanZhi.day);
  assert.equal(post23Reading.nextDayGanZhi, nextReading.todayGanZhi.day);
  assert.equal(post23Reading.currentTimeGanZhi, post23Reading.lateZiHour.ganZhi);
  assert.equal(
    post23Reading.lateZiHour.ganZhi,
    nextReading.hourlyTimeline[0].ganZhi,
    "23:00-23:59 Late Zi must match next day's 00:00-00:59 Early Zi pillar"
  );
  assert.notEqual(
    dayReading.hourlyTimeline[0].stemName,
    dayReading.lateZiHour.stemName,
    "Early Zi (00:00) and Late Zi (23:00) on the same calendar date must differ in stem"
  );

  // Also verify birth hour=23 in calculateBaZi follows sect=2
  const birth23 = bazi.calculateBaZi(1996, 8, 18, 23, 15);
  const birth00 = bazi.calculateBaZi(1996, 8, 18, 0, 15);
  assert.equal(birth23.pillars.day.gan + birth23.pillars.day.zhi, birth00.pillars.day.gan + birth00.pillars.day.zhi);
  assert.notEqual(birth23.pillars.hour.gan, birth00.pillars.hour.gan);

  assert.ok(dayReading.ziHourRuleZh.includes("23:00"));
  assert.ok(dayReading.methodologyNoteZh.includes("站内规则"));

  console.log("✓ [3] Daily BaZi 12-hour stems, Ten Gods, site-rule notes & 23:00 boundary passed");
}

console.log("\nAll BaZi & Daily-BaZi regressions passed!");
