/* JOB365 名單來源追蹤
   每一頁都載入：記住「第一次進站」從哪來（Google 廣告 / Meta 廣告 / UTM / 搜尋 / 外部網站 / 直接進站）和落地頁，
   送表單時跟「這次」的來源一起帶出去，換頁、隔天回來填也不會不見。 */
(function () {
  var KEY = "j365_src2";

  function classify() {
    var q = new URLSearchParams(location.search), r = document.referrer, host = "";
    try { host = r ? new URL(r).host : ""; } catch (e) {}
    if (host === location.host) return null; // 站內換頁，不算新來源

    var utm = ["utm_source", "utm_medium", "utm_campaign"].map(function (k) { return q.get(k); }).filter(Boolean);
    if (q.get("gclid") || q.get("gad_source") || q.get("gbraid") || q.get("wbraid")) {
      var c = q.get("gad_campaignid") || q.get("utm_campaign");
      return "Google 廣告" + (c ? "（" + c + "）" : "");
    }
    if (q.get("fbclid")) return "Meta（FB/IG）" + (utm.length ? "：" + utm.join(" / ") : "");
    if (utm.length) return "UTM：" + utm.join(" / ");
    if (!host) return "直接進站（輸入網址/書籤/LINE 等 App 內連結）";
    if (/(^|\.)google\./.test(host)) return "Google 自然搜尋";
    if (/bing\.com|yahoo\.|duckduckgo/.test(host)) return "其他搜尋引擎：" + host;
    if (/chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google|copilot\.microsoft|claude\.ai/.test(host)) return "AI 搜尋：" + host;
    if (/facebook\.com|instagram\.com|threads\.(net|com)/.test(host)) return "Meta 自然流量：" + host;
    if (/line\.me/.test(host)) return "LINE：" + host;
    return "外部網站：" + host;
  }

  var now = classify();
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  if (now) {
    var visit = { s: now, p: location.pathname, t: new Date().toISOString().slice(0, 10) };
    try {
      if (!saved) saved = { first: visit };
      saved.last = visit; // 最近一次從外部進來
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch (e) {}
  }

  window.j365Src = function () {
    var out = [];
    if (saved && saved.first) out.push("首次：" + saved.first.s + "｜" + saved.first.t + " 進 " + saved.first.p);
    if (saved && saved.last && saved.first && (saved.last.s !== saved.first.s || saved.last.t !== saved.first.t)) {
      out.push("最近：" + saved.last.s + "｜" + saved.last.t + " 進 " + saved.last.p);
    }
    return out.length ? out.join("\n") : "無法判斷（瀏覽器未保留紀錄）";
  };
})();
