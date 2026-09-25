(() => {
  'use strict';
  const root = document.querySelector('.news-current');
  if (!root) return;
  const lang = root.dataset.lang || 'en';
  const copy = {
    es: {
      newsletterOk: 'Revisa tu email para confirmar la suscripción.',
      privateOk: 'Solicitud recibida. Nuestro equipo revisará tu acceso.',
      config: 'El servicio está terminando de configurarse. Inténtalo de nuevo más tarde.',
      network: 'No hemos podido conectar con el servicio. Inténtalo de nuevo.',
      invalid: 'Revisa los datos introducidos e inténtalo de nuevo.',
      categoryRequired: 'Selecciona al menos una categoría de producto.'
    },
    en: {
      newsletterOk: 'Check your email to confirm your subscription.',
      privateOk: 'Request received. Our team will review your access.',
      config: 'This service is being configured. Please try again later.',
      network: 'We could not connect to the service. Please try again.',
      invalid: 'Please check your details and try again.',
      categoryRequired: 'Select at least one product category.'
    },
    fr: {
      newsletterOk: 'Consultez votre email pour confirmer votre inscription.',
      privateOk: 'Demande reçue. Notre équipe examinera votre accès.',
      config: 'Le service est en cours de configuration. Réessayez plus tard.',
      network: 'Impossible de joindre le service. Réessayez.',
      invalid: 'Vérifiez vos informations et réessayez.',
      categoryRequired: 'Sélectionnez au moins une catégorie de produit.'
    },
    it: {
      newsletterOk: 'Controlla la tua email per confermare l’iscrizione.',
      privateOk: 'Richiesta ricevuta. Il nostro team esaminerà il tuo accesso.',
      config: 'Il servizio è in fase di configurazione. Riprova più tardi.',
      network: 'Non è stato possibile contattare il servizio. Riprova.',
      invalid: 'Controlla i dati inseriti e riprova.',
      categoryRequired: 'Seleziona almeno una categoria di prodotto.'
    },
    ar: {
      newsletterOk: 'تحقق من بريدك الإلكتروني لتأكيد الاشتراك.',
      privateOk: 'تم استلام الطلب. سيراجع فريقنا طلب الوصول.',
      config: 'الخدمة قيد الإعداد. يرجى المحاولة لاحقاً.',
      network: 'تعذر الاتصال بالخدمة. يرجى المحاولة مرة أخرى.',
      invalid: 'يرجى مراجعة البيانات والمحاولة مرة أخرى.',
      categoryRequired: 'اختر فئة منتج واحدة على الأقل.'
    }
  } [lang] || {
    newsletterOk: 'Check your email to confirm your subscription.',
    privateOk: 'Request received. Our team will review your access.',
    config: 'This service is being configured. Please try again later.',
    network: 'We could not connect to the service. Please try again.',
    invalid: 'Please check your details and try again.',
    categoryRequired: 'Select at least one product category.'
  };
  const replaceForm = (selector) => {
    const old = root.querySelector(selector);
    if (!old) return null;
    const fresh = old.cloneNode(true);
    old.replaceWith(fresh);
    return fresh
  };
  const setStatus = (form, message, ok) => {
    const el = form.querySelector('.news-form-status');
    if (!el) return;
    el.textContent = message;
    el.dataset.state = ok ? 'success' : 'error';
    el.style.color = ok ? '#2d5e45' : '';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite')
  };
  const submit = (form, url, kind) => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const email = form.querySelector('input[name="email"]');
      if (!email || !email.checkValidity()) {
        form.reportValidity();
        return
      }
      const language = form.querySelector('input[name="language"]');
      if (language) language.value = lang;
      const payload = new FormData(form);
      if (kind === 'newsletter' && !payload.get('consent')) {
        form.reportValidity();
        return
      }
      if (kind === 'private' && !payload.getAll('categories').length) {
        setStatus(form, copy.categoryRequired, false);
        form.querySelector('input[name="categories"]')?.focus();
        return
      }
      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true')
      }
      setStatus(form, '', false);
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: payload,
          headers: {
            Accept: 'application/json'
          }
        });
        const type = response.headers.get('content-type') || '';
        const data = type.includes('application/json') ? await response.json() : {};
        if (response.ok && data.ok) {
          setStatus(form, data.message || (kind === 'newsletter' ? copy.newsletterOk :
            copy.privateOk), true);
          if (kind === 'newsletter') {
            form.reset();
            const consent = form.querySelector('input[name="consent"]');
            if (consent) consent.checked = false;
            if (language) language.value = lang
          }
          return
        }
        if (response.status === 503) {
          setStatus(form, data.error || copy.config, false);
          return
        }
        if (response.status === 400) {
          setStatus(form, data.error || copy.invalid, false);
          return
        }
        throw new Error(data.error || copy.network)
      } catch (err) {
        setStatus(form, err?.message || copy.network, false)
      } finally {
        if (button) {
          button.disabled = false;
          button.removeAttribute('aria-busy')
        }
      }
    })
  };
  submit(replaceForm('[data-newsletter-form]'), '/api/newsletter/subscribe', 'newsletter');
  submit(replaceForm('[data-private-form]'), '/api/private/request-access', 'private');
})();
