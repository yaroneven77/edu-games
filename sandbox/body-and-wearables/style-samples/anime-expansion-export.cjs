'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const directory = __dirname;
const window = {};
const load = name => vm.runInNewContext(fs.readFileSync(path.join(directory, name), 'utf8'), { window });
load(path.join('..', 'illustrated-vocabulary.js'));
load('collection-anime.js');
const bodyIds = 'head hair forehead eyes ears nose cheeks mouth lips chin jaw neck shoulders chest waist arms elbows wrists hands palms fingers legs thighs knees ankles feet heels'.split(' ');
const expectedIds = Array.from({ length: 8 }, (_, i) => `anime-${String(i + 3).padStart(2, '0')}`);
const vocabulary = new Set(window.BodyWearablesVocabulary.map(item => item.id));
const checkOnly = process.argv.includes('--check');
const forbidden = /<(?:image|mask|clipPath|foreignObject|script)\b|\bon\w+\s*=|\b(?:href|src)\s*=/i;
let totalLayers = 0;

function assertEllipse(region, context) {
  ['cx', 'cy', 'rx', 'ry'].forEach(key => assert(Number.isFinite(region[key]), `${context}: invalid ${key}`));
  assert(region.rx > 0 && region.ry > 0, `${context}: empty ellipse`);
  assert(region.angle === undefined || Number.isFinite(region.angle), `${context}: invalid angle`);
  const angle = (region.angle || 0) * Math.PI / 180;
  const dx = Math.hypot(region.rx * Math.cos(angle), region.ry * Math.sin(angle));
  const dy = Math.hypot(region.rx * Math.sin(angle), region.ry * Math.cos(angle));
  assert(region.cx - dx >= 0 && region.cx + dx <= 600 &&
    region.cy - dy >= 0 && region.cy + dy <= 800, `${context}: ellipse outside artboard`);
}

function assertFragment(svg, defs, context) {
  assert(typeof svg === 'string' && /<(?:g|path|rect|ellipse)\b/.test(svg), `${context}: missing geometry`);
  assert(!forbidden.test(svg), `${context}: forbidden content`);
  const defined = new Set(Array.from((defs + svg).matchAll(/\bid="([^"]+)"/g), match => match[1]));
  for (const match of svg.matchAll(/url\(#([^)]+)\)/g)) {
    assert(defined.has(match[1]), `${context}: undefined ${match[1]}`);
  }
}

assert.deepEqual(Object.keys(window.IllustratedCharacters).sort(), expectedIds);
assert.deepEqual(Object.keys(window.IllustratedLayers).sort(), expectedIds);
assert.deepEqual(Object.keys(window.CharacterAccessories).sort(), expectedIds);
assert.equal(new Set(expectedIds.map(id => window.IllustratedCharacters[id].descriptionHe)).size, 8,
  'Every character needs a distinct Hebrew design description');

for (const id of expectedIds) {
  const character = window.IllustratedCharacters[id];
  const illustration = window.IllustratedLayers[id];
  const choices = window.CharacterAccessories[id];
  assert.equal(character.id, id);
  assert.equal(character.category, 'Anime');
  assert(character.nameEn && character.nameHe);
  assert(/[\u0590-\u05ff]/.test(character.descriptionHe), `${id}: missing Hebrew description`);
  assert.equal(character.image, `./style-samples/${id}.svg`);
  assert.deepEqual(Object.keys(character.bodyRegions).sort(), [...bodyIds].sort());
  for (const [bodyId, regions] of Object.entries(character.bodyRegions)) {
    assert(regions.length, `${id}/${bodyId}: empty regions`);
    regions.forEach(region => assertEllipse(region, `${id}/${bodyId}`));
  }
  const outfitIds = Array.from(character.outfit, item => item.id);
  assert.equal(new Set(outfitIds).size, outfitIds.length, `${id}: duplicate outfit`);
  for (const item of character.outfit) {
    assert(vocabulary.has(item.id), `${id}: unknown outfit ${item.id}`);
    assert(item.regions.length, `${id}/${item.id}: empty regions`);
    item.regions.forEach(region => assertEllipse(region, `${id}/${item.id}`));
  }
  assert.deepEqual(Array.from(illustration.layers, item => item.id).sort(), [...bodyIds, ...outfitIds].sort());
  assert(illustration.defs.startsWith('<defs>') && illustration.defs.endsWith('</defs>'));
  for (const match of illustration.defs.matchAll(/\bid="([^"]+)"/g)) {
    assert(match[1].startsWith(`${id}-`), `${id}: unnamespaced definition`);
  }
  let previous = -Infinity;
  for (const layer of illustration.layers) {
    assert(Number.isFinite(layer.order) && layer.order >= previous, `${id}: unsorted paint order`);
    previous = layer.order;
    assertFragment(layer.svg, illustration.defs, `${id}/${layer.id}`);
  }
  assert.equal(choices.length, 10, `${id}: need ten accessories`);
  assert.equal(new Set(choices.map(item => item.id)).size, 10, `${id}: duplicate accessory`);
  assert(new Set(choices.map(item => item.slot)).size >= 5, `${id}: insufficient compatible slots`);
  for (const choice of choices) {
    assert(vocabulary.has(choice.id), `${id}: unknown accessory ${choice.id}`);
    assert(!outfitIds.includes(choice.id), `${id}: outfit/accessory collision`);
    assert(choice.en && choice.he && choice.slot, `${id}/${choice.id}: missing label or slot`);
    assertFragment(choice.svg, '', `${id}/accessory/${choice.id}`);
    if (['hat', 'cap', 'beanie', 'headband'].includes(choice.id)) assert.equal(choice.slot, 'headwear');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-labelledby="${id}-title ${id}-description">
  <title id="${id}-title">${character.nameEn} — original friendly anime character</title>
  <desc id="${id}-description" xml:lang="he">${character.descriptionHe} דמות אנימה מקורית באורך מלא.</desc>
  ${illustration.defs}
  ${illustration.layers.map(layer => `<g id="${id}-layer-${layer.id}" data-concept="${layer.id}">${layer.svg}</g>`).join('\n  ')}
</svg>
`;
  const filename = path.join(directory, `${id}.svg`);
  if (checkOnly) assert.equal(fs.readFileSync(filename, 'utf8'), svg, `${id}: export is stale`);
  else fs.writeFileSync(filename, svg, 'utf8');
  totalLayers += illustration.layers.length;
  console.log(`${id} ${character.nameEn}: ${illustration.layers.length} layers; ${outfitIds.join(', ')}; 10 accessories`);
}
console.log(`${checkOnly ? 'Verified' : 'Exported'} eight originals, ${totalLayers} concept layers, 80 fitted accessories.`);
