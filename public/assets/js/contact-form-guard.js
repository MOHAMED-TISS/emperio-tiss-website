(() => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  const submit = form?.querySelector('.form-submit');
  if (!form || !status || !submit) return;

  let busy = false;

  form.addEventListener('submit', async (event) => {
    if (busy) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    // This handler owns the submission and prevents any legacy/cached handler
    // from sending a second request with the same single-use Turnstile token.
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.reportValidity()) return;

    const token = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!token) {
      status.textContent = 'Completa la verificación de seguridad antes de enviar.';
      status.dataset.state = 'error';
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
        const err = new Error(result.error || 'No se pudo enviar la consulta.');
        err.code = result.code || '';
        throw err;
      }

      status.textContent = 'Consulta enviada correctamente. Gracias.';
      status.dataset.state = 'success';
      form.reset();
      if (window.turnstile) window.turnstile.reset();
    } catch (error) {
      status.textContent = error.code
        ? `${error.message} (${error.code})`
        : (error.message || 'No se pudo enviar la consulta. Inténtalo de nuevo.');
      status.dataset.state = 'error';
      if (window.turnstile) window.turnstile.reset();
    } finally {
      busy = false;
      submit.disabled = false;
    }
  }, true);
})();
