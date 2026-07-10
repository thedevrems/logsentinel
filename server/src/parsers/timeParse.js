const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// Converts a three-letter month abbreviation into its zero-based index.
export function monthIndex(abbr) {
  return MONTHS[abbr] ?? 0;
}

// Parses the nginx bracket timestamp "10/Jul/2026:08:15:02 +0000" to a Date.
export function parseNginxTime(raw) {
  const match = /^(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})$/.exec(raw);
  if (!match) return new Date();
  const [, day, mon, year, h, m, s, tz] = match;
  const iso = `${year}-${String(monthIndex(mon) + 1).padStart(2, '0')}-${day}T${h}:${m}:${s}${tz.slice(0, 3)}:${tz.slice(3)}`;
  return new Date(iso);
}

// Parses the syslog timestamp "Jul 10 08:20:01" using a reference year.
export function parseSyslogTime(raw, year = new Date().getFullYear()) {
  const match = /^(\w{3})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})$/.exec(raw);
  if (!match) return new Date();
  const [, mon, day, h, m, s] = match;
  return new Date(year, monthIndex(mon), Number(day), Number(h), Number(m), Number(s));
}
