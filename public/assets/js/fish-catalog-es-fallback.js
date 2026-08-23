(() => {
  'use strict';
  const fallback = [
    ['dorada','Dorada','Sparus aurata','Pez de escama','Blanco / semigraso','fresh'],
    ['lubina','Lubina','Dicentrarchus labrax','Pez de escama','Blanco / semigraso','fresh'],
    ['merluza-pijota','Merluza / Pijota','Merluccius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],
    ['mujol','Mújol','Mugil cephalus','Pez de escama','Blanco / semigraso','fresh'],
    ['rape','Rape','Lophius spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],
    ['san-pedro','San Pedro','Zeus faber','Pez de escama','Blanco / semigraso','fresh'],
    ['mero-amarillo','Mero amarillo','Epinephelus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],
    ['pargo','Pargo','Lutjanus spp.','Pez de escama','Blanco / semigraso','fresh|frozen'],
    ['denton','Dentón','Dentex dentex','Pez de escama','Blanco / semigraso','fresh'],
    ['sama','Sama','Dentex spp.','Pez de escama','Blanco / semigraso','fresh'],
    ['sargo','Sargo','Diplodus spp.','Pez de escama','Blanco / semigraso','fresh'],
    ['rascacio','Rascacio','Scorpaena spp.','Pez de escama','Blanco / semigraso','fresh'],
    ['caballa','Caballa','Scomber spp.','Pez de escama','Azul / graso','fresh|frozen'],
    ['salmonete','Salmonete','Mullus spp.','Pez de escama','Azul / graso','fresh'],
    ['atun','Atún','Thunnus spp.','Pez de escama','Azul / graso','fresh|frozen'],
    ['pez-limon','Pez limón','Seriola dumerili','Pez de escama','Azul / graso','fresh'],
    ['boqueron','Boquerón','Engraulis encrasicolus','Pez de escama','Azul / graso','fresh'],
    ['pez-sable','Pez sable','Trichiurus spp.','Pescados especiales','Especial','fresh|frozen'],
    ['pez-espada','Pez espada','Xiphias gladius','Pescados especiales','Especial','fresh|frozen']
  ].map(([id, commercialName, scientificName, group, type, condition]) => ({
    id, commercialName, scientificName, group, type,
    condition: condition.split('|'),
    origin: ['Según disponibilidad'],
    faoZone: ['Según origen'],
    calibre: ['Según disponibilidad'],
    quality: ['Especificación profesional'],
    format: ['Según destino'],
    packaging: ['Según mercado'],
    availability: ['Según disponibilidad']
  }));
  const originalFetch = window.fetch.bind(window);
  window.fetch = (...args) => originalFetch(...args).then(response => {
    if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json') && !response.ok) {
      return new Response(JSON.stringify({ schemaVersion: '1.0', language: 'es', products: fallback }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return response;
  }).catch(error => {
    if (String(args[0] || '').includes('/assets/data/fish-catalog-es.json')) {
      return new Response(JSON.stringify({ schemaVersion: '1.0', language: 'es', products: fallback }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    throw error;
  });
})();
