# /hire/ SEO / GEO 技術審查（2026-11-11）

## 範圍及發布安全
僅審查 `/hire/` 及相關子頁。此分支不合併、不發布；不更動 CSS、版面、表單、GA4、Google Ads 或 Meta Pixel。

## 已確認
- `hire/index.html`：title、description、robots、canonical、Open Graph、Service、Organization、BreadcrumbList 已存在。
- `hire/faq.html`：獨立 FAQ 頁，含 canonical 與 JSON-LD。
- `hire/guide/index.html`：招募指南入口，含 canonical 與 JSON-LD。
- `hire/pricing.html`：收費頁，含 canonical 與 JSON-LD。
- 根目錄 `robots.txt` 允許抓取並宣告 sitemap。
- 根目錄 `sitemap.xml` 列出首頁、FAQ、指南、收費、流程、區域及多篇文章。
- 首頁存在 GA4、Google Ads 轉換、Meta Pixel，必須保留。

## 本分支實作
- 首頁新增 Twitter/X 專用 title、description、image 中繼資料，與既有 OG 對應。
- 無視覺或追蹤程式碼改動。

## 後續優先檢查（尚未驗證）
1. 逐頁檢查 sitemap 中每個 URL 的 HTTP 狀態、canonical、標題與內容是否重複。
2. 以 Google Search Console 確認實際索引、搜尋查詢、CTR 和排名；不能從原始碼推斷。
3. 比對 JSON-LD 所述費用、服務、企業資料與可見頁面文案是否完全一致。
4. 檢查首頁與 FAQ、收費、流程、指南文章的內部連結與錨文字。
5. 審核各區域頁是否具有獨立、有用且可驗證的內容，避免薄內容或入口頁。
6. 檢查圖片 alt、載入效能、行動裝置 Core Web Vitals；需瀏覽器及測速資料。
7. GEO 以清楚的服務定義、可核實的商業資訊、作者與更新資訊、實際 FAQ 及原創專業內容為主；不保證 AI 引用。

## 發布前驗證
- 比對主分支與此分支 diff，確保僅 `hire/index.html` 的 Twitter metadata 及本審查文件變動。
- 驗證頁面 head 解析、JSON-LD 語法、表單互動及 GA4/Ads/Meta 事件。
- 未經確認不得合併至 main。
