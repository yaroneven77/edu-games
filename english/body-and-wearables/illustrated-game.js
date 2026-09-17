"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const levels = ["beginner", "intermediate", "advanced"];
  const categories = ["Anime", "Superhero", "Cartoon", "Manga"];
  const ns = "http://www.w3.org/2000/svg";
  let broken = false;
  function showError(message) {
    broken = true;
    $("load-error").textContent = `לא ניתן להציג את המשחק: ${message} יש לבדוק שקובצי המשחק קיימים ולרענן את הדף.`;
    $("load-error").hidden = false;
    $("character-stage").hidden = true;
    document.querySelectorAll("#word-form input, #word-form button, #assist, #hint-box button, #all-clues button, #category-select, #new-character, #level-select").forEach(node => { node.disabled = true; });
    $("feedback").textContent = "המשחק אינו זמין עד לתיקון שגיאת הטעינה.";
  }
  function assert(condition, message) {
    if (!condition) {
      showError(message);
      throw new Error(message);
    }
  }
  const content = window.IllustratedContent;
  assert(content && Array.isArray(content.vocabulary) && typeof content.normalize === "function" &&
    typeof content.buildTargets === "function", "Missing IllustratedContent API.");
  assert(window.IllustratedCharacters && window.CharacterAccessories && window.IllustratedLayers &&
    typeof window.AccessorySelection?.pick === "function", "Missing character or accessory data.");
  const characters = Object.values(window.IllustratedCharacters);
  const vocabulary = content.vocabulary;
  const normalize = content.normalize;
  const byId = new Map(vocabulary.map(word => [word.id, word]));
  assert(byId.size === vocabulary.length, "Duplicate vocabulary IDs.");
  assert(characters.length === 40 && categories.every(category =>
    characters.filter(character => character.category === category).length === 10), "Expected ten characters in each of four categories.");
  for (const word of vocabulary) {
    assert(word.id && word.canonical && word.he && Array.isArray(word.acceptedForms) &&
      word.acceptedForms.some(form => normalize(form) === normalize(word.canonical)) &&
      levels.includes(word.suggestedLevel) && levels.every(level => word.hints?.[level]?.en && word.hints[level].he),
    `Incomplete vocabulary: ${word.id}`);
  }
  function aliasMap(words) {
    const map = new Map();
    for (const word of words) {
      for (const form of [word.canonical, ...word.acceptedForms]) {
        const key = normalize(form);
        assert(!map.has(key) || map.get(key).id === word.id, `Ambiguous spelling: ${key}`);
        map.set(key, word);
      }
    }
    return map;
  }
  const allAliases = aliasMap(vocabulary);
  const state = {
    category: "Superhero", characterId: null, level: "beginner", accessories: [], targets: [],
    learnedIds: new Set(), activeHintId: null, revealedPositions: new Set(),
    letterClicks: 0, incorrectGuesses: 0, wordShown: false,
    successStreak: 0, bonusIds: new Set(), bonusId: null, previewing: false
  };
  let roundAliases = new Map();
  let targetById = new Map();
  let spellingAttempt = null;
  let highlightLayer = null;
  let bonusTimer = null;
  let previewTimer = null;
  let previewControls = [];
  const feedback = message => { $("feedback").textContent = message; };
  const choose = items => items[Math.floor(Math.random() * items.length)];
  const validEllipse = region => region && ["cx", "cy", "rx", "ry"].every(key => Number.isFinite(region[key])) &&
    region.rx > 0 && region.ry > 0 && (region.angle === undefined || Number.isFinite(region.angle));
  function svgNode(tag, attributes = {}) {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  }
  function renderCharacter(character, completePreview = false) {
    const artwork = window.IllustratedLayers[character.id];
    assert(artwork && Array.isArray(artwork.layers), `Missing independent artwork: ${character.id}`);
    const layers = new Map(artwork.layers.map(layer => [layer.id, layer]));
    assert(layers.size === artwork.layers.length, `Duplicate artwork layer: ${character.id}`);
    for (const target of state.targets) {
      assert(layers.has(target.id) || target.accessoryIds.length > 0, `Missing independent piece: ${character.id}/${target.id}`);
    }
    const svg = svgNode("svg", { viewBox: "0 0 600 800", role: "img",
      "aria-label": completePreview ? `${character.nameHe} · ${character.nameEn}, הצצה לדמות המלאה` :
        `${character.nameHe} · ${character.nameEn}, ${state.learnedIds.size} פריטים שנכתבו`,
      preserveAspectRatio: "xMidYMid meet" });
    // A departing-round preview may show all fragments without granting learned-word credit.
    svg.innerHTML = artwork.defs || "";
    const learnedTargets = state.targets.filter(target => completePreview || state.learnedIds.has(target.id));
    learnedTargets.sort((a, b) => (layers.get(a.id)?.order ?? 200) - (layers.get(b.id)?.order ?? 200));
    const rearLayers = new Map();
    for (const target of learnedTargets) {
      for (const accessoryId of target.accessoryIds) {
        const item = state.accessories.find(accessory => accessory.id === accessoryId);
        assert(item, `Missing earned accessory: ${accessoryId}`);
        if (!item.rearSvg) continue;
        const rear = svgNode("g", { "data-accessory-rear": item.id, "aria-hidden": "true" });
        rear.innerHTML = item.rearSvg;
        svg.append(rear);
        rearLayers.set(item.id, rear);
      }
    }
    for (const target of learnedTargets) {
      const group = svgNode("g", { "data-concept": target.id, "aria-hidden": "true" });
      if (layers.has(target.id)) group.innerHTML = layers.get(target.id).svg;
      for (const accessoryId of target.accessoryIds) {
        const item = state.accessories.find(accessory => accessory.id === accessoryId);
        assert(item, `Missing earned accessory: ${accessoryId}`);
        const accessoryGroup = svgNode("g", { "data-accessory": item.id });
        accessoryGroup.innerHTML = item.svg;
        group.append(accessoryGroup);
      }
      svg.append(group);
    }
    highlightLayer = svgNode("g", { "aria-hidden": "true", "pointer-events": "none", "data-highlight": "" });
    svg.append(highlightLayer);
    $("character-stage").replaceChildren(svg);
    $("empty-canvas").hidden = completePreview || state.learnedIds.size > 0;
    for (const target of learnedTargets) {
      target.renderRegions = [...target.regions];
      const group = [...svg.children].find(node => node.dataset.concept === target.id);
      const accessoryGroups = [...group.querySelectorAll("[data-accessory]"),
        ...target.accessoryIds.map(id => rearLayers.get(id)).filter(Boolean)];
      for (const accessoryGroup of accessoryGroups) {
        const box = accessoryGroup.getBBox();
        assert(box.width > 0 && box.height > 0, `Empty accessory artwork: ${accessoryGroup.dataset.accessory}`);
        target.renderRegions.push({ cx: box.x + box.width / 2, cy: box.y + box.height / 2,
          rx: box.width / 2 + 4, ry: box.height / 2 + 4, angle: 0 });
      }
      assert(target.renderRegions.length > 0 && target.renderRegions.every(validEllipse), `Missing target location: ${target.id}`);
    }
  }
  function showLocation(target) {
    if (broken || state.previewing || !state.learnedIds.has(target.id)) return;
    highlightLayer.replaceChildren();
    highlightLayer.dataset.highlight = target.id;
    for (const region of target.renderRegions) {
      for (const front of [false, true]) {
        highlightLayer.append(svgNode("ellipse", {
          cx: region.cx, cy: region.cy, rx: region.rx, ry: region.ry,
          transform: `rotate(${region.angle || 0} ${region.cx} ${region.cy})`,
          class: `location-outline${front ? " front" : ""}`
        }));
      }
    }
    $("location-status").textContent = `מסומן כעת: ${target.he} · ${target.canonical}.`;
  }
  function letterPositions(word) {
    return [...word].flatMap((letter, index) => /[a-z]/i.test(letter) ? [index] : []);
  }
  function canShowWord() {
    return state.activeHintId !== null && (state.incorrectGuesses >= 3 || state.letterClicks >= 3);
  }
  function renderLetterHint() {
    const word = targetById.get(state.activeHintId);
    const positions = word ? letterPositions(word.canonical) : [];
    const next = positions.find(index => !state.revealedPositions.has(index));
    $("hint-letter").disabled = next === undefined;
    $("hint-random-letter").disabled = next === undefined;
    $("hint-letter").textContent = next === undefined ? "כל האותיות נחשפו" : `חשיפת אות ${positions.indexOf(next) + 1} מתוך ${positions.length}`;
    $("first-letter").hidden = !word || (!state.wordShown && state.revealedPositions.size === 0);
    $("first-letter").textContent = !word ? "" : state.wordShown ? word.canonical :
      [...word.canonical].map((letter, index) => /[a-z]/i.test(letter) && !state.revealedPositions.has(index) ? "_" : letter).join(" ");
    $("letter-count").textContent = word ? `נחשפו ${state.revealedPositions.size} מתוך ${positions.length} אותיות (ללא רווחים ומקפים)` : "";
    $("hint-attempts").textContent = word ? `ניסיונות איות שלא התקבלו: ${state.incorrectGuesses} · רמזי אותיות: ${state.letterClicks}` : "";
    $("hint-show-word").hidden = !canShowWord();
    $("hint-show-word").disabled = state.wordShown;
  }
  function displayHint() {
    const word = targetById.get(state.activeHintId);
    $("hint-box").hidden = !word;
    $("hint-he").textContent = word ? word.hints[state.level].he : "";
    renderLetterHint();
    updateSelectedClue();
  }
  function setHint(id) {
    if (id !== state.activeHintId) {
      state.revealedPositions.clear();
      state.letterClicks = 0;
      state.incorrectGuesses = 0;
      state.wordShown = false;
    }
    state.activeHintId = id;
    displayHint();
  }
  function revealLetter(random) {
    if (broken) return;
    const word = targetById.get(state.activeHintId);
    if (!word) return;
    const remaining = letterPositions(word.canonical).filter(index => !state.revealedPositions.has(index));
    if (!remaining.length) return;
    state.revealedPositions.add(random ? choose(remaining) : remaining[0]);
    state.letterClicks++;
    renderLetterHint();
  }
  function speak(word) {
    const status = $("speech-status");
    if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
      status.textContent = "השמעה אינה זמינה בדפדפן הזה. אפשר להמשיך ללא קול.";
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(word.canonical);
      utterance.lang = "en-GB";
      utterance.rate = .82;
      status.textContent = "מכינים השמעה באנגלית…";
      utterance.onend = () => { status.textContent = "ההשמעה הסתיימה."; };
      utterance.onerror = () => { status.textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול."; };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("English speech could not start.", error);
      status.textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול.";
    }
  }
  function renderClues() {
    $("clue-summary").textContent = `${state.learnedIds.size} מתוך ${state.targets.length} רמזים נפתרו`;
    $("clue-progress").max = state.targets.length;
    $("clue-progress").value = state.learnedIds.size;
    $("all-clues").replaceChildren();
    state.targets.forEach((target, index) => {
      const found = state.learnedIds.has(target.id);
      const card = document.createElement("li");
      card.className = `clue-card${found ? " found" : ""}`;
      card.dataset.concept = target.id;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "clue-select";
      button.setAttribute("aria-controls", "hint-box");
      button.disabled = found || broken || state.previewing;
      button.addEventListener("click", () => {
        if (broken || state.previewing || state.learnedIds.has(target.id)) return;
        setHint(target.id);
        if (spellingAttempt?.id === target.id) {
          state.incorrectGuesses = Math.max(state.incorrectGuesses, spellingAttempt.count);
          renderLetterHint();
        }
        feedback("הרמז שבחרתם מוצג כעת באזור העזרה. אפשר לחשוף אותיות ולכתוב את התשובה בתיבה.");
        $("hint-box").focus({ preventScroll: true });
        $("hint-box").scrollIntoView({ block: "center", behavior: "instant" });
      });
      const marker = document.createElement("span");
      marker.className = "clue-marker";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = found ? "✓" : String(index + 1);
      const text = document.createElement("span");
      text.className = "clue-copy";
      const sentence = document.createElement("span");
      sentence.className = "clue-sentence";
      sentence.lang = "he"; sentence.dir = "rtl";
      sentence.textContent = target.hints[state.level].he;
      const status = document.createElement("span");
      status.className = "clue-status";
      status.textContent = found ? "נמצא!" : "עוד לא נמצא";
      text.append(sentence, status);
      if (found) {
        const answer = document.createElement("span");
        answer.className = "clue-answer";
        const english = document.createElement("span");
        english.className = "en"; english.lang = "en"; english.dir = "ltr";
        english.textContent = target.canonical;
        const hebrew = document.createElement("span");
        hebrew.lang = "he"; hebrew.dir = "rtl";
        hebrew.textContent = target.he;
        answer.append(english, hebrew);
        text.append(answer);
      }
      button.append(marker, text);
      card.append(button);
      $("all-clues").append(card);
    });
    updateSelectedClue();
  }
  function updateSelectedClue() {
    for (const card of $("all-clues").children) {
      const selected = card.dataset.concept === state.activeHintId;
      card.classList.toggle("selected", selected);
      card.querySelector("button").setAttribute("aria-pressed", String(selected));
    }
  }
  function renderLearned() {
    renderClues();
    $("learned-count").textContent = state.learnedIds.size;
    $("target-count").textContent = state.targets.length;
    $("empty-collection").hidden = state.learnedIds.size > 0;
    $("learned-words").replaceChildren();
    for (const id of state.learnedIds) {
      const target = targetById.get(id);
      const card = document.createElement("li");
      card.className = "word-card";
      card.dataset.concept = id;
      const word = document.createElement("p");
      word.className = "en"; word.lang = "en"; word.dir = "ltr"; word.textContent = target.canonical;
      const meaning = document.createElement("p");
      meaning.textContent = target.he;
      const actions = document.createElement("div");
      actions.className = "word-actions";
      const location = document.createElement("button");
      location.type = "button"; location.textContent = "הצגת מיקום";
      location.setAttribute("aria-label", `הצגת המיקום של ${target.he}`);
      location.addEventListener("click", () => showLocation(target));
      const speech = document.createElement("button");
      speech.type = "button"; speech.textContent = "🔊 השמעה";
      speech.setAttribute("aria-label", `השמעת ${target.canonical}`);
      speech.addEventListener("click", () => speak(target));
      actions.append(location, speech); card.append(word, meaning, actions);
      $("learned-words").append(card);
    }
  }
  function resolve(value) {
    const key = normalize(value);
    return roundAliases.get(key) || allAliases.get(key) || null;
  }
  function renderStreak() {
    $("bonus-streak").textContent = state.learnedIds.size === state.targets.length ?
      "כל המילים נמצאו — עבודה נהדרת!" : `רצף לבונוס: ${state.successStreak} מתוך 3 מילים חדשות`;
  }
  function clearBonusNotice() {
    state.bonusId = null;
    dismissBonusPopup();
    $("word-input").classList.remove("bonus-input");
  }
  function dismissBonusPopup() {
    clearTimeout(bonusTimer);
    bonusTimer = null;
    const restoreFocus = document.activeElement === $("bonus-close");
    $("bonus-message").hidden = true;
    if (restoreFocus) $("word-input").focus();
  }
  function rewardStreak() {
    if (state.successStreak < 3) return;
    state.successStreak = 0;
    const missing = state.targets.filter(target => !state.learnedIds.has(target.id));
    if (!missing.length) return;
    const fresh = missing.filter(target => !state.bonusIds.has(target.id));
    const bonus = choose(fresh.length ? fresh : missing);
    state.bonusIds.add(bonus.id);
    state.bonusId = bonus.id;
    $("word-input").value = bonus.canonical;
    $("word-input").classList.add("bonus-input");
    $("bonus-message").hidden = false;
    clearTimeout(bonusTimer);
    bonusTimer = setTimeout(dismissBonusPopup, 4000);
  }
  function spellingDistance(a, b) {
    const distances = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) distances[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      distances[i][j] = Math.min(distances[i - 1][j] + 1, distances[i][j - 1] + 1,
        distances[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        distances[i][j] = Math.min(distances[i][j], distances[i - 2][j - 2] + 1);
      }
    }
    return distances[a.length][b.length];
  }
  function spellingTarget(value) {
    if (resolve(value) || !/^[a-z][a-z -]*$/.test(value) || value.length < 3 || value.length > 32) return null;
    let best = value.length >= 6 ? 2 : 1;
    const candidates = new Set();
    for (const [form, target] of roundAliases) {
      if (state.learnedIds.has(target.id) || Math.abs(form.length - value.length) > best) continue;
      const distance = spellingDistance(value, form);
      if (distance > best) continue;
      if (distance < best) { best = distance; candidates.clear(); }
      candidates.add(target.id);
    }
    // An existing clue can disambiguate equally close spellings, but never overrides a closer match.
    if (candidates.has(state.activeHintId)) return state.activeHintId;
    return candidates.size === 1 ? [...candidates][0] : null;
  }
  function submit(event) {
    event.preventDefault();
    if (broken || state.previewing) return;
    const value = normalize($("word-input").value);
    if (!value) {
      feedback("כתבו מילה באנגלית כדי להוסיף משהו לדמות.");
      $("word-input").focus();
      return;
    }
    clearBonusNotice();
    const target = roundAliases.get(value);
    if (!target) {
      state.successStreak = 0;
      renderStreak();
      if (allAliases.has(value)) {
        spellingAttempt = null;
        feedback("האיות נכון, אבל הפריט הזה אינו באוסף האפשרויות של הדמות בסבב הזה. נסו חלק גוף או בקשו רמז לפריט מתאים.");
      } else {
        const id = spellingTarget(value);
        spellingAttempt = id ? { id, count: spellingAttempt?.id === id ? spellingAttempt.count + 1 : 1 } : null;
        if (state.activeHintId !== null && (!id || id === state.activeHintId)) {
          state.incorrectGuesses++; renderLetterHint();
        }
        feedback("עוד לא מצאנו התאמה. אולי יש טעות קטנה באיות, או שהמילה אינה במילון שלנו. נסו שוב או בקשו רמז.");
      }
      return;
    }
    spellingAttempt = null;
    const known = state.learnedIds.has(target.id);
    const bonusAnswer = state.bonusIds.has(target.id);
    state.learnedIds.add(target.id);
    if (state.activeHintId === target.id) setHint(null);
    renderCharacter(window.IllustratedCharacters[state.characterId]);
    renderLearned();
    showLocation(target);
    feedback(known ? "נכון! המילה כבר באוסף ונספרת פעם אחת. המיקום סומן שוב." :
      state.learnedIds.size === state.targets.length ? "מצאתם את כל המילים בדמות הזאת! אפשר לבחור דמות חדשה." :
        bonusAnswer ? "נהדר! מילת הבונוס נוספה לדמות. עכשיו ממשיכים לגלות מילים חדשות — אתם אלופים!" :
        "נכון! רק החלק או הפריט שכתבתם נוסף לציור, והמילה והפירוש נוספו לאוסף.");
    $("word-input").value = "";
    if (!known && !bonusAnswer) {
      state.successStreak++;
      rewardStreak();
    }
    renderStreak();
    $("word-input").focus();
  }
  function showLevelSuggestion() {
    const text = {
      beginner: "מתחילים: הרמזים מציעים תחילה מילים מוכרות ותיאורים פשוטים.",
      intermediate: "ממשיכים: הרמזים מציעים גם מפרקים, פרטי פנים ואביזרים.",
      advanced: "מתקדמים: הרמזים יכולים להתייחס לכל פרט, גם למיקומים קטנים."
    };
    $("level-suggestion").textContent = `${text[state.level]} בכל רמה כל המילים של הסבב מתקבלות.`;
  }
  function finishPreview() {
    clearTimeout(previewTimer);
    previewTimer = null;
    state.previewing = false;
    $("character-preview").hidden = true;
    for (const [control, disabled] of previewControls) control.disabled = disabled;
    previewControls = [];
  }
  function previewNextCharacter() {
    if (broken || state.previewing) return;
    clearBonusNotice();
    state.previewing = true;
    previewControls = [...document.querySelectorAll("#word-form input, #word-form button, #assist, #hint-box button, #all-clues button, #category-select, #new-character, #level-select, #learned-words button")]
      .map(control => [control, control.disabled]);
    for (const [control] of previewControls) control.disabled = true;
    renderCharacter(window.IllustratedCharacters[state.characterId], true);
    $("character-preview").hidden = false;
    $("location-status").textContent = "";
    feedback("כל הכבוד על התרגול! הצצה לדמות המלאה — בעוד שלוש שניות מתחילים דמות חדשה.");
    $("character-stage").scrollIntoView({ block: "center", behavior: "instant" });
    previewTimer = setTimeout(() => {
      startRound();
      $("word-input").focus({ preventScroll: true });
    }, 3000);
  }
  function startRound() {
    assert(!broken, "Reload the page after fixing the reported error.");
    finishPreview();
    const category = $("category-select").value;
    const pool = characters.filter(character => character.category === category);
    const alternatives = pool.filter(character => character.id !== state.characterId);
    const character = choose(alternatives.length ? alternatives : pool);
    assert(character && character.image && character.nameEn && character.nameHe &&
      character.bodyRegions && Object.keys(character.bodyRegions).length === 27 && Array.isArray(character.outfit),
    `Incomplete character metadata: ${character?.id}`);
    for (const [id, regions] of Object.entries(character.bodyRegions)) {
      assert(byId.has(id) && Array.isArray(regions) && regions.length && regions.every(validEllipse), `Missing body location: ${id}`);
    }
    for (const item of character.outfit) {
      assert(byId.has(item.id) && Array.isArray(item.regions) && item.regions.length &&
        item.regions.every(validEllipse), `Missing outfit location: ${item.id}`);
    }
    const accessories = window.CharacterAccessories[character.id];
    assert(Array.isArray(accessories) && accessories.length === 10 &&
      accessories.every(item => item.id && item.svg), `Missing accessory artwork: ${character.id}`);
    const selected = window.AccessorySelection.pick(accessories);
    assert(selected.length === 5 && new Set(selected.map(item => item.id)).size === 5, "Expected five distinct accessories.");
    const builtTargets = content.buildTargets(character, selected);
    assert(Array.isArray(builtTargets) && builtTargets.length > 0, "No targets were built for this character.");
    assert(new Set(builtTargets.map(target => target.id)).size === builtTargets.length, "Duplicate round targets.");
    for (const target of builtTargets) {
      assert(byId.has(target.id) && Array.isArray(target.regions) && Array.isArray(target.accessoryIds) &&
        target.regions.every(validEllipse), `Incomplete target data: ${target.id}`);
    }
    assert(Object.keys(character.bodyRegions).every(id => builtTargets.some(target => target.id === id)),
      "The round does not include all 27 body locations.");
    assert(character.outfit.every(item => builtTargets.some(target => target.id === item.id)) &&
      selected.every(item => builtTargets.some(target => target.accessoryIds.includes(item.id))), "Missing visible outfit or accessory targets.");
    state.category = category; state.characterId = character.id; state.accessories = selected;
    state.targets = builtTargets.map(target => ({ ...target, regions: [...target.regions], accessoryIds: [...target.accessoryIds] }));
    targetById = new Map(state.targets.map(target => [target.id, target]));
    roundAliases = aliasMap(state.targets);
    state.learnedIds.clear();
    state.successStreak = 0;
    state.bonusIds.clear();
    clearBonusNotice();
    spellingAttempt = null;
    setHint(null);
    $("word-input").value = "";
    $("speech-status").textContent = "";
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.warn("Speech could not be stopped for the new round.", error);
        $("speech-status").textContent = "לא ניתן לעצור את ההשמעה כרגע. אפשר להמשיך במשחק.";
      }
    }
    $("location-status").textContent = "";
    $("character-name").textContent = `${character.nameHe} · ${character.nameEn}`;
    renderCharacter(character);
    renderLearned();
    renderStreak();
    feedback("הבמה ריקה. כתבו חלק גוף, בגד או אביזר כדי להוסיף אותו. אפשר להתחיל בכל סדר!");
  }
  $("word-form").addEventListener("submit", submit);
  $("word-input").addEventListener("input", clearBonusNotice);
  $("help-open").addEventListener("click", () => $("help-dialog").showModal());
  $("help-dialog").addEventListener("close", () => $("help-open").focus());
  $("bonus-close").addEventListener("click", dismissBonusPopup);
  $("new-character").addEventListener("click", previewNextCharacter);
  $("category-select").addEventListener("change", startRound);
  $("level-select").addEventListener("change", () => {
    if (broken) return;
    state.level = $("level-select").value;
    showLevelSuggestion(); displayHint(); renderClues();
    feedback("רמת הרמזים השתנתה. המילים והאותיות שנחשפו נשמרו; כל מילות הסבב עדיין מתקבלות.");
  });
  $("assist").addEventListener("click", () => {
    if (broken) return;
    const value = normalize($("word-input").value);
    const spellingId = spellingTarget(value);
    if (spellingId) {
      setHint(spellingId);
      if (spellingAttempt?.id === spellingId) {
        state.incorrectGuesses = Math.max(state.incorrectGuesses, spellingAttempt.count);
        renderLetterHint();
      }
      feedback("הרמז בעברית מתייחס למילה שאולי ניסיתם לכתוב. אפשר לחשוף אותיות כדי לתקן את האיות. למילה אחרת, נקו את תיבת הכתיבה.");
      return;
    }
    const unfound = state.targets.filter(target => !state.learnedIds.has(target.id));
    if (!unfound.length) { setHint(null); feedback("כל מילות הסבב כבר באוסף! אפשר לבחור דמות חדשה."); return; }
    const alternatives = unfound.filter(target => target.id !== state.activeHintId);
    const available = alternatives.length ? alternatives : unfound;
    const preferred = available.filter(target => levels.indexOf(target.suggestedLevel) <= levels.indexOf(state.level));
    setHint(choose(preferred.length ? preferred : available).id);
    feedback(value && !resolve(value) ?
      "לא ברור לאיזו מילה התכוונתם, אז נפתח רמז למילה אחרת. אפשר לתקן את מה שכתבתם ולבקש שוב רמז." :
      "נפתח רמז בעברית למילה שעוד לא מצאתם. אפשר לחשוף אותיות או לענות במילה אחרת.");
  });
  $("hint-letter").addEventListener("click", () => revealLetter(false));
  $("hint-random-letter").addEventListener("click", () => revealLetter(true));
  $("hint-show-word").addEventListener("click", () => {
    if (broken || !canShowWord() || state.wordShown) return;
    state.wordShown = true;
    letterPositions(targetById.get(state.activeHintId).canonical).forEach(index => state.revealedPositions.add(index));
    displayHint();
    feedback("המילה והרמז בעברית מוצגים לעזרה בלבד. כדי להוסיף כרטיס לאוסף, הקלידו את המילה בעצמכם.");
  });
  function frozenCopy(value) {
    if (Array.isArray(value)) return Object.freeze(value.map(frozenCopy));
    if (value && typeof value === "object") return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, frozenCopy(item)])));
    return value;
  }
  const getState = () => ({
    category: state.category, characterId: state.characterId, level: state.level,
    accessoryIds: state.accessories.map(item => item.id), targets: state.targets.map(target => target.id),
    targetIds: state.targets.map(target => target.id), lastHighlightId: highlightLayer?.dataset.highlight || null,
    learnedIds: [...state.learnedIds], activeHintId: state.activeHintId,
    visibleIds: [...$("character-stage").querySelectorAll("[data-concept]")].map(node => node.dataset.concept),
    previewing: state.previewing,
    successStreak: state.successStreak, bonusIds: [...state.bonusIds], bonusId: state.bonusId,
    hintProgress: { revealedPositions: [...state.revealedPositions].sort((a, b) => a - b),
      letterClicks: state.letterClicks, incorrectGuesses: state.incorrectGuesses, wordShown: state.wordShown }
  });
  Object.defineProperty(window, "IllustratedGame", {
    value: Object.freeze({ characters: frozenCopy(characters), vocabulary: frozenCopy(vocabulary),
      getState, normalize, resolve: value => { const word = resolve(value); return word ? frozenCopy(word) : null; } }),
    writable: false, configurable: false
  });
  showLevelSuggestion();
  startRound();
})();
