"use strict";
(() => {
  const content = window.IllustratedContent;
  const desiredCount = 12;
  const headwear = new Set(["hat", "cap", "headband", "earmuffs"]);
  const neckwear = new Set(["scarf", "necklace", "tie", "medal", "whistle"]);
  const tops = new Set(["shirt", "T-shirt", "jacket", "coat", "dress", "costume", "hoodie",
    "sweater", "vest", "overalls"]);
  const supplementalConcepts = ["watch", "bracelet", "ring", "glasses", "headband",
    "hair-clip", "earrings", "armband", "necklace", "badge"];
  const number = value => {
    if (!Number.isFinite(value)) throw new Error("Beginner wardrobe has invalid body geometry.");
    return +value.toFixed(3);
  };
  const point = (x, y) => `${number(x)} ${number(y)}`;
  const radians = angle => angle * Math.PI / 180;
  const bounds = region => {
    const angle = radians(region.angle || 0);
    return {
      x: Math.hypot(region.rx * Math.cos(angle), region.ry * Math.sin(angle)),
      y: Math.hypot(region.rx * Math.sin(angle), region.ry * Math.cos(angle))
    };
  };
  const mix = (a, b, fraction) => ({
    cx: a.cx + (b.cx - a.cx) * fraction,
    cy: a.cy + (b.cy - a.cy) * fraction
  });
  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }
  function conceptFor(character, item) {
    const target = content.buildTargets(character, [item]).find(word => word.accessoryIds.includes(item.id));
    if (!target) throw new Error(`Beginner wardrobe cannot identify ${character.id}/${item.id}.`);
    return target.id;
  }
  function wristSide(character, concept) {
    // These are the actual drawn sides, not the inconsistent source slot labels.
    if (character.id === "manga-01") return concept === "watch" ? 1 : 0;
    if (character.id === "manga-02") return concept === "watch" ? 1 : 0;
    if (/^manga-/.test(character.id)) return 0;
    if (/^superhero-0[3-9]$|^superhero-10$/.test(character.id)) return 1;
    return concept === "watch" ? 0 : 1;
  }
  function describe(character, concept, item, supplemental = false, side = 0) {
    let slot = concept;
    if (headwear.has(concept)) slot = "headwear";
    else if (neckwear.has(concept)) slot = "neckwear";
    else if (["glasses", "sunglasses"].includes(concept)) slot = "eyewear";
    else if (["watch", "bracelet"].includes(concept)) {
      slot = (supplemental ? side : wristSide(character, concept)) ? "right-wrist" : "left-wrist";
    } else if (concept === "earrings") slot = "earwear";
    else if (concept === "ring") slot = "fingerwear";
    else if (concept === "hair-clip") slot = "hair-side";
    else if (concept === "armband") slot = "upper-arm";
    else if (concept === "badge") slot = "chest-decoration";
    else if (concept === "belt") slot = "waistwear";
    else if (concept === "backpack") slot = "back";
    return {
      concept, slot, item, supplemental,
      coversHair: ["hat", "cap", "earmuffs"].includes(concept),
      // The cartoon bow and superhero forehead band overlap their original clips.
      clipCollision: concept === "headband" && !supplemental &&
        /^(cartoon|superhero)-/.test(character.id)
    };
  }
  function compatible(candidate, chosen) {
    return chosen.every(other => {
      if (candidate.concept === other.concept || candidate.slot === other.slot) return false;
      const pair = [candidate.concept, other.concept];
      if (pair.includes("gloves") && pair.some(id => ["ring", "watch", "bracelet"].includes(id))) return false;
      if (pair.includes("earmuffs") && pair.includes("earrings")) return false;
      if (candidate.concept === "hair-clip" && (other.coversHair || other.clipCollision)) return false;
      if (other.concept === "hair-clip" && (candidate.coversHair || candidate.clipCollision)) return false;
      return true;
    });
  }
  function supplementalArt(character, concept, side) {
    const regions = character.bodyRegions;
    const region = (name, index = 0) => {
      const result = regions[name]?.[index];
      if (!result || ![result.cx, result.cy, result.rx, result.ry].every(Number.isFinite)) {
        throw new Error(`Beginner wardrobe needs ${character.id}/${name}/${index} geometry.`);
      }
      return result;
    };
    const monochrome = /^manga-(01|02|08|09|10)$/.test(character.id);
    const palette = monochrome ? ["#333333", "#bbbbbb", "#f5f5f5", "#555555"] :
      character.id.startsWith("cartoon") ? ["#6c554b", "#e9bb73", "#fff2d2", "#6b9687"] :
      character.id.startsWith("superhero") ? ["#30414b", "#e8c77f", "#f8f3de", "#568993"] :
      character.id.startsWith("manga") ? ["#343039", "#c99e61", "#fff7e9", "#73566e"] :
      ["#493b45", "#d6b170", "#fff1d6", "#7a668b"];
    const [ink, accent, pale, dark] = palette;
    const stroke = character.id.startsWith("cartoon") ? 1.6 : 1.1;
    const path = (d, fill = "none", color = ink, width = stroke) =>
      `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
    const ellipse = (x, y, rx, ry, fill = "none", color = ink, width = stroke) =>
      `<ellipse cx="${number(x)}" cy="${number(y)}" rx="${number(rx)}" ry="${number(ry)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
    const place = (svg, x, y, angle = 0) =>
      `<g transform="translate(${point(x, y)}) rotate(${number(angle)})">${svg}</g>`;
    let svg;
    if (concept === "watch" || concept === "bracelet") {
      const wrist = region("wrists", side), elbow = region("elbows", side);
      const angle = Math.atan2(wrist.cy - elbow.cy, wrist.cx - elbow.cx) * 180 / Math.PI - 90;
      const relative = radians((wrist.angle || 0) - angle);
      const width = Math.max(6, Math.hypot(wrist.rx * Math.cos(relative), wrist.ry * Math.sin(relative)));
      const height = Math.max(3, width * .34);
      svg = path(`M${point(-width, -height)}Q0 ${number(-height + 2)} ${point(width, -height)}L${point(width, height)}Q0 ${number(height + 3)} ${point(-width, height)}Z`,
        concept === "watch" ? dark : accent);
      if (concept === "watch") {
        const face = Math.max(5, width * .65);
        svg += ellipse(0, 0, face, face * 1.13, accent) +
          ellipse(0, 0, face * .75, face * .88, pale, ink, .7) +
          path(`M0 ${number(-face * .57)}V0L${point(face * .42, face * .25)}`, "none", ink, .9) +
          path(`M${number(face)} -1H${number(face + 2)}V2H${number(face)}`, accent, ink, .7);
      } else {
        [-.65, -.22, .22, .65].forEach(offset => {
          svg += ellipse(width * offset, height * .3, Math.max(1.5, width * .16), height * .8,
            Math.abs(offset) > .4 ? dark : pale, ink, .65);
        });
      }
      svg = place(svg, wrist.cx, wrist.cy, angle);
    } else if (concept === "ring") {
      const finger = region("fingers", 2);
      const hand = regions.hands.reduce((nearest, current) =>
        Math.hypot(current.cx - finger.cx, current.cy - finger.cy) <
          Math.hypot(nearest.cx - finger.cx, nearest.cy - finger.cy) ? current : nearest);
      const direction = Math.atan2(finger.cy - hand.cy, finger.cx - hand.cx);
      const radius = Math.min(finger.rx, finger.ry);
      const x = finger.cx - Math.cos(direction) * Math.max(finger.rx, finger.ry) * .25;
      const y = finger.cy - Math.sin(direction) * Math.max(finger.rx, finger.ry) * .25;
      svg = place(path(`M${point(-radius, -1.6)}Q0 -1 ${point(radius, -1.6)}V1.6Q0 2.8 ${point(-radius, 1.6)}Z`, accent, ink, .65) +
        path("M0 -4L2.6 -1.6 0 1 -2.6 -1.6Z", pale, ink, .65), x, y, direction * 180 / Math.PI - 90);
    } else if (concept === "glasses") {
      const eyes = regions.eyes.slice(0, 2).sort((a, b) => a.cx - b.cx);
      const [left, right] = eyes;
      const sizes = eyes.map(eye => bounds(eye));
      svg = eyes.map((eye, index) =>
        ellipse(eye.cx, eye.cy, sizes[index].x + 2.5, sizes[index].y + 2.2, "none", dark, stroke + .4)).join("");
      svg += path(`M${point(left.cx + sizes[0].x + 2.5, left.cy - 1)}Q${point((left.cx + right.cx) / 2, Math.min(left.cy, right.cy) - 5)} ${point(right.cx - sizes[1].x - 2.5, right.cy - 1)}`, "none", dark, stroke + .3);
      eyes.forEach((eye, index) => {
        const ear = region("ears", index), sign = index ? 1 : -1;
        svg += path(`M${point(eye.cx + sign * (sizes[index].x + 2.5), eye.cy - 3)}L${point(ear.cx, Math.min(eye.cy - 4, ear.cy))}`, "none", dark, stroke + .3);
      });
    } else if (concept === "headband") {
      const hair = region("hair"), size = bounds(hair);
      const width = size.x * .94, top = hair.cy - size.y * .78, bottom = hair.cy + size.y * .65;
      const thickness = Math.max(4, width * .1);
      svg = path(`M${point(hair.cx - width, bottom)}Q${point(hair.cx - width, top)} ${point(hair.cx, top)}Q${point(hair.cx + width, top)} ${point(hair.cx + width, bottom)}L${point(hair.cx + width - thickness, bottom - 1)}Q${point(hair.cx + width - thickness, top + thickness)} ${point(hair.cx, top + thickness)}Q${point(hair.cx - width + thickness, top + thickness)} ${point(hair.cx - width + thickness, bottom - 1)}Z`, dark) +
        path(`M${point(hair.cx - width + thickness / 2, bottom - 7)}Q${point(hair.cx - width + thickness / 2, top + thickness / 2)} ${point(hair.cx, top + thickness / 2)}`, "none", accent, .9);
    } else if (concept === "hair-clip") {
      const hair = region("hair"), size = bounds(hair);
      const width = Math.max(12, size.x * .34);
      svg = place(path(`M${point(-width / 2, -2.8)}H${number(width / 2)}Q${number(width / 2 + 3)} 0 ${point(width / 2, 2.8)}H${number(-width / 2)}Z`, accent) +
        path(`M${point(-width / 2 + 3, 0)}H${number(width / 2 - 2)}`, "none", pale, .9),
      hair.cx + size.x * .55, hair.cy + size.y * .45, -23);
    } else if (concept === "earrings") {
      svg = regions.ears.map(ear => {
        const size = bounds(ear), y = ear.cy + size.y * .73;
        const radius = Math.max(2.5, Math.min(4.5, size.x * .55));
        return ellipse(ear.cx, y, 1.7, 1.7, accent, ink, .65) +
          path(`M${point(ear.cx, y + 1)}V${number(y + 4)}`, "none", accent, 1.6) +
          ellipse(ear.cx, y + radius + 3, radius, radius + 1.5, "none", accent, 1.8);
      }).join("");
    } else if (concept === "armband") {
      const shoulder = region("shoulders", 1), elbow = region("elbows", 1);
      const center = mix(shoulder, elbow, .56);
      const angle = Math.atan2(elbow.cy - shoulder.cy, elbow.cx - shoulder.cx) * 180 / Math.PI - 90;
      const arm = regions.arms.reduce((nearest, current) =>
        Math.hypot(current.cx - center.cx, current.cy - center.cy) <
          Math.hypot(nearest.cx - center.cx, nearest.cy - center.cy) ? current : nearest);
      const sleeved = character.outfit.some(item => ["jacket", "coat", "hoodie", "sweater"].includes(item.id));
      const width = Math.max(9, Math.min(24, Math.min(arm.rx, arm.ry) * (sleeved ? 1.15 : 1.03)));
      svg = place(path(`M${point(-width, -5)}Q0 -2 ${point(width, -5)}V5Q0 8 ${point(-width, 5)}Z`, dark) +
        path(`M${point(-width + 2, -1)}Q0 2 ${point(width - 2, -1)}`, "none", accent, 2) +
        path("M-3 -4H3V5H-3Z", pale, ink, .7), center.cx, center.cy, angle);
    } else if (concept === "necklace") {
      const neck = region("neck"), chest = region("chest"), size = bounds(neck);
      const y = neck.cy + size.y * .6, pendantY = Math.min(chest.cy + 5, y + 50);
      svg = path(`M${point(neck.cx - size.x * .9, y)}Q${point(neck.cx - size.x, pendantY - 12)} ${point(chest.cx, pendantY)}Q${point(neck.cx + size.x, pendantY - 12)} ${point(neck.cx + size.x * .9, y)}`, "none", ink, 2.1) +
        path(`M${point(neck.cx - size.x * .9, y)}Q${point(neck.cx - size.x, pendantY - 12)} ${point(chest.cx, pendantY)}Q${point(neck.cx + size.x, pendantY - 12)} ${point(neck.cx + size.x * .9, y)}`, "none", accent, 1.15) +
        place(path("M0 0L5 6 0 12-5 6Z", accent) + path("M0 3L2 6 0 9-2 6Z", pale, ink, .6),
          chest.cx, pendantY);
    } else if (concept === "badge") {
      const chest = region("chest"), size = bounds(chest);
      const x = chest.cx + size.x * .5, y = chest.cy - size.y * .1;
      const scale = Math.max(.8, Math.min(1.15, size.x / 45));
      svg = place(`<g transform="scale(${number(scale)})">` +
        path("M-8 -10H8L9 3Q5 10 0 13Q-5 10-9 3Z", accent) +
        path("M-5 -6H5V2L0 7-5 2Z", dark, ink, .7) +
        path("M-2 -1L0 2 4-3", "none", pale, 1.4) + "</g>", x, y);
    }
    if (!svg || /NaN|Infinity|undefined/.test(svg)) {
      throw new Error(`Beginner wardrobe cannot draw ${character.id}/${concept}.`);
    }
    const word = content.vocabulary.find(item => item.id === concept);
    return { id: `beginner-${concept}`, conceptId: concept, en: word.canonical, he: word.he,
      svg: `<g stroke-linecap="round" stroke-linejoin="round">${svg}</g>` };
  }
  function selectAccessories(character, allAccessories) {
    const baseTargets = content.playableTargets(content.buildTargets(character, []));
    const base = baseTargets.filter(target => target.category !== "body")
      .map(target => describe(character, target.id, null));
    const needed = desiredCount - base.length;
    if (needed < 0 || baseTargets.filter(target => target.category === "body").length !== 26) {
      throw new Error(`Beginner wardrobe has an unsupported base outfit: ${character.id}.`);
    }
    const originals = shuffle(content.availableAccessories(character, allAccessories))
      .map(item => describe(character, conceptFor(character, item), item))
      .filter(item => compatible(item, base));
    const supplements = supplementalConcepts.flatMap(concept => {
      if (concept === "badge" && !base.some(item => tops.has(item.concept))) return [];
      return (["watch", "bracelet"].includes(concept) ? [0, 1] : [0]).map(side => {
        const item = describe(character, concept, null, true, side);
        item.side = side;
        return item;
      });
    });
    // At most ten originals: exhaustively maximize retained original drawings, then
    // complete only the missing concepts with independently anchored new artwork.
    let best = null, bestOriginalCount = -1;
    function complete(chosen, index = 0) {
      if (chosen.length === needed) return chosen;
      if (index === supplements.length || chosen.length + supplements.length - index < needed) return null;
      const candidate = supplements[index];
      if (compatible(candidate, [...base, ...chosen])) {
        const result = complete([...chosen, candidate], index + 1);
        if (result) return result;
      }
      return complete(chosen, index + 1);
    }
    function search(chosen, index) {
      if (chosen.length + originals.length - index <= bestOriginalCount) return;
      if (chosen.length === needed || index === originals.length) {
        if (chosen.length <= bestOriginalCount || needed - chosen.length > 5) return;
        const result = complete(chosen);
        if (result) {
          best = result;
          bestOriginalCount = chosen.length;
        }
        return;
      }
      const candidate = originals[index];
      if (compatible(candidate, [...base, ...chosen])) search([...chosen, candidate], index + 1);
      search(chosen, index + 1);
    }
    search([], 0);
    if (!best) throw new Error(`Cannot build twelve distinct compatible Beginner items for ${character.id}.`);
    const selected = best.map(entry => ({
      ...(entry.item || supplementalArt(character, entry.concept, entry.side)),
      slot: entry.slot
    }));
    const targets = content.playableTargets(content.buildTargets(character, selected));
    const clothing = targets.filter(target => target.category !== "body");
    if (clothing.length !== desiredCount || targets.length !== 38 ||
        new Set(selected.map(item => item.id)).size !== selected.length ||
        best.some((entry, index) => !compatible(entry, [...base, ...best.slice(0, index)]))) {
      throw new Error(`Invalid twelve-item Beginner wardrobe: ${character.id}.`);
    }
    return selected;
  }
  function selectFixedAccessories(character, allAccessories, requiredItemIds) {
    if (!Array.isArray(requiredItemIds) || requiredItemIds.length !== desiredCount ||
        new Set(requiredItemIds).size !== desiredCount) {
      throw new Error(`Fixed wardrobe needs twelve distinct item IDs: ${character.id}.`);
    }
    const required = new Set(requiredItemIds);
    const baseTargets = content.playableTargets(content.buildTargets(character, []));
    const base = baseTargets.filter(target => target.category !== "body")
      .map(target => describe(character, target.id, null));
    if (baseTargets.filter(target => target.category === "body").length !== 26 ||
        base.some(entry => !required.has(entry.concept))) {
      throw new Error(`Fixed wardrobe has an unexpected base outfit: ${character.id}.`);
    }
    const originals = content.availableAccessories(character, allAccessories)
      .map(item => describe(character, conceptFor(character, item), item));
    // Keep the original timepiece when source watch/bracelet drawings share a wrist.
    const missing = requiredItemIds.filter(id => !base.some(entry => entry.concept === id))
      .sort((a, b) => Number(b === "watch") - Number(a === "watch"));
    const choices = missing.map(concept => {
      const candidates = originals.filter(entry => entry.concept === concept);
      if (supplementalConcepts.includes(concept) &&
          (concept !== "badge" || base.some(entry => tops.has(entry.concept)))) {
        for (const side of ["watch", "bracelet"].includes(concept) ? [0, 1] : [0]) {
          candidates.push({ ...describe(character, concept, null, true, side), side });
        }
      }
      if (!candidates.length) throw new Error(`Fixed wardrobe has no recipe for ${character.id}/${concept}.`);
      return candidates;
    });
    let best = null, bestOriginalCount = -1;
    function search(chosen, originalCount) {
      if (originalCount + choices.length - chosen.length <= bestOriginalCount) return;
      if (chosen.length === choices.length) {
        best = chosen;
        bestOriginalCount = originalCount;
        return;
      }
      for (const candidate of choices[chosen.length]) {
        if (compatible(candidate, [...base, ...chosen])) {
          search([...chosen, candidate], originalCount + (candidate.supplemental ? 0 : 1));
        }
      }
    }
    search([], 0);
    if (!best) throw new Error(`Fixed wardrobe has incompatible required items: ${character.id}.`);
    const selected = best.map(entry => ({
      ...(entry.item || supplementalArt(character, entry.concept, entry.side)),
      slot: entry.slot
    }));
    const targets = content.playableTargets(content.buildTargets(character, selected));
    const clothing = targets.filter(target => target.category !== "body");
    if (targets.length !== 38 || clothing.length !== desiredCount ||
        clothing.some(target => !required.has(target.id)) ||
        new Set(selected.map(item => item.id)).size !== selected.length) {
      throw new Error(`Invalid fixed twelve-item wardrobe: ${character.id}.`);
    }
    return selected;
  }
  window.BeginnerRound = Object.freeze({ selectAccessories, selectFixedAccessories });
})();
