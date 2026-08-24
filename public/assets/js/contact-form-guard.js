(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  const submit = form?.querySelector('.form-submit');
  const widget = form?.querySelector('.cf-turnstile');
  if (!form || !status || !submit || !widget) return;

  let busy = false;
  let widgetId = null;
  let tokenInput = form.querySelector('[name="cf-turnstile-response"]');

  const ensureTokenInput = () => {
    if (tokenInput) return tokenInput;
    tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'cf-turnstile-response';
    tokenInput.id = 'contactTurnstileToken';
    form.appendChild(tokenInput);
    return tokenInput;
  };

  const renderVisibleTurnstile = () => {
    if (!window.turnstile || typeof window.turnstile.render !== 'function') return;

    widget.style.display = '';
    widget.style.visibility = 'visible';
    widget.style.opacity = '1';
    widget.style.pointerEvents = 'auto';

    if (widget.querySelector('iframe')) return;

    widget.innerHTML = '';
    widgetId = window.turnstile.render(widget, {
      sitekey: '0x4AAAAAAEaIn_beKLMv4VjA',
      action: 'contact',
      theme: 'auto',
      appearance: 'always',
      callback: (token) => {
        ensureTokenInput().value = token || '';
      },
      'expired-callback': () => {
        ensureTokenInput().value = '';
      },
      'error-callback': () => {
        ensureTokenInput().value = '';
      },
    });
  };

  const boot = () => {
    if (window.location.pathname !== '/contact/') return;
    if (window.turnstile) renderVisibleTurnstile();
    else window.setTimeout(boot, 150);
  };

  boot();
  window.addEventListener('load', boot, { once: true });
  window.setTimeout(boot, 300);
  window.setTimeout(boot, 800);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (busy || !form.reportValidity()) return;

    const input = ensureTokenInput();
    const token = widgetId !== null && window.turnstile
      ? window.turnstile.getResponse(widgetId)
      : input.value;

    input.value = token || '';

    if (!input.value) {
      status.textContent = 'Completa la verificación de seguridad antes de enviar.';
      status.dataset.state = 'error';
      renderVisibleTurnstile();
      return;
    }

    busy = true;
    submit.disabled = true;
    status.textContent = 'Enviando consulta…';
    status.dataset.state = 'pending';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        const codes = Array.isArray(result.turnstileErrors)
          ? result.turnstileErrors.join(', ')
          : '';
        throw new Error((result.error || 'No se pudo enviar la consulta.') + (codes ? ` (${codes})` : ''));
      }

      form.reset();
      input.value = '';
      status.textContent = 'Consulta enviada correctamente. Gracias.';
      status.dataset.state = 'success';
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
    } catch (error) {
      input.value = '';
      status.textContent = error.message || 'No se pudo enviar la consulta. Inténtalo de nuevo.';
      status.dataset.state = 'error';
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
    } finally {
      busy = false;
      submit.disabled = false;
    }
  }, true);
})();
