/* 數字跳動：第一屏看得到的從 8 成跳到目標（短、不影響速度分數），其他捲到才從 0 跳 */
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,io='IntersectionObserver' in window;
  function node(el){var w=document.createTreeWalker(el,4,{acceptNode:function(n){return /\d/.test(n.textContent)?1:3;}});return w.nextNode();}
  function dec(el){var a=el.getAttribute('data-count')||'';return a.indexOf('.')>=0?a.split('.')[1].length:0;}
  function fmt(v,d){return d?v.toFixed(d):String(Math.round(v));}
  function set(el,v){var n=node(el),s=fmt(v,dec(el));if(n)n.textContent=n.textContent.replace(/[\d.]+/,s);else el.textContent=s;}
  function cur(el){var n=node(el);return n?parseFloat(n.textContent.replace(/[^\d.]/g,''))||0:0;}
  function run(el,from,to){
    cancelAnimationFrame(el._raf);var s=performance.now(),D=900;
    (function step(t){var p=Math.min(1,(t-s)/D);set(el,from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)el._raf=requestAnimationFrame(step);})(s);
  }
  window.j365Count=function(el,to){
    if(!el)return;to=+to;el._to=to;
    if(reduce||!io){set(el,to);return;}
    if(el._wait)return;
    if(el._go){run(el,cur(el),to);return;}
    el._go=1;
    var r=el.getBoundingClientRect();
    if(r.bottom>0&&r.top<innerHeight){var f=to*0.8;set(el,f);run(el,f,to);return;}
    el._wait=1;set(el,0);
    var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();el._wait=0;run(el,0,el._to);}},{threshold:.4});
    o.observe(el);
  };
  var els=document.querySelectorAll('[data-count]');
  for(var i=0;i<els.length;i++)window.j365Count(els[i],parseFloat(els[i].getAttribute('data-count')));
})();
