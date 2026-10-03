(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body || body.classList.contains('private-admin-page')) return;

  const VERSION = '20261004-1';
  const STORAGE_KEY = 'et_cookie_consent_v1';
  const langCode = (doc.documentElement.lang || 'es').slice(0,2).toLowerCase();
  const lang = ['es','en','fr','it','ar'].includes(langCode) ? langCode : 'es';

  const copy = {
    es:{
      kicker:'PRIVACIDAD · COOKIES',
      title:'Tus preferencias de cookies.',
      text:'Usamos cookies técnicas necesarias para seguridad, formularios y acceso a EMPERIO Signature. Las cookies opcionales solo se activan con tu permiso. Puedes aceptar, rechazar o configurar tus preferencias.',
      more:'Política de cookies',
      accept:'Aceptar',
      reject:'Rechazar',
      configure:'Configurar',
      save:'Guardar preferencias',
      necessary:'Necesarias',
      necessaryText:'Imprescindibles para seguridad, navegación y acceso privado. No pueden desactivarse.',
      functional:'Funcionales',
      functionalText:'Preferencias o funciones externas opcionales.',
      analytics:'Analítica',
      analyticsText:'Medición de uso. Actualmente no hay herramientas analíticas registradas.',
      marketing:'Marketing',
      marketingText:'Publicidad o seguimiento comercial. Actualmente no se utiliza.',
      manage:'Cookies'
    },
    en:{
      kicker:'PRIVACY · COOKIES',title:'Your cookie preferences.',
      text:'We use necessary technical cookies for security, forms and EMPERIO Signature access. Optional cookies are activated only with your permission. You can accept, reject or configure your preferences.',
      more:'Cookie policy',accept:'Accept',reject:'Reject',configure:'Configure',save:'Save preferences',
      necessary:'Necessary',necessaryText:'Required for security, navigation and private access. They cannot be disabled.',
      functional:'Functional',functionalText:'Optional preferences or external functionality.',
      analytics:'Analytics',analyticsText:'Usage measurement. No analytics tools are currently registered.',
      marketing:'Marketing',marketingText:'Advertising or commercial tracking. Not currently used.',manage:'Cookies'
    },
    fr:{
      kicker:'CONFIDENTIALITÉ · COOKIES',title:'Vos préférences de cookies.',
      text:'Nous utilisons des cookies techniques nécessaires pour la sécurité, les formulaires et l’accès à EMPERIO Signature. Les cookies optionnels ne sont activés qu’avec votre autorisation.',
      more:'Politique de cookies',accept:'Accepter',reject:'Refuser',configure:'Configurer',save:'Enregistrer',
      necessary:'Nécessaires',necessaryText:'Indispensables à la sécurité, à la navigation et à l’accès privé.',
      functional:'Fonctionnels',functionalText:'Préférences ou fonctions externes optionnelles.',
      analytics:'Analyse',analyticsText:'Mesure d’utilisation. Aucun outil analytique n’est actuellement enregistré.',
      marketing:'Marketing',marketingText:'Publicité ou suivi commercial. Non utilisé actuellement.',manage:'Cookies'
    },
    it:{
      kicker:'PRIVACY · COOKIE',title:'Le tue preferenze cookie.',
      text:'Utilizziamo cookie tecnici necessari per sicurezza, moduli e accesso EMPERIO Signature. I cookie opzionali vengono attivati solo con il tuo consenso.',
      more:'Politica cookie',accept:'Accetta',reject:'Rifiuta',configure:'Configura',save:'Salva preferenze',
      necessary:'Necessari',necessaryText:'Necessari per sicurezza, navigazione e accesso privato.',
      functional:'Funzionali',functionalText:'Preferenze o funzioni esterne opzionali.',
      analytics:'Analitici',analyticsText:'Misurazione dell’uso. Nessuno strumento analitico è attualmente registrato.',
      marketing:'Marketing',marketingText:'Pubblicità o tracciamento commerciale. Non utilizzato attualmente.',manage:'Cookie'
    },
    ar:{
      kicker:'الخصوصية · ملفات الارتباط',title:'تفضيلات ملفات الارتباط.',
      text:'نستخدم ملفات ارتباط تقنية ضرورية للأمان والنماذج والوصول إلى EMPERIO Signature. لا يتم تفعيل الملفات الاختيارية إلا بإذن منك.',
      more:'سياسة ملفات الارتباط',accept:'قبول',reject:'رفض',configure:'إعداد',save:'حفظ التفضيلات',
      necessary:'ضرورية',necessaryText:'ضرورية للأمان والتصفح والوصول الخاص ولا يمكن تعطيلها.',
      functional:'وظيفية',functionalText:'تفضيلات أو وظائف خارجية اختيارية.',
      analytics:'تحليلية',analyticsText:'لقياس الاستخدام. لا توجد أدوات تحليل مسجلة حالياً.',
      marketing:'تسويق',marketingText:'إعلانات أو تتبع تجاري. غير مستخدم حالياً.',manage:'ملفات الارتباط'
    }
  }[lang];

  const read = () => {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  };

  const write = (value) => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (_) {}
    window.ETConsent = value;
    window.dispatchEvent(new CustomEvent('et:consentchange',{detail:value}));
    activateOptional(value);
  };

  const activateOptional = (prefs) => {
    doc.querySelectorAll('script[type="text/plain"][data-cookie-category]').forEach((node) => {
      const category = node.dataset.cookieCategory;
      if (!prefs?.[category] || node.dataset.cookieActivated === 'true') return;
      const script = doc.createElement('script');
      [...node.attributes].forEach((attr) => {
        if (attr.name === 'type' || attr.name === 'data-cookie-category') return;
        script.setAttribute(attr.name, attr.value);
      });
      script.textContent = node.textContent;
      script.dataset.cookieActivated = 'true';
      node.replaceWith(script);
    });
  };

  const existing = read();
  window.ETConsent = existing || {necessary:true,functional:false,analytics:false,marketing:false};

  const banner = doc.createElement('section');
  banner.className = 'et-cookie-consent';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-modal','true');
  banner.setAttribute('aria-labelledby','etCookieTitle');
  banner.innerHTML = `
    <div class="et-cookie-consent__panel">
      <div>
        <p class="et-cookie-consent__kicker">${copy.kicker}</p>
        <h2 id="etCookieTitle">${copy.title}</h2>
        <p>${copy.text} <a href="/legal/cookies.html">${copy.more}</a>.</p>
      </div>
      <div class="et-cookie-consent__actions">
        <button type="button" data-cookie-reject>${copy.reject}</button>
        <button type="button" data-cookie-configure>${copy.configure}</button>
        <button type="button" data-cookie-accept>${copy.accept}</button>
      </div>
      <div class="et-cookie-consent__settings">
        <div class="et-cookie-consent__settings-grid">
          <label class="et-cookie-choice"><span class="et-cookie-choice__top"><strong>${copy.necessary}</strong><input type="checkbox" checked disabled></span><p>${copy.necessaryText}</p></label>
          <label class="et-cookie-choice"><span class="et-cookie-choice__top"><strong>${copy.functional}</strong><input type="checkbox" data-cookie-functional></span><p>${copy.functionalText}</p></label>
          <label class="et-cookie-choice"><span class="et-cookie-choice__top"><strong>${copy.analytics}</strong><input type="checkbox" data-cookie-analytics></span><p>${copy.analyticsText}</p></label>
          <label class="et-cookie-choice"><span class="et-cookie-choice__top"><strong>${copy.marketing}</strong><input type="checkbox" data-cookie-marketing></span><p>${copy.marketingText}</p></label>
        </div>
        <div class="et-cookie-consent__save"><button type="button" data-cookie-save>${copy.save}</button></div>
      </div>
    </div>`;

  const manage = doc.createElement('button');
  manage.type = 'button';
  manage.className = 'et-cookie-manage';
  manage.textContent = copy.manage;
  manage.setAttribute('aria-label', copy.configure);

  body.append(banner,manage);

  const inputs = {
    functional: banner.querySelector('[data-cookie-functional]'),
    analytics: banner.querySelector('[data-cookie-analytics]'),
    marketing: banner.querySelector('[data-cookie-marketing]')
  };

  const syncInputs = (prefs) => {
    for (const key of Object.keys(inputs)) inputs[key].checked = Boolean(prefs?.[key]);
  };

  const close = () => {
    banner.classList.remove('is-visible','is-settings');
    manage.classList.add('is-visible');
  };

  const show = (settings=false) => {
    syncInputs(read() || window.ETConsent);
    banner.classList.add('is-visible');
    banner.classList.toggle('is-settings', settings);
    manage.classList.remove('is-visible');
  };

  banner.querySelector('[data-cookie-accept]').addEventListener('click',() => {
    write({necessary:true,functional:true,analytics:true,marketing:true,version:VERSION,ts:Date.now()});
    close();
  });

  banner.querySelector('[data-cookie-reject]').addEventListener('click',() => {
    write({necessary:true,functional:false,analytics:false,marketing:false,version:VERSION,ts:Date.now()});
    close();
  });

  banner.querySelector('[data-cookie-configure]').addEventListener('click',() => {
    banner.classList.toggle('is-settings');
  });

  banner.querySelector('[data-cookie-save]').addEventListener('click',() => {
    write({
      necessary:true,
      functional:inputs.functional.checked,
      analytics:inputs.analytics.checked,
      marketing:inputs.marketing.checked,
      version:VERSION,
      ts:Date.now()
    });
    close();
  });

  manage.addEventListener('click',() => show(true));

  if (existing) {
    activateOptional(existing);
    manage.classList.add('is-visible');
  } else {
    show(false);
  }
})();