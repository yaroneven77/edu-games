"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const waveElement = document.getElementById("wave");
const livesElement = document.getElementById("lives");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const controls = new Set();

let player;
let invaders = [];
let playerBullets = [];
let alienBullets = [];
let bunkers = [];
let stars = [];
let particles = [];
let ufo = null;
let score = 0;
const highScoreKey = `edu-games-atlas-neon-${location.pathname.toLowerCase().includes("/sandbox/") ? "sandbox" : "production"}-invasion-high-score-v1`;
let highScore = Number(localStorage.getItem(highScoreKey) || 0);
let wave = 1;
let lives = 3;
let state = "menu";
let lastTime = 0;
let elapsed = 0;
let fleetDirection = 1;
let fleetStepTimer = 0;
let shotTimer = 1;
let ufoTimer = 10;
let waveDelay = 0;
let soundEnabled = true;
let audioContext;

function createPlayer() {
  return {
    x: WIDTH / 2,
    y: HEIGHT - 38,
    width: 32,
    height: 20,
    speed: 250,
    cooldown: 0,
    invincible: 0,
  };
}

function createStars() {
  stars = Array.from({ length: 70 }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    alpha: 0.18 + Math.random() * 0.5,
  }));
}

function createInvaders() {
  invaders = [];
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 11; column += 1) {
      invaders.push({
        row,
        column,
        x: 55 + column * 37,
        y: 85 + row * 38,
        width: 25,
        height: 20,
        points: row === 0 ? 30 : row < 3 ? 20 : 10,
        frame: 0,
      });
    }
  }
  fleetDirection = 1;
  fleetStepTimer = 0;
}

function createBunkers() {
  bunkers = [];
  for (let bunker = 0; bunker < 4; bunker += 1) {
    const originX = 52 + bunker * 112;
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 7; column += 1) {
        if (row >= 2 && column >= 2 && column <= 4) continue;
        bunkers.push({
          x: originX + column * 8,
          y: HEIGHT - 145 + row * 8,
          width: 8,
          height: 8,
          health: 3,
        });
      }
    }
  }
}

function resetGame() {
  player = createPlayer();
  playerBullets = [];
  alienBullets = [];
  particles = [];
  ufo = null;
  score = 0;
  wave = 1;
  lives = 3;
  elapsed = 0;
  shotTimer = 1;
  ufoTimer = 8;
  waveDelay = 0;
  createInvaders();
  createBunkers();
  updateHud();
}

function startGame() {
  startButton.blur();
  resetGame();
  state = "playing";
  overlay.classList.add("hidden");
  lastTime = performance.now();
  playTone(180, 0.12, "square", 0.03);
}

function setOverlay(tag, title, text, buttonText) {
  overlayTag.textContent = tag;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function updateHud() {
  highScore = Math.max(highScore, score);
  scoreElement.textContent = String(score).padStart(6, "0");
  highScoreElement.textContent = String(highScore).padStart(6, "0");
  waveElement.textContent = String(wave).padStart(2, "0");
  livesElement.textContent = "▲".repeat(Math.max(0, lives));
}

function firePlayer() {
  if (player.cooldown > 0 || playerBullets.length >= 2) return;
  playerBullets.push({
    x: player.x,
    y: player.y - 15,
    width: 4,
    height: 14,
    speed: 470,
  });
  player.cooldown = 0.24;
  playTone(430, 0.05, "square", 0.022);
}

function fireAlien() {
  if (!invaders.length) return;
  const columns = new Map();
  for (const invader of invaders) {
    const current = columns.get(invader.column);
    if (!current || invader.y > current.y) columns.set(invader.column, invader);
  }
  const shooters = [...columns.values()];
  const shooter = shooters[Math.floor(Math.random() * shooters.length)];
  alienBullets.push({
    x: shooter.x,
    y: shooter.y + 14,
    width: 5,
    height: 14,
    speed: 185 + wave * 8,
  });
}

function addExplosion(x, y, color, amount = 15) {
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 190,
      vy: (Math.random() - 0.5) * 190,
      life: 0.3 + Math.random() * 0.45,
      size: 2 + Math.random() * 3,
      color,
    });
  }
}

function overlaps(a, b) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
    Math.abs(a.y - b.y) < (a.height + b.height) / 2
  );
}

function hitBunker(projectile) {
  for (const block of bunkers) {
    if (block.health > 0 && overlaps(projectile, block)) {
      block.health -= 1;
      projectile.dead = true;
      addExplosion(projectile.x, projectile.y, "#49ff76", 5);
      return true;
    }
  }
  return false;
}

function hitPlayer() {
  if (player.invincible > 0) return;
  lives -= 1;
  player.invincible = 2;
  player.x = WIDTH / 2;
  addExplosion(player.x, player.y, "#49ff76", 25);
  playTone(70, 0.4, "sawtooth", 0.05);
  updateHud();
  if (lives <= 0) gameOver("EARTH OVERRUN");
}

function updateFleet(dt) {
  if (!invaders.length) return;
  const speedFactor = 1 + (55 - invaders.length) / 18 + wave * 0.15;
  fleetStepTimer += dt * speedFactor;
  if (fleetStepTimer < 0.42) return;
  fleetStepTimer = 0;

  const left = Math.min(...invaders.map((invader) => invader.x - invader.width / 2));
  const right = Math.max(...invaders.map((invader) => invader.x + invader.width / 2));
  const hitsEdge = (fleetDirection > 0 && right >= WIDTH - 22) || (fleetDirection < 0 && left <= 22);

  if (hitsEdge) {
    fleetDirection *= -1;
    invaders.forEach((invader) => { invader.y += 18; });
  } else {
    invaders.forEach((invader) => {
      invader.x += 9 * fleetDirection;
      invader.frame = 1 - invader.frame;
    });
  }

  if (invaders.some((invader) => invader.y + invader.height / 2 >= player.y - 20)) {
    gameOver("INVADERS LANDED");
  }
  playTone(80 + (elapsed * 10) % 70, 0.025, "square", 0.012);
}

function updatePlayer(dt) {
  const direction = (controls.has("left") ? -1 : 0) + (controls.has("right") ? 1 : 0);
  player.x += direction * player.speed * dt;
  player.x = Math.max(20, Math.min(WIDTH - 20, player.x));
  player.cooldown = Math.max(0, player.cooldown - dt);
  player.invincible = Math.max(0, player.invincible - dt);
  if (controls.has("fire")) firePlayer();
}

function updateProjectiles(dt) {
  playerBullets.forEach((bullet) => { bullet.y -= bullet.speed * dt; });
  alienBullets.forEach((bullet) => { bullet.y += bullet.speed * dt; });

  for (const bullet of playerBullets) {
    if (hitBunker(bullet)) continue;
    for (const invader of invaders) {
      if (!bullet.dead && !invader.dead && overlaps(bullet, invader)) {
        bullet.dead = true;
        invader.dead = true;
        score += invader.points;
        addExplosion(invader.x, invader.y, invader.row === 0 ? "#ff3d91" : "#49ff76");
        playTone(170 + invader.row * 25, 0.07, "square", 0.028);
        updateHud();
      }
    }
    if (!bullet.dead && ufo && overlaps(bullet, ufo)) {
      bullet.dead = true;
      score += 150;
      addExplosion(ufo.x, ufo.y, "#ff3d91", 24);
      ufo = null;
      updateHud();
      playTone(650, 0.16, "square", 0.04);
    }
  }

  for (const bullet of alienBullets) {
    if (hitBunker(bullet)) continue;
    if (!bullet.dead && overlaps(bullet, player)) {
      bullet.dead = true;
      hitPlayer();
    }
  }

  invaders = invaders.filter((invader) => !invader.dead);
  playerBullets = playerBullets.filter((bullet) => !bullet.dead && bullet.y > -25);
  alienBullets = alienBullets.filter((bullet) => !bullet.dead && bullet.y < HEIGHT + 25);
}

function updateUfo(dt) {
  ufoTimer -= dt;
  if (!ufo && ufoTimer <= 0) {
    const direction = Math.random() < 0.5 ? 1 : -1;
    ufo = {
      x: direction > 0 ? -35 : WIDTH + 35,
      y: 42,
      width: 42,
      height: 18,
      direction,
      speed: 95,
    };
    ufoTimer = 12 + Math.random() * 10;
  }
  if (ufo) {
    ufo.x += ufo.direction * ufo.speed * dt;
    if (ufo.x < -50 || ufo.x > WIDTH + 50) ufo = null;
  }
}

function updateEffects(dt) {
  particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  });
  particles = particles.filter((particle) => particle.life > 0);
}

function nextWave(dt) {
  if (invaders.length) return;
  waveDelay += dt;
  if (waveDelay > 1.1) {
    wave += 1;
    waveDelay = 0;
    playerBullets = [];
    alienBullets = [];
    createInvaders();
    createBunkers();
    updateHud();
  }
}

function gameOver(reason) {
  if (state !== "playing") return;
  state = "gameover";
  highScore = Math.max(highScore, score);
  localStorage.setItem(highScoreKey, String(highScore));
  setOverlay("DEFENSE FAILED", reason, `Wave ${wave} · Score ${score}`, "TRY AGAIN");
}

function update(dt) {
  updateEffects(dt);
  if (state !== "playing") return;
  elapsed += dt;
  shotTimer -= dt;
  updatePlayer(dt);
  updateFleet(dt);
  updateProjectiles(dt);
  updateUfo(dt);
  nextWave(dt);
  if (shotTimer <= 0) {
    fireAlien();
    shotTimer = Math.max(0.35, 1.25 - wave * 0.07) + Math.random() * 0.7;
  }
}

function drawInvader(invader) {
  const color = invader.row === 0 ? "#ff3d91" : invader.row < 3 ? "#35f3ff" : "#49ff76";
  ctx.save();
  ctx.translate(Math.round(invader.x), Math.round(invader.y));
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 7;
  const pixels = invader.frame
    ? [[-10,-8],[10,-8],[-6,-4],[6,-4],[-12,0],[-8,0],[-4,0],[0,0],[4,0],[8,0],[12,0],[-12,4],[-4,4],[0,4],[4,4],[12,4],[-8,8],[-4,8],[4,8],[8,8]]
    : [[-10,-8],[10,-8],[-6,-4],[6,-4],[-12,0],[-8,0],[-4,0],[0,0],[4,0],[8,0],[12,0],[-8,4],[-4,4],[0,4],[4,4],[8,4],[-12,8],[-4,8],[4,8],[12,8]];
  pixels.forEach(([x, y]) => ctx.fillRect(x - 2, y - 2, 4, 4));
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.fillStyle = "#49ff76";
  ctx.shadowColor = "#49ff76";
  ctx.shadowBlur = 9;
  ctx.fillRect(-16, 4, 32, 8);
  ctx.fillRect(-11, -3, 22, 8);
  ctx.fillRect(-4, -10, 8, 8);
  ctx.restore();
}

function draw() {
  ctx.fillStyle = "#010403";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  stars.forEach((star) => {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "#c9ffe0";
    ctx.fillRect(star.x, star.y, 1, 1);
  });
  ctx.globalAlpha = 1;

  if (ufo) {
    ctx.fillStyle = "#ff3d91";
    ctx.shadowColor = "#ff3d91";
    ctx.shadowBlur = 10;
    ctx.fillRect(ufo.x - 18, ufo.y - 5, 36, 10);
    ctx.fillRect(ufo.x - 10, ufo.y - 10, 20, 5);
    ctx.shadowBlur = 0;
  }

  invaders.forEach(drawInvader);
  bunkers.forEach((block) => {
    if (block.health <= 0) return;
    ctx.globalAlpha = 0.35 + block.health * 0.21;
    ctx.fillStyle = "#49ff76";
    ctx.fillRect(block.x - 4, block.y - 4, 8, 8);
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#35f3ff";
  ctx.shadowBlur = 7;
  playerBullets.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y - 7, 4, 14));
  ctx.fillStyle = "#ffdf35";
  ctx.shadowColor = "#ffdf35";
  alienBullets.forEach((bullet) => ctx.fillRect(bullet.x - 2, bullet.y - 7, 5, 14));
  ctx.shadowBlur = 0;

  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(1, particle.life * 2);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  ctx.globalAlpha = 1;

  if (state !== "menu" && (player.invincible <= 0 || Math.floor(elapsed * 12) % 2 === 0)) drawPlayer();
  ctx.fillStyle = "#49ff76";
  ctx.fillRect(12, HEIGHT - 16, WIDTH - 24, 2);
}

function frame(time) {
  if (!lastTime) lastTime = time;
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    setOverlay("DEFENSE HOLD", "PAUSED", "The invasion is suspended.", "RESUME");
  } else if (state === "paused") {
    state = "playing";
    overlay.classList.add("hidden");
    lastTime = performance.now();
  }
}

function setControl(control, active) {
  if (active && (state === "menu" || state === "gameover")) startGame();
  if (state === "paused") return;
  if (active) controls.add(control);
  else controls.delete(control);
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

const keyControls = {
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  ArrowUp: "fire", w: "fire", W: "fire",
};

document.addEventListener("keydown", (event) => {
  const control = event.code === "Space" ? "fire" : keyControls[event.key];
  if (control) {
    event.preventDefault();
    setControl(control, true);
  } else if ((event.key === "p" || event.key === "P" || event.key === "Escape") && !event.repeat) {
    event.preventDefault();
    togglePause();
  }
});

document.addEventListener("keyup", (event) => {
  const control = event.code === "Space" ? "fire" : keyControls[event.key];
  if (control) setControl(control, false);
});

document.querySelectorAll("[data-control]").forEach((button) => {
  const control = button.dataset.control;
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setControl(control, true);
  });
  button.addEventListener("pointerup", () => setControl(control, false));
  button.addEventListener("pointercancel", () => setControl(control, false));
});

startButton.addEventListener("click", () => {
  if (state === "paused") togglePause();
  else startGame();
});

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
});

createStars();
player = createPlayer();
createInvaders();
createBunkers();
updateHud();
requestAnimationFrame(frame);
