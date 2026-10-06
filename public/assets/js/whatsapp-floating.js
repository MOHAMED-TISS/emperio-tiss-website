/* EMPERIO TISS — universal floating WhatsApp */
(() => {
  'use strict';

  if (window.__etFloatingWhatsApp) return;
  window.__etFloatingWhatsApp = true;

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
  const copy = {
    es:'Contactar por WhatsApp',
    en:'Contact us on WhatsApp',
    fr:'Contacter sur WhatsApp',
    it:'Contattaci su WhatsApp',
    ar:'تواصل معنا عبر واتساب'
  }[langCode] || 'Contactar por WhatsApp';

  if (doc.querySelector('.et-whatsapp-float')) return;

  const link = doc.createElement('a');
  link.className = 'et-whatsapp-float';
  link.href = 'https://wa.me/34614270684';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label',copy);
  link.setAttribute('title',copy);
  link.dataset.analyticsLocation = 'floating_whatsapp';
  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.52 3.49A11.78 11.78 0 0 0 12.1 0C5.55 0 .22 5.3.22 11.82c0 2.08.55 4.12 1.6 5.91L.12 24l6.43-1.68a11.9 11.9 0 0 0 5.55 1.41h.01c6.54 0 11.87-5.3 11.87-11.82 0-3.16-1.23-6.14-3.46-8.42ZM12.1 21.73h-.01a9.87 9.87 0 0 1-5.03-1.37l-.36-.22-3.82 1 1.02-3.71-.24-.38a9.76 9.76 0 0 1-1.51-5.23C2.15 6.4 6.62 2 12.11 2c2.65 0 5.15 1.03 7.02 2.9a9.82 9.82 0 0 1 2.91 7.02c0 5.41-4.47 9.81-9.94 9.81Zm5.45-7.35c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.18 5.07 4.46.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
    </svg>`;

  body.appendChild(link);
})();
