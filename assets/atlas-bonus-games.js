(() => {
  "use strict";

  const ISLAND_GAME_MAP = Object.freeze({
    1: "road-rally",
    2: "sky-blocks",
    3: "spark-maze",
    4: "star-guard",
    5: "comet-swarm",
    6: "goal-runner"
  });

  const COPY = {
    "road-rally": {
      name: "Road Rally", nameHe: "ראלי הכביש",
      goal: "Reach 1,000 m before fuel or lives run out.", goalHe: "הגיעו ל־1,000 מטר לפני שהדלק או החיים נגמרים.",
      instructions: "Steer with ← → or A/D. Hold ↑ or W to accelerate and ↓ or S to brake. Avoid traffic and collect cyan fuel cells.",
      instructionsHe: "נווטו בעזרת החצים ימינה ושמאלה או A/D. החזיקו חץ למעלה או W להאצה וחץ למטה או S לבלימה. התחמקו מהתנועה ואספו תאי דלק בצבע טורקיז."
    },
    "sky-blocks": {
      name: "Sky Blocks", nameHe: "קוביות שמיים",
      goal: "Clear 10 lines as the falling speed increases.", goalHe: "נקו 10 שורות בזמן שמהירות הנפילה עולה.",
      instructions: "Move with ← → or A/D. Rotate with ↑, X, or the Rotate button. Use ↓ to fall faster and Space/Action for a hard drop.",
      instructionsHe: "הזיזו בעזרת החצים ימינה ושמאלה או A/D. סובבו בעזרת חץ למעלה, X או כפתור הסיבוב. חץ למטה מאיץ את הנפילה ורווח/פעולה מפיל מיד."
    },
    "spark-maze": {
      name: "Spark Maze", nameHe: "מבוך הניצוצות",
      goal: "Collect every spark while avoiding three roaming drones.", goalHe: "אספו את כל הניצוצות והתחמקו משלושה רחפנים.",
      instructions: "Move through the maze with arrow keys or WASD. Cyan shields let you safely disable drones for a few seconds.",
      instructionsHe: "נועו במבוך בעזרת החצים או WASD. מגנים טורקיז מאפשרים לנטרל רחפנים בבטחה לכמה שניות."
    },
    "star-guard": {
      name: "Star Guard", nameHe: "משמר הכוכבים",
      goal: "Defeat two descending waves before they reach the base.", goalHe: "הביסו שני גלים יורדים לפני שיגיעו לבסיס.",
      instructions: "Move with ← → or A/D and fire with Space/Action. Use the barriers as cover and dodge enemy pulses.",
      instructionsHe: "נועו בעזרת החצים ימינה ושמאלה או A/D וירו בעזרת רווח/פעולה. השתמשו במחסומים כמגן והתחמקו מירי האויב."
    },
    "comet-swarm": {
      name: "Comet Swarm", nameHe: "נחיל השביטים",
      goal: "Clear two formations and survive their diving attacks.", goalHe: "נקו שתי תצורות ושרדו את התקפות הצלילה.",
      instructions: "Move with ← → or A/D and shoot with Space/Action. Watch for flashing attackers that break formation and dive.",
      instructionsHe: "נועו בעזרת החצים ימינה ושמאלה או A/D וירו בעזרת רווח/פעולה. שימו לב לתוקפים מהבהבים שעוזבים את התצורה וצוללים."
    },
    "goal-runner": {
      name: "Goal Runner", nameHe: "רץ לשער",
      goal: "Score 3 goals before the 60-second clock expires.", goalHe: "הבקיעו 3 שערים לפני תום 60 השניות.",
      instructions: "Dribble with arrow keys or WASD, avoid defenders, and collect speed boosts. In the shooting zone, steer to aim and press Space/Action to shoot.",
      instructionsHe: "כדררו בעזרת החצים או WASD, התחמקו ממגנים ואספו מאיצי מהירות. באזור הבעיטה נווטו לכיוון השער ולחצו רווח/פעולה כדי לבעוט."
    }
  };

  const ARTWORK_SLOTS = Object.freeze({
    "road-rally": Object.freeze(["backdrop", "course", "finish", "traffic", "fuel", "player", "foreground", "hud"]),
    "sky-blocks": Object.freeze(["backdrop", "boardFrame", "block0", "block1", "block2", "block3", "block4", "block5", "block6", "foreground"]),
    "spark-maze": Object.freeze(["backdrop", "floor", "wall", "spark", "shield", "drone0", "drone1", "drone2", "player", "foreground"]),
    "star-guard": Object.freeze(["backdrop", "barrier", "enemy0", "enemy1", "enemy2", "enemy3", "enemy4", "player", "playerShot", "enemyShot", "foreground"]),
    "comet-swarm": Object.freeze(["backdrop", "enemy0", "enemy1", "enemy2", "enemy3", "diver", "player", "shot", "foreground"]),
    "goal-runner": Object.freeze(["backdrop", "fieldOverlay", "boost", "defenderPatrol", "defenderChase", "keeper", "player", "ball", "foreground"])
  });
  const artworkBase = new URL(".", document.currentScript?.src || document.baseURI);
  const artwork = Object.fromEntries(Object.keys(ARTWORK_SLOTS).map(gameId => [gameId, Object.create(null)]));

  function configureArtwork(gameId, manifest = {}) {
    if (!ARTWORK_SLOTS[gameId] || !manifest || typeof manifest !== "object") return false;
    Object.entries(manifest).forEach(([slot, value]) => {
      if (!ARTWORK_SLOTS[gameId].includes(slot)) return;
      const source = typeof value === "string" ? value : value?.src;
      if (!source) {
        delete artwork[gameId][slot];
        return;
      }
      const image = new Image();
      const entry = {
        image,
        source: new URL(source, artworkBase).href,
        smoothing: typeof value === "object" ? value.smoothing !== false : true,
        columns: typeof value === "object" ? Math.max(1, Number(value.columns) || 1) : 1,
        rows: typeof value === "object" ? Math.max(1, Number(value.rows) || 1) : 1,
        status: "loading"
      };
      image.decoding = "async";
      image.addEventListener("load", () => { entry.status = "ready"; }, { once: true });
      image.addEventListener("error", () => { entry.status = "error"; }, { once: true });
      image.src = entry.source;
      artwork[gameId][slot] = entry;
    });
    return true;
  }

  function drawArtwork(slot, x, y, width, height, options = {}) {
    const entry = artwork[state?.gameId]?.[slot];
    if (!entry || entry.status !== "ready" || !entry.image.naturalWidth) return false;
    ctx.save();
    ctx.globalAlpha = options.alpha ?? 1;
    ctx.globalCompositeOperation = options.blend || "source-over";
    ctx.imageSmoothingEnabled = entry.smoothing;
    ctx.translate(x + width / 2, y + height / 2);
    if (options.rotation) ctx.rotate(options.rotation);
    ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
    const frameCount = entry.columns * entry.rows;
    const frame = ((Math.floor(options.frame || 0) % frameCount) + frameCount) % frameCount;
    const sourceWidth = entry.image.naturalWidth / entry.columns;
    const sourceHeight = entry.image.naturalHeight / entry.rows;
    const sourceX = frame % entry.columns * sourceWidth;
    const sourceY = Math.floor(frame / entry.columns) * sourceHeight;
    ctx.drawImage(entry.image, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }

  function drawArtworkLayer(slot, options) {
    return drawArtwork(slot, 0, 0, W, H, options);
  }

  function artworkStatus(gameId = state?.gameId) {
    if (!ARTWORK_SLOTS[gameId]) return {};
    return Object.fromEntries(ARTWORK_SLOTS[gameId].map(slot => [slot, artwork[gameId][slot]?.status || "empty"]));
  }

  const $ = id => document.getElementById(id);
  const canvas = $("bonus-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const mode = document.body.dataset.atlasMode === "sandbox" ? "sandbox" : "production";
  const W = canvas.width;
  const H = canvas.height;
  const input = { held: new Set(), pressed: new Set() };
  const reverseMap = Object.fromEntries(Object.entries(ISLAND_GAME_MAP).map(([island, gameId]) => [gameId, Number(island)]));
  const islandFolders = { 1: "", 2: "island-two/", 3: "island-three/", 4: "island-four/", 5: "island-five/", 6: "island-six/" };
  const completedIslands = () => {
    if (mode === "sandbox") return Object.keys(ISLAND_GAME_MAP).map(Number);
    const progress = window.AtlasProgress?.load?.();
    return Object.keys(ISLAND_GAME_MAP).map(Number).filter(island => progress?.islands?.[String(island)]?.complete);
  };
  let state;
  let frame = 0;
  let lastTime = performance.now();
  let audio;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const effects = { particles: [], shake: 0, flash: 0, flashColor: "#ffffff" };

  function language() {
    return window.AtlasLanguage?.get?.() === "en" ? "en" : "he";
  }

  function text(english, hebrew) {
    return language() === "he" ? hebrew : english;
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return () => {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function consume(name) {
    if (!input.pressed.has(name)) return false;
    input.pressed.delete(name);
    return true;
  }

  function tone(frequency = 520, duration = .07, wave = "sine") {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = wave;
      oscillator.frequency.value = frequency;
      gain.gain.value = .035;
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      oscillator.stop(audio.currentTime + duration);
    } catch {}
  }

  function burst(x, y, color, count = 10, speed = 130) {
    const total = reducedMotion ? Math.min(4, count) : count;
    for (let index = 0; index < total; index++) {
      const angle = index / total * Math.PI * 2 + state.elapsed * .7;
      const velocity = speed * (.55 + (index % 4) * .15);
      effects.particles.push({
        x, y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: .35 + (index % 3) * .09,
        maxLife: .53,
        color,
        size: 2 + index % 3
      });
    }
  }

  function impact(color = "#ffffff", strength = 7) {
    effects.flash = reducedMotion ? .05 : .12;
    effects.flashColor = color;
    effects.shake = reducedMotion ? 0 : strength;
  }

  function updateEffects(dt) {
    effects.shake = Math.max(0, effects.shake - dt * 24);
    effects.flash = Math.max(0, effects.flash - dt);
    effects.particles.forEach(particle => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 80 * dt;
    });
    effects.particles = effects.particles.filter(particle => particle.life > 0);
  }

  function drawEffects() {
    effects.particles.forEach(particle => {
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    ctx.globalAlpha = 1;
    if (effects.flash > 0) {
      ctx.globalAlpha = effects.flash * 2.8;
      ctx.fillStyle = effects.flashColor;
      ctx.fillRect(-20, -20, W + 40, H + 40);
      ctx.globalAlpha = 1;
    }
  }

  function bestKey(gameId) {
    return `edu-games-atlas-bonus-${mode}-${gameId}-best-v1`;
  }

  function loadBest(gameId) {
    try {
      return Math.max(0, Number(localStorage.getItem(bestKey(gameId))) || 0);
    } catch {
      return 0;
    }
  }

  function saveBest() {
    if (!state || state.score <= state.best) return;
    state.best = Math.floor(state.score);
    try {
      localStorage.setItem(bestKey(state.gameId), String(state.best));
    } catch {}
  }

  function setStatus(value) {
    state.status = value;
  }

  function announce(value) {
    $("announcer").textContent = value;
  }

  function renderEndOverlay() {
    const success = state.success;
    const endCopy = state.endCopy;
    setStatus(success ? text("Complete", "הושלם") : text("Game over", "המשחק הסתיים"));
    $("overlay-title").textContent = success ? text("Challenge complete!", "האתגר הושלם!") : text("Try again", "נסו שוב");
    $("overlay-message").textContent = text(endCopy.message, endCopy.messageHe);
    $("play-again-button").textContent = text("Play again", "שחקו שוב");
    $("return-button").textContent = text("Return to island", "חזרה לאי");
    $("map-button").textContent = mode === "sandbox" ? text("Sandbox map", "מפת ארגז החול") : text("Expedition map", "מפת המסע");
    $("return-button").hidden = false;
    $("map-button").hidden = false;
    $("overlay-kicker").textContent = success ? text("RUN COMPLETE", "הריצה הושלמה") : text("RUN ENDED", "הריצה הסתיימה");
    $("overlay-score").textContent = `${text("Score", "ניקוד")}: ${Math.floor(state.score)} • ${text("Best", "שיא")}: ${Math.max(state.best, Math.floor(state.score))}`;
    $("game-overlay").hidden = false;
    renderHud();
  }

  function complete(success, message, messageHe) {
    if (state.ended) return;
    state.running = false;
    state.ended = true;
    state.phase = "ended";
    state.success = success;
    state.endCopy = { message, messageHe };
    saveBest();
    renderEndOverlay();
    requestAnimationFrame(() => $("play-again-button").focus({ preventScroll: true }));
    announce($("overlay-title").textContent);
    tone(success ? 760 : 170, .22, success ? "sine" : "sawtooth");
  }

  function loseLife(reset) {
    if (state.data.invulnerable > 0) return;
    state.lives--;
    state.data.invulnerable = 1.5;
    impact("#ff759f", 10);
    tone(145, .14, "square");
    if (state.lives <= 0) {
      complete(false, "The run ended, but your best score is saved.", "הריצה הסתיימה, אך תוצאת השיא נשמרה.");
    } else if (reset) {
      reset();
    }
  }

  function baseState(gameId) {
    return {
      gameId,
      island: reverseMap[gameId],
      running: false,
      paused: false,
      ended: false,
      success: false,
      endCopy: null,
      phase: "countdown",
      countdown: 2.8,
      score: 0,
      best: loadBest(gameId),
      lives: 3,
      status: text("Ready", "מוכנים"),
      elapsed: 0,
      data: null
    };
  }

  function drawBackground(top = "#071426", bottom = "#123653") {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars(count = 55, offset = 0) {
    ctx.fillStyle = "rgba(235,250,255,.75)";
    for (let index = 0; index < count; index++) {
      const x = (index * 137 + 31) % W;
      const y = (index * 83 + offset) % H;
      const radius = index % 9 === 0 ? 2 : 1;
      ctx.fillRect(x, y, radius, radius);
    }
  }

  function roadCreate() {
    return {
      player: { x: 378, y: 487, w: 44, h: 78, roadX: .5 },
      speed: 95, fuel: 100, distance: 0, roadScroll: 0,
      traffic: [], fuels: [], spawn: 1.1, fuelSpawn: 4.8, invulnerable: 0,
      passed: 0, crash: 0, finishPulse: 0, safeLane: 1,
      random: seeded(101)
    };
  }

  function roadEdges(y) {
    const depth = clamp(y / H, 0, 1);
    return { left: 250 - depth * 105, right: 550 + depth * 105 };
  }

  function roadLaneCenter(lane, y) {
    const edges = roadEdges(y);
    return edges.left + (lane + .5) * (edges.right - edges.left) / 4;
  }

  function roadPlace(object) {
    const scale = .5 + clamp(object.y / H, 0, 1) * .55;
    object.w = 46 * scale;
    object.h = 78 * scale;
    object.x = roadLaneCenter(object.lane, object.y) - object.w / 2;
  }

  function roadSpawnRow(d) {
    const difficulty = clamp(d.distance / 1000, 0, 1);
    const count = d.random() < .25 + difficulty * .38 ? (difficulty > .62 && d.random() < .25 ? 3 : 2) : 1;
    const laneShift = Math.floor(d.random() * 3) - 1;
    const openLane = clamp(d.safeLane + laneShift, 0, 3);
    d.safeLane = openLane;
    const lanes = [0, 1, 2, 3].filter(lane => lane !== openLane);
    for (let index = lanes.length - 1; index > 0; index--) {
      const swap = Math.floor(d.random() * (index + 1));
      [lanes[index], lanes[swap]] = [lanes[swap], lanes[index]];
    }
    lanes.slice(0, count).forEach((lane, index) => {
      const car = {
        lane, x: 0, y: 82 - index * 5, w: 30, h: 50,
        speed: 45 + d.random() * 70 + difficulty * 25,
        color: ["#ff759f", "#ffc857", "#8b9cff", "#7ce0a1"][(lane + d.passed) % 4]
      };
      roadPlace(car);
      d.traffic.push(car);
    });
  }

  function roadUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.crash = Math.max(0, d.crash - dt);
    const accelerating = input.held.has("up");
    const braking = input.held.has("down");
    d.speed += (accelerating ? 95 : -25) * dt;
    if (braking) d.speed -= 155 * dt;
    d.speed = clamp(d.speed, 58, 285);
    const steer = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    d.player.roadX = clamp(d.player.roadX + steer * (0.43 + d.speed / 800) * dt, .055, .945);
    const playerEdges = roadEdges(d.player.y + d.player.h);
    d.player.x = playerEdges.left + d.player.roadX * (playerEdges.right - playerEdges.left) - d.player.w / 2;
    d.distance += d.speed * dt * .14;
    d.fuel -= (.8 + d.speed / 360) * dt;
    d.roadScroll = (d.roadScroll + d.speed * dt) % 100;
    d.finishPulse += dt;
    d.spawn -= dt;
    if (d.spawn <= 0) {
      roadSpawnRow(d);
      const difficulty = clamp(d.distance / 1000, 0, 1);
      d.spawn = 1.15 - difficulty * .38 + d.random() * .48;
    }
    d.fuelSpawn -= dt;
    if (d.fuelSpawn <= 0) {
      const occupied = new Set(d.traffic.filter(car => car.y < 130).map(car => car.lane));
      const choices = [0, 1, 2, 3].filter(lane => !occupied.has(lane));
      const lane = choices[Math.floor(d.random() * choices.length)] ?? Math.floor(d.random() * 4);
      d.fuels.push({ lane, x: 0, y: 86, w: 25, h: 25 });
      d.fuelSpawn = 5.5 + d.random() * 2.5;
    }
    d.traffic.forEach(car => {
      car.y += (d.speed - car.speed + 105) * dt;
      roadPlace(car);
      if (hit(d.player, car) && d.invulnerable <= 0) {
        car.y = H + 100;
        d.speed = 65;
        d.fuel = Math.max(0, d.fuel - 11);
        d.crash = .6;
        burst(d.player.x + 22, d.player.y + 20, "#ffb16b", 18, 190);
        loseLife();
      }
    });
    d.fuels.forEach(cell => {
      cell.y += (d.speed + 80) * dt;
      const scale = .55 + clamp(cell.y / H, 0, 1) * .45;
      cell.w = cell.h = 30 * scale;
      cell.x = roadLaneCenter(cell.lane, cell.y) - cell.w / 2;
      if (hit(d.player, cell)) {
        cell.y = H + 100;
        d.fuel = Math.min(100, d.fuel + 26);
        state.score += 150;
        burst(cell.x + cell.w / 2, cell.y, "#62e2df", 12);
        tone(690);
      }
    });
    d.passed += d.traffic.filter(car => car.y >= H + 88 && !car.counted).length;
    d.traffic.forEach(car => { if (car.y >= H + 88) car.counted = true; });
    d.traffic = d.traffic.filter(car => car.y < H + 90);
    d.fuels = d.fuels.filter(cell => cell.y < H + 50);
    state.score = Math.max(state.score, Math.floor(d.distance * 10) + d.passed * 20);
    setStatus(`${Math.floor(d.distance)} / 1000 m • ${Math.floor(d.speed)} km/h`);
    if (d.distance >= 1000) complete(true, "You reached the rally beacon with fuel to spare.", "הגעתם למשואת הראלי ונשאר לכם דלק.");
    if (d.fuel <= 0) complete(false, "The fuel cell ran dry before the beacon.", "תא הדלק התרוקן לפני המשואה.");
  }

  function roadDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) {
      drawBackground("#5f98b3", "#14293b");
      ctx.fillStyle = "#d9c88b";
      ctx.fillRect(0, 120, W, 75);
      ctx.fillStyle = "#20482e";
      ctx.fillRect(0, 180, W, H - 180);
    }
    if (!drawArtworkLayer("course")) {
      ctx.fillStyle = "#33404d";
      ctx.beginPath();
      ctx.moveTo(250, 95);
      ctx.lineTo(550, 95);
      ctx.lineTo(660, H);
      ctx.lineTo(140, H);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#e5f0e9";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(250, 95);
      ctx.lineTo(140, H);
      ctx.moveTo(550, 95);
      ctx.lineTo(660, H);
      ctx.stroke();
      ctx.strokeStyle = "#f8dfa0";
      ctx.lineWidth = 6;
      for (let lane = 1; lane < 4; lane++) {
        for (let y = 90 + d.roadScroll; y < H; y += 100) {
          const nextY = Math.min(H, y + 48);
          const a = roadEdges(y);
          const b = roadEdges(nextY);
          const ax = a.left + lane * (a.right - a.left) / 4;
          const bx = b.left + lane * (b.right - b.left) / 4;
          ctx.beginPath();
          ctx.moveTo(ax, y);
          ctx.lineTo(bx, nextY);
          ctx.stroke();
        }
      }
      for (let y = 155 + d.roadScroll * 1.4; y < H; y += 115) {
        const depth = y / H;
        const edges = roadEdges(y);
        ctx.fillStyle = "#f4d36f";
        ctx.fillRect(edges.left - 36 - depth * 12, y, 7 + depth * 5, 24 + depth * 20);
        ctx.fillRect(edges.right + 29, y, 7 + depth * 5, 24 + depth * 20);
      }
    }
    if (d.distance > 900) {
      const remaining = clamp((1000 - d.distance) / 100, 0, 1);
      const y = 125 + remaining * 330;
      const edges = roadEdges(y);
      if (!drawArtwork("finish", edges.left, y - 28, edges.right - edges.left, 48)) {
        ctx.fillStyle = "#ffd66b";
        ctx.fillRect(edges.left, y, edges.right - edges.left, 11);
        ctx.fillStyle = "#0a1b2d";
        ctx.font = "bold 18px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(text("FINISH", "סיום"), W / 2, y - 8);
        ctx.textAlign = "start";
      }
    }
    d.fuels.forEach(cell => {
      if (drawArtwork("fuel", cell.x, cell.y, cell.w, cell.h, { frame: Math.floor(state.elapsed * 8) })) return;
      ctx.fillStyle = "#62e2df";
      ctx.beginPath();
      ctx.arc(cell.x + cell.w / 2, cell.y + cell.h / 2, cell.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0d3540";
      ctx.fillRect(cell.x + cell.w * .42, cell.y + cell.h * .2, cell.w * .16, cell.h * .6);
      ctx.fillRect(cell.x + cell.w * .2, cell.y + cell.h * .42, cell.w * .6, cell.h * .16);
    });
    d.traffic.slice().sort((a, b) => a.y - b.y).forEach(car => {
      if (!drawArtwork("traffic", car.x, car.y, car.w, car.h, { frame: Math.floor((state.elapsed + car.lane) * 8) })) drawRoadCar(car);
    });
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      if (!drawArtwork("player", d.player.x, d.player.y, d.player.w, d.player.h, { frame: Math.floor(state.elapsed * 10) })) drawRoadCar({ ...d.player, color: d.crash > 0 ? "#ffffff" : "#62e2df" });
    }
    if (d.speed > 190 && !reducedMotion) {
      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = 2;
      for (let index = 0; index < 12; index++) {
        const y = (index * 89 + d.roadScroll * 3) % H;
        const edges = roadEdges(y);
        const x = edges.left + 12 + (index * 67) % Math.max(20, edges.right - edges.left - 24);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 18 + d.speed / 14);
        ctx.stroke();
      }
    }
    drawArtworkLayer("foreground");
    ctx.fillStyle = "rgba(5,16,28,.8)";
    ctx.fillRect(18, 18, 205, 32);
    ctx.fillStyle = "#243f52";
    ctx.fillRect(27, 29, 185, 11);
    ctx.fillStyle = d.fuel < 25 ? "#ff759f" : "#71e39b";
    ctx.fillRect(27, 29, 185 * d.fuel / 100, 11);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px system-ui";
    ctx.fillText(`${text("FUEL", "דלק")} ${Math.ceil(d.fuel)}%`, 70, 42);
    drawArtworkLayer("hud");
  }

  function drawRoadCar(car) {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x + car.w * .09, car.y, car.w * .82, car.h);
    ctx.fillStyle = "#10243a";
    ctx.fillRect(car.x + car.w * .22, car.y + car.h * .15, car.w * .56, car.h * .22);
    ctx.fillRect(car.x + car.w * .22, car.y + car.h * .62, car.w * .56, car.h * .21);
    ctx.fillStyle = "#fff4a6";
    ctx.fillRect(car.x + car.w * .15, car.y + 3, car.w * .17, 5);
    ctx.fillRect(car.x + car.w * .68, car.y + 3, car.w * .17, 5);
  }

  const BLOCK_SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]]
  ];
  const BLOCK_COLORS = ["#62e2df", "#ffd66b", "#c29cff", "#ff8a70", "#7aa7ff", "#7be39e", "#ff759f"];

  function blocksCreate() {
    const data = {
      board: Array.from({ length: 20 }, () => Array(10).fill(0)),
      current: null, next: 0, bag: [], lines: 0, level: 1, fall: 0, moveWait: 0,
      lockTimer: 0, lockResets: 0, clearRows: [], clearTimer: 0, combo: -1,
      random: seeded(202), invulnerable: 0
    };
    data.next = blockFromBag(data);
    blockSpawn(data);
    return data;
  }

  function blockFromBag(d) {
    if (!d.bag.length) {
      d.bag = BLOCK_SHAPES.map((_, index) => index);
      for (let index = d.bag.length - 1; index > 0; index--) {
        const swap = Math.floor(d.random() * (index + 1));
        [d.bag[index], d.bag[swap]] = [d.bag[swap], d.bag[index]];
      }
    }
    return d.bag.pop();
  }

  function blockSpawn(d) {
    const type = d.next;
    d.next = blockFromBag(d);
    d.current = { type, matrix: BLOCK_SHAPES[type].map(row => [...row]), x: type === 0 ? 3 : 4, y: -1 };
    d.fall = 0;
    d.lockTimer = 0;
    d.lockResets = 0;
    if (blockCollides(d, d.current, 0, 0)) {
      complete(false, "The stack reached the cloud ceiling.", "המגדל הגיע לתקרת העננים.");
    }
  }

  function blockCollides(d, piece, dx, dy, matrix = piece.matrix) {
    return matrix.some((row, y) => row.some((value, x) => {
      if (!value) return false;
      const bx = piece.x + x + dx;
      const by = piece.y + y + dy;
      return bx < 0 || bx >= 10 || by >= 20 || (by >= 0 && d.board[by][bx]);
    }));
  }

  function blockRotate(d) {
    const rotated = d.current.matrix[0].map((_, index) => d.current.matrix.map(row => row[index]).reverse());
    const kicks = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];
    for (const [kickX, kickY] of kicks) {
      if (!blockCollides(d, d.current, kickX, kickY, rotated)) {
        d.current.x += kickX;
        d.current.y += kickY;
        d.current.matrix = rotated;
        if (d.lockResets < 8) {
          d.lockTimer = 0;
          d.lockResets++;
        }
        tone(440, .04);
        return;
      }
    }
  }

  function blockCommit(d) {
    let aboveCeiling = false;
    d.current.matrix.forEach((row, y) => row.forEach((value, x) => {
      const by = d.current.y + y;
      if (!value) return;
      if (by < 0) aboveCeiling = true;
      else d.board[by][d.current.x + x] = d.current.type + 1;
    }));
    if (aboveCeiling) {
      complete(false, "The stack reached the cloud ceiling.", "המגדל הגיע לתקרת העננים.");
      return;
    }
    d.clearRows = d.board.map((row, index) => row.every(Boolean) ? index : -1).filter(index => index >= 0);
    if (d.clearRows.length) {
      d.clearTimer = .28;
      burst(400, 60 + d.clearRows[0] * 27, "#ffd66b", 20, 180);
      impact("#ffd66b", 3);
    } else {
      d.combo = -1;
      blockSpawn(d);
    }
  }

  function blockFinishClear(d) {
    const cleared = d.clearRows.length;
    [...d.clearRows].sort((a, b) => b - a).forEach(row => d.board.splice(row, 1));
    while (d.board.length < 20) d.board.unshift(Array(10).fill(0));
    d.clearRows = [];
    d.clearTimer = 0;
    if (cleared) {
      d.combo++;
      d.lines += cleared;
      d.level = 1 + Math.floor(d.lines / 4);
      state.score += ([0, 100, 300, 550, 900][cleared] + Math.max(0, d.combo) * 75) * d.level;
      tone(620 + cleared * 70, .1);
    }
    if (d.lines >= 10) {
      complete(true, "Ten sky-lines cleared. The stack is stable.", "עשר שורות שמיים נוקו. המגדל יציב.");
      return;
    }
    blockSpawn(d);
  }

  function blockGhostY(d) {
    let y = d.current.y;
    while (!blockCollides(d, { ...d.current, y }, 0, 1)) y++;
    return y;
  }

  function blocksUpdate(dt) {
    const d = state.data;
    if (d.clearTimer > 0) {
      d.clearTimer -= dt;
      if (d.clearTimer <= 0) blockFinishClear(d);
      return;
    }
    d.moveWait -= dt;
    const direction = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    const movePressed = consume("left") || consume("right");
    if ((movePressed || (direction && d.moveWait <= 0)) && direction && !blockCollides(d, d.current, direction, 0)) {
      d.current.x += direction;
      d.moveWait = movePressed ? .17 : .065;
      if (d.lockResets < 8) {
        d.lockTimer = 0;
        d.lockResets++;
      }
    }
    if (consume("up") || consume("alt")) blockRotate(d);
    if (consume("action")) {
      let dropped = 0;
      while (!blockCollides(d, d.current, 0, 1)) {
        d.current.y++;
        dropped++;
      }
      state.score += dropped * 2;
      blockCommit(d);
      return;
    }
    d.fall += dt * (input.held.has("down") ? 12 : 1);
    const delay = Math.max(.085, .72 * Math.pow(.82, d.level - 1));
    while (d.fall >= delay && !blockCollides(d, d.current, 0, 1)) {
      d.fall -= delay;
      d.current.y++;
      if (input.held.has("down")) state.score++;
    }
    if (blockCollides(d, d.current, 0, 1)) {
      d.lockTimer += dt;
      if (d.lockTimer >= .48) blockCommit(d);
    } else {
      d.lockTimer = 0;
    }
    setStatus(`${d.lines} / 10 ${text("lines", "שורות")} • ${text("Level", "שלב")} ${d.level}`);
  }

  function blocksDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) {
      drawBackground("#17182f", "#243a62");
      drawStars(70, Math.floor(state.elapsed * 12));
    }
    const size = 27;
    const ox = 235;
    const oy = 28;
    ctx.fillStyle = "rgba(5,12,28,.88)";
    ctx.fillRect(ox - 7, oy - 7, size * 10 + 14, size * 20 + 14);
    ctx.strokeStyle = "rgba(130,170,225,.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 10; x++) {
      ctx.beginPath();
      ctx.moveTo(ox + x * size, oy);
      ctx.lineTo(ox + x * size, oy + 20 * size);
      ctx.stroke();
    }
    for (let y = 0; y <= 20; y++) {
      ctx.beginPath();
      ctx.moveTo(ox, oy + y * size);
      ctx.lineTo(ox + 10 * size, oy + y * size);
      ctx.stroke();
    }
    drawArtwork("boardFrame", ox - 18, oy - 18, size * 10 + 36, size * 20 + 36);
    d.board.forEach((row, y) => row.forEach((value, x) => {
      if (value) {
        const flash = d.clearRows.includes(y) && Math.floor(d.clearTimer * 24) % 2 === 0;
        drawBlockCell(value - 1, ox + x * size, oy + y * size, size, flash ? "#ffffff" : BLOCK_COLORS[value - 1]);
      }
    }));
    if (d.current && !d.clearRows.length) {
      const ghostY = blockGhostY(d);
      d.current.matrix.forEach((row, y) => row.forEach((value, x) => {
        if (value && ghostY + y >= 0) drawBlockCell(d.current.type, ox + (d.current.x + x) * size, oy + (ghostY + y) * size, size, BLOCK_COLORS[d.current.type], .2);
      }));
    }
    d.current.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (value && d.current.y + y >= 0) drawBlockCell(d.current.type, ox + (d.current.x + x) * size, oy + (d.current.y + y) * size, size, BLOCK_COLORS[d.current.type]);
    }));
    ctx.fillStyle = "#d8e9ff";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(`${text("NEXT", "הבא")}  •  ${text("LEVEL", "שלב")} ${d.level}`, 540, 80);
    BLOCK_SHAPES[d.next].forEach((row, y) => row.forEach((value, x) => {
      if (value) drawBlockCell(d.next, 570 + x * 25, 105 + y * 25, 25, BLOCK_COLORS[d.next]);
    }));
    if (d.combo > 0) {
      ctx.fillStyle = "#ffd66b";
      ctx.font = "bold 22px system-ui";
      ctx.fillText(`${text("COMBO", "רצף")} ×${d.combo + 1}`, 540, 205);
    }
    drawArtworkLayer("foreground");
  }

  function drawBlockCell(type, x, y, size, color, alpha = 1) {
    if (drawArtwork(`block${type}`, x + 1, y + 1, size - 2, size - 2, { alpha })) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    drawBlock(x, y, size, color);
    ctx.restore();
  }

  function drawBlock(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.fillRect(x + 4, y + 4, size - 8, 4);
    ctx.strokeStyle = "rgba(0,0,0,.25)";
    ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
  }

  const MAZE = [
    "###############",
    "#.....#.......#",
    "#.###.#.###.#.#",
    "#.#...#...#.#.#",
    "#.#.#####.#.#.#",
    "#...#.....#...#",
    "###.#.###.#.###",
    "#...#..#..#...#",
    "#.###.#.#.###.#",
    "#.....#.#.....#",
    "#.#####.#####.#",
    "#.............#",
    "###############"
  ];

  function reachableMaze() {
    const queue = [{ x: 1, y: 1 }];
    const seen = new Set(["1,1"]);
    while (queue.length) {
      const current = queue.shift();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const x = current.x + dx;
        const y = current.y + dy;
        const key = `${x},${y}`;
        if (MAZE[y]?.[x] === "." && !seen.has(key)) {
          seen.add(key);
          queue.push({ x, y });
        }
      });
    }
    return [...seen].map(key => {
      const [x, y] = key.split(",").map(Number);
      return { x, y };
    });
  }

  function mazeCreate() {
    const cells = reachableMaze();
    const enemyStarts = [cells[Math.floor(cells.length * .35)], cells[Math.floor(cells.length * .65)], cells[cells.length - 1]];
    const powerCells = [cells[Math.floor(cells.length * .2)], cells[Math.floor(cells.length * .8)]];
    const excluded = new Set(["1,1", ...enemyStarts.map(cell => `${cell.x},${cell.y}`), ...powerCells.map(cell => `${cell.x},${cell.y}`)]);
    return {
      player: { x: 1, y: 1 },
      start: { x: 1, y: 1 },
      sparks: new Set(cells.map(cell => `${cell.x},${cell.y}`).filter(key => !excluded.has(key))),
      totalSparks: cells.length - excluded.size,
      powers: new Set(powerCells.map(cell => `${cell.x},${cell.y}`)),
      enemies: enemyStarts.map((cell, index) => ({
        x: cell.x, y: cell.y, startX: cell.x, startY: cell.y, index,
        dx: index === 1 ? -1 : 1, dy: 0, homeTimer: 0
      })),
      enemyStep: .8, moveWait: 0, shield: 0, phase: 0, freeze: .7,
      playerDir: { x: 1, y: 0 }, invulnerable: 2.2
    };
  }

  function mazeCanMove(x, y) {
    return MAZE[y]?.[x] === ".";
  }

  function mazeDistance(start, target) {
    const queue = [{ x: start.x, y: start.y, distance: 0 }];
    const seen = new Set([`${start.x},${start.y}`]);
    while (queue.length) {
      const current = queue.shift();
      if (current.x === target.x && current.y === target.y) return current.distance;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = current.x + dx;
        const y = current.y + dy;
        const key = `${x},${y}`;
        if (!mazeCanMove(x, y) || seen.has(key)) continue;
        seen.add(key);
        queue.push({ x, y, distance: current.distance + 1 });
      }
    }
    return 999;
  }

  function mazeResetPositions() {
    const d = state.data;
    d.player = { ...d.start };
    d.enemies.forEach(enemy => {
      enemy.x = enemy.startX;
      enemy.y = enemy.startY;
      enemy.homeTimer = .9;
    });
    d.freeze = .8;
    d.invulnerable = 2.4;
  }

  function mazeEnemyMove(enemy, d) {
    if (enemy.homeTimer > 0) return;
    const choices = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => ({ x: enemy.x + dx, y: enemy.y + dy, dx, dy }))
      .filter(cell => mazeCanMove(cell.x, cell.y));
    const forward = choices.filter(cell => cell.dx !== -enemy.dx || cell.dy !== -enemy.dy);
    const options = forward.length ? forward : choices;
    const scatter = d.phase % 13 > 8.5;
    const targets = [{ x: 13, y: 1 }, { x: 1, y: 11 }, { x: 13, y: 11 }];
    let target = d.player;
    if (enemy.index === 1) {
      target = { x: d.player.x + d.playerDir.x * 3, y: d.player.y + d.playerDir.y * 3 };
      if (!mazeCanMove(target.x, target.y)) target = d.player;
    } else if (enemy.index === 2 && Math.abs(enemy.x - d.player.x) + Math.abs(enemy.y - d.player.y) < 5) {
      target = targets[enemy.index];
    }
    if (scatter) target = targets[enemy.index];
    options.sort((a, b) => {
      const da = mazeDistance(a, target);
      const db = mazeDistance(b, target);
      return (d.shield > 0 ? db - da : da - db) || a.y - b.y || a.x - b.x;
    });
    if (options[0]) {
      enemy.x = options[0].x;
      enemy.y = options[0].y;
      enemy.dx = options[0].dx;
      enemy.dy = options[0].dy;
    }
  }

  function mazeCheckContact(d) {
    d.enemies.forEach(enemy => {
      if (enemy.homeTimer > 0 || enemy.x !== d.player.x || enemy.y !== d.player.y) return;
      if (d.shield > 0) {
        burst(100 + enemy.x * 40 + 20, 40 + enemy.y * 40 + 20, "#62e2df", 16);
        enemy.x = enemy.startX;
        enemy.y = enemy.startY;
        enemy.homeTimer = 2;
        state.score += 200;
        impact("#62e2df", 3);
        tone(300, .1);
      } else if (d.invulnerable <= 0) {
        loseLife(mazeResetPositions);
      }
    });
  }

  function mazeUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.shield = Math.max(0, d.shield - dt);
    d.freeze = Math.max(0, d.freeze - dt);
    d.enemies.forEach(enemy => { enemy.homeTimer = Math.max(0, enemy.homeTimer - dt); });
    d.phase += dt;
    d.moveWait -= dt;
    let move;
    if (input.held.has("left")) move = [-1, 0];
    else if (input.held.has("right")) move = [1, 0];
    else if (input.held.has("up")) move = [0, -1];
    else if (input.held.has("down")) move = [0, 1];
    if (move && d.moveWait <= 0 && mazeCanMove(d.player.x + move[0], d.player.y + move[1])) {
      d.player.x += move[0];
      d.player.y += move[1];
      d.playerDir = { x: move[0], y: move[1] };
      d.moveWait = .105;
      const key = `${d.player.x},${d.player.y}`;
      if (d.sparks.delete(key)) {
        state.score += 25;
        tone(570, .035);
      }
      if (d.powers.delete(key)) {
        d.shield = 8;
        state.score += 100;
        burst(100 + d.player.x * 40 + 20, 40 + d.player.y * 40 + 20, "#62e2df", 18);
        tone(820, .12);
      }
      mazeCheckContact(d);
    }
    d.enemyStep -= dt;
    if (d.enemyStep <= 0 && d.freeze <= 0) {
      d.enemies.forEach(enemy => mazeEnemyMove(enemy, d));
      const progress = 1 - d.sparks.size / d.totalSparks;
      d.enemyStep = d.shield > 0 ? .7 : Math.max(.31, .48 - progress * .12);
      mazeCheckContact(d);
    }
    const shieldStatus = d.shield > 0 ? ` • ${text("Shield", "מגן")} ${Math.ceil(d.shield)}s` : "";
    setStatus(`${d.sparks.size} ${text("sparks left", "ניצוצות נותרו")}${shieldStatus}`);
    if (!d.sparks.size) complete(true, "Every spark is safely back in the Atlas.", "כל הניצוצות חזרו בבטחה אל האטלס.");
  }

  function mazeDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) drawBackground("#071a2d", "#133d46");
    const tile = 40;
    const ox = 100;
    const oy = 40;
    MAZE.forEach((row, y) => [...row].forEach((cell, x) => {
      if (cell === "#") {
        if (drawArtwork("wall", ox + x * tile, oy + y * tile, tile, tile)) return;
        const wallGlow = (x + y) % 2 ? "#244a66" : "#294f6d";
        ctx.fillStyle = wallGlow;
        ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
        ctx.strokeStyle = "#447f96";
        ctx.strokeRect(ox + x * tile + 3, oy + y * tile + 3, tile - 6, tile - 6);
      } else {
        if (drawArtwork("floor", ox + x * tile, oy + y * tile, tile, tile)) return;
        ctx.fillStyle = "#091b2c";
        ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
        ctx.fillStyle = "rgba(98,226,223,.035)";
        ctx.fillRect(ox + x * tile + 5, oy + y * tile + 5, tile - 10, tile - 10);
      }
    }));
    d.sparks.forEach(key => {
      const [x, y] = key.split(",").map(Number);
      if (drawArtwork("spark", ox + x * tile + 12, oy + y * tile + 12, 16, 16, { frame: Math.floor(state.elapsed * 8) })) return;
      ctx.fillStyle = "#ffd66b";
      ctx.beginPath();
      ctx.arc(ox + x * tile + 20, oy + y * tile + 20, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    d.powers.forEach(key => {
      const [x, y] = key.split(",").map(Number);
      if (drawArtwork("shield", ox + x * tile + 7, oy + y * tile + 7, 26, 26, { frame: Math.floor(state.elapsed * 6) })) return;
      ctx.strokeStyle = "#62e2df";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ox + x * tile + 20, oy + y * tile + 20, 11, 0, Math.PI * 2);
      ctx.stroke();
    });
    d.enemies.forEach((enemy, index) => {
      const frightened = d.shield > 0;
      const alpha = enemy.homeTimer > 0 ? .35 : 1;
      if (!drawArtwork(`drone${index}`, ox + enemy.x * tile + 3, oy + enemy.y * tile + 3, 34, 34, { alpha, frame: Math.floor((state.elapsed + index * .2) * 8) })) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = frightened ? (Math.floor(d.shield * 5) % 2 ? "#8feeff" : "#4f82d7") : ["#ff759f", "#ff9e67", "#b891ff"][index];
        ctx.beginPath();
        ctx.arc(ox + enemy.x * tile + 20, oy + enemy.y * tile + 20, 14, Math.PI, 0);
        ctx.lineTo(ox + enemy.x * tile + 34, oy + enemy.y * tile + 33);
        ctx.lineTo(ox + enemy.x * tile + 20, oy + enemy.y * tile + 27);
        ctx.lineTo(ox + enemy.x * tile + 6, oy + enemy.y * tile + 33);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (frightened) {
        ctx.strokeStyle = "rgba(98,226,223,.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(ox + enemy.x * tile + 5, oy + enemy.y * tile + 5, 30, 30);
      }
    });
    const px = ox + d.player.x * tile + 20;
    const py = oy + d.player.y * tile + 20;
    if (d.shield > 0) {
      ctx.strokeStyle = "#62e2df";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (!drawArtwork("player", px - 15, py - 15, 30, 30, { frame: Math.floor(state.elapsed * 8) })) {
      ctx.fillStyle = "#fff3a4";
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    drawArtworkLayer("foreground");
    ctx.fillStyle = "rgba(4,14,25,.88)";
    ctx.fillRect(250, 8, 300, 22);
    ctx.fillStyle = "#ffd66b";
    ctx.fillRect(256, 14, 288 * (1 - d.sparks.size / d.totalSparks), 10);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${d.sparks.size} ${text("SPARKS", "ניצוצות")}`, W / 2, 26);
    ctx.textAlign = "start";
  }

  function guardEnemies(wave) {
    const enemies = [];
    const rows = wave === 1 ? 4 : 5;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 7; col++) {
        const x = 158 + col * 72;
        const y = 65 + row * 43;
        enemies.push({ baseX: x, baseY: y, x, y, w: 34, h: 25, alive: true, row, col, hp: wave === 2 && row === 0 ? 2 : 1, hitFlash: 0 });
      }
    }
    return enemies;
  }

  function guardCreate() {
    return {
      player: { x: 378, y: 540, w: 44, h: 22 },
      bullets: [], enemyShots: [], warnings: [], enemies: guardEnemies(1),
      barriers: [180, 325, 470, 615].map(x => ({ x, y: 455, w: 62, h: 30, hp: 7, flash: 0 })),
      direction: 1, formationX: 0, formationY: 0, formationSpeed: 31, shotWait: 0, enemyFire: 1.5,
      wave: 1, waveBanner: 1.4, invulnerable: 0, random: seeded(404)
    };
  }

  function guardUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.waveBanner = Math.max(0, d.waveBanner - dt);
    d.barriers.forEach(barrier => { barrier.flash = Math.max(0, barrier.flash - dt); });
    d.enemies.forEach(enemy => { enemy.hitFlash = Math.max(0, enemy.hitFlash - dt); });
    const move = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    d.player.x = clamp(d.player.x + move * 270 * dt, 25, W - d.player.w - 25);
    d.shotWait -= dt;
    if ((input.held.has("action") || consume("action")) && d.shotWait <= 0) {
      d.bullets.push({ x: d.player.x + 19, y: d.player.y - 13, w: 6, h: 15 });
      d.shotWait = .27;
      tone(650, .035, "square");
    }
    const aliveAtStart = d.enemies.filter(enemy => enemy.alive);
    const speedBoost = 1 + (1 - aliveAtStart.length / d.enemies.length) * .8;
    d.formationX += d.direction * d.formationSpeed * speedBoost * dt;
    let edge = false;
    aliveAtStart.forEach(enemy => {
      enemy.x = enemy.baseX + d.formationX;
      enemy.y = enemy.baseY + d.formationY;
      if (enemy.x < 26 || enemy.x + enemy.w > W - 26) edge = true;
    });
    if (edge) {
      d.direction *= -1;
      d.formationX += d.direction * 5;
      d.formationY += 18;
      impact("#8ea5ff", 2);
    }
    d.enemyFire -= dt;
    if (d.enemyFire <= 0 && d.warnings.length < 2 && aliveAtStart.length) {
      const bottomByColumn = [];
      aliveAtStart.forEach(enemy => {
        if (!bottomByColumn[enemy.col] || enemy.y > bottomByColumn[enemy.col].y) bottomByColumn[enemy.col] = enemy;
      });
      const shooters = bottomByColumn.filter(Boolean);
      const shooter = shooters[Math.floor(d.random() * shooters.length)];
      if (shooter) d.warnings.push({ enemy: shooter, time: .38 });
      d.enemyFire = Math.max(.52, 1.35 - d.wave * .18 - (1 - aliveAtStart.length / d.enemies.length) * .25);
    }
    d.warnings.forEach(warning => {
      warning.time -= dt;
      if (warning.time <= 0 && warning.enemy.alive) {
        d.enemyShots.push({ x: warning.enemy.x + 14, y: warning.enemy.y + 24, w: 7, h: 16 });
        tone(180, .035, "sawtooth");
      }
    });
    d.warnings = d.warnings.filter(warning => warning.time > 0 && warning.enemy.alive);
    d.bullets.forEach(bullet => bullet.y -= 420 * dt);
    d.enemyShots.forEach(shot => shot.y += (185 + d.wave * 25) * dt);
    d.bullets.forEach(bullet => {
      const enemy = d.enemies.find(candidate => candidate.alive && hit(bullet, candidate));
      if (!enemy) return;
      enemy.hp--;
      enemy.hitFlash = .12;
      bullet.y = -100;
      burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, ["#ff759f", "#ff9b68", "#ffd66b", "#91a7ff"][enemy.row % 4], enemy.hp > 0 ? 5 : 12);
      if (enemy.hp <= 0) {
        enemy.alive = false;
        state.score += 55 + (5 - enemy.row) * 12;
        tone(280 + enemy.row * 50, .05);
      } else {
        tone(210, .035);
      }
    });
    d.enemyShots.forEach(shot => {
      const barrier = d.barriers.find(candidate => candidate.hp > 0 && hit(shot, candidate));
      if (barrier) {
        barrier.hp--;
        barrier.flash = .16;
        shot.y = H + 50;
        burst(shot.x, barrier.y, "#62e2df", 5);
      }
      if (hit(shot, d.player) && d.invulnerable <= 0) {
        shot.y = H + 50;
        burst(d.player.x + 22, d.player.y, "#ff759f", 15);
        loseLife();
      }
    });
    d.bullets = d.bullets.filter(bullet => bullet.y > -30);
    d.enemyShots = d.enemyShots.filter(shot => shot.y < H + 20);
    const aliveCount = d.enemies.filter(enemy => enemy.alive).length;
    if (!aliveCount) {
      if (d.wave >= 2) {
        complete(true, "The base is safe after two full waves.", "הבסיס בטוח לאחר שני גלים מלאים.");
      } else {
        d.wave++;
        d.enemies = guardEnemies(d.wave);
        d.formationX = 0;
        d.formationY = 0;
        d.direction = 1;
        d.formationSpeed += 12;
        d.enemyShots = [];
        d.warnings = [];
        d.waveBanner = 1.7;
        state.score += 500;
        impact("#ffd66b", 4);
        tone(820, .15);
      }
    }
    if (d.enemies.some(enemy => enemy.alive && enemy.y + enemy.h >= d.player.y - 20)) complete(false, "The formation reached the star base.", "התצורה הגיעה לבסיס הכוכבים.");
    setStatus(`${text("Wave", "גל")} ${d.wave} • ${aliveCount}`);
  }

  function guardDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) {
      drawBackground("#050b1d", "#112d50");
      drawStars(85, Math.floor(state.elapsed * 10));
    }
    d.barriers.forEach(barrier => {
      if (barrier.hp <= 0) return;
      if (drawArtwork("barrier", barrier.x, barrier.y, barrier.w, barrier.h, { alpha: .35 + barrier.hp / 11 })) return;
      ctx.fillStyle = barrier.flash > 0 ? "#ffffff" : `rgba(98,226,223,${.18 + barrier.hp * .1})`;
      for (let segment = 0; segment < barrier.hp; segment++) {
        const sx = barrier.x + (segment % 4) * 15;
        const sy = barrier.y + Math.floor(segment / 4) * 14;
        ctx.fillRect(sx, sy, 13, 12);
      }
    });
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      if (drawArtwork(`enemy${enemy.row}`, enemy.x, enemy.y, enemy.w, enemy.h, { alpha: enemy.hitFlash > 0 ? .55 : 1, frame: Math.floor((state.elapsed + enemy.col * .1) * 6) })) return;
      ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : ["#ff759f", "#ff9b68", "#ffd66b", "#91a7ff", "#7be39e"][enemy.row];
      ctx.fillRect(enemy.x + 6, enemy.y, enemy.w - 12, enemy.h);
      ctx.fillRect(enemy.x, enemy.y + 7, enemy.w, 10);
      ctx.fillStyle = "#14233a";
      ctx.fillRect(enemy.x + 8, enemy.y + 8, 5, 5);
      ctx.fillRect(enemy.x + enemy.w - 13, enemy.y + 8, 5, 5);
    });
    d.bullets.forEach(bullet => {
      if (!drawArtwork("playerShot", bullet.x - 3, bullet.y, bullet.w + 6, bullet.h)) {
        ctx.fillStyle = "#ffd66b";
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
      }
    });
    d.enemyShots.forEach(shot => {
      if (!drawArtwork("enemyShot", shot.x - 3, shot.y, shot.w + 6, shot.h)) {
        ctx.fillStyle = "#ff759f";
        ctx.fillRect(shot.x, shot.y, shot.w, shot.h);
      }
    });
    d.warnings.forEach(warning => {
      const enemy = warning.enemy;
      ctx.strokeStyle = Math.floor(warning.time * 18) % 2 ? "#ffffff" : "#ff759f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 21, 0, Math.PI * 2);
      ctx.stroke();
    });
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      if (!drawArtwork("player", d.player.x, d.player.y - 8, d.player.w, d.player.h + 8, { frame: Math.floor(state.elapsed * 8) })) {
        ctx.fillStyle = "#62e2df";
        ctx.beginPath();
        ctx.moveTo(d.player.x + 22, d.player.y);
        ctx.lineTo(d.player.x + 44, d.player.y + 22);
        ctx.lineTo(d.player.x, d.player.y + 22);
        ctx.closePath();
        ctx.fill();
      }
    }
    drawArtworkLayer("foreground");
    if (d.waveBanner > 0) {
      ctx.fillStyle = "rgba(3,10,24,.72)";
      ctx.fillRect(250, 270, 300, 62);
      ctx.fillStyle = "#ffd66b";
      ctx.font = "bold 30px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${text("WAVE", "גל")} ${d.wave}`, W / 2, 311);
      ctx.textAlign = "start";
    }
  }

  function swarmEnemies(wave = 1) {
    const enemies = [];
    const rows = wave === 1 ? 3 : 4;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 6; col++) {
        const x = 190 + col * 78;
        const y = 90 + row * 55;
        enemies.push({ baseX: x, baseY: y, x, y, w: 34, h: 28, alive: true, diving: false, diveT: 0, row, col });
      }
    }
    enemies.forEach(enemy => { enemy.mode = "formation"; enemy.telegraph = 0; enemy.returnT = 0; });
    return enemies;
  }

  function swarmCreate() {
    return {
      player: { x: 380, y: 535, w: 40, h: 28 },
      enemies: swarmEnemies(1), bullets: [], shotWait: 0, diveWait: 1.8,
      wave: 1, formation: 0, waveBanner: 1.3, invulnerable: 0, random: seeded(505)
    };
  }

  function swarmUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.waveBanner = Math.max(0, d.waveBanner - dt);
    d.formation += dt;
    const move = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    d.player.x = clamp(d.player.x + move * 285 * dt, 22, W - d.player.w - 22);
    d.shotWait -= dt;
    if ((input.held.has("action") || consume("action")) && d.shotWait <= 0) {
      d.bullets.push({ x: d.player.x + 17, y: d.player.y - 15, w: 6, h: 16 });
      d.shotWait = .22;
      tone(710, .03, "square");
    }
    d.diveWait -= dt;
    const activeDivers = d.enemies.filter(enemy => enemy.alive && enemy.mode !== "formation").length;
    const maxDivers = d.wave === 1 ? 1 : 2;
    if (d.diveWait <= 0 && activeDivers < maxDivers) {
      const candidates = d.enemies.filter(enemy => enemy.alive && enemy.mode === "formation");
      const diver = candidates[Math.floor(d.random() * candidates.length)];
      if (diver) {
        diver.mode = "telegraph";
        diver.telegraph = .72;
        diver.diveStartX = diver.x;
        diver.diveStartY = diver.y;
        diver.targetX = d.player.x + d.player.w / 2;
        diver.diveT = 0;
      }
      d.diveWait = Math.max(.85, 2.35 - d.wave * .28);
    }
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      if (enemy.mode === "formation") {
        enemy.diving = false;
        enemy.x = enemy.baseX + Math.sin(d.formation * 1.15) * 62;
        enemy.y = enemy.baseY + Math.sin(d.formation * 2 + enemy.col * .5) * 7;
      } else if (enemy.mode === "telegraph") {
        enemy.telegraph -= dt;
        enemy.diving = false;
        if (enemy.telegraph <= 0) {
          enemy.mode = "diving";
          enemy.diving = true;
          enemy.diveT = 0;
          tone(210, .09, "sawtooth");
        }
      } else if (enemy.mode === "diving") {
        enemy.diving = true;
        enemy.diveT += dt;
        const curve = clamp(enemy.diveT / 1.55, 0, 1);
        enemy.y = enemy.diveStartY + curve * 575;
        enemy.x = enemy.diveStartX + (enemy.targetX - enemy.diveStartX) * curve + Math.sin(curve * Math.PI * 2.2) * 105;
        if (enemy.y > H + 40) {
          enemy.mode = "returning";
          enemy.returnT = 0;
          enemy.returnX = enemy.x;
        }
      } else if (enemy.mode === "returning") {
        enemy.diving = false;
        enemy.returnT += dt / .9;
        const targetX = enemy.baseX + Math.sin(d.formation * 1.15) * 62;
        enemy.x = enemy.returnX + (targetX - enemy.returnX) * clamp(enemy.returnT, 0, 1);
        enemy.y = -35 + (enemy.baseY + 35) * clamp(enemy.returnT, 0, 1);
        if (enemy.returnT >= 1) enemy.mode = "formation";
      }
      if (enemy.mode === "diving" && hit(enemy, d.player) && d.invulnerable <= 0) {
        enemy.mode = "returning";
        enemy.returnT = 0;
        enemy.returnX = enemy.x;
        burst(d.player.x + 20, d.player.y + 12, "#ff759f", 16);
        loseLife();
      }
    });
    d.bullets.forEach(bullet => {
      bullet.y -= 450 * dt;
      const enemy = d.enemies.find(candidate => candidate.alive && hit(bullet, candidate));
      if (!enemy) return;
      enemy.alive = false;
      bullet.y = -100;
      state.score += enemy.mode === "diving" || enemy.mode === "telegraph" ? 175 : 75;
      burst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.mode === "diving" ? "#ff759f" : "#ffd66b", 13);
      tone(enemy.mode === "diving" ? 850 : 330, .06);
    });
    d.bullets = d.bullets.filter(bullet => bullet.y > -30);
    const aliveCount = d.enemies.filter(enemy => enemy.alive).length;
    if (!aliveCount) {
      if (d.wave >= 2) complete(true, "The comet lanes are clear.", "נתיבי השביטים נקיים.");
      else {
        d.wave++;
        d.enemies = swarmEnemies(d.wave);
        d.diveWait = 1.2;
        d.waveBanner = 1.7;
        state.score += 600;
        impact("#b891ff", 4);
      }
    }
    setStatus(`${text("Wave", "גל")} ${d.wave} • ${aliveCount}`);
  }

  function swarmDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) {
      drawBackground("#100b24", "#1b3154");
      drawStars(95, Math.floor(state.elapsed * 28));
    }
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      if (enemy.mode === "diving") {
        ctx.strokeStyle = "rgba(255,117,159,.35)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.w / 2, enemy.y - 42);
        ctx.lineTo(enemy.x + enemy.w / 2, enemy.y + 4);
        ctx.stroke();
      }
      const telegraphFlash = enemy.mode === "telegraph" && Math.floor(enemy.telegraph * 14) % 2 === 0;
      const slot = enemy.mode === "diving" || enemy.mode === "telegraph" ? "diver" : `enemy${enemy.row}`;
      const rotation = enemy.diving ? Math.sin(enemy.diveT * 5) * .6 : 0;
      if (!drawArtwork(slot, enemy.x, enemy.y, enemy.w, enemy.h, { rotation, alpha: telegraphFlash ? .55 : 1, frame: Math.floor((state.elapsed + enemy.col * .12) * 8) })) {
        ctx.save();
        ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
        if (rotation) ctx.rotate(rotation);
        ctx.fillStyle = telegraphFlash ? "#ffffff" : enemy.diving ? "#ff759f" : ["#7be39e", "#ffd66b", "#8ea5ff", "#c29cff"][enemy.row];
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(17, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-17, 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      if (enemy.mode === "telegraph") {
        ctx.strokeStyle = "#ff759f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 25 + enemy.telegraph * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([8, 7]);
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.w / 2, enemy.y + 28);
        ctx.lineTo(enemy.targetX, d.player.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    d.bullets.forEach(bullet => {
      if (!drawArtwork("shot", bullet.x - 3, bullet.y, bullet.w + 6, bullet.h)) {
        ctx.fillStyle = "#62e2df";
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
      }
    });
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      if (!drawArtwork("player", d.player.x, d.player.y, d.player.w, d.player.h, { frame: Math.floor(state.elapsed * 8) })) {
        ctx.fillStyle = "#f0f7ff";
        ctx.beginPath();
        ctx.moveTo(d.player.x + 20, d.player.y);
        ctx.lineTo(d.player.x + 40, d.player.y + 28);
        ctx.lineTo(d.player.x + 20, d.player.y + 20);
        ctx.lineTo(d.player.x, d.player.y + 28);
        ctx.closePath();
        ctx.fill();
      }
    }
    drawArtworkLayer("foreground");
    if (d.waveBanner > 0) {
      ctx.fillStyle = "rgba(10,5,28,.72)";
      ctx.fillRect(250, 270, 300, 62);
      ctx.fillStyle = "#ffd66b";
      ctx.font = "bold 30px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${text("SWARM", "נחיל")} ${d.wave}`, W / 2, 311);
      ctx.textAlign = "start";
    }
  }

  function runnerDefenders(random) {
    return [
      { x: 130, y: 410, w: 42, h: 42, vx: 88, type: "patrol", minX: 70, maxX: 325, minY: 365, maxY: 455 },
      { x: 620, y: 330, w: 42, h: 42, vx: -92, type: "chase", minX: 475, maxX: 730, minY: 285, maxY: 390 },
      { x: 180, y: 240, w: 42, h: 42, vx: 102, type: "patrol", minX: 95, maxX: 330, minY: 200, maxY: 290 },
      { x: 540, y: 170, w: 42, h: 42, vx: -84, type: "chase", minX: 470, maxX: 690, minY: 145, maxY: 220 }
    ].map(item => ({ ...item, homeX: item.x, homeY: item.y, phase: random() * 2 }));
  }

  function runnerCreate() {
    const random = seeded(606);
    return {
      player: { x: 380, y: 510, w: 34, h: 42 },
      ball: { x: 397, y: 500, r: 9, shot: false, vx: 0, vy: 0 },
      defenders: runnerDefenders(random),
      boosts: [{ x: 105, y: 350 }, { x: 675, y: 270 }, { x: 390, y: 205 }],
      collected: new Set(), boost: 0, clock: 60, goals: 0, shootingZone: false,
      aimX: 400, resetDelay: 0, message: "", messageGood: false,
      keeper: { x: 365, y: 48, w: 70, h: 18, vx: 105 },
      invulnerable: 0, random
    };
  }

  function runnerReset() {
    const d = state.data;
    d.player.x = 380;
    d.player.y = 510;
    d.ball = { x: 397, y: 500, r: 9, shot: false, vx: 0, vy: 0 };
    d.shootingZone = false;
    d.aimX = 400;
    d.defenders.forEach(defender => {
      defender.x = defender.homeX;
      defender.y = defender.homeY;
    });
  }

  function runnerResult(message, good) {
    const d = state.data;
    d.message = message;
    d.messageGood = good;
    d.resetDelay = .9;
    impact(good ? "#ffd66b" : "#ff759f", good ? 4 : 2);
  }

  function runnerUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.boost = Math.max(0, d.boost - dt);
    if (d.resetDelay > 0) {
      d.resetDelay -= dt;
      if (d.resetDelay <= 0) {
        runnerReset();
        d.message = "";
      }
      setStatus(d.message);
      return;
    }
    d.clock -= dt;
    const speed = d.boost > 0 ? 260 : 190;
    if (!d.ball.shot) {
      let dx = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
      let dy = (input.held.has("up") ? -1 : 0) + (input.held.has("down") ? 1 : 0);
      if (dx && dy) {
        dx *= .707;
        dy *= .707;
      }
      d.player.x = clamp(d.player.x + dx * speed * dt, 58, 708);
      d.player.y = clamp(d.player.y + dy * speed * dt, 104, 535);
      d.ball.x = d.player.x + d.player.w / 2 + Math.sin(state.elapsed * 10) * 5;
      d.ball.y = d.player.y - 8;
      const enteredZone = !d.shootingZone && d.player.y < 178;
      d.shootingZone = d.player.y < 178;
      if (enteredZone) d.aimX = clamp(d.player.x + d.player.w / 2, 258, 542);
      if (d.shootingZone) {
        d.aimX = clamp(d.aimX + dx * 245 * dt, 235, 565);
        if (consume("alt")) d.aimX = 400;
      }
      if (d.shootingZone && consume("action")) {
        const targetX = d.aimX;
        const distance = Math.max(1, d.ball.y - 30);
        const flightTime = distance / 430;
        d.ball.shot = true;
        d.ball.vy = -430;
        d.ball.vx = (targetX - d.ball.x) / flightTime;
        tone(310, .1);
      }
    } else {
      const previousY = d.ball.y;
      d.ball.x += d.ball.vx * dt;
      d.ball.y += d.ball.vy * dt;
      const keeperCenter = d.keeper.x + d.keeper.w / 2;
      if (previousY > d.keeper.y + d.keeper.h && d.ball.y <= d.keeper.y + d.keeper.h &&
          Math.abs(d.ball.x - keeperCenter) < d.keeper.w / 2 + d.ball.r) {
        d.ball.vy = 0;
        d.ball.vx = 0;
        burst(d.ball.x, d.ball.y, "#ffffff", 12);
        tone(155, .12, "square");
        runnerResult(text("Saved by the keeper!", "השוער עצר!"), false);
      } else if (d.ball.y < 28) {
        if (d.ball.x > 250 && d.ball.x < 550) {
          d.goals++;
          state.score += 1000 + Math.floor(d.clock * 10);
          burst(d.ball.x, 36, "#ffd66b", 24, 210);
          tone(880, .2);
          if (d.goals >= 3) {
            complete(true, "Hat trick! Three goals reached the Atlas net.", "שלושער! שלושה שערים נכנסו לרשת האטלס.");
            return;
          }
          runnerResult(text("Goal!", "שער!"), true);
        } else {
          tone(140, .1);
          runnerResult(text("Wide of the posts", "מחוץ למסגרת"), false);
        }
      }
    }
    if (d.ball.shot) {
      const target = clamp(d.ball.x - d.keeper.w / 2, 250, 550 - d.keeper.w);
      d.keeper.x += clamp(target - d.keeper.x, -235 * dt, 235 * dt);
    } else {
      d.keeper.x += d.keeper.vx * dt;
      if (d.keeper.x < 255 || d.keeper.x + d.keeper.w > 545) d.keeper.vx *= -1;
      d.keeper.x = clamp(d.keeper.x, 255, 545 - d.keeper.w);
    }
    d.defenders.forEach((defender, index) => {
      const distance = Math.hypot(d.player.x - defender.x, d.player.y - defender.y);
      if (defender.type === "chase" && distance < 140 && !d.ball.shot) {
        const chaseSpeed = 68 + index * 4;
        defender.x += (d.player.x > defender.x ? 1 : -1) * chaseSpeed * dt;
        defender.y += (d.player.y > defender.y ? 1 : -1) * chaseSpeed * .55 * dt;
      } else {
        defender.x += defender.vx * dt;
        defender.y += Math.sin(state.elapsed * 1.8 + defender.phase) * 9 * dt;
      }
      if (defender.x < defender.minX || defender.x + defender.w > defender.maxX) defender.vx *= -1;
      defender.x = clamp(defender.x, defender.minX, defender.maxX - defender.w);
      defender.y = clamp(defender.y, defender.minY, defender.maxY);
      const playerHitbox = { x: d.player.x + 6, y: d.player.y + 4, w: d.player.w - 12, h: d.player.h - 7 };
      const defenderHitbox = { x: defender.x + 8, y: defender.y + 2, w: defender.w - 16, h: defender.h - 6 };
      if (!d.ball.shot && hit(playerHitbox, defenderHitbox) && d.invulnerable <= 0) {
        state.score = Math.max(0, state.score - 200);
        burst(d.player.x + 17, d.player.y, "#ff759f", 15);
        loseLife();
        if (!state.ended) runnerResult(text("Tackled — reset!", "תיקול — מתחילים מחדש!"), false);
      }
    });
    d.boosts.forEach((boost, index) => {
      if (d.collected.has(index)) return;
      const box = { x: boost.x - 14, y: boost.y - 14, w: 28, h: 28 };
      if (hit(d.player, box)) {
        d.collected.add(index);
        d.boost = 5;
        state.score += 150;
        tone(720, .08);
      }
    });
    setStatus(`${d.goals} / 3 • ${Math.max(0, Math.ceil(d.clock))}s`);
    if (d.clock <= 0) complete(false, "The match clock expired before the third goal.", "שעון המשחק הסתיים לפני השער השלישי.");
  }

  function runnerDraw() {
    const d = state.data;
    if (!drawArtworkLayer("backdrop")) {
      ctx.fillStyle = "#174f3a";
      ctx.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += 80) {
        ctx.fillStyle = y % 160 ? "#1d5a40" : "#236548";
        ctx.fillRect(50, y, 700, 80);
      }
      ctx.strokeStyle = "rgba(255,255,255,.72)";
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 20, 700, 560);
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(750, 150);
      ctx.stroke();
      ctx.fillStyle = "rgba(98,226,223,.12)";
      ctx.fillRect(52, 22, 696, 128);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(250, 20, 300, 60);
      ctx.fillStyle = "#dcecf1";
      ctx.fillRect(250, 20, 300, 8);
      ctx.fillStyle = "#071426";
      ctx.font = "bold 15px system-ui";
      ctx.fillText(text("SHOOTING ZONE", "אזור בעיטה"), 335, 136);
    }
    drawArtworkLayer("fieldOverlay");
    if (!drawArtwork("keeper", d.keeper.x, d.keeper.y - 8, d.keeper.w, d.keeper.h + 16)) {
      ctx.fillStyle = "#ffd66b";
      ctx.fillRect(d.keeper.x, d.keeper.y, d.keeper.w, d.keeper.h);
      ctx.fillStyle = "#0b2632";
      ctx.fillRect(d.keeper.x + 8, d.keeper.y + 5, d.keeper.w - 16, 5);
    }
    d.boosts.forEach((boost, index) => {
      if (d.collected.has(index)) return;
      if (drawArtwork("boost", boost.x - 16, boost.y - 16, 32, 32, { frame: Math.floor(state.elapsed * 8) })) return;
      ctx.fillStyle = "#62e2df";
      ctx.beginPath();
      ctx.moveTo(boost.x, boost.y - 15);
      ctx.lineTo(boost.x + 13, boost.y + 12);
      ctx.lineTo(boost.x - 13, boost.y + 12);
      ctx.closePath();
      ctx.fill();
    });
    d.defenders.forEach(defender => {
      if (drawArtwork(defender.type === "chase" ? "defenderChase" : "defenderPatrol", defender.x, defender.y - 16, defender.w, defender.h + 16, { frame: Math.floor((state.elapsed + defender.phase) * 8), flipX: defender.vx < 0 })) return;
      ctx.fillStyle = defender.type === "chase" ? "#ff759f" : "#ff9e67";
      ctx.fillRect(defender.x + 7, defender.y, 28, 23);
      ctx.fillStyle = "#f4c9a4";
      ctx.beginPath();
      ctx.arc(defender.x + 21, defender.y - 7, 9, 0, Math.PI * 2);
      ctx.fill();
    });
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      if (!drawArtwork("player", d.player.x, d.player.y - 18, d.player.w, d.player.h + 18, { frame: Math.floor(state.elapsed * 9) })) {
        ctx.fillStyle = "#ffd66b";
        ctx.fillRect(d.player.x + 5, d.player.y, 24, 28);
        ctx.fillStyle = "#efc39f";
        ctx.beginPath();
        ctx.arc(d.player.x + 17, d.player.y - 8, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (!drawArtwork("ball", d.ball.x - d.ball.r, d.ball.y - d.ball.r, d.ball.r * 2, d.ball.r * 2, { frame: Math.floor(state.elapsed * 10), rotation: state.elapsed * 4 })) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(d.ball.x, d.ball.y, d.ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#263746";
      ctx.stroke();
    }
    drawArtworkLayer("foreground");
    if (d.shootingZone && !d.ball.shot) {
      ctx.save();
      ctx.setLineDash([9, 7]);
      ctx.strokeStyle = "#ffd66b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(d.ball.x, d.ball.y - 5);
      ctx.lineTo(d.aimX, 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(d.aimX, 35, 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (d.boost > 0) {
      ctx.strokeStyle = "#62e2df";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.player.x + 17, d.player.y + 13, 28 + Math.sin(state.elapsed * 8) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (d.message) {
      ctx.fillStyle = "rgba(3,20,24,.78)";
      ctx.fillRect(245, 275, 310, 64);
      ctx.fillStyle = d.messageGood ? "#ffd66b" : "#ffffff";
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(d.message, W / 2, 316);
      ctx.textAlign = "start";
    }
  }

  const GAMES = {
    "road-rally": { create: roadCreate, update: roadUpdate, draw: roadDraw, snapshot: d => ({ distance: Math.floor(d.distance), fuel: Math.ceil(d.fuel), speed: Math.floor(d.speed), traffic: d.traffic.length }) },
    "sky-blocks": { create: blocksCreate, update: blocksUpdate, draw: blocksDraw, snapshot: d => ({ lines: d.lines, level: d.level, piece: d.current?.type, nextPiece: d.next, ghostY: d.current ? blockGhostY(d) : null, combo: d.combo, filledCells: d.board.flat().filter(Boolean).length }) },
    "spark-maze": { create: mazeCreate, update: mazeUpdate, draw: mazeDraw, snapshot: d => ({ sparksRemaining: d.sparks.size, shieldSeconds: Number(d.shield.toFixed(1)), invulnerableSeconds: Number(d.invulnerable.toFixed(1)), player: { ...d.player }, enemies: d.enemies.map(enemy => ({ x: enemy.x, y: enemy.y, returning: enemy.homeTimer > 0 })) }) },
    "star-guard": { create: guardCreate, update: guardUpdate, draw: guardDraw, snapshot: d => ({ wave: d.wave, enemiesRemaining: d.enemies.filter(enemy => enemy.alive).length, playerX: Math.round(d.player.x), enemyShots: d.enemyShots.length, barriers: d.barriers.map(barrier => barrier.hp) }) },
    "comet-swarm": { create: swarmCreate, update: swarmUpdate, draw: swarmDraw, snapshot: d => ({ wave: d.wave, enemiesRemaining: d.enemies.filter(enemy => enemy.alive).length, diving: d.enemies.filter(enemy => enemy.alive && enemy.mode === "diving").length, telegraphing: d.enemies.filter(enemy => enemy.alive && enemy.mode === "telegraph").length }) },
    "goal-runner": { create: runnerCreate, update: runnerUpdate, draw: runnerDraw, snapshot: d => ({ goals: d.goals, clock: Number(d.clock.toFixed(1)), shootingZone: d.shootingZone, aimX: Math.round(d.aimX), keeperX: Math.round(d.keeper.x), ballInFlight: d.ball.shot, result: d.message }) }
  };

  const CONTROL_COPY = {
    "road-rally": { action: null, alt: null },
    "sky-blocks": { action: ["Hard drop", "הפלה"], alt: ["Rotate", "סיבוב"] },
    "spark-maze": { action: null, alt: null },
    "star-guard": { action: ["Fire", "ירי"], alt: null },
    "comet-swarm": { action: ["Fire", "ירי"], alt: null },
    "goal-runner": { action: ["Shoot", "בעיטה"], alt: ["Center aim", "מרכז כוונת"] }
  };

  function islandHref(island) {
    return island === 1 ? "../index.html" : `../${islandFolders[island]}index.html`;
  }

  function renderCopy() {
    const copy = COPY[state.gameId];
    const hebrew = language() === "he";
    document.documentElement.lang = hebrew ? "he" : "en";
    document.body.dataset.game = state.gameId;
    $("page-title").textContent = hebrew ? "ארקייד הבונוס של אטלס" : "Atlas Bonus Arcade";
    $("game-title").textContent = hebrew ? copy.nameHe : copy.name;
    $("game-goal").textContent = hebrew ? copy.goalHe : copy.goal;
    $("game-instructions").innerHTML = `<p>${hebrew ? copy.instructionsHe : copy.instructions}</p><p><strong>${hebrew ? "מקשים נוספים:" : "Also:"}</strong> P = ${hebrew ? "השהיה" : "pause"}, R = ${hebrew ? "התחלה מחדש" : "restart"}.</p>`;
    $("game-instructions").dir = hebrew ? "rtl" : "ltr";
    $("score-label").textContent = hebrew ? "ניקוד" : "Score";
    $("best-label").textContent = hebrew ? "שיא" : "Best";
    $("lives-label").textContent = hebrew ? "חיים" : "Lives";
    $("status-label").textContent = hebrew ? "מצב" : "Status";
    $("pause-button").textContent = state.paused ? (hebrew ? "המשך" : "Resume") : (hebrew ? "השהיה" : "Pause");
    $("pause-button").setAttribute("aria-pressed", String(state.paused));
    $("restart-button").textContent = hebrew ? "התחלה מחדש" : "Restart";
    $("page-subtitle").textContent = hebrew ? "שישה משחקים מקוריים שנפתחים לאורך המסע." : "Six original games unlocked across the expedition.";
    document.querySelector(".game-picker label").textContent = hebrew ? "בחירת משחק" : "Choose game";
    $("game-select").setAttribute("aria-label", hebrew ? "בחירת משחק בונוס" : "Choose a bonus game");
    canvas.setAttribute("aria-label", `${hebrew ? copy.nameHe : copy.name}. ${hebrew ? copy.goalHe : copy.goal}`);
    $("island-note").textContent = hebrew ? `משחק הבונוס של אי ${state.island}. השיא נשמר במכשיר זה בלבד.` : `Island ${state.island} bonus game. Best score is stored only on this device.`;
    $("return-button").href = islandHref(state.island);
    $("map-button").href = "../map/index.html";
    const controls = CONTROL_COPY[state.gameId];
    const actionButton = document.querySelector('[data-control="action"]');
    const altButton = document.querySelector('[data-control="alt"]');
    [[actionButton, controls.action], [altButton, controls.alt]].forEach(([button, copyPair]) => {
      button.hidden = !copyPair;
      if (copyPair) {
        button.textContent = hebrew ? copyPair[1] : copyPair[0];
        button.setAttribute("aria-label", button.textContent);
      }
    });
    const horizontalOnly = state.gameId === "star-guard" || state.gameId === "comet-swarm";
    document.querySelector(".touch-dpad").classList.toggle("horizontal-only", horizontalOnly);
    document.querySelectorAll("[data-control]").forEach(button => {
      const direction = button.dataset.control;
      if (!["up", "left", "down", "right"].includes(direction)) return;
      button.hidden = horizontalOnly && (direction === "up" || direction === "down");
      const names = {
        up: ["Move up", "תנועה למעלה"], left: ["Move left", "תנועה שמאלה"],
        down: ["Move down", "תנועה למטה"], right: ["Move right", "תנועה ימינה"]
      };
      button.setAttribute("aria-label", hebrew ? names[direction][1] : names[direction][0]);
    });
    renderSelector();
    if (state.phase === "countdown") {
      setStatus(text("Ready", "מוכנים"));
      showCountdownOverlay();
    } else if (state.phase === "paused") {
      pause(true);
    } else if (state.phase === "ended") {
      renderEndOverlay();
    }
    renderHud();
  }

  function renderSelector() {
    const select = $("game-select");
    const available = new Set(completedIslands());
    select.replaceChildren();
    Object.entries(ISLAND_GAME_MAP).forEach(([islandValue, gameId]) => {
      const island = Number(islandValue);
      if (!available.has(island)) return;
      const option = document.createElement("option");
      option.value = gameId;
      option.textContent = `${island}. ${language() === "he" ? COPY[gameId].nameHe : COPY[gameId].name}`;
      select.append(option);
    });
    select.value = state.gameId;
  }

  function renderHud() {
    $("score-value").textContent = Math.floor(state.score);
    $("best-value").textContent = Math.max(state.best, Math.floor(state.score));
    $("lives-value").textContent = state.lives;
    $("status-value").textContent = state.status;
  }

  function showCountdownOverlay() {
    const copy = COPY[state.gameId];
    $("overlay-kicker").textContent = `${text("ISLAND", "אי")} ${state.island}`;
    $("overlay-title").textContent = String(Math.max(1, Math.ceil(state.countdown)));
    $("overlay-message").textContent = `${text(copy.goal, copy.goalHe)} ${text("Get ready!", "התכוננו!")}`;
    $("overlay-score").textContent = text("Use the controls below or press a game key to start now.", "השתמשו בפקדים למטה או לחצו על מקש משחק כדי להתחיל מיד.");
    $("play-again-button").textContent = text("Start now", "התחלה עכשיו");
    $("return-button").hidden = true;
    $("map-button").hidden = true;
    $("game-overlay").hidden = false;
  }

  function beginRun(skipCountdown = false) {
    if (!state || state.phase !== "countdown") return;
    if (!skipCountdown && state.countdown > 0) return;
    state.phase = "running";
    state.running = true;
    state.countdown = 0;
    $("game-overlay").hidden = true;
    canvas.focus({ preventScroll: true });
    setStatus(text("Go!", "צאו לדרך!"));
    announce(text("Go!", "צאו לדרך!"));
    tone(760, .08);
  }

  function startGame(gameId) {
    if (!GAMES[gameId]) gameId = ISLAND_GAME_MAP[1];
    state = baseState(gameId);
    state.data = GAMES[gameId].create();
    input.held.clear();
    input.pressed.clear();
    effects.particles = [];
    effects.shake = 0;
    effects.flash = 0;
    api.currentGameId = gameId;
    renderCopy();
    renderHud();
    GAMES[gameId].draw();
    showCountdownOverlay();
    announce(`${COPY[gameId].name}. ${COPY[gameId].goal}. ${text("Starting in three.", "מתחילים בעוד שלוש.")}`);
    return api.getSnapshot();
  }

  function restart() {
    return startGame(state.gameId);
  }

  function pause(force) {
    if (state.ended || state.phase === "countdown") return false;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    state.running = !state.paused;
    state.phase = state.paused ? "paused" : "running";
    setStatus(state.paused ? text("Paused", "מושהה") : text("Playing", "משחק פעיל"));
    $("pause-button").textContent = state.paused ? text("Resume", "המשך") : text("Pause", "השהיה");
    $("pause-button").setAttribute("aria-pressed", String(state.paused));
    if (state.paused) {
      $("overlay-kicker").textContent = text("TAKE A BREATH", "קחו נשימה");
      $("overlay-title").textContent = text("Paused", "מושהה");
      $("overlay-message").textContent = text("Your run is frozen exactly where you left it.", "הריצה נעצרה בדיוק במקום שבו עזבתם.");
      $("overlay-score").textContent = `${text("Score", "ניקוד")}: ${Math.floor(state.score)}`;
      $("play-again-button").textContent = text("Resume", "המשך");
      $("return-button").hidden = true;
      $("map-button").hidden = true;
      $("game-overlay").hidden = false;
      requestAnimationFrame(() => $("play-again-button").focus({ preventScroll: true }));
    } else {
      $("game-overlay").hidden = true;
      canvas.focus({ preventScroll: true });
    }
    announce(state.status);
    renderHud();
    return state.paused;
  }

  function getSnapshot() {
    return {
      gameId: state?.gameId || null,
      running: Boolean(state?.running && !state?.paused && !state?.ended),
      phase: state?.phase || "uninitialized",
      score: Math.floor(state?.score || 0),
      lives: state?.lives ?? 0,
      status: state?.status || "uninitialized",
      ...(state?.data ? GAMES[state.gameId].snapshot(state.data) : {})
    };
  }

  function loop(now) {
    const dt = Math.min(.034, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    if (state?.phase === "countdown") {
      state.countdown -= dt;
      const nextNumber = Math.max(1, Math.ceil(state.countdown));
      if ($("overlay-title").textContent !== String(nextNumber)) $("overlay-title").textContent = String(nextNumber);
      if (state.countdown <= 0) beginRun();
    } else if (state && state.running && !state.paused && !state.ended) {
      state.elapsed += dt;
      GAMES[state.gameId].update(dt);
      saveBest();
    }
    if (state?.phase === "running") updateEffects(dt);
    if (state) {
      const shakeX = effects.shake ? Math.sin(now * .07) * effects.shake : 0;
      const shakeY = effects.shake ? Math.cos(now * .09) * effects.shake * .65 : 0;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(shakeX, shakeY);
      GAMES[state.gameId].draw();
      drawEffects();
      ctx.restore();
      renderHud();
    }
    input.pressed.clear();
    frame = requestAnimationFrame(loop);
  }

  const keyMap = {
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down",
    " ": "action", Enter: "action", z: "action", Z: "action",
    x: "alt", X: "alt"
  };

  document.addEventListener("keydown", event => {
    if (event.target.closest?.("button, a, select, input, textarea")) return;
    if (event.key === "p" || event.key === "P" || event.key === "Escape") {
      event.preventDefault();
      pause();
      return;
    }
    if (event.key === "r" || event.key === "R") {
      event.preventDefault();
      restart();
      return;
    }
    const control = keyMap[event.key];
    if (!control) return;
    event.preventDefault();
    if (state?.phase === "countdown") beginRun(true);
    if (!input.held.has(control)) input.pressed.add(control);
    input.held.add(control);
  });

  document.addEventListener("keyup", event => {
    const control = keyMap[event.key];
    if (control) input.held.delete(control);
  });

  document.querySelectorAll("[data-control]").forEach(button => {
    const control = button.dataset.control;
    const press = event => {
      event.preventDefault();
      if (state?.phase === "countdown") beginRun(true);
      input.pressed.add(control);
      input.held.add(control);
      button.classList.add("is-held");
      try {
        button.setPointerCapture?.(event.pointerId);
      } catch {}
    };
    const release = event => {
      event.preventDefault();
      input.held.delete(control);
      button.classList.remove("is-held");
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("contextmenu", event => event.preventDefault());
  });

  $("pause-button").addEventListener("click", () => pause());
  $("restart-button").addEventListener("click", restart);
  $("play-again-button").addEventListener("click", () => {
    if (state.phase === "countdown") beginRun(true);
    else if (state.phase === "paused") pause(false);
    else restart();
  });
  $("english-button").addEventListener("click", () => {
    window.AtlasLanguage?.set?.("en");
    renderCopy();
  });
  $("hebrew-button").addEventListener("click", () => {
    window.AtlasLanguage?.set?.("he");
    renderCopy();
  });
  $("game-select").addEventListener("change", event => {
    const gameId = event.target.value;
    const island = reverseMap[gameId];
    try {
      const url = new URL(location.href);
      url.search = `?island=${island}`;
      history.replaceState(null, "", url);
    } catch {}
    startGame(gameId);
  });
  window.addEventListener("blur", () => {
    if (state?.running && !state?.ended) pause(true);
  });
  window.addEventListener("atlas-language", renderCopy);

  Object.entries(window.AtlasBonusArtwork || {}).forEach(([gameId, manifest]) => {
    configureArtwork(gameId, manifest);
  });

  const api = {
    mapping: ISLAND_GAME_MAP,
    artworkSlots: ARTWORK_SLOTS,
    currentGameId: null,
    startGame,
    restart,
    pause,
    getSnapshot,
    configureArtwork,
    getArtworkStatus: artworkStatus
  };
  window.AtlasBonusGames = api;

  const availableIslands = completedIslands();
  if (!availableIslands.length) {
    location.replace("../map/index.html");
    return;
  }
  const requestedIsland = clamp(Number(new URLSearchParams(location.search).get("island")) || availableIslands[0], 1, 6);
  const initialIsland = availableIslands.includes(requestedIsland) ? requestedIsland : availableIslands[availableIslands.length - 1];
  startGame(ISLAND_GAME_MAP[initialIsland]);
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(loop);
})();
