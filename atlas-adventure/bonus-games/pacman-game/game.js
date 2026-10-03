"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const livesElement = document.getElementById("lives");
const overlay = document.getElementById("overlay");
const overlayLabel = document.getElementById("overlayLabel");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const TILE = 24;
const COLS = 21;
const ROWS = 23;
const STEP = 1 / 60;

const rawMap = [
  "#####################",
  "#o........#........o#",
  "#.###.###.#.###.###.#",
  "#.....#.......#.....#",
  "###.#.#.#####.#.#.###",
  "#...#.#...#...#.#...#",
  "#.###.###.#.###.###.#",
  "#.........#.........#",
  "#.###.#.#####.#.###.#",
  "#.....#...#...#.....#",
  "#####.### # ###.#####",
  "    #.#       #.#    ",
  "#####.# ##-## #.#####",
  "     .  #   #  .     ",
  "#####.# ##### #.#####",
  "    #.#       #.#    ",
  "#####.# ##### #.#####",
  "#.........#.........#",
  "#.###.###.#.###.###.#",
  "#o..#..... .....#..o#",
  "###.#.#.#####.#.#.###",
  "#.....#.......#.....#",
  "#####################",
];

const directions = {
  left: { x: -1, y: 0, angle: Math.PI },
  right: { x: 1, y: 0, angle: 0 },
  up: { x: 0, y: -1, angle: -Math.PI / 2 },
  down: { x: 0, y: 1, angle: Math.PI / 2 },
  none: { x: 0, y: 0, angle: 0 },
};

const ghostBlueprints = [
  { color: "#ff365e", x: 9, y: 9, scatter: { x: 19, y: 1 }, personality: 0 },
  { color: "#ff70c8", x: 11, y: 9, scatter: { x: 1, y: 1 }, personality: 1 },
  { color: "#42e8ff", x: 7, y: 11, scatter: { x: 19, y: 21 }, personality: 2 },
  { color: "#ff9f37", x: 13, y: 11, scatter: { x: 1, y: 21 }, personality: 3 },
];

let map = [];
let player;
let ghosts = [];
let score = 0;
let lives = 3;
const highScoreKey = `edu-games-atlas-neon-${location.pathname.toLowerCase().includes("/sandbox/") ? "sandbox" : "production"}-pac-high-score-v1`;
let highScore = Number(localStorage.getItem(highScoreKey) || 0);
let pellets = 0;
let gameState = "menu";
let previousState = "playing";
let lastTime = 0;
let accumulator = 0;
let elapsed = 0;
let frightenedTimer = 0;
let combo = 0;
let level = 1;
let soundEnabled = true;
let audioContext;

function resetMap() {
  map = rawMap.map((row) => row.split(""));
  pellets = map.flat().filter((cell) => cell === "." || cell === "o").length;
}

function createActor(x, y, direction, speed) {
  return {
    x: x * TILE + TILE / 2,
    y: y * TILE + TILE / 2,
    startX: x,
    startY: y,
    direction,
    nextDirection: direction,
    speed,
  };
}

function resetActors() {
  player = createActor(5, 17, "left", 105 + Math.min(level * 2, 12));
  ghosts = ghostBlueprints.map((blueprint, index) => ({
    ...blueprint,
    ...createActor(blueprint.x, blueprint.y, index === 0 ? "left" : "up", 82 + level * 2),
    homeTimer: index * 1.25,
    eaten: false,
  }));
}

function newGame() {
  score = 0;
  lives = 3;
  level = 1;
  resetMap();
  resetActors();
  updateHud();
  beginRound();
}

function beginRound() {
  frightenedTimer = 0;
  combo = 0;
  elapsed = 0;
  gameState = "ready";
  setOverlay("GET READY", `LEVEL ${level}`, "Use arrows or WASD to move.", "GO!");
  window.setTimeout(() => {
    if (gameState === "ready") {
      gameState = "playing";
      overlay.classList.add("hidden");
    }
  }, 900);
}

function setOverlay(label, title, text, buttonText) {
  overlayLabel.textContent = label;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function updateHud() {
  scoreElement.textContent = String(score).padStart(6, "0");
  highScoreElement.textContent = String(Math.max(score, highScore)).padStart(6, "0");
  livesElement.textContent = "●".repeat(Math.max(0, lives));
}

function tileAt(x, y) {
  if (y < 0 || y >= ROWS) return "#";
  if (x < 0 || x >= COLS) return " ";
  return map[y][x];
}

function isWall(x, y) {
  const tile = tileAt(x, y);
  return tile === "#" || tile === "-";
}

function actorTile(actor) {
  return {
    x: Math.floor(actor.x / TILE),
    y: Math.floor(actor.y / TILE),
  };
}

function centered(actor) {
  const centerX = Math.floor(actor.x / TILE) * TILE + TILE / 2;
  const centerY = Math.floor(actor.y / TILE) * TILE + TILE / 2;
  return Math.abs(actor.x - centerX) < 0.01 && Math.abs(actor.y - centerY) < 0.01;
}

function canMove(actor, directionName) {
  const tile = actorTile(actor);
  const direction = directions[directionName];
  return !isWall(tile.x + direction.x, tile.y + direction.y);
}

function snapToCenter(actor) {
  const tile = actorTile(actor);
  actor.x = tile.x * TILE + TILE / 2;
  actor.y = tile.y * TILE + TILE / 2;
}

function moveActor(actor, dt) {
  if (centered(actor)) {
    snapToCenter(actor);
    if (canMove(actor, actor.nextDirection)) actor.direction = actor.nextDirection;
    if (!canMove(actor, actor.direction)) return;
  }

  const direction = directions[actor.direction];
  const oldX = actor.x;
  const oldY = actor.y;
  actor.x += direction.x * actor.speed * dt;
  actor.y += direction.y * actor.speed * dt;

  if (direction.x !== 0) {
    const gridX = (oldX - TILE / 2) / TILE;
    const nextColumn =
      direction.x > 0 ? Math.floor(gridX + 1e-9) + 1 : Math.ceil(gridX - 1e-9) - 1;
    const nextCenterX = nextColumn * TILE + TILE / 2;
    const crossedCenter =
      direction.x > 0
        ? oldX < nextCenterX && actor.x >= nextCenterX
        : oldX > nextCenterX && actor.x <= nextCenterX;
    if (crossedCenter) actor.x = nextCenterX;
  } else if (direction.y !== 0) {
    const gridY = (oldY - TILE / 2) / TILE;
    const nextRow =
      direction.y > 0 ? Math.floor(gridY + 1e-9) + 1 : Math.ceil(gridY - 1e-9) - 1;
    const nextCenterY = nextRow * TILE + TILE / 2;
    const crossedCenter =
      direction.y > 0
        ? oldY < nextCenterY && actor.y >= nextCenterY
        : oldY > nextCenterY && actor.y <= nextCenterY;
    if (crossedCenter) actor.y = nextCenterY;
  }

  if (actor.x < -TILE / 2) actor.x = canvas.width + TILE / 2;
  if (actor.x > canvas.width + TILE / 2) actor.x = -TILE / 2;
}

function consumePellet() {
  const tile = actorTile(player);
  const cell = tileAt(tile.x, tile.y);
  if (cell !== "." && cell !== "o") return;

  map[tile.y][tile.x] = " ";
  pellets -= 1;
  score += cell === "o" ? 50 : 10;
  playTone(cell === "o" ? 260 : 160, 0.045, "square", 0.025);

  if (cell === "o") {
    frightenedTimer = 7;
    combo = 0;
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem(highScoreKey, String(highScore));
  }
  updateHud();

  if (pellets === 0) {
    level += 1;
    resetMap();
    resetActors();
    beginRound();
  }
}

function ghostTarget(ghost) {
  const playerTile = actorTile(player);
  const playerDirection = directions[player.direction];

  if (elapsed % 22 > 16) return ghost.scatter;
  if (ghost.personality === 1) {
    return {
      x: playerTile.x + playerDirection.x * 4,
      y: playerTile.y + playerDirection.y * 4,
    };
  }
  if (ghost.personality === 2) {
    return {
      x: playerTile.x + playerDirection.x * 2 + (playerTile.x - actorTile(ghosts[0]).x),
      y: playerTile.y + playerDirection.y * 2 + (playerTile.y - actorTile(ghosts[0]).y),
    };
  }
  if (ghost.personality === 3) {
    const tile = actorTile(ghost);
    const distance = Math.hypot(tile.x - playerTile.x, tile.y - playerTile.y);
    return distance < 7 ? ghost.scatter : playerTile;
  }
  return playerTile;
}

function chooseGhostDirection(ghost) {
  if (!centered(ghost)) return;
  snapToCenter(ghost);

  const tile = actorTile(ghost);
  const reverse = { left: "right", right: "left", up: "down", down: "up" };
  let choices = ["left", "right", "up", "down"].filter(
    (name) => name !== reverse[ghost.direction] && canMove(ghost, name),
  );
  if (!choices.length) choices = [reverse[ghost.direction]];

  if (frightenedTimer > 0 && !ghost.eaten) {
    ghost.nextDirection = choices[Math.floor(Math.random() * choices.length)];
    return;
  }

  const target = ghost.eaten ? { x: 10, y: 13 } : ghostTarget(ghost);
  choices.sort((a, b) => {
    const da = directions[a];
    const db = directions[b];
    const distanceA = (tile.x + da.x - target.x) ** 2 + (tile.y + da.y - target.y) ** 2;
    const distanceB = (tile.x + db.x - target.x) ** 2 + (tile.y + db.y - target.y) ** 2;
    return distanceA - distanceB;
  });
  ghost.nextDirection = choices[0];
}

function updateGhost(ghost, dt) {
  if (ghost.homeTimer > 0) {
    ghost.homeTimer -= dt;
    return;
  }

  ghost.speed = ghost.eaten ? 150 : frightenedTimer > 0 ? 62 : 82 + level * 2;
  chooseGhostDirection(ghost);
  moveActor(ghost, dt);

  if (ghost.eaten && Math.hypot(ghost.x - (10.5 * TILE), ghost.y - (13.5 * TILE)) < TILE) {
    ghost.eaten = false;
  }
}

function checkGhostCollisions() {
  for (const ghost of ghosts) {
    if (ghost.homeTimer > 0 || ghost.eaten) continue;
    if (Math.hypot(player.x - ghost.x, player.y - ghost.y) >= TILE * 0.7) continue;

    if (frightenedTimer > 0) {
      ghost.eaten = true;
      combo += 1;
      score += 100 * 2 ** combo;
      playTone(620, 0.12, "sawtooth", 0.04);
      updateHud();
    } else {
      loseLife();
    }
    break;
  }
}

function loseLife() {
  lives -= 1;
  playTone(90, 0.4, "sawtooth", 0.05);
  updateHud();

  if (lives <= 0) {
    gameState = "gameover";
    setOverlay("GAME OVER", "TRY AGAIN", `Final score: ${score}`, "PLAY AGAIN");
    return;
  }

  resetActors();
  beginRound();
}

function update(dt) {
  if (gameState !== "playing") return;
  elapsed += dt;
  frightenedTimer = Math.max(0, frightenedTimer - dt);
  if (frightenedTimer === 0) combo = 0;

  moveActor(player, dt);
  consumePellet();
  ghosts.forEach((ghost) => updateGhost(ghost, dt));
  checkGhostCollisions();
}

function drawMaze() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const cell = map[y][x];
      if (cell === "#") {
        ctx.fillStyle = "#08125d";
        ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
        ctx.strokeStyle = "#255cff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x * TILE + 3, y * TILE + 3, TILE - 6, TILE - 6);
      } else if (cell === "-") {
        ctx.fillStyle = "#ff70c8";
        ctx.fillRect(x * TILE, y * TILE + TILE / 2 - 1, TILE, 3);
      } else if (cell === "." || cell === "o") {
        const pulse = cell === "o" ? 1 + Math.sin(elapsed * 7) * 0.2 : 1;
        ctx.beginPath();
        ctx.arc(
          x * TILE + TILE / 2,
          y * TILE + TILE / 2,
          (cell === "o" ? 5 : 2) * pulse,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#ffe8ad";
        ctx.fill();
      }
    }
  }
}

function drawPlayer() {
  const direction = directions[player.direction];
  const mouth = 0.16 + Math.abs(Math.sin(elapsed * 12)) * 0.18;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(direction.angle);
  ctx.beginPath();
  ctx.arc(0, 0, TILE * 0.43, mouth * Math.PI, (2 - mouth) * Math.PI);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fillStyle = "#ffe600";
  ctx.shadowColor = "#ffe600";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function drawGhost(ghost) {
  if (ghost.homeTimer > 0) return;
  const radius = TILE * 0.42;
  const frightened = frightenedTimer > 0 && !ghost.eaten;
  const flashing = frightenedTimer < 2 && Math.floor(frightenedTimer * 8) % 2 === 0;

  ctx.save();
  ctx.translate(ghost.x, ghost.y);
  if (!ghost.eaten) {
    ctx.beginPath();
    ctx.arc(0, -2, radius, Math.PI, 0);
    ctx.lineTo(radius, radius);
    for (let i = 0; i < 3; i += 1) {
      ctx.lineTo(radius - ((i * 2 + 1) * radius) / 3, radius * 0.65);
      ctx.lineTo(radius - ((i * 2 + 2) * radius) / 3, radius);
    }
    ctx.closePath();
    ctx.fillStyle = frightened ? (flashing ? "#f5f5ff" : "#243eff") : ghost.color;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 7;
    ctx.fill();
  }

  const look = directions[ghost.direction];
  for (const eyeX of [-4, 4]) {
    ctx.beginPath();
    ctx.arc(eyeX, -3, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX + look.x * 1.5, -3 + look.y * 1.5, 1.7, 0, Math.PI * 2);
    ctx.fillStyle = "#152a9a";
    ctx.fill();
  }
  ctx.restore();
}

function draw() {
  drawMaze();
  drawPlayer();
  ghosts.forEach(drawGhost);
}

function frame(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;
  accumulator += delta;

  while (accumulator >= STEP) {
    update(STEP);
    accumulator -= STEP;
  }
  draw();
  requestAnimationFrame(frame);
}

function setDirection(direction) {
  if (gameState === "menu" || gameState === "gameover") {
    newGame();
    gameState = "playing";
    overlay.classList.add("hidden");
  } else if (gameState === "ready") {
    gameState = "playing";
    overlay.classList.add("hidden");
  } else if (gameState === "paused") {
    return;
  }
  player.nextDirection = direction;
}

function togglePause() {
  if (gameState === "playing") {
    previousState = gameState;
    gameState = "paused";
    setOverlay("BREAK TIME", "PAUSED", "The maze is waiting.", "RESUME");
  } else if (gameState === "paused") {
    gameState = previousState;
    overlay.classList.add("hidden");
  }
}

function playTone(frequency, duration, type, volume) {
  if (!soundEnabled) return;
  audioContext ||= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

const keyDirections = {
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
};

document.addEventListener("keydown", (event) => {
  if (keyDirections[event.key]) {
    event.preventDefault();
    setDirection(keyDirections[event.key]);
  } else if (event.code === "Space") {
    event.preventDefault();
    togglePause();
  }
});

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("pointerdown", () => setDirection(button.dataset.direction));
});

document.addEventListener("atlas-joystick", (event) => {
  if (event.detail.active) return;
  player.direction = "none";
  player.nextDirection = "none";
});

startButton.addEventListener("click", () => {
  if (gameState === "paused") {
    togglePause();
  } else if (gameState === "ready") {
    gameState = "playing";
    overlay.classList.add("hidden");
  } else {
    newGame();
  }
});

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
});

resetMap();
resetActors();
updateHud();
draw();
requestAnimationFrame(frame);
