import { Solar } from 'lunar-typescript';

export type AlmanacPurpose = 'moving' | 'opening' | 'contract';
export type AlmanacStatus = 'candidate' | 'conditional' | 'caution' | 'unlisted';
type AlmanacEvidence = '入宅' | '移徙' | '开市' | '立券' | '交易';

export type AlmanacDay = {
  date: string;
  status: AlmanacStatus;
  favorable: AlmanacEvidence[];
  unfavorable: AlmanacEvidence[];
  dayPillar: string;
  dayOfficer: string;
  conflictingZodiac: string;
};

export type AlmanacSearch =
  | { ok: true; days: AlmanacDay[] }
  | { ok: false; error: 'start' | 'end' | 'reversed' | 'span' };

const ACTIVITIES = {
  moving: ['入宅', '移徙'],
  opening: ['开市'],
  contract: ['立券', '交易'],
} as const satisfies Record<AlmanacPurpose, readonly AlmanacEvidence[]>;

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 31;

function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 2100) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value ? date : null;
}

function classify(favorable: AlmanacEvidence[], unfavorable: AlmanacEvidence[]): AlmanacStatus {
  if (favorable.length && unfavorable.length) return 'conditional';
  if (unfavorable.length) return 'caution';
  return favorable.length ? 'candidate' : 'unlisted';
}

export function searchAlmanacDates(
  purpose: AlmanacPurpose,
  start: string,
  end: string,
): AlmanacSearch {
  const first = parseCalendarDate(start);
  const last = parseCalendarDate(end);
  if (!first) return { ok: false, error: 'start' };
  if (!last) return { ok: false, error: 'end' };
  const count = (last.getTime() - first.getTime()) / DAY_MS + 1;
  if (count < 1) return { ok: false, error: 'reversed' };
  if (count > MAX_DAYS) return { ok: false, error: 'span' };

  const activities: readonly AlmanacEvidence[] = ACTIVITIES[purpose];
  const days = Array.from({ length: count }, (_, index): AlmanacDay => {
    // Iterate civil dates in UTC, then pass only their calendar fields to the almanac.
    const date = new Date(first.getTime() + index * DAY_MS);
    const lunar = Solar.fromYmd(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()).getLunar();
    // Sect 1 matches lunar-typescript's default month pillar convention for daily Yi/Ji.
    const listedYi = lunar.getDayYi(1);
    const listedJi = lunar.getDayJi(1);
    const favorable = activities.filter((activity) => listedYi.includes(activity));
    const unfavorable = activities.filter((activity) => listedJi.includes(activity));
    return {
      date: date.toISOString().slice(0, 10),
      status: classify(favorable, unfavorable),
      favorable,
      unfavorable,
      dayPillar: lunar.getDayInGanZhi(),
      dayOfficer: lunar.getZhiXing(),
      conflictingZodiac: lunar.getDayChongShengXiao(),
    };
  });

  return { ok: true, days };
}
