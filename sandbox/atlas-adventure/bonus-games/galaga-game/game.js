"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const waveElement = document.getElementById("wave");
const livesElement = document.getElementById("lives");
const weaponSelect = document.getElementById("weaponSelect");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const controls = new Set();
const enemyColors = ["#ff2c8c", "#b64cff", "#28f6ff", "#ff9f1c"];

let player;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let stars = [];
let powerUps = [];
let score = 0;
const highScoreKey = `edu-games-atlas-neon-${location.pathname.toLowerCase().includes("/sandbox/") ? "sandbox" : "production"}-squadron-high-score-v1`;
let highScore = Number(localStorage.getItem(highScoreKey) || 0);
let wave = 1;
let lives = 3;
let state = "menu";
let lastTime = 0;
let elapsed = 0;
let formationTime = 0;
let diveTimer = 2;
let enemyFireTimer = 1.2;
let waveDelay = 0;
let soundEnabled = true;
let audioContext;
let weapon = "laser";
let kills = 0;

function threatLevel() {
  return 1 + elapsed / 45 + (wave - 1) * 0.25;
}

function createPlayer() {
  return {
    x: WIDTH / 2,
    y: HEIGHT - 55,
    width: 34,
    height: 38,
    speed: 300,
    fireCooldown: 0,
    invincible: 0,
    rapidFire: 0,
    shield: 0,
  };
}

function createStars() {
  stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    size: Math.random() < 0.15 ? 2 : 1,
    speed: 20 + Math.random() * 80,
    alpha: 0.3 + Math.random() * 0.7,
  }));
}

function createWave() {
  enemies = [];
  const rows = Math.min(5, 3 + Math.floor(wave / 2));
  const columns = 8;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      enemies.push({
        row,
        column,
        baseX: 65 + column * 50,
        baseY: 72 + row * 43,
        x: 65 + column * 50,
        y: -60 - row * 45 - column * 7,
        width: row === 0 ? 34 : 30,
        height: row === 0 ? 30 : 26,
        color: enemyColors[row % enemyColors.length],
        health: row === 0 && wave > 2 ? 2 : 1,
        maxHealth: row === 0 && wave > 2 ? 2 : 1,
        entering: true,
        diving: false,
        diveTime: 0,
        startX: 0,
        startY: 0,
        phase: column * 0.7 + row,
      });
    }
  }
  diveTimer = 2;
  enemyFireTimer = 1.2;
}

function resetGame() {
  player = createPlayer();
  bullets = [];
  enemyBullets = [];
  particles = [];
  powerUps = [];
  score = 0;
  wave = 1;
  lives = 3;
  elapsed = 0;
  formationTime = 0;
  waveDelay = 0;
  kills = 0;
  createWave();
  updateHud();
}

function detonateBomb(bullet) {
  if (bullet.dead) return;
  bullet.dead = true;
  addExplosion(bullet.x, bullet.y, "#ff9f1c", 38);
  for (const enemy of enemies) {
    if (!enemy.dead && Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) < 115) {
      destroyEnemy(enemy);
    }
  }
  playTone(65, 0.32, "sawtooth", 0.06);
}

function startGame() {
  resetGame();
  state = "playing";
  overlay.classList.add("hidden");
  lastTime = performance.now();
  playTone(240, 0.12, "square", 0.03);
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
  livesElement.textContent = "◆".repeat(Math.max(0, lives));
}

function firePlayer() {
  if (player.fireCooldown > 0) return;
  if (weapon === "nova") {
    const targets = enemies
      .filter((enemy) => !enemy.dead)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    targets.forEach((enemy, index) => {
      window.setTimeout(() => {
        if (!enemy.dead && state === "playing") destroyEnemy(enemy);
      }, index * 90);
    });
    addExplosion(player.x, player.y - 35, "#b64cff", 30);
    player.fireCooldown = player.rapidFire > 0 ? 0.65 : 1.3;
    playTone(160, 0.35, "sawtooth", 0.04);
    return;
  }
  const shots = {
    laser: [{ offset: 0, vx: 0, vy: -540 }],
    twin: [
      { offset: -9, vx: 0, vy: -525 },
      { offset: 9, vx: 0, vy: -525 },
    ],
    spread: [
      { offset: -5, vx: -135, vy: -500 },
      { offset: 0, vx: 0, vy: -530 },
      { offset: 5, vx: 135, vy: -500 },
    ],
    missile: [{ offset: 0, vx: 0, vy: -360 }],
    bomb: [{ offset: 0, vx: 0, vy: -270 }],
  };
  shots[weapon].forEach((shot) => {
    bullets.push({
      x: player.x + shot.offset,
      y: player.y - 23,
      vx: shot.vx,
      vy: shot.vy,
      width: weapon === "bomb" ? 16 : weapon === "missile" ? 9 : 4,
      height: weapon === "bomb" ? 16 : 16,
      weapon,
    });
  });
  const baseCooldown =
    weapon === "bomb"
      ? 0.75
      : weapon === "missile"
        ? 0.52
        : weapon === "spread"
          ? 0.38
          : weapon === "twin"
            ? 0.29
            : 0.24;
  player.fireCooldown = player.rapidFire > 0 ? baseCooldown * 0.5 : baseCooldown;
  const pitch =
    weapon === "bomb"
      ? 130
      : weapon === "missile"
        ? 230
        : weapon === "spread"
          ? 390
          : weapon === "twin"
            ? 440
            : 480;
  playTone(pitch, weapon === "missile" || weapon === "bomb" ? 0.09 : 0.045, "square", 0.022);
}

function fireEnemy(enemy) {
  const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  const shotSpeed = Math.min(390, 155 + threatLevel() * 38);
  enemyBullets.push({
    x: enemy.x,
    y: enemy.y + 15,
    vx: Math.cos(angle) * shotSpeed,
    vy: Math.sin(angle) * shotSpeed,
    width: 5,
    height: 12,
  });
}

function addExplosion(x, y, color, amount = 18) {
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 180;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.35 + Math.random() * 0.55,
      size: 2 + Math.random() * 4,
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

function hitPlayer() {
  if (player.invincible > 0) return;
  if (player.shield > 0) {
    player.shield = 0;
    player.invincible = 0.7;
    addExplosion(player.x, player.y, "#3df58b", 18);
    playTone(720, 0.18, "square", 0.045);
    return;
  }
  lives -= 1;
  player.invincible = 2;
  player.x = WIDTH / 2;
  addExplosion(player.x, player.y, "#28f6ff", 28);
  playTone(75, 0.4, "sawtooth", 0.055);
  updateHud();
  if (lives <= 0) gameOver();
}

function destroyEnemy(enemy) {
  if (enemy.dead) return;
  enemy.dead = true;
  kills += 1;
  score += enemy.diving ? 200 : 100;
  addExplosion(enemy.x, enemy.y, enemy.color);
  if (kills % 5 === 0) {
    const weapons = ["missile", "bomb", "nova", "laser"];
    const weaponName = weapons[(kills / 5 - 1) % weapons.length];
    powerUps.push({
      x: enemy.x,
      y: enemy.y,
      width: 24,
      height: 24,
      speed: 90,
      type: "weapon",
      weaponName,
    });
  }
  if (Math.random() < 0.07) {
    const roll = Math.random();
    powerUps.push({
      x: enemy.x,
      y: enemy.y,
      width: 22,
      height: 22,
      speed: 95,
      type: roll < 0.55 ? "rapid" : roll < 0.85 ? "shield" : "life",
    });
  }
  playTone(190 + enemy.row * 35, 0.08, "square", 0.03);
  updateHud();
}

function startDive() {
  const candidates = enemies.filter((enemy) => !enemy.dead && !enemy.entering && !enemy.diving);
  if (!candidates.length) return;
  const amount = Math.min(3, 1 + Math.floor((threatLevel() - 1) / 1.25));
  for (let i = 0; i < amount && candidates.length; i += 1) {
    const index = Math.floor(Math.random() * candidates.length);
    const enemy = candidates.splice(index, 1)[0];
    enemy.diving = true;
    enemy.diveTime = 0;
    enemy.startX = enemy.x;
    enemy.startY = enemy.y;
  }
}

function updatePlayer(dt) {
  const direction = (controls.has("left") ? -1 : 0) + (controls.has("right") ? 1 : 0);
  player.x += direction * player.speed * dt;
  player.x = Math.max(25, Math.min(WIDTH - 25, player.x));
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.invincible = Math.max(0, player.invincible - dt);
  player.rapidFire = Math.max(0, player.rapidFire - dt);
  if (controls.has("fire")) firePlayer();
}

function updateEnemies(dt) {
  formationTime += dt;
  diveTimer -= dt;
  enemyFireTimer -= dt;

  if (diveTimer <= 0) {
    startDive();
    diveTimer = Math.max(0.38, 2.2 / threatLevel()) + Math.random() * 0.55;
  }

  if (enemyFireTimer <= 0) {
    const shooters = enemies.filter((enemy) => !enemy.dead && !enemy.entering);
    const volleySize = Math.min(4, 1 + Math.floor((threatLevel() - 1) / 1.1));
    for (let i = 0; i < volleySize && shooters.length; i += 1) {
      fireEnemy(shooters[Math.floor(Math.random() * shooters.length)]);
    }
    enemyFireTimer = Math.max(0.2, 1.05 / threatLevel()) + Math.random() * 0.35;
  }

  for (const enemy of enemies) {
    if (enemy.entering) {
      enemy.y += (155 + enemy.row * 9) * dt;
      if (enemy.y >= enemy.baseY) {
        enemy.y = enemy.baseY;
        enemy.entering = false;
      }
    } else if (enemy.diving) {
      enemy.diveTime += dt;
      const t = enemy.diveTime;
      enemy.x = enemy.startX + Math.sin(t * 2.8 + enemy.phase) * (95 + t * 35);
      enemy.y = enemy.startY + t * Math.min(260, 135 + threatLevel() * 24);
      if (enemy.y > HEIGHT + 45) {
        enemy.diving = false;
        enemy.entering = true;
        enemy.y = -40;
      }
    } else {
      enemy.x = enemy.baseX + Math.sin(formationTime * 0.9) * 28;
      enemy.y = enemy.baseY + Math.sin(formationTime * 1.4 + enemy.phase) * 4;
    }

    if (!enemy.dead && overlaps(player, enemy)) {
      enemy.dead = true;
      addExplosion(enemy.x, enemy.y, enemy.color);
      hitPlayer();
    }
  }
  enemies = enemies.filter((enemy) => !enemy.dead);
}

function updateProjectiles(dt) {
  bullets.forEach((bullet) => {
    if (bullet.weapon === "missile" && enemies.length) {
      const target = enemies.reduce((closest, enemy) => {
        const distance = (enemy.x - bullet.x) ** 2 + (enemy.y - bullet.y) ** 2;
        return !closest || distance < closest.distance ? { enemy, distance } : closest;
      }, null).enemy;
      const dx = target.x - bullet.x;
      const dy = target.y - bullet.y;
      const length = Math.hypot(dx, dy) || 1;
      const turn = Math.min(1, dt * 5);
      bullet.vx += ((dx / length) * 380 - bullet.vx) * turn;
      bullet.vy += ((dy / length) * 380 - bullet.vy) * turn;
    }
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    if (bullet.weapon === "bomb" && bullet.y < 145) detonateBomb(bullet);
  });
  enemyBullets.forEach((bullet) => {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
  });

  for (const bullet of bullets) {
    for (const enemy of enemies) {
      if (bullet.dead || enemy.dead || !overlaps(bullet, enemy)) continue;
      if (bullet.weapon === "bomb") {
        detonateBomb(bullet);
        break;
      }
      bullet.dead = true;
      enemy.health -= 1;
      if (enemy.health <= 0) destroyEnemy(enemy);
      else playTone(115, 0.05, "square", 0.02);
    }
  }

  for (const bullet of enemyBullets) {
    if (!bullet.dead && overlaps(player, bullet)) {
      bullet.dead = true;
      hitPlayer();
    }
  }

  bullets = bullets.filter(
    (bullet) => !bullet.dead && bullet.y > -30 && bullet.x > -30 && bullet.x < WIDTH + 30,
  );
  enemyBullets = enemyBullets.filter(
    (bullet) => !bullet.dead && bullet.y < HEIGHT + 30 && bullet.x > -30 && bullet.x < WIDTH + 30,
  );
  enemies = enemies.filter((enemy) => !enemy.dead);
}

function updateEffects(dt) {
  stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > HEIGHT) {
      star.y = 0;
      star.x = Math.random() * WIDTH;
    }
  });
  particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  });
  particles = particles.filter((particle) => particle.life > 0);

  powerUps.forEach((powerUp) => {
    powerUp.y += powerUp.speed * dt;
    if (overlaps(player, powerUp)) {
      powerUp.dead = true;
      if (powerUp.type === "life") {
        lives = Math.min(5, lives + 1);
      } else if (powerUp.type === "shield") {
        player.shield = 1;
      } else if (powerUp.type === "weapon") {
        weapon = powerUp.weaponName;
        weaponSelect.value = weapon;
      } else {
        player.rapidFire = 8;
      }
      score += 300;
      updateHud();
      playTone(650, 0.18, "square", 0.04);
    }
  });
  powerUps = powerUps.filter((powerUp) => !powerUp.dead && powerUp.y < HEIGHT + 30);
}

function nextWave(dt) {
  if (enemies.length) return;
  waveDelay += dt;
  if (waveDelay > 1.4) {
    wave += 1;
    waveDelay = 0;
    createWave();
    updateHud();
  }
}

function gameOver() {
  state = "gameover";
  highScore = Math.max(highScore, score);
  localStorage.setItem(highScoreKey, String(highScore));
  setOverlay("MISSION FAILED", "GAME OVER", `Wave ${wave} · Score ${score}`, "RELAUNCH");
}

function update(dt) {
  updateEffects(dt);
  if (state !== "playing") return;
  elapsed += dt;
  updatePlayer(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  nextWave(dt);
}

function drawShip(x, y, color, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, -21);
  ctx.lineTo(13, 8);
  ctx.lineTo(21, 13);
  ctx.lineTo(10, 16);
  ctx.lineTo(5, 9);
  ctx.lineTo(-5, 9);
  ctx.lineTo(-10, 16);
  ctx.lineTo(-21, 13);
  ctx.lineTo(-13, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffffbb";
  ctx.fillRect(-3, -10, 6, 14);
  ctx.restore();
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  if (enemy.diving) ctx.rotate(Math.sin(enemy.diveTime * 3) * 0.45);
  ctx.fillStyle = enemy.color;
  ctx.shadowColor = enemy.color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, -enemy.height / 2);
  ctx.lineTo(enemy.width / 2, 2);
  ctx.lineTo(enemy.width * 0.35, enemy.height / 2);
  ctx.lineTo(0, enemy.height * 0.22);
  ctx.lineTo(-enemy.width * 0.35, enemy.height / 2);
  ctx.lineTo(-enemy.width / 2, 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(-8, 0, 5, 4);
  ctx.fillRect(3, 0, 5, 4);
  if (enemy.maxHealth > 1) {
    ctx.fillStyle = "#ffe600";
    ctx.fillRect(-3, -8, 6, 6);
  }
  ctx.restore();
}

function draw() {
  ctx.fillStyle = "#020207";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const star of stars) {
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = star.size === 2 ? "#7be8ff" : "#fff";
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;

  enemies.forEach(drawEnemy);

  ctx.shadowBlur = 8;
  bullets.forEach((bullet) => {
    const color =
      bullet.weapon === "missile"
        ? "#ff9f1c"
        : bullet.weapon === "bomb"
          ? "#ff365f"
        : bullet.weapon === "spread"
          ? "#ffe600"
          : bullet.weapon === "twin"
            ? "#ff2c8c"
            : "#28f6ff";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    if (bullet.weapon === "bomb") {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe600";
      ctx.fillRect(bullet.x - 2, bullet.y + 7, 4, 8);
    } else if (bullet.weapon === "missile") {
      const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(angle);
      ctx.fillRect(-4, -8, 8, 15);
      ctx.fillStyle = "#ffe600";
      ctx.fillRect(-2, 7, 4, 7);
      ctx.restore();
    } else {
      ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 16);
    }
  });
  ctx.fillStyle = "#ff365f";
  ctx.shadowColor = "#ff365f";
  enemyBullets.forEach((bullet) => ctx.fillRect(bullet.x - 3, bullet.y - 6, 6, 12));
  ctx.shadowBlur = 0;

  powerUps.forEach((powerUp) => {
    ctx.fillStyle =
      powerUp.type === "life"
        ? "#ff2c8c"
        : powerUp.type === "shield"
          ? "#3df58b"
          : powerUp.type === "weapon"
            ? "#28f6ff"
            : "#ffe600";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#090512";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const weaponLabels = { missile: "M", bomb: "B", nova: "X", laser: "L" };
    const label =
      powerUp.type === "life"
        ? "+"
        : powerUp.type === "shield"
          ? "S"
          : powerUp.type === "weapon"
            ? weaponLabels[powerUp.weaponName]
            : "R";
    ctx.fillText(label, powerUp.x, powerUp.y + 1);
  });
  ctx.shadowBlur = 0;

  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(1, particle.life * 2);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  ctx.globalAlpha = 1;

  if (state !== "menu" && (player.invincible <= 0 || Math.floor(elapsed * 12) % 2 === 0)) {
    drawShip(player.x, player.y, "#28f6ff");
    if (player.shield > 0) {
      ctx.strokeStyle = "#3df58b";
      ctx.shadowColor = "#3df58b";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 31 + Math.sin(elapsed * 5) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
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
    setOverlay("COMMAND HOLD", "PAUSED", "Squadron standing by.", "RESUME");
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
  let control = keyControls[event.key];
  if (event.code === "Space") control = "fire";
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

weaponSelect.addEventListener("change", () => {
  weapon = weaponSelect.value;
  playTone(300 + weaponSelect.selectedIndex * 100, 0.08, "square", 0.025);
});

createStars();
player = createPlayer();
createWave();
updateHud();
requestAnimationFrame(frame);
