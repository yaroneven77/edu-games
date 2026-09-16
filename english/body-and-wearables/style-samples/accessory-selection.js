"use strict";
(() => {
  function slotFor(item) {
    return item.slot || ({ hat: "headwear", glasses: "eyewear", scarf: "neckwear" }[item.id]) || item.id;
  }

  function pick(items, previousIds = []) {
    if (items.length < 6 || new Set(items.map(item => item.id)).size !== items.length ||
        new Set(items.map(slotFor)).size < 5) {
      throw new Error("Accessory shuffle requires distinct items and at least five compatible slots.");
    }
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = [];
    const usedSlots = new Set();
    for (const item of shuffled) {
      const slot = slotFor(item);
      if (usedSlots.has(slot)) continue;
      selected.push(item);
      usedSlots.add(slot);
      if (selected.length === 5) break;
    }

    // Even a repeated random sequence must change at least one accessory on Shuffle.
    if (previousIds.length === 5 && selected.every(item => previousIds.includes(item.id))) {
      const replacement = shuffled.find(item => !previousIds.includes(item.id));
      const sameSlot = selected.findIndex(item => slotFor(item) === slotFor(replacement));
      selected[sameSlot === -1 ? 0 : sameSlot] = replacement;
    }
    return selected;
  }

  window.AccessorySelection = Object.freeze({ slotFor, pick });
})();
