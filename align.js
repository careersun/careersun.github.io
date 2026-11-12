/* 視覺對齊：以每區最大標題第一個字的視覺左緣為基準，其他行首文字往這條線靠（整段位移＋首字微調＋換行後首字微調） */
(function(){
  var S=4,cv=document.createElement('canvas'),cx=cv.getContext('2d'),cache={};
  var SKIP='header:not(.front),nav,.sticky,.skip,summary,button,.btn,.chip,.chips,table,svg,.hanko,script,style,noscript';
  /* 視覺左緣：該欄墨量達字級 10% 的第一欄（細撇、細點不算邊） */
  function bear(el,ch){
    var cs=getComputedStyle(el),k=cs.fontStyle+cs.fontWeight+cs.fontSize+cs.fontFamily+ch;
    if(k in cache)return cache[k];
    var fs=parseFloat(cs.fontSize),w=Math.ceil(fs*3*S),h=Math.ceil(fs*2*S);
    cv.width=w;cv.height=h;cx.font=cs.fontStyle+' '+cs.fontWeight+' '+(fs*S)+'px '+cs.fontFamily;
    cx.textBaseline='middle';cx.fillText(ch,fs*S,fs*S);
    var px=cx.getImageData(0,0,w,h).data,m=-1,T=0.1*fs*S*255;
    for(var x=0;x<w&&m<0;x++){var s=0;for(var y=0;y<h;y++)s+=px[(y*w+x)*4+3];if(s>=T)m=x;}
    return cache[k]=(m<0?0:(m-fs*S)/S);
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
  function firstChar(n){var i=n.textContent.search(/\S/);var r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);return {i:i,rc:r.getClientRects()[0]};}
  /* <br> 之後的每一行：找出行首文字節點 */
  function brLines(blk){
    var out=[],brs=blk.querySelectorAll('br');
    for(var i=0;i<brs.length;i++){
      var n=brs[i].nextSibling;
      while(n&&n.nodeType===3&&!/\S/.test(n.textContent))n=n.nextSibling;
      if(!n)continue;
      if(n.nodeType===1&&n.className==='al-c')n=n.firstChild;
      else if(n.nodeType===1){var w=document.createTreeWalker(n,4,{acceptNode:function(t){return /\S/.test(t.textContent)?1:2;}});n=w.nextNode();}
      if(n&&n.nodeType===3)out.push(n);
    }
    return out;
  }
  function run(){
    var done=document.querySelectorAll('[data-al]');
    for(var i=0;i<done.length;i++){var o=JSON.parse(done[i].getAttribute('data-al'));done[i].style.textIndent=o[0];done[i].style.paddingLeft=o[1];done[i].style.marginLeft=o[2];done[i].removeAttribute('data-al');}
    var cs0=document.querySelectorAll('span.al-c');for(i=0;i<cs0.length;i++)cs0[i].style.marginLeft='';
    var rows=[],tw=document.createTreeWalker(document.body,4,{acceptNode:function(n){return /\S/.test(n.textContent)?1:2;}}),n;
    while((n=tw.nextNode())){
      var el=n.parentElement;if(!el||el.closest(SKIP))continue;
      var li=el.closest('li');if(li&&getComputedStyle(li).listStyleType!=='none')continue;
      var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;
      var blk=blockOf(el);if(!blk||blk.__seen)continue;
      var bcs=getComputedStyle(blk);if(bcs.display!=='block'||bcs.textAlign==='center'||bcs.textAlign==='right')continue;
      var f=firstChar(n),rc=f.rc;if(!rc||!rc.width)continue;
      var bb=blk.getBoundingClientRect(),cl=bb.left+parseFloat(bcs.paddingLeft)+parseFloat(bcs.borderLeftWidth);
      var ti=parseFloat(bcs.textIndent)||0;
      if(Math.abs(rc.left-(cl+ti))>1.5)continue;
      blk.__seen=1;
      var lines=[];brLines(blk).forEach(function(t){var g=firstChar(t);if(g.rc&&Math.abs(g.rc.left-cl)<1.5)lines.push({n:t,i:g.i,ink:g.rc.left+bear(t.parentElement,t.textContent[g.i])});});
      rows.push({blk:blk,sec:secOf(blk),cl:cl,ink:rc.left+bear(el,n.textContent[f.i]),fs:parseFloat(cs.fontSize),top:rc.top,ti:ti,hd:!!blk.closest('h1,h2,h3'),lines:lines});
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
      var bs=g.items.filter(function(r){return r!==a;}).map(function(r){return r.ink-r.cl;}).sort(function(x,y){return x-y;});
      var typ=bs.length?bs[Math.floor((bs.length-1)/2)]:0;
      g.items.forEach(function(r){
        var d=ref-r.ink,db=r===a?0:ref-(r.cl+typ);
        if(Math.abs(db)<0.6||Math.abs(db)>5)db=0;
        var di=r===a?0:d-db;if(Math.abs(di)<0.6||Math.abs(d)>5)di=0;
        var st=r.blk.style;
        if(db||di){
          r.blk.setAttribute('data-al',JSON.stringify([st.textIndent,st.paddingLeft,st.marginLeft]));
          if(db){var bcs=getComputedStyle(r.blk);if(db>0)st.paddingLeft=(parseFloat(bcs.paddingLeft)+db).toFixed(2)+'px';else st.marginLeft=(parseFloat(bcs.marginLeft)+db).toFixed(2)+'px';}
          if(di)st.textIndent=(r.ti+di).toFixed(2)+'px';
        }
        var lref=r===a?r.ink:ref;
        r.lines.forEach(function(L){
          var dl=lref-L.ink-db;if(Math.abs(dl)<0.6||Math.abs(dl)>5)return;
          var t=L.n,sp=t.parentElement;
          if(!(sp&&sp.className==='al-c')){
            var c=t.splitText(L.i);var rest=c.splitText(1);sp=document.createElement('span');sp.className='al-c';c.parentNode.insertBefore(sp,c);sp.appendChild(c);
          }
          sp.style.marginLeft=dl.toFixed(2)+'px';
        });
      });
    });
  }
  var t;function later(){clearTimeout(t);t=setTimeout(run,150);}
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){run();setTimeout(run,800);});
  addEventListener('resize',later);
})();
