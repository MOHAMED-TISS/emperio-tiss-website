(function(){'use strict';
window.EMPERIO_TISS_PRODUCT_CARD=function(product){
 if(!product)return '';
 const condition=(product.condition||[]).join(' · ');
 const meta=[condition,product.origin&&product.origin[0],product.calibre&&product.calibre[0]].filter(Boolean).join(' · ');
 const href='/products/product.html?id='+encodeURIComponent(product.id);
 return '<article class="product-card" data-product-id="'+product.id+'"><div class="product-card-media">'+(product.image?'<img src="'+product.image+'" alt="'+product.commercialName+'" loading="lazy">':'<span>EMPERIO TISS</span>')+'</div><div class="product-card-body"><p class="product-card-category">'+product.subcategory.replace(/-/g,' ')+'</p><h3>'+product.commercialName+'</h3><p class="product-card-scientific">'+product.scientificName+'</p><p class="product-card-meta">'+meta+'</p><a href="'+href+'">Ver ficha <span>•</span></a></div></article>';
};})();