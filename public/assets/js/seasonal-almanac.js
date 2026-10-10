/* EMPERIO TISS — Seasonal almanac: names the current month, marks it in the calendar and lists
   the vegetables with high availability now (read from the calendar table the page already carries). */
(() => {
  'use strict';
  const page = document.querySelector('.sa-page');
  if (!page) return;
  let months = [];
  try { months = JSON.parse(page.dataset.monthsLong || '[]'); } catch (_) {}
  const now = new Date().getMonth();
  const next = (now + 1) % 12;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  if (months[now]) page.querySelectorAll('[data-sa-month]').forEach(el => { el.textContent = months[now]; });
  page.querySelectorAll(`.sa-cal [data-m="${now}"]`).forEach(el => el.classList.add('is-now'));

  const section = page.querySelector('.sa-now');
  const grid = page.querySelector('[data-sa-now]');
  if (!section || !grid) return;
  const label = { 3: section.dataset.high, 2: section.dataset.medium, 1: section.dataset.limited };
  const lang = document.documentElement.lang || 'es';
  const prefix = lang === 'es' ? '' : `/${lang}`;
  const rows = [...page.querySelectorAll('.sa-cal__row')].map(row => ({
    id: row.dataset.id,
    ref: row.dataset.ref,
    name: row.querySelector('.sa-cal__name span')?.textContent || row.dataset.id,
    es: row.dataset.es.split(',').map(Number),
    ma: row.dataset.ma.split(',').map(Number)
  }));
  const peak = (r, m) => Math.max(r.es[m], r.ma[m]);
  let picks = rows.filter(r => peak(r, now) === 3);
  if (!picks.length) picks = rows.filter(r => peak(r, now) === 2);

  const origin = (name, level) => level ? `<li class="sa-o${level}"><i></i>${esc(name)} · ${esc(label[level] || '')}</li>` : '';
  grid.innerHTML = picks.map(r => `
    <a class="sa-card" href="${prefix}/products/vegetables/">
      <span class="sa-card__photo">
        <img class="sa-img--light" src="/assets/images/vegetables/${r.id}-600.webp" alt="" width="600" height="750" loading="lazy" decoding="async">
        <img class="sa-img--dark" src="/assets/images/vegetables/${r.id}-dark-600.webp" alt="" width="600" height="750" loading="lazy" decoding="async">
      </span>
      <span class="sa-card__body">
        <span class="sa-card__ref">REF ${esc(r.ref)}</span>
        <h3>${esc(r.name)}</h3>
        <ul class="sa-card__origins">${origin(section.dataset.spain, r.es[now])}${origin(section.dataset.morocco, r.ma[now])}</ul>
      </span>
    </a>`).join('');

  const entering = rows.filter(r => peak(r, next) === 3 && peak(r, now) < 3).map(r => r.name);
  const wrap = page.querySelector('[data-sa-next-wrap]');
  if (wrap && entering.length) {
    wrap.querySelector('[data-sa-next-month]').textContent = months[next] || '';
    wrap.querySelector('[data-sa-next]').textContent = entering.join(' · ');
    wrap.hidden = false;
  }
})();
