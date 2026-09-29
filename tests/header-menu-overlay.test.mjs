import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const p=path.join(dir,entry.name);
  return entry.isDirectory()?walk(p):[p];
});

test('canonical header preserves a legacy nav overlay before replacing the header',()=>{
  const canonical=fs.readFileSync('public/assets/js/header-canonical.js','utf8');
  const preserve=canonical.indexOf('const preservedOverlay');
  const replace=canonical.indexOf('header.replaceWith(canonical)');
  assert.ok(preserve>=0,'preservedOverlay guard is missing');
  assert.ok(replace>preserve,'overlay must be detached before the legacy header is replaced');

  const global=fs.readFileSync('public/assets/js/global.js','utf8');
  assert.match(global,/header-canonical\.js\?v=20260929-overlay-preserve-1/);
});

test('pages that still nest navOverlay inside the legacy header force the fixed runtime',()=>{
  const nested=[];
  for(const file of walk('public').filter(file=>file.endsWith('.html'))){
    const html=fs.readFileSync(file,'utf8');
    const overlay=html.indexOf('id="navOverlay"');
    if(overlay<0) continue;
    const headerStart=html.lastIndexOf('<header',overlay);
    const headerEnd=headerStart>=0?html.indexOf('</header>',headerStart):-1;
    if(headerStart>=0 && headerEnd>=0 && overlay<headerEnd){
      nested.push(file.replaceAll('\\','/'));
      assert.match(html,/global\.js\?v=20260929-menu-overlay-fix-1/,file+' must force the fixed global runtime');
    }
  }
  assert.deepEqual(nested.sort(),[
    'public/products/fruits/index.html',
    'public/products/seafood/cephalopods/index.html',
    'public/products/seafood/shellfish/index.html',
    'public/products/vegetables/index.html'
  ]);
});
