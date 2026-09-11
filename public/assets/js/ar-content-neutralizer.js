(() => {
  'use strict';

  const root = document.documentElement;
  if (!(root.lang || '').toLowerCase().startsWith('ar')) return;

  const replacements = [
    [/قنوات التصدير الإسبانية المعتمدة إلى السوق السعودي/g, 'قنوات التوريد الدولية المناسبة للوجهة المطلوبة'],
    [/قنوات التصدير الإسبانية/g, 'قنوات التوريد الدولية'],
    [/السوق السعودي/g, 'السوق المستهدف'],
    [/الأسواق السعودية/g, 'الأسواق المستهدفة'],
    [/المشترين في السعودية/g, 'المشترين الدوليين'],
    [/سوق الشرق الأوسط/g, 'السوق المستهدف'],
    [/أسواق الشرق الأوسط/g, 'الأسواق المستهدفة'],
    [/الشرق الأوسط/g, 'الأسواق الدولية'],
    [/الأسواق الخليجية/g, 'الأسواق المستهدفة'],
    [/أسواق الخليج/g, 'الأسواق المستهدفة'],
    [/دول الخليج/g, 'الأسواق المستهدفة'],
    [/في الخليج/g, 'في الأسواق الدولية'],
    [/لأسواق الخليج/g, 'للأسواق الدولية'],
    [/السوق الخليجي/g, 'السوق المستهدف'],
    [/إسبانيا · فرنسا · إيطاليا · ألمانيا · هولندا/g, 'أسواق دولية متنوعة'],
    [/المغرب · تونس · موريتانيا · غرب أفريقيا/g, 'أسواق دولية متنوعة'],
    [/إسبانيا · أوروبا · أفريقيا · البحر المتوسط/g, 'الأسواق الدولية · الشراكات التجارية'],
    [/مدريد · إسبانيا · أوروبا · أفريقيا · البحر المتوسط/g, 'المقر الإداري · الأسواق الدولية'],
    [/مدريد · إسبانيا/g, 'المقر الإداري'],
    [/إسبانيا وفرنسا وإيطاليا وألمانيا إلى المغرب وتونس وموريتانيا ووجهات جديدة/g, 'مصادر وأسواق دولية متنوعة ووجهات تجارية متعددة'],
    [/من إسبانيا وفرنسا وإيطاليا وألمانيا إلى المغرب وتونس وموريتانيا ووجهات جديدة/g, 'بين مصادر وأسواق دولية متنوعة ووجهات تجارية متعددة'],
    [/إسبانيا وفرنسا وإيطاليا وألمانيا/g, 'مصادر دولية متنوعة'],
    [/المغرب وتونس وموريتانيا/g, 'أسواق دولية متنوعة'],
    [/إسبانيا/g, 'وجهة دولية'],
    [/فرنسا/g, 'وجهة دولية'],
    [/إيطاليا/g, 'وجهة دولية'],
    [/ألمانيا/g, 'وجهة دولية'],
    [/هولندا/g, 'وجهة دولية'],
    [/المغرب/g, 'وجهة دولية'],
    [/تونس/g, 'وجهة دولية'],
    [/موريتانيا/g, 'وجهة دولية'],
    [/السعودية/g, 'الوجهة المطلوبة'],
    [/الإمارات/g, 'الوجهة المطلوبة'],
    [/قطر/g, 'الوجهة المطلوبة'],
    [/الكويت/g, 'الوجهة المطلوبة'],
    [/البحرين/g, 'الوجهة المطلوبة'],
    [/عُمان/g, 'الوجهة المطلوبة'],
    [/الأردن/g, 'الوجهة المطلوبة'],
    [/لبنان/g, 'الوجهة المطلوبة'],
    [/مصر/g, 'الوجهة المطلوبة'],
    [/ليبيا/g, 'الوجهة المطلوبة'],
    [/الجزائر/g, 'الوجهة المطلوبة'],
    [/تركيا/g, 'الوجهة المطلوبة'],
    [/العراق/g, 'الوجهة المطلوبة'],
    [/سوريا/g, 'الوجهة المطلوبة']
  ];

  const neutralizeString = (value) => {
    let next = String(value ?? '');
    for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement);
    return next;
  };

  const neutralizeTextNodes = (scope) => {
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
      const next = neutralizeString(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  };

  const neutralizeMetadata = () => {
    document.querySelectorAll('meta[content], title').forEach((el) => {
      if (el.matches('meta[name="viewport"], meta[name="robots"], meta[http-equiv]')) return;
      if (el.tagName.toLowerCase() === 'title') {
        el.textContent = neutralizeString(el.textContent);
        return;
      }
      const content = el.getAttribute('content');
      if (content) el.setAttribute('content', neutralizeString(content));
    });
  };

  const run = () => {
    if (!document.body) return;
    neutralizeTextNodes(document.body);
    neutralizeMetadata();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData' && mutation.target.parentElement) {
        const node = mutation.target;
        if (!node.parentElement.closest('script,style,noscript,[data-latin="true"],.scientific-name,.technical-value')) {
          const next = neutralizeString(node.nodeValue);
          if (next !== node.nodeValue) node.nodeValue = next;
        }
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const next = neutralizeString(node.nodeValue);
            if (next !== node.nodeValue) node.nodeValue = next;
          } else if (node.nodeType === Node.ELEMENT_NODE && !/^(SCRIPT|STYLE|NOSCRIPT)$/i.test(node.tagName)) {
            neutralizeTextNodes(node);
          }
        });
      }
    }
    neutralizeMetadata();
  });

  const startObserver = () => document.body && observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  if (document.body) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver, { once: true });
})();
