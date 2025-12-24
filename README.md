# 🌙 Astronomical Chinese Lunar Calendar (JavaScript)

> 📌 **Online Demo (GitHub Pages)**  
> 👉 [Lunar Calendar](https://ymhomer.github.io/lunarCalendar/)

---

##（API 使用导向）

本 README **以“如何调用”为第一优先**。  
如果你只关心：**怎么传参、返回什么、怎么用**，只需要看下面内容即可。

---

## 一、你会用到哪一个 JS？

| 文件 | 你是否应该直接用 |
|---|---|
| `lunar-astronomy.js` | ❌ 不推荐（底层算法） |
| `lunar-service.js` | ✅ **是（唯一推荐）** |
| `index.html` | ✅ 普通用户网页入口 |

👉 **结论：**
- UI / 业务代码 **只调用 `lunar-service.js`**
- `lunar-astronomy.js` 只作为内部依赖

---

## 二、最小可用示例（30 秒上手）

### 1️⃣ 引入顺序（必须）

```html
<script src="lunar-astronomy.js"></script>
<script src="lunar-service.js"></script>
```

---

### 2️⃣ 一行代码获取农历

```js
const result = LunarService.fromDate(new Date());
console.log(result.display);
```

输出示例：

```
乙巳年（蛇） 冬月（十一月） 初五
```

---

## 三、核心 API 一览（重点）

### ✅ LunarService.fromDate

#### 方法签名

```ts
LunarService.fromDate(
  date: Date,
  options?: {
    lang?: "zh-CN" | "zh-TW"
  }
): LunarResult
```

---

### 输入参数说明

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `date` | `Date` | ✅ | **公历日期（JavaScript Date 对象）** |
| `options.lang` | `string` | ❌ | `"zh-CN"` 或 `"zh-TW"`，默认 `"zh-CN"` |

⚠️ **必须是 `Date` 对象，不要传字符串**

---

### 返回值：`LunarResult`（完整结构）

```ts
{
  solar: {
    date: Date,        // 原始公历 Date
    text: string       // YYYY-MM-DD
  },

  lunar: {
    year: number,      // 农历年（正月初一为界）
    month: number,     // 农历月 1–12
    day: number,       // 农历日 1–30
    isLeap: boolean,   // 是否闰月
    monthDays: number,// 29 或 30
    monthName: string,// 冬月（十一月）
    dayName: string   // 初五
  },

  ganzhi: {
    year: number,     // 干支所属年（立春为界）
    ganzhi: string,   // 乙巳
    animal: string    // 蛇
  },

  display: string     // 已组合好的可直接展示文本
}
```

👉 **UI 直接用 `display` 即可**

---

## 四、常用调用示例（照抄可用）

### 1️⃣ 指定语言

```js
LunarService.fromDate(new Date(), { lang: "zh-CN" });
LunarService.fromDate(new Date(), { lang: "zh-TW" });
```

---

### 2️⃣ 获取单独字段

```js
const r = LunarService.fromDate(new Date());

console.log(r.lunar.monthName); // 冬月（十一月）
console.log(r.lunar.dayName);   // 初五
console.log(r.ganzhi.animal);   // 蛇
```

---

### 3️⃣ 今年同日（公历）

```js
LunarService.sameSolarDateThisYear(new Date("2024-10-24"));
```

含义：
> 用 **今年的公历同一天** 再算一次农历

---

### 4️⃣ 今年同日（农历）

```js
LunarService.sameLunarDateThisYear(new Date("2024-10-24"));
```

含义：
> 取该日期的农历月日，换算为 **今年对应的农历日期**

---

## 五、最重要的三条规则（必看）

1️⃣ **不要自己算生肖 / 干支**
> 已内置，且以立春为界

2️⃣ **不要把农历年当成生肖年**
> `lunar.year ≠ ganzhi.year`

3️⃣ **不要单独使用 `lunar-service.js`**
> 必须先加载 `lunar-astronomy.js`，否则直接报错

---

## 六、什么时候你才需要 lunar-astronomy.js？

**只有在以下情况：**

- 你要研究天文算法
- 你要自己实现另一套历法
- 你知道什么是“真朔 / 中气”

否则：**你不需要它**。

---

## 七、GitHub Pages 页面（index.html）

- 已经封装好所有调用
- 适合普通用户直接查询
- 你可以直接 fork 使用

---

## 八、License

MIT License

---

## 🇬🇧 English (API-first)

This README is **API-first**.  
If you want to know **how to call, what to pass, and what you get**, read this section.

---

## Quick Start

```html
<script src="lunar-astronomy.js"></script>
<script src="lunar-service.js"></script>
```

```js
LunarService.fromDate(new Date()).display;
```

---

## Core API

### LunarService.fromDate

```ts
LunarService.fromDate(
  date: Date,
  options?: {
    lang?: "zh-CN" | "zh-TW"
  }
): LunarResult
```

### Input

| Name | Type | Required |
|---|---|---|
| date | Date | Yes |
| options.lang | string | No |

### Output (LunarResult)

- `display` → ready-to-use string
- `lunar` → lunar values
- `ganzhi` → Ganzhi & zodiac

👉 **For UI usage, just use `display`.**

---

## Live Demo

👉 [Lunar Calendar](https://ymhomer.github.io/lunarCalendar/)

---

## License

MIT
