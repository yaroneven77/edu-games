"use strict";
(() => {
  const content = window.IllustratedContent;
  const photos = window.PicturePhotoData;
  if (!content || !window.PictureWardrobe || !photos || Object.keys(photos).length !== 38) {
    throw new Error("The picture collection needs all 38 original-picture records and its wardrobe helpers.");
  }
  const ns = "http://www.w3.org/2000/svg";
  const scale = 1024 / 600, offsetY = (1536 - 800 * scale) / 2;
  const normalize = region => ({
    cx: region.cx * scale, cy: region.cy * scale + offsetY,
    rx: region.rx * scale, ry: region.ry * scale, angle: region.angle || 0
  });
  const wrap = svg => `<g transform="translate(0 ${offsetY}) scale(${scale})">${svg}</g>`;
  const namespace = (svg, id) => svg
    .replace(/\bid=(["'])([^"']+)\1/g, (_, quote, name) => `id=${quote}picture-${id}-${name}${quote}`)
    .replace(/url\((["']?)#([^)"']+)\1\)/g, (_, quote, name) => `url(${quote}#picture-${id}-${name}${quote})`)
    .replace(/\b((?:xlink:)?href)=(["'])#([^"']+)\2/g, (_, attribute, quote, name) =>
      `${attribute}=${quote}#picture-${id}-${name}${quote}`);
  const measurement = document.createElementNS(ns, "svg");
  measurement.setAttribute("viewBox", "0 0 600 800");
  measurement.setAttribute("width", "600");
  measurement.setAttribute("height", "800");
  measurement.setAttribute("aria-hidden", "true");
  measurement.style.cssText = "position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none";
  document.body.append(measurement);
  function accessoryRegion(svg, characterId, conceptId) {
    const group = document.createElementNS(ns, "g");
    group.innerHTML = svg;
    measurement.append(group);
    const box = group.getBBox();
    group.remove();
    if (![box.x, box.y, box.width, box.height].every(Number.isFinite) || box.width <= 0 || box.height <= 0) {
      throw new Error(`Empty picture accessory: ${characterId}/${conceptId}`);
    }
    return normalize({ cx: box.x + box.width / 2, cy: box.y + box.height / 2,
      rx: box.width / 2 + 4, ry: box.height / 2 + 4 });
  }
  const characters = [];
  try {
    for (const [id, photo] of Object.entries(photos).sort(([a], [b]) => a.localeCompare(b))) {
      const original = window.IllustratedCharacters[id];
      if (!original || !Array.isArray(photo.itemIds) || photo.itemIds.length !== 12) {
        throw new Error(`Invalid original-picture identity or inventory: ${id}`);
      }
      const { character, artwork, accessories } = window.PictureWardrobe.build(original, photo.itemIds);
      const targets = content.playableTargets(content.buildTargets(character, accessories));
      if (targets.length !== 38 || targets.filter(target => target.category === "body").length !== 26 ||
        targets.filter(target => target.category !== "body").some(target => !photo.itemIds.includes(target.id))) {
        throw new Error(`Picture wardrobe differs from its original inventory: ${id}`);
      }
      const byId = new Map(artwork.layers.map(layer => [layer.id, layer]));
      const selected = new Map(accessories.map(item => [item.id, item]));
      const ordered = [...targets].sort((a, b) => (byId.get(a.id)?.order ?? 200) - (byId.get(b.id)?.order ?? 200));
      const defs = namespace(artwork.defs || "", id), layers = [], regions = {};
      measurement.innerHTML = defs;
      for (const target of ordered) {
        regions[target.id] = target.regions.map(normalize);
        for (const accessoryId of target.accessoryIds) {
          const item = selected.get(accessoryId);
          if (!item) throw new Error(`Missing picture accessory: ${id}/${accessoryId}`);
          if (!item.rearSvg) continue;
          const svg = namespace(item.rearSvg, id);
          layers.push({ id: target.id, order: layers.length, svg: wrap(svg) });
          regions[target.id].push(accessoryRegion(svg, id, target.id));
        }
      }
      for (const target of ordered) {
        let svg = namespace(byId.get(target.id)?.svg || "", id);
        for (const accessoryId of target.accessoryIds) {
          const front = namespace(selected.get(accessoryId).svg, id);
          svg += front;
          regions[target.id].push(accessoryRegion(front, id, target.id));
        }
        if (!svg || !regions[target.id].length) throw new Error(`Missing independent picture part: ${id}/${target.id}`);
        layers.push({ id: target.id, order: layers.length, svg: wrap(svg) });
      }
      characters.push({
        id, category: original.category, nameHe: original.nameHe, nameEn: original.nameEn,
        image: `./picture-art/${id}.png`, itemIds: [...photo.itemIds], absentItems: [...photo.absentItems],
        art: { width: 1024, height: 1536, defs, layers, regions, photoRegions: photo.regions }
      });
    }
  } finally {
    measurement.remove();
  }
  window.PictureCollection = Object.freeze({ characters: Object.freeze(characters) });
})();
