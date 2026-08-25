(()=>{'use strict';
const root=document.querySelector('.home-origin-page');
if(!root)return;
const categories=[...root.querySelectorAll('.origin-category')];
const words=[...root.querySelectorAll('.origin-value-word')];

const revealCategories=()=>{
  if(!categories.length)return;
  const section=document.querySelector('.origin-products');
  if(!section)return;
  const rect=section.getBoundingClientRect();
  const progress=Math.min(1,Math.max(0,(window.innerHeight-rect.top)/(rect.height+window.innerHeight*.25)));
  categories.forEach((el,i)=>{
    const threshold=.12+i*.12;
    el.classList.toggle('is-visible',progress>=threshold);
  });
};

const revealWords=()=>{
  if(!words.length)return;
  const section=document.querySelector('.origin-values');
  if(!section)return;
  const rect=section.getBoundingClientRect();
  const progress=Math.min(1,Math.max(0,(window.innerHeight-rect.top)/(rect.height+window.innerHeight*.1)));
  const activeCount=Math.floor(progress*(words.length+1));
  words.forEach((word,i)=>word.classList.toggle('is-on',i<activeCount));
};

let ticking=false;
const onScroll=()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
    revealCategories();
    revealWords();
    ticking=false;
  });
};

const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
if(reduce.matches){categories.forEach(el=>el.classList.add('is-visible'));words.forEach(el=>el.classList.add('is-on'));return;}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll,{passive:true});
onScroll();
})();
