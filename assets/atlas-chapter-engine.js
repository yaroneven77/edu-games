(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const islandNumber = Number(document.body.dataset.island);
  const mode = document.body.dataset.atlasMode === "sandbox" ? "sandbox" : "production";
  const config = window.ATLAS_CHAPTERS?.[islandNumber];
  const islandFolders = { 3: "island-three", 4: "island-four", 5: "island-five", 6: "island-six" };
  const artworkHref = mode === "sandbox" ? `../../../atlas-adventure/${islandFolders[islandNumber]}/artwork-prompt.html` : "artwork-prompt.html";
  if (!config) throw new Error(`Missing Atlas chapter configuration for Island ${islandNumber}`);

  const generatedRoot = document.body.dataset.generatedRoot || "../assets/generated/";
  const artworkRoot = document.body.dataset.artworkRoot || generatedRoot;
  const generatedScenes = {
    3: {
      root: `${artworkRoot}ember-archive/`,
      prefix: "ember-archive",
      className: "generated-ember-scene",
      beforeObjects: ["background", "terrain", "building", "props-back"],
      afterObjects: ["props-front", "atmosphere"],
      completeState: "completed",
      objects: [
        ["01-ash-inscription", 123, 674, 139, 165],
        ["02-ember-counter", 374, 609, 137, 165],
        ["03-rune-circuit", 600, 509, 145, 170],
        ["04-gear-shelves", 844, 618, 157, 190],
        ["05-miras-journal", 1096, 534, 150, 165],
        ["06-archive-mosaic", 1349, 623, 144, 180],
        ["07-grammar-seal", 1590, 510, 161, 190],
        ["08-furnace-floor", 1385, 334, 148, 175],
        ["09-master-circuit", 930, 265, 177, 205],
        ["10-memory-furnace", 469, 287, 176, 205]
      ]
    },
    4: {
      root: `${artworkRoot}tidal-observatory/`,
      prefix: "tidal-observatory",
      className: "generated-tidal-scene",
      beforeObjects: ["background", "water", "platforms", "pipes"],
      afterObjects: ["props-front", "atmosphere"],
      completeState: "restored",
      objects: [
        ["01-dock-report", 95, 696, 157, 165],
        ["02-tide-clock", 296, 524, 177, 185],
        ["03-tide-lock", 549, 658, 171, 175],
        ["04-pearl-arrays", 771, 504, 187, 180],
        ["05-diving-log", 1017, 647, 195, 175],
        ["06-moon-fractions", 1256, 502, 176, 185],
        ["07-signal-grammar", 1594, 634, 192, 200],
        ["08-glass-tanks", 1458, 326, 195, 190],
        ["09-deep-tide-lock", 954, 265, 205, 205],
        ["10-moon-telescope", 408, 257, 220, 220]
      ]
    },
    5: {
      root: `${artworkRoot}frostfire-summit/`,
      prefix: "frostfire",
      className: "generated-frostfire-scene",
      beforeObjects: ["background", "terrain", "station", "route"],
      afterObjects: ["props-front", "atmosphere"],
      completeState: "repaired",
      objects: [
        ["01-weather-warning", 88, 595, 170, 170],
        ["02-temperature-grid", 311, 686, 184, 185],
        ["03-thermal-core", 562, 526, 183, 180],
        ["04-supply-ratios", 807, 650, 190, 190],
        ["05-miras-recording", 1043, 518, 181, 175],
        ["06-ice-equations", 1271, 653, 185, 185],
        ["07-warning-beacon", 1588, 524, 205, 205],
        ["08-summit-map", 1408, 331, 180, 180],
        ["09-twin-thermal-core", 930, 260, 215, 215],
        ["10-guardian-gate", 406, 277, 225, 225]
      ]
    },
    6: {
      root: `${artworkRoot}unwritten-isle/`,
      prefix: "unwritten-isle",
      className: "generated-unwritten-scene",
      beforeObjects: ["background", "terrain", "temple", "routes"],
      afterObjects: ["props-front", "atmosphere"],
      initialState: "incomplete",
      completeState: "completed",
      objects: [
        ["01-miras-message", 89, 669, 169, 175],
        ["02-fragment-sum", 311, 513, 184, 185],
        ["03-combined-route", 558, 650, 190, 190],
        ["04-atlas-ratio", 807, 499, 190, 190],
        ["05-guardian-memory", 1057, 650, 190, 190],
        ["06-map-fractions", 1290, 502, 185, 185],
        ["07-final-sentence", 1588, 622, 205, 205],
        ["08-heart-chamber", 1407, 300, 220, 220],
        ["09-atlas-convergence", 925, 244, 225, 225],
        ["10-atlas-heart", 421, 272, 235, 235]
      ]
    }
  };
  const generatedScene = generatedScenes[islandNumber];
  const saveKey = `edu-games-atlas-island-${islandNumber}-${mode}-v1`;
  const randomUint = () => globalThis.crypto?.getRandomValues
    ? crypto.getRandomValues(new Uint32Array(1))[0]
    : Math.floor(Math.random() * 0x100000000);
  const randomBelow = maximum => maximum ? randomUint() % maximum : 0;

  function chooseVariants(previous = {}) {
    return Object.fromEntries(config.challenges.map(challenge => {
      let index = randomBelow(challenge.variants.length);
      if (challenge.variants.length > 1 && index === previous[challenge.id]) {
        index = (index + 1 + randomBelow(challenge.variants.length - 1)) % challenge.variants.length;
      }
      return [challenge.id, index];
    }));
  }

  function fresh(previous = {}) {
    return {
      version: 1,
      nonce: randomUint(),
      variants: chooseVariants(previous),
      started: false,
      step: 0,
      completed: [],
      assisted: [],
      player: { x: 50, y: 73 },
      sound: true,
      reducedMotion: false,
      updatedAt: null
    };
  }

  function load() {
    const base = fresh();
    try {
      const parsed = JSON.parse(localStorage.getItem(saveKey));
      if (parsed?.version !== 1) return base;
      return {
        ...base,
        ...parsed,
        variants: { ...base.variants, ...(parsed.variants || {}) },
        step: Math.min(config.challenges.length, Math.max(0, Number(parsed.step) || 0))
      };
    } catch {
      return base;
    }
  }

  let state = load();
  let active = null;
  let sequence = [];
  let balanceValue = 0;
  let lastFocus = null;
  let audio = null;
  let autoWalkFrame = 0;
  let arrivalTimer = 0;

  function save() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(saveKey, JSON.stringify(state));
      $("save-status").textContent = "Saved on this device.";
    } catch {
      $("save-status").textContent = "Progress could not be saved.";
    }
  }

  function tone(frequency = 520, duration = .08) {
    if (!state.sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.value = .045;
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      oscillator.stop(audio.currentTime + duration);
    } catch {}
  }

  function resolvedChallenge(index = state.step) {
    const base = config.challenges[Math.min(index, config.challenges.length - 1)];
    const variant = base.variants[state.variants[base.id] ?? 0];
    return { ...base, ...variant };
  }

  function sceneMarkup() {
    if (generatedScene) {
      const layer = name => `<img class="generated-scene-layer layer-${name}" src="${generatedScene.root}layers/${generatedScene.prefix}-${name}.webp" alt="">`;
      const objects = generatedScene.objects.map(([name, left, top, width, height], index) =>
        `<img class="generated-scene-object" id="generated-object-${index}" src="${generatedScene.root}objects/${name}-${generatedScene.initialState || "inactive"}.webp" alt="" style="left:${left / 19.2}%;top:${top / 10.8}%;width:${width / 19.2}%;height:${height / 10.8}%">`
      ).join("");
      return `<div class="chapter-scene ${generatedScene.className}">
        ${generatedScene.beforeObjects.map(layer).join("")}
        <div class="generated-scene-objects">${objects}</div>
        ${generatedScene.afterObjects.map(layer).join("")}
      </div>`;
    }
    return `<div class="chapter-scene">${window.ATLAS_ISLAND_SCENES?.[islandNumber] || ""}</div>`;
  }

  function routeMarkup() {
    const points = config.spots.map(spot => `${spot.x},${spot.y}`).join(" ");
    return `<svg class="quest-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}"></polyline></svg>`;
  }

  function buildWorld() {
    $("world").classList.add(`island-${islandNumber}`);
    $("world").innerHTML = `
      <div class="sky-orb" aria-hidden="true"></div><div class="mist one" aria-hidden="true"></div><div class="mist two" aria-hidden="true"></div>
      ${sceneMarkup()}${routeMarkup()}
      <div id="landmarks"></div>
      <div class="quest-pointer" id="quest-pointer" hidden aria-hidden="true">
        <span>Next</span>
        <img class="quest-pointer-base" src="${generatedRoot}marker/quest-marker-base.webp" alt="">
        <img class="quest-pointer-arrow" src="${generatedRoot}marker/quest-marker-arrow.webp" alt="">
      </div>
      <img class="spark" src="${generatedRoot}spark/spark-guiding.webp" alt="">
      <img class="player" id="player" src="${generatedRoot}explorer/explorer-idle.webp" alt="Explorer">
      <div class="controls" aria-label="Explorer movement controls">
        <button class="move" data-move="up" aria-label="Move up"><img src="${generatedRoot}gale-garden/move-up.webp" alt=""></button><button class="move" data-move="left" aria-label="Move left"><img src="${generatedRoot}gale-garden/move-left.webp" alt=""></button><button class="move" data-move="down" aria-label="Move down"><img src="${generatedRoot}gale-garden/move-down.webp" alt=""></button><button class="move" data-move="right" aria-label="Move right"><img src="${generatedRoot}gale-garden/move-right.webp" alt=""></button>
        <button class="move interact" id="interact" type="button">Begin expedition</button>
      </div>
      <div class="objective"><strong>Current objective</strong><span id="objective"></span></div>`;
    config.spots.forEach((spot, index) => {
      const landmark = document.createElement("div");
      landmark.className = `landmark landmark-${config.challenges[index].id}`;
      landmark.id = `landmark-${index}`;
      landmark.innerHTML = `<span class="landmark-number">${index + 1}</span><span class="landmark-icon">${spot.icon}</span>`;
      landmark.style.left = `${spot.x}%`;
      landmark.style.top = `${spot.y}%`;
      landmark.setAttribute("aria-hidden", "true");
      $("landmarks").append(landmark);
      const button = document.createElement("button");
      button.className = "hotspot";
      button.id = `spot-${index}`;
      button.type = "button";
      button.textContent = spot.label;
      button.dataset.step = index + 1;
      button.style.left = `${spot.labelX ?? spot.x}%`;
      button.style.top = `${spot.labelY ?? spot.y + 13}%`;
      button.addEventListener("click", () => {
        if (index === state.step) approachCurrent();
      });
      $("world").append(button);
    });
  }

  function render() {
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
    $("chapter-name").textContent = `Island ${islandNumber} · ${config.title}`;
    $("chapter-heading").textContent = config.title;
    $("spark-message").textContent = !state.started
      ? config.intro
      : state.step >= config.challenges.length
        ? config.completionMessage
        : state.step ? config.challenges[state.step - 1].spark : config.startMessage;
    $("objective").textContent = !state.started
      ? `Talk to Spark and begin ${config.title}.`
      : state.step >= config.challenges.length
        ? "The chapter is complete. Open the expedition map or replay."
        : config.challenges[state.step].objective;
    $("progress-fill").style.width = `${state.completed.length / config.challenges.length * 100}%`;
    $("progress").setAttribute("aria-valuenow", String(state.completed.length));
    $("progress-text").textContent = `${state.completed.length} of ${config.challenges.length} challenges complete`;
    $("quest-list").replaceChildren();
    config.challenges.forEach((challenge, index) => {
      const item = document.createElement("li");
      item.className = state.completed.includes(challenge.id) ? "done" : index === state.step ? "active" : "";
      item.innerHTML = `<span>${state.completed.includes(challenge.id) ? "✓" : index === state.step ? "◆" : "○"}</span><span>${challenge.title}</span>`;
      $("quest-list").append(item);
      const hotspot = $(`spot-${index}`);
      hotspot.classList.toggle("current", state.started && index === state.step);
      hotspot.classList.toggle("done", index < state.step);
      hotspot.classList.toggle("locked", !state.started || index > state.step);
      hotspot.disabled = !state.started || index !== state.step;
      $(`landmark-${index}`).classList.toggle("active", state.started && index === state.step);
      $(`landmark-${index}`).classList.toggle("done", index < state.step);
      $(`landmark-${index}`).classList.toggle("locked", !state.started || index > state.step);
      const generatedObject = $(`generated-object-${index}`);
      if (generatedObject) {
        generatedObject.dataset.progressState = index < state.step ? "completed" : state.started && index === state.step ? "current" : "future";
        const objectState = index < state.step ? generatedScene.completeState : state.started && index === state.step ? "current" : generatedScene.initialState || "inactive";
        const source = `${generatedScene.root}objects/${generatedScene.objects[index][0]}-${objectState}.webp`;
        if (!generatedObject.src.endsWith(source)) generatedObject.src = source;
      }
    });
    const pointer = $("quest-pointer");
    const pointerTarget = state.started && state.step < config.spots.length ? config.spots[state.step] : null;
    pointer.hidden = !pointerTarget;
    if (pointerTarget) {
      pointer.style.left = `${pointerTarget.x}%`;
      pointer.style.top = `${Math.max(10, pointerTarget.y - 20)}%`;
    }
    updatePlayer();
  }

  function updatePlayer() {
    const player = $("player");
    player.style.left = `${state.player.x}%`;
    player.style.top = `${state.player.y}%`;
    const target = state.step < config.spots.length ? config.spots[state.step] : null;
    const distance = target ? Math.hypot(state.player.x - target.x, state.player.y - target.y) : Infinity;
    const near = distance < 12;
    $("interact").textContent = !state.started ? "Begin expedition" : target ? near ? "Interact" : "Auto-walk" : "Complete";
    $("interact").classList.toggle("ready", near);
    $("interact").disabled = state.started && !target;
  }

  function move(dx, dy) {
    if (!state.started) return;
    cancelAnimationFrame(autoWalkFrame);
    autoWalkFrame = 0;
    clearTimeout(arrivalTimer);
    arrivalTimer = 0;
    state.player.x = Math.max(7, Math.min(93, state.player.x + dx * 3));
    state.player.y = Math.max(25, Math.min(78, state.player.y + dy * 3));
    updatePlayer();
    save();
  }

  function approachCurrent() {
    if (!state.started) {
      state.started = true;
      window.AtlasProgress?.recordVisit(islandNumber, config.title);
      save();
      render();
      openInfo(config.title, `<p>${config.opening}</p><p><strong>${config.startMessage}</strong></p><div class="actions"><button class="primary" data-action="close-info" type="button">OK</button></div>`, "New chapter");
      return;
    }
    if (state.step >= config.challenges.length) return;
    const target = config.spots[state.step];
    const destination = { x: target.x, y: Math.min(78, target.y + 9) };
    const distance = Math.hypot(state.player.x - destination.x, state.player.y - destination.y);
    if (distance < 12) {
      openChallenge(state.step);
      return;
    }
    cancelAnimationFrame(autoWalkFrame);
    clearTimeout(arrivalTimer);
    arrivalTimer = 0;
    const start = { ...state.player };
    const startedAt = performance.now();
    const duration = Math.max(1400, distance / .025);
    const step = state.step;
    const frame = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      state.player = {
        x: start.x + (destination.x - start.x) * progress,
        y: start.y + (destination.y - start.y) * progress
      };
      updatePlayer();
      if (progress < 1) {
        autoWalkFrame = requestAnimationFrame(frame);
        return;
      }
      autoWalkFrame = 0;
      save();
      render();
      arrivalTimer = setTimeout(() => {
        arrivalTimer = 0;
        openChallenge(step);
      }, 1000);
    };
    autoWalkFrame = requestAnimationFrame(frame);
  }

  function openChallenge(index) {
    if (index !== state.step) return;
    active = resolvedChallenge(index);
    sequence = [];
    balanceValue = Number(active.start ?? 0);
    lastFocus = document.activeElement;
    $("challenge-label").textContent = `${active.label} · ${active.subject}`;
    $("challenge-title").textContent = active.title;
    $("challenge-story").textContent = active.story;
    $("challenge-hint").textContent = active.hint;
    $("challenge-hint").hidden = true;
    $("challenge-feedback").textContent = "";
    $("challenge-feedback").className = "feedback";
    $("hint-button").hidden = false;
    $("continue-button").hidden = true;
    renderChallenge();
    $("challenge-dialog").showModal();
  }

  function renderChallenge() {
    const box = $("challenge-content");
    box.replaceChildren();
    if (active.passage) {
      const passage = document.createElement("div");
      passage.className = "passage";
      passage.textContent = active.passage;
      box.append(passage);
    }
    const question = document.createElement("h3");
    question.textContent = active.question;
    box.append(question);
    if (active.expression) {
      const expression = document.createElement("div");
      expression.className = "expression";
      expression.textContent = active.expression;
      box.append(expression);
    }
    if (active.type === "choice") {
      const choices = document.createElement("div");
      choices.className = "choices";
      active.choices.forEach(value => {
        const button = document.createElement("button");
        button.className = "choice";
        button.type = "button";
        button.textContent = value;
        button.onclick = () => answerChoice(button, value);
        choices.append(button);
      });
      box.append(choices);
      return;
    }
    if (active.type === "order" || active.type === "sequence" || active.type === "route") {
      renderSequence(box);
      return;
    }
    if (active.type === "balance") renderBalance(box);
  }

  function renderSequence(box) {
    const answer = document.createElement("div");
    answer.className = "token-answer";
    answer.id = "token-answer";
    const bank = document.createElement("div");
    bank.className = "token-bank";
    const available = active.type === "order" ? active.tokens : active.bank;
    available.forEach((value, index) => {
      const button = document.createElement("button");
      button.className = "token";
      button.type = "button";
      button.textContent = value;
      button.dataset.index = index;
      button.onclick = () => {
        if (active.type === "order" && sequence.includes(index)) return;
        sequence.push(active.type === "order" ? index : value);
        drawSequence(bank, answer);
        tone(430, .05);
      };
      bank.append(button);
    });
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = '<button class="secondary" id="clear-sequence" type="button">Clear</button><button class="secondary" id="undo-sequence" type="button">Undo</button><button class="primary" id="check-sequence" type="button">Check</button>';
    box.append(answer, bank, actions);
    $("clear-sequence").onclick = () => { sequence = []; drawSequence(bank, answer); };
    $("undo-sequence").onclick = () => { sequence.pop(); drawSequence(bank, answer); };
    $("check-sequence").onclick = checkSequence;
    drawSequence(bank, answer);
  }

  function drawSequence(bank, answer) {
    answer.replaceChildren();
    [...bank.children].forEach(button => {
      button.hidden = active.type === "order" && sequence.includes(Number(button.dataset.index));
    });
    sequence.forEach(entry => {
      const token = document.createElement("button");
      token.className = "token";
      token.type = "button";
      token.textContent = active.type === "order" ? active.tokens[entry] : entry;
      token.onclick = () => {
        const index = sequence.indexOf(entry);
        if (index >= 0) sequence.splice(index, 1);
        drawSequence(bank, answer);
      };
      answer.append(token);
    });
  }

  function checkSequence() {
    const built = active.type === "order" ? sequence.map(index => active.tokens[index]) : sequence;
    if (JSON.stringify(built) === JSON.stringify(active.answer)) finishChallenge();
    else retry("That sequence is not correct yet. Use Spark's clue and try again.");
  }

  function renderBalance(box) {
    const wrap = document.createElement("div");
    wrap.className = "balance";
    wrap.innerHTML = `<div class="balance-value" id="balance-value"></div><div class="balance-track"><span id="balance-marker"></span></div><div class="actions" id="balance-actions"></div>`;
    box.append(wrap);
    active.moves.forEach(move => {
      const button = document.createElement("button");
      button.className = "token";
      button.type = "button";
      button.textContent = move.label;
      button.onclick = () => {
        balanceValue += move.amount;
        drawBalance();
        tone(move.amount > 0 ? 560 : 320, .06);
      };
      $("balance-actions").append(button);
    });
    const reset = document.createElement("button");
    reset.className = "secondary";
    reset.textContent = "Reset";
    reset.onclick = () => { balanceValue = Number(active.start); drawBalance(); };
    const check = document.createElement("button");
    check.className = "primary";
    check.textContent = "Check level";
    check.onclick = () => balanceValue === active.target ? finishChallenge() : retry("The level has not reached the target yet.");
    $("balance-actions").append(reset, check);
    drawBalance();
  }

  function drawBalance() {
    $("balance-value").textContent = `${balanceValue} ${active.unit || ""}`.trim();
    const minimum = Number(active.minimum ?? Math.min(active.start, active.target) - 5);
    const maximum = Number(active.maximum ?? Math.max(active.start, active.target) + 5);
    const percent = Math.max(0, Math.min(100, (balanceValue - minimum) / (maximum - minimum) * 100));
    $("balance-marker").style.left = `${percent}%`;
  }

  function answerChoice(button, value) {
    if (value === active.answer) {
      button.classList.add("correct");
      finishChallenge();
    } else {
      button.disabled = true;
      button.classList.add("wrong");
      retry();
    }
  }

  function retry(message = "Not yet. Spark opened a clue—try another answer.") {
    state.assisted = [...new Set([...state.assisted, active.id])];
    $("challenge-feedback").textContent = message;
    $("challenge-feedback").className = "feedback try";
    $("challenge-hint").hidden = false;
    $("hint-button").hidden = true;
    tone(180, .12);
    save();
  }

  function finishChallenge() {
    if (state.completed.includes(active.id)) return;
    state.completed.push(active.id);
    state.step = Math.min(config.challenges.length, state.step + 1);
    $("challenge-content").querySelectorAll("button").forEach(button => button.disabled = true);
    $("challenge-feedback").textContent = `Success! ${active.explanation}`;
    $("challenge-feedback").className = "feedback good";
    $("challenge-hint").hidden = true;
    $("hint-button").hidden = true;
    $("continue-button").hidden = false;
    tone(760, .14);
    save();
    render();
  }

  function closeChallenge() {
    $("challenge-dialog").close();
    lastFocus?.focus();
    if (state.step >= config.challenges.length) setTimeout(showCompletion, 180);
  }

  function showCompletion() {
    window.AtlasProgress?.completeIsland(islandNumber, config.title, {
      assisted: state.assisted.length,
      challengeCount: config.challenges.length
    });
    const next = config.next
      ? `<a class="primary" href="${config.next}">Travel to ${config.nextTitle}</a>`
      : `<a class="primary" href="../map/index.html">View the completed Atlas</a>`;
    openInfo(`${config.title} complete`, `<div class="completion"><div class="fragment">${config.fragment}</div><p>${config.ending}</p><p><strong>Atlas fragment ${islandNumber} of 6 collected.</strong></p><p>You completed all ${config.challenges.length} challenges${state.assisted.length ? ` with support on ${state.assisted.length}` : " without opening support"}.</p><div class="actions">${next}<a class="secondary" href="../map/index.html">Expedition map</a><button class="secondary" data-action="replay" type="button">Replay with new questions</button></div></div>`, "Chapter complete");
  }

  function openJournal() {
    const rows = config.challenges.map(challenge => `<li>${state.completed.includes(challenge.id) ? "✓" : "○"} ${challenge.title}</li>`).join("");
    openInfo("Expedition journal", `<p><strong>${config.title}:</strong> ${state.completed.length}/${config.challenges.length} challenges complete.</p><ol>${rows}</ol><div class="actions"><a class="secondary" href="../map/index.html">Expedition map</a>${state.step >= config.challenges.length ? '<button class="primary" data-action="replay">Replay chapter</button>' : ""}</div>`, "Journal");
  }

  function openSettings() {
    openInfo("Settings", `<div class="settings-grid">
      <div class="setting"><span><strong>Sound effects</strong><br><small>Short generated tones only</small></span><button class="switch" type="button" data-action="sound" aria-label="Toggle sound effects" aria-pressed="${state.sound}"></button></div>
      <div class="setting"><span><strong>Reduce motion</strong><br><small>Stops decorative animation</small></span><button class="switch" type="button" data-action="motion" aria-label="Toggle reduced motion" aria-pressed="${state.reducedMotion}"></button></div>
      <div class="actions"><a class="secondary" href="${artworkHref}">GPT artwork prompt</a></div>
      <p>Progress and settings are saved only in this browser. No microphone, account, analytics, or child information is used.</p>
    </div>`, "Game settings");
  }

  function openInfo(title, html, label = config.title) {
    lastFocus = document.activeElement;
    $("info-title").textContent = title;
    $("info-label").textContent = label;
    $("info-content").innerHTML = html;
    $("info-dialog").showModal();
  }

  function replay() {
    const previous = state.variants;
    const sound = state.sound;
    const reducedMotion = state.reducedMotion;
    state = { ...fresh(previous), started: true, sound, reducedMotion };
    $("info-dialog").close();
    save();
    render();
  }

  buildWorld();
  const resetIslandButton = $("reset");
  const resetActions = document.createElement("div");
  const resetAllButton = document.createElement("button");
  resetActions.className = "reset-actions";
  resetIslandButton.textContent = "Reset island";
  resetAllButton.className = "secondary";
  resetAllButton.id = "reset-all";
  resetAllButton.type = "button";
  resetAllButton.textContent = "Reset all";
  resetIslandButton.replaceWith(resetActions);
  resetActions.append(resetIslandButton, resetAllButton);
  $("journal").setAttribute("aria-label", "Open expedition journal");
  $("settings").setAttribute("aria-label", "Open settings");
  $("close-challenge").setAttribute("aria-label", "Close challenge");
  $("close-info").setAttribute("aria-label", "Close");
  document.querySelectorAll("[data-move]").forEach(button => {
    const vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    button.onclick = () => move(...vectors[button.dataset.move]);
  });
  $("interact").onclick = approachCurrent;
  $("journal").onclick = openJournal;
  $("settings").onclick = openSettings;
  $("hint-button").onclick = () => {
    state.assisted = [...new Set([...state.assisted, active.id])];
    $("challenge-hint").hidden = false;
    $("hint-button").hidden = true;
    save();
  };
  $("continue-button").onclick = closeChallenge;
  $("close-challenge").onclick = closeChallenge;
  $("challenge-dialog").addEventListener("cancel", event => { event.preventDefault(); closeChallenge(); });
  $("close-info").onclick = () => $("info-dialog").close();
  $("info-content").onclick = event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "close-info") $("info-dialog").close();
    if (action === "replay") replay();
    if (action === "sound") { state.sound = !state.sound; save(); $("info-dialog").close(); openSettings(); }
    if (action === "motion") { state.reducedMotion = !state.reducedMotion; save(); render(); $("info-dialog").close(); openSettings(); }
  };
  resetIslandButton.onclick = () => openInfo(`Reset ${config.title}?`, `<p>This restarts only this island. Progress on the other islands remains saved.</p><div class="actions"><button class="secondary" data-action="cancel-reset">Keep progress</button><button class="primary" data-action="confirm-reset-island">Reset island</button></div>`, "Local progress");
  resetAllButton.onclick = () => openInfo("Reset the whole adventure?", `<p>This removes progress for all six islands and returns the Atlas adventure to the beginning.</p><div class="actions"><button class="secondary" data-action="cancel-reset">Keep progress</button><button class="primary" data-action="confirm-reset-all">Reset everything</button></div>`, "All Atlas progress");
  $("info-content").addEventListener("click", event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "cancel-reset") $("info-dialog").close();
    if (action === "confirm-reset-island") {
      localStorage.removeItem(saveKey);
      state = fresh();
      $("info-dialog").close();
      render();
    }
    if (action === "confirm-reset-all") {
      window.AtlasProgress?.resetAdventure();
      location.href = "../index.html";
    }
  });
  document.addEventListener("keydown", event => {
    if ($("challenge-dialog").open || $("info-dialog").open) return;
    const vectors = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (vectors[event.key]) { event.preventDefault(); move(...vectors[event.key]); }
    if (event.key.toLowerCase() === "e") { event.preventDefault(); approachCurrent(); }
  });
  window.AtlasProgress?.recordVisit(islandNumber, config.title);
  render();
  if (new URLSearchParams(location.search).get("selftest") === "1") {
    window.__atlasChapterSelfTest = { config, state: () => structuredClone(state), saveKey, resolvedChallenge, openChallenge, finishChallenge };
  }
})();
