/* Original cel-painted characters. Coordinates and fragments share one 600 × 800 artboard. */
(() => {
  'use strict';
  const characters = {};
  const illustrations = {};
  const accessories = {};
  const ink = '#343744';
  const path = (d, fill, stroke = ink, width = 2) =>
    `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const line = (d, color = ink, width = 1.3) => path(d, 'none', color, width);
  const ellipse = (cx, cy, rx, ry, fill, stroke = 'none', width = 1) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const rect = (x, y, w, h, r, fill, stroke = ink, width = 1.5) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const group = svg => `<g stroke-linecap="round" stroke-linejoin="round">${svg}</g>`;
  const E = (cx, cy, rx, ry, angle = 0) => ({ cx, cy, rx, ry, angle });
  const segment = (x1, y1, x2, y2, r) =>
    E((x1 + x2) / 2, (y1 + y2) / 2, r, Math.hypot(x2 - x1, y2 - y1) / 2,
      Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI - 90);
  const designs = [
    { id: 'anime-03', nameEn: 'Nori', nameHe: 'נורי', theme: 'garden apprentice',
      descriptionHe: 'חובב גינון עם תלתלים ירוקים, אפוד כיסים ומגפי עבודה.',
      skin: '#d9a47f', shade: '#bd825f', blush: '#c97e73', hair: '#264c42', light: '#628873',
      color: '#507761', dark: '#2e5148', accent: '#deb968', pale: '#f1e5cb', eye: '#7d5a2e',
      sx: 1.02, sy: 1, wrist: [194, 405], elbow: [215, 382], hem: 414,
      choices: ['hat', 'glasses', 'scarf', 'watch', 'bracelet', 'ring', 'necklace', 'hair-clip', 'backpack', 'gloves'] },
    { id: 'anime-04', nameEn: 'Luma', nameHe: 'לומה', theme: 'stargazing club student',
      descriptionHe: 'חובבת כוכבים עם תספורת קארה, צווארון מלחים וחצאית קפלים.',
      skin: '#f0c8b4', shade: '#d7a18c', blush: '#e6a29b', hair: '#343857', light: '#7173a3',
      color: '#565c91', dark: '#353a63', accent: '#e7c986', pale: '#f6eee3', eye: '#7775b2',
      sx: .94, sy: .99, wrist: [202, 358], elbow: [215, 393], hem: 418,
      choices: ['beanie', 'headband', 'glasses', 'bow-tie', 'necklace', 'earrings', 'bracelet', 'ring', 'hair-clip', 'backpack'] },
    { id: 'anime-05', nameEn: 'Sol', nameHe: 'סול', theme: 'sunshine neighborhood courier',
      descriptionHe: 'שליח שכונתי עליז עם שיער נחושתי, קפוצ׳ון שמשי ונעלי ספורט.',
      skin: '#e7b38d', shade: '#c9926f', blush: '#d38e78', hair: '#a64f35', light: '#e08c56',
      color: '#e0ad45', dark: '#9d7139', accent: '#4a9997', pale: '#fff0cf', eye: '#488a84',
      sx: 1.03, sy: 1.01, wrist: [190, 410], elbow: [211, 386], hem: 426,
      choices: ['cap', 'sunglasses', 'scarf', 'watch', 'bracelet', 'gloves', 'backpack', 'headband', 'necklace', 'ring'] },
    { id: 'anime-06', nameEn: 'Mira', nameHe: 'מירה', theme: 'ceramics studio apprentice',
      descriptionHe: 'יוצרת קרמיקה עם צמה קלועה, שמלת סינר בגוני חמר ושרוולים תפוחים.',
      skin: '#bd896b', shade: '#a66e56', blush: '#b97166', hair: '#523b39', light: '#947058',
      color: '#b77b67', dark: '#825649', accent: '#cba759', pale: '#f5e8d0', eye: '#806445',
      sx: .98, sy: 1, wrist: [201, 402], elbow: [218, 383], hem: 416,
      choices: ['headband', 'hair-clip', 'glasses', 'necklace', 'earrings', 'bracelet', 'ring', 'scarf', 'hat', 'backpack'] },
    { id: 'anime-07', nameEn: 'Tavi', nameHe: 'טאבי', theme: 'winter birdwatcher',
      descriptionHe: 'צפר חורפי עם שיער כסוף, מעיל כחול ארוך ומגפיים שרוכים.',
      skin: '#efc3a0', shade: '#d5a180', blush: '#dfa28d', hair: '#b5bfc4', light: '#eef0e7',
      color: '#4f7988', dark: '#345568', accent: '#d6a55b', pale: '#f3ead8', eye: '#496d8c',
      sx: 1, sy: 1.02, wrist: [195, 400], elbow: [213, 384], hem: 426,
      choices: ['beanie', 'glasses', 'scarf', 'mittens', 'watch', 'backpack', 'earrings', 'necklace', 'ring', 'hair-clip'] },
    { id: 'anime-08', nameEn: 'Pippa', nameHe: 'פיפה', theme: 'lantern festival organizer',
      descriptionHe: 'מארגנת חגיגת פנסים עם שתי פקעות שיער, ז׳קט ורוד מתנפנף ומכנסיים רחבים.',
      skin: '#f0bea3', shade: '#d99c85', blush: '#e2978b', hair: '#653a4d', light: '#ad6375',
      color: '#be6979', dark: '#8d485f', accent: '#d7b570', pale: '#f8e8d6', eye: '#986047',
      sx: .96, sy: .985, wrist: [171, 411], elbow: [197, 389], hem: 420,
      choices: ['headband', 'hair-clip', 'earrings', 'necklace', 'bracelet', 'ring', 'scarf', 'glasses', 'backpack', 'watch'] },
    { id: 'anime-09', nameEn: 'Jun', nameHe: 'ג׳ון', theme: 'seaside library volunteer',
      descriptionHe: 'מתנדב בספרייה ליד הים, עם שיער גלי, סוודר סרוג בדוגמת מפרש וג׳ינס.',
      skin: '#e9c3a2', shade: '#cfa484', blush: '#dca593', hair: '#b49362', light: '#e4c996',
      color: '#7ba49b', dark: '#527a78', accent: '#d2a670', pale: '#f4e9d5', eye: '#5d8575',
      sx: 1.05, sy: 1, wrist: [201, 399], elbow: [218, 381], hem: 441,
      choices: ['cap', 'beanie', 'glasses', 'scarf', 'watch', 'bracelet', 'backpack', 'necklace', 'ring', 'gloves'] },
    { id: 'anime-10', nameEn: 'Ayla', nameHe: 'איילה', theme: 'meadow letter carrier',
      descriptionHe: 'שליחת מכתבים באחו עם תלתלים כהים, אפוד סגול וחצאית שכבות זוויתית.',
      skin: '#a97555', shade: '#8e5d45', blush: '#a66658', hair: '#3f3439', light: '#806151',
      color: '#9786b2', dark: '#675780', accent: '#d8b974', pale: '#f4e7d0', eye: '#a08042',
      sx: 1, sy: .985, wrist: [197, 405], elbow: [215, 388], hem: 416,
      choices: ['hat', 'headband', 'hair-clip', 'earrings', 'necklace', 'bracelet', 'ring', 'gloves', 'backpack', 'scarf'] }
  ];

  function anatomy(c) {
    const layers = [];
    const b = {};
    const add = (id, order, svg, regions) => {
      layers.push({ id, order, svg: group(svg) });
      b[id] = regions;
    };
    const skin = d => path(d, c.skin, ink, 1.7);
    const detail = d => line(d, c.shade, 1.2);
    add('legs', 10,
      skin('M253 431Q270 423 284 440L285 503 276 563 270 669 247 669 244 605 246 548 241 484ZM310 435Q327 424 344 437L356 492 353 549 363 665 339 670 321 610 317 554 303 492Z') +
      detail('M255 550L257 626M339 553L347 624'),
      [E(262, 550, 22, 112), E(334, 550, 23, 113, -5)]);
    add('thighs', 11,
      path('M253 432Q269 425 283 441L283 495 277 524Q261 532 246 522L242 483ZM310 438Q327 426 343 439L354 492 349 519Q334 532 319 522L306 486Z', c.skin, 'none') +
      detail('M250 486L252 507M340 485L343 506'),
      [E(262, 480, 21, 44), E(330, 480, 22, 44, -7)]);
    add('knees', 12,
      path('M249 535Q260 530 274 535L274 554Q262 561 249 554ZM325 534Q338 529 350 535L351 553Q339 560 327 554Z', c.skin, 'none') +
      detail('M254 546Q261 542 268 546M330 545Q338 541 345 545'),
      [E(262, 545, 16, 14), E(338, 545, 16, 14)]);
    add('ankles', 13,
      skin('M248 655L270 655 271 692 246 693ZM339 654L361 653 368 691 342 694Z'),
      [E(259, 674, 12, 17), E(352, 674, 12, 17, -6)]);
    add('feet', 14,
      skin('M247 683L270 683 274 713Q262 725 238 725H212Q202 721 211 712L233 701ZM342 684L363 683 379 700 399 713Q408 723 394 728L347 724 337 710Z') +
      detail('M218 714L219 720M225 711L227 720M390 713L387 720M382 710L379 719'),
      [E(239, 711, 33, 16, -5), E(372, 713, 33, 16, 8)]);
    add('heels', 15,
      path('M259 701Q270 697 272 709L270 720 258 721Q252 711 259 701ZM343 702Q353 697 357 709L354 722 341 720Q337 711 343 702Z', c.skin, 'none') +
      detail('M259 718L268 718M343 718L353 720'),
      [E(264, 711, 8, 12), E(347, 712, 8, 12)]);
    add('chest', 20,
      skin('M263 262Q300 250 337 263L347 311 333 367Q300 377 266 367L251 313Z') +
      path('M325 265L337 272 344 310 331 362 319 366Q335 308 325 265Z', c.shade, 'none'),
      [E(299, 316, 40, 49)]);
    add('waist', 21,
      path('M266 358Q300 369 334 358L344 429Q300 450 247 430Z', c.skin, ink, 1.7) +
      path('M249 417Q295 428 342 416L345 448 305 466 294 449 249 454Z', '#c4bac0', ink, 1.5),
      [E(298, 402, 43, 24)]);
    add('shoulders', 22,
      skin('M262 260Q240 256 228 276L226 293 248 302 272 276ZM335 262Q356 258 370 278L375 294 353 304 326 277Z'),
      [E(247, 279, 21, 17, 20), E(354, 280, 21, 17, -20)]);
    let arms = '', elbows = '', wrists = '', hands = '', palms = '', fingers = '';
    const armRegions = [], elbowRegions = [], wristRegions = [], handRegions = [], palmRegions = [], fingerRegions = [];
    c.armData = [];
    [0, 1].forEach(side => {
      const shoulderX = side ? 359 : 242;
      const elbowX = c.elbow[side];
      const wristX = c.wrist[side];
      const direction = side ? 1 : -1;
      const wristY = side ? 437 : 440;
      c.armData.push({ shoulderX, elbowX, wristX, wristY, direction });
      arms += skin(`M${shoulderX - 14} 280Q${elbowX - 17} 310 ${elbowX - 14} 351L${wristX - 10} ${wristY - 10} ${wristX + 10} ${wristY - 8} ${elbowX + 14} 355Q${elbowX + 17} 311 ${shoulderX + 14} 282Z`);
      arms += detail(`M${elbowX + direction * 7} 374L${wristX + direction * 4} ${wristY - 23}`);
      elbows += path(`M${elbowX - 11} 341Q${elbowX} 337 ${elbowX + 11} 342L${elbowX + 10} 359Q${elbowX} 365 ${elbowX - 10} 360Z`, c.skin, 'none') +
        detail(`M${elbowX - 5} 351Q${elbowX} 355 ${elbowX + 5} 351`);
      wrists += skin(`M${wristX - 10} ${wristY - 14}L${wristX + 10} ${wristY - 14} ${wristX + 10} ${wristY + 7} ${wristX - 10} ${wristY + 7}Z`);
      hands += skin(`M${wristX - 10} ${wristY + 2}Q${wristX - 15} ${wristY + 13} ${wristX - 11} ${wristY + 25}L${wristX + 9} ${wristY + 27}Q${wristX + 14} ${wristY + 15} ${wristX + 10} ${wristY + 2}Z`);
      palms += path(`M${wristX - 7} ${wristY + 8}Q${wristX} ${wristY + 4} ${wristX + 7} ${wristY + 9}L${wristX + 7} ${wristY + 23} ${wristX - 7} ${wristY + 22}Z`, c.skin, 'none') +
        detail(`M${wristX - 6} ${wristY + 14}Q${wristX} ${wristY + 11} ${wristX + 5} ${wristY + 16}M${wristX - 4} ${wristY + 20}L${wristX + 2} ${wristY + 18}`);
      [-8, -2, 4, 10].forEach((dx, j) => {
        const length = [15, 19, 17, 12][j];
        fingers += skin(`M${wristX + dx - 2.5} ${wristY + 22}L${wristX + dx - 2} ${wristY + 22 + length}Q${wristX + dx + 1} ${wristY + 27 + length} ${wristX + dx + 3} ${wristY + 22 + length}L${wristX + dx + 3} ${wristY + 22}Z`);
        fingers += detail(`M${wristX + dx} ${wristY + 28}L${wristX + dx + 2} ${wristY + 28}`);
        fingerRegions.push(E(wristX + dx, wristY + 24 + length / 2, 3.2, length / 2 + 3));
      });
      fingers += skin(`M${wristX - direction * 9} ${wristY + 8}Q${wristX - direction * 17} ${wristY + 13} ${wristX - direction * 18} ${wristY + 25}Q${wristX - direction * 15} ${wristY + 31} ${wristX - direction * 12} ${wristY + 24}L${wristX - direction * 6} ${wristY + 17}Z`);
      fingerRegions.push(E(wristX - direction * 13, wristY + 19, 4, 10, direction * 20));
      armRegions.push(segment(shoulderX, 282, elbowX, 350, 15), segment(elbowX, 355, wristX, wristY - 10, 12));
      elbowRegions.push(E(elbowX, 351, 13, 13));
      wristRegions.push(E(wristX, wristY - 3, 10, 11));
      handRegions.push(E(wristX, wristY + 16, 12, 13));
      palmRegions.push(E(wristX, wristY + 16, 8, 9));
    });
    add('arms', 23, arms, armRegions);
    add('elbows', 24, elbows, elbowRegions);
    add('wrists', 25, wrists, wristRegions);
    add('hands', 88, hands, handRegions);
    add('palms', 89, palms, palmRegions);
    add('fingers', 90, fingers, fingerRegions);
    add('neck', 26,
      skin('M283 216L281 258Q300 276 319 257L317 215Z') +
      path('M284 221Q299 233 316 220L317 239Q298 250 283 237Z', c.shade, 'none') +
      detail('M285 251Q298 260 311 252'), [E(300, 245, 18, 23)]);
    add('head', 30,
      skin('M254 154Q251 111 299 106Q347 108 347 152L345 185Q338 213 307 230Q300 234 291 230Q261 215 256 188Z') +
      path('M337 147L346 153 344 187Q335 214 307 230L320 213 333 188Z', c.shade, 'none'),
      [E(300, 169, 46, 62)]);
    add('forehead', 31,
      path('M270 145Q300 132 330 145L329 164Q300 169 271 164Z', c.skin, 'none') +
      path('M283 145Q297 140 308 143L305 147 284 150Z', c.pale, 'none', 0),
      [E(300, 153, 28, 13)]);
    add('cheeks', 32,
      ellipse(273, 198, 9, 4, c.blush) + ellipse(326, 198, 9, 4, c.blush) +
      line('M269 197l2 2m3-3 2 2m45-1 2 2m3-3 2 2', c.shade, .7),
      [E(273, 198, 11, 6), E(326, 198, 11, 6)]);
    add('jaw', 33,
      path('M257 193Q265 211 287 224L282 224Q264 216 258 205ZM342 194Q335 212 313 226L317 225Q337 215 342 203Z', c.skin, 'none') +
      detail('M263 205Q270 216 282 221M318 220Q331 211 337 202'),
      [E(272, 214, 14, 4, 37), E(327, 213, 14, 4, -39)]);
    add('chin', 34,
      path('M291 219Q300 222 309 219L310 226Q300 234 289 226Z', c.skin, 'none') +
      detail('M295 226Q300 228 305 225'), [E(300, 225, 11, 6)]);
    add('ears', 35,
      skin('M256 170Q242 161 245 180Q247 192 258 193ZM344 171Q359 161 355 181Q352 193 342 193Z') +
      detail('M249 175Q255 172 254 184M350 174Q345 174 347 185'),
      [E(251, 181, 7, 12, -15), E(349, 181, 7, 12, 15)]);
    add('eyes', 36,
      line('M266 169Q277 164 288 169M311 169Q322 164 332 169', c.hair, 2.1) +
      path('M265 180Q276 171 288 180Q280 190 267 185ZM311 180Q321 171 333 180L331 185Q319 190 311 180Z', '#fffaf2', c.shade, .8) +
      ellipse(278, 180.5, 5.3, 7, `url(#${c.id}-iris)`, ink, .8) +
      ellipse(321, 180.5, 5.3, 7, `url(#${c.id}-iris)`, ink, .8) +
      ellipse(279, 181, 2.1, 4.6, ink) + ellipse(320, 181, 2.1, 4.6, ink) +
      line('M263 178l2 2Q276 171 288 180M311 180Q321 171 333 180l2-3', ink, 2.1) +
      ellipse(276.5, 178, 1.7, 2.1, '#fff') + ellipse(319.5, 178, 1.7, 2.1, '#fff') +
      ellipse(280, 184, .9, 1, '#fff8da') + ellipse(323, 184, .9, 1, '#fff8da'),
      [E(277, 180, 12, 9), E(322, 180, 12, 9)]);
    add('nose', 37, detail('M300 183L296 197 301 199M303 197l2-1') +
      line('M300 187l-1 6', c.pale, 1.2), [E(300, 193, 5, 9)]);
    add('mouth', 38,
      path('M289 209Q300 215 312 208Q306 218 299 217Q293 216 289 209Z', '#995e5d', '#865458', 1) +
      path('M292 211Q301 214 308 210L306 213Q300 216 295 213Z', '#fff6e4', 'none'),
      [E(300, 213, 12, 6)]);
    add('lips', 39, line('M289 209Q300 215 312 208M297 219Q302 220 305 218', '#b37772', 1.3),
      [E(300, 210, 12, 2.5), E(301, 219, 5, 2)]);
    return { layers, bodyRegions: b };
  }

  function sleeves(c, fill, shade, cuff = c.accent, short = false, puff = false) {
    let svg = '';
    c.armData.forEach(a => {
      const { shoulderX: x, elbowX: ex, wristX: wx, wristY: wy } = a;
      const endX = short ? ex + (x - ex) * .2 : wx;
      const endY = short ? 326 : wy - 13;
      const radius = puff ? 27 : 21;
      svg += path(short
        ? `M${x - 14} 262Q${x - radius - 5} 271 ${x - 23} 289Q${ex - 25} 310 ${endX - 18} ${endY}Q${endX} ${endY + 10} ${endX + 18} ${endY}Q${ex + 23} 305 ${x + 22} 288Q${x + radius} 270 ${x + 12} 262Z`
        : `M${x - 14} 262Q${x - radius - 5} 271 ${x - 23} 289Q${ex - 23} 319 ${ex - 20} 354L${endX - 16} ${endY}Q${endX} ${endY + 9} ${endX + 16} ${endY}L${ex + 20} 354Q${ex + 22} 317 ${x + 22} 288Q${x + radius} 270 ${x + 12} 262Z`, fill);
      svg += path(short
        ? `M${x + 10} 280L${x + 22} 288Q${ex + 23} 305 ${endX + 18} ${endY}L${endX + 6} ${endY + 2}Z`
        : `M${x + 10} 280L${x + 22} 288Q${ex + 22} 317 ${ex + 20} 354L${endX + 16} ${endY} ${endX + 6} ${endY + 2} ${ex + 5} 351Z`, shade, 'none');
      svg += line(`M${x - 11} 294L${x - 5} 311M${endX - 10} ${endY - 14}l12 5m-9-13 13 4`, shade, 1.2);
      svg += path(`M${endX - 16} ${endY - 8}Q${endX} ${endY - 3} ${endX + 16} ${endY - 8}L${endX + 16} ${endY + 2}Q${endX} ${endY + 9} ${endX - 16} ${endY + 2}Z`, cuff, ink, 1.5);
      svg += line(`M${endX - 12} ${endY - 3}Q${endX} ${endY + 2} ${endX + 12} ${endY - 3}`, c.pale, 1);
    });
    return svg;
  }
  function sleeveRegions(c, short = false) {
    return c.armData.flatMap(a => short
      ? [segment(a.shoulderX, 277, a.elbowX + (a.shoulderX - a.elbowX) * .2, 326, 22)]
      : [segment(a.shoulderX, 277, a.elbowX, 351, 22),
        segment(a.elbowX, 351, a.wristX, a.wristY - 14, 20)]);
  }
  function buttons(x, start, count, c, gap = 26) {
    return Array.from({ length: count }, (_, i) =>
      ellipse(x, start + i * gap, 2.8, 2.8, c.accent, c.dark, .9) +
      line(`M${x - .8} ${start + i * gap}h1.6`, c.pale, .8)).join('');
  }
  function pockets(c, left = 255, right = 325, y = 348) {
    return [left, right].map(x =>
      path(`M${x - 13} ${y}H${x + 13}L${x + 11} ${y + 28}Q${x} ${y + 34} ${x - 11} ${y + 28}Z`, c.color, c.dark, 1.3) +
      path(`M${x - 14} ${y}H${x + 14}L${x + 10} ${y + 10} ${x} ${y + 13} ${x - 11} ${y + 10}Z`, c.pale, c.dark, 1.2) +
      ellipse(x, y + 7, 1.8, 1.8, c.accent, c.dark, .6)).join('');
  }
  function trousers(c, fill, shade, wide = false) {
    const d = wide
      ? 'M246 408Q298 398 346 410L355 480 385 685Q360 697 324 685L300 489 283 687Q255 698 223 684L239 488Z'
      : 'M246 408Q298 398 346 410L351 479 359 664Q347 675 330 667L307 540 300 477 287 538 278 669Q257 678 238 667L242 535 237 478Z';
    return path(d, fill) +
      path(wide ? 'M246 425L258 434 250 567 237 683 224 684 239 489ZM326 425L345 415 355 480 385 685 364 688 340 509Z'
        : 'M245 430L259 441 254 526 254 659 239 665 243 535 237 478ZM328 420L346 418 350 480 359 664 347 670 334 526Z', shade, 'none') +
      line(wide ? 'M267 450L254 653M324 450L352 654M278 520L270 575M337 602l8 26M233 670l36 4m61-1 41-1'
        : 'M266 469L258 521M330 477L337 516M247 545l20-5-7 13m73-15 15 8-12 4M247 644l22-4m64 1 18 5', c.pale, 1.15) +
      line('M282 416L284 450 297 457M254 418l-5 22m79-22 6 22', shade, 1.4);
  }
  function fittedLegwear(fill, shade, coverFeet = false) {
    return path('M247 407Q300 397 346 410L353 484 352 548 366 685 338 689 321 610 316 547 300 475 286 544 274 688 244 688 242 608 246 548 240 481Z', fill) +
      path('M247 438L258 447 256 534 255 680 245 683 243 608 247 548 241 481ZM332 436L346 424 353 484 352 548 366 685 352 687 339 557Z', shade, 'none') +
      line('M251 555L252 613M340 557L347 612', shade, 1.2) +
      (coverFeet ? path('M244 678L274 678 275 708 268 719 214 721 212 714 242 694ZM337 678L365 675 370 692 400 714 398 724 340 723 335 708Z', fill, ink, 1.4) : '');
  }
  function footwear(c, kind, fill = c.pale) {
    const boot = kind === 'boots';
    let svg = '';
    [0, 1].forEach(side => {
      const x = side ? 351 : 258;
      const foot = side ? 'M336 684L364 683 378 699 400 707Q411 717 404 728Q378 736 340 726L335 713Z'
        : 'M245 684L273 684 276 713Q269 728 241 729H210Q200 724 207 712L230 701Z';
      if (boot) {
        svg += path(`M${x - 22} 607Q${x} 614 ${x + 21} 607L${x + 17} 692 ${x - 18} 697Z`, c.dark) +
          path(`M${x + 6} 616L${x + 18} 613 ${x + 17} 690 ${x + 6} 694Z`, '#283f49', 'none') +
          path(`M${x - 23} 607Q${x} 614 ${x + 22} 607L${x + 22} 621Q${x} 627 ${x - 23} 620Z`, c.color) +
          line(`M${x - 15} 633l26 1m-26 13 25 1m-25 14 24 1m-24 14 23 1`, c.pale, 1.7) +
          line(`M${x - 11} 628l20 50m-20 0 20-50`, c.accent, 1.5);
      }
      svg += path(foot, fill) +
        path(side ? 'M342 693L351 690 356 716 401 719 403 728 343 723Z'
          : 'M245 694L255 695 248 715 209 721 206 717 230 702Z', c.color, 'none') +
        path(side ? 'M339 716Q370 729 407 719L405 730Q374 740 340 728Z'
          : 'M206 719Q239 726 275 713L274 725Q244 737 207 729Z', c.pale, ink, 1.4) +
        line(side ? 'M345 725Q374 734 399 726' : 'M214 727Q242 730 265 722', c.dark, 1);
      if (kind === 'trainers' || boot) {
        svg += path(side ? 'M348 685L362 687 380 712 358 715Z' : 'M246 686L260 688 251 711 232 714Z', c.dark, ink, 1) +
          line(side ? 'M352 693l14 2m-10 4 15 2m-11 4 15 2' : 'M244 694l13 2m-17 4 14 1m-18 5 14 1', c.pale, 1.9) +
          line(side ? 'M359 689q-18-18-16-5t16 5q16-14 17-6t-17 6' : 'M252 687q-16-14-16-6t16 6q15-16 16-7t-16 7', c.pale, 1.5);
      } else {
        svg += path(side ? 'M341 690L365 698 362 706 339 698Z' : 'M244 691L267 695 265 703 239 700Z', c.dark, ink, 1) +
          rect(side ? 358 : 242, side ? 698 : 695, 7, 6, 1, c.accent, c.dark, .8) +
          line(side ? 'M380 710l10 5' : 'M218 716l10-5', '#fff8e8', 2);
      }
    });
    return svg;
  }

  function wardrobe(c) {
    const layers = [], outfit = [];
    const add = (id, order, svg, regions) => {
      layers.push({ id, order, svg: group(svg) });
      outfit.push({ id, regions });
    };
    const legs = [E(261, 541, 26, 120), E(331, 541, 27, 120, -4)];
    const torso = [E(300, 339, 49, 80)];
    const feet = [E(239, 710, 37, 21, -6), E(373, 713, 37, 21, 8)];
    const shoes = (kind, fill) => add(kind, 56, footwear(c, kind, fill),
      kind === 'boots' ? [...feet, E(258, 650, 23, 45), E(351, 650, 23, 45)] : feet);
    const blouse = (puff = false) =>
      sleeves(c, c.pale, '#d8cbb5', c.pale, false, puff) +
      path('M270 252L285 248Q300 261 315 248L333 255 347 319 341 421Q301 432 252 419L255 322Z', c.pale) +
      path('M325 270L339 315 335 414 320 420 326 343Z', '#d8cbb5', 'none') +
      path('M282 246L300 262 285 281 269 258ZM317 246L300 262 314 281 332 258Z', '#fff6e5', ink, 1.4) +
      line('M300 266L301 417M263 348l9 14m57 17-11 8M263 410l22 3', '#b5a893', 1.2) +
      buttons(300, 291, 5, c);
    switch (c.id) {
      case 'anime-03':
        add('trousers', 50, trousers(c, '#84785b', '#625d4c') +
          path('M238 643L279 645 278 671Q255 681 237 670ZM328 644L359 641 362 667Q347 676 332 670Z', '#c0b18a') +
          line('M242 655l32 3m59-3 23-3', c.pale, 1.4) +
          path('M242 467L271 468 267 500 242 502ZM324 464L347 469 350 500 327 498Z', '#9d916f', '#625d4c', 1.4) +
          line('M245 475l23 1m59-3 17 3', c.pale), legs);
        add('shirt', 60, blouse(), [...torso, ...sleeveRegions(c)]);
        add('vest', 62,
          path('M269 252L285 258 288 410 248 421 247 296ZM317 256L334 252 354 292 345 419 311 410Z', c.color) +
          path('M269 255L280 266 271 309 256 291ZM330 256L318 267 325 307 343 288Z', c.pale, ink, 1.4) +
          path('M252 303L262 311 258 407 248 416ZM334 309L345 294 345 414 332 411Z', c.dark, 'none') +
          pockets(c, 268, 329, 353) + line('M278 312l-4 93m46-92 6 93', c.accent, 1.7) +
          path('M262 315q13-15 20-3-13 17-20 3Z', c.accent, c.dark, 1) +
          line('M264 317l13-4m-7 2-1-5', c.dark, .8),
          [E(268, 341, 21, 76), E(330, 341, 21, 76)]);
        add('belt', 64,
          path('M252 413Q301 423 341 414L341 428Q299 438 251 427Z', '#89623f') +
          rect(289, 417, 22, 16, 2, c.accent) + rect(294, 421, 12, 8, 1, c.dark, 'none') +
          line('M295 425h14', c.pale, 1.6), [E(297, 423, 46, 10)]);
        shoes('boots', '#70563e');
        break;
      case 'anime-04':
        add('tights', 50, fittedLegwear('#74758b', '#62647e', true),
          [...legs, E(259, 681, 17, 25), E(350, 681, 18, 25)]);
        add('skirt', 54,
          path('M251 405Q299 398 343 405L373 503Q301 526 226 503Z', c.color) +
          path('M251 420L259 414 247 506 231 502ZM279 417L288 416 284 513 270 512ZM315 416L325 416 340 509 323 512ZM337 418L345 418 369 502 354 506Z', c.dark, 'none') +
          line('M265 426L253 499M297 424L298 509M332 426L349 499M233 494Q301 515 365 494', '#b6bad7', 1.3) +
          path('M249 403Q298 397 345 402L347 418Q298 427 247 418Z', c.dark),
          [E(300, 463, 69, 52), E(298, 410, 49, 10)]);
        add('blouse', 60, blouse(true) +
          path('M264 255L281 249 300 265 317 249 336 256 329 293 300 316 270 294Z', c.color) +
          path('M283 250L300 265 317 250 306 287 300 301 293 285Z', c.pale, ink, 1.2) +
          line('M269 265L275 289 300 308 325 289 330 265', c.accent, 1.5) +
          path('M296 296L303 296 311 334 300 329 290 337Z', c.dark, ink, 1.3) +
          ellipse(299, 297, 4, 4, c.accent, ink, .8),
          [...torso, ...sleeveRegions(c)]);
        shoes('shoes', '#464b70');
        break;
      case 'anime-05':
        add('leggings', 49, fittedLegwear('#51616b', '#384650'), legs);
        add('shorts', 52,
          path('M246 411Q302 402 346 414L355 506 308 514 300 466 290 516 239 508Z', '#5b747a') +
          path('M248 427L261 435 254 504 240 504ZM327 420L345 419 354 506 340 508Z', '#3b535d', 'none') +
          line('M251 446l20 5-5 29-21-4m82-28 19 3m-13 35 15 2M245 499l38 5m31-2 33-4', '#9bbab7', 1.5) +
          rect(261, 442, 12, 4, 1, c.accent, 'none'),
          [E(264, 465, 27, 49), E(326, 465, 27, 49)]);
        add('hoodie', 60,
          sleeves(c, c.color, '#ba8838', c.accent, true) +
          path('M269 252L286 247Q300 258 316 246L335 254 349 319 341 430Q300 446 247 430L252 315Z', c.color) +
          path('M332 283L348 318 340 427 327 433 333 345Z', '#ba8838', 'none') +
          path('M273 247Q299 223 326 247L339 269 325 287 306 274 291 276 274 287 261 269Z', c.accent) +
          path('M277 248Q300 238 321 249L312 263 292 266Z', c.dark, ink, 1) +
          path('M258 373L286 371 287 410 253 413ZM310 372L333 374 337 412 311 410Z', '#ebc36a', c.dark, 1.3) +
          line('M299 271L299 429M257 382l22-3m41 0 13 4M280 277l-3 36m40-38 3 35', c.pale, 2) +
          rect(294, 313, 10, 17, 2, c.dark) +
          path('M249 422Q298 435 342 422L341 437Q300 450 247 437Z', c.accent) +
          ellipse(324, 325, 11, 11, c.pale, c.dark, 1.2) +
          path('M319 326l5-7 6 7-5 6Z', c.accent, 'none'),
          [...torso, ...sleeveRegions(c, true)]);
        shoes('trainers', '#f4e8c9');
        break;
      case 'anime-06':
        add('socks', 50,
          path('M242 590L277 590 273 696 243 697ZM325 590L358 590 368 698 336 701Z', '#e8d8b9') +
          line('M247 600h25m58 0h25M247 613h25m59 0h25M250 633l-1 51m9-52-2 53M339 633l6 52m3-52 6 51', '#b5a58a', 1.2),
          [E(260, 645, 17, 54), E(346, 645, 18, 54, -5)]);
        add('blouse', 60, blouse(true), [...torso, ...sleeveRegions(c)]);
        add('dress', 63,
          path('M264 266L281 264 285 309 315 309 319 264 336 267 342 367 350 424 378 592Q302 620 220 591L245 428 255 364Z', c.color) +
          path('M263 277L268 312 258 419 239 586 222 590 246 427 255 365ZM329 278L337 278 343 367 351 424 378 592 355 599 329 445 324 358Z', c.dark, 'none') +
          path('M275 356Q300 347 328 357L325 407Q300 421 276 407Z', '#c99179', c.dark, 1.5) +
          line('M279 364Q300 358 324 364M287 373v24m12-27v29m13-27v25M253 445L240 575M281 443L274 592M313 444L325 594M343 450L363 583', '#e4b69a', 1.3) +
          path('M257 418Q300 430 345 418L347 435Q300 447 254 435Z', c.pale, c.dark, 1.5) +
          buttons(273, 283, 1, c) + buttons(328, 283, 1, c) +
          path('M233 582Q301 607 365 584L369 595Q301 620 229 595Z', '#d3a485', c.dark, 1.1) +
          path('M292 473q8-14 15 0l-2 20h-12Z', c.pale, c.dark, 1.2) +
          line('M296 471l2-8m5 7 3-7M295 486h7', c.dark, 1.2),
          [E(299, 363, 44, 90), E(299, 514, 70, 88), E(273, 294, 11, 31), E(328, 294, 11, 31)]);
        shoes('shoes', '#84614d');
        break;
      case 'anime-07':
        add('trousers', 50, trousers(c, '#776b65', '#554d4d'), legs);
        add('sweater', 60,
          path('M270 256L286 249 316 249 333 258 340 425 252 425Z', c.pale) +
          path('M281 244Q300 251 319 244L320 270Q300 280 280 269Z', '#d7c9af') +
          line('M286 250v19m7-17v20m7-19v20m7-20v19m7-21v19M284 290l30 0m-33 20h35M280 339l39 0M280 382h42', '#aa9d89', 1),
          torso);
        add('coat', 64,
          sleeves(c, c.color, c.dark, c.pale) +
          path('M269 253L284 267 289 379 287 486 276 550 229 539 245 414 245 304ZM319 265L333 252 353 293 351 414 378 540 330 550 313 485 309 379Z', c.color) +
          path('M251 298L263 311 260 418 245 537 230 538 245 414ZM334 303L351 293 351 414 378 540 360 544 339 430Z', c.dark, 'none') +
          path('M268 248L282 253 296 282 276 311 257 276ZM321 250L333 246 345 274 322 308 305 282Z', c.pale) +
          line('M276 318L275 524M322 318L334 523M237 528l38 10m59 0 33-8', '#96b2b6', 1.5) +
          pockets(c, 265, 336, 408) +
          [326, 360, 394].map(y => line(`M279 ${y}Q299 ${y + 9} 320 ${y}`, c.dark, 3) +
            rect(286, y - 3, 22, 6, 3, c.accent, c.dark, 1) +
            line(`M299 ${y - 2}v4`, c.pale, 1)).join(''),
          [E(262, 399, 29, 142, 4), E(341, 399, 30, 142, -5), ...sleeveRegions(c)]);
        shoes('boots', '#68554a');
        break;
      case 'anime-08':
        add('trousers', 50, trousers(c, '#596779', '#3e4a61', true) +
          path('M228 666Q254 677 283 668L284 687Q252 699 222 685ZM326 666Q354 676 381 666L385 687Q353 698 324 686Z', c.pale) +
          line('M232 678l43 1m59 0 40-1', c.accent, 2),
          [E(261, 549, 32, 135, 3), E(342, 549, 33, 135, -7)]);
        add('blouse', 60, blouse(), [...torso, ...sleeveRegions(c)]);
        add('jacket', 65,
          path('M268 250L286 260 286 353 260 492 224 512 241 398 242 285ZM317 261L333 250 355 284 353 403 389 495 357 483 315 355Z', c.color) +
          path('M246 302L258 315 250 409 225 510 239 413ZM338 299L354 283 353 404 389 495 370 487 338 398Z', c.dark, 'none') +
          path('M267 248L286 260 279 297 265 288 257 266ZM332 249L318 260 323 297 337 286 342 265Z', c.pale) +
          line('M280 304L277 353 251 482 230 499M324 304L325 353 364 475 380 486', c.accent, 2) +
          path('M254 368l19 5-8 34-20-7ZM335 369l15-5 9 31-18 7Z', c.pale, c.dark, 1.3) +
          [0, 1, 2].map(i => path(`M${253 - i * 4} ${433 + i * 13}l5-5 5 5-5 5Z`, c.accent, 'none')).join('') +
          path('M336 322q10-13 17 0-7 16-17 0Z', c.accent, c.dark, 1) +
          line('M344 317v12m-6-6h13', c.pale, 1),
          [E(259, 374, 28, 115, 9), E(345, 368, 29, 111, -12)]);
        shoes('shoes', '#86516b');
        break;
      case 'anime-09':
        add('jeans', 50,
          trousers(c, '#68818b', '#465e6e') +
          path('M238 645Q258 652 278 644L278 674Q257 683 237 672ZM330 644Q345 650 359 642L363 669Q347 680 332 673Z', '#b4c1bb') +
          line('M242 659Q257 666 274 658M335 659l22-4M257 443Q271 454 280 436M319 437Q331 452 343 444', c.accent, 1.3),
          legs);
        add('sweater', 60,
          sleeves(c, c.color, c.dark, c.pale) +
          path('M269 249Q300 259 331 249L351 272 357 359 348 441Q300 454 244 441L240 358 246 274Z', c.color) +
          path('M334 273L351 275 357 359 348 440 331 443 341 355Z', c.dark, 'none') +
          path('M278 247Q300 257 322 247L325 272Q300 290 275 271Z', c.pale) +
          path('M244 427Q300 441 350 427L348 447Q300 460 243 446Z', c.pale) +
          [260, 280, 301, 322].map(x => line(`M${x} 301q-12 13 0 26t0 26t0 26t0 26M${x} 301q12 13 0 26t0 26t0 26t0 26`, '#c3d3bc', 1.5)).join('') +
          Array.from({ length: 12 }, (_, i) => line(`M${250 + i * 8} 436v10`, '#a99f88', 1)).join('') +
          line('M282 256l-1 14m8-12v16m8-14v17m8-17v17m8-19 1 15', '#b9ad93', 1) +
          path('M277 363q24 14 47 0l-2 22q-22 18-43 0Z', '#618c87', c.dark, 1.3) +
          path('M286 366l15-27 1 32Zm18-25 14 24-14 5Z', c.pale, 'none') +
          line('M301 337v40', c.accent, 1.5),
          [E(300, 350, 54, 96), ...sleeveRegions(c)]);
        shoes('trainers', '#f0e4ce');
        break;
      case 'anime-10':
        add('leggings', 50, fittedLegwear('#6c6478', '#4f495f'), legs);
        add('skirt', 54,
          path('M248 405Q300 396 346 405L376 512 319 549 226 514Z', c.dark) +
          path('M250 406Q299 400 347 406L364 473 301 527 231 482Z', c.color) +
          path('M250 415L267 417 254 481 301 516 291 523 232 482ZM327 415L344 413 364 473 343 491Z', '#796694', 'none') +
          line('M260 428L246 476 302 515 350 474M235 509L319 538 364 509', c.accent, 1.8) +
          line('M278 432l-3 42M318 431l12 43M306 530l10 7', '#c8b9d4', 1.3),
          [E(300, 471, 66, 58), E(316, 528, 34, 16, -15)]);
        add('blouse', 60, blouse(true), [...torso, ...sleeveRegions(c)]);
        add('vest', 64,
          path('M266 253L284 260 300 299 318 260 336 252 346 310 339 399 310 428 300 414 290 428 252 402 250 309Z', c.color) +
          path('M257 300L269 310 266 396 290 418 288 426 252 402 250 309ZM330 303L345 310 339 399 310 428 314 410 329 392Z', c.dark, 'none') +
          path('M267 252L284 260 300 299 287 303 269 278ZM336 252L318 260 300 299 313 303 330 278Z', c.pale, ink, 1.3) +
          line('M299 303L300 407M258 397l31 23m20 0 24-23M274 324l-4 40m55-39 2 38', c.accent, 1.6) +
          buttons(300, 320, 4, c, 23) +
          path('M313 328h18v14l-9 6-9-6Z', c.pale, c.dark, 1) +
          line('M315 330l7 6 7-6', c.dark, .9),
          [E(273, 343, 23, 77), E(325, 343, 23, 77)]);
        shoes('boots', '#7a635a');
        break;
    }
    return { layers, outfit };
  }

  function hairstyle(c) {
    const fill = `url(#${c.id}-hair)`;
    const h = d => path(d, fill);
    const light = d => path(d, c.light, 'none');
    const strands = d => line(d, c.light, 1.3);
    let svg, regions;
    switch (c.id) {
      case 'anime-03':
        svg = h('M249 167Q239 159 243 143Q231 130 244 116Q241 101 258 98Q260 80 277 87Q292 73 307 86Q326 78 336 94Q355 94 353 112Q368 123 356 139L356 161 343 180 338 149 326 133 314 152 306 136 290 155 282 138 270 157 262 149 258 179Z') +
          light('M249 119Q252 99 271 103Q269 88 282 94L299 89 310 95 298 104 279 113 264 128Z') +
          strands('M250 136q0-13 13-17m10-12q11-12 24-9m13 1q18-1 24 13m-56 7-7 22m31-32-7 23m27-17 12 14m14-3 4 20') +
          line('M246 145l8-9m31-7 3 17m35-24-9 20M265 102q7-7 14-6', '#244237', 1.2);
        regions = [E(299, 119, 58, 39), E(251, 157, 9, 22), E(345, 154, 9, 23)];
        break;
      case 'anime-04':
        svg = h('M248 167Q234 209 247 249L268 242 261 181 270 149 292 154 300 139 310 154 333 149 341 181 334 243 357 252Q367 213 352 164Q361 115 336 97Q300 77 265 98Q241 113 248 167Z') +
          path('M248 174L259 173 262 236 252 241Q244 208 248 174ZM345 173L352 168Q361 211 354 243L343 239Z', '#262c48', 'none') +
          light('M253 135Q256 103 286 99L278 110 266 135ZM290 98Q320 91 339 117L343 132 330 119 305 109Z') +
          strands('M259 143Q260 115 278 105M280 141L289 116M301 116l7 25m9-27 10 26M251 186l4 40m91-40 3 42M270 147l19 1m24 0 16-1') +
          line('M249 234l12-2m80 1 12 5', '#b0a5c4', 1.5);
        regions = [E(301, 122, 53, 35), E(253, 206, 13, 43), E(349, 206, 13, 44)];
        break;
      case 'anime-05':
        svg = h('M247 163L238 149 239 130 224 132 244 113 239 102 261 105 264 88 278 94Q301 69 325 87L316 94 343 89 340 100 361 111 350 119 363 137 353 143 351 168 340 180 333 150 322 137 300 156 303 136 279 153 279 135 261 151 260 179Z') +
          light('M250 117L271 104 288 101 307 86 299 105 276 119 256 132ZM304 112L325 100 344 111 327 111 340 127 320 117Z') +
          strands('M245 141l17-21m10-4 14-9m-17 26 16-15m12 13 13-13m-6-18 13-10m13 34 11 17M254 152l3-12m85 11 3 13') +
          line('M274 132l3 14m38-25-10 24m39-22 4 13', '#783e32', 1.3);
        regions = [E(299, 122, 61, 39), E(250, 160, 10, 19), E(344, 161, 9, 19)];
        break;
      case 'anime-06':
        svg = h('M342 178Q368 198 361 222Q381 235 365 255Q385 270 368 287Q384 307 365 324L365 341 352 352 346 337 348 321Q333 301 347 285Q331 266 345 252Q331 234 343 221Q327 201 337 182Z') +
          h('M250 170Q236 133 256 108Q265 87 300 90Q335 87 347 112Q359 137 345 172L336 181 333 147Q309 148 298 127Q281 145 262 149L261 177Z') +
          light('M250 127Q262 103 290 101L297 111 274 120 258 138ZM305 102Q332 103 340 126L326 116Z') +
          [0, 1, 2, 3, 4, 5].map(i => path(`M${255 + i * 14} ${116 - Math.sin(i / 5 * Math.PI) * 17}q3-12 13-8l5 8-9 9Z`, i % 2 ? '#85614b' : '#a27c59', '#523b39', 1.2)).join('') +
          strands('M263 138l20-16m28-1 20 18M346 197l9 17m-9 14 14 15m-12 17 13 14m-10 20 11 13M354 326l4 12') +
          line('M347 225l13-7m-11 38 15-8m-13 39 13-9m-12 40 13-9', '#392d32', 1.3) +
          path('M350 329L364 330 364 338 350 337Z', c.accent, ink, 1);
        regions = [E(299, 121, 52, 33), E(253, 156, 10, 20), E(349, 210, 13, 26), E(359, 280, 13, 56)];
        break;
      case 'anime-07':
        svg = h('M346 156Q375 181 359 214L351 254 364 270 350 298 344 282 335 290Q323 259 334 232L342 202 335 178Z') +
          h('M248 168Q233 141 249 116Q255 91 287 91Q320 81 343 102L358 131 350 161 340 181 333 146 323 133Q301 155 279 161L291 139 269 153 260 175 256 184Z') +
          light('M251 127Q266 96 301 98L285 111 269 130 255 148ZM306 98Q329 94 344 123L324 112Z') +
          strands('M256 135q8-20 26-28m-8 35 24-25m-6 30 22-27m11 0 13 22M348 187q13 18 0 39m-5 16-2 24m9-33-3 25m-4 10 4 13') +
          line('M259 164l10-21m68 3 4 20', '#7b8794', 1.4) +
          path('M339 202L355 206 353 214 337 210Z', c.accent, ink, 1.2);
        regions = [E(300, 123, 54, 36), E(252, 162, 9, 21), E(346, 240, 16, 53)];
        break;
      case 'anime-08':
        svg = h('M253 127Q227 139 217 115Q205 92 226 78Q245 64 263 83Q278 98 264 119ZM334 120Q320 95 338 82Q360 65 378 85Q397 105 377 123Q358 140 341 126Z') +
          h('M250 173Q237 133 256 112Q274 96 300 100Q327 94 347 116Q362 140 348 176L337 181 334 149Q312 141 300 121Q286 144 264 151L261 180Z') +
          light('M219 103Q216 82 238 82L252 90 233 87 224 102ZM344 85Q366 77 378 98L366 91 348 95ZM255 132Q267 110 289 109L275 124 259 140Z') +
          strands('M224 111q15 15 32-1m-26-18q18-6 28 10m87-2q16-12 29 1m-31 12q14 12 26-2M272 137l18-16m22-3 21 21M254 155l2 15m87-20-2 19') +
          path('M247 122l13-9 5 8-14 10ZM339 119l12 10 7-8-13-9Z', c.accent, ink, 1.2) +
          line('M249 129l-13 26 8-3 2 8 10-30M350 127l17 27-9-3-2 8-11-29', c.color, 3);
        regions = [E(239, 102, 25, 26), E(359, 103, 28, 28), E(300, 133, 54, 35), E(252, 164, 9, 18), E(343, 163, 9, 19)];
        break;
      case 'anime-09':
        svg = h('M248 179Q236 171 240 155Q229 140 242 127Q234 114 252 106Q256 91 274 95Q287 82 304 93Q326 84 336 101Q355 99 356 120Q371 132 359 150Q365 166 349 180L338 181 335 153 326 140 314 154 300 139 287 154 274 146 263 160 260 182Z') +
          light('M245 129Q248 115 263 116Q261 101 277 105Q289 93 302 101L290 112 273 114 260 131ZM308 102Q330 94 340 114L326 110 322 122Z') +
          strands('M245 145q1-12 11-14m7-12q9-5 16 1m15-16q9 1 12 10m20 4q14-3 19 9M253 155l4 13m78-22 8 17M282 130l6 12m21-17 8 13') +
          line('M242 158l8 6m96-26 8 4m-85-28 9-4', '#8d704f', 1.1);
        regions = [E(299, 127, 58, 37), E(248, 163, 11, 18), E(348, 164, 11, 18)];
        break;
      case 'anime-10':
        svg = h('M249 149Q232 143 235 126Q222 112 237 100Q240 82 259 85Q273 70 288 85Q306 72 319 88Q340 79 349 98Q371 96 372 117Q387 130 373 145Q386 162 371 177Q385 195 368 209Q382 228 364 240Q371 260 354 268L337 256 336 224 341 201 338 167 333 143 318 149 304 132 287 148 274 135 261 158 260 190 267 216 262 244 246 260Q226 251 233 232Q219 216 231 201Q217 184 233 170Q224 158 237 149Z') +
          light('M242 111Q245 94 263 98Q272 82 286 95L273 104 259 108 247 123ZM301 96Q316 84 327 99Q346 90 351 111L336 106 320 112Z') +
          strands('M239 130q8-12 18-7m15-17q11-5 16 4m17 0q8 0 13 12m17-8q11-3 18 8m-110 24q-10 9-1 18m-1 14q-11 10-1 21m0 13q-8 15 4 24M363 141q9 7-2 17m1 21q11 10-1 21m-3 14q10 12-1 24M255 176l-2 20m92 11 3 22') +
          line('M241 235q6 12 15 8m91 3q6 11 14 3M278 125l9 15m30-5 9 7', '#392d34', 1.5);
        regions = [E(300, 118, 69, 39), E(244, 203, 17, 50), E(358, 207, 18, 54)];
        break;
    }
    return { layer: { id: 'hair', order: 85, svg: group(svg) }, regions };
  }

  const words = {
    hat: ['Hat', 'כובע שוליים', 'headwear'], cap: ['Cap', 'כובע מצחייה', 'headwear'],
    beanie: ['Beanie', 'כובע צמר', 'headwear'], headband: ['Headband', 'קשת לשיער', 'headwear'],
    glasses: ['Glasses', 'משקפיים', 'eyewear'], sunglasses: ['Sunglasses', 'משקפי שמש', 'eyewear'],
    scarf: ['Scarf', 'צעיף', 'neckwear'], necklace: ['Necklace', 'שרשרת', 'neckwear'],
    'bow-tie': ['Bow tie', 'עניבת פרפר', 'neckwear'], watch: ['Watch', 'שעון יד', 'left-wrist'],
    bracelet: ['Bracelet', 'צמיד', 'right-wrist'], ring: ['Ring', 'טבעת', 'handwear'],
    earrings: ['Earrings', 'עגילים', 'ears'], 'hair-clip': ['Hair clip', 'סיכת שיער', 'hair-side'],
    backpack: ['Backpack', 'תיק גב', 'back'], gloves: ['Gloves', 'כפפות', 'handwear'],
    mittens: ['Mittens', 'כפפות עם תא משותף לאצבעות', 'handwear']
  };
  function accessory(c, id, index) {
    const wx = c.wrist[0], rx = c.wrist[1], color = c.color, dark = c.dark;
    let svg = '';
    switch (id) {
      case 'hat':
        svg = path('M252 118L259 91Q299 75 337 91L345 119Q369 122 370 133Q340 153 297 146Q253 152 229 135Q226 124 252 118Z', c.pale) +
          path('M257 107Q300 99 341 107L344 122Q300 135 254 121Z', color) +
          path('M322 88L337 91 343 119 330 122Z', '#d9cbae', 'none') +
          line('M240 132Q294 146 358 131M263 99Q297 87 329 98', c.accent, 1.5) +
          path('M318 113q5-13 14-7-1 13-14 7Z', dark, 'none');
        break;
      case 'cap':
        svg = path('M246 123Q244 84 286 80Q334 74 350 116L345 131Q293 124 248 139Z', color) +
          path('M291 81Q318 91 320 122L346 126 349 116Q335 81 291 81Z', dark, 'none') +
          path('M248 129Q286 117 325 125L363 138Q340 153 308 140L258 145 238 139Z', c.pale) +
          line('M273 86Q263 109 265 126M300 84Q316 98 317 119M251 137Q287 126 316 132', c.accent, 1.3) +
          ellipse(290, 80, 4, 3, c.accent, ink, 1) +
          path('M281 99l9-5 9 5v13l-9 6-9-6Z', c.pale, dark, 1.1) +
          line('M286 104l4-4 4 4-4 7Z', color, 1.4);
        break;
      case 'beanie':
        svg = path('M244 133L246 110Q249 77 295 75Q340 72 353 111L356 135Z', color) +
          path('M318 80Q344 94 343 130L355 132 352 108Q342 83 318 80Z', dark, 'none') +
          path('M243 126Q300 114 356 126L355 145Q300 133 244 146Z', c.pale) +
          Array.from({ length: 14 }, (_, i) => line(`M${249 + i * 7.5} ${i < 7 ? 131 - i * .6 : 127 + (i - 7) * .6}v11`, c.accent, 1)).join('') +
          line('M262 110q2-20 17-25m7 22 5-23m15 23-3-24m19 26-6-19', c.pale, 1.2) +
          ellipse(297, 73, 12, 9, c.pale, dark, 1.2) +
          rect(320, 126, 15, 15, 2, color, dark, 1) +
          path('M324 134l4-4 4 4-4 4Z', c.accent, 'none');
        break;
      case 'headband':
        svg = path('M244 152Q246 94 300 91Q350 92 357 150L349 153Q340 103 300 103Q258 104 252 155Z', c.accent, ink, 1.6) +
          line('M249 141Q256 100 300 97Q340 99 352 141', c.pale, 1.5) +
          path('M249 134L234 121 231 137 246 143 232 150 243 160 255 142Z', color, ink, 1.4) +
          ellipse(248, 143, 4, 5, c.pale, dark, 1);
        break;
      case 'glasses':
      case 'sunglasses': {
        const fill = id === 'glasses' ? 'none' : '#4d6574';
        const shape = index % 2 === 0;
        svg = (shape
          ? rect(261, 171, 32, 23, 8, fill, dark, 1.8) + rect(307, 171, 32, 23, 8, fill, dark, 1.8)
          : ellipse(277, 182, 16, 12, fill, dark, 1.8) + ellipse(323, 182, 16, 12, fill, dark, 1.8)) +
          line('M293 179Q300 176 307 179M261 177l-10-4m88 4 9-5', dark, 1.8) +
          line('M267 176l7-2m39 2 7-2', c.pale, 1.5) +
          ellipse(262, 179, 1.5, 1.5, c.accent) + ellipse(338, 179, 1.5, 1.5, c.accent);
        break;
      }
      case 'scarf':
        svg = path('M280 242Q300 252 320 241L332 258Q319 278 278 269L271 256Z', color, ink, 1.7) +
          path('M311 263L328 261 354 332 337 328 330 335 308 282Z', color, ink, 1.7) +
          path('M276 257Q301 271 326 253L329 262Q306 279 280 268Z', dark, 'none') +
          line('M280 250Q300 261 322 250M319 280l15 41M331 320l17-4', c.accent, 1.6) +
          line('M332 329l2 7m4-7 2 7m4-8 2 7m4-8 2 6', c.pale, 1.1);
        break;
      case 'necklace':
        svg = line('M282 249Q282 276 300 295Q321 271 318 249', '#ad834b', 1.8) +
          line('M286 262Q290 279 299 290M302 290Q311 279 315 263', c.accent, 1.2) +
          ellipse(300, 296, 2.6, 3.3, c.accent, dark, 1) +
          (index % 2 ? path('M300 299l8 10-8 13-8-13Z', c.accent, dark, 1.2) +
            path('M300 304l4 6-4 6-4-6Z', color, 'none')
            : ellipse(300, 308, 9, 9, c.accent, dark, 1.2) +
            ellipse(300, 308, 5.5, 5.5, c.pale, dark, .7) +
            path('M300 304l3 5-6 0Z', color, 'none'));
        break;
      case 'bow-tie':
        svg = path('M296 266L281 258Q276 266 281 277L296 271 313 278Q319 268 314 258L304 264Z', color, ink, 1.5) +
          path('M295 263Q300 261 305 264L305 274 295 274Z', c.accent, dark, 1) +
          line('M283 263l9 5-9 4m29-9-6 5 7 5', c.pale, 1);
        break;
      case 'watch':
        svg = path(`M${wx - 12} 427L${wx + 11} 426 ${wx + 12} 440 ${wx - 11} 442Z`, dark, ink, 1.3) +
          rect(wx - 7, 425, 15, 19, 4, c.accent, dark, 1.2) +
          ellipse(wx + .5, 434, 6, 7, c.pale, dark, .8) +
          line(`M${wx + .5} 429v5l3 2m-3-8v1m0 10v1m-5-6h1m8 0h1`, dark, 1) +
          rect(wx + 9, 431, 3, 5, 1, c.accent, dark, .8);
        break;
      case 'bracelet':
        svg = path(`M${rx - 11} 424Q${rx} 429 ${rx + 11} 423L${rx + 11} 430Q${rx} 436 ${rx - 11} 431Z`, c.accent, dark, 1.1) +
          [-8, -3, 2, 7].map(dx => ellipse(rx + dx, 430 + (Math.abs(dx) < 5 ? 1 : 0), 2.7, 3, dx % 2 ? c.pale : color, dark, .7)).join('') +
          path(`M${rx + 7} 433l3 3-3 4-3-4Z`, color, dark, .8);
        break;
      case 'ring':
        svg = path(`M${rx - 5} 466Q${rx - 2} 468 ${rx + 1} 466L${rx + 1} 470Q${rx - 2} 472 ${rx - 5} 470Z`, c.accent, dark, .8) +
          path(`M${rx - 2} 462l3 3-3 4-3-4Z`, c.pale, dark, .8);
        break;
      case 'earrings':
        svg = [252, 348].map(x => ellipse(x, 190, 2.4, 2.4, c.accent, dark, .8) +
          line(`M${x} 192v5`, c.accent, 1.4) +
          (index % 2 ? ellipse(x, 202, 4.7, 6, 'none', c.accent, 2)
            : path(`M${x} 196l5 7-5 9-5-9Z`, color, dark, 1) +
              ellipse(x - 1, 201, 1.2, 1.8, c.pale))).join('');
        break;
      case 'hair-clip':
        svg = path('M325 142L342 134 345 140 328 148Z', c.accent, dark, 1.2) +
          line('M329 143l12-5', c.pale, 1) +
          (index % 2 ? path('M333 138q-11-11-15-3 3 10 15 7 9 5 12-2-2-8-12-2Z', color, dark, 1.1) +
            ellipse(333, 140, 2.5, 3, c.pale, dark, .7)
            : path('M329 139l3-6 3 4 6-1-2 5 4 4-7 1-3 6-2-7-6-2Z', c.pale, dark, 1));
        break;
      case 'backpack':
        svg = path('M349 306Q379 289 397 312L408 383Q408 409 382 417L357 405Z', color) +
          path('M382 307L397 314 408 383Q409 407 386 414L380 397Z', dark, 'none') +
          path('M359 331Q383 321 401 338L403 354 360 362Z', c.pale, dark, 1.4) +
          rect(373, 364, 24, 31, 5, color, dark, 1.2) +
          line('M377 373h16m-14 13h13', c.accent, 1.4) +
          path('M258 261L268 265Q248 314 260 368L251 377Q235 316 258 261ZM331 265L341 260Q367 306 358 371L348 368Q356 309 331 265Z', dark, ink, 1.4) +
          line('M259 276Q245 320 255 358M340 278Q357 316 353 354', c.accent, 1.6) +
          rect(251, 340, 10, 17, 2, c.accent, dark, 1) +
          rect(348, 340, 10, 17, 2, c.accent, dark, 1);
        break;
      case 'gloves':
      case 'mittens':
        c.armData.forEach(a => {
          const x = a.wristX, y = a.wristY, dir = a.direction;
          if (id === 'gloves') {
            svg += path(`M${x - 12} ${y + 4}H${x + 12}L${x + 13} ${y + 22} ${x + 10} ${y + 28} ${x - 10} ${y + 28} ${x - 13} ${y + 20}Z`, color, ink, 1.5) +
              path(`M${x - dir * 9} ${y + 7}Q${x - dir * 16} ${y + 11} ${x - dir * 17} ${y + 18}L${x - dir * 12} ${y + 21} ${x - dir * 6} ${y + 15}Z`, color, ink, 1.3) +
              [-8, -2, 4, 10].map(dx =>
                path(`M${x + dx - 3} ${y + 24}H${x + dx + 3}V${y + 32}Q${x + dx} ${y + 34} ${x + dx - 3} ${y + 32}Z`, color, dark, 1) +
                line(`M${x + dx - 2} ${y + 31}h4`, c.accent, .8)).join('');
          } else {
            svg += path(`M${x - 12} ${y + 4}L${x + 12} ${y + 4} ${x + 13} ${y + 24} ${x + 11} ${y + 42}Q${x + 5} ${y + 49} ${x - 2} ${y + 46}Q${x - 11} ${y + 48} ${x - 12} ${y + 39}L${x - 13} ${y + 14}Z`, color, ink, 1.5) +
              path(`M${x - dir * 9} ${y + 6}Q${x - dir * 19} ${y + 8} ${x - dir * 20} ${y + 26}Q${x - dir * 17} ${y + 33} ${x - dir * 12} ${y + 26}L${x - dir * 5} ${y + 15}Z`, color, ink, 1.5);
          }
          svg += path(`M${x - 13} ${y + 3}H${x + 13}V${y + 10}Q${x} ${y + 14} ${x - 13} ${y + 10}Z`, c.pale, dark, 1.2) +
            line(`M${x - 7} ${y + 17}l13 0m-12 5h11`, c.accent, 1.2);
        });
        break;
    }
    const [en, he, slot] = words[id];
    return { id, en, he, slot, svg: group(svg) };
  }

  designs.forEach((c, index) => {
    const base = anatomy(c);
    const clothes = wardrobe(c);
    const hair = hairstyle(c);
    base.bodyRegions.hair = hair.regions;
    const defs = `<defs><linearGradient id="${c.id}-hair" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${c.light}"/><stop offset=".38" stop-color="${c.hair}"/><stop offset="1" stop-color="${c.hair}"/></linearGradient><linearGradient id="${c.id}-iris" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${ink}"/><stop offset=".55" stop-color="${c.eye}"/><stop offset="1" stop-color="${c.accent}"/></linearGradient></defs>`;
    const transform = `translate(${300 * (1 - c.sx)} ${400 * (1 - c.sy)}) scale(${c.sx} ${c.sy})`;
    const wrap = svg => `<g transform="${transform}">${svg}</g>`;
    // Anisotropic scaling changes rotated ellipse axes, so transform their covariance exactly.
    const transformRegion = r => {
      const a = (r.angle || 0) * Math.PI / 180;
      const cos = Math.cos(a), sin = Math.sin(a);
      const xx = c.sx ** 2 * (r.rx ** 2 * cos ** 2 + r.ry ** 2 * sin ** 2);
      const yy = c.sy ** 2 * (r.rx ** 2 * sin ** 2 + r.ry ** 2 * cos ** 2);
      const xy = c.sx * c.sy * (r.rx ** 2 - r.ry ** 2) * cos * sin;
      const delta = Math.hypot(xx - yy, 2 * xy);
      return E(300 + (r.cx - 300) * c.sx, 400 + (r.cy - 400) * c.sy,
        Math.sqrt((xx + yy + delta) / 2), Math.sqrt((xx + yy - delta) / 2),
        Math.atan2(2 * xy, xx - yy) * 90 / Math.PI);
    };
    characters[c.id] = {
      id: c.id, category: 'Anime', nameEn: c.nameEn, nameHe: c.nameHe,
      descriptionHe: c.descriptionHe,
      image: `./style-samples/${c.id}.svg`,
      bodyRegions: Object.fromEntries(Object.entries(base.bodyRegions).map(([id, regions]) =>
        [id, regions.map(transformRegion)])),
      outfit: clothes.outfit.map(item => ({ id: item.id, regions: item.regions.map(transformRegion) }))
    };
    illustrations[c.id] = {
      defs,
      layers: [...base.layers, ...clothes.layers, hair.layer].sort((a, b) => a.order - b.order)
        .map(item => ({ ...item, svg: wrap(item.svg) }))
    };
    accessories[c.id] = c.choices.map(id => {
      const item = accessory(c, id, index);
      return { ...item, svg: wrap(item.svg) };
    });
  });
  Object.assign(window.IllustratedCharacters = window.IllustratedCharacters || {}, characters);
  Object.assign(window.IllustratedLayers = window.IllustratedLayers || {}, illustrations);
  Object.assign(window.CharacterAccessories = window.CharacterAccessories || {}, accessories);
})();
