/* Original, independently selectable vector artwork in a 600 × 800 coordinate space. */
(function () {
  'use strict';
  window.IllustratedCharacters = window.IllustratedCharacters || {};
  window.IllustratedLayers = window.IllustratedLayers || {};
  window.CharacterAccessories = window.CharacterAccessories || {};

  const ink = '#3e3943';
  const E = (cx, cy, rx, ry, angle = 0) => ({ cx, cy, rx, ry, angle });
  const path = (d, fill, stroke = ink, width = 2.8, extra = '') =>
    `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const line = (d, stroke = ink, width = 2) => path(d, 'none', stroke, width);
  const oval = (x, y, rx, ry, fill, stroke = 'none', width = 2) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const rect = (x, y, w, h, r, fill, stroke = ink, width = 2) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const group = (svg, transform) => `<g transform="${transform}">${svg}</g>`;
  const configs = [
    { n: 3, en: 'Niko', he: 'ניקו', look: 'swoop', style: 'hoodie', sx: .96, sy: .97, lean: -5, lift: 5,
      descriptionHe: 'שיער נחושתי שובב, נמשים וקפוצ׳ון טורקיז עם שמש קטנה וכיס בצבע אפרסק.',
      skin: ['#ffe3bb', '#ecb18a', '#cb8268'], hair: ['#d69251', '#975232', '#5c3930'],
      colors: ['#a4ddd2', '#4aa59e', '#246c77'], accent: '#f3a475', lower: '#55728c',
      accessories: ['cap', 'headband', 'glasses', 'scarf', 'watch', 'bracelet', 'badge', 'backpack', 'knee-pads', 'ring'] },
    { n: 4, en: 'Aya', he: 'איה', look: 'bob', style: 'pinafore', sx: .93, sy: .99, lean: 3, lift: -5,
      descriptionHe: 'תספורת קארה כהה, חולצה בצבע שמנת ושמלת כתפיות כחולה בדוגמת ענפים עדינים.',
      skin: ['#ffdfc6', '#edba9d', '#c88675'], hair: ['#665064', '#372e43', '#242632'],
      colors: ['#8fbae8', '#527cc2', '#365389'], accent: '#f1c463', lower: '#527cc2',
      accessories: ['beret', 'hair-clip', 'necklace', 'bracelet', 'ring', 'brooch', 'watch', 'headband', 'glasses', 'medal'] },
    { n: 5, en: 'Ziv', he: 'זיו', look: 'coils', style: 'knit', sx: 1.06, sy: 1, lean: -2, lift: -3,
      descriptionHe: 'תלתלים צפופים, סוודר כתום בדוגמת זיגזג כחולה וג׳ינס עם מכפלות צבעוניות.',
      skin: ['#dba177', '#b97753', '#88523f'], hair: ['#665042', '#3b302c', '#27252a'],
      colors: ['#ffce83', '#e59b50', '#ba6a3c'], accent: '#688a9d', lower: '#536c8f',
      accessories: ['cap', 'earmuffs', 'scarf', 'watch', 'armband', 'badge', 'knee-pads', 'sunglasses', 'ring', 'medal'] },
    { n: 6, en: 'Liora', he: 'ליאורה', look: 'braid', style: 'pleats', sx: .95, sy: 1.025, lean: 4, lift: 8,
      descriptionHe: 'צמה חומה לצד הפנים, חולצת מנטה עם צווארון וחצאית קפלים בגוון אלמוג.',
      skin: ['#f5cfa9', '#d89e76', '#b27358'], hair: ['#8c6245', '#5c3d32', '#352c2c'],
      colors: ['#fac0ae', '#e88e86', '#b85d70'], accent: '#9dcfc2', lower: '#58647a',
      accessories: ['hat', 'hair-clip', 'headband', 'necklace', 'brooch', 'bracelet', 'ring', 'medal', 'scarf', 'glasses'] },
    { n: 7, en: 'Noam', he: 'נועם', look: 'shag', style: 'camp', sx: 1, sy: 1.01, lean: -4, lift: -7,
      descriptionHe: 'שיער זהוב פרוע, חולצת עלים קיצית, מכנסיים ירוקים קצרים וסנדלי טורקיז.',
      skin: ['#ffe8c3', '#f0c08e', '#cb906f'], hair: ['#f3d08a', '#c19350', '#87623d'],
      colors: ['#ffecad', '#e5c46e', '#ba954f'], accent: '#5da999', lower: '#567a65',
      accessories: ['hat', 'cap', 'sunglasses', 'scarf', 'watch', 'badge', 'backpack', 'armband', 'bracelet', 'ring'] },
    { n: 8, en: 'Roni', he: 'רוני', look: 'pony', style: 'varsity', sx: .97, sy: 1.02, lean: 2, lift: 9,
      descriptionHe: 'קוקו נחושתי גבוה וז׳קט ספורטיבי ורוד עם שרוולי שמנת מעל חולצת פסים.',
      skin: ['#f1c7a4', '#d39a78', '#a96756'], hair: ['#ae694e', '#744237', '#472f32'],
      colors: ['#e79dad', '#b76181', '#844563'], accent: '#f4dba4', lower: '#537d8b',
      accessories: ['cap', 'headband', 'earmuffs', 'watch', 'medal', 'badge', 'backpack', 'knee-pads', 'bracelet', 'sunglasses'] },
    { n: 9, en: 'Eitan', he: 'איתן', look: 'crop', style: 'utility', sx: 1.025, sy: .985, lean: 0, lift: 3,
      descriptionHe: 'תספורת קצרה ומתולתלת, אפודת טיולים ירוקה מרובת כיסים ומגפיים עם שרוכים בהירים.',
      skin: ['#b98161', '#955e49', '#6b4037'], hair: ['#51443c', '#302b29', '#222329'],
      colors: ['#b7cf94', '#7d9c72', '#4d715c'], accent: '#f4c67e', lower: '#ac805e',
      accessories: ['hat', 'beret', 'glasses', 'scarf', 'watch', 'brooch', 'backpack', 'armband', 'ring', 'necklace'] },
    { n: 10, en: 'Dalia', he: 'דליה', look: 'waves', style: 'scallop', sx: 1.01, sy: .96, lean: -3, lift: -8,
      descriptionHe: 'שיער כהה גלי ושמלה סגולה עם שולי צדפים וקישוטי פרפרים מעל טייץ טורקיז.',
      skin: ['#ffe5ce', '#ebc2a8', '#c79583'], hair: ['#777088', '#51465e', '#332d43'],
      colors: ['#b9a5dc', '#8d79b9', '#635487'], accent: '#8acec6', lower: '#659397',
      accessories: ['beret', 'hair-clip', 'earmuffs', 'necklace', 'bracelet', 'brooch', 'badge', 'headband', 'ring', 'glasses'] }
  ];

  function make(c) {
    const id = `cartoon-${String(c.n).padStart(2, '0')}`;
    const ref = name => `url(#${id}-${name})`;
    const skin = ref('skin');
    const hair = ref('hair');
    const cloth = ref('cloth');
    const skinLine = c.skin[2];
    const transform = `translate(${300 + c.lean} 730) scale(${c.sx} ${c.sy}) translate(-300 -730)`;
    const wrap = svg => group(svg, transform);
    const layers = [];
    const bodyRegions = {};
    const outfit = [];
    // Ellipses transform analytically, retaining the exact rotated bounds under anisotropic scaling.
    function region(e) {
      const a = e.angle * Math.PI / 180;
      const xx = c.sx * c.sx * (e.rx ** 2 * Math.cos(a) ** 2 + e.ry ** 2 * Math.sin(a) ** 2);
      const yy = c.sy * c.sy * (e.rx ** 2 * Math.sin(a) ** 2 + e.ry ** 2 * Math.cos(a) ** 2);
      const xy = c.sx * c.sy * (e.rx ** 2 - e.ry ** 2) * Math.sin(a) * Math.cos(a);
      const root = Math.sqrt((xx - yy) ** 2 + 4 * xy ** 2);
      return E(300 + c.lean + (e.cx - 300) * c.sx, 730 + (e.cy - 730) * c.sy,
        Math.sqrt((xx + yy + root) / 2), Math.sqrt((xx + yy - root) / 2),
        Math.atan2(2 * xy, xx - yy) * 90 / Math.PI);
    }
    const add = (name, order, svg, regions, clothing = false) => {
      layers.push({ id: name, order, svg: wrap(svg) });
      if (clothing) outfit.push({ id: name, regions: regions.map(region) });
      else bodyRegions[name] = regions.map(region);
    };
    const pair = svg => svg + group(svg, `translate(600 ${c.lift}) scale(-1 1)`);
    const pairedRegions = list => [...list, ...list.map(e => E(600 - e.cx, e.cy + c.lift, e.rx, e.ry, -e.angle))];
    const grad = (name, colors, radial = false) => radial ?
      `<radialGradient id="${id}-${name}" cx=".3" cy=".22" r=".93"><stop stop-color="${colors[0]}"/><stop offset=".56" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></radialGradient>` :
      `<linearGradient id="${id}-${name}" x1="0" y1="0" x2="1" y2=".85"><stop stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient>`;
    const defs = `<defs>${grad('skin', c.skin, true)}${grad('hair', c.hair)}${grad('cloth', c.colors)}
      ${grad('shoe', [c.accent, c.colors[1], c.colors[2]])}
      <radialGradient id="${id}-blush"><stop stop-color="#e7857d" stop-opacity=".52"/><stop offset="1" stop-color="#e7857d" stop-opacity="0"/></radialGradient>
      <pattern id="${id}-sprigs" width="35" height="39" patternUnits="userSpaceOnUse">
        ${line('M15 29Q19 22 18 12', '#f7eac9', 1.5)}
        ${path('M18 21Q8 19 10 12Q19 11 18 21ZM19 16Q20 6 27 7Q29 14 19 16Z', '#c9dec5', 'none')}
        ${oval(7, 33, 1.6, 1.6, '#f6d883')}
      </pattern></defs>`;

    add('legs', 10,
      path('M247 435Q269 425 290 443L290 519Q284 555 280 584L276 675 246 675Q243 622 243 581L237 506Z', skin, skinLine) +
      path('M309 444Q333 427 355 442L363 513Q365 550 362 584L360 675 330 675 322 580Q316 548 310 520Z', skin, skinLine) +
      line('M251 590Q249 628 253 658M347 594L347 657', c.skin[0], 4),
      [E(264, 554, 24, 112, 2), E(341, 554, 24, 112, -3)]);
    add('thighs', 11,
      path('M247 451Q264 441 282 452L280 512Q276 535 264 545Q252 529 248 507Z', skin, 'none', 0) +
      path('M318 453Q337 443 352 453L355 509Q354 532 345 544Q329 530 324 510Z', skin, 'none', 0),
      [E(264, 494, 21, 48), E(338, 494, 21, 48, -4)]);
    add('knees', 12,
      line('M252 560Q264 567 276 560M331 559Q344 567 355 559', skinLine, 2) +
      line('M257 570Q265 572 272 569M336 570Q344 572 351 568', c.skin[0], 2),
      [E(264, 563, 18, 13), E(344, 563, 18, 13)]);
    add('ankles', 13,
      path('M246 659Q261 664 276 659L276 690 246 690Z', skin, skinLine, 2) +
      path('M330 659Q345 664 360 659L363 690 332 690Z', skin, skinLine, 2),
      [E(260, 675, 15, 16), E(346, 675, 15, 16)]);
    add('feet', 14,
      path('M246 680 275 682Q281 698 277 714Q252 725 214 719Q203 715 210 705Q220 697 237 697Z', skin, skinLine) +
      path('M331 682 360 680 370 696Q394 699 397 712Q394 724 354 722L331 715Z', skin, skinLine) +
      line('M215 710 222 708M229 705 235 704M378 708 385 712', skinLine, 1.4),
      [E(243, 706, 36, 17), E(363, 706, 35, 17)]);
    add('heels', 15,
      path('M270 698Q280 697 278 711Q276 718 266 718L265 708Z', skin, 'none') +
      path('M339 698Q329 697 331 711Q333 718 344 718L345 708Z', skin, 'none'),
      [E(272, 709, 7, 9), E(337, 709, 7, 9)]);
    add('waist', 17,
      path('M244 385Q300 368 356 385L358 444Q339 463 308 457L300 450Q272 468 241 445Z', skin, skinLine),
      [E(300, 421, 52, 28)]);
    add('chest', 18,
      path('M252 294Q299 277 348 294Q358 337 353 389Q301 410 247 389Q241 341 252 294Z', skin, skinLine) +
      line('M282 309Q300 318 318 309', skinLine, 1.4),
      [E(300, 342, 48, 41)]);
    add('neck', 19,
      path('M282 245 320 245 321 282Q332 291 342 293Q320 317 300 315Q278 314 258 293L280 281Z', skin, skinLine) +
      path('M283 252Q302 268 319 254L318 274Q300 284 282 272Z', c.skin[2], 'none'),
      [E(300, 276, 21, 27)]);
    add('shoulders', 20,
      path('M260 289Q237 284 226 303L220 326Q238 338 257 325L269 306Z', skin, skinLine) +
      path('M339 289Q363 285 374 304L380 326Q361 340 342 325L332 306Z', skin, skinLine),
      [E(242, 311, 22, 21, 15), E(358, 311, 22, 21, -15)]);
    const arm = path('M225 307Q205 324 200 352L190 397 183 460Q192 470 210 463L216 407Q229 374 240 337Z', skin, skinLine) +
      path('M227 331Q216 351 213 374L202 449 194 453 201 397 209 356Z', c.skin[0], 'none');
    add('arms', 21, pair(arm), pairedRegions([E(220, 357, 17, 41, 16), E(202, 428, 13, 31, 7)]));
    add('elbows', 22, pair(line('M195 399Q203 405 212 402', skinLine, 2) +
      line('M198 394 205 396', c.skin[0], 2)),
    pairedRegions([E(202, 399, 12, 11)]));
    add('wrists', 23, pair(path('M184 450 210 453 208 475Q196 482 182 472Z', skin, skinLine, 2) +
      line('M187 461Q195 465 205 462', skinLine, 1.3)),
    pairedRegions([E(196, 462, 12, 11)]));
    // The hand base ends at the knuckles. Five separate digits continue its contour.
    add('hands', 24, pair(path('M183 469Q196 473 208 470L213 487Q212 497 204 499L185 496Q177 488 183 469Z', skin, skinLine, 2.2)),
      pairedRegions([E(196, 484, 15, 15)]));
    add('palms', 25, pair(path('M186 476Q196 473 205 478L207 490Q197 496 186 490Z', skin, 'none') +
      line('M186 482Q191 480 193 485M199 481Q201 486 200 489', skinLine, 1.25)),
    pairedRegions([E(196, 484, 10, 9)]));
    const digits = path('M184 485Q180 482 177 487L176 498Q177 504 181 501L186 492Z', skin, skinLine, 1.8) +
      path('M186 492 193 494 193 507Q193 513 189 512Q185 512 185 507Z', skin, skinLine, 1.8) +
      path('M194 493 201 493 202 511Q202 518 198 517Q194 517 194 511Z', skin, skinLine, 1.8) +
      path('M202 491 208 490 211 507Q211 513 207 513Q204 513 204 508Z', skin, skinLine, 1.8) +
      path('M209 484Q215 483 216 489L219 500Q219 506 215 505L211 495Z', skin, skinLine, 1.8) +
      line('M189 506 190 506M198 511 199 511M207 507 208 507M215 499 216 500', c.skin[0], 2);
    add('fingers', 26, pair(digits), pairedRegions([
      E(180, 494, 4, 8, 14), E(189, 502, 4, 10), E(198, 505, 4, 12),
      E(206, 502, 4, 10, -8), E(215, 495, 4, 10, -14)
    ]));
    add('head', 30,
      path('M242 176Q241 119 297 117Q355 113 360 174L357 215Q353 245 325 260Q301 275 277 261Q246 248 242 218Z', skin, ink, 3),
      [E(301, 194, 59, 75)]);
    add('ears', 31,
      path('M244 187Q227 178 225 197Q224 216 242 218L249 207Z', skin, skinLine, 2.3) +
      path('M357 186Q372 179 375 196Q378 216 359 218L351 206Z', skin, skinLine, 2.3) +
      line('M240 198Q230 190 231 202L238 208M361 198Q369 189 370 201L363 208', skinLine, 1.8),
      [E(236, 201, 11, 17), E(365, 201, 10, 17)]);
    add('forehead', 32,
      path('M271 169Q300 156 328 169L324 180Q300 174 275 181Z', c.skin[0], 'none', 0, 'opacity=".42"'),
      [E(300, 171, 28, 10)]);
    add('jaw', 33,
      line('M249 227Q256 244 272 251M351 227Q345 245 329 252', skinLine, 2),
      [E(261, 241, 5, 15, -38), E(342, 241, 5, 15, 38)]);
    add('chin', 34,
      path('M286 257Q300 262 315 256Q309 267 298 267Q290 266 286 257Z', c.skin[0], 'none', 0, 'opacity=".6"'),
      [E(300, 261, 14, 6)]);
    add('cheeks', 35,
      oval(263, 222, 18, 13, ref('blush')) + oval(338, 222, 18, 13, ref('blush')) +
      ((c.n === 3 || c.n === 7) ? [258, 266, 273, 330, 338, 345].map((x, i) =>
        oval(x, 219 + (i % 2) * 5, 1.5, 1.5, c.skin[2])).join('') : ''),
      [E(263, 222, 17, 12), E(338, 222, 17, 12)]);
    const eye = x => path(`M${x - 17} 199Q${x - 15} 183 ${x} 184Q${x + 15} 184 ${x + 16} 198Q${x + 14} 213 ${x} 214Q${x - 14} 214 ${x - 17} 199Z`, '#fffdf1', ink, 2.4) +
      oval(x + (c.n % 3 - 1) * 2, 199, 9.5, 13, c.n % 2 ? '#728d79' : '#98704c', ink, 1.4) +
      oval(x + (c.n % 3 - 1) * 2, 200, 5.5, 9, '#2c2c36') +
      oval(x - 3, 194, 3.3, 4.1, '#ffffff') + oval(x + 4, 204, 1.5, 1.8, '#ffffff');
    add('eyes', 36,
      eye(274) + eye(326) +
      line('M258 178Q270 172 281 176M317 176Q329 172 341 178', c.hair[1], 3.5),
      [E(274, 199, 17, 16), E(326, 199, 17, 16)]);
    add('nose', 37,
      path('M298 204Q295 212 291 218Q295 224 304 221Q309 219 305 215', skin, skinLine, 2) +
      line('M296 217 299 218', c.skin[0], 2.5),
      [E(300, 214, 9, 11)]);
    const grin = c.n % 3 === 0 ? 2 : 0;
    add('mouth', 38,
      path(`M281 ${235 - grin}Q300 241 320 ${233 - grin}Q317 252 302 253Q287 253 281 ${235 - grin}Z`, '#74494c', ink, 1.8) +
      path(`M284 ${237 - grin}Q301 242 316 ${235 - grin}L313 242Q300 247 288 242Z`, '#fff7e3', 'none') +
      path('M291 249Q301 243 311 248Q303 254 291 249Z', '#e79891', 'none'),
      [E(300, 242 - grin, 20, 11)]);
    add('lips', 39,
      line(`M281 ${235 - grin}Q300 241 320 ${233 - grin}`, '#985e57', 1.5) +
      line('M293 255Q302 258 310 254', c.skin[2], 1.4),
      [E(300, 236 - grin, 20, 3, -3), E(301, 255, 10, 3)]);

    const hairData = makeHair(c, hair);
    add('hair', 40, hairData.svg, hairData.regions);
    makeClothes(c, { add, path, line, oval, rect, pair, pairedRegions, cloth, ref });
    layers.sort((a, b) => a.order - b.order);
    return {
      character: { id, category: 'Cartoon', nameEn: c.en, nameHe: c.he, descriptionHe: c.descriptionHe,
        image: `./style-samples/${id}.svg`, bodyRegions, outfit },
      art: { defs, layers },
      accessories: c.accessories.map((name, index) => makeAccessory(name, index, c, wrap))
    };
  }

  function makeHair(c, fill) {
    const light = c.hair[0];
    let svg = '';
    let regions = [E(300, 143, 65, 39)];
    if (c.look === 'swoop') {
      svg = path('M240 192Q223 163 239 139L229 137 249 118Q241 100 256 93L279 106Q316 72 348 101L341 113Q381 130 364 175L355 189 351 153Q321 167 283 148Q265 169 247 169Z', fill, ink, 3.2) +
        line('M253 137Q280 114 323 117Q304 123 289 132M263 117Q280 102 300 103M321 145Q341 145 351 137M246 163 244 177', light, 3) +
        line('M259 143Q282 134 299 139M334 121Q351 120 358 132', c.hair[2], 2);
      regions = [E(300, 136, 65, 45), E(242, 174, 10, 19)];
    } else if (c.look === 'bob') {
      svg = path('M241 184Q220 211 233 260L258 267 272 253Q244 228 247 179Z', fill, ink, 3) +
        path('M352 178Q376 210 368 261L345 269 330 256Q356 236 352 178Z', fill, ink, 3) +
        path('M237 189Q224 133 261 111Q300 87 339 112Q374 133 363 190L352 180 349 158Q323 151 303 133Q283 154 252 159L249 181Z', fill, ink, 3) +
        line('M247 143Q259 119 286 116M310 115Q337 121 349 140M240 212 245 249M360 213 357 253M259 148Q282 138 292 124', light, 3);
      regions = [E(300, 137, 65, 40), E(246, 226, 17, 39), E(354, 227, 17, 39)];
    } else if (c.look === 'coils') {
      svg = path('M238 184 231 158Q215 143 227 128Q218 108 240 100Q239 78 264 80Q276 60 296 73Q319 57 334 77Q357 71 366 94Q389 100 379 121Q391 141 371 153L361 186 351 175 350 150Q321 166 301 152Q273 163 251 151L247 183Z', fill, ink, 3.2);
      for (const [x, y, r] of [[243, 115, 12], [261, 94, 11], [285, 89, 13], [312, 88, 13], [342, 97, 12], [361, 115, 11], [248, 139, 11], [275, 128, 13], [302, 119, 12], [331, 133, 14], [357, 143, 9]]) {
        svg += line(`M${x - r} ${y}q-2 ${-r} ${r} ${-r}q${r} 0 ${r - 2} ${r}q-2 6-8 3`, light, 2.1);
      }
      svg += line('M239 166 243 169M358 164 360 161M260 150 270 153', c.hair[2], 2);
      regions = [E(303, 117, 77, 50), E(242, 169, 9, 19), E(358, 167, 9, 19)];
    } else if (c.look === 'braid') {
      svg = path('M345 219Q376 234 375 259L362 279Q389 283 376 308L361 322Q381 337 365 356L354 371 347 393 336 377 341 359Q323 342 338 325L345 312Q327 295 341 277L346 263Q333 244 345 219Z', fill, ink, 3) +
        line('M350 240Q370 250 357 266Q341 278 362 293Q376 306 350 321Q334 335 356 350L347 369', light, 3) +
        line('M359 272 345 282M366 308 345 300M340 338 361 329M348 359 359 363M344 374 348 384', c.hair[2], 2) +
        path('M240 190Q223 151 243 124Q269 95 309 105Q358 101 367 143L359 191 347 176 345 148Q302 167 280 143Q264 166 247 167L248 189Z', fill, ink, 3) +
        line('M251 143Q267 123 293 119M285 135Q310 152 339 139M317 116Q342 118 351 135', light, 3);
      regions = [E(300, 140, 65, 38), E(355, 308, 22, 84)];
    } else if (c.look === 'shag') {
      svg = path('M242 195 229 181 234 166 222 160 240 135 231 126 257 112 253 99 281 107Q309 80 336 103L332 114 356 109 352 127 374 139 365 154 374 173 359 192 351 172 338 178 334 149 314 163 304 144 280 161 274 146 252 171 248 191Z', fill, ink, 3) +
        line('M247 148Q273 117 306 117M278 128Q295 112 321 110M322 136 341 129M349 151 357 141M237 171 244 164', light, 3) +
        line('M268 137 258 151M307 129 298 143M345 163 345 150', c.hair[2], 1.8);
      regions = [E(300, 139, 73, 46), E(243, 177, 13, 20), E(356, 175, 12, 20)];
    } else if (c.look === 'pony') {
      svg = path('M340 126Q350 78 384 82Q420 86 415 127Q413 158 436 183Q403 201 380 170Q368 155 373 130L355 146Z', fill, ink, 3) +
        line('M363 110Q384 88 397 109Q405 145 424 178M384 127Q379 158 407 176', light, 3) +
        path('M241 188Q226 152 247 124Q267 99 302 104Q344 101 359 136L360 184 349 192 346 156Q315 158 293 139Q274 164 249 163L250 187Z', fill, ink, 3) +
        line('M252 141Q268 121 291 116M302 116Q327 118 344 140M264 148Q281 141 287 130', light, 3);
      regions = [E(300, 140, 62, 37), E(388, 135, 34, 55, -22)];
    } else if (c.look === 'crop') {
      svg = path('M241 187Q230 161 239 137Q248 113 275 108Q309 96 339 114Q370 134 361 181L351 190 347 161Q335 147 321 153L298 147 279 155 256 155 248 188Z', fill, ink, 3);
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          const x = 254 + col * 14 + (row % 2) * 3;
          const y = 127 + row * 7 - Math.sin(col * .5) * 11;
          svg += line(`M${x} ${y}q3-4 7-1`, light, 1.6);
        }
      }
      svg += line('M241 170 245 167M356 169 359 165', c.hair[2], 2);
      regions = [E(300, 139, 62, 36)];
    } else {
      svg = path('M247 157Q224 177 227 203Q208 222 224 244Q209 267 233 283Q241 305 263 290L278 270Q250 252 254 225L258 183Z', fill, ink, 3) +
        path('M349 156Q375 175 371 204Q392 222 375 243Q396 265 371 282Q359 305 338 291L325 270Q353 250 347 224L343 183Z', fill, ink, 3) +
        path('M239 184Q223 147 249 119Q278 91 309 103Q349 96 365 131L363 183 350 188 346 153Q319 160 298 137Q276 163 248 168Z', fill, ink, 3) +
        line('M251 142Q274 116 294 117M309 117Q341 119 350 141M242 195Q233 215 244 234Q230 254 251 275M359 194Q372 215 360 234Q376 255 353 279', light, 3) +
        line('M234 242 242 245M366 243 358 247M261 151Q282 139 286 130', c.hair[2], 2);
      regions = [E(300, 141, 65, 39), E(246, 240, 24, 55), E(356, 240, 24, 55)];
    }
    return { svg, regions };
  }

  function makeClothes(c, h) {
    const { add, pair, pairedRegions, cloth, ref } = h;
    const hem = line('M246 434Q300 447 354 434', c.colors[0], 2);
    const torsoRegions = [E(300, 365, 58, 76)];
    const sleeves = pairedRegions([E(221, 339, 24, 42, 17)]);
    const longSleeves = pairedRegions([E(217, 366, 22, 70, 12)]);
    const longLegs = [E(263, 547, 29, 114, 2), E(341, 547, 29, 114, -3)];
    const shortsRegions = [E(262, 480, 31, 47), E(339, 480, 31, 47)];
    const shortSleeve = fill => pair(path('M242 291Q215 291 204 322L195 357Q213 370 236 365L253 321Z', fill, ink, 3) +
      line('M201 354Q215 363 235 358', '#fff1d4', 2));
    const longSleeve = fill => pair(path('M243 291Q218 289 207 319L192 378 184 443Q197 453 214 446L222 395 242 347 256 315Z', fill, ink, 3) +
      path('M185 434 217 439 216 454Q196 458 183 449Z', c.accent, ink, 2) +
      line('M197 376 211 382M195 384 207 389M192 440 192 450M199 442 198 452M206 443 205 452', c.colors[2], 1.5));
    const plainTop = fill => path('M257 288 280 282Q300 304 321 282L345 289 358 343 355 441Q300 451 241 440L244 341Z', fill, ink, 3);
    const pocket = (x, y, color) => path(`M${x} ${y}h29v25q-14 13-29 0Z`, color, ink, 1.7) +
      line(`M${x + 4} ${y + 5}h21`, '#fff4d9', 1.3);
    const trousers = (name, fill, cuff = true) => {
      let svg = path('M240 432Q299 420 359 433L369 514 364 665 328 665 319 574 300 484 286 572 282 665 239 665 234 516Z', fill, ink, 3) +
        path('M300 453 307 476 286 572 282 650 268 650 270 565Z', '#283743', 'none', 0, 'opacity=".16"') +
        path('M345 453 359 442 369 514 364 651 351 652 355 519Z', '#283743', 'none', 0, 'opacity=".18"') +
        line('M249 459Q260 478 279 472M321 472Q342 479 351 459M299 442 300 484M246 550 267 543M248 560 263 555M337 552 359 561M335 560 352 565M249 645 270 642M339 641 354 645', c.colors[2], 1.8) +
        line('M244 479 242 522 246 642M357 479 363 519 358 642', '#fff1ce', 1.2);
      if (cuff) svg += path('M235 646 284 646 284 668 236 668ZM326 646 367 646 367 668 328 668Z', c.accent, ink, 2) +
        line('M242 656H277M334 656H360', '#fff0d2', 2);
      add(name, 50, svg, longLegs, true);
    };
    const shorts = (fill, scalloped = false) => add('shorts', 50,
      path('M239 432Q300 422 360 433L368 516Q344 532 316 520L301 474 286 521Q260 531 233 518Z', fill, ink, 3) +
      path('M300 449 307 471 286 521 273 524Z', '#344650', 'none', 0, 'opacity=".18"') +
      line('M248 448Q250 467 272 468M329 469Q349 467 352 449M300 438 301 474', '#d9e2c5', 1.8) +
      path('M233 507Q259 517 289 509L286 523Q260 533 233 521ZM312 509Q340 519 368 507L369 520Q341 534 316 524Z', c.accent, ink, 2) +
      (scalloped ? line('M242 515 247 517M258 519 263 519M277 517 282 516M324 519 329 520M341 520 346 519M357 516 362 514', c.colors[2], 1.3) : ''),
    shortsRegions, true);
    const socks = (high = false) => add('socks', 53,
      path(`M243 ${high ? 609 : 652}Q260 ${high ? 615 : 658} 280 ${high ? 651 - 42 : 652}L279 693 244 693Z`, '#fff0d7', ink, 2) +
      path(`M328 ${high ? 609 : 652}Q345 ${high ? 615 : 658} 364 ${high ? 609 : 652}L365 693 331 693Z`, '#fff0d7', ink, 2) +
      line(high ? 'M245 623 278 623M330 623 363 623M246 632 277 632M331 632 363 632' :
        'M245 666 279 666M331 666 363 666', c.accent, 4),
      [E(261, high ? 650 : 673, 19, high ? 42 : 20), E(346, high ? 650 : 673, 19, high ? 42 : 20)], true);
    const shoes = (type, shape) => {
      const shoe = path('M243 680 276 681Q286 693 282 716Q279 730 224 728Q199 729 198 714Q198 701 222 696Z', ref('shoe'), ink, 3) +
        path('M199 712Q236 723 282 712L282 723Q273 736 220 732Q199 731 199 722Z', '#efe5ce', ink, 2.2) +
        line('M207 725Q239 731 274 723', '#adac9f', 1.2) +
        path('M205 704Q219 697 233 701L246 712Q225 719 201 712Z', c.accent, ink, 1.6) +
        line('M214 705 227 704', '#fff8e6', 2);
      let detail = '';
      if (shape === 'lace') detail = path('M245 685 262 686 265 706 235 707Z', '#fff0d2', ink, 1.5) +
        line('M243 692 262 696M240 699 262 703M253 691Q240 680 238 688Q238 695 251 693Q265 680 267 688Q267 694 255 694', '#526777', 2) +
        line('M271 694 272 702M263 713 270 712', '#fff1cf', 2);
      if (shape === 'mary') detail = path('M238 685Q254 690 273 687L276 697Q252 702 231 695Z', c.accent, ink, 2) +
        rect(257, 688, 11, 8, 2, '#e7bd72', ink, 1.2) +
        oval(246, 697, 2, 2, '#fff7dc');
      if (shape === 'boot') detail = path('M239 648 280 648 279 696Q263 705 232 698Z', ref('shoe'), ink, 2.5) +
        path('M237 646 282 646 282 660 237 660Z', c.accent, ink, 2) +
        line('M247 667 271 670M245 676 270 679M243 685 268 688', '#fff0d3', 2.5) +
        rect(274, 668, 7, 14, 2, '#ddc69c', ink, 1.2);
      add(type, 55, shoe + detail + group(shoe + detail, 'translate(605 0) scale(-1 1)'),
        shape === 'boot' ? [E(255, 672, 26, 27), E(350, 672, 26, 27), E(240, 712, 43, 22), E(365, 712, 43, 22)] :
          [E(240, 708, 43, 25), E(365, 708, 43, 25)], true);
    };

    if (c.style === 'hoodie') {
      shorts(c.lower, true); socks(); shoes('trainers', 'lace');
      add('hoodie', 60, longSleeve(cloth) + plainTop(cloth) +
        path('M277 279Q256 271 247 294Q256 320 284 320L300 301 316 320Q341 313 354 294Q342 272 322 280L300 293Z', cloth, ink, 2.5) +
        path('M269 379 330 379 343 413Q303 431 257 414Z', c.accent, ink, 2) +
        line('M273 387 266 402M326 387 335 403M271 414Q300 422 331 414M282 314 279 348M319 314 322 346', '#fff1d2', 2.3) +
        rect(275, 344, 7, 10, 2, '#f1c87d') + rect(319, 342, 7, 10, 2, '#f1c87d') +
        oval(301, 348, 12, 12, '#f9d580', ink, 1.5) +
        line('M296 346 296 347M306 346 306 347M296 352Q301 356 306 352', '#7c6751', 1.6) +
        path('M242 431Q300 443 356 431L356 446Q299 458 241 446Z', '#2c8187', ink, 2) +
        line('M253 439 253 449M263 441 263 450M335 441 335 450M345 439 345 448', c.colors[0], 1.4),
      [...torsoRegions, ...longSleeves, E(301, 299, 49, 23)], true);
    } else if (c.style === 'pinafore') {
      socks(true); shoes('shoes', 'mary');
      add('blouse', 58, shortSleeve('#fff0cf') + plainTop('#fff0cf') +
        path('M279 283 300 301 285 318 269 295ZM321 283 300 301 315 318 332 295Z', '#fffbed', ink, 2),
      [...torsoRegions, ...sleeves], true);
      add('dress', 60,
        path('M256 291 273 291 279 345 320 345 327 291 344 293 340 369Q350 432 377 531Q299 556 223 530Q249 437 257 369Z', cloth, ink, 3) +
        path('M264 366 335 366Q346 445 369 525Q300 546 231 525Q253 441 264 366Z', ref('sprigs'), 'none') +
        path('M264 343Q300 353 336 343L337 403Q300 416 262 403Z', cloth, ink, 2) +
        pocket(283, 368, c.accent) +
        oval(266, 342, 4, 4, '#f3dba4', ink, 1) + oval(333, 342, 4, 4, '#f3dba4', ink, 1) +
        line('M260 427 243 512M340 427 357 512M230 526Q300 545 369 526', '#d9dded', 2) +
        line('M260 300 266 329M335 302 332 330', c.colors[0], 2),
      [E(300, 378, 38, 39), E(300, 476, 69, 67), E(265, 316, 11, 29), E(334, 317, 11, 28)], true);
    } else if (c.style === 'knit') {
      trousers('jeans', c.lower); socks(); shoes('trainers', 'lace');
      add('sweater', 60, longSleeve(cloth) + plainTop(cloth) +
        path('M254 328 278 345 300 331 323 345 347 328 352 355 325 371 301 356 278 371 248 353Z', c.accent, ink, 1.6) +
        line('M251 344 278 361 300 346 324 361 349 345', '#fff2d4', 3) +
        path('M278 283Q300 301 322 283L329 295Q300 317 271 294Z', c.accent, ink, 2) +
        path('M241 429Q300 441 355 429L357 451Q301 463 241 449Z', c.accent, ink, 2) +
        [257, 269, 281, 293, 305, 317, 329, 341].map(x => line(`M${x} 437v13`, '#e7e2c5', 1.4)).join('') +
        [264, 288, 312, 336].map(x => line(`M${x} 391l4 4-4 4-4-4Z`, '#ffe2ad', 1.5)).join('') +
        line('M251 400 250 421M347 400 349 421', c.colors[2], 2),
      [...torsoRegions, ...longSleeves], true);
    } else if (c.style === 'pleats') {
      add('tights', 49,
        path('M243 432H358L364 520 361 684 373 702 395 713Q383 725 332 716L328 590 302 477 282 587 277 716Q240 727 210 714L241 697 241 581 234 518Z', '#707d96', ink, 2.5) +
        line('M251 550 253 675M347 552 350 675', '#a2a9b8', 2), [...longLegs, E(242, 707, 34, 14), E(364, 707, 33, 14)], true);
      shoes('shoes', 'mary');
      add('blouse', 58, shortSleeve('#b5ded0') + plainTop('#b5ded0') +
        path('M277 283 300 301 286 319 266 294ZM323 283 300 301 315 319 336 294Z', '#edf2d8', ink, 2) +
        line('M300 317V407M249 336 251 370M349 337 348 369', '#6e9e98', 1.8) +
        [331, 355, 379, 401].map(y => oval(301, y, 2.5, 2.5, '#f6efce', ink, 1)).join('') +
        pocket(317, 332, '#cbe8d4'),
      [...torsoRegions, ...sleeves], true);
      add('skirt', 61,
        path('M246 411Q300 422 353 411L382 530Q299 557 219 530Z', cloth, ink, 3) +
        path('M259 430 254 536 272 540 279 433ZM300 435 300 544 320 543 319 434ZM339 431 352 537 368 533 351 430Z', c.colors[2], 'none', 0, 'opacity=".32"') +
        line('M259 430 254 535M279 433 272 539M301 435V541M319 434 322 540M339 431 352 535', '#ffd6bb', 2) +
        path('M245 410Q300 421 354 410L357 429Q299 440 242 428Z', c.colors[2], ink, 2) +
        line('M226 527Q301 550 375 527', c.colors[0], 2),
      [E(300, 478, 75, 65), E(300, 421, 56, 14)], true);
    } else if (c.style === 'camp') {
      shorts(c.lower);
      const sandal = path('M210 704Q241 706 277 699L282 717Q264 733 215 727Q199 724 202 715Z', '#bc9568', ink, 2.5) +
        path('M213 699 224 695 248 714 232 718ZM246 682 256 680 278 704 264 710Z', c.accent, ink, 2) +
        path('M242 678 277 678 278 688 239 688Z', c.accent, ink, 2) +
        rect(261, 678, 12, 10, 2, '#f4d68b', ink, 1.5) +
        line('M212 722Q239 728 272 718', '#f4dbaf', 1.5);
      add('sandals', 55, sandal + group(sandal, 'translate(605 0) scale(-1 1)'),
        [E(240, 709, 40, 21), E(365, 709, 40, 21), E(261, 684, 22, 9), E(344, 684, 22, 9)], true);
      add('shirt', 60, shortSleeve(cloth) + plainTop(cloth) +
        path('M263 287 283 283 302 312 279 327 264 306ZM324 283 339 288 338 309 318 327 302 312Z', '#fff0b9', ink, 2) +
        line('M302 313V440', c.colors[2], 2) +
        pocket(318, 338, '#ebcf85') +
        [336, 363, 390, 420].map(y => oval(302, y, 3, 3, '#8b7650')).join('') +
        [E(267, 344, 8, 12), E(277, 394, 8, 12), E(331, 406, 8, 12)].map(e =>
          path(`M${e.cx} ${e.cy + 12}q-17-13-4-24q18 8 4 24Z`, '#659b86', 'none') +
          line(`M${e.cx - 2} ${e.cy + 6}l-2-11`, '#d1dfaf', 1.4)).join('') + hem,
      [...torsoRegions, ...sleeves], true);
    } else if (c.style === 'varsity') {
      trousers('trousers', c.lower, false); socks(); shoes('trainers', 'lace');
      add('T-shirt', 58, shortSleeve('#fff1d6') + plainTop('#fff1d6') +
        path('M275 340Q300 326 324 340L324 351Q300 338 275 351Z', c.accent, 'none') +
        path('M275 355Q300 341 324 355L324 366Q300 353 275 366Z', c.colors[1], 'none'),
      [...torsoRegions, ...sleeves], true);
      add('jacket', 61, longSleeve('#eee0bb') +
        path('M259 286 280 283 289 315 283 445 239 439 245 343Z', cloth, ink, 3) +
        path('M321 283 343 290 358 344 359 440 318 446 310 316Z', cloth, ink, 3) +
        path('M263 285 280 281 293 310 282 320ZM319 282 336 286 317 319 308 310Z', c.accent, ink, 2) +
        path('M239 427 284 431 283 449 239 445ZM317 432 359 427 360 445 319 450Z', c.accent, ink, 2) +
        line('M246 437 278 441M324 441 353 437M254 386 270 392M331 392 347 386', '#fff6db', 3) +
        [332, 356, 381, 406].map(y => oval(319 + (y - 332) * .03, y, 3, 3, '#f8dfad', ink, 1)).join('') +
        line('M268 302 266 346M339 304 344 347', c.colors[0], 2),
      [E(262, 366, 22, 77, -4), E(336, 366, 23, 77, 4), ...longSleeves], true);
    } else if (c.style === 'utility') {
      trousers('trousers', c.lower); shoes('boots', 'boot');
      add('shirt', 58, shortSleeve('#f0d196') + plainTop('#f0d196') +
        path('M275 282 299 301 282 321 263 293ZM323 282 300 301 317 321 338 293Z', '#ffebbc', ink, 2) +
        line('M300 315V441', '#aa875c', 1.6) +
        [337, 365, 395, 425].map(y => oval(300, y, 2.5, 2.5, '#806953')).join(''),
      [...torsoRegions, ...sleeves], true);
      add('vest', 61,
        path('M259 289 279 287 288 325 284 448 240 442 242 353Q254 328 259 289Z', cloth, ink, 3) +
        path('M322 287 343 291Q347 328 358 354L360 442 318 448 310 325Z', cloth, ink, 3) +
        pocket(247, 392, '#a7be88') + pocket(326, 392, '#a7be88') +
        path('M247 389h30l-2 14-13 5-14-5ZM325 389h30l-2 14-13 5-14-5Z', c.accent, ink, 1.8) +
        rect(258, 335, 21, 31, 3, '#a7be88', ink, 1.6) +
        line('M263 338v23M272 338v23M328 336h17M325 344h21M250 432 275 435M327 435 351 432', '#e1e6b5', 1.5) +
        oval(262, 399, 2, 2, '#735d43') + oval(340, 399, 2, 2, '#735d43'),
      [E(264, 367, 23, 78), E(337, 367, 23, 78)], true);
    } else {
      trousers('leggings', c.lower, false); shoes('shoes', 'mary');
      add('dress', 60, shortSleeve(cloth) +
        path('M257 289 279 281Q300 303 322 281L344 289 350 368 379 524Q368 544 352 532Q337 551 319 538Q302 555 285 539Q267 550 250 534Q232 545 220 524L245 368Z', cloth, ink, 3) +
        path('M254 354Q300 368 347 354L350 383Q300 398 248 382Z', c.accent, ink, 2) +
        path('M277 282Q300 302 322 282L329 295Q319 311 308 306Q299 318 289 307Q275 311 270 295Z', '#e9ead4', ink, 1.8) +
        [252, 280, 309, 339].map((x, i) => {
          const y = 449 + (i % 2) * 35;
          return path(`M${x} ${y}q-11-12-17 0q0 10 17 10q17 0 17-10q-6-12-17 0Z`, c.accent, ink, 1.3) +
            line(`M${x} ${y - 4}v19`, '#fff0d1', 1.5);
        }).join('') +
        line('M246 411 233 513M354 412 367 514M227 525Q238 535 250 524Q268 541 284 529Q300 545 319 529Q336 541 352 523Q366 535 374 524', '#d8c9e6', 2) +
        line('M258 330Q300 345 342 330', '#e4cfe9', 2),
      [...sleeves, E(300, 334, 49, 47), E(300, 463, 75, 78)], true);
    }
  }

  const accessoryWords = {
    cap: ['Cap', 'כובע מצחייה'], hat: ['Hat', 'כובע'], beret: ['Beret', 'כובע ברט'],
    headband: ['Headband', 'סרט ראש'], 'hair-clip': ['Hair clip', 'סיכת שיער'],
    earmuffs: ['Earmuffs', 'מחממי אוזניים'], glasses: ['Glasses', 'משקפיים'],
    sunglasses: ['Sunglasses', 'משקפי שמש'], scarf: ['Scarf', 'צעיף'],
    necklace: ['Necklace', 'שרשרת'], medal: ['Medal', 'מדליה'], watch: ['Watch', 'שעון'],
    bracelet: ['Bracelet', 'צמיד'], ring: ['Ring', 'טבעת'], badge: ['Badge', 'תג'],
    brooch: ['Brooch', 'סיכה דקורטיבית'], backpack: ['Backpack', 'תרמיל'],
    armband: ['Armband', 'סרט זרוע'], 'knee-pads': ['Knee pads', 'מגני ברכיים']
  };
  function makeAccessory(name, index, c, wrap) {
    const a = c.accent, dark = c.colors[2], pale = c.colors[0];
    let svg = '', rearSvg = '', slot = '';
    if (['cap', 'hat', 'beret', 'headband', 'hair-clip', 'earmuffs'].includes(name)) slot = 'headwear';
    if (name === 'cap') {
      svg = path('M235 148Q231 94 283 88Q338 77 361 125L360 151Q302 133 235 148Z', dark, ink, 2.6) +
        path('M241 139Q300 121 360 142L384 158Q356 173 326 155Q282 146 241 157Z', a, ink, 2.5) +
        line('M286 91Q301 107 301 134M249 113Q257 97 276 96M244 145Q287 135 330 144', pale, 2) +
        rect(313, 107, 20, 17, 4, a, ink, 1.5) + line('M318 116h10M323 111v10', '#fff3d0', 2);
    } else if (name === 'hat') {
      svg = path('M247 139 254 94Q271 88 290 101Q315 85 344 96L355 139Z', a, ink, 2.8) +
        path('M226 137Q300 125 371 136L387 151Q354 174 298 164Q243 176 213 151Z', a, ink, 2.8) +
        path('M247 128Q300 117 354 128L357 141Q300 132 243 143Z', dark, ink, 1.5) +
        line('M254 106 251 120M341 107 345 120M226 150Q256 163 283 155M320 155Q354 162 374 149', '#fff2c9', 2);
    } else if (name === 'beret') {
      svg = path('M236 139Q214 115 244 93Q269 71 320 82Q368 81 373 112Q373 140 341 146Z', dark, ink, 2.8) +
        path('M238 136Q291 119 349 132L349 148Q295 138 241 155Z', a, ink, 2) +
        path('M297 83 298 72 307 71 306 84Z', dark, ink, 1.8) +
        line('M237 116Q248 95 275 92M288 87Q325 82 345 95M244 143Q287 130 332 139', pale, 2.3);
    } else if (name === 'headband') {
      svg = path('M237 163Q287 128 358 151L359 163Q287 141 239 177Z', a, ink, 2.4) +
        line('M243 164Q290 138 350 156', '#fff6dc', 2) +
        path('M337 149Q324 133 322 145L328 156 314 164Q325 175 338 163Q351 178 359 166L347 154Q359 138 349 139Z', dark, ink, 1.8) +
        oval(338, 156, 5, 6, pale, ink, 1.3);
    } else if (name === 'hair-clip') {
      svg = group(rect(329, 156, 26, 8, 4, '#f1d38c', ink, 1.5) +
        path('M338 159Q326 151 332 145Q339 139 345 151Q353 138 360 146Q364 153 351 160Z', a, ink, 1.8) +
        oval(345, 156, 4, 4, '#fff1ba', ink, 1), 'rotate(19 344 157)');
    } else if (name === 'earmuffs') {
      svg = line('M231 194Q211 95 298 92Q389 88 369 194', dark, 10) +
        line('M231 187Q220 101 298 98Q378 94 369 185', a, 4) +
        oval(232, 202, 16, 23, a, ink, 2.5) + oval(370, 202, 16, 23, a, ink, 2.5) +
        oval(232, 202, 10, 17, pale) + oval(370, 202, 10, 17, pale) +
        line('M228 190 235 214M366 190 374 214', '#fff4db', 2);
    } else if (name === 'glasses' || name === 'sunglasses') {
      slot = 'eyewear';
      const fill = name === 'glasses' ? 'none' : '#405970';
      const frame = c.n % 2 ? dark : '#8c6854';
      const lenses = c.n % 2 ?
        oval(274, 199, 21, 20, fill, frame, 3) + oval(326, 199, 21, 20, fill, frame, 3) :
        rect(253, 181, 42, 35, 10, fill, frame, 3) + rect(305, 181, 42, 35, 10, fill, frame, 3);
      svg = lenses + line('M295 194Q300 190 305 194M253 191 238 187M347 191 362 187', frame, 3) +
        line('M259 190 266 185M311 190 318 185', '#f9f5df', 2);
    } else if (name === 'scarf') {
      slot = 'neckwear';
      svg = path('M278 275Q300 290 322 275L333 291Q312 310 278 302L267 287Z', a, ink, 2.4) +
        path('M316 298Q337 315 348 348L330 344 324 355 303 306Z', a, ink, 2.2) +
        path('M296 295 314 291 323 303 311 312 299 307Z', dark, ink, 2) +
        line('M278 287Q295 300 315 291M321 312 337 341M327 343 328 349M333 341 337 346', '#fff1cf', 2);
    } else if (name === 'necklace') {
      slot = 'neckwear';
      svg = line('M279 286Q279 328 300 340Q322 326 323 286', '#987649', 3.5) +
        line('M279 286Q279 328 300 340Q322 326 323 286', '#f5d38a', 1.6) +
        (c.n % 2 ? path('M300 339 310 350 301 366 289 351Z', a, ink, 1.8) :
          path('M300 343Q293 334 288 342Q283 353 300 363Q317 353 311 342Q306 336 300 343Z', a, ink, 1.8)) +
        line('M295 348 300 355', '#fff3cf', 2);
    } else if (name === 'medal') {
      slot = 'neckwear';
      svg = path('M275 290 284 286 302 341 318 286 328 289 307 351 296 351Z', pale, ink, 1.8) +
        line('M280 290 300 344M323 291 304 344', dark, 2) +
        oval(302, 359, 15, 17, '#edc46f', ink, 2) + oval(302, 359, 10, 12, '#ffe4a0', '#b58c47', 1) +
        path('M302 350 305 356 311 357 307 362 308 368 302 364 296 368 297 362 293 357 299 356Z', a, ink, 1);
    } else if (name === 'watch') {
      slot = 'left-wrist';
      const face = c.n % 2 ? oval(197, 462, 10, 12, '#fff2d2', ink, 2) :
        rect(187, 451, 21, 22, 5, '#fff2d2', ink, 2);
      svg = path('M183 451 211 454 210 470 182 467Z', dark, ink, 2) + face +
        (c.n % 2 ? line('M197 455v8l5 2M193 452h1M202 470h1', dark, 1.6) :
          rect(190, 455, 15, 11, 2, pale, 'none') + line('M193 458h3v5h-3v-5M200 458h2v5h-2v-5', dark, 1.2)) +
        rect(208, 458, 3, 6, 1, a, ink, 1);
    } else if (name === 'bracelet') {
      slot = 'right-wrist';
      const beads = [185, 191, 197, 203, 209].map((x, i) =>
        oval(x, 462 + Math.sin(i * .65) * 2, 3.7, 4.2, i % 2 ? a : '#f6dc9d', ink, 1)).join('');
      svg = group(c.n % 2 ? beads :
        path('M183 455Q196 462 210 457L209 467Q195 472 182 465Z', a, ink, 1.8) +
        line('M186 461Q197 467 207 462', '#fff3d1', 2), `translate(600 ${c.lift}) scale(-1 1)`);
    } else if (name === 'ring') {
      slot = 'finger';
      svg = path('M194 501 202 501 203 506 194 506Z', '#e7c073', ink, 1) +
        path('M195 501 197 497 201 498 203 501 200 504Z', a, ink, 1) +
        line('M198 499 200 501', '#fff8dc', 1);
    } else if (name === 'badge') {
      slot = 'chest-decoration';
      svg = path('M251 342 274 342 278 360 263 374 248 360Z', a, ink, 2) +
        path('M263 347 266 353 273 354 268 359 269 366 263 362 257 366 258 359 253 354 260 353Z', '#fff0be', dark, 1.4) +
        line('M253 346 271 346', '#fff8df', 1.3);
    } else if (name === 'brooch') {
      slot = 'chest-decoration';
      svg = c.n % 2 ? path('M262 354Q244 338 259 326Q276 329 266 350Q283 332 289 345Q282 359 266 356L261 366Z', a, ink, 1.8) +
        line('M261 353 260 334M266 353 282 345', '#fff2cf', 1.5) :
        [0, 60, 120].map(angle => group(oval(265, 342, 5, 13, a, ink, 1.3), `rotate(${angle} 265 342)`)).join('') +
        oval(265, 342, 5, 5, '#f6d47e', ink, 1.2);
    } else if (name === 'backpack') {
      slot = 'back';
      const hiking = c.n === 7 || c.n === 9;
      rearSvg = line('M282 291L282 277Q300 266 318 277L318 291', dark, 7) +
        path(hiking ?
          'M226 304Q231 284 257 282L343 282Q369 284 374 304L391 417Q388 440 365 442L235 442Q212 440 209 417Z' :
          'M224 321Q222 289 253 286L347 286Q378 289 376 321L389 412Q390 434 366 436L234 436Q210 434 211 412Z',
        pale, ink, 2.8) +
        path('M230 322 246 324 238 425 220 425Q216 420 217 412Z', dark, 'none') +
        path('M370 322 354 324 362 425 380 425Q384 420 383 412Z', dark, 'none') +
        rect(210, 370, 26, 51, 8, a, ink, 2) + rect(364, 370, 26, 51, 8, a, ink, 2) +
        line('M215 382h16M369 382h16', '#fff2cd', 2) +
        (hiking ?
          path('M230 297Q300 280 370 297L365 330Q300 344 235 330Z', a, ink, 2) +
          rect(266, 321, 9, 26, 3, dark) + rect(325, 321, 9, 26, 3, dark) :
          line('M235 320Q300 302 365 320', dark, 3) +
          rect(246, 356, 108, 59, 12, a, ink, 2)) +
        line('M252 371h96', dark, 2);
      // The bag sits behind earned anatomy/outfits; only fitted shoulder straps paint in front.
      svg = path('M253 293Q242 296 240 309Q242 352 248 389L257 420 265 416 260 385Q252 345 252 315Q252 306 262 303Z', dark, ink, 2) +
        path('M347 293Q358 296 360 309Q358 352 352 389L343 420 335 416 340 385Q348 345 348 315Q348 306 338 303Z', dark, ink, 2) +
        line('M251 305Q245 312 254 371M349 305Q355 312 346 371', a, 4) +
        rect(249, 375, 12, 16, 3, '#f4d59b', ink, 1.4) +
        rect(339, 375, 12, 16, 3, '#f4d59b', ink, 1.4) +
        line('M252 382h6M342 382h6', dark, 2);
    } else if (name === 'armband') {
      slot = 'upperarm';
      svg = path('M202 347Q216 357 239 354L235 367Q213 371 198 361Z', a, ink, 2) +
        line('M203 353Q218 362 236 359', '#fff0cf', 2) +
        rect(213, 351, 13, 14, 3, dark, ink, 1.3) +
        line('M217 358h5', '#fff0cf', 2);
    } else if (name === 'knee-pads') {
      slot = 'knees';
      const pad = x => path(`M${x - 23} 548Q${x} 542 ${x + 23} 548L${x + 23} 578Q${x} 587 ${x - 23} 579Z`, dark, ink, 2) +
        rect(x - 18, 542, 36, 47, 14, a, ink, 2.2) +
        rect(x - 12, 549, 24, 31, 9, pale, ink, 1.2) +
        line(`M${x - 7} 556h14M${x - 7} 565h14M${x - 5} 574h10`, '#fff4da', 2);
      svg = pad(264) + pad(345);
    }
    if (!svg || !slot) throw new Error(`Incomplete accessory: ${name}/${index}`);
    return { id: name, en: accessoryWords[name][0], he: accessoryWords[name][1], slot, svg: wrap(svg),
      ...(rearSvg ? { rearSvg: wrap(rearSvg) } : {}) };
  }

  const characters = {}, art = {}, accessories = {};
  configs.forEach(c => {
    const result = make(c);
    characters[result.character.id] = result.character;
    art[result.character.id] = result.art;
    accessories[result.character.id] = result.accessories;
  });
  Object.assign(window.IllustratedCharacters, characters);
  Object.assign(window.IllustratedLayers, art);
  Object.assign(window.CharacterAccessories, accessories);
}());
