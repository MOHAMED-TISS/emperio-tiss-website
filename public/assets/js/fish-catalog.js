(() => {
  'use strict';

  const products = [
    ['dorada','Dorada','Sparus aurata','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / según disponibilidad','FAO 37'],
    ['lubina','Lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['merluza-pijota','Merluza / Pijota','Merluccius spp.','Pez de escama','Blanco / semigraso','Fresco / Congelado','Según programa de suministro','Según origen'],
    ['mujol','Mújol','Mugil cephalus','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / según disponibilidad','FAO 37 según origen'],
    ['rape','Rape','Lophius spp.','Pez de escama','Blanco / semigraso','Fresco / Congelado','Atlántico / Mediterráneo según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['san-pedro','San Pedro','Zeus faber','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['mero-amarillo','Mero amarillo','Epinephelus spp.','Pez de escama','Blanco / semigraso','Fresco / Congelado','Según origen disponible','Según origen'],
    ['pargo','Pargo','Lutjanus spp.','Pez de escama','Blanco / semigraso','Fresco / Congelado','Según programa de suministro','Según origen'],
    ['denton','Dentón','Dentex dentex','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / según disponibilidad','FAO 37'],
    ['sama','Sama','Dentex spp.','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / según disponibilidad','FAO 37'],
    ['sargo','Sargo','Diplodus spp.','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / Atlántico según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['rascacio','Rascacio','Scorpaena spp.','Pez de escama','Blanco / semigraso','Fresco','Mediterráneo / según disponibilidad','FAO 37'],
    ['caballa','Caballa','Scomber spp.','Pez de escama','Azul / graso','Fresco / Congelado','Atlántico / Mediterráneo según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['salmonete','Salmonete','Mullus spp.','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['atun','Atún','Thunnus spp.','Pez de escama','Azul / graso','Fresco / Congelado','Según especie y programa de suministro','Según origen'],
    ['pez-limon','Pez limón','Seriola dumerili','Pez de escama','Azul / graso','Fresco','Mediterráneo / según disponibilidad','FAO 37'],
    ['boqueron','Boquerón','Engraulis encrasicolus','Pez de escama','Azul / graso','Fresco','Mediterráneo / Atlántico según disponibilidad','FAO 27 / FAO 37 según origen'],
    ['pez-sable','Pez sable','Trichiurus spp.','Pescados especiales','Especial','Fresco / Congelado','Según programa de suministro','Según origen'],
    ['pez-espada','Pez espada','Xiphias gladius','Pescados especiales','Especial','Fresco / Congelado','Según programa de suministro','Según origen']
  ].map(([id,commercialName,scientificName,group,type,condition,origin,faoZone]) => ({id,commercialName,scientificName,group,type,condition,origin,faoZone}));

  const grid = document.getElementById('fishCatalogGrid');
  const search = document.getElementById('fishCatalogSearch');
  const count = document.getElementById('fishCatalogCount');
  if (!grid || !search || !count) return;

  const filters = Array.from(document.querySelectorAll('[data-fish-filter]'));
  let activeFilter = 'all';

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const conditions = value => String(value || '').split('/').map(item => item.trim().toLowerCase()).filter(Boolean);
  const detail = (label,value) => `<div class="fish-catalog-card__detail"><span>${label}</span><strong>${esc(value)}</strong></div>`;

  const card = product => `<article class="fish-catalog-card" data-product-id="${esc(product.id)}">
    <div class="fish-catalog-card__media"><span class="fish-catalog-card__placeholder">EMPERIO TISS</span></div>
    <div class="fish-catalog-card__body">
      <p class="fish-catalog-card__meta">${esc(product.group)}</p>
      <h3 class="fish-catalog-card__title">${esc(product.commercialName)}</h3>
      <p class="fish-catalog-card__scientific"><em>${esc(product.scientificName)}</em></p>
      <div class="fish-catalog-card__details">
        ${detail('Familia',product.group)}
        ${detail('Tipo',product.type)}
        ${detail('Estado',product.condition)}
        ${detail('Origen',product.origin)}
        ${detail('Zona FAO',product.faoZone)}
        ${detail('Calibre','Según disponibilidad')}
        ${detail('Calidad','Especificación profesional')}
        ${detail('Presentación','Según destino')}
        ${detail('Embalaje','Según mercado')}
        ${detail('Disponibilidad','Según disponibilidad')}
      </div>
    </div>
  </article>`;

  function render() {
    const query = String(search.value || '').trim().toLowerCase();
    const visible = products.filter(product => {
      const productConditions = conditions(product.condition);
      const matchesFilter = activeFilter === 'all' || productConditions.includes(activeFilter);
      const haystack = [product.commercialName,product.scientificName,product.group,product.type,product.origin,product.faoZone].join(' ').toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });
    count.textContent = `${visible.length} ${visible.length === 1 ? 'referencia' : 'referencias'}`;
    grid.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('p');
      empty.className = 'fish-catalog__empty';
      empty.textContent = 'No hay referencias que coincidan con la búsqueda.';
      grid.appendChild(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    const template = document.createElement('template');
    visible.forEach(product => {
      template.innerHTML = card(product).trim();
      fragment.appendChild(template.content.firstElementChild);
    });
    grid.appendChild(fragment);
  }

  filters.forEach(button => {
    button.type = 'button';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const nextFilter = button.dataset.fishFilter || 'all';
      activeFilter = nextFilter === 'fresh' || nextFilter === 'frozen' ? nextFilter : 'all';
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      window.requestAnimationFrame(render);
    });
  });

  search.addEventListener('input', render);
  render();
})();