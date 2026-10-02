(() => {
  "use strict";

  const mode = document.body?.dataset.atlasMode === "sandbox" ? "sandbox" : "production";
  const key = mode === "sandbox" ? "edu-games-atlas-expedition-sandbox-v1" : "edu-games-atlas-expedition-v1";
  const legacyKeys = mode === "sandbox"
    ? ["edu-games-atlas-cloud-harbor-sandbox-v1", "edu-games-atlas-gale-garden-sandbox-v1"]
    : ["edu-games-atlas-cloud-harbor-v1", "edu-games-atlas-gale-garden-v1"];
  const chapterKeys = [
    ...legacyKeys,
    ...[3, 4, 5, 6].map(number => `edu-games-atlas-island-${number}-${mode}-v1`)
  ];

  const blank = () => ({
    version: 1,
    islands: {},
    fragments: [],
    updatedAt: null
  });

  function loadRaw(storageKey) {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  }

  function migrate(state) {
    const cloud = loadRaw(legacyKeys[0]);
    const garden = loadRaw(legacyKeys[1]);
    if (cloud?.step >= 10 && cloud?.secret) {
      state.islands["1"] ||= { complete: true, title: "Cloud Harbor" };
      if (!state.fragments.includes(1)) state.fragments.push(1);
    }
    if (garden?.step >= 10) {
      state.islands["2"] ||= { complete: true, title: "Gale Garden" };
      if (!state.fragments.includes(2)) state.fragments.push(2);
    }
    return state;
  }

  function load() {
    const parsed = loadRaw(key);
    const state = migrate(parsed?.version === 1
      ? { ...blank(), ...parsed, islands: { ...(parsed.islands || {}) }, fragments: [...(parsed.fragments || [])] }
      : blank());
    state.fragments = [...new Set(state.fragments)].sort((a, b) => a - b);
    return state;
  }

  function save(state) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("atlas-progress", { detail: state }));
    return state;
  }

  function completeIsland(number, title, details = {}) {
    const state = load();
    state.islands[String(number)] = {
      ...state.islands[String(number)],
      ...details,
      complete: true,
      title,
      completedAt: new Date().toISOString()
    };
    if (!state.fragments.includes(number)) state.fragments.push(number);
    return save(state);
  }

  function recordVisit(number, title) {
    const state = load();
    state.islands[String(number)] = {
      ...state.islands[String(number)],
      title,
      visited: true,
      lastVisitedAt: new Date().toISOString()
    };
    return save(state);
  }

  function isUnlocked(number) {
    if (number <= 1) return true;
    return Boolean(load().islands[String(number - 1)]?.complete);
  }

  function reset() {
    localStorage.removeItem(key);
    return blank();
  }

  function resetAdventure() {
    [key, ...chapterKeys].forEach(storageKey => localStorage.removeItem(storageKey));
    const state = blank();
    window.dispatchEvent(new CustomEvent("atlas-progress", { detail: state }));
    return state;
  }

  window.AtlasProgress = { mode, key, load, save, completeIsland, recordVisit, isUnlocked, reset, resetAdventure };
})();
