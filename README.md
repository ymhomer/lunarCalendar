# 🌙 Astronomical Chinese Lunar Calendar  
## 天文农历计算（纯 JavaScript · 无表 · 无依赖）

> 📌 **GitHub Pages 在线查询页面**  
> 👉 https://ymhomer.github.io/lunarCalendar

---

## 🇨🇳 中文说明（简体）

### 项目简介

这是一个**基于真实天文计算的中国农历实现**，完全使用 JavaScript 编写：

- 不依赖任何农历表
- 不依赖第三方库
- 基于 **真朔（新月）+ 中气 + 冬至规则**
- 严格区分：
  - 农历年月日（以正月初一为岁首）
  - 干支年 / 生肖（以立春为年界）

本仓库同时提供：

- 🧠 **底层天文引擎（给开发者用）**
- 🧩 **农历业务层（防误用、可读性强）**
- 🌐 **GitHub Pages 页面（给普通用户查询）**

---

### 文件结构说明

```
.
├─ lunar-astronomy.js   # 天文计算引擎（核心）
├─ lunar-service.js     # 农历业务服务层（推荐使用）
├─ index.html           # GitHub Pages 页面（用户入口）
└─ README.md
```

---

## 📦 核心文件说明

### 1️⃣ lunar-astronomy.js（天文引擎）

**定位：**  
只负责“算得准”，不负责“怎么展示”

**主要 API：**

```js
LunarAstronomy.solarToLunar(date)
```

---

### 2️⃣ lunar-service.js（农历业务层 · 推荐使用）

**定位：**  
在天文引擎之上，提供不会用错的农历服务

**示例：**

```js
LunarService.fromDate(new Date(), { lang: "zh-CN" }).display
```

---

## 🌐 GitHub Pages 页面

普通用户可直接使用网页进行查询，无需任何编程知识。

---

## 🇹🇼 中文說明（繁體）

（與簡體版內容一致，僅語言不同）

---

## 🇬🇧 English Description

This project provides a pure JavaScript implementation of the Chinese Lunar Calendar based on real astronomical calculations.

---

## License

MIT
