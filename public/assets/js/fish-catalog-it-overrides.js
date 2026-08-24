(() => {
  'use strict';

  const map = {
    'All':'Tutte','Fresh':'Fresco','Frozen':'Surgelato','All categories':'Tutte le categorie','White fish':'Pesce bianco','Blue fish':'Pesce azzurro','Special fish':'Pesci speciali',
    'Family':'Famiglia','Type':'Tipo','Condition':'Condizione','State':'Stato','Origin':'Origine','FAO area':'Zona FAO','Quality':'Qualità','Presentation':'Presentazione','Packaging':'Imballaggio','Availability':'Disponibilità','According to availability':'Secondo disponibilità','According to destination':'Secondo destinazione','According to market':'Secondo mercato','Professional specification':'Specifica professionale','EMBLEMATIC SELECTION':'SELEZIONE EMBLEMATICA','English-speaking market':'Mercato internazionale','references':'referenze','reference':'referenza','No references match your search.':'Nessuna referenza corrisponde alla ricerca.','View image':'Vedi immagine','Professional reference':'Referenza professionale'
  };

  const names = {
    'Sea bream':'Orata','Sea bass':'Spigola','Hake':'Nasello','Mullet':'Cefalo','Monkfish':'Rana pescatrice','John Dory':'San Pietro','Yellow grouper':'Cernia gialla','Snapper':'Dentice tropicale','Dentex':'Dentice','White seabream':'Sarago','Scorpionfish':'Scorfano','Mackerel':'Sgombro','Red mullet':'Triglia','Tuna':'Tonno','Salmon':'Salmone','Greater amberjack':'Ricciola','Anchovy':'Acciuga','Cutlassfish':'Pesce sciabola','Swordfish':'Pesce spada'
  };

  const replaceText = (node, replacements) => {
    const before = node.textContent;
    let after = before;
    replacements.forEach(([from, to]) => { after = after.replaceAll(from, to); });
    if (after !== before) node.textContent = after;
  };

  const apply = () => {
    const root = document.body;
    if (!root) return;

    root.querySelectorAll('.fish-catalog__filter').forEach(el => {
      const v = el.textContent.trim();
      if (map[v] && map[v] !== v) el.textContent = map[v];
    });
    root.querySelectorAll('.fish-catalog__detail span,.fish-emblematic-card__kicker,.fish-emblematic-card__mark').forEach(el => {
      const v = el.textContent.trim();
      if (map[v] && map[v] !== v) el.textContent = map[v];
    });
    root.querySelectorAll('.fish-catalog-card__title,.fish-emblematic-card h3').forEach(el => {
      const v = el.textContent.trim();
      if (names[v] && names[v] !== v) el.textContent = names[v];
    });
    root.querySelectorAll('.fish-catalog-card__details strong,.fish-emblematic-card__note').forEach(el => {
      replaceText(el, Object.entries(map));
    });
    const count = document.getElementById('fishCatalogCount');
    if (count) replaceText(count, [['references','referenze'],['reference','referenza']]);
  };

  const hasCards = () => !!document.querySelector('.fish-catalog-card,.fish-emblematic-card');
  if (hasCards()) {
    apply();
    return;
  }

  const observer = new MutationObserver(() => {
    if (!hasCards()) return;
    observer.disconnect();
    apply();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();