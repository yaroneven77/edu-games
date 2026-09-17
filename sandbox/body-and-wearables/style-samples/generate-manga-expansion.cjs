'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = __dirname;
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'collection-manga.js'), 'utf8'), context);
const vocabulary = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, '..', 'illustrated-vocabulary.js'), 'utf8'), vocabulary);
vm.runInNewContext(fs.readFileSync(path.join(root, '..', 'illustrated-content.js'), 'utf8'), vocabulary);
const words = vocabulary.window.IllustratedContent.vocabulary;
const known = new Set(words.map(item => item.id));
const bodyIds = 'head hair forehead eyes ears nose cheeks mouth lips chin jaw neck shoulders chest waist arms elbows wrists hands palms fingers legs thighs knees ankles feet heels'.split(' ');
const expected = Array.from({ length: 8 }, (_, i) => `manga-${String(i + 3).padStart(2, '0')}`);
const names = ['Miri','Toma','Neri','Ido','Luma','Yori','Noa','Eitan'];
const hebrewNames = ['מירי','תומה','נרי','עידו','לומה','יורי','נועה','איתן'];
const xml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const { IllustratedCharacters: characters, IllustratedLayers: artwork, CharacterAccessories: accessories } = context.window;
assert.deepEqual(Object.keys(characters), expected);
assert.deepEqual(Object.keys(artwork), expected);
assert.deepEqual(Object.keys(accessories), expected);

function checkEllipse(e) {
  assert(Object.values(e).every(Number.isFinite));
  assert(e.rx > 0 && e.ry > 0);
  const angle = (e.angle || 0) * Math.PI / 180;
  const dx = Math.hypot(e.rx * Math.cos(angle), e.ry * Math.sin(angle));
  const dy = Math.hypot(e.rx * Math.sin(angle), e.ry * Math.cos(angle));
  assert(e.cx - dx >= 0 && e.cx + dx <= 600 && e.cy - dy >= 0 && e.cy + dy <= 800);
}
function checkSvg(svg, mode, namespace) {
  assert(!/<(?:image|mask|clipPath|script|foreignObject)\b/i.test(svg));
  assert(!/\b(?:NaN|undefined|Infinity)\b/.test(svg));
  assert(!/\btransform=/.test(svg), 'Layer coordinates must be global');
  for(const [,paint] of svg.matchAll(/\b(?:fill|stroke|stop-color)="([^"]+)"/g))
    assert(/^(?:none|#[\da-f]{3}|#[\da-f]{6}|url\(#[^)]+\))$/i.test(paint),`Unvalidated paint ${paint}`);
  for (const color of svg.match(/#[\da-f]{3,8}\b/gi) || []) {
    const hex = color.slice(1);
    assert([3,6].includes(hex.length), color);
    if (mode === 'monochrome') assert((hex.length === 3 && hex[0] === hex[1] && hex[1] === hex[2]) ||
      (hex.length === 6 && hex.slice(0, 2) === hex.slice(2, 4) && hex.slice(2, 4) === hex.slice(4, 6)), color);
  }
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  ids.forEach(id => assert(id.startsWith(namespace + '-'), `Unscoped definition ${id}`));
  for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) assert(ids.includes(id), `Missing ${id}`);
  for (const [, data] of svg.matchAll(/\bd="([^"]+)"/g)) {
    checkPath(data);
  }
  for (const [tag, kind, attrs] of svg.matchAll(/<(ellipse|circle|rect)\b([^>]*)\/?>/g)) {
    const values=Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]+)"/g)].map(([,key,value])=>[key,value]));
    const numeric=(key,fallback=0)=>{const v=values[key]===undefined?fallback:Number(values[key]);assert(Number.isFinite(v),tag);return v;};
    if(kind==='rect') {
      const x=numeric('x'),y=numeric('y'),w=numeric('width'),h=numeric('height');
      assert(w>0&&h>0&&x>=0&&y>=0&&x+w<=600&&y+h<=800,tag);
    } else {
      const x=numeric('cx'),y=numeric('cy'),rx=numeric(kind==='circle'?'r':'rx'),ry=numeric(kind==='circle'?'r':'ry');
      assert(rx>0&&ry>0&&x-rx>=0&&y-ry>=0&&x+rx<=600&&y+ry<=800,tag);
    }
  }
}

function checkPath(data) {
  // Exact extrema, not control-point hulls: controls may lie beyond a curve's actual painted extent.
  assert(!data.replace(/[MLQCZ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?|[\s,]/gi,'').length,data);
  assert(!/[mlqczAHVSTahvst]/.test(data),'Unsupported path command: '+data);
  const tokens=data.match(/[MLQCZ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/g)||[];
  let i=0,command,point=[0,0],start=[0,0],segments=0;
  const check=p=>p.forEach((v,axis)=>assert(Number.isFinite(v)&&v>=-1e-7&&v<=(axis?800:600)+1e-7,`Out-of-bounds curve point ${p}`));
  const bezier=(values,t)=>values.length===3?(1-t)**2*values[0]+2*(1-t)*t*values[1]+t*t*values[2]:
    (1-t)**3*values[0]+3*(1-t)**2*t*values[1]+3*(1-t)*t*t*values[2]+t**3*values[3];
  while(i<tokens.length) {
    if(/^[MLQCZ]$/.test(tokens[i]))command=tokens[i++];
    assert(command,'Path must begin with a command');
    if(command==='Z'){check(start);point=start;command=null;continue;}
    const count={M:2,L:2,Q:4,C:6}[command],args=tokens.slice(i,i+count).map(Number);
    assert(args.length===count&&args.every(Number.isFinite),data);i+=count;
    const end=args.slice(-2);check(end);
    if(command==='M'){start=end;command='L';}
    else {
      segments++;
      if(command==='Q'||command==='C') {
        for(let axis=0;axis<2;axis++){
          const v=[point[axis],...args.filter((_,j)=>j%2===axis)],roots=[];
          if(command==='Q'){
            const denominator=v[0]-2*v[1]+v[2];
            if(Math.abs(denominator)>1e-12)roots.push((v[0]-v[1])/denominator);
          }else{
            const a=-v[0]+3*v[1]-3*v[2]+v[3],b=2*(v[0]-2*v[1]+v[2]),cc=v[1]-v[0];
            if(Math.abs(a)<1e-12){if(Math.abs(b)>1e-12)roots.push(-cc/b);}
            else {const d=b*b-4*a*cc;if(d>=0)roots.push((-b+Math.sqrt(d))/(2*a),(-b-Math.sqrt(d))/(2*a));}
          }
          for(const t of roots.filter(t=>t>0&&t<1)){
            const bound=bezier(v,t);assert(bound>=-1e-7&&bound<=(axis?800:600)+1e-7,`Curve extremum outside artboard: ${bound}`);
          }
        }
      }
    }
    point=end;
  }
  assert(segments>0,'Empty path');
}

assert.equal(Object.values(characters).filter(c=>c.colorMode==='color').length,5);
assert.equal(Object.values(characters).filter(c=>c.colorMode==='monochrome').length,3);
for (const id of expected) {
  const character = characters[id], art = artwork[id], extras = accessories[id];
  assert.equal(character.category, 'Manga');
  assert.equal(character.nameEn,names[expected.indexOf(id)]);
  assert.equal(character.nameHe,hebrewNames[expected.indexOf(id)]);
  assert.equal(character.colorMode,expected.indexOf(id)<5?'color':'monochrome');
  assert.deepEqual(Object.keys(character.bodyRegions).sort(), [...bodyIds].sort());
  for (const ellipses of Object.values(character.bodyRegions)) {
    assert(ellipses.length > 0);
    ellipses.forEach(checkEllipse);
  }
  const outfit = character.outfit.map(item => item.id);
  assert.equal(new Set(outfit).size, outfit.length);
  character.outfit.forEach(item => { assert(known.has(item.id), item.id); assert(item.regions.length>0); item.regions.forEach(checkEllipse); });
  const layers = [...art.layers].sort((a, b) => a.order - b.order);
  layers.forEach(layer=>{
    assert(Number.isFinite(layer.order));
    assert(layer.svg.length>0);
    checkSvg(art.defs+layer.svg,character.colorMode,id);
    if(outfit.includes(layer.id)){
      assert(layer.order>35,`Outfit painted below skin: ${id}/${layer.id}`);
      assert(!layer.svg.includes(`url(#${id}-paint-skin)`),`Skin paint in clothing: ${id}/${layer.id}`);
    }
  });
  assert.equal(new Set(layers.map(layer => layer.id)).size, layers.length);
  assert.deepEqual(layers.map(layer => layer.id).sort(), [...bodyIds, ...outfit].sort());
  assert.equal(extras.length, 10);
  assert.equal(new Set(extras.map(extra => extra.id)).size, 10);
  assert(new Set(extras.map(extra => extra.slot)).size >= 5);
  const acceptedForms = new Map();
  for (const item of [...character.outfit, ...extras]) {
    assert(known.has(item.id), item.id);
    const word = words.find(v => v.id === item.id);
    for (const form of word.acceptedForms) {
      const key = form.toLowerCase();
      assert(!acceptedForms.has(key) || acceptedForms.get(key) === item.id, `Ambiguous ${key}`);
      acceptedForms.set(key, item.id);
    }
  }
  extras.forEach(extra => {
    assert(!outfit.includes(extra.id), `${id}: duplicate ${extra.id}`);
    assert(extra.en && extra.he && extra.slot);
    checkSvg(art.defs+extra.svg+(extra.rearSvg||''),character.colorMode,id);
  });
  assert(character.descriptionHe && /[\u0590-\u05ff]/.test(character.descriptionHe));
  if(character.colorMode==='color'){
    const paints=layers.map(layer=>layer.svg).join('').match(/#[\da-f]{6}\b/gi)||[];
    assert(paints.some(color=>color.slice(1,3)!==color.slice(3,5)||color.slice(3,5)!==color.slice(5,7)),`${id}: missing authored color`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-desc">
  <title id="${id}-title">${xml(character.nameEn)} — original friendly ${character.colorMode} manga character</title>
  <desc id="${id}-desc" xml:lang="he">${xml(character.descriptionHe)}</desc>
  ${art.defs}
  ${layers.map(layer => `<g id="${id}-${layer.id}">${layer.svg}</g>`).join('\n  ')}
</svg>\n`;
  checkSvg(svg,character.colorMode,id);
  fs.writeFileSync(path.join(root, `${id}.svg`), svg);
  console.log(`${id}: ${character.nameEn}; ${layers.length} layers; ${outfit.join(', ')}; 10 accessories`);
}

// Idempotence and coexistence: loading the IIFE never clears other collections.
const preserved = {};
for(const registry of ['IllustratedCharacters','IllustratedLayers','CharacterAccessories'])context.window[registry]['existing-marker']=preserved;
vm.runInNewContext(fs.readFileSync(path.join(root, 'collection-manga.js'), 'utf8'), context);
for(const registry of ['IllustratedCharacters','IllustratedLayers','CharacterAccessories']){
  assert.equal(context.window[registry]['existing-marker'],preserved);
  assert.deepEqual(Object.keys(context.window[registry]),[...expected,'existing-marker']);
}
console.log('PASS: original names, 5 color + 3 monochrome, all layers/accessories, exact Bézier bounds, finite rotated ellipses, scoped references, vocabulary, registry isolation.');
