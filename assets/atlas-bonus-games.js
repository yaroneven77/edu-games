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

  function complete(success, message, messageHe) {
    if (state.ended) return;
    state.running = false;
    state.ended = true;
    state.success = success;
    setStatus(success ? text("Complete", "הושלם") : text("Game over", "המשחק הסתיים"));
    saveBest();
    $("overlay-title").textContent = success ? text("Challenge complete!", "האתגר הושלם!") : text("Try again", "נסו שוב");
    $("overlay-message").textContent = text(message, messageHe);
    $("play-again-button").textContent = text("Play again", "שחקו שוב");
    $("return-button").textContent = text("Return to island", "חזרה לאי");
    $("map-button").textContent = mode === "sandbox" ? text("Sandbox map", "מפת ארגז החול") : text("Expedition map", "מפת המסע");
    $("game-overlay").hidden = false;
    announce($("overlay-title").textContent);
    tone(success ? 760 : 170, .22, success ? "sine" : "sawtooth");
    renderHud();
  }

  function loseLife(reset) {
    if (state.data.invulnerable > 0) return;
    state.lives--;
    state.data.invulnerable = 1.5;
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
      running: true,
      paused: false,
      ended: false,
      success: false,
      score: 0,
      best: loadBest(gameId),
      lives: 3,
      status: text("Playing", "משחק פעיל"),
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
      player: { x: 378, y: 485, w: 44, h: 78 },
      speed: 90, fuel: 100, distance: 0, roadScroll: 0,
      traffic: [], fuels: [], spawn: .4, fuelSpawn: 5, invulnerable: 0,
      random: seeded(101)
    };
  }

  function roadUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    const accelerating = input.held.has("up");
    const braking = input.held.has("down");
    d.speed += (accelerating ? 90 : -28) * dt;
    if (braking) d.speed -= 130 * dt;
    d.speed = clamp(d.speed, 55, 270);
    const steer = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    d.player.x = clamp(d.player.x + steer * (190 + d.speed * .25) * dt, 176, 580);
    d.distance += d.speed * dt * .13;
    d.fuel -= (1.05 + d.speed / 300) * dt;
    d.roadScroll = (d.roadScroll + d.speed * dt) % 100;
    d.spawn -= dt;
    if (d.spawn <= 0) {
      const lane = Math.floor(d.random() * 4);
      d.traffic.push({ x: 190 + lane * 100 + 17, y: -95, w: 46, h: 78, speed: 35 + d.random() * 75, color: ["#ff759f", "#ffc857", "#8b9cff", "#7ce0a1"][lane] });
      d.spawn = .72 + d.random() * .7;
    }
    d.fuelSpawn -= dt;
    if (d.fuelSpawn <= 0) {
      d.fuels.push({ x: 215 + Math.floor(d.random() * 4) * 100, y: -40, w: 30, h: 30 });
      d.fuelSpawn = 6 + d.random() * 3;
    }
    d.traffic.forEach(car => {
      car.y += (d.speed - car.speed + 90) * dt;
      if (hit(d.player, car) && d.invulnerable <= 0) {
        car.y = H + 100;
        d.speed = 65;
        d.fuel = Math.max(0, d.fuel - 10);
        loseLife();
      }
    });
    d.fuels.forEach(cell => {
      cell.y += (d.speed + 70) * dt;
      if (hit(d.player, cell)) {
        cell.y = H + 100;
        d.fuel = Math.min(100, d.fuel + 24);
        state.score += 150;
        tone(690);
      }
    });
    d.traffic = d.traffic.filter(car => car.y < H + 90);
    d.fuels = d.fuels.filter(cell => cell.y < H + 50);
    state.score = Math.max(state.score, Math.floor(d.distance * 10));
    setStatus(`${Math.floor(d.distance)} / 1000 m`);
    if (d.distance >= 1000) complete(true, "You reached the rally beacon with fuel to spare.", "הגעתם למשואת הראלי ונשאר לכם דלק.");
    if (d.fuel <= 0) complete(false, "The fuel cell ran dry before the beacon.", "תא הדלק התרוקן לפני המשואה.");
  }

  function roadDraw() {
    const d = state.data;
    drawBackground("#112843", "#36526b");
    ctx.fillStyle = "#183925";
    ctx.fillRect(0, 0, 155, H);
    ctx.fillRect(645, 0, 155, H);
    ctx.fillStyle = "#303d4c";
    ctx.fillRect(155, 0, 490, H);
    ctx.fillStyle = "#b9ced7";
    ctx.fillRect(155, 0, 8, H);
    ctx.fillRect(637, 0, 8, H);
    ctx.fillStyle = "#f8dfa0";
    for (let lane = 1; lane < 4; lane++) {
      for (let y = -100 + d.roadScroll; y < H; y += 100) ctx.fillRect(155 + lane * 122 - 4, y, 8, 54);
    }
    d.fuels.forEach(cell => {
      ctx.fillStyle = "#62e2df";
      ctx.beginPath();
      ctx.arc(cell.x + 15, cell.y + 15, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0d3540";
      ctx.fillRect(cell.x + 12, cell.y + 6, 6, 18);
      ctx.fillRect(cell.x + 6, cell.y + 12, 18, 6);
    });
    d.traffic.forEach(car => drawCar(car));
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) drawCar({ ...d.player, color: "#62e2df" });
    ctx.fillStyle = "rgba(5,16,28,.8)";
    ctx.fillRect(18, 18, 178, 25);
    ctx.fillStyle = "#243f52";
    ctx.fillRect(25, 25, 164, 11);
    ctx.fillStyle = d.fuel < 25 ? "#ff759f" : "#71e39b";
    ctx.fillRect(25, 25, 164 * d.fuel / 100, 11);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px system-ui";
    ctx.fillText(`FUEL ${Math.ceil(d.fuel)}%`, 64, 39);
  }

  function drawCar(car) {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x + 4, car.y, car.w - 8, car.h);
    ctx.fillStyle = "#10243a";
    ctx.fillRect(car.x + 10, car.y + 12, car.w - 20, 18);
    ctx.fillRect(car.x + 10, car.y + car.h - 30, car.w - 20, 17);
    ctx.fillStyle = "#fff4a6";
    ctx.fillRect(car.x + 7, car.y + 3, 8, 5);
    ctx.fillRect(car.x + car.w - 15, car.y + 3, 8, 5);
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
      current: null, next: 0, lines: 0, level: 1, fall: 0, moveWait: 0,
      random: seeded(202), invulnerable: 0
    };
    data.next = Math.floor(data.random() * BLOCK_SHAPES.length);
    blockSpawn(data);
    return data;
  }

  function blockSpawn(d) {
    const type = d.next;
    d.next = Math.floor(d.random() * BLOCK_SHAPES.length);
    d.current = { type, matrix: BLOCK_SHAPES[type].map(row => [...row]), x: 3, y: -1 };
    if (blockCollides(d, d.current, 0, 0)) complete(false, "The stack reached the cloud ceiling.", "המגדל הגיע לתקרת העננים.");
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
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!blockCollides(d, d.current, kick, 0, rotated)) {
        d.current.x += kick;
        d.current.matrix = rotated;
        tone(440, .04);
        return;
      }
    }
  }

  function blockLock(d) {
    d.current.matrix.forEach((row, y) => row.forEach((value, x) => {
      const by = d.current.y + y;
      if (value && by >= 0) d.board[by][d.current.x + x] = d.current.type + 1;
    }));
    let cleared = 0;
    for (let row = 19; row >= 0; row--) {
      if (d.board[row].every(Boolean)) {
        d.board.splice(row, 1);
        d.board.unshift(Array(10).fill(0));
        cleared++;
        row++;
      }
    }
    if (cleared) {
      d.lines += cleared;
      d.level = 1 + Math.floor(d.lines / 3);
      state.score += [0, 100, 300, 550, 900][cleared] * d.level;
      tone(620 + cleared * 70, .1);
    }
    if (d.lines >= 10) {
      complete(true, "Ten sky-lines cleared. The stack is stable.", "עשר שורות שמיים נוקו. המגדל יציב.");
      return;
    }
    blockSpawn(d);
  }

  function blocksUpdate(dt) {
    const d = state.data;
    d.moveWait -= dt;
    const direction = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    if ((consume("left") || consume("right") || (direction && d.moveWait <= 0)) && direction && !blockCollides(d, d.current, direction, 0)) {
      d.current.x += direction;
      d.moveWait = .1;
    }
    if (consume("up") || consume("alt")) blockRotate(d);
    if (consume("action")) {
      let dropped = 0;
      while (!blockCollides(d, d.current, 0, 1)) {
        d.current.y++;
        dropped++;
      }
      state.score += dropped * 2;
      blockLock(d);
      return;
    }
    d.fall += dt * (input.held.has("down") ? 12 : 1);
    const delay = Math.max(.1, .72 - (d.level - 1) * .095);
    if (d.fall >= delay) {
      d.fall = 0;
      if (!blockCollides(d, d.current, 0, 1)) d.current.y++;
      else blockLock(d);
    }
    setStatus(`${d.lines} / 10 ${text("lines", "שורות")}`);
  }

  function blocksDraw() {
    const d = state.data;
    drawBackground("#17182f", "#243a62");
    drawStars(70, Math.floor(state.elapsed * 12));
    const size = 27;
    const ox = 235;
    const oy = 28;
    ctx.fillStyle = "rgba(5,12,28,.88)";
    ctx.fillRect(ox - 7, oy - 7, size * 10 + 14, size * 20 + 14);
    d.board.forEach((row, y) => row.forEach((value, x) => {
      if (value) drawBlock(ox + x * size, oy + y * size, size, BLOCK_COLORS[value - 1]);
    }));
    d.current.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (value && d.current.y + y >= 0) drawBlock(ox + (d.current.x + x) * size, oy + (d.current.y + y) * size, size, BLOCK_COLORS[d.current.type]);
    }));
    ctx.fillStyle = "#d8e9ff";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(`${text("NEXT", "הבא")}  •  ${text("LEVEL", "שלב")} ${d.level}`, 540, 80);
    BLOCK_SHAPES[d.next].forEach((row, y) => row.forEach((value, x) => {
      if (value) drawBlock(570 + x * 25, 105 + y * 25, 25, BLOCK_COLORS[d.next]);
    }));
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
      powers: new Set(powerCells.map(cell => `${cell.x},${cell.y}`)),
      enemies: enemyStarts.map((cell, index) => ({ x: cell.x, y: cell.y, startX: cell.x, startY: cell.y, index })),
      enemyStep: .5, moveWait: 0, shield: 0, phase: 0, invulnerable: 0
    };
  }

  function mazeCanMove(x, y) {
    return MAZE[y]?.[x] === ".";
  }

  function mazeResetPositions() {
    const d = state.data;
    d.player = { ...d.start };
    d.enemies.forEach(enemy => {
      enemy.x = enemy.startX;
      enemy.y = enemy.startY;
    });
  }

  function mazeEnemyMove(enemy, d) {
    const choices = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => ({ x: enemy.x + dx, y: enemy.y + dy }))
      .filter(cell => mazeCanMove(cell.x, cell.y));
    const scatter = d.phase % 12 > 7;
    const targets = [{ x: 13, y: 1 }, { x: 1, y: 11 }, { x: 13, y: 11 }];
    const target = scatter ? targets[enemy.index] : d.player;
    choices.sort((a, b) => {
      const da = Math.abs(a.x - target.x) + Math.abs(a.y - target.y);
      const db = Math.abs(b.x - target.x) + Math.abs(b.y - target.y);
      return da - db || a.y - b.y || a.x - b.x;
    });
    if (choices[0]) {
      enemy.x = choices[0].x;
      enemy.y = choices[0].y;
    }
  }

  function mazeUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.shield = Math.max(0, d.shield - dt);
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
      d.moveWait = .105;
      const key = `${d.player.x},${d.player.y}`;
      if (d.sparks.delete(key)) {
        state.score += 25;
        tone(570, .035);
      }
      if (d.powers.delete(key)) {
        d.shield = 7;
        state.score += 100;
        tone(820, .12);
      }
    }
    d.enemyStep -= dt;
    if (d.enemyStep <= 0) {
      d.enemies.forEach(enemy => mazeEnemyMove(enemy, d));
      d.enemyStep = d.shield > 0 ? .72 : .42;
    }
    d.enemies.forEach(enemy => {
      if (enemy.x !== d.player.x || enemy.y !== d.player.y) return;
      if (d.shield > 0) {
        enemy.x = enemy.startX;
        enemy.y = enemy.startY;
        state.score += 200;
        tone(300, .1);
      } else if (d.invulnerable <= 0) {
        loseLife(mazeResetPositions);
      }
    });
    setStatus(`${d.sparks.size} ${text("sparks left", "ניצוצות נותרו")}`);
    if (!d.sparks.size) complete(true, "Every spark is safely back in the Atlas.", "כל הניצוצות חזרו בבטחה אל האטלס.");
  }

  function mazeDraw() {
    const d = state.data;
    drawBackground("#071a2d", "#133d46");
    const tile = 40;
    const ox = 100;
    const oy = 40;
    MAZE.forEach((row, y) => [...row].forEach((cell, x) => {
      if (cell === "#") {
        ctx.fillStyle = "#254b66";
        ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
        ctx.strokeStyle = "#3d7790";
        ctx.strokeRect(ox + x * tile + 3, oy + y * tile + 3, tile - 6, tile - 6);
      } else {
        ctx.fillStyle = "#091b2c";
        ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
      }
    }));
    d.sparks.forEach(key => {
      const [x, y] = key.split(",").map(Number);
      ctx.fillStyle = "#ffd66b";
      ctx.beginPath();
      ctx.arc(ox + x * tile + 20, oy + y * tile + 20, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    d.powers.forEach(key => {
      const [x, y] = key.split(",").map(Number);
      ctx.strokeStyle = "#62e2df";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ox + x * tile + 20, oy + y * tile + 20, 11, 0, Math.PI * 2);
      ctx.stroke();
    });
    d.enemies.forEach((enemy, index) => {
      ctx.fillStyle = ["#ff759f", "#ff9e67", "#b891ff"][index];
      ctx.beginPath();
      ctx.arc(ox + enemy.x * tile + 20, oy + enemy.y * tile + 20, 14, Math.PI, 0);
      ctx.lineTo(ox + enemy.x * tile + 34, oy + enemy.y * tile + 33);
      ctx.lineTo(ox + enemy.x * tile + 20, oy + enemy.y * tile + 27);
      ctx.lineTo(ox + enemy.x * tile + 6, oy + enemy.y * tile + 33);
      ctx.closePath();
      ctx.fill();
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
    ctx.fillStyle = "#fff3a4";
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  function guardEnemies(wave) {
    const enemies = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 7; col++) enemies.push({ x: 158 + col * 72, y: 80 + row * 48, w: 34, h: 25, alive: true, row, col });
    }
    return enemies;
  }

  function guardCreate() {
    return {
      player: { x: 378, y: 540, w: 44, h: 22 },
      bullets: [], enemyShots: [], enemies: guardEnemies(1),
      barriers: [190, 330, 470, 610].map(x => ({ x, y: 455, w: 70, h: 28, hp: 5 })),
      direction: 1, formationSpeed: 28, shotWait: 0, enemyFire: 1.2,
      wave: 1, invulnerable: 0, random: seeded(404)
    };
  }

  function guardUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    const move = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
    d.player.x = clamp(d.player.x + move * 270 * dt, 25, W - d.player.w - 25);
    d.shotWait -= dt;
    if ((input.held.has("action") || consume("action")) && d.shotWait <= 0) {
      d.bullets.push({ x: d.player.x + 19, y: d.player.y - 13, w: 6, h: 15 });
      d.shotWait = .27;
      tone(650, .035, "square");
    }
    let edge = false;
    d.enemies.filter(enemy => enemy.alive).forEach(enemy => {
      enemy.x += d.direction * d.formationSpeed * dt;
      if (enemy.x < 25 || enemy.x + enemy.w > W - 25) edge = true;
    });
    if (edge) {
      d.direction *= -1;
      d.enemies.filter(enemy => enemy.alive).forEach(enemy => {
        enemy.y += 17;
        enemy.x = clamp(enemy.x, 26, W - enemy.w - 26);
      });
    }
    d.enemyFire -= dt;
    if (d.enemyFire <= 0) {
      const alive = d.enemies.filter(enemy => enemy.alive);
      const shooter = alive[Math.floor(d.random() * alive.length)];
      if (shooter) d.enemyShots.push({ x: shooter.x + 15, y: shooter.y + 24, w: 5, h: 13 });
      d.enemyFire = Math.max(.45, 1.25 - d.wave * .18);
    }
    d.bullets.forEach(bullet => bullet.y -= 420 * dt);
    d.enemyShots.forEach(shot => shot.y += (185 + d.wave * 25) * dt);
    d.bullets.forEach(bullet => {
      d.enemies.forEach(enemy => {
        if (enemy.alive && hit(bullet, enemy)) {
          enemy.alive = false;
          bullet.y = -100;
          state.score += 50 + (3 - enemy.row) * 10;
          tone(280 + enemy.row * 50, .05);
        }
      });
    });
    d.enemyShots.forEach(shot => {
      d.barriers.forEach(barrier => {
        if (barrier.hp > 0 && hit(shot, barrier)) {
          barrier.hp--;
          shot.y = H + 50;
        }
      });
      if (hit(shot, d.player) && d.invulnerable <= 0) {
        shot.y = H + 50;
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
        d.formationSpeed += 16;
        d.enemyShots = [];
        state.score += 500;
        tone(820, .15);
      }
    }
    if (d.enemies.some(enemy => enemy.alive && enemy.y + enemy.h >= d.player.y - 20)) complete(false, "The formation reached the star base.", "התצורה הגיעה לבסיס הכוכבים.");
    setStatus(`${text("Wave", "גל")} ${d.wave} • ${aliveCount}`);
  }

  function guardDraw() {
    const d = state.data;
    drawBackground("#050b1d", "#112d50");
    drawStars(85, Math.floor(state.elapsed * 10));
    d.barriers.forEach(barrier => {
      if (barrier.hp <= 0) return;
      ctx.fillStyle = `rgba(98,226,223,${.2 + barrier.hp * .12})`;
      ctx.fillRect(barrier.x, barrier.y, barrier.w, barrier.h);
    });
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      ctx.fillStyle = ["#ff759f", "#ff9b68", "#ffd66b", "#91a7ff"][enemy.row];
      ctx.fillRect(enemy.x + 6, enemy.y, enemy.w - 12, enemy.h);
      ctx.fillRect(enemy.x, enemy.y + 7, enemy.w, 10);
      ctx.fillStyle = "#14233a";
      ctx.fillRect(enemy.x + 8, enemy.y + 8, 5, 5);
      ctx.fillRect(enemy.x + enemy.w - 13, enemy.y + 8, 5, 5);
    });
    ctx.fillStyle = "#ffd66b";
    d.bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h));
    ctx.fillStyle = "#ff759f";
    d.enemyShots.forEach(shot => ctx.fillRect(shot.x, shot.y, shot.w, shot.h));
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      ctx.fillStyle = "#62e2df";
      ctx.beginPath();
      ctx.moveTo(d.player.x + 22, d.player.y);
      ctx.lineTo(d.player.x + 44, d.player.y + 22);
      ctx.lineTo(d.player.x, d.player.y + 22);
      ctx.closePath();
      ctx.fill();
    }
  }

  function swarmEnemies() {
    const enemies = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) enemies.push({ baseX: 190 + col * 78, baseY: 90 + row * 55, x: 0, y: 0, w: 34, h: 28, alive: true, diving: false, diveT: 0, row, col });
    }
    return enemies;
  }

  function swarmCreate() {
    return {
      player: { x: 380, y: 535, w: 40, h: 28 },
      enemies: swarmEnemies(), bullets: [], shotWait: 0, diveWait: 1.6,
      wave: 1, formation: 0, invulnerable: 0, random: seeded(505)
    };
  }

  function swarmUpdate(dt) {
    const d = state.data;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
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
    if (d.diveWait <= 0) {
      const candidates = d.enemies.filter(enemy => enemy.alive && !enemy.diving);
      const diver = candidates[Math.floor(d.random() * candidates.length)];
      if (diver) {
        diver.diving = true;
        diver.diveT = 0;
      }
      d.diveWait = Math.max(.8, 2.2 - d.wave * .25);
    }
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      if (enemy.diving) {
        enemy.diveT += dt;
        enemy.y = enemy.baseY + enemy.diveT * 240;
        enemy.x = enemy.baseX + Math.sin(enemy.diveT * 4 + enemy.col) * (95 + enemy.diveT * 30);
        if (enemy.y > H + 40) {
          enemy.diving = false;
          enemy.diveT = 0;
        }
      } else {
        enemy.x = enemy.baseX + Math.sin(d.formation * 1.2) * 65;
        enemy.y = enemy.baseY + Math.sin(d.formation * 2 + enemy.col) * 6;
      }
      if (hit(enemy, d.player) && d.invulnerable <= 0) {
        enemy.alive = false;
        loseLife();
      }
    });
    d.bullets.forEach(bullet => {
      bullet.y -= 450 * dt;
      d.enemies.forEach(enemy => {
        if (enemy.alive && hit(bullet, enemy)) {
          enemy.alive = false;
          bullet.y = -100;
          state.score += enemy.diving ? 150 : 75;
          tone(enemy.diving ? 850 : 330, .06);
        }
      });
    });
    d.bullets = d.bullets.filter(bullet => bullet.y > -30);
    const aliveCount = d.enemies.filter(enemy => enemy.alive).length;
    if (!aliveCount) {
      if (d.wave >= 2) complete(true, "The comet lanes are clear.", "נתיבי השביטים נקיים.");
      else {
        d.wave++;
        d.enemies = swarmEnemies();
        d.diveWait = 1;
        state.score += 600;
      }
    }
    setStatus(`${text("Wave", "גל")} ${d.wave} • ${aliveCount}`);
  }

  function swarmDraw() {
    const d = state.data;
    drawBackground("#100b24", "#1b3154");
    drawStars(95, Math.floor(state.elapsed * 28));
    d.enemies.forEach(enemy => {
      if (!enemy.alive) return;
      ctx.save();
      ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
      if (enemy.diving) ctx.rotate(Math.sin(enemy.diveT * 5) * .6);
      ctx.fillStyle = enemy.diving ? "#ff759f" : ["#7be39e", "#ffd66b", "#8ea5ff"][enemy.row];
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(17, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-17, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = "#62e2df";
    d.bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h));
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
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

  function runnerDefenders(random) {
    return [
      { x: 130, y: 410, w: 42, h: 42, vx: 105 },
      { x: 620, y: 325, w: 42, h: 42, vx: -125 },
      { x: 220, y: 235, w: 42, h: 42, vx: 145 },
      { x: 540, y: 165, w: 42, h: 42, vx: -115 }
    ].map(item => ({ ...item, phase: random() * 2 }));
  }

  function runnerCreate() {
    const random = seeded(606);
    return {
      player: { x: 380, y: 510, w: 34, h: 42 },
      ball: { x: 397, y: 500, r: 9, shot: false, vx: 0, vy: 0 },
      defenders: runnerDefenders(random),
      boosts: [{ x: 105, y: 350 }, { x: 675, y: 270 }, { x: 390, y: 205 }],
      collected: new Set(), boost: 0, clock: 60, goals: 0, shootingZone: false,
      invulnerable: 0, random
    };
  }

  function runnerReset() {
    const d = state.data;
    d.player.x = 380;
    d.player.y = 510;
    d.ball = { x: 397, y: 500, r: 9, shot: false, vx: 0, vy: 0 };
    d.shootingZone = false;
  }

  function runnerUpdate(dt) {
    const d = state.data;
    d.clock -= dt;
    d.invulnerable = Math.max(0, d.invulnerable - dt);
    d.boost = Math.max(0, d.boost - dt);
    const speed = d.boost > 0 ? 260 : 190;
    if (!d.ball.shot) {
      const dx = (input.held.has("left") ? -1 : 0) + (input.held.has("right") ? 1 : 0);
      const dy = (input.held.has("up") ? -1 : 0) + (input.held.has("down") ? 1 : 0);
      d.player.x = clamp(d.player.x + dx * speed * dt, 58, 708);
      d.player.y = clamp(d.player.y + dy * speed * dt, 98, 535);
      d.ball.x = d.player.x + d.player.w / 2 + Math.sin(state.elapsed * 10) * 5;
      d.ball.y = d.player.y - 8;
      d.shootingZone = d.player.y < 150;
      if (d.shootingZone && consume("action")) {
        const targetX = clamp(d.player.x + d.player.w / 2 + dx * 130, 245, 555);
        const distance = Math.max(1, d.ball.y - 35);
        d.ball.shot = true;
        d.ball.vy = -430;
        d.ball.vx = (targetX - d.ball.x) / (distance / 430);
        tone(310, .1);
      }
    } else {
      d.ball.x += d.ball.vx * dt;
      d.ball.y += d.ball.vy * dt;
      if (d.ball.y < 34) {
        if (d.ball.x > 250 && d.ball.x < 550) {
          d.goals++;
          state.score += 1000 + Math.floor(d.clock * 10);
          tone(880, .2);
          if (d.goals >= 3) {
            complete(true, "Hat trick! Three goals reached the Atlas net.", "שלושער! שלושה שערים נכנסו לרשת האטלס.");
            return;
          }
        } else {
          tone(140, .1);
        }
        runnerReset();
      }
    }
    d.defenders.forEach((defender, index) => {
      defender.x += defender.vx * dt;
      if (defender.x < 65 || defender.x + defender.w > 735) defender.vx *= -1;
      defender.y += Math.sin(state.elapsed * 1.8 + defender.phase) * 12 * dt;
      if (!d.ball.shot && hit(d.player, defender) && d.invulnerable <= 0) {
        state.score = Math.max(0, state.score - 200);
        loseLife(runnerReset);
      }
      defender.y = clamp(defender.y, 145 + index * 48, 440);
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
    d.boosts.forEach((boost, index) => {
      if (d.collected.has(index)) return;
      ctx.fillStyle = "#62e2df";
      ctx.beginPath();
      ctx.moveTo(boost.x, boost.y - 15);
      ctx.lineTo(boost.x + 13, boost.y + 12);
      ctx.lineTo(boost.x - 13, boost.y + 12);
      ctx.closePath();
      ctx.fill();
    });
    d.defenders.forEach(defender => {
      ctx.fillStyle = "#ff759f";
      ctx.fillRect(defender.x + 7, defender.y, 28, 23);
      ctx.fillStyle = "#f4c9a4";
      ctx.beginPath();
      ctx.arc(defender.x + 21, defender.y - 7, 9, 0, Math.PI * 2);
      ctx.fill();
    });
    if (d.invulnerable <= 0 || Math.floor(d.invulnerable * 10) % 2 === 0) {
      ctx.fillStyle = "#ffd66b";
      ctx.fillRect(d.player.x + 5, d.player.y, 24, 28);
      ctx.fillStyle = "#efc39f";
      ctx.beginPath();
      ctx.arc(d.player.x + 17, d.player.y - 8, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(d.ball.x, d.ball.y, d.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#263746";
    ctx.stroke();
  }

  const GAMES = {
    "road-rally": { create: roadCreate, update: roadUpdate, draw: roadDraw, snapshot: d => ({ distance: Math.floor(d.distance), fuel: Math.ceil(d.fuel), speed: Math.floor(d.speed) }) },
    "sky-blocks": { create: blocksCreate, update: blocksUpdate, draw: blocksDraw, snapshot: d => ({ lines: d.lines, level: d.level, piece: d.current?.type, filledCells: d.board.flat().filter(Boolean).length }) },
    "spark-maze": { create: mazeCreate, update: mazeUpdate, draw: mazeDraw, snapshot: d => ({ sparksRemaining: d.sparks.size, shieldSeconds: Number(d.shield.toFixed(1)), player: { ...d.player }, enemies: d.enemies.map(enemy => ({ x: enemy.x, y: enemy.y })) }) },
    "star-guard": { create: guardCreate, update: guardUpdate, draw: guardDraw, snapshot: d => ({ wave: d.wave, enemiesRemaining: d.enemies.filter(enemy => enemy.alive).length, playerX: Math.round(d.player.x) }) },
    "comet-swarm": { create: swarmCreate, update: swarmUpdate, draw: swarmDraw, snapshot: d => ({ wave: d.wave, enemiesRemaining: d.enemies.filter(enemy => enemy.alive).length, diving: d.enemies.filter(enemy => enemy.alive && enemy.diving).length }) },
    "goal-runner": { create: runnerCreate, update: runnerUpdate, draw: runnerDraw, snapshot: d => ({ goals: d.goals, clock: Number(d.clock.toFixed(1)), shootingZone: d.shootingZone, ballInFlight: d.ball.shot }) }
  };

  function islandHref(island) {
    return island === 1 ? "../index.html" : `../${islandFolders[island]}index.html`;
  }

  function renderCopy() {
    const copy = COPY[state.gameId];
    const hebrew = language() === "he";
    document.documentElement.lang = hebrew ? "he" : "en";
    $("game-title").textContent = hebrew ? copy.nameHe : copy.name;
    $("game-goal").textContent = hebrew ? copy.goalHe : copy.goal;
    $("game-instructions").innerHTML = `<p>${hebrew ? copy.instructionsHe : copy.instructions}</p><p><strong>${hebrew ? "מקשים נוספים:" : "Also:"}</strong> P = ${hebrew ? "השהיה" : "pause"}, R = ${hebrew ? "התחלה מחדש" : "restart"}.</p>`;
    $("game-instructions").dir = hebrew ? "rtl" : "ltr";
    $("score-label").textContent = hebrew ? "ניקוד" : "Score";
    $("best-label").textContent = hebrew ? "שיא" : "Best";
    $("lives-label").textContent = hebrew ? "חיים" : "Lives";
    $("status-label").textContent = hebrew ? "מצב" : "Status";
    $("pause-button").textContent = state.paused ? (hebrew ? "המשך" : "Resume") : (hebrew ? "השהיה" : "Pause");
    $("restart-button").textContent = hebrew ? "התחלה מחדש" : "Restart";
    $("page-subtitle").textContent = hebrew ? "שישה משחקים מקוריים שנפתחים לאורך המסע." : "Six original games unlocked across the expedition.";
    document.querySelector(".game-picker label").textContent = hebrew ? "כל המשחקים" : "All games";
    $("island-note").textContent = hebrew ? `משחק הבונוס של אי ${state.island}. השיא נשמר במכשיר זה בלבד.` : `Island ${state.island} bonus game. Best score is stored only on this device.`;
    $("return-button").href = islandHref(state.island);
    $("map-button").href = "../map/index.html";
    renderSelector();
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

  function startGame(gameId) {
    if (!GAMES[gameId]) gameId = ISLAND_GAME_MAP[1];
    state = baseState(gameId);
    state.data = GAMES[gameId].create();
    input.held.clear();
    input.pressed.clear();
    $("game-overlay").hidden = true;
    api.currentGameId = gameId;
    renderCopy();
    renderHud();
    GAMES[gameId].draw();
    announce(`${COPY[gameId].name}. ${COPY[gameId].goal}`);
    return api.getSnapshot();
  }

  function restart() {
    return startGame(state.gameId);
  }

  function pause(force) {
    if (state.ended) return false;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    state.running = !state.paused;
    setStatus(state.paused ? text("Paused", "מושהה") : text("Playing", "משחק פעיל"));
    $("pause-button").textContent = state.paused ? text("Resume", "המשך") : text("Pause", "השהיה");
    announce(state.status);
    renderHud();
    return state.paused;
  }

  function getSnapshot() {
    return {
      gameId: state?.gameId || null,
      running: Boolean(state?.running && !state?.paused && !state?.ended),
      score: Math.floor(state?.score || 0),
      lives: state?.lives ?? 0,
      status: state?.status || "uninitialized",
      ...(state?.data ? GAMES[state.gameId].snapshot(state.data) : {})
    };
  }

  function loop(now) {
    const dt = Math.min(.034, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    if (state && state.running && !state.paused && !state.ended) {
      state.elapsed += dt;
      GAMES[state.gameId].update(dt);
      saveBest();
    }
    if (state) {
      GAMES[state.gameId].draw();
      if (state.paused) {
        ctx.fillStyle = "rgba(2,9,18,.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ffd66b";
        ctx.font = "bold 42px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(text("PAUSED", "מושהה"), W / 2, H / 2);
        ctx.textAlign = "start";
      }
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
      input.pressed.add(control);
      input.held.add(control);
      button.classList.add("is-held");
      button.setPointerCapture?.(event.pointerId);
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
  $("play-again-button").addEventListener("click", restart);
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

  const api = {
    mapping: ISLAND_GAME_MAP,
    currentGameId: null,
    startGame,
    restart,
    pause,
    getSnapshot
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
