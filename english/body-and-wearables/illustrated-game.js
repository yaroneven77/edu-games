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
    typeof content.buildTargets === "function" && typeof content.targetsForLevel === "function" &&
    typeof content.spellingOptions === "function" && typeof content.playableTargets === "function" &&
    typeof content.availableAccessories === "function", "Missing IllustratedContent API.");
  assert(window.IllustratedCharacters && window.CharacterAccessories && window.IllustratedLayers &&
    typeof window.AccessorySelection?.pick === "function" &&
    typeof window.AccessorySelection?.slotFor === "function", "Missing character or accessory data.");
  assert(typeof window.BeginnerRound?.selectAccessories === "function", "Missing Beginner wardrobe builder.");
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
  const allAliases = aliasMap(content.playableTargets(vocabulary));
  const state = {
    category: "Superhero", characterId: null, level: $("level-select").value, accessories: [], targets: [], fullTargets: [],
    learnedIds: new Set(), activeHintId: null, revealedPositions: new Set(),
    letterClicks: 0, incorrectGuesses: 0, wordShown: false,
    successStreak: 0, bonusIds: new Set(), bonusId: null, previewing: false
  };
  let roundAliases = new Map();
  let fullRoundAliases = new Map();
  let targetById = new Map();
  let spellingAttempt = null;
  let highlightLayer = null;
  let bonusTimer = null;
  let previewTimer = null;
  let previewControls = [];
  let roundVersion = 0;
  let choiceView = null;
  const choiceCache = new Map();
  let typedAccessories = [];
  let beginnerAccessories = null;
  const isBeginner = () => state.level === "beginner";
  const feedback = message => { $("feedback").textContent = message; };
  const choiceFeedback = message => {
    $("choice-feedback").textContent = message;
    if (message) feedback(message);
  };
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
    for (const target of state.fullTargets) {
      assert(layers.has(target.id) || target.accessoryIds.length > 0, `Missing independent piece: ${character.id}/${target.id}`);
    }
    const completed = state.targets.length > 0 && state.learnedIds.size === state.targets.length;
    const svg = svgNode("svg", { viewBox: "0 0 600 800", role: "img",
      "aria-label": completePreview ? `${character.nameHe} · ${character.nameEn}, הצצה לדמות המלאה` :
        completed ? `${character.nameHe} · ${character.nameEn}, כל מילות הסבב נמצאו והדמות הושלמה` :
        `${character.nameHe} · ${character.nameEn}, ${state.learnedIds.size} פריטים שנמצאו`,
      preserveAspectRatio: "xMidYMid meet" });
    // Completion and departing previews reveal allowed layers without extra word credit.
    svg.innerHTML = artwork.defs || "";
    const visibleTargets = completePreview || completed ?
      state.fullTargets.map(target => targetById.get(target.id) || target) :
      state.targets.filter(target => state.learnedIds.has(target.id));
    visibleTargets.sort((a, b) => (layers.get(a.id)?.order ?? 200) - (layers.get(b.id)?.order ?? 200));
    const rearLayers = new Map();
    for (const target of visibleTargets) {
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
    for (const target of visibleTargets) {
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
    for (const target of visibleTargets) {
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
    return !isBeginner() && state.activeHintId !== null && (state.incorrectGuesses >= 3 || state.letterClicks >= 3);
  }
  function canSpeakHint() {
    const word = targetById.get(state.activeHintId);
    const positions = word ? letterPositions(word.canonical) : [];
    return !isBeginner() && positions.length > 0 &&
      positions.filter(index => state.revealedPositions.has(index)).length >= Math.ceil(positions.length / 2);
  }
  function renderLetterHint() {
    $("typing-hints").hidden = isBeginner();
    if (isBeginner()) {
      for (const id of ["hint-letter", "hint-random-letter", "hint-show-word", "hint-speak"]) {
        $(id).hidden = true;
        $(id).disabled = true;
      }
      $("first-letter").hidden = true;
      $("first-letter").textContent = "";
      return;
    }
    $("hint-letter").hidden = false;
    $("hint-random-letter").hidden = false;
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
    $("hint-speak").hidden = !canSpeakHint();
    $("hint-speak").disabled = broken || state.previewing || !canSpeakHint();
  }
  function displayHint() {
    const word = targetById.get(state.activeHintId);
    $("hint-box").hidden = !word;
    $("hint-he").textContent = word ? word.hints[state.level].he : "";
    renderLetterHint();
    renderChoices();
    updateSelectedClue();
  }
  function renderChoices() {
    choiceView = null;
    $("spelling-choices").replaceChildren();
    const word = targetById.get(state.activeHintId);
    $("choice-task").hidden = !isBeginner() || !word;
    if (!isBeginner() || !word || state.learnedIds.has(word.id)) return;
    if (!choiceCache.has(word.id)) {
      try {
        choiceCache.set(word.id, {
          options: content.spellingOptions(word, state.fullTargets),
          rejected: new Set()
        });
      } catch (error) {
        showError(error.message);
        return;
      }
    }
    const view = {};
    choiceView = view;
    const choices = choiceCache.get(word.id);
    for (const option of choices.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.lang = "en";
      button.dir = "ltr";
      button.textContent = option;
      button.classList.toggle("incorrect", choices.rejected.has(option));
      button.disabled = broken || state.previewing || choices.rejected.has(option);
      button.addEventListener("click", () => {
        if (broken || state.previewing || !isBeginner() || choiceView !== view ||
          state.activeHintId !== word.id || state.learnedIds.has(word.id) || choices.rejected.has(option)) return;
        if (option !== word.canonical) {
          choices.rejected.add(option);
          button.classList.add("incorrect");
          button.disabled = true;
          state.successStreak = 0;
          renderStreak();
          choiceFeedback("כמעט! האפשרות השגויה סומנה באדום ואי אפשר לבחור בה שוב. נסו אפשרות אחרת.");
          const next = [...$("spelling-choices").querySelectorAll("button")].find(option => !option.disabled);
          next?.focus({ preventScroll: true });
          return;
        }
        acceptTarget(word);
      });
      $("spelling-choices").append(button);
    }
  }
  function setHint(id) {
    if (id !== state.activeHintId) {
      state.revealedPositions.clear();
      state.letterClicks = 0;
      state.incorrectGuesses = 0;
      state.wordShown = false;
      $("hint-speech-status").textContent = "";
      choiceFeedback("");
    }
    state.activeHintId = id;
    displayHint();
  }
  function selectAvailableHint() {
    const unfound = state.targets.filter(target => !state.learnedIds.has(target.id));
    if (!unfound.length) { setHint(null); return false; }
    const alternatives = unfound.filter(target => target.id !== state.activeHintId);
    const available = alternatives.length ? alternatives : unfound;
    const preferred = available.filter(target => levels.indexOf(target.suggestedLevel) <= levels.indexOf(state.level));
    setHint(choose(preferred.length ? preferred : available).id);
    return true;
  }
  function revealLetter(random) {
    if (broken || state.previewing || isBeginner()) return;
    const word = targetById.get(state.activeHintId);
    if (!word) return;
    const remaining = letterPositions(word.canonical).filter(index => !state.revealedPositions.has(index));
    if (!remaining.length) return;
    state.revealedPositions.add(random ? choose(remaining) : remaining[0]);
    state.letterClicks++;
    renderLetterHint();
  }
  function speak(word, status = $("speech-status")) {
    if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
      status.textContent = "השמעה אינה זמינה בדפדפן הזה. אפשר להמשיך ללא קול.";
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(word.canonical);
      utterance.lang = "en-GB";
      utterance.rate = .82;
      status.textContent = "";
      utterance.onerror = () => { status.textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול."; };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("English speech could not start.", error);
      status.textContent = "לא ניתן להשמיע כרגע. אפשר להמשיך ללא קול.";
    }
  }
  function renderClues() {
    const version = roundVersion;
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
        if (broken || state.previewing || version !== roundVersion || state.learnedIds.has(target.id)) return;
        setHint(target.id);
        if (spellingAttempt?.id === target.id) {
          state.incorrectGuesses = Math.max(state.incorrectGuesses, spellingAttempt.count);
          renderLetterHint();
        }
        feedback(isBeginner() ? "בחרו את האיות הנכון מבין ארבע האפשרויות של הרמז." :
          "הרמז שבחרתם מוצג כעת באזור העזרה. אפשר לחשוף אותיות ולכתוב את התשובה בתיבה.");
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
      speech.setAttribute("aria-describedby", "speech-status");
      speech.disabled = broken || state.previewing;
      speech.addEventListener("click", () => {
        if (!broken && !state.previewing && state.learnedIds.has(target.id) &&
          targetById.get(target.id) === target) speak(target);
      });
      actions.append(location, speech); card.append(word, meaning, actions);
      $("learned-words").append(card);
    }
  }
  function resolve(value) {
    const key = normalize(value);
    return roundAliases.get(key) || fullRoundAliases.get(key) || allAliases.get(key) || null;
  }
  function renderStreak() {
    $("bonus-streak").textContent = state.learnedIds.size === state.targets.length ?
      "כל המילים נמצאו — עבודה נהדרת!" :
        `רצף ${isBeginner() ? "למחמאה" : "לבונוס"}: ${state.successStreak} מתוך 3 מילים חדשות`;
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
    if (restoreFocus) $(isBeginner() ? "assist" : "word-input").focus();
  }
  function rewardStreak() {
    if (state.successStreak < 3) return;
    state.successStreak = 0;
    if (isBeginner()) {
      choiceFeedback(`${$("choice-feedback").textContent} 🎉 כל הכבוד! בחרתם נכון 3 מילים חדשות ברצף — אלופים!`);
      return;
    }
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
    if (broken || state.previewing || isBeginner()) return;
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
      if (fullRoundAliases.has(value) || allAliases.has(value)) {
        spellingAttempt = null;
        feedback(fullRoundAliases.has(value) ?
          "האיות נכון, אבל המילה הזאת אינה נכללת ברמת המשחק הנוכחית. בקשו רמז למילה שמתאימה לרמה." :
          "האיות נכון, אבל הפריט הזה אינו באוסף האפשרויות של הדמות בסבב הזה. נסו חלק גוף או בקשו רמז לפריט מתאים.");
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
    acceptTarget(target);
  }
  function acceptTarget(target) {
    if (broken || state.previewing || !targetById.has(target.id)) return;
    const known = state.learnedIds.has(target.id);
    if (isBeginner() && known) return;
    spellingAttempt = null;
    const bonusAnswer = state.bonusIds.has(target.id);
    state.learnedIds.add(target.id);
    if (state.activeHintId === target.id) setHint(null);
    renderCharacter(window.IllustratedCharacters[state.characterId]);
    renderLearned();
    showLocation(target);
    feedback(known ? "נכון! המילה כבר באוסף ונספרת פעם אחת. המיקום סומן שוב." :
      state.learnedIds.size === state.targets.length ? "מצאתם את כל המילים בסבב והדמות הושלמה! אפשר לבחור דמות חדשה." :
        bonusAnswer ? "נהדר! מילת הבונוס נוספה לדמות. עכשיו ממשיכים לגלות מילים חדשות — אתם אלופים!" :
        "נכון! רק החלק או הפריט שמצאתם נוסף לציור, והמילה והפירוש נוספו לאוסף.");
    if (isBeginner()) {
      selectAvailableHint();
      choiceFeedback(state.learnedIds.size === state.targets.length ?
        `נכון! פירוש המילה: ${target.he}. מצאתם את כל מילות הסבב והדמות הושלמה! אפשר לבחור דמות חדשה.` :
        `נכון! פירוש המילה: ${target.he}. המילה והפירוש נוספו לאוסף, והחלק נוסף לציור. נבחר רמז חדש כדי להמשיך.`);
    } else {
      $("word-input").value = "";
    }
    if (!known && !bonusAnswer) {
      state.successStreak++;
      rewardStreak();
    }
    renderStreak();
    $(isBeginner() ? (state.learnedIds.size === state.targets.length ? "new-character" : "hint-box") : "word-input").focus({ preventScroll: true });
  }
  function showLevelSuggestion() {
    const text = {
      beginner: "מתחילים: בוחרים איות נכון מארבע אפשרויות. בכל דמות 38 מילים: 26 חלקי גוף ו־12 בגדים ואביזרים. כל שלוש הצלחות ברצף מזכות במחמאה בלבד.",
      intermediate: "ממשיכים: מקלידים מילים מרשימה בסיסית — 18 חלקי גוף ופריטים בסיסיים זמינים, עם רמזי ביניים ובונוס מילת מתנה.",
      advanced: "מתקדמים: מקלידים מתוך 26 חלקי הגוף וכל פריטי הסבב המותרים, עם הרמזים המאתגרים ובונוס מילת מתנה."
    };
    $("level-suggestion").textContent = text[state.level] +
      (isBeginner() ? "" : " מספר המילים משתנה לפי הדמות והאביזרים.");
  }
  function renderMode() {
    const beginner = isBeginner();
    $("word-form").hidden = beginner;
    $("word-form").querySelectorAll("input, button").forEach(control => { control.disabled = beginner; });
    $("choice-feedback").hidden = !beginner;
    $("play-title").textContent = beginner ? "בחרו רמז ואת האיות הנכון" : "איזה חלק נוסיף?";
    $("game-intro").textContent = "בוחרים סגנון והמשחק מגריל דמות. הבמה מתחילה ריקה. " +
      (beginner ? "מוצאים 38 מילים: 26 חלקי גוף ו־12 בגדים ואביזרים. בחרו רמז בעברית ואת האיות הנכון מארבע אפשרויות — אין צורך להקליד." :
        "לדמות נבחרים חמישה אביזרים אפשריים. כתבו חלק גוף, בגד או אביזר באנגלית. רק החלק שכתבתם נכון יופיע — בכל סדר.");
    $("empty-collection").textContent = beginner ? "בחרו איות נכון כדי לגלות כאן את המילה והפירוש." :
      "כתבו מילה נכונה כדי לגלות כאן את האיות והפירוש.";
    $("empty-canvas-instruction").textContent = beginner ? "בחרו רמז ואת האיות הנכון, ורק החלק שלו יופיע כאן." :
      "כתבו מילה באנגלית, ורק החלק שלה יופיע כאן.";
    $("clue-instruction").textContent = beginner ?
      "בחרו רמז שעדיין לא פתרתם, ואז לחצו על האיות הנכון מבין ארבע האפשרויות באזור העזרה. אפשר גם לבקש רמז אקראי. רמז שנפתר מסומן בקו ובסימן ✓, עם המילה באנגלית והפירוש בעברית." :
      "לחצו על רמז שעוד לא פתרתם כדי לפתוח אותו באזור העזרה ולחשוף אותיות, ואז כתבו את המילה באנגלית. רמזים למילים שמצאתם מסומנים בקו ובסימן ✓, עם המילה באנגלית והפירוש בעברית.";
    $("input-help").textContent = beginner ?
      "בוחרים רמז ואת האיות הנכון מארבע אפשרויות: מילה נכונה ושלוש טעויות איות שלה. אחרי תשובה נכונה נבחר אוטומטית רמז למילה שעוד לא מצאתם. אין תיבת כתיבה. תשובה שגויה לא מוסיפה ציור; אפשר לנסות שוב. כל שלוש מילים חדשות ברצף מזכות במחמאה בלבד." :
      "המילים המתאימות לרמה ולדמות מופיעות בפאנל כל הרמזים. אם יש טעות באיות, לחצו על רמז כדי לקבל עזרה למילה שניסיתם לכתוב. לרמז למילה אחרת, נקו את תיבת הכתיבה. רק תשובה נכונה מוסיפה את החלק עצמו ואת כרטיס המילה.";
    $("hint-help-text").textContent = beginner ?
      "בחרו רמז בעברית מרשימת הרמזים או מכפתור הרמז האקראי. מבין ארבע האפשרויות באנגלית, רק אחת מאויתת נכון. שלוש האחרות הן טעויות איות של אותה מילה. לחצו על האיות הנכון; אין צורך להקליד ואין רמזי אותיות או השמעה של התשובה לפני שמצאתם אותה. אפשר לשמוע מילים שכבר מצאתם בפאנל המילים שמצאתם. אחרי טעות אפשר לנסות שוב באותן אפשרויות." :
      "האותיות שנחשפו נשמרות. כשנחשפת לפחות מחצית מהאותיות, ללא רווחים ומקפים, אפשר לשמוע את המילה באנגלית. אחרי שלושה ניסיונות איות שלא התקבלו או שלוש חשיפות אות, אפשר להציג את המילה. השמעה והצגת המילה אינן מוסיפות ציור או ניקוד — עדיין צריך להקליד אותה בעצמכם. אפשר תמיד לענות במילה אחרת.";
    $("round-bonus-help").textContent = beginner ?
      "כל 3 מילים חדשות ברצף מזכות במחמאה בלבד, בלי מילת מתנה ובלי חשיפת תשובה נוספת. טעות באיות מתחילה רצף חדש; רמזים תמיד מותר!" :
      "כל 3 מילים חדשות ברצף מזכות במילת מתנה בתיבה. לחצו על בדיקה כדי להוסיף אותה. תשובה שלא מתקבלת מתחילה רצף חדש. מילים שכבר נמצאו ומילות בונוס לא נספרות ברצף; עזרה ורמזים תמיד מותר!";
    $("assist").textContent = beginner ? "💡 בחרו לי רמז נוסף" : "💡 רמז למילה נוספת";
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
      $(isBeginner() ? "assist" : "word-input").focus({ preventScroll: true });
    }, 3000);
  }
  function startRound(reuseCharacter = false) {
    assert(!broken, "Reload the page after fixing the reported error.");
    assert(levels.includes(state.level), `Unsupported level: ${state.level}`);
    finishPreview();
    roundVersion++;
    choiceView = null;
    choiceCache.clear();
    const category = $("category-select").value;
    const pool = characters.filter(character => character.category === category);
    const alternatives = pool.filter(character => character.id !== state.characterId);
    const character = reuseCharacter ? window.IllustratedCharacters[state.characterId] :
      choose(alternatives.length ? alternatives : pool);
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
    const available = content.availableAccessories(character, accessories);
    assert(available.length >= 5 && new Set(available.map(window.AccessorySelection.slotFor)).size >= 5,
      `Not enough allowed compatible accessories: ${character.id}`);
    if (!reuseCharacter) {
      typedAccessories = available.length === 5 ? [...available] : window.AccessorySelection.pick(available);
      beginnerAccessories = null;
    }
    if (isBeginner() && !beginnerAccessories) {
      try {
        beginnerAccessories = window.BeginnerRound.selectAccessories(character, accessories);
      } catch (error) {
        showError(error.message);
        throw error;
      }
    }
    const selected = isBeginner() ? beginnerAccessories : typedAccessories;
    assert(selected.length > 0 && new Set(selected.map(item => item.id)).size === selected.length &&
      (isBeginner() || selected.length === 5), "Invalid round accessory selection.");
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
    state.fullTargets = content.playableTargets(builtTargets);
    fullRoundAliases = aliasMap(state.fullTargets);
    state.targets = content.targetsForLevel(builtTargets, state.level)
      .map(target => ({ ...target, regions: [...target.regions], accessoryIds: [...target.accessoryIds] }));
    assert(!isBeginner() || (state.targets.filter(target => target.category === "body").length === 26 &&
      state.targets.filter(target => target.category !== "body").length === 12),
    `Beginner requires 26 body parts and 12 clothing/accessory words: ${character.id}`);
    targetById = new Map(state.targets.map(target => [target.id, target]));
    roundAliases = aliasMap(state.targets);
    state.learnedIds.clear();
    state.successStreak = 0;
    state.bonusIds.clear();
    clearBonusNotice();
    spellingAttempt = null;
    renderMode();
    setHint(null);
    choiceFeedback("");
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
    showLevelSuggestion();
    if (isBeginner()) selectAvailableHint();
    feedback(isBeginner() ? "הבמה ריקה. הרמז הראשון כבר נבחר — בחרו את האיות הנכון מבין ארבע האפשרויות!" :
      "הבמה ריקה. כתבו חלק גוף, בגד או אביזר כדי להוסיף אותו. אפשר להתחיל בכל סדר!");
  }
  $("word-form").addEventListener("submit", submit);
  $("word-input").addEventListener("input", clearBonusNotice);
  $("help-open").addEventListener("click", () => $("help-dialog").showModal());
  $("help-dialog").addEventListener("close", () => $("help-open").focus());
  $("hint-help-open").addEventListener("click", () => $("hint-help-dialog").showModal());
  $("hint-help-dialog").addEventListener("close", () => $("hint-help-open").focus());
  $("round-info-open").addEventListener("click", () => $("round-info-dialog").showModal());
  $("round-info-dialog").addEventListener("close", () => $("round-info-open").focus());
  $("bonus-close").addEventListener("click", dismissBonusPopup);
  $("new-character").addEventListener("click", previewNextCharacter);
  $("category-select").addEventListener("change", () => {
    if (broken || state.previewing) { $("category-select").value = state.category; return; }
    startRound();
  });
  $("level-select").addEventListener("change", () => {
    if (broken) return;
    if (state.previewing) { $("level-select").value = state.level; return; }
    const level = $("level-select").value;
    assert(levels.includes(level), `Unsupported level: ${level}`);
    if (level === state.level) return;
    state.level = level;
    startRound(true);
    feedback("רמת המשחק השתנתה. מתחילים מחדש עם אותה דמות ועם המילים והאביזרים המתאימים לרמה שבחרתם.");
  });
  $("assist").addEventListener("click", () => {
    if (broken || state.previewing) return;
    const value = isBeginner() ? "" : normalize($("word-input").value);
    const spellingId = isBeginner() ? null : spellingTarget(value);
    if (spellingId) {
      setHint(spellingId);
      if (spellingAttempt?.id === spellingId) {
        state.incorrectGuesses = Math.max(state.incorrectGuesses, spellingAttempt.count);
        renderLetterHint();
      }
      feedback("הרמז בעברית מתייחס למילה שאולי ניסיתם לכתוב. אפשר לחשוף אותיות כדי לתקן את האיות. למילה אחרת, נקו את תיבת הכתיבה.");
      return;
    }
    if (!selectAvailableHint()) { feedback("כל מילות הסבב כבר באוסף! אפשר לבחור דמות חדשה."); return; }
    feedback(isBeginner() ? "בחרו את האיות הנכון מבין ארבע האפשרויות של הרמז." : value && !resolve(value) ?
      "לא ברור לאיזו מילה התכוונתם, אז נפתח רמז למילה אחרת. אפשר לתקן את מה שכתבתם ולבקש שוב רמז." :
      "נפתח רמז בעברית למילה שעוד לא מצאתם. אפשר לחשוף אותיות או לענות במילה אחרת.");
    if (isBeginner()) {
      $("hint-box").focus({ preventScroll: true });
      $("hint-box").scrollIntoView({ block: "center", behavior: "instant" });
    }
  });
  $("hint-letter").addEventListener("click", () => revealLetter(false));
  $("hint-random-letter").addEventListener("click", () => revealLetter(true));
  $("hint-speak").addEventListener("click", () => {
    if (broken || state.previewing || !canSpeakHint()) return;
    speak(targetById.get(state.activeHintId), $("hint-speech-status"));
  });
  $("hint-show-word").addEventListener("click", () => {
    if (broken || state.previewing || !canShowWord() || state.wordShown) return;
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
    fullTargetIds: state.fullTargets.map(target => target.id),
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
  startRound();
})();
