(() => {
  'use strict';

  const host = document.querySelector('#private-offers');
  const status = document.querySelector('#private-status');
  if (!host) return;

  const escape = (value) => String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');

  const setStatus = (text, state = 'notice') => {
    if (!status) return;
    status.textContent = text;
    status.dataset.state = state;
  };

  const setBusy = (busy) => {
    host.setAttribute('aria-busy', busy ? 'true' : 'false');
  };

  const formatDate = (value) => {
    const stamp = Number(value);
    if (!Number.isFinite(stamp) || stamp <= 0) return 'Sin fecha indicada';
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(stamp * 1000));
    } catch (_) {
      return 'Fecha disponible';
    }
  };

  const stateCard = ({label, title, copy, primary, secondary}) => `
    <section class="private-state-card">
      <div class="private-state-card__copy">
        <span class="private-state-card__label">${escape(label)}</span>
        <h3>${escape(title)}</h3>
        <p>${escape(copy)}</p>
      </div>
      <div class="private-state-actions">
        <a href="${primary.href}">${escape(primary.label)} <span aria-hidden="true">↗</span></a>
        <a href="${secondary.href}">${escape(secondary.label)} <span aria-hidden="true">→</span></a>
      </div>
    </section>`;

  const offersById = new Map();
  const viewed = new Set();

  const recordView = async (id) => {
    if (!Number.isInteger(id) || id < 1 || viewed.has(id)) return;
    viewed.add(id);
    try {
      await fetch('/api/private/offers/view', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
    } catch (_) {
      // Analytics must never block the client experience.
    }
  };

  const observeCards = () => {
    const cards = [...host.querySelectorAll('[data-offer-id]')];
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => recordView(Number(card.dataset.offerId)));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
        const id = Number(entry.target.dataset.offerId);
        recordView(id);
        observer.unobserve(entry.target);
      });
    }, { threshold: [0.55] });

    cards.forEach((card) => observer.observe(card));
  };

  const renderOffers = (offers) => {
    offers.forEach(offer => offersById.set(Number(offer.id),offer));
    host.innerHTML = offers.map((rawOffer, index) => {
      const id = Number(rawOffer.id);
      const title = escape(rawOffer.title || 'Oportunidad Signature');
      const category = escape(rawOffer.category || 'SIGNATURE');
      const origin = escape(rawOffer.origin || 'Por confirmar');
      const destination = escape(rawOffer.destination || 'Según operación');
      const availability = escape(rawOffer.availability || 'Consultar');
      const description = escape(rawOffer.description || '');
      const validity = formatDate(rawOffer.valid_until);

      return `
        <article class="signature-offer-card" data-offer-id="${Number.isInteger(id) ? id : ''}">
          <div class="signature-offer-card__top">
            <span class="signature-offer-index">${String(index + 1).padStart(2,'0')}</span>
            <span class="signature-offer-tag">${category}</span>
          </div>

          <h3>${title}</h3>

          <div class="signature-offer-meta">
            <div><span>ORIGEN</span><strong>${origin}</strong></div>
            <div><span>DESTINO</span><strong>${destination}</strong></div>
            <div><span>DISPONIBILIDAD</span><strong>${availability}</strong></div>
          </div>

          ${description ? `<p class="signature-offer-description">${description}</p>` : ''}

          <div class="signature-offer-card__foot">
            <p class="signature-offer-validity">Disponible hasta ${escape(validity)}</p>
            <div class="signature-actions"><button class="signature-offer-action" type="button" data-request="availability" data-id="${id}">Consultar disponibilidad</button><button class="signature-offer-action" type="button" data-request="order" data-id="${id}">Solicitar pedido</button></div>
          </div>
        </article>`;
    }).join('');

    observeCards();
  };

  const load = async () => {
    setBusy(true);

    try {
      const response = await fetch('/api/private/offers', {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        if(response.status!==401)throw new Error('SERVICE_UNAVAILABLE');
        document.querySelector('#signature-login').hidden=false;
        document.querySelector('#signature-workspace').hidden=true;
        setStatus('No hay una sesión Signature activa.', 'notice');
        host.innerHTML = stateCard({
          label: 'ACCESO SIGNATURE',
          title: 'Active su acceso privado.',
          copy: 'El contenido de Signature está reservado a empresas aprobadas. Si ya ha recibido acceso, utilice el enlace de activación correspondiente. Si todavía no lo tiene, puede solicitarlo.',
          primary: { href: '/news/#emperio-private', label: 'Solicitar acceso' },
          secondary: { href: '/contact/', label: 'Contactar' }
        });
        setBusy(false);
        return;
      }

      document.querySelector('#signature-login').hidden = true;
      document.querySelector('#signature-workspace').hidden = false;
      document.querySelector('#signature-company').textContent = data.company || data.client || 'Área de cliente';
      loadHistory();
      const company = String(data.company || '').trim();
      setStatus(company ? `Acceso verificado · ${company}` : 'Acceso Signature verificado.', 'success');

      const offers = Array.isArray(data.offers) ? data.offers : [];
      if (!offers.length) {
        host.innerHTML = stateCard({
          label: 'SIN OPORTUNIDADES ACTIVAS',
          title: 'No hay nuevas referencias para su perfil.',
          copy: 'Signature muestra únicamente oportunidades activas y relevantes para su perfil. Puede volver más adelante o plantearnos directamente una necesidad concreta.',
          primary: { href: '/contact/', label: 'Plantear una necesidad' },
          secondary: { href: '/products/', label: 'Explorar productos' }
        });
        setBusy(false);
        return;
      }

      renderOffers(offers);
      setBusy(false);
    } catch (_) {
      document.querySelector('#login-feedback').textContent='No hemos podido comprobar su sesión. Recargue la página para reintentar.';
      setStatus('No hemos podido verificar el acceso en este momento.', 'notice');
      host.innerHTML = stateCard({
        label: 'SERVICIO NO DISPONIBLE',
        title: 'No podemos cargar Signature ahora.',
        copy: 'La sesión no se ha perdido. Inténtelo de nuevo dentro de unos minutos o contacte con EMPERIO TISS si necesita revisar una oportunidad.',
        primary: { href: window.location.pathname, label: 'Reintentar' },
        secondary: { href: '/contact/', label: 'Contactar' }
      });
      setBusy(false);
    }
  };

  const loginForm=document.querySelector('#signature-login-form');
  loginForm.addEventListener('submit',async event=>{
    event.preventDefault();const button=loginForm.querySelector('button'),feedback=document.querySelector('#login-feedback');button.disabled=true;feedback.textContent='Enviando enlace…';
    try{const form=new FormData(loginForm);form.set('language','es');const r=await fetch('/api/private/request-access',{method:'POST',body:form,credentials:'same-origin'});const data=await r.json();if(!r.ok){if(data.code==='VALIDATION_FAILED')throw new Error('Este acceso requiere una empresa aprobada. Solicite aprobación o contacte con EMPERIO TISS.');throw new Error(data.error||'No se ha podido enviar el enlace.');}feedback.textContent=data.message||'Revise su email para acceder mediante el enlace seguro.';}catch(e){feedback.textContent=e.message||'Error de conexión. Inténtelo de nuevo.';}finally{button.disabled=false;}
  });
  document.querySelector('#signature-logout').addEventListener('click',async()=>{try{const r=await fetch('/api/private/logout',{method:'POST',credentials:'same-origin'});if(!r.ok)throw Error();location.reload();}catch{setStatus('No se ha podido cerrar sesión. Inténtelo de nuevo.','notice')}});
  const historyHost=document.querySelector('#signature-history');
  const statuses={new:'Recibida',qualified:'En revisión',studying:'En estudio',offered:'Propuesta enviada',won:'Finalizada',lost:'Cerrada'};
  async function loadHistory(){historyHost.textContent='Cargando solicitudes…';try{const r=await fetch('/api/private/requests',{cache:'no-store',credentials:'same-origin'}),data=await r.json();if(!r.ok)throw Error();historyHost.innerHTML=data.requests.length?data.requests.map(item=>`<article class="signature-request-row"><div><strong>${escape(item.product_name)}</strong><p>${escape(item.specification)} · ${escape(item.destination)}</p><small>${escape(item.id)} · ${escape(formatDate(item.created_at))}</small></div><p>${escape(statuses[item.status]||'En revisión')}</p></article>`).join(''):'<p>Todavía no ha enviado solicitudes desde Signature.</p>';}catch{historyHost.innerHTML='<p>No se han podido cargar sus solicitudes. <button type="button" id="retry-history">Reintentar</button></p>';historyHost.querySelector('button').addEventListener('click',loadHistory);}}
  const dialog=document.querySelector('#signature-request'),requestForm=document.querySelector('#signature-request-form');let selectedOffer,requestKind,requestPending=false;
  host.addEventListener('click',event=>{const button=event.target.closest('[data-request]');if(!button||requestPending)return;selectedOffer=offersById.get(Number(button.dataset.id));if(!selectedOffer)return;requestKind=button.dataset.request;requestForm.reset();requestForm.querySelector('[type=submit]').disabled=false;document.querySelector('#request-feedback').textContent='';document.querySelector('#request-heading').textContent=requestKind==='order'?'Solicitar pedido':'Consultar disponibilidad';document.querySelector('#request-offer').textContent=selectedOffer.title;requestForm.elements.date.min=new Date().toISOString().slice(0,10);dialog.showModal();});
  dialog.querySelector('.request-close').addEventListener('click',()=>{if(!requestPending)dialog.close()});
  dialog.addEventListener('cancel',event=>{if(requestPending)event.preventDefault()});
  requestForm.addEventListener('submit',async event=>{event.preventDefault();const button=requestForm.querySelector('[type=submit]'),feedback=document.querySelector('#request-feedback');requestPending=true;button.disabled=true;feedback.textContent='Registrando solicitud…';try{const payload=Object.fromEntries(new FormData(requestForm));payload.offer_id=selectedOffer.id;payload.kind=requestKind;const r=await fetch('/api/private/requests',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}),data=await r.json();if(!r.ok)throw new Error(data.error||'No se ha podido registrar la solicitud.');feedback.textContent=data.message+' Referencia: '+data.id;await loadHistory();}catch(e){feedback.textContent=e.message||'Error de conexión. No se ha confirmado el envío.';button.disabled=false;}finally{requestPending=false;}});

  load();
})();