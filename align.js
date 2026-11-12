/* 視覺對齊：以每區最大字級標題第一個字的筆畫左緣為基準，其他行首文字用 text-indent 微調 */
(function(){
  var cv=document.createElement('canvas'),cx=cv.getContext('2d'),cache={};
  var SKIP='header:not(.front),nav,.sticky,.skip,summary,button,.btn,.chip,.chips,table,svg,.hanko,script,style,noscript';
  function bear(el,ch){
    var cs=getComputedStyle(el),k=cs.fontStyle+cs.fontWeight+cs.fontSize+cs.fontFamily+ch;
    if(k in cache)return cache[k];
    var fs=parseFloat(cs.fontSize),w=Math.ceil(fs*3),h=Math.ceil(fs*2);
    cv.width=w;cv.height=h;cx.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;
    cx.textBaseline='middle';cx.fillText(ch,fs,fs);
    var px=cx.getImageData(0,0,w,h).data,m=-1;
    for(var x=0;x<w&&m<0;x++)for(var y=0;y<h;y++)if(px[(y*w+x)*4+3]>80){m=x;break;}
    return cache[k]=(m<0?0:m-fs);
  }
  function blockOf(el){
    while(el&&el!==document.body){var d=getComputedStyle(el).display;if(d==='block'||d==='list-item'||d==='flex'||d==='grid'||d==='inline-block'||d==='table-cell')return el;el=el.parentElement;}
    return null;
  }
  function secOf(e){
    for(e=e.parentElement;e&&e!==document.body;e=e.parentElement){
      if(/^(SECTION|ARTICLE|FOOTER|MAIN|ASIDE)$/.test(e.tagName))return e;
      var p=e.parentElement;if(p===document.body||(p&&p.tagName==='MAIN'))return e;
      var c=getComputedStyle(e);
      if((c.backgroundColor!=='rgba(0, 0, 0, 0)'&&c.backgroundColor!=='transparent')||c.backgroundImage!=='none'||c.boxShadow!=='none'||parseFloat(c.borderLeftWidth)>0)return e;
    }
    return document.body;
  }
  function run(){
    var done=document.querySelectorAll('[data-al]');
    for(var i=0;i<done.length;i++){done[i].style.textIndent=done[i].getAttribute('data-al');done[i].removeAttribute('data-al');}
    var rows=[],tw=document.createTreeWalker(document.body,4,{acceptNode:function(n){return /\S/.test(n.textContent)?1:2;}}),n;
    while((n=tw.nextNode())){
      var el=n.parentElement;if(!el||el.closest(SKIP))continue;
      var li=el.closest('li');if(li&&getComputedStyle(li).listStyleType!=='none')continue;
      var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;
      var blk=blockOf(el);if(!blk||blk.__seen)continue;
      var bcs=getComputedStyle(blk);if(bcs.display!=='block'||bcs.textAlign==='center'||bcs.textAlign==='right')continue;
      var idx=n.textContent.search(/\S/),r=document.createRange();r.setStart(n,idx);r.setEnd(n,idx+1);
      var rc=r.getClientRects()[0];if(!rc||!rc.width)continue;
      var bb=blk.getBoundingClientRect(),cl=bb.left+parseFloat(bcs.paddingLeft)+parseFloat(bcs.borderLeftWidth);
      var ti=parseFloat(bcs.textIndent)||0;
      if(Math.abs(rc.left-(cl+ti))>1.5)continue;
      blk.__seen=1;
      var sec=secOf(blk);
      rows.push({blk:blk,sec:sec,cl:cl,ink:rc.left+bear(el,n.textContent[idx]),fs:parseFloat(cs.fontSize),top:rc.top,ti:ti,hd:!!blk.closest('h1,h2,h3')});
    }
    rows.forEach(function(r){r.blk.__seen=0;});
    var groups=[];
    rows.forEach(function(r){
      var g=null;for(var i=0;i<groups.length;i++)if(groups[i].sec===r.sec&&Math.abs(groups[i].cl-r.cl)<1.5){g=groups[i];break;}
      if(!g){g={sec:r.sec,cl:r.cl,items:[]};groups.push(g);}g.items.push(r);
    });
    groups.forEach(function(g){
      var a=null;g.items.forEach(function(r){if(r.hd&&(!a||r.fs>a.fs+0.5||(Math.abs(r.fs-a.fs)<=0.5&&r.top<a.top)))a=r;});
      var ref;
      if(a&&a.fs>=20)ref=a.ink;
      else{if(g.items.length<2)return;var b=g.items.filter(function(r){return !r.hd;});if(!b.length)b=g.items;var v=b.map(function(r){return r.ink;}).sort(function(x,y){return x-y;});ref=v[Math.floor((v.length-1)/2)];a=null;}
      g.items.forEach(function(r){
        if(r===a)return;var d=ref-r.ink;
        if(Math.abs(d)<0.8||Math.abs(d)>5)return;
        r.blk.setAttribute('data-al',r.blk.style.textIndent||'');
        r.blk.style.textIndent=(r.ti+d).toFixed(2)+'px';
      });
    });
  }
  var t;function later(){clearTimeout(t);t=setTimeout(run,150);}
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){run();setTimeout(run,800);});
  addEventListener('resize',later);
})();
