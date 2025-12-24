/******************************************************
 * Lunar Service Layer (Enhanced i18n)
 * - Depends on: lunar-astronomy.js
 * - DO NOT use alone
 * - Handles:
 *   * Ganzhi year (LiChun based)
 *   * Human-readable lunar text
 *   * Business logic (same day this year)
 * - Supports: zh-CN / zh-TW
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
     1. 语言资源
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
     2. 文本工具
     =============================== */

  function lunarDayName(day, lang) {
    const nums = lang === "zh-TW"
      ? "一二三四五六七八九十"
      : "一二三四五六七八九十";

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
     3. 干支年（立春）
     =============================== */

  function getGanzhiYear(date, lang) {
    const year = date.getFullYear();

    // 使用天文引擎中的立春（若有）
    const lichunJD = Astro._getLiChunJD
      ? Astro._getLiChunJD(year)
      : null;

    const afterLichun = lichunJD
      ? Astro._jdFromDate(date) >= lichunJD
      : (date.getMonth() > 1 || (date.getMonth() === 1 && date.getDate() >= 4));

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
     4. 核心接口
     =============================== */

  function fromDate(date, options = {}) {
    const lang = options.lang || "zh-CN";
    if (!I18N[lang]) throw new Error("Unsupported language: " + lang);

    const lunar = Astro.solarToLunar(date);
    const gz = getGanzhiYear(date, lang);

    return {
      solar: {
        date,
        text: date.toISOString().slice(0, 10)
      },
      lunar: {
        year: lunar.lYear,
        month: lunar.lMonth,
        day: lunar.lDay,
        isLeap: lunar.isLeap,
        monthDays: lunar.monthDays,
        dayName: lunarDayName(lunar.lDay, lang),
        monthName: lunarMonthName(lunar.lMonth, lunar.isLeap, lang)
      },
      ganzhi: gz,
      display:
        `${gz.ganzhi}年（${gz.animal}） ` +
        `${lunarMonthName(lunar.lMonth, lunar.isLeap, lang)} ` +
        `${lunarDayName(lunar.lDay, lang)}`
    };
  }

  /* ===============================
     5. 快捷业务接口
     =============================== */

  function sameSolarDateThisYear(date, options) {
    const now = new Date();
    const d = new Date(now.getFullYear(), date.getMonth(), date.getDate());
    return fromDate(d, options);
  }

  function sameLunarDateThisYear(date, options) {
    const lunar = Astro.solarToLunar(date);
    const year = new Date().getFullYear();

    if (!Astro.lunarToSolar) {
      throw new Error("[LunarService] lunarToSolar not available.");
    }

    const solar = Astro.lunarToSolar(
      year,
      lunar.lMonth,
      lunar.lDay,
      lunar.isLeap
    );

    return fromDate(solar, options);
  }

  /* ===============================
     6. 暴露 API
     =============================== */

  global.LunarService = {
    fromDate,
    sameSolarDateThisYear,
    sameLunarDateThisYear
  };

})(window);
