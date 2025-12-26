/******************************************************
 * Lunar Service Layer
 * - Depends on: lunar-astronomy.js
 * - DO NOT use alone
 *
 * Provides:
 * 1. Ganzhi Year (LiChun based)        → ganzhiYear
 * 2. Civil Lunar Year (Spring Festival) → civilYear
 * 3. Astronomical Lunar Year (Winter Solstice) → astroYear
 *
 * Supports: zh-CN / zh-TW
 ******************************************************/

(function (global) {
  "use strict";

  /* ===============================
     0. Dependency Guard
     =============================== */

  if (!global.LunarAstronomy) {
    throw new Error(
      "[LunarService] Dependency missing: lunar-astronomy.js must be loaded first."
    );
  }

  const Astro = global.LunarAstronomy;

  /* ===============================
     1. I18N Resources
     =============================== */

  const I18N = {
    "zh-CN": {
      stems: "甲乙丙丁戊己庚辛壬癸",
      branches: "子丑寅卯辰巳午未申酉戌亥",
      animals: "鼠牛虎兔龙蛇马羊猴鸡狗猪",
      months: {
        1: "正月（一月）",
        2: "二月",
        3: "三月",
        4: "四月",
        5: "五月",
        6: "六月",
        7: "七月",
        8: "八月",
        9: "九月",
        10: "十月",
        11: "冬月（十一月）",
        12: "腊月（十二月）"
      }
    },
    "zh-TW": {
      stems: "甲乙丙丁戊己庚辛壬癸",
      branches: "子丑寅卯辰巳午未申酉戌亥",
      animals: "鼠牛虎兔龍蛇馬羊猴雞狗豬",
      months: {
        1: "正月（一月）",
        2: "二月",
        3: "三月",
        4: "四月",
        5: "五月",
        6: "六月",
        7: "七月",
        8: "八月",
        9: "九月",
        10: "十月",
        11: "冬月（十一月）",
        12: "臘月（十二月）"
      }
    }
  };

  /* ===============================
     2. Text Helpers
     =============================== */

  function lunarDayName(day) {
    const nums = "一二三四五六七八九十";
    if (day <= 10) return "初" + nums[day - 1];
    if (day < 20) return "十" + nums[day - 11];
    if (day === 20) return "二十";
    if (day < 30) return "廿" + nums[day - 21];
    return "三十";
  }

  function lunarMonthName(month, isLeap, lang) {
    return (isLeap ? "闰" : "") + I18N[lang].months[month];
  }

  /* ===============================
     3. Ganzhi Year (LiChun Based)
     =============================== */

  function getGanzhiYear(date, lang) {
    const year = date.getFullYear();

    // fallback if no precise LiChun is provided
    const afterLichun =
      date.getMonth() > 1 ||
      (date.getMonth() === 1 && date.getDate() >= 4);

    const gzYear = afterLichun ? year : year - 1;
    const index = (gzYear - 4) % 60;

    return {
      year: gzYear,
      ganzhi:
        I18N[lang].stems[index % 10] +
        I18N[lang].branches[index % 12],
      animal: I18N[lang].animals[index % 12]
    };
  }

  /* ===============================
     4. Civil Lunar Year (Spring Festival)
     =============================== */

  function getCivilLunarYear(lunar) {
    // 冬月、腊月属于“下一民用农历年”
    if (lunar.lMonth === 11 || lunar.lMonth === 12) {
      return lunar.lYear + 1;
    }
    return lunar.lYear;
  }

  /* ===============================
     5. Core API
     =============================== */

  function fromDate(date, options = {}) {
    const lang = options.lang || "zh-CN";
    if (!I18N[lang]) throw new Error("Unsupported language: " + lang);

    const lunar = Astro.solarToLunar(date);
    const ganzhi = getGanzhiYear(date, lang);
    const civilYear = getCivilLunarYear(lunar);

    return {
      solar: {
        date,
        text: date.toISOString().slice(0, 10)
      },

      lunar: {
        // === YEAR DIMENSIONS ===
        astroYear: lunar.lYear,   // 冬至纪年（天文）
        civilYear: civilYear,     // 民用农历年（春节）
        ganzhiYear: ganzhi.year,  // 干支年（立春）

        // === MONTH / DAY ===
        month: lunar.lMonth,
        day: lunar.lDay,
        isLeap: lunar.isLeap,
        monthDays: lunar.monthDays,

        // === DISPLAY ===
        monthName: lunarMonthName(lunar.lMonth, lunar.isLeap, lang),
        dayName: lunarDayName(lunar.lDay)
      },

      ganzhi,

      display:
        `${ganzhi.ganzhi}年（${ganzhi.animal}） ` +
        `${lunarMonthName(lunar.lMonth, lunar.isLeap, lang)} ` +
        `${lunarDayName(lunar.lDay)}`
    };
  }

  /* ===============================
     6. Business Shortcuts
     =============================== */

  function sameSolarDateThisYear(date, options) {
    const now = new Date();
    const d = new Date(now.getFullYear(), date.getMonth(), date.getDate());
    return fromDate(d, options);
  }

  /* ===============================
     7. Export
     =============================== */

  global.LunarService = {
    fromDate,
    sameSolarDateThisYear
  };

})(window);
