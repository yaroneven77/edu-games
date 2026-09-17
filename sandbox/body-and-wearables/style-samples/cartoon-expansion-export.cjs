/* Regenerate only cartoon-03..10; no existing art or integration files are modified. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = __dirname;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'collection-cartoon.js'), 'utf8'), context);
const expectedBody = 'head hair forehead eyes ears nose cheeks mouth lips chin jaw neck shoulders chest waist arms elbows wrists hands palms fingers legs thighs knees ankles feet heels'.split(' ');
const vocabularyContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, '..', 'illustrated-vocabulary.js'), 'utf8'), vocabularyContext);
const vocabulary = new Set(vocabularyContext.window.BodyWearablesVocabulary.map(word => word.id));
const extras = fs.readFileSync(path.join(root, '..', 'illustrated-content.js'), 'utf8');
for (const match of extras.matchAll(/extra\("([^"]+)"/g)) vocabulary.add(match[1]);
function checkEllipse(e) {
  assert([e.cx, e.cy, e.rx, e.ry, e.angle || 0].every(Number.isFinite));
  assert(e.rx > 0 && e.ry > 0);
  const angle = (e.angle || 0) * Math.PI / 180;
  const dx = Math.hypot(e.rx * Math.cos(angle), e.ry * Math.sin(angle));
  const dy = Math.hypot(e.rx * Math.sin(angle), e.ry * Math.cos(angle));
  assert(e.cx - dx >= 0 && e.cx + dx <= 600 && e.cy - dy >= 0 && e.cy + dy <= 800,
    `Out-of-bounds ellipse: ${JSON.stringify(e)}`);
}
function references(svg, namespace) {
  assert(!/<(?:image|mask|clipPath|script|foreignObject)\b/i.test(svg), 'Forbidden SVG element');
  const definitions = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(definitions).size, definitions.length, 'Repeated definition');
  if (namespace) assert(definitions.every(id => id.startsWith(`${namespace}-`)), 'Unnamespaced definition');
  for (const match of svg.matchAll(/url\(#([^)]+)\)/g)) assert(definitions.includes(match[1]), `Missing definition ${match[1]}`);
}
const ids = Object.keys(context.window.IllustratedCharacters);
assert.equal(ids.length, 8);
let layerCount = 0, outfitCount = 0;
for (let n = 3; n <= 10; n++) {
  const id = `cartoon-${String(n).padStart(2, '0')}`;
  const character = context.window.IllustratedCharacters[id];
  const art = context.window.IllustratedLayers[id];
  const accessories = context.window.CharacterAccessories[id];
  assert(character && art && accessories);
  assert.equal(character.category, 'Cartoon');
  assert(character.descriptionHe && /[\u0590-\u05ff]/.test(character.descriptionHe));
  assert.deepEqual(Object.keys(character.bodyRegions).sort(), [...expectedBody].sort());
  const outfits = character.outfit.map(item => item.id);
  assert(outfits.every(item => vocabulary.has(item)));
  const targetIDs = [...expectedBody, ...outfits];
  assert.equal(new Set(targetIDs).size, targetIDs.length);
  assert.deepEqual(Array.from(art.layers, layer => layer.id).sort(), [...targetIDs].sort());
  assert(art.layers.every((layer, i) => layer.svg.length > 20 && (!i || layer.order >= art.layers[i - 1].order)));
  assert.equal(new Set(art.layers.map(layer => layer.svg)).size, art.layers.length, 'Duplicate geometry');
  for (const regions of Object.values(character.bodyRegions)) {
    assert(regions.length);
    regions.forEach(checkEllipse);
  }
  for (const item of character.outfit) {
    assert(item.regions.length);
    item.regions.forEach(checkEllipse);
  }
  assert.equal(accessories.length, 10);
  assert.equal(new Set(accessories.map(item => item.id)).size, 10);
  assert(new Set(accessories.map(item => item.slot)).size >= 5);
  for (const accessory of accessories) {
    assert(vocabulary.has(accessory.conceptId || accessory.id));
    assert(!outfits.includes(accessory.conceptId || accessory.id));
    assert(accessory.en && accessory.he && accessory.svg);
    references(accessory.svg);
    if (accessory.rearSvg) references(accessory.rearSvg);
    if (['cap', 'hat', 'beret', 'headband', 'hair-clip', 'earmuffs'].includes(accessory.id)) assert.equal(accessory.slot, 'headwear');
  }
  for (const aliases of [['shirt', 'T-shirt'], ['boots', 'trainers', 'shoes'], ['necklace', 'whistle']]) {
    assert(outfits.filter(item => aliases.includes(item)).length <= 1);
  }
  references(art.defs + art.layers.map(layer => layer.svg).join(''), id);
  const description = character.descriptionHe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-desc">
  <title id="${id}-title">${character.nameEn} — ${character.nameHe}</title>
  <desc id="${id}-desc" xml:lang="he">${description}</desc>
  ${art.defs}
  ${art.layers.map(layer => `<g data-layer="${layer.id}">${layer.svg}</g>`).join('\n  ')}
</svg>\n`;
  fs.writeFileSync(path.join(root, `${id}.svg`), svg, 'utf8');
  layerCount += art.layers.length;
  outfitCount += outfits.length;
  console.log(`${id}: ${character.nameEn}; 27 body, ${outfits.length} outfit, 10 accessory layers`);
}
console.log(`Validated/exported: 8 characters, ${layerCount} base layers (${outfitCount} outfit), 80 accessories.`);
if (process.argv.includes('--preview')) {
  const cards = ids.map(id => {
    const c = context.window.IllustratedCharacters[id];
    let svg = fs.readFileSync(path.join(root, `${id}.svg`), 'utf8');
    if (process.argv.includes('--accessories')) {
      const slots = new Set();
      const selected = context.window.CharacterAccessories[id].filter(a => {
        if (slots.has(a.slot)) return false;
        slots.add(a.slot);
        return true;
      });
      svg = svg.replace('<g data-layer=', `${selected.map(a => a.rearSvg || '').join('')}<g data-layer=`)
        .replace('</svg>', `${selected.map(a => a.svg).join('')}</svg>`);
    }
    return `<article><h2>${c.nameEn} · ${c.nameHe}</h2>${svg}</article>`;
  }).join('');
  const accessoryCards = ids.map(id => {
    const art = context.window.IllustratedLayers[id];
    return context.window.CharacterAccessories[id].map(a =>
      `<svg class="measure" viewBox="0 0 600 800" data-accessory="${id}/${a.id}">${a.svg}</svg>`).join('') +
      art.layers.map(layer => `<svg class="measure" viewBox="0 0 600 800" data-base="${id}/${layer.id}">${art.defs}${layer.svg}</svg>`).join('');
  }).join('');
  const html = `<!doctype html><meta charset="utf-8"><title>Cartoon expansion visual validation</title>
  <style>*{box-sizing:border-box}body{margin:0;background:#f4efe4;font-family:Arial}
  main{display:grid;grid-template-columns:repeat(4,300px);gap:0}article{height:435px;border:1px solid #e0d7ca;background:#faf7ed}
  h2{text-align:center;margin:10px 0 0;font-size:18px;color:#494453}article svg{display:block;width:300px;height:400px}
  .measure{position:absolute;left:-2000px;top:0;width:600px;height:800px}</style>
  <main>${cards}</main>${accessoryCards}<script>
  const failures=[];
  document.querySelectorAll('.measure').forEach(svg=>{
    const b=svg.getBBox();
    if(b.x<4||b.y<4||b.x+b.width>596||b.y+b.height>796)failures.push([svg.dataset,b.x,b.y,b.width,b.height]);
  });
  document.body.dataset.bounds=failures.length?JSON.stringify(failures):'PASS: all 247 base and 80 accessory layer bounds have margins';
  </script>`;
  fs.writeFileSync(path.resolve('cartoon-expansion-review.html'), html, 'utf8');
}
