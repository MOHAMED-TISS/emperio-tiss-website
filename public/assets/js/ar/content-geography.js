(() => {
  'use strict';

  const root = document.documentElement;
  if (!(root.lang || '').toLowerCase().startsWith('ar')) return;

  const MENA = 'منطقة الشرق الأوسط وشمال أفريقيا (MENA)';
  const replacements = [
    [/قنوات التصدير الإسبانية المعتمدة إلى السوق السعودي/g, `قنوات التوريد الدولية المناسبة إلى ${MENA}`],
    [/قنوات التصدير الإسبانية/g, `قنوات التوريد الدولية إلى ${MENA}`],
    [/السوق السعودي/g, `سوق ${MENA}`],
    [/الأسواق السعودية/g, `أسواق ${MENA}`],
    [/المشترين في السعودية/g, `المشترين في ${MENA}`],
    [/سوق الشرق الأوسط/g, `سوق ${MENA}`],
    [/أسواق الشرق الأوسط/g, `أسواق ${MENA}`],
    [/دول الخليج/g, MENA],
    [/أسواق الخليج/g, `أسواق ${MENA}`],
    [/الأسواق الخليجية/g, `أسواق ${MENA}`],
    [/السوق الخليجي/g, `سوق ${MENA}`],
    [/في الخليج/g, `في ${MENA}`],
    [/لأسواق الخليج/g, `لأسواق ${MENA}`],
    [/إسبانيا · فرنسا · إيطاليا · ألمانيا · هولندا/g, MENA],
    [/المغرب · تونس · موريتانيا · غرب أفريقيا/g, MENA],
    [/إسبانيا · أوروبا · أفريقيا · البحر المتوسط/g, MENA],
    [/إسبانيا وفرنسا وإيطاليا وألمانيا إلى المغرب وتونس وموريتانيا ووجهات جديدة/g, `داخل ${MENA} وعبر وجهات تجارية دولية`],
    [/من إسبانيا وفرنسا وإيطاليا وألمانيا إلى المغرب وتونس وموريتانيا ووجهات جديدة/g, `داخل ${MENA} وعبر وجهات تجارية دولية`]
  ];

  const normalize = (value) => {
    let next = String(value || '');
    for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement);
    return next;
  };

  const scan = (scope) => {
    if (!scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-latin="true"], .scientific-name, .technical-value')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const next = normalize(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  };

  const commercialSelectors = [
    '.markets-section',
    '.markets-current',
    '.market-catalogue__context',
    '.market-catalogue__intro',
    '.market-catalogue__title',
    '.ar-fish-gcc-note'
  ];

  const run = () => {
    for (const selector of commercialSelectors) document.querySelectorAll(selector).forEach(scan);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();

  const observer = new MutationObserver(() => run());
  const start = () => document.body && observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
