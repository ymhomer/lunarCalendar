/******************************************************
 * Astronomical Chinese Lunar Calendar (Single File)
 * - True New Moon (Conjunction)
 * - True Solar Longitude (Zhongqi)
 * - Leap Month by "No Zhongqi"
 * - Winter Solstice Month = 11
 * - No tables, no deps
 * - Default timezone: UTC+8
 ******************************************************/

(function (global) {
  "use strict";

  /* ===============================
     1. Constants & Math Utils
     =============================== */

  const TZ_OFFSET = 8; // UTC+8
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const SYNODIC_MONTH = 29.530588853;

  function deg2rad(d) { return d * DEG; }
  function rad2deg(r) { return r * RAD; }
  function norm360(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function angleDiff(a, b) {
    let d = norm360(a) - norm360(b);
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  /* ===============================
     2. Julian Day / Time
     =============================== */

  function jdFromDate(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  function dateFromJd(jd) {
    return new Date((jd - 2440587.5) * 86400000);
  }

  function localDay(jdUT) {
    return Math.floor(jdUT + TZ_OFFSET / 24 + 0.5);
  }

  /* ===============================
     3. ΔT (TT − UT)  强化版
     =============================== */
  
	function deltaT(year) {
	  const y = year;
	  const Tcent = (y - 2000) / 100;

	  if (y < 1700) return 120 + 80 * Tcent * Tcent;
	  if (y < 1800) return 8.83 + 0.1603 * (y - 1700);
	  if (y < 1860) return 13.72 - 0.332447 * (y - 1800);
	  if (y < 1900) return 7.62 + 0.5737 * (y - 1860);
	  if (y < 1920) return -2.79 + 1.494119 * (y - 1900);
	  if (y < 1941) return 21.20 + 0.84493 * (y - 1920);
	  if (y < 1961) return 29.07 + 0.407 * (y - 1950);
	  if (y < 1986) return 45.45 + 1.067 * (y - 1975);

	  // NASA 1986–2005
	  if (y < 2005) {
		const t = y - 2000;
		return 63.86
		  + 0.3345 * t
		  - 0.060374 * t * t
		  + 0.0017275 * t * t * t
		  + 0.000651814 * t * t * t * t
		  + 0.00002373599 * t * t * t * t * t;
	  }

	  // NASA 2005–2050（二次式）
	  const t = y - 2000;
	  return 62.92 + 0.32217 * t + 0.005589 * t * t;
	}

	function toTT(jdUT) {
	  const date = dateFromJd(jdUT);

	  const y0 = date.getUTCFullYear();
	  const start = Date.UTC(y0, 0, 1);
	  const end = Date.UTC(y0 + 1, 0, 1);

	  const fraction = (date.getTime() - start) / (end - start);
	  const decimalYear = y0 + fraction;

	  return jdUT + deltaT(decimalYear) / 86400;
	}


  function toUT(jdTT) {
    const y = dateFromJd(jdTT).getUTCFullYear();
    return jdTT - deltaT(y) / 86400;
  }

  /* ===============================
     4. Solar Longitude (True)
     =============================== */

  function solarLongitude(jdTT) {
    const T = (jdTT - 2451545.0) / 36525;
    const L0 = norm360(280.46646 + 36000.76983 * T);
    const M = norm360(357.52911 + 35999.05029 * T);
    const C =
      (1.914602 - 0.004817 * T) * Math.sin(deg2rad(M)) +
      0.019993 * Math.sin(deg2rad(2 * M));
    return norm360(L0 + C);
  }

  function solveSolarLongitude(jdUT, target) {
    let t = jdUT;
    for (let i = 0; i < 12; i++) {
      const f = angleDiff(solarLongitude(toTT(t)), target);
      const f2 = angleDiff(solarLongitude(toTT(t + 1 / 1440)), target);
      t -= f / ((f2 - f) * 1440);
    }
    return t;
  }

  /* ===============================
     5. Moon Longitude (A1 强化)
     =============================== */

  function moonLongitude(jdTT) {
    const T = (jdTT - 2451545.0) / 36525;
    const Lp = norm360(218.3164477 + 481267.88123421 * T);
    const M = norm360(134.9633964 + 477198.8675055 * T);
    const D = norm360(297.8501921 + 445267.1114034 * T);
    let sum =
      6.289 * Math.sin(deg2rad(M)) +
      1.274 * Math.sin(deg2rad(2 * D - M)) +
      0.658 * Math.sin(deg2rad(2 * D)) +
      0.214 * Math.sin(deg2rad(2 * M)) +
      0.11 * Math.sin(deg2rad(D));
    return norm360(Lp + sum);
  }

  /* ===============================
     6. True New Moon
     =============================== */

  function trueNewMoon(jdUT) {
    let t = toTT(jdUT);
    for (let i = 0; i < 15; i++) {
      const f = angleDiff(moonLongitude(t), solarLongitude(t));
      const f2 = angleDiff(
        moonLongitude(t + 1 / 1440),
        solarLongitude(t + 1 / 1440)
      );
      t -= f / ((f2 - f) * 1440);
    }
    return toUT(t);
  }

  function prevNewMoon(jdUT) {
    let t = jdUT;
    for (let i = 0; i < 15; i++) {
      const nm = trueNewMoon(t);
      if (nm <= jdUT) return nm;
      t -= SYNODIC_MONTH;
    }
  }

  function nextNewMoon(jdUT) {
    let t = jdUT + SYNODIC_MONTH * 0.8;
    for (let i = 0; i < 15; i++) {
      const nm = trueNewMoon(t);
      if (nm >= jdUT) return nm;
      t += SYNODIC_MONTH;
    }
  }

  /* ===============================
     7. Build Lunar Year
     =============================== */

  function buildLunarYear(year) {
    const ws = solveSolarLongitude(
      jdFromDate(new Date(Date.UTC(year, 11, 21))),
      270
    );
    const ws2 = solveSolarLongitude(
      jdFromDate(new Date(Date.UTC(year + 1, 11, 21))),
      270
    );

    const m11 = prevNewMoon(ws);
    const m11n = prevNewMoon(ws2);

    const months = [];
    let cur = m11;
    while (cur < m11n) {
      const next = nextNewMoon(cur + 1);
      months.push({
        start: cur,
        end: next,
        hasZhongqi: false
      });
      cur = next;
    }

    for (let i = 0; i < months.length; i++) {
      for (let k = 0; k < 360; k += 30) {
        const t = solveSolarLongitude(months[i].start + 15, k);
        if (t >= months[i].start && t < months[i].end) {
          months[i].hasZhongqi = true;
        }
      }
    }

    let m = 11;
    months.forEach((mo) => {
      mo.month = m;
      m = (m % 12) + 1;
    });

    if (months.length === 13) {
      for (let i = 0; i < months.length; i++) {
        if (!months[i].hasZhongqi) {
          months[i].isLeap = true;
          months[i].month = months[i - 1].month;
          break;
        }
      }
    }

    return months;
  }

  /* ===============================
     8. Solar -> Lunar
     =============================== */

  function solarToLunar(date) {
    const jd = jdFromDate(date);
    const y = date.getUTCFullYear();
    let months = buildLunarYear(y - 1);
    if (!(jd >= months[0].start && jd < months[months.length - 1].end)) {
      months = buildLunarYear(y);
    }

    for (const m of months) {
      if (jd >= m.start && jd < m.end) {
        const day = localDay(jd) - localDay(m.start) + 1;
        return {
          lYear: m.month < 11 ? y : y - 1,
          lMonth: m.month,
          lDay: day,
          isLeap: !!m.isLeap,
          monthDays: localDay(m.end) - localDay(m.start)
        };
      }
    }
  }

  /* ===============================
     9. Expose API
     =============================== */

  global.LunarAstronomy = {
    solarToLunar
  };

})(window);
