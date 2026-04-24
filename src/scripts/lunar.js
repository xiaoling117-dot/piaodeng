// Chinese Lunar Calendar Utilities
// Gregorian ↔ Lunar conversion (approximate, covers 2019-2035)

// Chinese New Year dates (Gregorian month-1, day)
export const CNY = {
  2019:[2,5],  2020:[1,25], 2021:[2,12], 2022:[2,1],
  2023:[1,22], 2024:[2,10], 2025:[1,29], 2026:[2,17],
  2027:[2,6],  2028:[1,26], 2029:[2,13], 2030:[2,3],
  2031:[1,23], 2032:[2,11], 2033:[1,31], 2034:[2,19],
  2035:[2,8],
};

const TIANGAN  = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI    = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const ZODIAC = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猿','鶏','犬','猪'];

export const LUNAR_MONTHS = [
  '正月','二月','三月','四月','五月','六月',
  '七月','八月','九月','十月','十一月','十二月',
];

export const LUNAR_DAYS = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十',
];

// 24 Solar Terms [name, month, approx_day]
const SOLAR_TERMS = [
  ['小寒',1,6],  ['大寒',1,20], ['立春',2,4],  ['雨水',2,19],
  ['啓蟄',3,6],  ['春分',3,21], ['清明',4,5],  ['穀雨',4,20],
  ['立夏',5,6],  ['小満',5,21], ['芒種',6,6],  ['夏至',6,21],
  ['小暑',7,7],  ['大暑',7,23], ['立秋',8,7],  ['処暑',8,23],
  ['白露',9,8],  ['秋分',9,23], ['寒露',10,8], ['霜降',10,23],
  ['立冬',11,7], ['小雪',11,22],['大雪',12,7], ['冬至',12,22],
];

export const LUNAR_CYCLE = 29.530588853; // days

// ── Moon phase (0 = new, 14.77 = full) ────────────────────────
export function getMoonPhase(date) {
  const ref = Date.UTC(2000, 0, 6, 18, 14, 0); // known new moon
  let phase = ((date.getTime() - ref) / 86400000) % LUNAR_CYCLE;
  if (phase < 0) phase += LUNAR_CYCLE;
  return phase;
}

export function getMoonEmoji(phase) {
  if (phase < 1.85)  return '🌑';
  if (phase < 7.38)  return '🌒';
  if (phase < 9.22)  return '🌓';
  if (phase < 14.77) return '🌔';
  if (phase < 16.61) return '🌕';
  if (phase < 22.15) return '🌖';
  if (phase < 23.99) return '🌗';
  return '🌘';
}

export function getMoonName(phase) {
  if (phase < 1.85)  return '新月';
  if (phase < 7.38)  return '三日月';
  if (phase < 9.22)  return '上弦';
  if (phase < 14.77) return '十三夜月';
  if (phase < 16.61) return '満月';
  if (phase < 22.15) return '十六夜';
  if (phase < 23.99) return '下弦';
  return '有明月';
}

// ── Solar term for a date ──────────────────────────────────────
export function getSolarTerm(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (const [name, sm, sd] of SOLAR_TERMS) {
    if (sm === m && Math.abs(d - sd) <= 1) return name;
  }
  return null;
}

// ── Core lunar info for a Gregorian date ───────────────────────
export function getLunarInfo(date) {
  const year = date.getFullYear();

  let lunarYear = year;
  let cnyArr = CNY[year];
  let cny = cnyArr ? new Date(year, cnyArr[0] - 1, cnyArr[1]) : null;

  if (!cny || date < cny) {
    lunarYear = year - 1;
    cnyArr = CNY[lunarYear];
    cny = cnyArr ? new Date(lunarYear, cnyArr[0] - 1, cnyArr[1]) : null;
  }
  if (!cny) return null;

  const days = Math.floor((date.getTime() - cny.getTime()) / 86400000);
  const monthIdx = Math.floor(days / LUNAR_CYCLE);
  const dayIdx   = Math.min(Math.round(days - monthIdx * LUNAR_CYCLE), 29);

  const si = ((lunarYear - 4) % 10 + 10) % 10;
  const bi = ((lunarYear - 4) % 12 + 12) % 12;

  return {
    lunarYear,
    stemBranch: TIANGAN[si] + DIZHI[bi],
    zodiac:     ZODIAC[bi],
    monthIdx:   monthIdx % 12,
    monthName:  LUNAR_MONTHS[monthIdx % 12],
    dayIdx,
    dayName:    LUNAR_DAYS[dayIdx],
  };
}

// ── Current lunar month's day list ────────────────────────────
export function getLunarMonthDays(today) {
  const info = getLunarInfo(today);
  if (!info) return [];

  // Rewind to 初一 (approximate)
  const start = new Date(today);
  start.setDate(today.getDate() - info.dayIdx);

  const days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const phase = getMoonPhase(d);
    // Stop at the next new moon (phase resets)
    if (i > 27 && phase < 3) break;
    days.push({
      date:      d,
      dayIdx:    i,
      dayName:   LUNAR_DAYS[i],
      phase,
      emoji:     getMoonEmoji(phase),
      isToday:   d.toDateString() === today.toDateString(),
    });
  }
  return days;
}
