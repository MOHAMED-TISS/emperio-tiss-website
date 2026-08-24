(() => {
  'use strict';
  const doc = document;

  const style = doc.createElement('style');
  style.textContent = `
    .site-header .et-language-switch,
    .site-header .language-nav{
      position:relative!important;top:auto!important;right:auto!important;inset:auto!important;transform:none!important;
      display:flex!important;align-items:center!important;justify-content:center!important;flex-direction:column!important;
      width:52px!important;min-width:52px!important;height:38px!important;padding:0!important;margin:0!important;
      border:0!important;border-radius:20px!important;background:transparent!important;box-shadow:none!important;
      backdrop-filter:none!important;-webkit-backdrop-filter:none!important;z-index:1202!important;pointer-events:auto!important;
      direction:ltr!important;justify-self:end!important;overflow:visible!important;
    }
    .et-language-current{appearance:none!important;-webkit-appearance:none!important;width:46px!important;height:34px!important;
      display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;padding:0 8px!important;
      border:1px solid rgba(255,255,255,.20)!important;border-radius:999px!important;background:rgba(0,0,0,.12)!important;color:#fff!important;
      font:600 8px/1 var(--et-sans,"DM Sans",Arial,sans-serif)!important;letter-spacing:.09em!important;cursor:pointer!important;
      box-shadow:0 8px 20px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.14)!important;
      transition:background .22s ease,border-color .22s ease,transform .22s ease!important;
    }
    .et-language-current:hover,.et-language-switch.is-open .et-language-current,.language-nav.is-open .et-language-current{
      background:rgba(0,0,0,.19)!important;border-color:rgba(255,255,255,.31)!important;transform:translateY(-1px)!important;
    }
    .et-language-current span{display:block!important;line-height:1!important}.et-language-current i{width:5px!important;height:5px!important;display:block!important;
      border-right:1px solid currentColor!important;border-bottom:1px solid currentColor!important;transform:rotate(45deg) translateY(-1px)!important;opacity:.72!important;
    }
    .et-language-dropdown{position:absolute!important;top:42px!important;right:0!important;display:flex!important;flex-direction:column!important;gap:3px!important;
      min-width:52px!important;padding:4px!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:15px!important;
      background:rgba(3,20,15,.16)!important;backdrop-filter:blur(18px) saturate(120%)!important;-webkit-backdrop-filter:blur(18px) saturate(120%)!important;
      box-shadow:0 12px 28px rgba(0,0,0,.10),inset 0 1px 0 rgba(255,255,255,.10)!important;opacity:0!important;visibility:hidden!important;
      pointer-events:none!important;transform:translateY(-5px)!important;transition:opacity .18s ease,visibility .18s ease,transform .18s ease!important;
    }
    .et-language-switch.is-open .et-language-dropdown,.language-nav.is-open .et-language-dropdown{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}
    .et-language-dropdown a{width:44px!important;height:28px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;
      border:1px solid rgba(255,255,255,.06)!important;border-radius:12px!important;background:rgba(0,0,0,.04)!important;color:#fff!important;
      font:600 7px/1 var(--et-sans,"DM Sans",Arial,sans-serif)!important;letter-spacing:.07em!important;opacity:.76!important;text-decoration:none!important;
      transition:background .18s ease,border-color .18s ease,opacity .18s ease!important;
    }
    .et-language-dropdown a:hover,.et-language-dropdown a:focus-visible{background:rgba(255,255,255,.10)!important;border-color:rgba(255,255,255,.20)!important;opacity:1!important;outline:none!important}
    @media(max-width:800px){
      .site-header .et-language-switch,.site-header .language-nav{width:46px!important;min-width:46px!important;height:36px!important}
      .et-language-current{width:42px!important;height:32px!important;font-size:7px!important}.et-language-dropdown{top:39px!important;min-width:46px!important}
      .et-language-dropdown a{width:38px!important;height:27px!important;font-size:6.5px!important}
    }
  `;
  doc.head.appendChild(style);

  const closeAll = () => {
    doc.querySelectorAll('.et-language-switch.is-open, .language-nav.is-open').forEach(nav => {
      nav.classList.remove('is-open');
      const button = nav.querySelector('.et-language-current');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  };

  const enhance = () => {
    doc.querySelectorAll('.et-language-switch, .language-nav').forEach(nav => {
      if (nav.dataset.etLanguageReady === 'true') return;
      if (!nav.closest('.site-header,.et-header-inner,.header-inner,.p-header-inner,.es-header-inner')) return;
      const links = [...nav.querySelectorAll(':scope > a')];
      if (!links.length) return;
      const current = links.find(link => link.classList.contains('current')) || links[0];
      const alternatives = links.filter(link => link !== current);

      const button = doc.createElement('button');
      button.type = 'button';button.className='et-language-current';button.setAttribute('aria-haspopup','true');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Change language');
      button.innerHTML = `<span>${current.textContent.trim()}</span><i aria-hidden="true"></i>`;

      const menu = doc.createElement('div');menu.className='et-language-dropdown';menu.setAttribute('role','menu');
      alternatives.forEach(link => {const item=link.cloneNode(true);item.classList.remove('current');item.setAttribute('role','menuitem');menu.appendChild(item);});

      nav.replaceChildren(button,menu);nav.dataset.etLanguageReady='true';
      button.addEventListener('click',event=>{event.stopPropagation();const open=nav.classList.contains('is-open');closeAll();if(!open){nav.classList.add('is-open');button.setAttribute('aria-expanded','true');}});
      nav.addEventListener('keydown',event=>{if(event.key==='Escape'){closeAll();button.focus();}});
    });
  };

  enhance();
  new MutationObserver(enhance).observe(doc.documentElement,{childList:true,subtree:true});
  doc.addEventListener('click',event=>{if(!event.target.closest('.et-language-switch, .language-nav'))closeAll();});
})();
