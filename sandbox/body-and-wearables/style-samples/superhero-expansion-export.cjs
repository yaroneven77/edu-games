'use strict';

// Run with Node; --render additionally checks browser SVG bounds and makes a contact sheet.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const root = __dirname;
const bodyIds = 'head hair forehead eyes ears nose cheeks mouth lips chin jaw neck shoulders chest waist arms elbows wrists hands palms fingers legs thighs knees ankles feet heels'.split(' ');
const sentinel = { existing: true };
const context = { window: {
  IllustratedCharacters: { 'superhero-01': sentinel },
  IllustratedLayers: { 'superhero-01': sentinel },
  CharacterAccessories: { 'superhero-01': sentinel }
} };
for (const file of ['illustrated-vocabulary.js', 'illustrated-content.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, '..', file), 'utf8'), context);
}
const source = fs.readFileSync(path.join(root, 'collection-superhero.js'), 'utf8');
vm.runInNewContext(source, context);
const { IllustratedCharacters: characters, IllustratedLayers: artwork, CharacterAccessories: options } = context.window;
const vocabulary = new Map(context.window.IllustratedContent.vocabulary.map(item => [item.id, item]));
const ids = Array.from({ length: 8 }, (_, index) => `superhero-${String(index + 3).padStart(2, '0')}`);
const standalone = {};
const fragments = [];
function checkRegion(r, label) {
  for (const key of ['cx', 'cy', 'rx', 'ry']) assert(Number.isFinite(r[key]), `${label}.${key}`);
  assert(r.rx > 0 && r.ry > 0, `${label} radius`);
  const angle = (r.angle || 0) * Math.PI / 180;
  const dx = Math.hypot(r.rx * Math.cos(angle), r.ry * Math.sin(angle));
  const dy = Math.hypot(r.rx * Math.sin(angle), r.ry * Math.cos(angle));
  assert(r.cx - dx >= 0 && r.cx + dx <= 600 && r.cy - dy >= 0 && r.cy + dy <= 800, `${label} outside viewBox`);
}
function checkSvg(svg, label) {
  assert(!/<(?:image|mask|clipPath|script|foreignObject)\b|\bon\w+\s*=|(?:href|src)=/i.test(svg), `${label} forbidden markup`);
  assert(!/NaN|undefined|Infinity/.test(svg), `${label} invalid number`);
  assert(/<path\b/.test(svg), `${label} needs genuine paths`);
}
function aliases(id) {
  const entry = vocabulary.get(id);
  assert(entry, `Unknown vocabulary ID ${id}`);
  return new Set([entry.canonical, ...(entry.acceptedForms || [])].map(value => value.toLowerCase().replace(/[\s-]+/g, '')));
}
function collide(a, b) {
  const aa = aliases(a), bb = aliases(b);
  return [...aa].some(value => bb.has(value));
}
for (const registry of [characters, artwork, options]) assert.equal(registry['superhero-01'], sentinel);
for (const id of ids) {
  const character = characters[id], art = artwork[id], extra = options[id];
  assert.equal(character.id, id);
  assert.equal(character.category, 'Superhero');
  assert(character.descriptionHe && /[\u0590-\u05ff]/.test(character.descriptionHe), `${id} needs a Hebrew design description`);
  assert.equal(character.image, `./style-samples/${id}.svg`);
  assert.deepEqual(Object.keys(character.bodyRegions).sort(), [...bodyIds].sort());
  for (const [part, regions] of Object.entries(character.bodyRegions)) {
    assert(regions.length > 0, `${id}/${part} empty regions`);
    regions.forEach(region => checkRegion(region, `${id}/${part}`));
  }
  const expected = [...bodyIds, ...character.outfit.map(item => item.id)].sort();
  assert.deepEqual(Array.from(art.layers, layer => layer.id).sort(), expected);
  assert.equal(new Set(art.layers.map(layer => layer.id)).size, art.layers.length);
  for (const item of character.outfit) {
    assert(vocabulary.has(item.id), `${id}/${item.id} unknown outfit`);
    assert(item.regions.length);
    item.regions.forEach(region => checkRegion(region, `${id}/${item.id}`));
  }
  for (const layer of art.layers) {
    assert(Number.isFinite(layer.order));
    checkSvg(layer.svg, `${id}/${layer.id}`);
    fragments.push({ label: `${id}/body-or-outfit/${layer.id}`, defs: art.defs, svg: layer.svg });
  }
  assert.equal(extra.length, 10);
  assert.equal(new Set(extra.map(item => item.id)).size, 10);
  assert(new Set(extra.map(item => item.slot)).size >= 5, `${id} fewer than five compatible slots`);
  for (const item of extra) {
    assert(vocabulary.has(item.id), `${id}/${item.id} unknown accessory`);
    assert(item.en && item.he && item.slot);
    checkSvg(item.svg, `${id}/optional/${item.id}`);
    for (const base of character.outfit) assert(!collide(item.id, base.id), `${id} outfit alias ${item.id}/${base.id}`);
    fragments.push({ label: `${id}/optional/${item.id}`, defs: '', svg: item.svg });
  }
  for (let a = 0; a < extra.length; a++) {
    for (let b = a + 1; b < extra.length; b++) {
      if (extra[a].slot !== extra[b].slot) {
        assert(!collide(extra[a].id, extra[b].id), `${id} compatible alias ${extra[a].id}/${extra[b].id}`);
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-desc"><title id="${id}-title">${character.nameEn} — ${character.nameHe}</title><desc id="${id}-desc" lang="he">${character.descriptionHe}</desc>${art.defs}${art.layers.map(layer => `<g id="${id}-${layer.id}">${layer.svg}</g>`).join('')}</svg>\n`;
  const declared = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(declared).size, declared.length, `${id} duplicate SVG IDs`);
  for (const match of svg.matchAll(/url\(#([^)]+)\)/g)) assert(declared.includes(match[1]), `${id} unresolved ${match[1]}`);
  for (const item of extra) assert(!/url\(/.test(item.svg), `${id} optional defs not self-contained`);
  fs.writeFileSync(path.join(root, `${id}.svg`), svg);
  standalone[id] = svg;
  console.log(`${id}: ${character.nameEn}; 27 body + ${character.outfit.length} outfit layers; 10 accessories; ${new Set(extra.map(item => item.slot)).size} slots`);
}
vm.runInNewContext(source, context);
assert.equal(Object.keys(characters).length, 9, 'Collection must be safely reloadable');
console.log(`Exported eight SVGs; ${fragments.length} independent fragments passed structural checks.`);

async function render() {
  const browserPath = process.env.SUPERHERO_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  assert(fs.existsSync(browserPath), 'Set SUPERHERO_BROWSER to an installed Chromium browser');
  const profile = path.join(root, 'superhero-expansion-browser-profile');
  assert(!fs.existsSync(profile), 'Refusing to overwrite an existing browser profile');
  const browser = spawn(browserPath, ['--headless=new', '--no-first-run', '--disable-gpu',
    '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: ['ignore', 'ignore', 'pipe'] });
  const exit = new Promise(resolve => browser.once('exit', resolve));
  let socket;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error('Browser startup timed out')), 25000);
      browser.stderr.on('data', chunk => {
        output += chunk.toString();
        const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
      browser.once('error', error => { clearTimeout(timer); reject(error); });
      browser.once('exit', code => { clearTimeout(timer); reject(new Error(`Browser exited ${code}: ${output}`)); });
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    const pending = new Map();
    let serial = 0;
    socket.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      const waiter = pending.get(data.id);
      if (waiter) {
        pending.delete(data.id);
        clearTimeout(waiter.timer);
        if (data.error) waiter.reject(new Error(data.error.message)); else waiter.resolve(data.result);
      }
    });
    const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const id = ++serial;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout ${method}`)); }, 30000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const target = await call('Target.createTarget', { url: 'about:blank' });
    const session = (await call('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;
    const tab = (method, params) => call(method, params, session);
    await tab('Page.enable');
    await tab('Runtime.enable');
    await tab('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1130, deviceScaleFactor: 1, mobile: false });
    const boundsCheck = await tab('Runtime.evaluate', {
      expression: `(() => {
        const fragments = ${JSON.stringify(fragments)};
        const errors = [];
        for (const fragment of fragments) {
          const parsed = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">' + fragment.defs + '<g id="measured">' + fragment.svg + '</g></svg>', 'image/svg+xml');
          if (parsed.querySelector('parsererror')) { errors.push(fragment.label + ': invalid XML'); continue; }
          const svg = parsed.documentElement;
          document.body.appendChild(svg);
          const bounds = document.getElementById('measured').getBBox();
          if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > 600 || bounds.y + bounds.height > 800 || !bounds.width || !bounds.height) errors.push(fragment.label + ': ' + JSON.stringify({x:bounds.x,y:bounds.y,w:bounds.width,h:bounds.height}));
          svg.remove();
        }
        return errors;
      })()`,
      returnByValue: true
    });
    assert(!boundsCheck.exceptionDetails, JSON.stringify(boundsCheck.exceptionDetails));
    assert.deepEqual(boundsCheck.result.value, [], `Browser fragment bounds: ${JSON.stringify(boundsCheck.result.value)}`);
    const cards = ids.map(id => `<article><h2>${characters[id].nameEn}</h2>${standalone[id]}</article>`).join('');
    const html = `<html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:12px;background:#e2e8ec;font-family:Arial}main{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}article{background:#fffaf2;border:1px solid #c4cdd2;border-radius:12px;overflow:hidden}h2{margin:10px 0 0;text-align:center;color:#263544;font-size:20px}svg{display:block;width:100%;height:502px}</style></head><body><main>${cards}</main></body></html>`;
    await tab('Runtime.evaluate', { expression: `document.open();document.write(${JSON.stringify(html)});document.close();` });
    await new Promise(resolve => setTimeout(resolve, 250));
    const screenshot = await tab('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    const screenshotPath = path.join(root, 'superhero-expansion-contact.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Browser verified ${fragments.length} XML fragments and actual path bounds. Contact sheet: ${screenshotPath}`);
    for (const mode of ['accessories', 'anatomy']) {
      const sheets = ids.map(id => {
        let svg;
        if (mode === 'anatomy') {
          svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">${artwork[id].defs}${artwork[id].layers.filter(layer => bodyIds.includes(layer.id)).map(layer => layer.svg).join('')}</svg>`;
        } else {
          const slots = new Set();
          const chosen = options[id].filter(item => {
            if (slots.has(item.slot)) return false;
            slots.add(item.slot);
            return true;
          }).slice(0, 5);
          svg = standalone[id].replace('</svg>', `${chosen.map(item => item.svg).join('')}</svg>`);
        }
        return `<article><h2>${characters[id].nameEn}</h2>${svg}</article>`;
      }).join('');
      await tab('Runtime.evaluate', { expression: `document.querySelector('main').innerHTML = ${JSON.stringify(sheets)};` });
      const sheet = await tab('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      fs.writeFileSync(path.join(root, `superhero-expansion-${mode}.png`), Buffer.from(sheet.data, 'base64'));
    }
    await call('Browser.close');
  } finally {
    if (socket) socket.close();
    if (browser.exitCode === null) browser.kill();
    await exit;
    await fs.promises.rm(profile, { recursive: true, force: true, maxRetries: 15, retryDelay: 200 });
  }
}
if (process.argv.includes('--render')) render().catch(error => { console.error(error); process.exitCode = 1; });
