// Chinese Lunar Calendar Utilities
// Gregorian ↔ Lunar conversion (approximate, covers 1930-2035)

// Chinese New Year dates (Gregorian [month, day])
export const CNY = {
  1930:[1,30], 1931:[2,17], 1932:[2,6],  1933:[1,26], 1934:[2,14],
  1935:[2,4],  1936:[1,24], 1937:[2,11], 1938:[1,31], 1939:[2,19],
  1940:[2,8],  1941:[1,27], 1942:[2,15], 1943:[2,5],  1944:[1,25],
  1945:[2,13], 1946:[2,2],  1947:[1,22], 1948:[2,10], 1949:[1,29],
  1950:[2,17], 1951:[2,6],  1952:[1,27], 1953:[2,14], 1954:[2,3],
  1955:[1,24], 1956:[2,12], 1957:[1,31], 1958:[2,18], 1959:[2,8],
  1960:[1,28], 1961:[2,15], 1962:[2,5],  1963:[1,25], 1964:[2,13],
  1965:[2,2],  1966:[1,21], 1967:[2,9],  1968:[1,30], 1969:[2,17],
  1970:[2,6],  1971:[1,27], 1972:[2,15], 1973:[2,3],  1974:[1,23],
  1975:[2,11], 1976:[1,31], 1977:[2,18], 1978:[2,7],  1979:[1,28],
  1980:[2,16], 1981:[2,5],  1982:[1,25], 1983:[2,13], 1984:[2,2],
  1985:[2,20], 1986:[2,9],  1987:[1,29], 1988:[2,17], 1989:[2,6],
  1990:[1,27], 1991:[2,15], 1992:[2,4],  1993:[1,23], 1994:[2,10],
  1995:[1,31], 1996:[2,19], 1997:[2,7],  1998:[1,28], 1999:[2,16],
  2000:[2,5],  2001:[1,24], 2002:[2,12], 2003:[2,1],  2004:[1,22],
  2005:[2,9],  2006:[1,29], 2007:[2,18], 2008:[2,7],  2009:[1,26],
  2010:[2,14], 2011:[2,3],  2012:[1,23], 2013:[2,10], 2014:[1,31],
  2015:[2,19], 2016:[2,8],  2017:[1,28], 2018:[2,16], 2019:[2,5],
  2020:[1,25], 2021:[2,12], 2022:[2,1],  2023:[1,22], 2024:[2,10],
  2025:[1,29], 2026:[2,17], 2027:[2,6],  2028:[1,26], 2029:[2,13],
  2030:[2,3],  2031:[1,23], 2032:[2,11], 2033:[1,31], 2034:[2,19],
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
