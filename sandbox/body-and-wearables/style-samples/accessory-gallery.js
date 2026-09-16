"use strict";
(() => {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const preview = document.getElementById("accessory-preview");
  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");
  const previewArt = document.getElementById("preview-art");
  let previewLink;

  document.getElementById("preview-close").addEventListener("click", () => preview.close());
  preview.addEventListener("close", () => {
    if (preview.open) return;
    previewArt.replaceChildren();
    previewLink?.focus();
  });

  for (const card of document.querySelectorAll(".sample")) {
    const image = card.querySelector("img");
    const characterId = image.getAttribute("src").split("/").pop().replace(/\.svg$/, "");
    const items = window.CharacterAccessories?.[characterId];
    if (!window.AccessorySelection || !Array.isArray(items) || items.length < 6 ||
        items.some(item => !item || !item.id || !item.en || !item.he || !item.svg) ||
        new Set(items.map(item => item.id)).size !== items.length ||
        new Set(items.map(window.AccessorySelection.slotFor)).size < 5) {
      const error = document.createElement("p");
      error.className = "error";
      error.setAttribute("role", "alert");
      error.textContent = "אביזרי הדמות לא נטענו. בדקו שקובצי האביזרים נמצאים לצד הגלריה ורעננו את העמוד.";
      card.querySelector(".caption").append(error);
      console.error("Missing or invalid accessory collection:", characterId);
      continue;
    }

    card.dataset.character = characterId;
    const name = card.querySelector("h3").textContent;
    const originalAlt = image.alt;
    const stage = document.createElement("div");
    stage.className = "art-stage";
    image.replaceWith(stage);
    stage.append(image);
    const overlay = document.createElementNS(svgNamespace, "svg");
    overlay.setAttribute("viewBox", "0 0 600 800");
    overlay.setAttribute("aria-hidden", "true");
    overlay.classList.add("accessory-overlay");
    stage.append(overlay);

    const controls = document.createElement("fieldset");
    controls.className = "accessory-controls";
    const legend = document.createElement("legend");
    legend.textContent = `האביזרים של ${name}`;
    const options = document.createElement("div");
    options.className = "accessory-options";
    const actions = document.createElement("div");
    actions.className = "accessory-actions";
    const count = document.createElement("p");
    count.className = "accessory-count";
    count.setAttribute("role", "status");
    const poolDescription = document.createElement("p");
    poolDescription.className = "accessory-pool";
    poolDescription.textContent = `חמישה אביזרים אקראיים מתוך אוסף של ${items.length}. ערבוב בוחר שילוב חדש.`;
    const entries = [];
    const selectedNames = () => entries.filter(entry => entry.input.checked).map(entry => entry.item.he);
    function saveCurrent() {
      window.AccessoryStorage.save(characterId, {
        version: 1,
        selectedIds: entries.map(entry => entry.item.id),
        visibleIds: entries.filter(entry => entry.input.checked).map(entry => entry.item.id)
      });
    }
    function update(persist = true) {
      for (const { input, layer } of entries) layer.style.display = input.checked ? "" : "none";
      const selected = selectedNames();
      count.textContent = `מוצגים ${selected.length} מתוך 5: ${selected.length ? selected.join(", ") : "ללא אביזרים נוספים"}.`;
      image.alt = originalAlt + (selected.length ? `. אביזרים נוספים: ${selected.join(", ")}.` : ". ללא אביזרים נוספים.");
      if (persist) saveCurrent();
    }
    function renderSelection(selectedItems, visibleIds = selectedItems.map(item => item.id)) {
      entries.length = 0;
      options.replaceChildren();
      overlay.replaceChildren();
      for (const item of selectedItems) {
        const layer = document.createElementNS(svgNamespace, "g");
        layer.dataset.accessory = item.id;
        // These SVG fragments are authored local assets, never user-provided markup.
        layer.innerHTML = item.svg;
        overlay.append(layer);
        const label = document.createElement("label");
        label.className = "accessory-option";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = visibleIds.includes(item.id);
        input.dataset.accessory = item.id;
        const text = document.createElement("span");
        const english = document.createElement("bdi");
        english.lang = "en";
        english.dir = "ltr";
        english.textContent = item.en;
        const hebrew = document.createElement("small");
        hebrew.textContent = item.he;
        text.append(english, hebrew);
        label.append(input, text);
        options.append(label);
        entries.push({ item, input, layer });
        input.addEventListener("change", () => update());
      }
      update(false);
    }
    const shuffle = document.createElement("button");
    shuffle.type = "button";
    shuffle.textContent = "ערבוב אביזרים";
    shuffle.dataset.accessoryAction = "shuffle";
    shuffle.addEventListener("click", () => {
      renderSelection(window.AccessorySelection.pick(items, entries.map(entry => entry.item.id)));
      saveCurrent();
    });
    actions.append(shuffle);
    for (const [label, checked] of [["הצגת הכול", true], ["הסתרת הכול", false]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.accessoryAction = checked ? "show" : "hide";
      button.addEventListener("click", () => {
        for (const { input } of entries) input.checked = checked;
        update();
      });
      actions.append(button);
    }
    controls.append(legend, poolDescription, options, actions, count);
    card.querySelector(".caption").append(controls);
    const saved = window.AccessoryStorage.load(characterId, items);
    renderSelection(saved ? saved.selectedIds.map(id => items.find(item => item.id === id)) :
      window.AccessorySelection.pick(items), saved?.visibleIds);
    if (!saved) saveCurrent();

    for (const link of card.querySelectorAll('a[href$=".svg"]')) {
      link.setAttribute("aria-haspopup", "dialog");
      link.addEventListener("click", event => {
        event.preventDefault();
        previewLink = link;
        link.focus();
        previewTitle.textContent = name;
        const selected = selectedNames();
        previewDescription.textContent = selected.length ?
          `אביזרים נוספים: ${selected.join(", ")}.` : "ללא אביזרים נוספים.";
        previewArt.replaceChildren(stage.cloneNode(true));
        preview.showModal();
      });
    }
  }
})();
