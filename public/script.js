/* EMPERIO TISS — GLOBAL SITE INTERACTIONS */

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  const body = document.body;

  if (path.includes("seafood")) body.classList.add("et-seafood");
  else if (path.includes("fruits-vegetables")) body.classList.add("et-produce");
  else if (path.includes("seasonal")) body.classList.add("et-seasonal");
  else if (path.includes("news")) body.classList.add("et-news");
  else body.classList.add("et-corporate");

  const style = document.createElement("style");
  style.id = "et-global-header-v2";
  style.textContent = `
    #luxuryHeader{position:fixed!important;top:0!important;left:0!important;right:0!important;height:84px!important;z-index:2147483000!important;pointer-events:none!important;background:transparent!important}
    #luxuryHeader .header-inner{position:relative!important;box-sizing:border-box!important;width:min(1320px,calc(100% - 32px))!important;height:64px!important;margin:10px auto 0!important;padding:0 10px 0 18px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border:1px solid rgba(235,220,184,.28)!important;border-radius:20px!important;background:rgba(7,28,23,.91)!important;box-shadow:0 16px 42px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.07)!important;backdrop-filter:blur(22px) saturate(130%)!important;-webkit-backdrop-filter:blur(22px) saturate(130%)!important;pointer-events:auto!important}
    #luxuryHeader .site-logo{display:flex!important;align-items:center!important;height:100%!important;min-width:0!important}
    #luxuryHeader .site-logo img{display:block!important;width:auto!important;max-width:122px!important;max-height:42px!important;object-fit:contain!important;filter:drop-shadow(0 2px 8px rgba(0,0,0,.45))!important}
    #luxuryHeader #menuToggleBtn{position:relative!important;width:48px!important;height:48px!important;flex:0 0 48px!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;border:1px solid rgba(235,220,184,.38)!important;border-radius:50%!important;background:rgba(255,255,255,.055)!important;color:#f5efe2!important;cursor:pointer!important;z-index:2147483002!important;transition:background .3s ease,border-color .3s ease,transform .3s ease!important}
    #luxuryHeader #menuToggleBtn:hover{background:rgba(201,163,95,.14)!important;border-color:#dfc88c!important;transform:translateY(-1px)!important}
    #luxuryHeader #menuToggleBtn span{display:block!important;width:21px!important;height:1px!important;flex:0 0 1px!important;background:#f5efe2!important;opacity:1!important;visibility:visible!important;pointer-events:none!important;transition:transform .35s ease,opacity .2s ease!important}
    body.nav-open #luxuryHeader #menuToggleBtn span{position:absolute!important;width:23px!important}
    body.nav-open #luxuryHeader #menuToggleBtn span:first-child{transform:rotate(45deg)!important}
    body.nav-open #luxuryHeader #menuToggleBtn span:nth-child(2){opacity:0!important}
    body.nav-open #luxuryHeader #menuToggleBtn span:last-child{transform:rotate(-45deg)!important}
    #navOverlay{position:fixed!important;inset:0!important;z-index:2147482990!important;display:block!important;overflow-x:hidden!important;overflow-y:auto!important;background:radial-gradient(circle at 82% 12%,rgba(201,163,95,.15),transparent 28%),linear-gradient(145deg,#061d17,#103b2f 62%,#071f19)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-12px)!important;transition:opacity .42s ease,transform .55s ease,visibility 0s linear .42s!important}
    body.nav-open #navOverlay{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important;transition:opacity .42s ease,transform .55s ease,visibility 0s linear 0s!important}
    #navOverlay .nav-overlay-inner{min-height:100%!important;box-sizing:border-box!important;padding:118px 7vw 30px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important}
    #navOverlay .nav-overlay-links{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:2px!important;margin:0!important;padding:0!important}
    #navOverlay .nav-overlay-links a{display:flex!important;align-items:baseline!important;gap:18px!important;width:max-content!important;padding:5px 0!important;color:#f5efe2!important;text-decoration:none!important;font:400 clamp(36px,5vw,66px)/1 "Playfair Display",serif!important;letter-spacing:-.025em!important;opacity:0!important;transform:translateY(16px)!important;transition:opacity .42s ease,transform .42s ease,color .25s ease!important}
    body.nav-open #navOverlay .nav-overlay-links a{opacity:1!important;transform:none!important}
    #navOverlay .nav-overlay-links a:hover{color:#dfc88c!important;transform:translateX(8px)!important}
    #navOverlay .idx{width:28px!important;min-width:28px!important;color:#c9a35f!important;font:600 9px/1 "DM Sans",sans-serif!important;letter-spacing:.12em!important}
    #navOverlay .nav-overlay-side{display:none!important}
    #navOverlay .nav-overlay-foot{display:flex!important;justify-content:space-between!important;align-items:flex-end!important;gap:20px!important;padding-top:30px!important;border-top:1px solid rgba(245,239,226,.14)!important}
    #navOverlay .nav-overlay-lang{display:flex!important;gap:10px!important;font:600 9px/1 "DM Sans",sans-serif!important;letter-spacing:.14em!important}.nav-overlay-lang a{color:rgba(245,239,226,.58)!important;text-decoration:none!important}.nav-overlay-lang a.current,.nav-overlay-lang a:hover{color:#dfc88c!important}
    #navOverlay .nav-overlay-contact{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:4px!important;color:rgba(245,239,226,.55)!important;font:500 9px/1.5 "DM Sans",sans-serif!important;letter-spacing:.05em!important}.nav-overlay-contact a{color:#f5efe2!important;text-decoration:none!important}
    body.et-seafood #luxuryHeader .header-inner{background:linear-gradient(135deg,rgba(3,25,31,.95),rgba(4,54,60,.88))!important;border-color:rgba(201,181,126,.34)!important}
    body.et-produce #luxuryHeader .header-inner{background:linear-gradient(135deg,rgba(13,39,27,.95),rgba(39,72,42,.88))!important;border-color:rgba(201,181,126,.30)!important}
    body.et-seasonal #luxuryHeader .header-inner{background:linear-gradient(135deg,rgba(28,39,31,.95),rgba(67,91,70,.88))!important;border-color:rgba(219,203,160,.30)!important}
    body.et-news #luxuryHeader .header-inner{background:linear-gradient(135deg,rgba(27,25,21,.96),rgba(67,54,37,.88))!important;border-color:rgba(219,191,132,.32)!important}
    #pageCurtain,.page-curtain{pointer-events:none!important;opacity:0!important;visibility:hidden!important;transform:translateY(-100%)!important;z-index:2147483005!important}
    #pageCurtain.is-covering,.page-curtain.is-covering{opacity:1!important;visibility:visible!important;transform:translateY(0)!important}
    @media(max-width:700px){#luxuryHeader{height:76px!important}#luxuryHeader .header-inner{width:calc(100% - 20px)!important;height:58px!important;margin-top:8px!important;padding-left:12px!important;border-radius:18px!important}#luxuryHeader .site-logo img{max-width:104px!important;max-height:38px!important}#luxuryHeader #menuToggleBtn{width:44px!important;height:44px!important;flex-basis:44px!important}#navOverlay .nav-overlay-inner{padding:96px 24px 24px!important}#navOverlay .nav-overlay-links a{width:100%!important;font-size:clamp(30px,9vw,45px)!important;gap:10px!important;padding:7px 0!important}#navOverlay .idx{width:24px!important;min-width:24px!important;font-size:8px!important}#navOverlay .nav-overlay-foot{flex-direction:column!important;align-items:flex-start!important}.nav-overlay-contact{align-items:flex-start!important}}
  `;
  document.head.appendChild(style);

  let overlay = document.getElementById("navOverlay");
  const english = path.startsWith("/en/") || path === "/en" || path.includes("/en/");
  const labels = english ? ["Home","Company","Products","Markets","News","Contact"] : ["Inicio","Empresa","Productos","Mercados","Noticias","Contacto"];
  const links = english ? ["/en/index.html","/en/about/index.html","/en/products/index.html","/en/markets/index.html","/en/news/index.html","/en/contact/index.html"] : ["/index.html","/about/index.html","/products/index.html","/markets/index.html","/news/index.html","/contact/index.html"];

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "navOverlay";
    overlay.className = "nav-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<div class="nav-overlay-inner"><nav class="nav-overlay-links" aria-label="${english ? "Main navigation" : "Navegación principal"}">${labels.map((label,i)=>`<a href="${links[i]}"><span class="idx">${String(i+1).padStart(2,"0")}</span><span>${label}</span></a>`).join("")}</nav><div class="nav-overlay-foot"><div class="nav-overlay-lang"><a class="current" href="/index.html">ES</a><span>·</span><a href="/en/index.html">EN</a><span>·</span><a href="/fr/index.html">FR</a><span>·</span><a href="/ar/index.html">AR</a></div><div class="nav-overlay-contact"><a href="${english ? "/en/contact/index.html" : "/contact/index.html"}">${english ? "Business enquiry ↗" : "Consulta empresarial ↗"}</a><span>Madrid · Europa · África · Mediterráneo</span></div></div></div>`;
    document.body.appendChild(overlay);
  } else {
    const nav = overlay.querySelector(".nav-overlay-links");
    if (nav) nav.innerHTML = labels.map((label,i)=>`<a href="${links[i]}"><span class="idx">${String(i+1).padStart(2,"0")}</span><span>${label}</span></a>`).join("");
  }

  const button = document.getElementById("menuToggleBtn") || document.querySelector(".mobile-menu");
  if (button && overlay) {
    button.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? (english ? "Close menu" : "Cerrar menú") : (english ? "Open menu" : "Abrir menú"));
      overlay.setAttribute("aria-hidden", String(!open));
      document.documentElement.style.overflow = open ? "hidden" : "";
    });
    overlay.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      body.classList.remove("nav-open");
      button.setAttribute("aria-expanded", "false");
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
    }));
  }

  const replacements = [
    [/comercio internacional/gi, "operaciones internacionales"],
    [/relaciones comerciales/gi, "relaciones profesionales"],
    [/conecta productos, productores y compradores/gi, "ofrece productos seleccionados y soluciones profesionales"],
    [/conectar productos, productores y compradores/gi, "ofrecer productos seleccionados y soluciones profesionales"],
    [/del origen al mercado/gi, "food moves. markets connect."],
    [/from origin to market\. with purpose\.?/gi, "Food moves. Markets connect."],
    [/trade/gi, "operations"],
    [/trading/gi, "operations"]
  ];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    if (!node.nodeValue.trim()) return;
    let value = node.nodeValue;
    replacements.forEach(([pattern,replacement]) => { value = value.replace(pattern,replacement); });
    if (value !== node.nodeValue) node.nodeValue = value;
  });

  const header = document.querySelector("#luxuryHeader,.site-header");
  const updateHeader = () => { if (header) header.classList.toggle("scrolled", window.scrollY > 30); };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive:true });

  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior:"smooth", block:"start" });
  }));

  if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const pointer = document.createElement("div");
    pointer.className = "premium-pointer";
    document.body.appendChild(pointer);
    document.addEventListener("mousemove", e => { pointer.style.left=`${e.clientX}px`; pointer.style.top=`${e.clientY}px`; });
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter",()=>pointer.classList.add("active"));
      el.addEventListener("mouseleave",()=>pointer.classList.remove("active"));
    });
  }
});
