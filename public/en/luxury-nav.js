/* EMPERIO TISS — navigation, page identity, transitions */
(function(){
  "use strict";
  var CURTAIN_MS=650;

  function pageIdentity(){
    var p=window.location.pathname.toLowerCase();
    var type=p.indexOf("seafood")>-1?"seafood":p.indexOf("fruits-vegetables")>-1?"produce":p.indexOf("seasonal")>-1?"seasonal":"standard";
    document.body.setAttribute("data-site-page",type);
  }

  function addNewsLink(){
    var nav=document.querySelector("#navOverlay .nav-overlay-links");
    if(!nav||nav.querySelector('[data-news-link]'))return;
    var a=document.createElement("a");
    a.href=window.location.pathname.indexOf("/products/")>-1?"../news/index.html":"news/index.html";
    a.setAttribute("data-news-link","");
    a.innerHTML='<span class="idx">05</span><span>News</span>';
    var links=nav.querySelectorAll(":scope > a");
    var contact=Array.prototype.find.call(links,function(x){return /contact/i.test(x.textContent)});
    if(contact){
      var all=Array.prototype.slice.call(links);
      var n=all.indexOf(contact);
      if(n>-1) nav.insertBefore(a,contact);
      else nav.appendChild(a);
    }else nav.appendChild(a);
    nav.querySelectorAll(":scope > a").forEach(function(x,i){var idx=x.querySelector(".idx");if(idx)idx.textContent=String(i+1).padStart(2,"0")});
  }

  function initCurtain(){
    var c=document.getElementById("pageCurtain");
    if(!c){c=document.createElement("div");c.id="pageCurtain";c.className="page-curtain";document.body.appendChild(c)}
    c.classList.remove("is-covering");
    c.classList.add("is-hidden");
    return c;
  }

  function internal(link){
    if(!link||!link.href||link.target==="_blank"||link.hasAttribute("download"))return false;
    if(/^mailto:|^tel:/i.test(link.href))return false;
    var u=new URL(link.href,location.href);return u.origin===location.origin;
  }

  function initTransitions(c){
    document.addEventListener("click",function(e){
      var link=e.target.closest("a");if(!internal(link))return;
      var u=new URL(link.href,location.href);
      if(u.pathname===location.pathname&&u.hash)return;
      e.preventDefault();
      document.body.classList.remove("nav-open");
      var b=document.getElementById("menuToggleBtn");
      if(b){b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Open menu")}
      c.classList.remove("is-hidden");c.classList.add("is-covering");
      setTimeout(function(){location.href=link.href},CURTAIN_MS);
    });
  }

  function initMenu(){
    var trigger=document.getElementById("menuToggleBtn"),overlay=document.getElementById("navOverlay");
    if(!trigger||!overlay)return;
    trigger.addEventListener("click",function(){
      document.body.classList.toggle("nav-open");
      var open=document.body.classList.contains("nav-open");
      trigger.setAttribute("aria-expanded",open?"true":"false");
      trigger.setAttribute("aria-label",open?"Close menu":"Open menu");
    });
    document.addEventListener("keydown",function(e){if(e.key==="Escape"){document.body.classList.remove("nav-open");trigger.setAttribute("aria-expanded","false")}});
  }

  document.addEventListener("DOMContentLoaded",function(){
    pageIdentity();
    addNewsLink();
    var curtain=initCurtain();
    initTransitions(curtain);
    initMenu();
  });
})();
