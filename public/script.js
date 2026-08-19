/* EMPERIO TISS — legacy page-content compatibility only.
   Global navigation/header is handled exclusively by luxury-nav.js. */
(function(){'use strict';
document.addEventListener('DOMContentLoaded',function(){
  /* Prevent legacy duplicated navigation items on the Home templates. */
  document.querySelectorAll('.nav-overlay-links').forEach(function(nav){
    var seen={};
    Array.from(nav.children).forEach(function(a){
      if(a.tagName!=='A')return;
      var key=(a.getAttribute('href')||'').replace(/\/$/,'')+'|'+a.textContent.replace(/\s+/g,' ').trim().toLowerCase();
      if(seen[key])a.remove(); else seen[key]=true;
    });
  });

  /* Keep approved EMPERIO TISS positioning language consistent on legacy Home copy. */
  var replacements=[
    [/del origen al mercado\.?/gi,'Food moves. Markets connect.'],
    [/from origin to market\. with purpose\.?/gi,'Food moves. Markets connect.'],
    [/comercio internacional/gi,'operaciones internacionales'],
    [/relaciones comerciales/gi,'relaciones profesionales'],
    [/conecta productos, productores y compradores/gi,'ofrece productos seleccionados y soluciones profesionales'],
    [/conectar productos, productores y compradores/gi,'ofrecer productos seleccionados y soluciones profesionales'],
    [/\btrading\b/gi,'operations'],
    [/\btrade\b/gi,'operations']
  ];
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(function(n){
    if(!n.nodeValue.trim()||n.parentElement&&['SCRIPT','STYLE'].indexOf(n.parentElement.tagName)>-1)return;
    var v=n.nodeValue;replacements.forEach(function(r){v=v.replace(r[0],r[1])});if(v!==n.nodeValue)n.nodeValue=v;
  });
});
})();
