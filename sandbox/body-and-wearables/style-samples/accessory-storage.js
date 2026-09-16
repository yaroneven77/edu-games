"use strict";
(() => {
  const prefix = "edu-games:style-accessories:";

  function report(message, error) {
    console.warn(message, error);
    const warning = document.getElementById("accessory-storage-warning");
    warning.textContent = message;
    warning.hidden = false;
  }

  function isValid(state, items) {
    if (!state || state.version !== 1 ||
        !Array.isArray(state.selectedIds) || !Array.isArray(state.visibleIds) ||
        state.selectedIds.length !== 5 || new Set(state.selectedIds).size !== 5 ||
        new Set(state.visibleIds).size !== state.visibleIds.length) return false;
    const selected = state.selectedIds.map(id => items.find(item => item.id === id));
    return selected.every(Boolean) &&
      new Set(selected.map(window.AccessorySelection.slotFor)).size === 5 &&
      state.visibleIds.every(id => state.selectedIds.includes(id));
  }

  function load(characterId, items) {
    let raw;
    try {
      raw = localStorage.getItem(prefix + characterId);
    } catch (error) {
      report("הדפדפן אינו מאפשר לקרוא את הבחירות השמורות. אפשר להמשיך לשחק, אך הבחירות עלולות לא להישמר.", error);
      return null;
    }
    if (raw === null) return null;
    let state;
    try {
      state = JSON.parse(raw);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      report("לא ניתן לקרוא חלק מהבחירות השמורות. לדמויות אלה נבחרו אביזרים מחדש.", error);
      return null;
    }
    if (!isValid(state, items)) {
      report("חלק מהבחירות השמורות אינן תואמות לאוסף הנוכחי. לדמויות אלה נבחרו אביזרים מחדש.", characterId);
      return null;
    }
    return state;
  }

  function save(characterId, state) {
    try {
      localStorage.setItem(prefix + characterId, JSON.stringify(state));
      return true;
    } catch (error) {
      report("לא ניתן לשמור את הבחירות בדפדפן זה. הן זמינות כעת, אך לא מובטח שיופיעו בביקור הבא.", error);
      return false;
    }
  }

  window.AccessoryStorage = Object.freeze({ load, save, isValid });
})();
