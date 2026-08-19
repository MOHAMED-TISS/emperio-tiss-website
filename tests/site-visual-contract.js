const fs = require('fs');

const css = fs.readFileSync('public/style.css', 'utf8');

const required = [
  '--et-ivory',
  '--et-gold',
  '.site-header',
  '.header-inner',
  'font-size: clamp(44px, 7vw, 92px)',
  'body:not(.nav-open)'
];

for (const token of required) {
  if (!css.includes(token)) {
    throw new Error(`Missing site-wide visual contract: ${token}`);
  }
}

console.log('PASS: site-wide visual contract');
