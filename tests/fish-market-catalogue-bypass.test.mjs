import assert from 'node:assert/strict';
import fs from 'node:fs';

const shell = fs.readFileSync('public/assets/js/international-shell.js', 'utf8');

assert.match(shell, /market-catalogue\.js/);
assert.match(shell, /products\/seafood\/fish/);
assert.match(shell, /etMarketCatalogue/);
assert.match(shell, /subcategory.*fish|fish.*subcategory/s);

console.log('Fish market-catalogue bypass guard: loader contains a fish-specific exclusion path.');
