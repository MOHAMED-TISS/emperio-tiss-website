(() => {
  'use strict';

  const body = document.body;
  if (!body?.classList.contains('liquid-header-v23')) return;

  const header = document.querySelector('.site-header');
  const inner = header?.querySelector('.header-inner');
  if (!header || !inner) return;

  const logo = inner.querySelector('.site-logo');
  if (logo) {
    logo.setAttribute('aria-label','EMPERIO TISS S.L.');
    logo.innerHTML = '<img src="/assets/images/emperio-tiss-emblem.svg" alt="EMPERIO TISS">';
  }

  const primary = inner.querySelector('.home-header-nav');
  if (primary) {
    primary.innerHTML = '<a href="/about/">Empresa</a><a href="/products/">Productos</a><a href="/markets/">Mercados</a><a href="/news/">Noticias</a>';
  }

  let center = inner.querySelector('.liquid-center-cluster');
  if (!center) {
    center = document.createElement('div');
    center.className = 'liquid-center-cluster';
    inner.appendChild(center);
  }
  if (primary) center.appendChild(primary);

  let tools = inner.querySelector('.liquid-tools');
  if (!tools) {
    tools = document.createElement('div');
    tools.className = 'liquid-tools';

    const lang = document.createElement('span');
    lang.className = 'liquid-lang';
    lang.textContent = 'ES';

    const theme = document.createElement('button');
    theme.className = 'liquid-theme';
    theme.type = 'button';
    theme.setAttribute('aria-label','Cambiar modo claro u oscuro');

    const signature = document.createElement('a');
    signature.className = 'liquid-signature';
    signature.href = '/news/#emperio-private';
    signature.textContent = 'Signature';

    const contact = document.createElement('a');
    contact.className = 'liquid-contact';
    contact.href = '/contact/';
    contact.textContent = 'Contacto';

    const ctas = document.createElement('div');
    ctas.className = 'liquid-cta-cluster';
    ctas.append(signature,contact);

    tools.append(lang,theme,ctas);
    inner.appendChild(tools);

    const iconSun = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>';
    const iconMoon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.6A8.5 8.5 0 0 1 8.4 3.6 8.6 8.6 0 1 0 20.4 15.6Z"/></svg>';

    const applyTheme = (mode) => {
      const next = mode === 'light' ? 'light' : 'dark';
      body.dataset.liquidTheme = next;
      theme.setAttribute('aria-pressed',next === 'light' ? 'true' : 'false');
      theme.innerHTML = next === 'light' ? iconMoon : iconSun;
      try { localStorage.setItem('emperio-liquid-theme',next); } catch (_) {}
    };

    let initial = 'dark';
    try {
      const saved = localStorage.getItem('emperio-liquid-theme');
      if (saved === 'light' || saved === 'dark') initial = saved;
    } catch (_) {}
    applyTheme(initial);

    theme.addEventListener('click',() => {
      applyTheme(body.dataset.liquidTheme === 'dark' ? 'light' : 'dark');
    });
  }

  let target = 0;
  let current = 0;
  let raf = 0;

  const readTarget = () => {
    if (window.matchMedia('(max-width: 980px)').matches) return 0;
    return Math.min(1,Math.max(0,window.scrollY / 520));
  };

  const render = () => {
    const delta = target - current;
    current += delta * .105;

    const vw = window.innerWidth;
    const endWidth = vw >= 1500 ? 62 : vw >= 1280 ? 66 : vw >= 1050 ? 72 : 78;
    const width = 100 - ((100 - endWidth) * current);
    const height = 88 - (26 * current);
    const blur = 34 + (10 * current);
    const pad = 44 - (12 * current);

    inner.style.setProperty('--lh-p',current.toFixed(4));
    inner.style.setProperty('--lh-width',width.toFixed(3) + '%');
    inner.style.setProperty('--lh-height',height.toFixed(2) + 'px');
    inner.style.setProperty('--lh-blur',blur.toFixed(1) + 'px');
    inner.style.setProperty('--lh-pad',pad.toFixed(1) + 'px');

    if (Math.abs(delta) > .0007) raf = requestAnimationFrame(render);
    else raf = 0;
  };

  const update = () => {
    target = readTarget();
    if (!raf) raf = requestAnimationFrame(render);
  };

  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
})();