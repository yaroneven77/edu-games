/* Eight original rescue heroes. Global 600 × 800 geometry; no external assets.
 * Anatomy, clothes and optional wearables remain independently paintable.
 * The standalone SVGs are exports of these same ordered layers, without extras.
 */
(function () {
  'use strict';

  window.IllustratedCharacters = window.IllustratedCharacters || {};
  window.IllustratedLayers = window.IllustratedLayers || {};
  window.CharacterAccessories = window.CharacterAccessories || {};

  const ink = '#263544';
  const bodyIds = 'head hair forehead eyes ears nose cheeks mouth lips chin jaw neck shoulders chest waist arms elbows wrists hands palms fingers legs thighs knees ankles feet heels'.split(' ');
  const ellipse = (cx, cy, rx, ry, angle = 0) => ({ cx, cy, rx, ry, angle });
  const path = (d, fill, stroke = ink, width = 2.6) =>
    `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const line = (d, stroke, width = 1.8) => path(d, 'none', stroke, width);
  const oval = (x, y, rx, ry, fill, stroke = 'none', width = 1.6) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const group = (svg, transform) => `<g${transform ? ` transform="${transform}"` : ''}>${svg}</g>`;
  const n = value => Math.round(value * 1000) / 1000;
  const angle = (a, b) => n(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90);
  const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const segmentRegion = (a, b, r) => ellipse(n((a[0] + b[0]) / 2), n((a[1] + b[1]) / 2), r, n(distance(a, b) / 2), angle(a, b));
  const local = (svg, origin, rotation = 0) => group(svg, `translate(${origin[0]} ${origin[1]}) rotate(${rotation})`);
  function localRegion(origin, rotation, x, y, rx, ry) {
    const rad = rotation * Math.PI / 180;
    return ellipse(n(origin[0] + x * Math.cos(rad) - y * Math.sin(rad)),
      n(origin[1] + x * Math.sin(rad) + y * Math.cos(rad)), rx, ry, rotation);
  }
  function limb(a, b, start, end, fill, shade, accent) {
    const length = n(distance(a, b));
    return local(
      path(`M${-start} 0Q${-start - 3} ${n(length * .32)} ${-end} ${length}Q0 ${length + 3} ${end} ${length}Q${start + 3} ${n(length * .3)} ${start} 0Q0 -5 ${-start} 0Z`, fill) +
      path(`M${start * .35} 2Q${start * .65} ${length * .45} ${end * .25} ${length}L${end} ${length}Q${start + 2} ${length * .4} ${start} 0Z`, shade, 'none') +
      (accent ? line(`M${-start * .55} 12Q${-start * .65} ${length * .4} ${-end * .55} ${length - 12}`, accent, 2.2) : ''),
      a, angle(a, b));
  }
  function band(a, b, t, halfWidth, height, fill, accent) {
    return local(path(`M${-halfWidth} ${-height / 2}Q0 ${-height / 2 + 4} ${halfWidth} ${-height / 2}L${halfWidth} ${height / 2}Q0 ${height / 2 + 4} ${-halfWidth} ${height / 2}Z`, fill) +
      line(`M${-halfWidth + 4} ${-height / 2 + 4}Q0 ${-height / 2 + 7} ${halfWidth - 4} ${-height / 2 + 4}`, accent, 1.6), mix(a, b, t), angle(a, b));
  }

  const designs = [
    {
      id: 'superhero-03', en: 'Sunweaver', he: 'אורגת השמש',
      descriptionHe: 'מחלצת מלאת תקווה בחליפה זהובה, גלימה רחבה, צמה מתולתלת וסמל שמש גאומטרי.',
      skin: '#d79a70', shade: '#b97254', light: '#f3bf8f', hair: '#49332e', hairLight: '#a86b46',
      main: '#f4ae36', dark: '#99522c', pale: '#fff2bc', secondary: '#315c73',
      build: 69, hip: 47, head: 37, dx: -4, sleeve: .94, boot: 603, legWidth: 26,
      arms: [[[232, 238], [200, 326], [183, 414]], [[366, 239], [404, 320], [389, 407]]],
      legs: [[[275, 424], [259, 548], [245, 687]], [[325, 424], [350, 548], [367, 687]]],
      cape: 'M238 218Q194 225 185 288L111 560Q158 605 221 575L277 609 326 574 378 589Q430 567 468 517L401 275Q379 225 338 218Z',
      folds: 'M227 259Q209 401 159 565M255 271 243 551M347 274Q367 439 412 548',
      capeShade: 'M204 270 111 560Q152 594 188 586L248 248ZM358 250Q383 423 468 517L428 552 323 236Z',
      capeLight: 'M270 253 282 586 313 565 318 251Z',
      hairShape: 'M262 142Q247 128 253 107Q247 90 263 84Q264 67 283 72Q295 55 311 70Q330 65 337 82Q351 86 346 106Q352 124 336 142L330 116Q309 123 296 102Q289 121 266 120Z',
      hairLines: 'M264 96q8-17 21-11M291 81q10-9 20 2M319 88q17-2 18 14M260 109q14 5 24-7',
      hairExtra: 'M333 102Q373 87 388 117Q399 139 378 151Q393 169 376 187Q391 207 371 224L360 214Q367 195 354 179Q365 159 350 145L332 131Z',
      accessories: ['headband', 'medal', 'armband', 'bracelet', 'ring', 'backpack', 'knee-pads', 'brooch', 'hair-clip', 'shoulder-cord']
    },
    {
      id: 'superhero-04', en: 'Tidekeeper', he: 'שומר הגאות',
      descriptionHe: 'שומר חופים בחליפת טורקיז, גלימה קצרה, מגפיים גבוהים וסמל טיפה עם גל.',
      skin: '#bd8060', shade: '#905841', light: '#e8b18b', hair: '#223d49', hairLight: '#527b88',
      main: '#28a7b2', dark: '#176274', pale: '#d8fff0', secondary: '#214568',
      build: 78, hip: 51, head: 40, dx: 5, sleeve: .7, boot: 579, legWidth: 29,
      arms: [[[222, 241], [185, 331], [175, 422]], [[377, 241], [419, 329], [431, 416]]],
      legs: [[[271, 424], [250, 550], [241, 689]], [[329, 424], [352, 550], [359, 689]]],
      cape: 'M231 220Q176 240 172 311L130 458 194 492 221 477 255 501 288 483 329 495 368 479 409 485 461 439 423 303Q410 246 347 218Z',
      folds: 'M213 275 164 445M245 267 228 458M362 266 402 455',
      capeShade: 'M196 266 130 458 169 479 240 239ZM349 230 409 485 461 439 391 254Z',
      capeLight: 'M265 267 268 472 298 480 319 262Z',
      hairShape: 'M260 141 253 114 267 100 260 91 286 90 296 74 312 86 334 80 331 95 350 103 340 115 339 141 331 142 326 118Q300 124 278 112L268 143Z',
      hairLines: 'M270 105 292 100 302 88M301 106 327 99M264 123 266 133',
      hairExtra: '',
      accessories: ['cap', 'badge', 'scarf', 'watch', 'knee-pads', 'backpack', 'armband', 'ring', 'boot-chain', 'shoulder-cord']
    },
    {
      id: 'superhero-05', en: 'Petalwing', he: 'כנף עלה',
      descriptionHe: 'מגינת גנים בחליפה סגולה, שיער באורך הכתפיים וגלימה רכה בצורת עלי כותרת.',
      skin: '#f0c3a0', shade: '#ce947e', light: '#ffe2bd', hair: '#342e56', hairLight: '#8173ad',
      main: '#755da6', dark: '#493966', pale: '#e6e6be', secondary: '#519b86',
      build: 62, hip: 47, head: 37, dx: 0, sleeve: .76, boot: 617, legWidth: 24,
      arms: [[[238, 238], [206, 324], [190, 406]], [[361, 238], [405, 315], [391, 387]]],
      legs: [[[278, 424], [270, 549], [255, 688]], [[324, 424], [339, 546], [352, 681]]],
      cape: 'M238 220Q190 231 176 307Q146 392 107 466Q128 499 165 493Q155 541 191 568Q217 573 240 550Q250 597 298 610Q340 587 352 549Q381 574 410 559Q437 532 426 490Q467 487 484 454L416 298Q393 230 347 219Z',
      folds: 'M234 250Q188 365 144 460M265 260 216 533M337 258 383 528M369 251 451 451',
      capeShade: 'M207 247 107 466Q128 499 165 493L256 237ZM354 230 426 490Q467 487 484 454L404 280Z',
      capeLight: 'M277 264 254 554 298 597 326 558 317 260Z',
      hairShape: 'M261 145Q247 94 272 84Q299 70 328 84Q350 98 338 151L330 164 326 116Q311 121 293 99Q285 116 268 120L270 165 257 170Z',
      hairLines: 'M263 103Q272 88 286 87M303 88q20 0 28 18M261 127 263 150M334 124 333 147',
      hairExtra: 'M258 122Q247 157 249 199L263 219 274 199 267 149ZM333 120Q353 144 352 186L333 217 327 200 334 165Z',
      accessories: ['hair-clip', 'earrings', 'brooch', 'bracelet', 'backpack', 'headband', 'necklace', 'ring', 'armband', 'anklets']
    },
    {
      id: 'superhero-06', en: 'Summit Signal', he: 'אות הפסגה',
      descriptionHe: 'מחלץ הרים רחב כתפיים בחליפה כתומה, כיסי ציוד, גלימה זוויתית וסמל פסגות.',
      skin: '#8d5b44', shade: '#653c32', light: '#c78c65', hair: '#292c36', hairLight: '#6b6270',
      main: '#e66b49', dark: '#913f3e', pale: '#ffdf9f', secondary: '#3e586f',
      build: 83, hip: 54, head: 40, dx: -3, sleeve: .84, boot: 592, legWidth: 31,
      arms: [[[216, 244], [179, 329], [174, 414]], [[382, 244], [420, 324], [400, 403]]],
      legs: [[[268, 424], [243, 551], [228, 689]], [[332, 424], [358, 551], [378, 689]]],
      cape: 'M223 219Q185 228 171 275L116 552 196 596 244 537 270 561 298 526 327 561 356 535 405 593 485 548 425 272Q410 226 347 217Z',
      folds: 'M223 251 158 542M257 264 216 538M342 263 386 539M379 253 447 539',
      capeShade: 'M198 252 116 552 156 574 238 230ZM360 232 444 571 485 548 405 250Z',
      capeLight: 'M278 263 270 537 298 509 325 538 316 260Z',
      hairShape: 'M261 138Q251 118 257 100Q265 75 298 77Q334 74 343 99L340 138 331 140 328 113Q298 104 270 118L268 142Z',
      hairLines: 'M266 103 276 97M280 97 290 92M296 94 307 91M314 95 324 97M261 117 267 116',
      hairExtra: '',
      accessories: ['beanie', 'earmuffs', 'scarf', 'badge', 'knee-pads', 'backpack', 'watch', 'armband', 'shoulder-cord', 'boot-chain']
    },
    {
      id: 'superhero-07', en: 'Cloudstep', he: 'צעד ענן',
      descriptionHe: 'שליח שמיים זריז בחליפה תכולה, שיער כסוף קוצני, גלימה קצרה וסמל ענן.',
      skin: '#e7b496', shade: '#be8270', light: '#ffdec0', hair: '#e1e8ef', hairLight: '#ffffff',
      main: '#619ec8', dark: '#395f94', pale: '#f4f5db', secondary: '#6e5ca3',
      build: 63, hip: 44, head: 36, dx: 8, sleeve: .64, boot: 628, legWidth: 24,
      arms: [[[237, 240], [207, 318], [176, 390]], [[363, 239], [402, 322], [419, 403]]],
      legs: [[[278, 424], [273, 550], [255, 685]], [[323, 424], [352, 542], [383, 677]]],
      cape: 'M241 219Q194 221 187 266Q181 350 132 412L214 391 199 456 279 401 269 465 330 412 351 444 385 386 456 416Q409 345 410 274Q401 227 343 218Z',
      folds: 'M231 252 176 390M270 252 251 396M346 250 374 380',
      capeShade: 'M211 239Q191 345 132 412L196 396 262 229ZM341 232 385 386 456 416Q409 345 410 274Z',
      capeLight: 'M279 251 280 400 307 429 326 252Z',
      hairShape: 'M264 142 252 116 262 105 248 96 273 90 280 70 300 83 316 63 323 86 350 87 339 103 347 118 334 145 328 115 309 120 295 99 275 119 270 145Z',
      hairLines: 'M268 103 283 94 286 85M302 95 315 83M320 104 337 95M259 117 266 130',
      hairExtra: '',
      accessories: ['headband', 'glasses', 'medal', 'bracelet', 'ring', 'knee-pads', 'armband', 'hair-clip', 'brooch', 'backpack']
    },
    {
      id: 'superhero-08', en: 'Mosaic', he: 'פסיפס',
      descriptionHe: 'גיבורת קהילה בחליפה ורודה, שתי פקעות שיער וגלימה מעוינת עם סמל פסיפס צבעוני.',
      skin: '#b47754', shade: '#885139', light: '#dfab79', hair: '#493128', hairLight: '#996346',
      main: '#de647e', dark: '#8f3f65', pale: '#ffdfae', secondary: '#4e7a8d',
      build: 72, hip: 54, head: 38, dx: -7, sleeve: .93, boot: 607, legWidth: 28,
      arms: [[[228, 241], [187, 326], [183, 418]], [[371, 241], [415, 326], [405, 412]]],
      legs: [[[273, 424], [254, 549], [246, 688]], [[328, 424], [348, 549], [365, 688]]],
      cape: 'M236 218Q195 230 185 281L105 481 177 551 235 501 283 556 337 498 391 544 473 474 414 278Q402 230 343 218Z',
      folds: 'M227 253 158 475M269 262 248 476M336 263 371 487M372 255 439 468',
      capeShade: 'M211 249 105 481 148 523 251 232ZM347 234 391 544 473 474 391 249Z',
      capeLight: 'M282 262 269 507 283 539 314 500 318 260Z',
      hairShape: 'M261 141Q250 122 258 99Q268 74 300 78Q330 75 343 102Q350 124 337 145L329 116Q309 121 284 101L270 120 268 144Z',
      hairLines: 'M265 107Q271 87 290 86M298 86q21 0 31 18M272 105l11 9M309 99l19 12',
      hairExtra: 'M269 87Q246 84 248 63Q250 45 269 45Q291 44 292 64L289 82ZM314 83Q306 64 321 52Q337 41 350 58Q363 78 342 91Z',
      accessories: ['beret', 'necklace', 'earrings', 'bracelet', 'badge', 'armband', 'knee-pads', 'backpack', 'ring', 'hair-clip']
    },
    {
      id: 'superhero-09', en: 'Groveguard', he: 'שומר החורש',
      descriptionHe: 'שומר יערות בחליפה ירוקה, שיער נחושתי, גלימה ארוכה וסמל עלים על החזה.',
      skin: '#edc39d', shade: '#c69576', light: '#ffe2b8', hair: '#9c512e', hairLight: '#e5974f',
      main: '#5e9470', dark: '#345c53', pale: '#e9dd91', secondary: '#795d45',
      build: 80, hip: 53, head: 41, dx: 2, sleeve: .57, boot: 587, legWidth: 30,
      arms: [[[220, 242], [181, 331], [169, 419]], [[379, 241], [418, 326], [435, 416]]],
      legs: [[[270, 424], [251, 550], [237, 688]], [[331, 424], [353, 550], [370, 688]]],
      cape: 'M227 219Q185 228 172 283L121 591 183 619 226 590 263 646 307 617 348 646 387 591 441 616 488 577 424 280Q407 230 345 218Z',
      folds: 'M219 260 161 584M257 269 241 579M335 267 360 584M375 254 444 584',
      capeShade: 'M199 255 121 591 158 607 241 234ZM353 232 441 616 488 577 402 250Z',
      capeLight: 'M277 265 275 619 307 601 334 623 319 265Z',
      hairShape: 'M260 141Q250 131 256 112L247 103 265 97Q267 77 287 82L301 68 313 82 333 78 333 96 349 104 341 118 338 145 329 139 325 117Q305 121 286 106L268 123 268 143Z',
      hairLines: 'M263 108 278 98 284 90M294 94 302 83M311 102 326 94M258 122l7 9',
      hairExtra: '',
      accessories: ['hat', 'brooch', 'scarf', 'bracelet', 'ring', 'backpack', 'badge', 'armband', 'boot-chain', 'knee-pads']
    },
    {
      id: 'superhero-10', en: 'Prism Relay', he: 'שליחת המנסרה',
      descriptionHe: 'שליחת חילוץ בחליפה כחולה וסגולה, קוקו גבוה, גלימה מפוצלת וסמל מנסרה זוהר.',
      skin: '#775447', shade: '#563a35', light: '#ad7f62', hair: '#263342', hairLight: '#64849b',
      main: '#497bc6', dark: '#304b84', pale: '#d2f6ed', secondary: '#a170b1',
      build: 65, hip: 46, head: 37, dx: 3, sleeve: .91, boot: 613, legWidth: 25,
      arms: [[[235, 238], [199, 325], [185, 410]], [[363, 239], [408, 320], [389, 391]]],
      legs: [[[277, 424], [265, 550], [249, 688]], [[325, 424], [348, 546], [370, 683]]],
      cape: 'M239 219Q188 224 175 277L114 505 184 473 211 558 274 493 300 529 338 485 411 560 398 469 479 492 415 277Q400 228 345 218Z',
      folds: 'M224 257 164 461M260 264 231 513M340 267 387 502M373 256 435 454',
      capeShade: 'M205 249 114 505 184 473 250 233ZM344 231 411 560 398 469 479 492 399 250Z',
      capeLight: 'M277 265 274 478 300 510 319 475 321 265Z',
      hairShape: 'M262 143Q251 123 258 101Q274 77 309 83Q337 80 345 104L337 144 330 141 327 117Q303 125 284 107L270 122 268 144Z',
      hairLines: 'M267 107q9-16 25-16M296 92q20-3 31 9M259 119l7 13M304 111l20 1',
      hairExtra: 'M330 95Q354 72 377 91Q398 111 380 143L369 189 351 222 352 173 362 137Q369 113 340 119Z',
      accessories: ['headband', 'earrings', 'medal', 'watch', 'ring', 'armband', 'backpack', 'shoulder-cord', 'knee-pads', 'brooch']
    }
  ];

  function insignia(index, d) {
    const a = d.pale, b = d.secondary;
    const emblems = [
      path('M0 -25 8 -12 24 -9 17 5 20 22 3 18 -10 29 -15 11 -29 2 -15 -8 -13 -25Z', a) +
        oval(0, 0, 10, 10, d.main, ink) + line('M-5 0 0 5 7 -5', ink, 2.4),
      path('M0 -29Q-29 2 -24 14Q-18 32 0 32Q23 29 25 13Q27 1 0 -29Z', a) +
        path('M-20 10Q-10 0 0 10T22 10L18 21Q0 35 -18 21Z', b, 'none') +
        line('M-13 1Q-4 -6 2 1', '#ffffff', 2.8),
      path('M0 24Q-28 13 -30 -14Q-8 -18 0 5Q6 -24 29 -27Q34 6 0 24Z', a) +
        line('M-19 -6 0 22 20 -15M0 22 0 31', b, 3),
      path('M-31 21 -8 -23 4 -1 15 -18 33 21Z', a) +
        path('M-16 -8 -8 -23 0 -8 -7 -12Z', '#ffffff', 'none') +
        line('M-23 27h47M18 -28v-8m9 14 7-5', a, 2.4),
      path('M-28 7Q-33 -6 -20 -10Q-15 -30 2 -21Q15 -25 20 -11Q37 -8 28 8Z', a) +
        line('M-19 16H18M-10 24H7', a, 4),
      path('M0 -29 29 0 0 29 -29 0Z', a) +
        path('M0 -22 0 -3 -20 -3ZM4 1 21 1 4 20Z', b, 'none') +
        path('M4 -20 20 -4 4 -4ZM-21 2 -3 2 -3 21Z', d.main, 'none'),
      path('M0 29Q-28 8 -24 -21Q-7 -24 0 -9Q9 -29 26 -24Q29 9 0 29Z', a) +
        line('M0 23 0 -8M0 11 -14 -5M0 4 16 -13', b, 2.8),
      path('M-25 -17 14 -25 30 7 -10 29 -30 4Z', a) +
        path('M-16 -9 9 -15 19 5 -7 19 -20 2Z', b, 'none') +
        path('M-7 -6 8 0 -4 11Z', '#ffffff', 'none')
    ];
    return local(emblems[index], [300, 281]);
  }

  function create(d, index) {
    const prefix = `hero-expansion-${d.id}`;
    const gradient = key => `url(#${prefix}-${key})`;
    const defs = `<defs><linearGradient id="${prefix}-suit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${d.main}"/><stop offset=".6" stop-color="${d.main}"/><stop offset="1" stop-color="${d.dark}"/></linearGradient><linearGradient id="${prefix}-cape" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="${d.secondary}"/><stop offset=".48" stop-color="${d.main}"/><stop offset="1" stop-color="${d.secondary}"/></linearGradient></defs>`;
    const shapes = {}, regions = {}, layers = [], outfit = [];
    function body(id, order, svg, targets) {
      shapes[id] = svg;
      regions[id] = targets;
      layers.push({ id, order, svg: group(svg) });
    }
    function clothing(id, order, svg, targets) {
      layers.push({ id, order, svg: group(svg) });
      outfit.push({ id, regions: targets });
    }
    const torsoLeft = 300 - d.build, torsoRight = 300 + d.build;
    const headX = 300 + d.dx;
    const facial = svg => group(svg, `translate(${d.dx} 0)`);
    const skin = d.skin, shade = d.shade, light = d.light;
    const neutral = '#bac7ce', neutralShade = '#859ca8';
    clothing('cape', 1,
      path(d.cape, gradient('cape'), ink, 3) +
      path(d.capeShade, d.dark, 'none') + path(d.capeLight, d.main, 'none') +
      line(d.folds, d.pale, 2.2) +
      line('M239 226Q293 206 345 226', d.pale, 4),
      [ellipse(185, 389, 36, 103, 15), ellipse(416, 378, 30, 93, -18), ellipse(299, index === 4 ? 402 : 469, 58, 27)]);

    body('chest', 11,
      path(`M${torsoLeft} 232Q259 217 281 218H319Q346 218 ${torsoRight} 232L351 338Q300 355 249 338Z`, neutral) +
      path('M310 227Q336 249 340 278L330 340 351 338 359 255Z', neutralShade, 'none') +
      line('M258 261Q277 272 294 264M307 264Q324 272 342 261M300 243v55', '#718b97'),
      [ellipse(300, 279, d.build - 15, 46)]);
    body('waist', 12,
      path(`M249 332Q300 349 351 332L${300 + d.hip} 421Q300 446 ${300 - d.hip} 421Z`, neutral) +
      path(`M326 341 351 332 ${300 + d.hip} 421 318 432Z`, neutralShade, 'none') +
      line('M278 357q20 7 41 0M277 380q20 6 42 0', '#718b97'),
      [ellipse(300, 389, d.hip, 35)]);
    body('neck', 14,
      facial(path('M284 180 281 216Q300 235 319 216L316 180Z', skin) +
        path('M285 184 315 184 317 203Q300 215 283 201Z', shade, 'none') +
        line('M287 208 297 218M313 206 307 217', light)),
      [ellipse(headX, 207, 17, 20)]);

    const armSvg = [], elbowSvg = [], wristSvg = [], handSvg = [], palmSvg = [], fingerSvg = [], shoulderSvg = [];
    const armRegions = [], elbowRegions = [], wristRegions = [], handRegions = [], palmRegions = [], fingerRegions = [], shoulderRegions = [];
    const sleeveSvg = [];
    d.arms.forEach((points, side) => {
      const [s, e, w] = points, handRotation = angle(e, w) + (side ? -4 : 4);
      armSvg.push(limb(s, e, 23, 15, skin, shade, light), limb(e, w, 15, 10, skin, shade, light));
      armRegions.push(segmentRegion(s, e, 21), segmentRegion(e, w, 14));
      elbowSvg.push(local(path('M-13 -6Q0 -12 13 -6L12 9Q0 15 -12 9Z', skin, 'none') + line('M-8 4q8 5 16 0', shade), e, angle(s, e)));
      elbowRegions.push(ellipse(e[0], e[1], 14, 12));
      wristSvg.push(local(path('M-10 -6 10 -6 10 8Q0 12 -10 8Z', skin, 'none') + line('M-7 3 6 4', shade, 1.3), w, handRotation));
      wristRegions.push(ellipse(w[0], w[1], 11, 9, handRotation));
      shoulderSvg.push(local(path('M-23 -1Q-25 -22 -5 -24Q16 -27 24 -6L21 12Q2 2 -23 12Z', skin) +
        line('M-13 -10q11-12 23-3', light, 2), s));
      shoulderRegions.push(ellipse(s[0], s[1] - 5, 25, 20));
      const mirror = side ? -1 : 1;
      const handLocal = svg => local(group(svg, `scale(${mirror} 1)`), w, handRotation);
      handSvg.push(handLocal(path('M-9 4Q-15 12 -13 28L-10 36 10 35 14 24Q13 12 9 4Z', skin) +
        path('M8 7Q7 20 10 35L14 25Q13 12 9 4Z', shade, 'none')));
      palmSvg.push(handLocal(path('M-8 12Q-2 8 7 14L8 28Q-1 33 -9 25Z', light, 'none') +
        line('M-8 19 -1 24 6 22M-5 28l8 0', shade, 1.1)));
      const fingers = [
        [-17, 29, 3.1, 9], [-8, 43, 3.1, 10], [0, 47, 3.2, 12], [8, 44, 3, 10], [15, 38, 2.7, 8]
      ];
      fingerSvg.push(handLocal(
        path('M-11 16Q-17 18 -21 31Q-23 37 -19 38Q-15 38 -12 29L-7 23Z', skin, ink, 1.5) +
        path('M-12 30 -12 47Q-12 53 -8 53Q-5 53 -5 47L-4 33  -4 53Q-4 59 0 59Q4 59 4 53L4 33 5 49Q5 54 9 54Q12 54 12 49L11 31 12 41Q13 47 16 45Q19 44 18 39L14 26Z', skin, ink, 1.5) +
        line('M-10 43h3M-2 47h4M7 44h3M14 39h2', shade, 1) +
        line('M-9 49h2M-1 55h2M8 50h2', light, 1.6)));
      handRegions.push(localRegion(w, handRotation, 0, 24, 15, 19));
      palmRegions.push(localRegion(w, handRotation, 0, 21, 10, 12));
      fingers.forEach(([x, y, rx, ry]) => fingerRegions.push(localRegion(w, handRotation, mirror * x, y, rx, ry)));
      const cuff = mix(e, w, d.sleeve);
      sleeveSvg.push(limb(s, e, 25, 17, gradient('suit'), d.dark, d.pale));
      sleeveSvg.push(limb(e, cuff, 17, 13, gradient('suit'), d.dark, d.pale));
      sleeveSvg.push(band(e, w, d.sleeve, 14, 12, d.secondary, d.pale));
      sleeveSvg.push(local(path('M-25 -3Q-28 -27 -6 -28Q15 -31 26 -8L24 12 -24 12Z', index === 3 || index === 6 ? d.secondary : d.pale) +
        line('M-16 -10Q0 -23 17 -10', d.main, 3), s));
      if (index % 2 === 0) sleeveSvg.push(band(s, e, .65, 21, 7, d.pale, '#ffffff'));
      else sleeveSvg.push(local(path('M-10 -10 9 -10 12 6 0 17 -12 6Z', d.secondary) +
        line('M-5 -3h11M-4 3h9', d.pale, 1.8), e, angle(s, e)));
    });
    body('shoulders', 15, shoulderSvg.join(''), shoulderRegions);
    body('arms', 16, armSvg.join(''), armRegions);
    body('elbows', 17, elbowSvg.join(''), elbowRegions);
    body('wrists', 18, wristSvg.join(''), wristRegions);
    body('hands', 20, handSvg.join(''), handRegions);
    body('palms', 21, palmSvg.join(''), palmRegions);
    body('fingers', 22, fingerSvg.join(''), fingerRegions);

    const legSvg = [], thighSvg = [], kneeSvg = [], ankleSvg = [], footSvg = [], heelSvg = [], trouserSvg = [], bootSvg = [];
    const legRegions = [], thighRegions = [], kneeRegions = [], ankleRegions = [], footRegions = [], heelRegions = [], bootRegions = [];
    d.legs.forEach(([h, k, a], side) => {
      legSvg.push(limb(h, k, d.legWidth, 20, neutral, neutralShade, '#d9e1e3'), limb(k, a, 19, 12, skin, shade, light));
      legRegions.push(segmentRegion(h, k, d.legWidth), segmentRegion(k, a, 19));
      thighSvg.push(limb(mix(h, k, .05), mix(h, k, .81), d.legWidth - 6, 14, '#cbd6db', neutralShade, '#e4eceb'));
      thighRegions.push(segmentRegion(h, mix(h, k, .9), d.legWidth));
      kneeSvg.push(local(path('M-16 -10Q0 -17 16 -10L14 11Q0 21 -14 11Z', skin) +
        line('M-8 -2q8-5 16 0M-6 9h12', shade), k));
      kneeRegions.push(ellipse(k[0], k[1], 19, 20));
      ankleSvg.push(local(path('M-12 -11 12 -11 13 10Q0 17 -13 10Z', skin) +
        line('M-8 1q8 5 16 0', shade, 1.5), a));
      ankleRegions.push(ellipse(a[0], a[1], 13, 14));
      const mirror = side ? -1 : 1;
      const footLocal = svg => local(group(svg, `scale(${mirror} 1)`), a);
      footSvg.push(footLocal(path('M-12 -2Q-17 10 -32 15Q-46 17 -48 28Q-49 35 -38 36H7Q18 34 15 20L12 0Z', skin) +
        line('M-38 25v6m7-8v8m7-8v8', shade, 1.2)));
      heelSvg.push(footLocal(path('M3 20 14 18 15 30Q13 36 4 36L-1 32Z', shade, 'none') +
        line('M5 29q4 2 7-1', light, 1.5)));
      footRegions.push(ellipse(a[0] - mirror * 16, a[1] + 24, 34, 14));
      heelRegions.push(ellipse(a[0] + mirror * 9, a[1] + 28, 8, 9));
      const bootTop = mix(k, a, (d.boot - k[1]) / (a[1] - k[1]));
      trouserSvg.push(limb(h, k, d.legWidth + (index === 3 ? 4 : 1), 22, d.secondary, d.dark, d.pale));
      trouserSvg.push(limb(k, a, 21, 15, d.secondary, d.dark, d.main));
      trouserSvg.push(local(path('M-16 -11 2 -16 17 -7 15 10 0 18 -15 10Z', d.main) +
        line('M-8 -3 7 -5M-7 4l12-1', d.pale, 1.8), k));
      if (index === 3 || index === 7) {
        trouserSvg.push(local(path('M-21 0H19V40L-16 43Z', d.main) +
          path('M-21 0H19V12L-1 18 -21 11Z', d.pale) + oval(0, 9, 2, 2, ink), mix(h, k, .28), angle(h, k)));
      } else {
        trouserSvg.push(local(path(`M${-d.legWidth + 3} 10 ${-d.legWidth + 14} 17 -6 75 -17 82Z`, d.main, 'none'), h, angle(h, k)));
      }
      bootSvg.push(limb(bootTop, a, 24, 17, index === 4 || index === 7 ? d.pale : d.main, d.dark, d.pale));
      bootSvg.push(footLocal(path('M-17 -6 16 -6 18 17 20 32Q8 42 -40 39Q-53 39 -52 29Q-51 18 -35 14L-22 6Z', d.main) +
        path('M-35 15Q-18 14 -7 29L-13 36 -48 34Q-53 25 -35 15Z', d.pale) +
        path('M-52 31Q-19 39 19 29L20 39Q-12 48 -49 40Z', d.secondary) +
        line('M-20 9 2 15M-23 17 0 22M-28 24 -9 28', d.dark, 2.3) +
        line('M-43 39h6m6 1h7m7 0h7m7-1h7', d.pale, 1.7)));
      bootSvg.push(band(bootTop, a, .03, 25, 14, d.pale, '#ffffff'));
      const mid = mix(bootTop, a, .37);
      bootSvg.push(local(path(index === 6 ? 'M-10 -16 12 -16 12 21 -10 21Z' : 'M0 -21 12 -6 8 20 -8 20 -12 -6Z', d.secondary) +
        line('M0 -9v21', d.pale, 2.4), mid, angle(bootTop, a)));
      bootRegions.push(segmentRegion(bootTop, a, 25), ellipse(a[0] - mirror * 16, a[1] + 27, 37, 17));
    });
    body('legs', 5, legSvg.join(''), legRegions);
    body('thighs', 6, thighSvg.join(''), thighRegions);
    body('knees', 7, kneeSvg.join(''), kneeRegions);
    body('ankles', 8, ankleSvg.join(''), ankleRegions);
    body('feet', 9, footSvg.join(''), footRegions);
    body('heels', 10, heelSvg.join(''), heelRegions);

    let suit = sleeveSvg.join('') + trouserSvg.join('');
    suit += path(`M${torsoLeft} 229 281 213Q300 232 319 213L${torsoRight} 229 363 276 350 350 ${300 + d.hip + 2} 426Q329 441 300 431Q271 441 ${300 - d.hip - 2} 426L250 350 238 276Z`, gradient('suit'), ink, 3);
    suit += path(`M${torsoLeft + 8} 237 259 264 274 335 260 412 ${300 - d.hip} 421 250 350 239 279Z`, d.dark, 'none');
    suit += path(`M${torsoRight - 8} 237 341 264 326 335 337 415 ${300 + d.hip} 425 350 350 361 279Z`, d.dark, 'none');
    const panels = [
      path('M243 241 270 229 299 315 329 229 357 243 330 319 300 341 271 319Z', d.pale) +
        path('M276 351 300 363 324 351 326 378 300 391 273 378Z', d.secondary),
      path('M239 243Q266 229 285 242L281 280 247 291ZM315 242Q339 230 361 244L353 291 318 280Z', d.pale) +
        line('M257 323Q279 307 300 323T341 323M263 344Q282 330 300 344T335 344M272 366Q285 356 300 366T329 366', d.pale, 4),
      path('M249 237 300 260 351 237 332 320 300 348 269 320Z', d.secondary) +
        path('M264 356Q300 377 335 356L357 452 319 442 300 462 280 442 242 453Z', d.main) +
        line('M300 367v66M272 386l-12 46M328 386l12 46', d.pale, 2.5),
      path('M239 235 277 224 283 313 251 321ZM324 225 363 236 351 321 317 313Z', d.pale) +
        path('M268 338 332 338 341 394 259 394Z', d.secondary) +
        line('M276 348h47M274 358h50M271 369h55', d.pale, 2.5),
      path('M242 246 270 230 339 328 330 358 281 299Z', d.pale) +
        path('M319 228 358 247 348 278 322 261Z', d.secondary) +
        line('M274 355 301 370 326 355M278 378l23 12 21-12', d.pale, 2.8),
      path('M244 244 273 230 300 249 274 281 247 269ZM329 231 356 247 350 275 321 281 300 250Z', d.pale) +
        path('M266 327 296 307 327 327 304 355ZM273 362 303 355 330 376 302 396Z', d.secondary) +
        line('M252 294 272 310M330 308l20-16', d.pale, 3),
      path('M242 239 280 224 292 255 262 276 247 269ZM319 224 359 240 352 270 338 278 307 255Z', d.pale) +
        path('M271 336 300 322 331 336 324 389 300 404 276 389Z', d.secondary) +
        line('M300 341v44M282 348l18 13 18-13M282 368l18 13 18-13', d.pale, 2.5),
      path('M242 243 272 228 318 329 298 354 269 294Z', d.pale) +
        path('M324 227 357 244 348 299 324 321 312 295Z', d.secondary) +
        path('M274 366 300 355 329 374 309 398 278 389Z', d.pale) +
        line('M335 251l-8 30M257 249l20 40', '#ffffff', 2.2)
    ];
    suit += panels[index] + insignia(index, d);
    suit += path('M278 211Q300 229 321 211L327 223Q300 247 273 223Z', d.secondary) +
      line('M279 220Q300 237 321 220', d.pale, 2.5);
    suit += [248, 353].map(x => oval(x, 239, 5, 5, d.pale, ink)).join('');
    const costumeRegions = [ellipse(300, 303, d.build - 12, 73), ellipse(300, 391, d.hip, 36)];
    d.arms.forEach(([s, e, w]) => costumeRegions.push(segmentRegion(s, e, 24), segmentRegion(e, mix(e, w, d.sleeve), 16)));
    d.legs.forEach(([h, k, a]) => costumeRegions.push(segmentRegion(h, k, d.legWidth), segmentRegion(k, a, 20)));
    clothing('costume', 30, suit, costumeRegions);
    clothing('boots', 33, bootSvg.join(''), bootRegions);
    const beltY = index === 2 ? 380 : 406;
    clothing('belt', 34,
      path(`M${300 - d.hip} ${beltY - 7}Q300 ${beltY + 4} ${300 + d.hip} ${beltY - 7}L${302 + d.hip} ${beltY + 12}Q300 ${beltY + 24} ${298 - d.hip} ${beltY + 12}Z`, d.secondary) +
      line(`M${306 - d.hip} ${beltY - 1}Q300 ${beltY + 11} ${294 + d.hip} ${beltY - 1}`, d.pale, 2) +
      local(path(index % 2 ? 'M-16 -9H16V13H-16Z' : 'M0 -14 18 0 0 17 -18 0Z', d.pale) +
        path('M-6 -3H6V6H-6Z', d.main, 'none'), [300, beltY + 4]) +
      (index === 1 || index === 3 || index === 6 ? [266, 331].map(x =>
        local(path('M-10 -9H10V18L0 21 -10 18Z', d.main) +
          line('M-7 -2H7', d.pale, 2) + oval(0, 4, 2, 2, d.pale), [x, beltY + 4])).join('') : ''),
      [ellipse(300, beltY + 6, d.hip + 3, 15)]);

    const half = d.head;
    body('head', 40,
      facial(path(`M${300 - half} 126Q${298 - half} 92 300 91Q${302 + half} 92 ${300 + half} 126L${297 + half} 159Q${292 + half} 184 300 199Q${308 - half} 189 ${303 - half} 160Z`, skin, ink, 2.8) +
        path(`M${half + 327 - 37} 120Q${half + 329 - 37} 161 315 184L300 199Q${292 + half} 184 ${297 + half} 159L${300 + half} 126Z`, shade, 'none')),
      [ellipse(headX, 146, half, 54)]);
    body('forehead', 41,
      facial(path('M278 122Q299 115 322 123L319 133Q300 127 281 133Z', light, 'none')),
      [ellipse(headX, 125, 21, 8)]);
    body('ears', 42,
      facial(path(`M${301 - half} 136Q${285 - half} 127 ${289 - half} 149Q${291 - half} 161 ${304 - half} 157ZM${299 + half} 136Q${315 + half} 127 ${311 + half} 149Q${309 + half} 161 ${296 + half} 157Z`, skin, ink, 2) +
        line(`M${295 - half} 138q-6 2-1 11m${2 * half + 12} -11q6 2 1 11`, shade, 1.5)),
      [ellipse(headX - half - 5, 144, 7, 13), ellipse(headX + half + 5, 144, 7, 13)]);
    body('eyes', 45,
      facial(line('M276 137q8-5 15-1M310 136q8-4 15 1', d.hair === '#e1e8ef' ? '#57617a' : d.hair, 2.3) +
        path('M276 146Q284 139 292 146Q286 153 279 150Z', '#fffdf7', ink, 1.5) +
        path('M308 146Q316 139 324 146L321 150Q314 153 308 146Z', '#fffdf7', ink, 1.5) +
        oval(285, 146, 3.6, 4.6, d.secondary, ink, .8) + oval(315, 146, 3.6, 4.6, d.secondary, ink, .8) +
        oval(285.5, 146.5, 1.8, 2.8, ink) + oval(314.5, 146.5, 1.8, 2.8, ink) +
        oval(284.5, 144.5, 1.2, 1.2, '#ffffff') + oval(313.5, 144.5, 1.2, 1.2, '#ffffff')),
      [ellipse(headX - 16, 145, 10, 7), ellipse(headX + 16, 145, 10, 7)]);
    body('nose', 46,
      facial(path('M300 144 295 159Q300 163 306 158L302 156', skin, shade, 1.4) +
        line('M299 148 298 155', light, 1.7)),
      [ellipse(headX, 154, 6, 10)]);
    body('cheeks', 44,
      facial(path('M271 154Q279 151 288 157L284 165 275 164ZM312 157Q320 151 329 155L325 164 316 165Z', light, 'none') +
        line('M276 159l2 2m4-4 2 2M317 159l2 2m4-4 2 2', '#cb8779', 1.2)),
      [ellipse(headX - 21, 160, 10, 8), ellipse(headX + 21, 160, 10, 8)]);
    body('mouth', 47,
      facial(path('M286 172Q300 178 314 171Q310 184 300 185Q291 185 286 172Z', '#6f423f', ink, 1) +
        path('M289 174Q300 178 311 173L308 178Q300 182 292 178Z', '#fff8eb', 'none')),
      [ellipse(headX, 178, 14, 7)]);
    body('lips', 48,
      facial(line('M286 172Q299 177 314 171', shade, 1.8) +
        path('M294 185Q300 188 307 184L303 189 298 190Z', '#c28579', 'none')),
      [ellipse(headX, 174, 14, 2), ellipse(headX, 186, 7, 2)]);
    body('chin', 43,
      facial(path('M291 190Q300 194 309 189L305 195Q300 198 295 195Z', light, 'none')),
      [ellipse(headX, 193, 10, 4)]);
    body('jaw', 43,
      facial(path('M269 164 276 177 287 185 284 189 273 181ZM330 163 324 180 314 189 312 185 321 175Z', shade, 'none')),
      [ellipse(headX - 22, 178, 5, 12, -36), ellipse(headX + 22, 178, 5, 12, 36)]);
    body('hair', 49,
      facial(path(d.hairExtra || 'M269 111 267 136 263 136 261 112Z', d.hair) +
        path(d.hairShape, d.hair, ink, 2.8) + line(d.hairLines, d.hairLight, 2.6) +
        (index === 0 ? line('M363 116q16 9 8 25M365 159q11 10 4 20M365 192l7 16', d.hairLight, 2) : '') +
        (index === 7 ? line('M349 104q28-11 28 15M372 146l-12 46', d.hairLight, 2.5) : '') +
        (index === 5 ? line('M257 65q0-12 13-12M320 66q4-12 16-6', d.hairLight, 2.5) : '')),
      [ellipse(headX, 104, 46, 34)].concat(
        index === 0 ? [ellipse(headX + 65, 166, 23, 55)] :
        index === 2 ? [ellipse(headX - 40, 177, 13, 40), ellipse(headX + 40, 173, 13, 42)] :
        index === 5 ? [ellipse(headX - 30, 65, 23, 21), ellipse(headX + 34, 71, 21, 25)] :
        index === 7 ? [ellipse(headX + 67, 151, 20, 64)] : []));

    // Every accessory carries its own paint values; it never depends on costume defs.
    const options = accessories(d, index);
    if (Object.keys(regions).length !== bodyIds.length || bodyIds.some(id => !regions[id])) {
      throw new Error(`Incomplete anatomy for ${d.id}`);
    }
    return {
      metadata: { id: d.id, category: 'Superhero', nameEn: d.en, nameHe: d.he, descriptionHe: d.descriptionHe,
        image: `./style-samples/${d.id}.svg`, bodyRegions: regions, outfit },
      art: { defs, layers: layers.sort((a, b) => a.order - b.order) },
      options
    };
  }

  function accessories(d, index) {
    const paint = d.pale, color = d.secondary, trim = d.main, x = 300 + d.dx;
    const [s, e, w] = d.arms[0];
    const [rs, re, rw] = d.arms[1];
    const wristAngle = angle(re, rw);
    const pinX = 333, pinY = 307;
    const jewel = (cx, cy, radius = 8) => local(
      path(`M0 ${-radius} ${radius} 0 0 ${radius} ${-radius} 0Z`, paint, ink, 1.4) +
      path(`M0 ${-radius + 3} ${radius - 3} 0 0 1Z`, '#ffffff', 'none') +
      oval(0, 1, 2, 2, trim), [cx, cy]);
    const entries = {
      cap: ['Cap', 'כובע מצחייה', 'headwear',
        local(path('M-43 0Q-46 -35 -7 -41Q30 -45 42 -9L42 5Z', color) +
          path('M-43 -1Q-7 -9 42 -1L59 12Q30 22 6 11L-43 10Z', trim) +
          line('M-9 -36q15 10 14 28M-35 0q35-6 71 2', paint, 2) + jewel(0, -21, 7), [x, 104])],
      beanie: ['Beanie', 'כובע צמר', 'headwear',
        local(path('M-43 4Q-48 -42 0 -46Q46 -45 44 4Z', color) +
          path('M-45 -1Q0 -12 45 -1L44 16Q0 7 -43 16Z', trim) +
          line('M-29 -27l-3 18M-15 -36l-2 26M0 -38v27M15 -36l3 26M29 -27l3 18', paint, 1.4) +
          oval(0, -45, 10, 8, paint, ink) + jewel(23, 5, 6), [x, 101])],
      hat: ['Hat', 'כובע', 'headwear',
        local(path('M-38 1 -30 -31Q-18 -38 -2 -30Q15 -41 31 -31L39 1Z', color) +
          path('M-60 4Q-40 -7 -29 2Q0 11 31 1Q45 -9 62 3Q40 24 1 17Q-36 23 -60 4Z', trim) +
          path('M-36 -6Q0 4 36 -6L39 1Q0 13 -39 1Z', paint) + line('M-22 -25q20 8 40-1', paint, 2), [x, 103])],
      beret: ['Beret', 'כובע ברט', 'headwear',
        local(path('M-42 2Q-62 -15 -32 -37Q-1 -54 34 -33Q60 -17 32 4Z', color) +
          path('M-39 0Q0 -11 36 0L34 12Q0 4 -36 13Z', trim) +
          path('M0 -40 -1 -49 7 -49 6 -40Z', trim) +
          line('M-36 -24Q-12 -41 11 -34', paint, 2) + jewel(24, -17, 6), [x, 100])],
      headband: ['Headband', 'סרט ראש', 'headwear',
        local(path('M-37 -3Q0 -14 37 -3L36 8Q0 -1 -36 8Z', trim) +
          line('M-31 1Q0 -7 31 1', paint, 2) + jewel(0, -2, 8) +
          path('M36 0 52 8 48 21 38 9Z', color), [x, 125])],
      earmuffs: ['Earmuffs', 'מחממי אוזניים', 'headwear',
        local(line('M-43 14Q-53 -56 0 -58Q53 -56 43 14', ink, 9) +
          line('M-43 14Q-53 -56 0 -58Q53 -56 43 14', paint, 5) +
          [-44, 44].map(px => oval(px, 14, 11, 19, trim, ink, 2) + oval(px, 14, 6, 13, paint)).join(''), [x, 130])],
      'hair-clip': ['Hair clip', 'סיכת שיער', 'hair',
        local(path('M-4 -15 5 -15 6 14 -4 14Z', paint, ink, 1.6) + jewel(1, -3, 8) +
          line('M0 7v4', color, 1.5), [x + 33, 112], -18)],
      glasses: ['Glasses', 'משקפיים', 'eyewear',
        local(line('M-37 -3 -26 0M26 0l11-3M-5 0Q0 -5 5 0', ink, 2.2) +
          path('M-28 -5Q-16 -10 -5 -4L-5 5Q-17 15 -26 6ZM5 -4Q16 -10 28 -5L26 6Q16 15 5 5Z', 'none', color, 2.6) +
          line('M-23 -3l5-1M11 -3l5-1', '#ffffff', 1.5), [x, 144])],
      scarf: ['Scarf', 'צעיף', 'neckwear',
        local(path('M-23 -4Q0 14 23 -4L29 9Q0 32 -28 9Z', paint) +
          path('M20 10Q48 27 56 60L39 56 35 68Q20 40 10 22Z', trim) +
          path('M9 8 25 7 29 22 17 30 7 22Z', color) +
          line('M-20 6Q-4 19 12 13M27 32l13 22', d.dark, 2), [x, 210])],
      necklace: ['Necklace', 'שרשרת', 'neckwear',
        line(`M${x - 23} 222Q${x - 26} 265 ${x} 307Q${x + 27} 266 ${x + 23} 222`, ink, 4) +
        line(`M${x - 23} 222Q${x - 26} 265 ${x} 307Q${x + 27} 266 ${x + 23} 222`, paint, 2) + jewel(x, 313, 10)],
      medal: ['Medal', 'מדליה', 'neckwear',
        path(`M${x - 26} 221 ${x - 16} 219 ${x + 5} 298 ${x - 5} 303Z`, trim) +
        path(`M${x + 26} 221 ${x + 16} 219 ${x - 5} 298 ${x + 5} 303Z`, color) +
        oval(x, 313, 16, 18, paint, ink, 2) + oval(x, 313, 11, 13, trim, ink, 1) +
        line(`M${x - 5} 313l4 4 7-9`, paint, 2.8)],
      badge: ['Badge', 'תג', 'chest-decoration',
        local(path('M-16 -21 16 -21 17 10Q10 23 0 26Q-12 22 -17 10Z', paint) +
          path('M-10 -13H10V8L0 17 -10 8Z', color, 'none') +
          line('M-5 -4H5M-5 2H5', '#ffffff', 2) + oval(0, 10, 2.5, 2.5, trim), [pinX, pinY])],
      brooch: ['Brooch', 'סיכה', 'chest-decoration',
        local(index % 2 ?
          path('M0 12Q-20 9 -14 -8Q-1 -10 0 4Q2 -17 17 -13Q24 4 0 12Z', paint) + line('M0 17 1 7 11 -5M1 7 -8 -2', color, 1.6) :
          path('M0 -17 7 -7 18 -5 9 5 10 16 0 10 -11 16 -9 5 -18 -5 -7 -7Z', paint) + oval(0, 0, 5, 5, trim, ink, 1),
        [pinX, pinY])],
      armband: ['Armband', 'סרט זרוע', 'upperarm',
        band(s, e, .48, 25, 21, paint, '#ffffff') +
        local(path('M-7 -8H7V8H-7Z', color, ink, 1) + line('M-3 0H3M0 -3V3', paint, 1.7), mix(s, e, .48), angle(s, e))],
      'shoulder-cord': ['Shoulder cord', 'שרוך כתף', 'shoulder',
        line(`M${rs[0] - 15} ${rs[1] - 8}Q${rs[0] - 13} ${rs[1] + 59} ${rs[0] + 26} ${rs[1] + 52}Q${rs[0] + 45} ${rs[1] + 38} ${rs[0] + 10} ${rs[1] - 7}`, ink, 6) +
        line(`M${rs[0] - 15} ${rs[1] - 8}Q${rs[0] - 13} ${rs[1] + 59} ${rs[0] + 26} ${rs[1] + 52}Q${rs[0] + 45} ${rs[1] + 38} ${rs[0] + 10} ${rs[1] - 7}`, paint, 3.4) +
        line(`M${rs[0] - 9} ${rs[1] - 7}Q${rs[0] - 7} ${rs[1] + 48} ${rs[0] + 24} ${rs[1] + 43}`, trim, 3) +
        jewel(rs[0] - 13, rs[1] - 10, 6)],
      bracelet: ['Bracelet', 'צמיד', 'wrist',
        band(re, rw, .94, 15, 12, paint, '#ffffff') +
        local(path('M-4 -6 6 -6 8 5 -5 6Z', color, ink, 1.2) + oval(1, 0, 2.2, 2.2, trim), mix(re, rw, .94), wristAngle)],
      watch: ['Watch', 'שעון', 'wrist',
        band(re, rw, .9, 16, 14, color, paint) +
        local(path('M-9 -11H9L12 -7V8L8 12H-8L-12 8V-7Z', paint, ink, 1.8) +
          oval(0, 0, 7, 8, color) + line('M0 -5V0L4 2', '#ffffff', 1.5), mix(re, rw, .9), wristAngle)],
      ring: ['Ring', 'טבעת', 'finger',
        local(path('M-4 39H4V45H-4Z', paint, ink, 1) +
          path('M-3 37 0 34 4 37 2 41 -2 41Z', trim, ink, 1) + line('M0 36v2', '#ffffff', 1), w, angle(e, w) + 4)],
      earrings: ['Earrings', 'עגילים', 'ears',
        [x - d.head - 5, x + d.head + 5].map(ex => oval(ex, 157, 3, 3, paint, ink, 1) +
          line(`M${ex} 159v6`, paint, 2.5) + jewel(ex, 169, 5)).join('')],
      'knee-pads': ['Knee pads', 'מגני ברכיים', 'knees',
        d.legs.map(([, k]) => local(
          path('M-23 -13H23V-4H-23ZM-22 7H22V16H-22Z', color, ink, 1.6) +
          path('M-18 -20Q0 -28 18 -20L20 12 12 24H-12L-20 12Z', paint, ink, 2) +
          path('M-11 -13H11L13 8 8 15H-8L-13 8Z', trim, ink, 1.5) +
          line('M-6 -5H6M-6 2H6', '#ffffff', 1.8), k)).join('')],
      'boot-chain': ['Boot chain', 'שרשרת למגף', 'footwear-decoration',
        local(line('M-20 0Q0 32 21 0', ink, 4) + line('M-20 0Q0 32 21 0', paint, 2.3) +
          [-20, -10, 0, 10, 21].map((px, i) => oval(px, [0, 11, 16, 11, 0][i], 2.5, 3, paint, ink, .8)).join('') +
          jewel(0, 25, 5), [d.legs[0][2][0] + 3, 662])],
      anklets: ['Anklets', 'צמידי קרסול', 'footwear-decoration',
        d.legs.map(([, , a]) => local(path('M-18 -3Q0 3 18 -3V5Q0 11 -18 5Z', paint, ink, 1.6) +
          [-12, 0, 12].map(px => jewel(px, 11, 4)).join(''), [a[0], a[1] - 12])).join('')],
      backpack: ['Backpack', 'תיק גב', 'back',
        path('M379 283Q420 268 445 285L451 392Q449 420 419 425L389 418Z', color, ink, 3) +
        path('M418 285Q428 268 436 278L440 292', 'none', paint, 5) +
        path('M421 316 447 314 449 359 424 365Z', trim, ink, 2) +
        path('M410 365 446 362 448 399 412 403Z', trim, ink, 2) +
        line('M417 375l24-3M428 329l13-2', paint, 2) +
        path(`M${rs[0] - 10} ${rs[1] - 10}Q${rs[0] + 12} ${rs[1] + 44} 384 333L374 330Q${rs[0] + 1} ${rs[1] + 42} ${rs[0] - 21} ${rs[1] - 6}Z`, color, ink, 2) +
        path('M374 307H389V324H374Z', paint, ink, 1.4) + line('M378 311h7v8h-7Z', color, 1.4)]
    };
    return d.accessories.map(id => {
      const entry = entries[id];
      if (!entry) throw new Error(`Unknown wearable: ${id}`);
      return { id, en: entry[0], he: entry[1], slot: entry[2],
        svg: `<g id="hero-expansion-${d.id}-optional-${id}">${entry[3]}</g>` };
    });
  }

  const characters = {}, artwork = {}, wardrobe = {};
  designs.forEach((design, index) => {
    const result = create(design, index);
    characters[design.id] = result.metadata;
    artwork[design.id] = result.art;
    wardrobe[design.id] = result.options;
  });
  Object.assign(window.IllustratedCharacters, characters);
  Object.assign(window.IllustratedLayers, artwork);
  Object.assign(window.CharacterAccessories, wardrobe);
}());
