"use strict";
(() => {
  const root = document.getElementById("picture-game");
  const sharedIds = { reset: "new-character", "help-open": "help-open", "mode-description": "game-intro" };
  const $ = id => document.getElementById(sharedIds[id] || `picture-${id}`);
  const ns = "http://www.w3.org/2000/svg";
  const content = window.IllustratedContent;
  const bodyIds = [
    "head", "hair", "forehead", "eyes", "ears", "nose", "cheeks", "mouth", "lips",
    "chin", "jaw", "neck", "shoulders", "chest", "waist", "arms", "elbows", "wrists",
    "hands", "fingers", "legs", "thighs", "knees", "ankles", "feet", "heels"
  ];
  const characters = [
    { id: "superhero-01", nameHe: "מגדלור", nameEn: "Beacon", image: "./picture-art/beacon.png",
      art: window.BeaconDemoArt,
      itemIds: ["costume", "cape", "belt", "boots", "necklace", "armband", "glasses", "ring", "headband", "watch", "bracelet", "earrings"] },
    { id: "superhero-02", nameHe: "פעימה", nameEn: "Pulse", image: "./picture-art/pulse.png",
      art: window.PulseDemoArt,
      itemIds: ["costume", "belt", "boots", "earrings", "glasses", "armband", "badge", "hair-clip", "scarf", "ring", "watch", "bracelet"] }
  ];
  const photoFailures = new Set();
  let failed = false, viewVersion = 0, active = false;
  function error(message) {
    failed = true;
    $("error").textContent = message;
    $("error").hidden = false;
    root.querySelectorAll("button").forEach(button => { button.disabled = true; });
  }
  function validRegions(regions) {
    return Array.isArray(regions) && regions.length && regions.every(r =>
      [r.cx, r.cy, r.rx, r.ry].every(Number.isFinite) && r.rx > 0 && r.ry > 0 &&
      (r.angle === undefined || Number.isFinite(r.angle)));
  }
  for (const entry of characters) {
    entry.ids = [...bodyIds, ...entry.itemIds];
    const artwork = entry.art;
    if (!artwork || !content || !Array.isArray(artwork.layers) || artwork.layers.length !== 38 ||
      artwork.width !== 1024 || artwork.height !== 1536 || new Set(entry.ids).size !== 38 ||
      new Set(artwork.layers.map(layer => layer.id)).size !== 38 ||
      entry.ids.some(id => !artwork.layers.some(layer => layer.id === id && layer.svg && Number.isFinite(layer.order)) ||
        !validRegions(artwork.regions?.[id]) || !validRegions(artwork.photoRegions?.[id]) ||
        !content.vocabulary.some(word => word.id === id))) {
      error(`לא ניתן לטעון את ${entry.nameHe}: חסרים נתוני מילים, ציור או מיקומים. רעננו לאחר תיקון הקבצים.`);
      return;
    }
    entry.words = entry.ids.map(id => content.vocabulary.find(word => word.id === id));
    entry.byId = new Map(entry.words.map(word => [word.id, word]));
    entry.publicWords = Object.freeze(entry.words.map(word => Object.freeze({ id: word.id, canonical: word.canonical })));
  }
  let character = characters[0];
  let { art, ids, words, byId } = character;
  const coveredBody = new Set(["shoulders", "chest", "waist", "arms", "elbows", "legs", "thighs", "knees", "ankles", "feet", "heels"]);
  const fresh = () => ({ learned: new Set(), visited: new Set(), active: bodyIds[0], cache: new Map(), streak: 0, feedback: "", selected: null });
  const states = new Map(characters.map(entry => {
    const explore = fresh();
    explore.visited.add(bodyIds[0]); explore.selected = bodyIds[0];
    return [entry.id, { explore, finish: fresh() }];
  }));
  let mode = "explore";
  const state = () => states.get(character.id)[mode];
  const complete = () => state().learned.size === 38;
  const photograph = () => !photoFailures.has(character.id) && (mode === "explore" || (mode === "finish" && complete()));
  function svgNode(tag, attributes = {}) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }
  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    $("speech-status").textContent = "";
  }
  function speak(word) {
    if (failed || !active || !word) return;
    if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
      $("speech-status").textContent = "השמעה אינה זמינה בדפדפן הזה. אפשר להמשיך ללא קול.";
      return;
    }
    try {
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(word.canonical);
      utterance.lang = "en-GB"; utterance.rate = .82;
      utterance.onerror = event => {
        if (event.error !== "canceled" && event.error !== "interrupted") {
          $("speech-status").textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול.";
        }
      };
      speechSynthesis.speak(utterance);
    } catch (cause) {
      console.warn("Demo pronunciation failed.", cause);
      $("speech-status").textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול.";
    }
  }
  function drawHighlight(id) {
    $("highlight").replaceChildren();
    $("location").textContent = "";
    if (!id) return;
    const regions = (photograph() ? art.photoRegions : art.regions)[id];
    for (const region of regions) {
      $("highlight").append(svgNode("ellipse", {
        cx: region.cx, cy: region.cy, rx: region.rx, ry: region.ry,
        transform: `rotate(${region.angle || 0} ${region.cx} ${region.cy})`, class: "picture-outline"
      }));
    }
    $("location").textContent = `המיקום המסומן: ${byId.get(id).he}`;
    if (coveredBody.has(id) && (photograph() || state().learned.has("costume") || state().learned.has("boots"))) {
      $("location").textContent += ". חלק זה עשוי להיות מכוסה בבגד; הסימון מציין את מיקומו מתחת לבגד.";
    }
  }
  function draw() {
    $("error").hidden = !photoFailures.has(character.id);
    $("error").textContent = photoFailures.has(character.id) ?
      `התמונה של ${character.nameHe} לא נטענה. מוצג הציור הווקטורי במקום. בדקו שהקובץ ${character.image} קיים בתיקיית המשחק.` : "";
    $("drawing").replaceChildren();
    if (photograph()) {
      $("drawing").append(svgNode("image", {
        href: character.image, width: art.width, height: art.height, preserveAspectRatio: "xMidYMid meet"
      }));
    } else {
      const definitions = svgNode("g");
      definitions.innerHTML = art.defs || "";
      $("drawing").append(definitions);
      for (const layer of [...art.layers].sort((a, b) => a.order - b.order)) {
        if (mode !== "explore" && !state().learned.has(layer.id)) continue;
        const group = svgNode("g", { "data-concept": layer.id });
        group.innerHTML = layer.svg;
        $("drawing").append(group);
      }
    }
    $("empty").hidden = mode === "explore" || state().learned.size > 0;
    $("picture-note").textContent = photograph() ? "תמונת המקור שסיפקתם." : "ציור חדש מחלקים עצמאיים, בהשראת תמונת המקור.";
    $("stage").setAttribute("aria-label", photograph() ? `${character.nameHe} בתמונת המקור` : `${character.nameHe} בציור החדש, ${state().learned.size} חלקים שנמצאו`);
    drawHighlight(state().selected);
  }
  function nextHint() {
    const missing = words.filter(word => !state().learned.has(word.id) && word.id !== state().active);
    const fallback = words.find(word => !state().learned.has(word.id));
    state().active = missing.length ? missing[Math.floor(Math.random() * missing.length)].id : fallback?.id || null;
  }
  function renderClues() {
    $("clues").replaceChildren();
    for (const word of words) {
      const item = document.createElement("li"), button = document.createElement("button");
      const found = state().learned.has(word.id);
      button.type = "button"; button.dataset.word = word.id;
      button.setAttribute("aria-pressed", String(state().active === word.id));
      button.disabled = mode !== "explore" && found;
      button.classList.toggle("found", found);
      button.textContent = mode === "explore" ? word.he : (found ? "✓ " : "") + word.hints.beginner.he;
      const version = viewVersion;
      button.addEventListener("click", () => {
        if (failed || version !== viewVersion) return;
        state().active = word.id;
        if (mode === "explore") { state().selected = word.id; state().visited.add(word.id); }
        state().feedback = "";
        render();
        if (mode !== "explore") $("hint-focus").focus({ preventScroll: true });
      });
      item.append(button); $("clues").append(item);
    }
  }
  function renderLearned() {
    $("learned").replaceChildren();
    const learned = mode === "explore" ? state().visited : state().learned;
    $("no-words").hidden = learned.size > 0;
    $("found-title").textContent = mode === "explore" ? "המילים שבדקתם" : "המילים שמצאתם";
    for (const id of learned) {
      const word = byId.get(id), li = document.createElement("li");
      const english = document.createElement("p"), hebrew = document.createElement("p");
      english.className = "en"; english.lang = "en"; english.dir = "ltr"; english.textContent = word.canonical;
      hebrew.textContent = word.he;
      const actions = document.createElement("div"); actions.className = "word-actions";
      const location = document.createElement("button"), audio = document.createElement("button");
      location.type = audio.type = "button";
      location.textContent = "הצגת מיקום"; audio.textContent = "🔊 השמעה";
      location.setAttribute("aria-label", `הצגת המיקום של ${word.he}`);
      audio.setAttribute("aria-label", `השמעת ${word.canonical}`);
      const version = viewVersion;
      location.addEventListener("click", () => {
        if (failed || version !== viewVersion) return;
        state().selected = id; drawHighlight(id);
      });
      audio.addEventListener("click", () => { if (version === viewVersion) speak(word); });
      actions.append(location, audio); li.append(english, hebrew, actions); $("learned").append(li);
    }
  }
  function renderTask() {
    $("explore-task").hidden = mode !== "explore";
    $("spelling-task").hidden = mode === "explore";
    $("task-title").textContent = mode === "explore" ? "מילה, פירוש ומיקום" : "בחרו את האיות הנכון";
    const word = byId.get(state().active);
    $("choices").replaceChildren();
    if (mode === "explore") {
      $("explore-en").textContent = word.canonical; $("explore-he").textContent = word.he;
      return;
    }
    $("another-hint").disabled = !word;
    $("hint").textContent = word ? word.hints.beginner.he : "מצאתם את כל 38 המילים!";
    if (!word) return;
    if (!state().cache.has(word.id)) {
      state().cache.set(word.id, { options: content.spellingOptions(word, words), rejected: new Set() });
    }
    const choices = state().cache.get(word.id), version = viewVersion;
    for (const spelling of choices.options) {
      const button = document.createElement("button");
      button.type = "button"; button.lang = "en"; button.dir = "ltr"; button.textContent = spelling;
      button.disabled = choices.rejected.has(spelling);
      button.classList.toggle("wrong", button.disabled);
      button.addEventListener("click", () => {
        if (failed || version !== viewVersion || state().active !== word.id || state().learned.has(word.id) || choices.rejected.has(spelling)) return;
        if (spelling !== word.canonical) {
          choices.rejected.add(spelling); state().streak = 0;
          state().feedback = "כמעט! האפשרות סומנה באדום ונחסמה. נסו אפשרות אחרת.";
          render();
          $("choices").querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
          return;
        }
        state().learned.add(word.id); state().selected = word.id; state().streak++;
        state().feedback = `נכון! פירוש המילה: ${word.he}. החלק נוסף לציור.`;
        if (state().streak === 3) { state().feedback += " כל הכבוד! שלוש מילים ברצף!"; state().streak = 0; }
        nextHint();
        if (complete()) state().feedback += " הדמות הושלמה — הנה תמונת המקור!";
        render();
        $(complete() ? "reset" : "hint-focus").focus({ preventScroll: true });
      });
      $("choices").append(button);
    }
  }
  function render() {
    viewVersion++;
    $("character-name").textContent = `${character.nameHe} · ${character.nameEn}`;
    $("character-select").value = character.id;
    $("reset").textContent = `מתחילים מחדש עם ${character.nameHe}`;
    $("mode-description").textContent = {
      explore: "לומדים מהתמונה: בוחרים מילה בעברית ורואים את המילה באנגלית ואת מיקומה בתמונה.",
      finish: "בונים וחושפים: מתחילים מציור ריק. לאחר 38 מילים נכונות מופיעה תמונת המקור."
    }[mode];
    const count = mode === "explore" ? state().visited.size : state().learned.size;
    $("progress").textContent = `${count} מתוך 38 מילים ${mode === "explore" ? "נבדקו" : "נמצאו"}`;
    $("progress-bar").value = count;
    $("feedback").textContent = state().feedback;
    draw(); renderClues(); renderLearned(); renderTask();
  }
  function reset() {
    if (failed || !active) return;
    stopSpeech(); states.get(character.id)[mode] = fresh();
    if (mode === "explore") { state().visited.add(state().active); state().selected = state().active; }
    render();
  }
  $("another-hint").addEventListener("click", () => {
    if (failed || !active || mode === "explore" || complete()) return;
    nextHint(); state().feedback = ""; render(); $("hint-focus").focus({ preventScroll: true });
  });
  $("explore-speak").addEventListener("click", () => { if (mode === "explore") speak(byId.get(state().active)); });
  $("explore-next").addEventListener("click", () => {
    if (failed || !active || mode !== "explore") return;
    const unvisited = ids.filter(id => !state().visited.has(id));
    state().active = unvisited[0] || ids[(ids.indexOf(state().active) + 1) % ids.length];
    state().selected = state().active; state().visited.add(state().active); render();
  });
  $("help").addEventListener("close", () => $("help-open").focus());
  for (const entry of characters) {
    const image = new Image();
    image.onerror = () => {
      photoFailures.add(entry.id);
      if (active && character.id === entry.id) render();
    };
    image.src = entry.image;
  }
  function selectCharacter(id) {
    const next = characters.find(entry => entry.id === id);
    if (!next) throw new Error(`Unsupported picture character: ${id}`);
    if (failed || !active || next === character) return;
    stopSpeech();
    character = next;
    ({ art, ids, words, byId } = character);
    render();
  }
  $("character-select").addEventListener("change", () => selectCharacter($("character-select").value));
  window.PictureGame = Object.freeze({
    activate(selected) {
      if (!Object.hasOwn(states.get(character.id), selected)) throw new Error(`Unsupported picture mode: ${selected}`);
      mode = selected; active = true; render();
    },
    deactivate() { active = false; viewVersion++; stopSpeech(); },
    reset,
    selectCharacter,
    openHelp() { $("help").showModal(); },
    getState: () => ({ characterId: character.id, mode, active: state().active, learned: [...state().learned], visited: [...state().visited], photograph: photograph(), complete: complete() }),
    characters: Object.freeze(characters.map(entry => Object.freeze({ id: entry.id, nameHe: entry.nameHe, nameEn: entry.nameEn }))),
    get words() { return character.publicWords; }
  });
})();
