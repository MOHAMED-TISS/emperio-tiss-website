(() => {
  'use strict';

  const page = document.querySelector('.home-page');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = window.matchMedia('(min-width: 901px)');
  const connection = navigator.connection;

  // One restrained entrance per scene; no card staggering or scroll rails.
  const revealNodes = page.querySelectorAll(
    '.intro-section > .container, .products-section > .container, .markets-section > .container, .company-section > .container, .contact-section .contact-inner'
  );

  revealNodes.forEach((node) => node.classList.add('home-reveal'));

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -6% 0px' });

    revealNodes.forEach((node) => observer.observe(node));
  }

  // Desktop-only ambient hero video. Mobile and reduced-motion use the poster.
  const hero = page.querySelector('.hero');
  const video = page.querySelector('.home-hero-video');
  const toggle = page.querySelector('.home-video-toggle');

  if (!hero || !video || !toggle) return;

  let userPaused = false;
  let inView = true;

  const allowed = () =>
    desktopMotion.matches &&
    !reduceMotion.matches &&
    !connection?.saveData;

  const syncLabel = () => {
    const paused = video.paused;
    toggle.textContent = paused ? 'Reproducir vídeo' : 'Pausar vídeo';
    toggle.setAttribute('aria-label', paused ? 'Reproducir vídeo de fondo' : 'Pausar vídeo de fondo');
  };

  const updateVideo = () => {
    if (!allowed()) {
      video.pause();
      toggle.hidden = true;
      return;
    }

    toggle.hidden = false;

    if (userPaused || !inView || document.hidden) {
      video.pause();
      return;
    }

    if (!video.getAttribute('src')) {
      video.src = video.dataset.desktopSrc;
    }

    video.muted = true;
    video.play().catch(syncLabel);
  };

  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      updateVideo();
    } else {
      userPaused = true;
      video.pause();
    }
  });

  video.addEventListener('play', syncLabel);
  video.addEventListener('pause', syncLabel);
  video.addEventListener('error', () => {
    toggle.hidden = true;
    video.removeAttribute('src');
    video.load();
  });

  reduceMotion.addEventListener('change', updateVideo);
  desktopMotion.addEventListener('change', updateVideo);
  connection?.addEventListener('change', updateVideo);
  document.addEventListener('visibilitychange', updateVideo);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      updateVideo();
    }, { threshold: 0 }).observe(hero);
  } else {
    updateVideo();
  }
})();

/* Localized interactive product selection; static content remains usable without JS. */
(() => {
const experienceRoot=document.querySelector(".home-experience .et-experience");
if(!experienceRoot)return;
const localizedScenes=document.getElementById('home-scenes');
const locale=document.documentElement.lang.slice(0,2);
const base=locale==='es'?'/':'/'+locale+'/';
const scenes=localizedScenes?JSON.parse(localizedScenes.textContent):{sea:{label:'PRODUCTOS DEL MAR',description:'Pescados, mariscos y cefalópodos.\nEspecie, origen y presentación definidos\npara su necesidad profesional.',url:'seafood',count:'01 / 03'},fruit:{label:'FRUTAS',description:'Variedad, calibre y maduración.\nSeleccionamos según origen, temporada\ny necesidades de su mercado.',url:'fruits',count:'02 / 03'},vegetable:{label:'HORTALIZAS',description:'Calidad de origen y formatos definidos.\nUna selección adaptada a su volumen\ny destino profesional.',url:'vegetables',count:'03 / 03'}};
const tabs=[...experienceRoot.querySelectorAll('[role=tab]')];
function selectCategory(tab){const key=tab.dataset.category;const data=scenes[key];tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});experienceRoot.querySelectorAll('.scene-image').forEach(i=>i.classList.toggle('active',i.dataset.scene===key));experienceRoot.querySelector('#product-label').textContent=data.label;experienceRoot.querySelector('#product-description').replaceChildren(...data.description.split('\n').flatMap((line,i)=>i?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));experienceRoot.querySelector('#product-link').href=base+'products/'+data.url+'/';experienceRoot.querySelector('#scene-count').textContent=data.count;experienceRoot.querySelector('#product-panel').setAttribute('aria-labelledby',tab.id)}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectCategory(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();selectCategory(tabs[next])})});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){experienceRoot.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});experienceRoot.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

})();
