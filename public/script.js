/* EMPERIO TISS — approved product-supply positioning, legacy compatibility and global interaction layer. */
(function(){'use strict';
function initCursor(){
  if(!window.matchMedia||window.matchMedia('(hover:none),(pointer:coarse)').matches||document.querySelector('.et-pointer'))return;
  var p=document.createElement('div');
  p.className='et-pointer';
  p.setAttribute('aria-hidden','true');
  document.body.appendChild(p);
  document.documentElement.classList.add('et-pointer-ready');
  var x=-100,y=-100,tx=-100,ty=-100,raf=0;
  function render(){
    tx+=(x-tx)*.22; ty+=(y-ty)*.22;
    p.style.left=tx+'px'; p.style.top=ty+'px';
    raf=requestAnimationFrame(render);
  }
  window.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(render)},{passive:true});
  document.addEventListener('mouseover',function(e){if(e.target.closest('a,button,[role="button"],input,select,textarea,.fv-product-main,.fv-product-small,.products-world,.button,.fv-cta-button'))p.classList.add('is-hover');});
  document.addEventListener('mouseout',function(e){if(e.target.closest('a,button,[role="button"],input,select,textarea,.fv-product-main,.fv-product-small,.products-world,.button,.fv-cta-button'))p.classList.remove('is-hover');});
  window.addEventListener('mousedown',function(){p.classList.add('is-down')});
  window.addEventListener('mouseup',function(){p.classList.remove('is-down')});
  window.addEventListener('blur',function(){p.style.opacity='0'});
  window.addEventListener('focus',function(){p.style.opacity='1'});
}
function applyContentReplacements(){
  var lang=(document.documentElement.lang||'es').toLowerCase().slice(0,2),replacements=[];
  if(lang==='en') replacements=[
    [/connects products, producers and buyers/gi,'supplies selected food products to professional buyers'],[/connect products, producers and buyers/gi,'supply selected food products to professional buyers'],[/connects products, suppliers and buyers/gi,'supplies selected food products to professional buyers'],[/connect products, suppliers and buyers/gi,'supply selected food products to professional buyers'],[/we connect producers and buyers/gi,'we supply selected products to professional buyers'],[/connect producers and buyers/gi,'supply selected products to professional buyers'],[/connecting producers and buyers/gi,'supplying selected products to professional buyers'],[/connect buyers with suppliers/gi,'supply products to professional buyers'],[/connect suppliers with buyers/gi,'supply products to professional buyers'],[/sourcing and distribution/gi,'product selection and supply'],[/sourcing services?/gi,'product supply'],[/sourcing solutions?/gi,'product supply solutions'],[/sourcing partners?/gi,'product supply'],[/marketplace/gi,'product supply'],[/broker(?:age)?/gi,'product supply'],[/intermediary/gi,'product supplier'],[/commercial intermediation/gi,'direct product supply'],[/trade facilitation/gi,'product supply'],[/trading/gi,'product supply'],[/international trade/gi,'international product supply'],[/commercial relations/gi,'professional supply relationships'],[/commercial opportunities/gi,'product availability'],[/search for products/gi,'product selection'],[/research/gi,'product selection'],[/we adapt the search to the client[^.]*\./gi,'We select products according to origin, seasonality, availability, specifications and destination'],[/\bVegetables?\b/g,'Produce']
  ];
  else replacements=[
    [/conecta productos, productores y compradores/gi,'suministra productos seleccionados a compradores profesionales'],[/conectar productos, productores y compradores/gi,'suministrar productos seleccionados a compradores profesionales'],[/conecta productos, proveedores y compradores/gi,'suministra productos seleccionados a compradores profesionales'],[/conectar productos, proveedores y compradores/gi,'suministrar productos seleccionados a compradores profesionales'],[/conecta productores y compradores/gi,'suministra productos seleccionados a compradores profesionales'],[/conectar productores y compradores/gi,'suministrar productos seleccionados a compradores profesionales'],[/conectando productores y compradores/gi,'suministrando productos seleccionados a compradores profesionales'],[/conectar compradores con proveedores/gi,'suministrar productos a compradores profesionales'],[/conectar proveedores con compradores/gi,'suministrar productos a compradores profesionales'],[/aprovisionamiento y distribución/gi,'selección y suministro de productos'],[/servicios de abastecimiento/gi,'suministro de productos'],[/servicios de sourcing/gi,'suministro de productos'],[/soluciones de sourcing/gi,'soluciones de suministro de productos'],[/marketplace/gi,'suministro de productos'],[/intermediari[oa]s?/gi,'proveedor de productos'],[/intermediación comercial/gi,'suministro directo de productos'],[/facilitación comercial/gi,'suministro de productos'],[/\btrading\b/gi,'suministro de productos'],[/comercio internacional/gi,'suministro internacional de productos'],[/relaciones comerciales/gi,'relaciones profesionales de suministro'],[/oportunidades comerciales/gi,'disponibilidad de productos'],[/búsqueda de productos/gi,'selección de productos'],[/buscamos productos/gi,'seleccionamos productos'],[/adaptamos la búsqueda a las exigencias del cliente y al ritmo real de la campaña\.?/gi,'Seleccionamos los productos según su origen, estacionalidad, disponibilidad, especificaciones y destino.']
  ];
  replacements.push([/\bverduras?\b/gi,'hortalizas'],[/\btrade\b/gi,lang==='es'?'suministro de productos':'product supply']);
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(function(n){if(!n.nodeValue.trim()||n.parentElement&&['SCRIPT','STYLE'].indexOf(n.parentElement.tagName)>-1)return;var v=n.nodeValue;replacements.forEach(function(r){v=v.replace(r[0],r[1]);});if(v!==n.nodeValue)n.nodeValue=v;});
  if(lang==='en'){
    if(document.title)document.title=document.title.replace(/Vegetables?/gi,'Produce');
    document.querySelectorAll('meta[name="description"]').forEach(function(m){if(m.content)m.content=m.content.replace(/Vegetables?/gi,'Produce')});
  }
}
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.nav-overlay-links').forEach(function(nav){
    var seen={}; Array.from(nav.children).forEach(function(a){
      if(a.tagName!=='A')return;
      var key=(a.getAttribute('href')||'').replace(/\/$/,'')+'|'+a.textContent.replace(/\s+/g,' ').trim().toLowerCase();
      if(seen[key])a.remove(); else seen[key]=true;
    });
  });
  applyContentReplacements();
  initCursor();
});
})();
