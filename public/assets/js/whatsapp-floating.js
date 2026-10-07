/* EMPERIO TISS — universal floating WhatsApp assistant */
(() => {
  'use strict';

  if (window.__etFloatingWhatsAppV3) return;
  window.__etFloatingWhatsAppV3 = true;

  const doc = document;
  const body = doc.body;
  if (!body) return;

  const path = (location.pathname || '/').replace(/\/{2,}/g,'/');
  if (
    path === '/private' ||
    path.startsWith('/private/') ||
    body.classList.contains('private-page') ||
    body.classList.contains('private-admin-page')
  ) return;

  const langCode = (doc.documentElement.lang || 'es').slice(0,2).toLowerCase();
  const lang = ['es','en','fr','it','ar'].includes(langCode) ? langCode : 'es';
  const phone = '34614270684';

  const copy = {
    es:{
      label:'Contactar por WhatsApp',
      title:'¿En qué podemos ayudarle?',
      subtitle:'Elija una opción y abriremos WhatsApp con el mensaje preparado.',
      close:'Cerrar',
      options:[
        ['Productos del mar','Hola, quiero consultar disponibilidad, origen y especificaciones de productos del mar.'],
        ['Frutas y hortalizas','Hola, quiero consultar disponibilidad, origen, calibre y campaña de frutas y hortalizas.'],
        ['Logística / destino','Hola, quiero consultar una operación con destino, volumen y necesidades logísticas concretas.'],
        ['Solicitud de producto','Hola, estoy buscando un producto específico y quiero enviar los detalles de mi solicitud.'],
        ['Otra consulta','Hola, quisiera hacer una consulta comercial a EMPERIO TISS.']
      ]
    },
    en:{
      label:'Contact us on WhatsApp',
      title:'How can we help?',
      subtitle:'Choose an option and we will open WhatsApp with a prepared message.',
      close:'Close',
      options:[
        ['Seafood','Hello, I would like to ask about availability, origin and specifications for seafood products.'],
        ['Produce','Hello, I would like to ask about availability, origin, sizing and season for fruits and vegetables.'],
        ['Logistics / destination','Hello, I would like to discuss an operation with a specific destination, volume and logistics requirements.'],
        ['Product request','Hello, I am looking for a specific product and would like to send the details of my request.'],
        ['Other enquiry','Hello, I would like to make a business enquiry to EMPERIO TISS.']
      ]
    },
    fr:{
      label:'Contacter sur WhatsApp',
      title:'Comment pouvons-nous vous aider ?',
      subtitle:'Choisissez une option et nous ouvrirons WhatsApp avec un message préparé.',
      close:'Fermer',
      options:[
        ['Produits de la mer','Bonjour, je souhaite connaître la disponibilité, l’origine et les spécifications de produits de la mer.'],
        ['Fruits & légumes','Bonjour, je souhaite connaître la disponibilité, l’origine, le calibre et la campagne de fruits et légumes.'],
        ['Logistique / destination','Bonjour, je souhaite discuter d’une opération avec une destination, un volume et des besoins logistiques précis.'],
        ['Demande produit','Bonjour, je recherche un produit précis et souhaite envoyer les détails de ma demande.'],
        ['Autre demande','Bonjour, je souhaite adresser une demande commerciale à EMPERIO TISS.']
      ]
    },
    it:{
      label:'Contattaci su WhatsApp',
      title:'Come possiamo aiutarti?',
      subtitle:'Scegli un’opzione e apriremo WhatsApp con un messaggio già preparato.',
      close:'Chiudi',
      options:[
        ['Prodotti del mare','Buongiorno, vorrei chiedere disponibilità, origine e specifiche per prodotti del mare.'],
        ['Ortofrutta','Buongiorno, vorrei chiedere disponibilità, origine, calibro e campagna per frutta e ortaggi.'],
        ['Logistica / destinazione','Buongiorno, vorrei discutere un’operazione con destinazione, volume ed esigenze logistiche specifiche.'],
        ['Richiesta prodotto','Buongiorno, sto cercando un prodotto specifico e vorrei inviare i dettagli della mia richiesta.'],
        ['Altra richiesta','Buongiorno, vorrei inviare una richiesta commerciale a EMPERIO TISS.']
      ]
    },
    ar:{
      label:'تواصل معنا عبر واتساب',
      title:'كيف يمكننا مساعدتك؟',
      subtitle:'اختر نوع الطلب وسنفتح واتساب برسالة جاهزة.',
      close:'إغلاق',
      options:[
        ['المأكولات البحرية','مرحباً، أرغب في الاستفسار عن التوفر والمنشأ والمواصفات لمنتجات المأكولات البحرية.'],
        ['الفواكه والخضروات','مرحباً، أرغب في الاستفسار عن التوفر والمنشأ والحجم والموسم للفواكه والخضروات.'],
        ['اللوجستيات / الوجهة','مرحباً، أرغب في مناقشة عملية بوجهة وحجم ومتطلبات لوجستية محددة.'],
        ['طلب منتج','مرحباً، أبحث عن منتج محدد وأرغب في إرسال تفاصيل طلبي.'],
        ['استفسار آخر','مرحباً، أرغب في إرسال استفسار تجاري إلى EMPERIO TISS.']
      ]
    }
  }[lang];

  if (doc.querySelector('.et-whatsapp-assistant')) return;

  const root = doc.createElement('div');
  root.className = 'et-whatsapp-assistant';

  const panel = doc.createElement('div');
  panel.className = 'et-whatsapp-panel';
  panel.id = 'etWhatsappPanel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','false');
  panel.setAttribute('aria-hidden','true');

  const optionsMarkup = copy.options.map(([label,message],index) => {
    const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    return `
      <a class="et-whatsapp-option" href="${href}" target="_blank" rel="noopener noreferrer" data-wa-option="${index+1}">
        <span class="et-whatsapp-option__index">${String(index+1).padStart(2,'0')}</span>
        <span class="et-whatsapp-option__label">${label}</span>
        <span class="et-whatsapp-option__arrow" aria-hidden="true">↗</span>
      </a>`;
  }).join('');

  panel.innerHTML = `
    <div class="et-whatsapp-panel__head">
      <div>
        <p>WHATSAPP</p>
        <h2>${copy.title}</h2>
        <span>${copy.subtitle}</span>
      </div>
      <button class="et-whatsapp-panel__close" type="button" aria-label="${copy.close}">×</button>
    </div>
    <div class="et-whatsapp-options">${optionsMarkup}</div>`;

  const trigger = doc.createElement('button');
  trigger.type = 'button';
  trigger.className = 'et-whatsapp-float';
  trigger.setAttribute('aria-label',copy.label);
  trigger.setAttribute('title',copy.label);
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-controls','etWhatsappPanel');
  trigger.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.52 3.49A11.78 11.78 0 0 0 12.1 0C5.55 0 .22 5.3.22 11.82c0 2.08.55 4.12 1.6 5.91L.12 24l6.43-1.68a11.9 11.9 0 0 0 5.55 1.41h.01c6.54 0 11.87-5.3 11.87-11.82 0-3.16-1.23-6.14-3.46-8.42ZM12.1 21.73h-.01a9.87 9.87 0 0 1-5.03-1.37l-.36-.22-3.82 1 1.02-3.71-.24-.38a9.76 9.76 0 0 1-1.51-5.23C2.15 6.4 6.62 2 12.11 2c2.65 0 5.15 1.03 7.02 2.9a9.82 9.82 0 0 1 2.91 7.02c0 5.41-4.47 9.81-9.94 9.81Zm5.45-7.35c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.18 5.07 4.46.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
    </svg>`;

  const setOpen = open => {
    root.classList.toggle('is-open',open);
    trigger.setAttribute('aria-expanded',String(open));
    panel.setAttribute('aria-hidden',String(!open));
  };

  trigger.addEventListener('click',() => setOpen(!root.classList.contains('is-open')));
  panel.querySelector('.et-whatsapp-panel__close').addEventListener('click',() => setOpen(false));

  doc.addEventListener('pointerdown',(event) => {
    if (!root.classList.contains('is-open') || root.contains(event.target)) return;
    setOpen(false);
  });

  doc.addEventListener('keydown',(event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  panel.querySelectorAll('.et-whatsapp-option').forEach(link => {
    link.dataset.analyticsLocation = 'floating_whatsapp_assistant';
    link.addEventListener('click',() => setOpen(false));
  });

  root.append(panel,trigger);
  body.appendChild(root);
})();