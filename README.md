# 🌙 Astronomical Chinese Lunar Calendar
## 天文农历计算（纯 JavaScript · 无表 · 无依赖）

> 📌 **在线查询（GitHub Pages）**  
> 👉 [Lunar Calendar](https://ymhomer.github.io/lunarCalendar/)

---

## 🇨🇳 简体中文

### 一、项目简介

本项目提供一套**基于真实天文算法的中国农历实现**，完全使用原生 JavaScript 编写，具备以下特点：

- 不使用任何农历查表（无硬编码数据）
- 不依赖第三方库
- 基于：
  - 真朔（天文新月）
  - 太阳黄经与中气（每 30°）
  - 冬至月为农历十一月
  - “无中气置闰月”规则
- 严格区分：
  - **农历年月日（以正月初一为岁首）**
  - **干支年 / 生肖年（以立春为年界）**

本仓库同时面向两类人群：

- **普通用户**：直接使用 GitHub Pages 页面进行农历查询  
- **开发者**：通过 JavaScript API 集成到自己的项目中

---

### 二、整体结构与设计理念

```
.
├─ lunar-astronomy.js   # 天文计算引擎（底层、精确）
├─ lunar-service.js     # 农历业务服务层（推荐使用）
├─ index.html           # GitHub Pages 页面（普通用户入口）
└─ README.md
```

---

### 三、lunar-astronomy.js（天文引擎）

**文件定位**  
底层天文计算引擎，只负责“算得准”，不负责 UI 或文字表达。

**核心能力**

- 真朔（新月）时间计算
- 太阳视黄经计算
- 中气（30°）判定
- 冬至定位（270°）
- 农历月序与闰月推导

**主要 API**

```js
LunarAstronomy.solarToLunar(date: Date): {
  lYear: number,
  lMonth: number,
  lDay: number,
  isLeap: boolean,
  monthDays: number
}
```

**注意事项**

- 不要直接用 lYear 计算干支或生肖
- 不建议在 UI 层直接使用本文件
- 推荐仅作为 lunar-service.js 的底层依赖

---

### 四、lunar-service.js（农历业务层 · 推荐）

**文件定位**  
在天文引擎之上，提供“不会用错”的农历服务接口。

**设计目标**

- 防止混用农历年与干支年
- 集中处理立春、干支、生肖规则
- 提供可读、稳定的返回结构
- 强制依赖 lunar-astronomy.js（防止误用）

**依赖保护**

```js
if (!window.LunarAstronomy) {
  throw new Error("Dependency missing");
}
```

**核心 API：fromDate**

```js
LunarService.fromDate(
  date: Date,
  options?: { lang?: "zh-CN" | "zh-TW" }
): {
  solar: { text: string },
  lunar: {
    year: number,
    month: number,
    day: number,
    isLeap: boolean,
    monthDays: number,
    monthName: string,
    dayName: string
  },
  ganzhi: {
    year: number,
    ganzhi: string,
    animal: string
  },
  display: string
}
```

**使用示例**

```js
const info = LunarService.fromDate(new Date(), { lang: "zh-CN" });
console.log(info.display);
```

**业务接口**

```js
LunarService.sameSolarDateThisYear(date, options);
LunarService.sameLunarDateThisYear(date, options);
```

---

### 五、GitHub Pages 页面（index.html）

- 面向普通用户的农历查询工具
- 支持任意日期查询
- 显示干支年、生肖、农历月日
- 支持简体 / 繁体切换
- 卡片化 UI，适合桌面与移动端

---

### 六、常见误用说明（重要）

- 不要把农历年当作生肖年
- 干支年必须以立春为界
- 不要单独使用 lunar-service.js

---

### 七、License

MIT License

---

## 🇬🇧 English

### Overview

This project provides a **pure JavaScript implementation of the Chinese Lunar Calendar** based on real astronomical calculations.

- True new moon (conjunction)
- Solar longitude and major solar terms
- Leap month rules
- No lookup tables
- No external dependencies

---

### Files

- **lunar-astronomy.js** – Astronomical engine (low-level)
- **lunar-service.js** – Business/service layer (recommended)
- **index.html** – GitHub Pages UI

---

### Usage

```js
LunarService.fromDate(new Date(), { lang: "zh-CN" }).display;
```

⚠️ Do not use `lunar-service.js` without `lunar-astronomy.js`.

---

### Live Demo

👉 [Lunar Calendar](https://ymhomer.github.io/lunarCalendar/)

---

### License

MIT
