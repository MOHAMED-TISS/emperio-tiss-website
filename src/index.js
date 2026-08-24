const ALLOWED_ORIGINS = new Set([
  'https://emperio-tiss.com',
  'https://www.emperio-tiss.com',
]);

const RESEND_API_URL = 'https://api.resend.com/emails';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function normalize(value, max = 4000) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(value) {
  return normalize(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function handleContact(request, env) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return json({ ok: false, error: 'Origen no autorizado.' }, 403);
  }

  const form = await request.formData();
  if (normalize(form.get('_honey'), 200)) {
    return json({ ok: false, error: 'Solicitud rechazada.' }, 400);
  }

  const nombre = normalize(form.get('nombre'), 120);
  const empresa = normalize(form.get('empresa'), 160);
  const email = normalize(form.get('email'), 254);
  const telefono = normalize(form.get('telefono'), 80);
  const producto = normalize(form.get('producto'), 120);
  const destino = normalize(form.get('destino'), 160);
  const mensaje = normalize(form.get('mensaje'), 4000);

  if (!nombre || !empresa || !email || !telefono || !producto || !destino || !mensaje) {
    return json({ ok: false, error: 'Completa todos los campos obligatorios.', code: 'VALIDATION_FAILED' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Introduce un email válido.', code: 'INVALID_EMAIL' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'El servicio de email no está configurado.', code: 'RESEND_KEY_MISSING' }, 500);
  }

  const html = `
    <h2>Nueva consulta B2B — EMPERIO TISS</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
    <p><strong>Producto:</strong> ${escapeHtml(producto)}</p>
    <p><strong>Destino:</strong> ${escapeHtml(destino)}</p>
    <p><strong>Necesidad:</strong></p>
    <p>${escapeHtml(mensaje).replaceAll('\n', '<br>')}</p>
  `;

  const resendResponse = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'EMPERIO TISS <no-reply@emperio-tiss.com>',
      to: ['info@emperio-tiss.com'],
      reply_to: email,
      subject: `Nueva consulta B2B — ${empresa} — ${producto}`,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const responseText = await resendResponse.text().catch(() => '');
    return json({
      ok: false,
      error: 'No se pudo enviar la consulta. Inténtalo de nuevo.',
      code: `RESEND_${resendResponse.status}`,
      detail: responseText.slice(0, 300),
    }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405);
      try {
        return await handleContact(request, env);
      } catch (error) {
        return json({
          ok: false,
          error: 'No se pudo procesar la consulta.',
          code: 'CONTACT_HANDLER_ERROR',
          detail: String(error?.message || error).slice(0, 200),
        }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
