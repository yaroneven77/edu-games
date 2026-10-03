"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const distanceElement = document.getElementById("distance");
const fuelBar = document.getElementById("fuelBar");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ROAD_LEFT = 76;
const ROAD_RIGHT = 404;
const ROAD_WIDTH = ROAD_RIGHT - ROAD_LEFT;
const LANE_WIDTH = ROAD_WIDTH / 4;
const keys = new Set();
const trafficColors = ["#ff375f", "#2de2e6", "#ff9f1c", "#b45cff", "#f7f7ff"];

let player;
let traffic = [];
let particles = [];
let roadside = [];
let score = 0;
let distance = 0;
let fuel = 100;
let speed = 0;
let roadOffset = 0;
let spawnTimer = 0;
let pickupTimer = 0;
let elapsed = 0;
let lastTime = 0;
let state = "menu";
const highScoreKey = `edu-games-atlas-neon-${location.pathname.toLowerCase().includes("/sandbox/") ? "sandbox" : "production"}-rush-high-score-v1`;
let highScore = Number(localStorage.getItem(highScoreKey) || 0);
let soundEnabled = true;
let audioContext;

function createPlayer() {
  return {
    x: WIDTH / 2,
    y: HEIGHT - 110,
    width: 38,
    height: 70,
    vx: 0,
    tilt: 0,
    invincible: 0,
  };
}

function resetGame() {
  player = createPlayer();
  traffic = [];
  particles = [];
  roadside = Array.from({ length: 18 }, (_, index) => ({
    side: index % 2 === 0 ? -1 : 1,
    y: (index * HEIGHT) / 9,
    type: index % 3,
  }));
  score = 0;
  distance = 0;
  fuel = 100;
  speed = 260;
  roadOffset = 0;
  spawnTimer = 0.5;
  pickupTimer = 5;
  elapsed = 0;
  updateHud();
}

function startGame() {
  resetGame();
  state = "playing";
  overlay.classList.add("hidden");
  playTone(180, 0.12, "sawtooth", 0.03);
}

function setOverlay(tag, title, text, buttonText) {
  overlayTag.textContent = tag;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function updateHud() {
  scoreElement.textContent = String(Math.floor(score)).padStart(6, "0");
  highScoreElement.textContent = String(Math.max(Math.floor(score), highScore)).padStart(6, "0");
  distanceElement.textContent = `${distance.toFixed(1)} KM`;
  fuelBar.style.width = `${Math.max(0, fuel)}%`;
}

function laneCenter(lane) {
  return ROAD_LEFT + LANE_WIDTH * lane + LANE_WIDTH / 2;
}

function spawnTraffic(type = "car") {
  const lane = Math.floor(Math.random() * 4);
  const sameLaneCars = traffic.filter((item) => item.lane === lane && item.y < 180);
  if (sameLaneCars.length) return;

  const isTruck = type === "truck";
  traffic.push({
    type,
    lane,
    x: laneCenter(lane),
    y: -90,
    width: isTruck ? 48 : type === "fuel" ? 32 : 38,
    height: isTruck ? 92 : type === "fuel" ? 42 : 68,
    relativeSpeed: type === "fuel" ? 80 : 60 + Math.random() * 110,
    color: trafficColors[Math.floor(Math.random() * trafficColors.length)],
    wobble: Math.random() * Math.PI * 2,
  });
}

function addParticles(x, y, color, amount = 12) {
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 240,
      vy: (Math.random() - 0.5) * 240,
      life: 0.4 + Math.random() * 0.45,
      color,
      size: 2 + Math.random() * 4,
    });
  }
}

function overlap(a, b) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) * 0.42 &&
    Math.abs(a.y - b.y) < (a.height + b.height) * 0.42
  );
}

function crash(item) {
  player.invincible = 1.6;
  speed = Math.max(150, speed * 0.55);
  fuel = Math.max(0, fuel - 12);
  score = Math.max(0, score - 250);
  player.vx = player.x < item.x ? -260 : 260;
  addParticles((player.x + item.x) / 2, player.y - 15, "#ffb000", 26);
  playTone(70, 0.35, "sawtooth", 0.06);
}

function collectFuel(item) {
  fuel = Math.min(100, fuel + 30);
  score += 500;
  addParticles(item.x, item.y, "#36ff88", 18);
  playTone(520, 0.16, "square", 0.04);
}

function updatePlayer(dt) {
  const steering = (keys.has("left") ? -1 : 0) + (keys.has("right") ? 1 : 0);
  const boosting = keys.has("boost");
  const braking = keys.has("brake");
  const targetSpeed = braking ? 170 : boosting ? 500 : 340;

  speed += (targetSpeed - speed) * Math.min(1, dt * 2.4);
  player.vx += steering * 680 * dt;
  player.vx *= Math.pow(0.02, dt);
  player.x += player.vx * dt;
  player.tilt += ((steering * 0.14) - player.tilt) * Math.min(1, dt * 9);
  player.x = Math.max(ROAD_LEFT + player.width / 2 + 7, Math.min(ROAD_RIGHT - player.width / 2 - 7, player.x));
  player.invincible = Math.max(0, player.invincible - dt);
}

function updateTraffic(dt) {
  spawnTimer -= dt;
  pickupTimer -= dt;

  if (spawnTimer <= 0) {
    spawnTraffic(Math.random() < 0.18 ? "truck" : "car");
    spawnTimer = Math.max(0.38, 1.05 - speed / 850) + Math.random() * 0.4;
  }
  if (pickupTimer <= 0) {
    spawnTraffic("fuel");
    pickupTimer = 7 + Math.random() * 5;
  }

  for (const item of traffic) {
    item.y += (speed - item.relativeSpeed) * dt;
    item.wobble += dt * 2;

    if (overlap(player, item)) {
      if (item.type === "fuel") {
        item.collected = true;
        collectFuel(item);
      } else if (player.invincible <= 0) {
        crash(item);
      }
    }

    if (item.y > HEIGHT + 110 && !item.passed) {
      item.passed = true;
      if (item.type !== "fuel") score += 100;
    }
  }
  traffic = traffic.filter((item) => item.y < HEIGHT + 130 && !item.collected);
}

function updateWorld(dt) {
  roadOffset = (roadOffset + speed * dt) % 96;
  for (const prop of roadside) {
    prop.y += speed * dt * 0.72;
    if (prop.y > HEIGHT + 40) prop.y -= HEIGHT + 100;
  }
  for (const particle of particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  particles = particles.filter((particle) => particle.life > 0);
}

function gameOver() {
  state = "gameover";
  highScore = Math.max(highScore, Math.floor(score));
  localStorage.setItem(highScoreKey, String(highScore));
  updateHud();
  setOverlay("RUN COMPLETE", "OUT OF FUEL", `Distance: ${distance.toFixed(1)} km · Score: ${Math.floor(score)}`, "RACE AGAIN");
  playTone(90, 0.55, "sawtooth", 0.04);
}

function update(dt) {
  if (state !== "playing") {
    updateWorld(dt * 0.15);
    return;
  }

  elapsed += dt;
  updatePlayer(dt);
  updateTraffic(dt);
  updateWorld(dt);

  distance += speed * dt / 38000;
  score += speed * dt * 0.025;
  fuel -= dt * (1.28 + speed / 760);
  if (score > highScore) highScore = Math.floor(score);
  if (fuel <= 0) gameOver();
  updateHud();
}

function drawRoad() {
  ctx.fillStyle = "#171024";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createLinearGradient(0, 0, WIDTH, 0);
  glow.addColorStop(0, "#3b174f");
  glow.addColorStop(0.16, "#171024");
  glow.addColorStop(0.5, "#13131a");
  glow.addColorStop(0.84, "#171024");
  glow.addColorStop(1, "#3b174f");
  ctx.fillStyle = glow;
  ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, HEIGHT);

  ctx.fillStyle = "#ff2b8c";
  ctx.fillRect(ROAD_LEFT - 5, 0, 5, HEIGHT);
  ctx.fillStyle = "#24f4ff";
  ctx.fillRect(ROAD_RIGHT, 0, 5, HEIGHT);

  ctx.fillStyle = "#d9d4e6";
  for (let lane = 1; lane < 4; lane += 1) {
    const x = ROAD_LEFT + lane * LANE_WIDTH;
    for (let y = -96 + roadOffset; y < HEIGHT; y += 96) {
      ctx.fillRect(x - 2, y, 4, 48);
    }
  }
}

function drawRoadside() {
  for (const prop of roadside) {
    const x = prop.side < 0 ? 38 : WIDTH - 38;
    if (prop.type === 0) {
      ctx.fillStyle = "#24f4ff";
      ctx.fillRect(x - 2, prop.y - 13, 4, 26);
      ctx.fillStyle = "#ff2b8c";
      ctx.fillRect(x - 10, prop.y - 13, 20, 4);
    } else if (prop.type === 1) {
      ctx.fillStyle = "#6e2c91";
      ctx.beginPath();
      ctx.moveTo(x, prop.y - 15);
      ctx.lineTo(x - 12, prop.y + 12);
      ctx.lineTo(x + 12, prop.y + 12);
      ctx.fill();
    } else {
      ctx.fillStyle = "#ffe600";
      ctx.fillRect(x - 5, prop.y - 5, 10, 10);
    }
  }
}

function drawCar(car, isPlayer = false) {
  ctx.save();
  ctx.translate(car.x, car.y);
  if (isPlayer) ctx.rotate(player.tilt);

  const width = car.width;
  const height = car.height;
  const color = isPlayer ? "#ffe600" : car.color;

  ctx.fillStyle = "#08060d";
  ctx.fillRect(-width / 2 - 4, -height * 0.3, 5, height * 0.24);
  ctx.fillRect(width / 2 - 1, -height * 0.3, 5, height * 0.24);
  ctx.fillRect(-width / 2 - 4, height * 0.17, 5, height * 0.24);
  ctx.fillRect(width / 2 - 1, height * 0.17, 5, height * 0.24);

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = isPlayer ? 12 : 5;
  ctx.beginPath();
  ctx.moveTo(-width * 0.36, -height / 2);
  ctx.lineTo(width * 0.36, -height / 2);
  ctx.lineTo(width / 2, height * 0.38);
  ctx.lineTo(width * 0.32, height / 2);
  ctx.lineTo(-width * 0.32, height / 2);
  ctx.lineTo(-width / 2, height * 0.38);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#111a34";
  ctx.fillRect(-width * 0.27, -height * 0.25, width * 0.54, height * 0.25);
  ctx.fillStyle = isPlayer ? "#ff2b8c" : "#f5f5ff";
  ctx.fillRect(-width * 0.31, -height * 0.43, width * 0.18, 5);
  ctx.fillRect(width * 0.13, -height * 0.43, width * 0.18, 5);
  ctx.fillStyle = "#ff304f";
  ctx.fillRect(-width * 0.31, height * 0.37, width * 0.18, 5);
  ctx.fillRect(width * 0.13, height * 0.37, width * 0.18, 5);
  ctx.restore();
}

function drawFuel(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "#36ff88";
  ctx.shadowColor = "#36ff88";
  ctx.shadowBlur = 13;
  ctx.fillRect(-14, -19, 28, 38);
  ctx.fillStyle = "#072616";
  ctx.font = "bold 22px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("F", 0, 2);
  ctx.restore();
}

function draw() {
  drawRoad();
  drawRoadside();
  traffic.forEach((item) => item.type === "fuel" ? drawFuel(item) : drawCar(item));

  if (state !== "menu" && (player.invincible <= 0 || Math.floor(elapsed * 14) % 2 === 0)) {
    drawCar(player, true);
  }

  for (const particle of particles) {
    ctx.globalAlpha = Math.min(1, particle.life * 2);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
  ctx.globalAlpha = 1;

  if (state === "playing") {
    ctx.fillStyle = "#ffffffaa";
    ctx.font = "bold 12px Courier New";
    ctx.fillText(`${Math.round(speed)} KM/H`, ROAD_LEFT + 12, HEIGHT - 18);
  }
}

function frame(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    setOverlay("PIT STOP", "PAUSED", "Take a breath. The highway can wait.", "RESUME");
  } else if (state === "paused") {
    state = "playing";
    overlay.classList.add("hidden");
  }
}

function setControl(control, active) {
  if (active && (state === "menu" || state === "gameover")) startGame();
  if (state === "paused") return;
  if (active) keys.add(control);
  else keys.delete(control);
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

const controlKeys = {
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  ArrowUp: "boost", w: "boost", W: "boost",
  ArrowDown: "brake", s: "brake", S: "brake",
};

document.addEventListener("keydown", (event) => {
  if (controlKeys[event.key]) {
    event.preventDefault();
    setControl(controlKeys[event.key], true);
  } else if (event.code === "Space" && !event.repeat) {
    event.preventDefault();
    togglePause();
  }
});

document.addEventListener("keyup", (event) => {
  if (controlKeys[event.key]) setControl(controlKeys[event.key], false);
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

resetGame();
state = "menu";
requestAnimationFrame(frame);
