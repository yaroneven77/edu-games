"use strict";
(() => {
  const characters = Object.values(window.IllustratedCharacters || {});
  if (characters.length !== 32) {
    const error = document.createElement("p");
    error.className = "error";
    error.setAttribute("role", "alert");
    error.textContent = "לא כל הדמויות החדשות נטענו. בדקו שקובצי האוסף נמצאים לצד הגלריה ורעננו את העמוד.";
    document.querySelector("header").append(error);
    console.error("Expected 32 new gallery characters.", characters.length);
  }
  for (const character of characters) {
    const section = document.querySelector(`[data-category="${character.category.toLowerCase()}"] .pair`);
    if (!section) throw new Error(`Missing gallery category: ${character.category}`);
    const card = document.createElement("article");
    card.className = "sample";
    let paletteLabel = "";
    if (character.category === "Manga") {
      if (!["color", "monochrome"].includes(character.colorMode)) {
        throw new Error(`Missing Manga color mode: ${character.id}`);
      }
      card.dataset.colorMode = character.colorMode;
      paletteLabel = character.colorMode === "color" ? "בצבע" : "בשחור ולבן";
    }
    const link = document.createElement("a");
    link.className = "image-link";
    link.href = `./${character.id}.svg`;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `הגדלת האיור של ${character.nameHe}`);
    const image = document.createElement("img");
    image.src = `./${character.id}.svg`;
    image.width = 600; image.height = 800;
    image.loading = "lazy";
    image.alt = `${character.nameHe}, דמות מקורית בסגנון ${character.category}${paletteLabel ? ` ${paletteLabel}` : ""}`;
    link.append(image);
    const caption = document.createElement("div");
    caption.className = "caption";
    const number = document.createElement("span");
    number.className = "number";
    number.textContent = `${character.id.toUpperCase()} · חדש${paletteLabel ? ` · ${paletteLabel}` : ""}`;
    const name = document.createElement("h3");
    name.textContent = character.nameHe;
    const english = document.createElement("p");
    english.className = "english"; english.lang = "en"; english.dir = "ltr";
    english.textContent = character.nameEn;
    const description = document.createElement("p");
    description.textContent = character.descriptionHe || "דמות חדשה בשכבות גוף ולבוש נפרדות, עם אוסף אביזרים משלה.";
    caption.append(number, name, english, description);
    card.append(link, caption);
    section.append(card);
  }
  for (const section of document.querySelectorAll("[data-category]")) {
    const count = section.querySelectorAll(".sample").length;
    const colorCount = section.querySelectorAll('[data-color-mode="color"]').length;
    const monochromeCount = section.querySelectorAll('[data-color-mode="monochrome"]').length;
    section.querySelector(".section-head span").textContent = section.dataset.category === "manga" ?
      `${count} דמויות מקוריות · ${colorCount} בצבע · ${monochromeCount} בשחור ולבן` : `${count} דמויות מקוריות`;
  }
})();
