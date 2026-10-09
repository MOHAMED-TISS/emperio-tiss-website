import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const p=path.join(dir,entry.name);
  return entry.isDirectory()?walk(p):[p];
});

const universal=fs.readFileSync('public/assets/js/header-universal.js','utf8');

test('the 2026 header is the only header runtime',()=>{
  // the legacy canonical header and its stylesheets were retired: nothing may load them again.
  for(const file of ['public/assets/js/header-canonical.js','public/assets/css/header-final.css']) assert.ok(!fs.existsSync(file),file+' must stay removed');
  const legacy=/header-canonical\.js|header-final\.css|header-joby-experience\.css|header-liquid-v23\.css|canonical-nav\.css/;
  for(const file of walk('public').filter(file=>/\.(html|js)$/.test(file))){
    assert.doesNotMatch(fs.readFileSync(file,'utf8'),legacy,file+' still loads a retired legacy header asset');
  }
  // the Signature portal is a standalone app: no public header in any language
  assert.match(fs.readFileSync('public/assets/js/international-shell.js','utf8'),/private-page, \.private-admin-page'\)\) return/);

  const global=fs.readFileSync('public/assets/js/global.js','utf8');
  assert.match(global,/header-universal\.js\?v=/);
});

test('legacy overlays nested inside old headers are moved to <body> by the 2026 header',()=>{
  // header-universal.js relocates #navOverlay before replacing or removing a legacy header,
  // so pages that still nest the overlay keep a working menu regardless of their global.js version.
  assert.match(universal,/#navOverlay/);
  assert.match(universal,/body\.appendChild\((legacyOverlay|overlay)\)/);

  for(const file of walk('public').filter(file=>file.endsWith('.html'))){
    const html=fs.readFileSync(file,'utf8');
    const overlay=html.indexOf('id="navOverlay"');
    if(overlay<0) continue;
    const headerStart=html.lastIndexOf('<header',overlay);
    const headerEnd=headerStart>=0?html.indexOf('</header>',headerStart):-1;
    if(headerStart>=0 && headerEnd>=0 && overlay<headerEnd){
      // the page must load the 2026 header, directly or through global.js
      assert.match(html,/header-universal\.js|global\.js/,file+' must load the 2026 header runtime');
    }
  }
});
