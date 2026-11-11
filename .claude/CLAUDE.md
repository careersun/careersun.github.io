# careersun.github.io 協作規則

網站正式網域：https://job365hire.com.tw（GitHub repo 仍是 careersun/careersun.github.io，根目錄 CNAME 檔不要刪；職缺地圖在 /job365map/）。網址一律寫 job365hire.com.tw，不要再寫 careersun.github.io。

這個網站由 Li san（日玖國際行銷）負責。`/hire/`（正職代招）的設計與版面以 2026-11-09 改版那個對話為主；其他對話改 `/hire/` 底下的頁面時，照下面的規則做，不要換掉版面或樣式。

## 改網站之前

- 先 `git fetch origin main` 並以最新的 main 為基礎再改，推之前再 fetch 一次，避免蓋掉別的對話剛推的內容。
- 只改這次任務需要的檔案；不要順手重排版面、換配色或改字體。
- 推上線前要 Li san 同意。

## 版面與樣式（v10）

- 首頁 `/hire/index.html`：樣式寫在頁內 `<style>`。
- 其他頁（收費方式、合作流程、常見問題、六個縣市頁、招募指南列表與文章）：共用 `/hire/guide/guide.css`，頁內不再放 `<style>`。新增頁面時連結 `guide.css?v=10`，不要再貼舊的內嵌樣式（`page-anim`、`nav-menu` 等）。
- 新增招募指南文章：複製一篇現有文章的結構（`main.wrap.article`、`.answer`、`.tldr`、`.checks`、`.faq`、`.cta`、`.about`、`.related`），並把連結加在 `/hire/guide/index.html` 的 `ARTICLES:START` 下面。
- 配色：JOB365 藍白橘。深藍 `#16294a`、紙色 `#f7f6f2`、螢光橘 `#ff6a2b`（只用在主按鈕與極少數重點，不當文字色）、橘色文字用 `#c2410c`。
- 字體：標題 Noto Serif TC（明體），內文 Noto Sans TC，數字 Barlow Condensed。
- 標題明體有依頁面裁切字（Google Fonts `text=` 參數，標示 `data-serif` 的那行）。改了標題文字，要把新出現的字補進該頁的 `text=`；招募指南列表頁不裁切。
- 不加：標題上方的英文小標、01/02/03 裝飾編號、emoji 或符號當圖示、卡片傾斜、捲動淡入。

## 追蹤碼（改任何頁面都不能破壞）

- `<head>` 的 GA4（G-5Z7MHS50DW）、Google Ads（AW-18319232545）與 Meta 像素程式不要動。
- 點擊事件靠 `data-ga`（主要頁）和 `data-ev`（縣市頁、文章）屬性；改版時數量與名稱要跟原本一致，推之前逐頁比對。
- 首頁表單：`#hireForm`、欄位 `name`、`#f-email`、`.form-msg`、成功訊息「已收到你的徵才需求，顧問會盡快與你聯繫！」都不能改，Google Ads 表單轉換與加強型轉換依賴它們。
- 首頁 LINE 連結點擊會算 Google Ads 轉換；不該算的 LINE 連結加 `data-noconv`。

## 內容規則

- 合作流程的文字以 `/hire/process.html` 為準（四步驟與各項確認內容）；首頁「一位人選，是怎麼被推薦到你面前的？」的步驟、縣市頁與常見問題的流程描述都要跟它一致，改流程時一起改。

- 聯絡電話用 03-5643252（不用免付費電話）；受理時間 09:00–17:45，國定假日休息。
- 不在 JOB365 網站寫勞動部評鑑相關字樣。
- 雇主頁（首頁、正職代招）不要把雇主導去求職者用的職缺地圖。
- 不編造客戶見證、數字或流程細節；沒有的資料先問 Li san。
