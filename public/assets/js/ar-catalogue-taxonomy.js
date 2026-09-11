(() => {
  'use strict';
  if ((document.documentElement.lang || '').slice(0, 2).toLowerCase() !== 'ar') return;

  const path = (location.pathname || '/').replace(/\/+/g, '/');
  const expected = path.includes('/seafood/shellfish/') ? 'الرخويات' :
    path.includes('/seafood/cephalopods/') ? 'رأسيات الأرجل' : null;
  if (!expected) return;

  const patch = () => {
    document.querySelectorAll('.market-catalogue__title').forEach((title) => {
      const textNode = Array.from(title.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.nodeValue = `${expected} `;
    });
    const context = document.querySelectorAll('.market-catalogue__context .market-catalogue__tag');
    if (context[1]) context[1].textContent = expected;
  };

  patch();
  new MutationObserver(patch).observe(document.body, { childList: true, subtree: true });
})();
