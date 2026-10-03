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
            <a class="signature-offer-action" href="/contact/">Consultar oportunidad <span aria-hidden="true">↗</span></a>
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

  load();
})();