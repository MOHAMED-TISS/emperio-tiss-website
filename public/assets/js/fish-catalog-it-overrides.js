(() => {
  'use strict';
  const map = {
    'All':'Tutte','Fresh':'Fresco','Frozen':'Surgelato','All categories':'Tutte le categorie','White fish':'Pesce bianco','Blue fish':'Pesce azzurro','Special fish':'Pesci speciali',
    'Family':'Famiglia','Type':'Tipo','Condition':'Condizione','State':'Stato','Origin':'Origine','FAO area':'Zona FAO','Quality':'Qualità','Presentation':'Presentazione','Packaging':'Imballaggio','Availability':'Disponibilità','According to availability':'Secondo disponibilità','According to destination':'Secondo destinazione','According to market':'Secondo mercato','Professional specification':'Specifica professionale','EMBLEMATIC SELECTION':'SELEZIONE EMBLEMATICA','English-speaking market':'Mercato internazionale','references':'referenze','reference':'referenza','No references match your search.':'Nessuna referenza corrisponde alla ricerca.','View image':'Vedi immagine','Professional reference':'Referenza professionale','According to availability':'Secondo disponibilità'
  };
  const names = {
    'Sea bream':'Orata','Sea bass':'Spigola','Hake':'Nasello','Mullet':'Cefalo','Monkfish':'Rana pescatrice','John Dory':'San Pietro','Yellow grouper':'Cernia gialla','Snapper':'Dentice tropicale','Dentex':'Dentice','White seabream':'Sarago','Scorpionfish':'Scorfano','Mackerel':'Sgombro','Red mullet':'Triglia','Tuna':'Tonno','Salmon':'Salmone','Greater amberjack':'Ricciola','Anchovy':'Acciuga','Cutlassfish':'Pesce sciabola','Swordfish':'Pesce spada'
  };
  const apply = () => {
    document.querySelectorAll('.fish-catalog__filter').forEach(el => { const v = el.textContent.trim(); if (map[v]) el.textContent = map[v]; });
    document.querySelectorAll('.fish-catalog__detail span,.fish-emblematic-card__kicker,.fish-emblematic-card__mark').forEach(el => { const v = el.textContent.trim(); if (map[v]) el.textContent = map[v]; });
    document.querySelectorAll('.fish-catalog-card__title,.fish-emblematic-card h3').forEach(el => { const v = el.textContent.trim(); if (names[v]) el.textContent = names[v]; });
    const count = document.getElementById('fishCatalogCount'); if (count && /reference/i.test(count.textContent)) count.textContent = count.textContent.replace(/references?/i, 'referenze').replace(/reference/i,'referenza');
    document.querySelectorAll('.fish-catalog-card__details strong,.fish-emblematic-card__note').forEach(el => { let v = el.textContent; Object.entries(map).forEach(([a,b]) => { v = v.replaceAll(a,b); }); el.textContent = v; });
  };
  apply();
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
