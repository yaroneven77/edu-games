"use strict";
(() => {
  // New fabric, drawn against the legacy body's already-transformed 600 x 800 anchors.
  // These recipes deliberately do not borrow the excluded blouse/leggings layers.
  const recipes = {
    "anime-04": { shirt: ["#f5efd9", "#d8ccb5", "#393f61"], sailor: true },
    "anime-05": { trousers: ["#42454a", "#303237", "#24262b"] },
    "anime-06": { shirt: ["#fff0d8", "#dfc8a9", "#665144"] },
    "anime-08": { shirt: ["#fff0dc", "#dec5b0", "#71515a"] },
    "anime-10": { shirt: ["#f8edda", "#dbc8ae", "#67516e"],
      trousers: ["#57405e", "#402f48", "#302637"] },
    "cartoon-04": { shirt: ["#fff0cc", "#e5cda2", "#6c554b"] },
    "cartoon-06": { shirt: ["#9ed9b5", "#71b58d", "#466959"] },
    "cartoon-10": { trousers: ["#68c7c8", "#44a7ac", "#376d79"] },
    "manga-01": { trousers: ["#555555", "#373737", "#222222"] },
    "manga-03": { shirt: ["#fff0db", "#dfcdb7", "#68544e"], shirtOrder: 39 },
    "manga-07": { shirt: ["#fff0db", "#ddcbb5", "#6b5553"], longSleeves: true,
      longHem: true, shirtOrder: 38, trousersOrder: 37,
      trousers: ["#656166", "#47444a", "#343039"] }
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const n = value => {
    if (!Number.isFinite(value)) throw new Error("Picture wardrobe has invalid garment geometry.");
    return +value.toFixed(3);
  };
  const p = (x, y) => `${n(x)} ${n(y)}`;
  const region = (character, name, side = 0) => {
    const value = character.bodyRegions[name]?.[side];
    if (!value || ![value.cx, value.cy, value.rx, value.ry].every(Number.isFinite)) {
      throw new Error(`Picture wardrobe needs ${character.id}/${name}/${side} geometry.`);
    }
    return value;
  };
  const extent = (r, axis) => {
    const a = (r.angle || 0) * Math.PI / 180;
    return axis === "x" ? Math.hypot(r.rx * Math.cos(a), r.ry * Math.sin(a)) :
      Math.hypot(r.rx * Math.sin(a), r.ry * Math.cos(a));
  };
  const path = (d, fill, ink, width = 1.6) =>
    `<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${width}"/>`;
  const area = (cx, cy, rx, ry, angle = 0) =>
    ({ cx: n(cx), cy: n(cy), rx: n(rx), ry: n(ry), angle: n(angle) });
  function shirt(character, recipe) {
    const [fabric, shade, ink] = recipe.shirt;
    const neck = region(character, "neck"), waist = region(character, "waist");
    const shoulders = [region(character, "shoulders", 0), region(character, "shoulders", 1)];
    const [left, right] = [...shoulders].sort((a, b) => a.cx - b.cx);
    const neckWidth = extent(neck, "x") * 1.05;
    const neckY = neck.cy + extent(neck, "y") * .62;
    const hem = waist.cy + (recipe.longHem ? 43 : 21);
    const half = Math.max(extent(waist, "x") + 11, (right.cx - left.cx) * .47);
    const underarmY = Math.max(left.cy, right.cy) + 41;
    const regions = [area(waist.cx, (neckY + hem) / 2, half, (hem - neckY) / 2)];
    let svg = "";
    shoulders.forEach((shoulder, side) => {
      const elbow = region(character, "elbows", side), wrist = region(character, "wrists", side);
      const end = recipe.longSleeves ? { cx: wrist.cx, cy: wrist.cy - 7 } :
        { cx: shoulder.cx + (elbow.cx - shoulder.cx) * .58,
          cy: shoulder.cy + (elbow.cy - shoulder.cy) * .58 };
      const dx = end.cx - shoulder.cx, dy = end.cy - shoulder.cy, length = Math.hypot(dx, dy);
      const ux = dy / length, uy = -dx / length;
      const width = Math.max(17, extent(shoulder, "x") * .95);
      const cuff = recipe.longSleeves ? Math.max(13, extent(wrist, "x") + 4) : width * .84;
      const edge = (anchor, distance) => p(anchor.cx + ux * distance, anchor.cy + uy * distance);
      const midpoint = recipe.longSleeves ? elbow :
        { cx: (shoulder.cx + end.cx) / 2, cy: (shoulder.cy + end.cy) / 2 };
      svg += path(`M${edge(shoulder, -width)}Q${edge(midpoint, -width)} ${edge(end, -cuff)}L${edge(end, cuff)}Q${edge(midpoint, width)} ${edge(shoulder, width)}Q${p(shoulder.cx - dx / length * width * 1.8, shoulder.cy - dy / length * width * 1.8)} ${edge(shoulder, -width)}Z`, fabric, ink);
      const cuffTop = { cx: end.cx - dx / length * 6, cy: end.cy - dy / length * 6 };
      svg += path(`M${edge(cuffTop, -cuff)}L${edge(end, -cuff)}L${edge(end, cuff)}L${edge(cuffTop, cuff)}`, shade, ink, 1);
      regions.push(area((shoulder.cx + end.cx) / 2, (shoulder.cy + end.cy) / 2,
        length / 2 + 7, width, Math.atan2(dy, dx) * 180 / Math.PI));
    });
    svg += path(`M${p(neck.cx - neckWidth, neckY)}L${p(left.cx, left.cy - extent(left, "y"))}Q${p(left.cx - 5, left.cy + 15)} ${p(waist.cx - half, underarmY)}L${p(waist.cx - half, hem - 4)}Q${p(waist.cx, hem + 5)} ${p(waist.cx + half, hem - 4)}L${p(waist.cx + half, underarmY)}Q${p(right.cx + 5, right.cy + 15)} ${p(right.cx, right.cy - extent(right, "y"))}L${p(neck.cx + neckWidth, neckY)}Q${p(neck.cx, neckY + 23)} ${p(neck.cx - neckWidth, neckY)}Z`, fabric, ink);
    svg += path(`M${p(waist.cx - half + 5, underarmY + 8)}Q${p(waist.cx - half + 13, hem - 23)} ${p(waist.cx - half + 5, hem - 5)}L${p(waist.cx - half, hem - 4)}V${n(underarmY)}Z`, shade, "none");
    const collar = recipe.sailor ? ink : fabric;
    const spread = recipe.sailor ? neckWidth + 18 : neckWidth + 6;
    svg += path(`M${p(neck.cx - neckWidth, neckY)}L${p(neck.cx - spread, neckY + 11)}L${p(neck.cx - 10, neckY + 40)}L${p(neck.cx, neckY + 22)}Z`, collar, ink, 1.2);
    svg += path(`M${p(neck.cx + neckWidth, neckY)}L${p(neck.cx + spread, neckY + 11)}L${p(neck.cx + 10, neckY + 40)}L${p(neck.cx, neckY + 22)}Z`, collar, ink, 1.2);
    svg += path(`M${p(neck.cx, neckY + 23)}L${p(waist.cx, hem - 9)}M${p(waist.cx - half + 6, hem - 10)}Q${p(waist.cx, hem - 3)} ${p(waist.cx + half - 6, hem - 10)}`, "none", shade, 1.4);
    for (let y = neckY + 42; y < hem - 12; y += 23) {
      svg += `<circle cx="${n(neck.cx)}" cy="${n(y)}" r="1.7" fill="${ink}"/>`;
    }
    return { regions, svg, order: recipe.shirtOrder ?? 51 };
  }
  function trousers(character, recipe) {
    const [fabric, shade, ink] = recipe.trousers;
    const waist = region(character, "waist");
    const legs = [0, 1].map(side => ({
      thigh: region(character, "thighs", side), knee: region(character, "knees", side),
      ankle: region(character, "ankles", side)
    })).sort((a, b) => a.thigh.cx - b.thigh.cx);
    const [left, right] = legs;
    const top = waist.cy - 4;
    const half = Math.max(extent(waist, "x") + 9,
      (right.thigh.cx - left.thigh.cx) / 2 + Math.max(...legs.map(l => extent(l.thigh, "x"))) + 7);
    const crotch = Math.min(left.thigh.cy, right.thigh.cy) - 14;
    const cuffs = legs.map(leg => ({ x: leg.ankle.cx, y: leg.ankle.cy - 2,
      width: Math.max(18, extent(leg.ankle, "x") + 8) }));
    const [a, b] = cuffs;
    const kneeWidths = legs.map(leg => Math.max(22, extent(leg.thigh, "x") + 7));
    const [lw, rw] = kneeWidths;
    const d = `M${p(waist.cx - half, top)}Q${p(waist.cx, top - 5)} ${p(waist.cx + half, top)}Q${p(waist.cx + half + 4, crotch)} ${p(right.knee.cx + rw, right.knee.cy)}L${p(b.x + b.width, b.y)}Q${p(b.x, b.y + 5)} ${p(b.x - b.width, b.y)}L${p(right.knee.cx - rw, right.knee.cy)}Q${p(waist.cx + 8, crotch + 28)} ${p(waist.cx, crotch)}Q${p(waist.cx - 8, crotch + 28)} ${p(left.knee.cx + lw, left.knee.cy)}L${p(a.x + a.width, a.y)}Q${p(a.x, a.y + 5)} ${p(a.x - a.width, a.y)}L${p(left.knee.cx - lw, left.knee.cy)}Q${p(waist.cx - half - 4, crotch)} ${p(waist.cx - half, top)}Z`;
    let svg = path(d, fabric, ink);
    legs.forEach((leg, index) => {
      const cuff = cuffs[index], sign = index ? 1 : -1;
      svg += path(`M${p(waist.cx + sign * (half - 7), top + 13)}Q${p(leg.knee.cx + sign * (kneeWidths[index] - 5), leg.knee.cy)} ${p(cuff.x + sign * (cuff.width - 5), cuff.y - 7)}L${p(cuff.x + sign * cuff.width, cuff.y)}L${p(leg.knee.cx + sign * kneeWidths[index], leg.knee.cy)}Q${p(waist.cx + sign * (half + 4), crotch)} ${p(waist.cx + sign * half, top + 10)}Z`, shade, "none");
      svg += path(`M${p(cuff.x - cuff.width, cuff.y - 8)}Q${p(cuff.x, cuff.y - 4)} ${p(cuff.x + cuff.width, cuff.y - 8)}M${p(waist.cx + sign * (half - 12), top + 13)}Q${p(waist.cx + sign * (half - 17), top + 36)} ${p(waist.cx + sign * (half - 34), top + 40)}`, "none", ink, 1.2);
      svg += path(`M${p(leg.knee.cx, crotch + 32)}Q${p(leg.knee.cx - 3, leg.knee.cy)} ${p(cuff.x, cuff.y - 17)}`, "none", shade, 1.1);
    });
    svg += path(`M${p(waist.cx - half, top + 11)}Q${p(waist.cx, top + 7)} ${p(waist.cx + half, top + 11)}M${p(waist.cx, top + 11)}V${n(crotch - 6)}Q${p(waist.cx + 9, crotch - 8)} ${p(waist.cx + 8, top + 15)}`, "none", ink, 1.2);
    svg += `<circle cx="${n(waist.cx)}" cy="${n(top + 5)}" r="2" fill="${ink}"/>`;
    const regions = [area(waist.cx, (top + crotch) / 2, half, (crotch - top) / 2)];
    legs.forEach((leg, index) => {
      const cuff = cuffs[index];
      regions.push(area((leg.thigh.cx + cuff.x) / 2, (crotch + cuff.y) / 2,
        kneeWidths[index], (cuff.y - crotch) / 2));
    });
    return { regions, svg, order: recipe.trousersOrder ?? 49.5 };
  }
  function build(character, requiredItemIds) {
    const content = window.IllustratedContent;
    if (!character || !window.IllustratedLayers[character.id]) {
      throw new Error(`Picture wardrobe has no legacy artwork: ${character?.id}.`);
    }
    if (!Array.isArray(requiredItemIds) || requiredItemIds.length !== 12 ||
        new Set(requiredItemIds).size !== 12) {
      throw new Error(`Picture wardrobe needs twelve distinct item IDs: ${character.id}.`);
    }
    const augmented = clone(character), artwork = clone(window.IllustratedLayers[character.id]);
    const pool = window.CharacterAccessories[character.id];
    if (!Array.isArray(pool)) throw new Error(`Picture wardrobe has no accessory registry: ${character.id}.`);
    const available = new Set(content.playableTargets(content.buildTargets(augmented,
      content.availableAccessories(augmented, pool))).map(target => target.id));
    for (const id of requiredItemIds) {
      if (available.has(id) || !["shirt", "trousers"].includes(id)) continue;
      const recipe = recipes[character.id];
      if (!recipe?.[id]) throw new Error(`Picture wardrobe has no garment recipe for ${character.id}/${id}.`);
      const garment = id === "shirt" ? shirt(augmented, recipe) : trousers(augmented, recipe);
      augmented.outfit.push({ id, regions: garment.regions });
      artwork.layers.push({ id, order: garment.order,
        svg: `<g stroke-linecap="round" stroke-linejoin="round">${garment.svg}</g>` });
    }
    const accessories = clone(window.BeginnerRound.selectFixedAccessories(augmented, pool, requiredItemIds));
    return { character: augmented, artwork, accessories };
  }
  window.PictureWardrobe = Object.freeze({ build });
})();
