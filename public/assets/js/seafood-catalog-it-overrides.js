(() => {
  'use strict';
  const map = {
    'Famille':'Categoria','Famiglia':'Categoria','Type':'Tipo','État':'Stato','Condition':'Condizione','Origine':'Origine','Zone FAO':'Zona FAO','Calibre':'Calibro','Qualité':'Qualità','Présentation':'Presentazione','Conditionnement':'Imballaggio','Disponibilité':'Disponibilità','Frais':'Fresco','Congelé':'Surgelato','références':'referenze','référence':'referenza','Aucune référence ne correspond à votre recherche.':'Nessuna referenza corrisponde alla ricerca.','Catalogue indisponible.':'Catalogo non disponibile.','Indisponible':'Non disponibile','Voir les images de':'Vedi immagini di','Image précédente':'Immagine precedente','Image suivante':'Immagine successiva','Fermer':'Chiudi','Rechercher':'Cerca'
  };
  const apply = () => {
    document.querySelectorAll('.seafood-catalog-card__detail span,.seafood-catalog-card__meta,.seafood-catalog-count,.seafood-catalog-empty').forEach(el => { let v=el.textContent.trim(); Object.entries(map).forEach(([a,b])=>{v=v.replaceAll(a,b)}); if(v!==el.textContent) el.textContent=v; });
    document.querySelectorAll('.seafood-catalog-card__detail strong').forEach(el => { let v=el.textContent; Object.entries(map).forEach(([a,b])=>{v=v.replaceAll(a,b)}); el.textContent=v; });
    const search=document.querySelector('.seafood-catalog-search'); if(search) search.placeholder='Cerca specie o prodotto...';
  };
  apply();
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
