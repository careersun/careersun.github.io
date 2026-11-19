/* 數字直接顯示最終值（不做從 0 跳起的動畫）：HTML 裡寫的就是真實數字，爬蟲與 AI 搜尋讀到的跟訪客看到的一致 */
(function(){
  function node(el){var w=document.createTreeWalker(el,4,{acceptNode:function(n){return /\d/.test(n.textContent)?1:3;}});return w.nextNode();}
  function dec(el){var a=el.getAttribute('data-count')||'';return a.indexOf('.')>=0?a.split('.')[1].length:0;}
  function fmt(v,d){return d?v.toFixed(d):String(Math.round(v));}
  window.j365Count=function(el,to){
    if(!el||isNaN(+to))return;
    var n=node(el),s=fmt(+to,dec(el));
    if(n)n.textContent=n.textContent.replace(/[\d.]+/,s);else el.textContent=s;
  };
})();
