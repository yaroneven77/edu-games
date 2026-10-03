"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const goalsElement = document.getElementById("goals");
const timeElement = document.getElementById("time");
const roundElement = document.getElementById("round");
const powerBar = document.getElementById("powerBar");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FIELD_LEFT = 24;
const FIELD_RIGHT = WIDTH - 24;
const GOAL_LEFT = WIDTH / 2 - 80;
const GOAL_RIGHT = WIDTH / 2 + 80;
const controls = new Set();

let player;
let ball;
let defenders = [];
let keeper;
let particles = [];
let score = 0;
let goals = 0;
let round = 1;
let timeLeft = 90;
let state = "menu";
let lastTime = 0;
let elapsed = 0;
let message = "";
let messageTimer = 0;
let soundEnabled = true;
let audioContext;
let charging = false;
let chargeTime = 0;

function createPlayer() {
  return {
    x: WIDTH / 2,
    y: HEIGHT - 95,
    width: 24,
    height: 32,
    speed: 205,
    directionX: 0,
    directionY: -1,
    possession: true,
    tackleGrace: 1.2,
    sprint: 100,
  };
}

function createBall() {
  return {
    x: WIDTH / 2,
    y: HEIGHT - 116,
    width: 13,
    height: 13,
    vx: 0,
    vy: 0,
    owner: "player",
    pickupCooldown: 0,
  };
}

function createDefenders() {
  const count = Math.min(9, 3 + round);
  defenders = Array.from({ length: count }, (_, index) => ({
    x: 85 + (index % 4) * 115 + (Math.random() - 0.5) * 35,
    y: 190 + Math.floor(index / 4) * 145 + Math.random() * 55,
    width: 24,
    height: 31,
    speed: 78 + round * 8 + Math.random() * 16,
    homeX: 85 + (index % 4) * 115,
    homeY: 190 + Math.floor(index / 4) * 145,
    phase: Math.random() * Math.PI * 2,
    cooldown: 0,
  }));
}

function resetKickoff() {
  charging = false;
  chargeTime = 0;
  powerBar.style.width = "0%";
  player = createPlayer();
  ball = createBall();
  keeper = {
    x: WIDTH / 2,
    y: 54,
    width: 52,
    height: 22,
    speed: 120 + round * 10,
    direction: 1,
  };
  createDefenders();
}

function resetGame() {
  score = 0;
  goals = 0;
  round = 1;
  timeLeft = 90;
  elapsed = 0;
  particles = [];
  resetKickoff();
  updateHud();
}

function startGame() {
  startButton.blur();
  resetGame();
  state = "playing";
  overlay.classList.add("hidden");
  lastTime = performance.now();
  playTone(260, 0.13, "square", 0.03);
}

function setOverlay(tag, title, text, buttonText) {
  overlayTag.textContent = tag;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function updateHud() {
  scoreElement.textContent = String(score).padStart(6, "0");
  goalsElement.textContent = String(goals).padStart(2, "0");
  timeElement.textContent = String(Math.max(0, Math.ceil(timeLeft))).padStart(2, "0");
  roundElement.textContent = String(round).padStart(2, "0");
  powerBar.style.width = `${(chargeTime / 3) * 100}%`;
}

function overlaps(a, b, padding = 0) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 - padding &&
    Math.abs(a.y - b.y) < (a.height + b.height) / 2 - padding
  );
}

function beginCharge() {
  if (state === "playing" && ball.owner === "player") charging = true;
}

function releaseCharge() {
  if (!charging) return;
  charging = false;
  if (ball.owner === "player") shoot(chargeTime);
  chargeTime = 0;
  powerBar.style.width = "0%";
}

function shoot(powerTime = 0) {
  if (state !== "playing" || ball.owner !== "player") return;
  const directionLength = Math.hypot(player.directionX, player.directionY) || 1;
  const directionX = player.directionX / directionLength;
  const directionY = player.directionY / directionLength;
  const power = Math.min(1, powerTime / 3);
  const kickSpeed = 340 + power * 520 + round * 6;
  ball.owner = null;
  player.possession = false;
  ball.x = player.x + directionX * 23;
  ball.y = player.y + directionY * 23;
  ball.vx = directionX * kickSpeed;
  ball.vy = directionY * kickSpeed;
  ball.pickupCooldown = 0.22;
  addParticles(ball.x, ball.y, power > 0.8 ? "#ff6b2c" : "#ffe600", 8 + Math.round(power * 14));
  playTone(120 + power * 180, 0.1, "square", 0.035 + power * 0.015);
}

function tacklePlayer(defender) {
  if (player.tackleGrace > 0 || ball.owner !== "player" || defender.cooldown > 0) return;
  player.possession = false;
  charging = false;
  chargeTime = 0;
  ball.owner = null;
  ball.x = player.x;
  ball.y = player.y - 5;
  const angle = Math.atan2(player.y - defender.y, player.x - defender.x);
  ball.vx = Math.cos(angle) * 210 + (Math.random() - 0.5) * 120;
  ball.vy = Math.sin(angle) * 210;
  ball.pickupCooldown = 0.2;
  defender.cooldown = 1;
  player.tackleGrace = 1.4;
  score = Math.max(0, score - 100);
  message = "TACKLED!";
  messageTimer = 0.8;
  addParticles(player.x, player.y, "#ff6b2c", 15);
  playTone(75, 0.2, "sawtooth", 0.045);
  updateHud();
}

function scoreGoal() {
  goals += 1;
  score += 1000 + round * 250;
  round += 1;
  timeLeft = Math.min(99, timeLeft + 8);
  message = "GOAL!";
  messageTimer = 1.25;
  addParticles(ball.x, 45, "#ffe600", 45);
  playTone(620, 0.28, "square", 0.05);
  updateHud();
  resetKickoff();
}

function missShot() {
  ball.y = 34;
  ball.vy = Math.abs(ball.vy) * 0.65;
  ball.vx *= 0.75;
  message = "OFF TARGET";
  messageTimer = 0.7;
}

function addParticles(x, y, color, amount) {
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 220,
      vy: (Math.random() - 0.5) * 220,
      life: 0.3 + Math.random() * 0.55,
      size: 2 + Math.random() * 4,
      color,
    });
  }
}

function updatePlayer(dt) {
  const dx = (controls.has("right") ? 1 : 0) - (controls.has("left") ? 1 : 0);
  const dy = (controls.has("down") ? 1 : 0) - (controls.has("up") ? 1 : 0);
  const length = Math.hypot(dx, dy) || 1;
  const sprinting = controls.has("sprint") && player.sprint > 0;
  const speed = player.speed * (sprinting ? 1.55 : 1);

  if (dx || dy) {
    player.directionX = dx / length;
    player.directionY = dy / length;
  }
  player.x += (dx / length) * speed * dt;
  player.y += (dy / length) * speed * dt;
  player.x = Math.max(FIELD_LEFT + 15, Math.min(FIELD_RIGHT - 15, player.x));
  player.y = Math.max(85, Math.min(HEIGHT - 45, player.y));
  player.tackleGrace = Math.max(0, player.tackleGrace - dt);
  player.sprint = Math.max(0, Math.min(100, player.sprint + (sprinting ? -32 : 18) * dt));

  if (ball.owner === "player") {
    ball.x = player.x + player.directionX * 11;
    ball.y = player.y + player.directionY * 17;
  } else if (ball.pickupCooldown <= 0 && Math.hypot(player.x - ball.x, player.y - ball.y) < 24) {
    ball.owner = "player";
    player.possession = true;
    ball.vx = 0;
    ball.vy = 0;
    playTone(290, 0.04, "square", 0.018);
  }
}

function updateDefenders(dt) {
  for (const defender of defenders) {
    defender.cooldown = Math.max(0, defender.cooldown - dt);
    defender.phase += dt;
    const targetX = ball.owner === "player" ? player.x : ball.x;
    const targetY = ball.owner === "player" ? player.y : ball.y;
    const distance = Math.hypot(targetX - defender.x, targetY - defender.y);
    const chaseRange = 170 + round * 9;
    let moveX;
    let moveY;

    if (distance < chaseRange) {
      moveX = (targetX - defender.x) / (distance || 1);
      moveY = (targetY - defender.y) / (distance || 1);
    } else {
      moveX = Math.sin(defender.phase * 1.5) * 0.7 + (defender.homeX - defender.x) * 0.012;
      moveY = (defender.homeY - defender.y) * 0.012;
    }
    defender.x += moveX * defender.speed * dt;
    defender.y += moveY * defender.speed * dt;
    defender.x = Math.max(38, Math.min(WIDTH - 38, defender.x));
    defender.y = Math.max(105, Math.min(HEIGHT - 80, defender.y));

    if (overlaps(player, defender, 5)) {
      chargeTime = 0;
      tacklePlayer(defender);
    }
    if (!ball.owner && Math.hypot(defender.x - ball.x, defender.y - ball.y) < 19) {
      const angle = Math.atan2(HEIGHT - defender.y, WIDTH / 2 - defender.x);
      ball.vx = Math.cos(angle) * 250;
      ball.vy = Math.sin(angle) * 250;
      ball.pickupCooldown = 0.18;
      defender.cooldown = 0.8;
    }
  }
}

function updateKeeper(dt) {
  keeper.x += keeper.direction * keeper.speed * dt;
  if (keeper.x > GOAL_RIGHT - keeper.width / 2 || keeper.x < GOAL_LEFT + keeper.width / 2) {
    keeper.direction *= -1;
    keeper.x = Math.max(GOAL_LEFT + keeper.width / 2, Math.min(GOAL_RIGHT - keeper.width / 2, keeper.x));
  }

  if (!ball.owner && overlaps(ball, keeper)) {
    ball.y = keeper.y + 20;
    ball.vy = Math.abs(ball.vy) * 0.75;
    ball.vx += keeper.direction * 125;
    message = "SAVED!";
    messageTimer = 0.75;
    addParticles(ball.x, ball.y, "#32efff", 12);
    playTone(95, 0.14, "square", 0.035);
  }
}

function updateBall(dt) {
  ball.pickupCooldown = Math.max(0, ball.pickupCooldown - dt);
  if (ball.owner) return;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.vx *= Math.pow(0.45, dt);
  ball.vy *= Math.pow(0.55, dt);

  if (ball.x < FIELD_LEFT + 7 || ball.x > FIELD_RIGHT - 7) {
    ball.x = Math.max(FIELD_LEFT + 7, Math.min(FIELD_RIGHT - 7, ball.x));
    ball.vx *= -0.72;
  }
  if (ball.y > HEIGHT - 24) {
    ball.y = HEIGHT - 24;
    ball.vy *= -0.65;
  }
  if (ball.y < 31) {
    if (ball.x > GOAL_LEFT && ball.x < GOAL_RIGHT && ball.vy < 0) scoreGoal();
    else missShot();
  }
}

function updateEffects(dt) {
  particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  });
  particles = particles.filter((particle) => particle.life > 0);
  messageTimer = Math.max(0, messageTimer - dt);
}

function endMatch() {
  state = "gameover";
  setOverlay("FULL TIME", `${goals} GOALS`, `Final score: ${score}`, "PLAY AGAIN");
  playTone(85, 0.5, "sawtooth", 0.04);
}

function update(dt) {
  updateEffects(dt);
  if (state !== "playing") return;
  elapsed += dt;
  if (charging && ball.owner === "player") {
    chargeTime = Math.min(3, chargeTime + dt);
    powerBar.style.width = `${(chargeTime / 3) * 100}%`;
  }
  timeLeft -= dt;
  if (timeLeft <= 0) {
    timeLeft = 0;
    updateHud();
    endMatch();
    return;
  }
  updatePlayer(dt);
  updateDefenders(dt);
  updateKeeper(dt);
  updateBall(dt);
  updateHud();
}

function drawPitch() {
  ctx.fillStyle = "#08752c";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (let stripe = 0; stripe < 10; stripe += 1) {
    ctx.fillStyle = stripe % 2 ? "#0a7930" : "#08702a";
    ctx.fillRect(FIELD_LEFT, stripe * 70, FIELD_RIGHT - FIELD_LEFT, 70);
  }
  ctx.strokeStyle = "#dfffe5";
  ctx.lineWidth = 3;
  ctx.strokeRect(FIELD_LEFT, 28, FIELD_RIGHT - FIELD_LEFT, HEIGHT - 54);
  ctx.beginPath();
  ctx.moveTo(FIELD_LEFT, HEIGHT / 2);
  ctx.lineTo(FIELD_RIGHT, HEIGHT / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#dfffe5";
  ctx.fill();
  ctx.strokeRect(WIDTH / 2 - 130, 28, 260, 105);
  ctx.strokeRect(GOAL_LEFT, 8, GOAL_RIGHT - GOAL_LEFT, 23);
}

function drawPlayerFigure(figure, color, number) {
  ctx.save();
  ctx.translate(figure.x, figure.y);
  ctx.fillStyle = "#dca77b";
  ctx.beginPath();
  ctx.arc(0, -12, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillRect(-10, -5, 20, 19);
  ctx.fillStyle = "#111";
  ctx.fillRect(-9, 14, 7, 11);
  ctx.fillRect(2, 14, 7, 11);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px Courier New";
  ctx.textAlign = "center";
  ctx.fillText(number, 0, 8);
  ctx.restore();
}

function drawBall() {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#151515";
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function draw() {
  drawPitch();
  drawPlayerFigure(keeper, "#32efff", "1");
  defenders.forEach((defender, index) => drawPlayerFigure(defender, "#ff6b2c", String((index % 9) + 2)));
  drawPlayerFigure(player, "#255dff", "10");
  drawBall();

  particles.forEach((particle) => {
    ctx.globalAlpha = Math.min(1, particle.life * 2);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });
  ctx.globalAlpha = 1;

  if (messageTimer > 0) {
    ctx.fillStyle = "#ffe600";
    ctx.shadowColor = "#ff6b2c";
    ctx.shadowBlur = 10;
    ctx.font = "bold 34px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(message, WIDTH / 2, HEIGHT / 2 - 90);
    ctx.shadowBlur = 0;
  }

  if (state === "playing") {
    ctx.fillStyle = "#071108aa";
    ctx.fillRect(14, HEIGHT - 18, 110, 8);
    ctx.fillStyle = player.sprint > 25 ? "#49ff76" : "#ff6b2c";
    ctx.fillRect(16, HEIGHT - 16, player.sprint * 1.06, 4);
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
    charging = false;
    chargeTime = 0;
    setOverlay("REFEREE TIMEOUT", "PAUSED", "The match is waiting.", "RESUME");
  } else if (state === "paused") {
    state = "playing";
    overlay.classList.add("hidden");
    lastTime = performance.now();
  }
}

function setControl(control, active) {
  if (active && (state === "menu" || state === "gameover")) startGame();
  if (state === "paused") return;
  if (control === "kick") {
    if (active) beginCharge();
    else releaseCharge();
    return;
  }
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
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  Shift: "sprint",
};

document.addEventListener("keydown", (event) => {
  const control = event.code === "Space" ? "kick" : keyControls[event.key];
  if (control) {
    event.preventDefault();
    if (!event.repeat || control !== "kick") setControl(control, true);
  } else if ((event.key === "p" || event.key === "P" || event.key === "Escape") && !event.repeat) {
    event.preventDefault();
    togglePause();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    setControl("kick", false);
    return;
  }
  const control = keyControls[event.key];
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

player = createPlayer();
ball = createBall();
keeper = { x: WIDTH / 2, y: 54, width: 52, height: 22, speed: 120, direction: 1 };
createDefenders();
updateHud();
requestAnimationFrame(frame);
