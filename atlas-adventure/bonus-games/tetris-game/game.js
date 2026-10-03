"use strict";

const boardCanvas = document.getElementById("gameCanvas");
const ctx = boardCanvas.getContext("2d");
const nextCtx = document.getElementById("nextCanvas").getContext("2d");
const holdCtx = document.getElementById("holdCanvas").getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;
const COLORS = {
  I: "#25f4ff",
  J: "#356dff",
  L: "#ff9f1c",
  O: "#ffe600",
  S: "#3df58b",
  T: "#b34cff",
  Z: "#ff365f",
};
const SHAPES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
};

let board;
let piece;
let nextType;
let heldType = null;
let canHold = true;
let bag = [];
let score = 0;
const highScoreKey = `edu-games-atlas-neon-${location.pathname.toLowerCase().includes("/sandbox/") ? "sandbox" : "production"}-blocks-high-score-v1`;
let highScore = Number(localStorage.getItem(highScoreKey) || 0);
let lines = 0;
let level = 1;
let dropCounter = 0;
let lastTime = 0;
let state = "menu";
let soundEnabled = true;
let audioContext;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function refillBag() {
  bag = Object.keys(SHAPES);
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

function takeType() {
  if (!bag.length) refillBag();
  return bag.pop();
}

function createPiece(type) {
  const matrix = SHAPES[type].map((row) => [...row]);
  return {
    type,
    matrix,
    x: Math.floor((COLS - matrix[0].length) / 2),
    y: -matrix.findIndex((row) => row.some(Boolean)),
  };
}

function resetGame() {
  board = createBoard();
  bag = [];
  heldType = null;
  canHold = true;
  score = 0;
  lines = 0;
  level = 1;
  nextType = takeType();
  spawnPiece();
  updateHud();
}

function startGame() {
  resetGame();
  state = "playing";
  overlay.classList.add("hidden");
  lastTime = performance.now();
  playTone(220, 0.12, "square", 0.03);
}

function spawnPiece() {
  piece = createPiece(nextType);
  nextType = takeType();
  canHold = true;
  if (collides(piece.matrix, piece.x, piece.y)) gameOver();
  drawPreviews();
}

function collides(matrix, offsetX, offsetY) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const boardX = offsetX + x;
      const boardY = offsetY + y;
      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) return true;
      if (boardY >= 0 && board[boardY][boardX]) return true;
    }
  }
  return false;
}

function mergePiece() {
  piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      const boardY = piece.y + y;
      if (value && boardY >= 0) board[boardY][piece.x + x] = piece.type;
    });
  });
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (board[y].every(Boolean)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(null));
      cleared += 1;
      y += 1;
    }
  }

  if (!cleared) return;
  const points = [0, 100, 300, 500, 800];
  score += points[cleared] * level;
  lines += cleared;
  level = Math.floor(lines / 10) + 1;
  playTone(cleared === 4 ? 620 : 420, 0.16, "square", 0.04);
  updateHud();
}

function lockPiece() {
  mergePiece();
  clearLines();
  spawnPiece();
  dropCounter = 0;
}

function move(dx) {
  if (state !== "playing") return;
  if (!collides(piece.matrix, piece.x + dx, piece.y)) {
    piece.x += dx;
    playTone(105, 0.025, "square", 0.015);
  }
}

function softDrop(manual = true) {
  if (state !== "playing") return;
  if (!collides(piece.matrix, piece.x, piece.y + 1)) {
    piece.y += 1;
    if (manual) score += 1;
  } else {
    lockPiece();
  }
  dropCounter = 0;
  updateHud();
}

function hardDrop() {
  if (state !== "playing") return;
  let dropped = 0;
  while (!collides(piece.matrix, piece.x, piece.y + 1)) {
    piece.y += 1;
    dropped += 1;
  }
  score += dropped * 2;
  playTone(130, 0.08, "sawtooth", 0.03);
  lockPiece();
  updateHud();
}

function rotateMatrix(matrix, direction) {
  const rotated = matrix.map((_, index) => matrix.map((row) => row[index]));
  if (direction > 0) rotated.forEach((row) => row.reverse());
  else rotated.reverse();
  return rotated;
}

function rotate(direction = 1) {
  if (state !== "playing") return;
  const rotated = rotateMatrix(piece.matrix, direction);
  for (const offset of [0, -1, 1, -2, 2]) {
    if (!collides(rotated, piece.x + offset, piece.y)) {
      piece.matrix = rotated;
      piece.x += offset;
      playTone(180, 0.035, "square", 0.018);
      return;
    }
  }
}

function holdPiece() {
  if (state !== "playing" || !canHold) return;
  const currentType = piece.type;
  if (heldType) {
    piece = createPiece(heldType);
    heldType = currentType;
  } else {
    heldType = currentType;
    piece = createPiece(nextType);
    nextType = takeType();
  }
  canHold = false;
  drawPreviews();
  playTone(260, 0.07, "square", 0.025);
}

function ghostY() {
  let y = piece.y;
  while (!collides(piece.matrix, piece.x, y + 1)) y += 1;
  return y;
}

function updateHud() {
  highScore = Math.max(highScore, score);
  scoreElement.textContent = String(score).padStart(6, "0");
  highScoreElement.textContent = String(highScore).padStart(6, "0");
  levelElement.textContent = String(level).padStart(2, "0");
  linesElement.textContent = String(lines).padStart(3, "0");
}

function gameOver() {
  if (state === "menu") return;
  state = "gameover";
  highScore = Math.max(highScore, score);
  localStorage.setItem(highScoreKey, String(highScore));
  setOverlay("STACK COLLAPSED", "GAME OVER", `Score: ${score} · Lines: ${lines}`, "PLAY AGAIN");
  playTone(80, 0.5, "sawtooth", 0.045);
}

function setOverlay(tag, title, text, buttonText) {
  overlayTag.textContent = tag;
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("hidden");
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    setOverlay("TIME OUT", "PAUSED", "The stack is frozen.", "RESUME");
  } else if (state === "paused") {
    state = "playing";
    overlay.classList.add("hidden");
    lastTime = performance.now();
  }
}

function drawBlock(context, x, y, color, size = BLOCK, alpha = 1) {
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = alpha < 1 ? 0 : 7;
  context.fillRect(x + 2, y + 2, size - 4, size - 4);
  context.shadowBlur = 0;
  context.fillStyle = "#ffffff55";
  context.fillRect(x + 4, y + 4, size - 8, 3);
  context.fillStyle = "#00000044";
  context.fillRect(x + size - 6, y + 5, 3, size - 10);
  context.globalAlpha = 1;
}

function drawMatrix(matrix, offsetX, offsetY, type, alpha = 1, context = ctx, size = BLOCK) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) drawBlock(context, (offsetX + x) * size, (offsetY + y) * size, COLORS[type], size, alpha);
    });
  });
}

function drawBoard() {
  ctx.fillStyle = "#05040b";
  ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  ctx.strokeStyle = "#181329";
  ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * BLOCK, 0);
    ctx.lineTo(x * BLOCK, boardCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * BLOCK);
    ctx.lineTo(boardCanvas.width, y * BLOCK);
    ctx.stroke();
  }
  board.forEach((row, y) => {
    row.forEach((type, x) => {
      if (type) drawBlock(ctx, x * BLOCK, y * BLOCK, COLORS[type]);
    });
  });
}

function drawPreview(context, type) {
  context.clearRect(0, 0, 120, 100);
  context.fillStyle = "#070511";
  context.fillRect(0, 0, 120, 100);
  if (!type) return;
  const matrix = SHAPES[type];
  const size = 22;
  const width = matrix[0].length * size;
  const height = matrix.length * size;
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) drawBlock(context, (120 - width) / 2 + x * size, (100 - height) / 2 + y * size, COLORS[type], size);
    });
  });
}

function drawPreviews() {
  drawPreview(nextCtx, nextType);
  drawPreview(holdCtx, heldType);
}

function draw() {
  drawBoard();
  if (state !== "menu" && piece) {
    drawMatrix(piece.matrix, piece.x, ghostY(), piece.type, 0.2);
    drawMatrix(piece.matrix, piece.x, piece.y, piece.type);
  }
}

function update(time) {
  const dt = Math.min(time - lastTime, 100);
  lastTime = time;
  if (state === "playing") {
    dropCounter += dt;
    const interval = Math.max(90, 850 * Math.pow(0.82, level - 1));
    if (dropCounter >= interval) softDrop(false);
  }
  draw();
  requestAnimationFrame(update);
}

function runAction(action) {
  if ((state === "menu" || state === "gameover") && action !== "pause") startGame();
  if (action === "left") move(-1);
  else if (action === "right") move(1);
  else if (action === "down") softDrop();
  else if (action === "rotate") rotate(1);
  else if (action === "rotateBack") rotate(-1);
  else if (action === "drop") hardDrop();
  else if (action === "hold") holdPiece();
  else if (action === "pause") togglePause();
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

const keyActions = {
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  ArrowDown: "down", s: "down", S: "down",
  ArrowUp: "rotate", w: "rotate", W: "rotate", x: "rotate", X: "rotate",
  z: "rotateBack", Z: "rotateBack",
  c: "hold", C: "hold",
};

document.addEventListener("keydown", (event) => {
  let action = keyActions[event.key];
  if (event.code === "Space") action = "drop";
  if (event.key === "p" || event.key === "P" || event.key === "Escape") action = "pause";
  if (!action) return;
  event.preventDefault();
  if (!event.repeat || ["left", "right", "down"].includes(action)) runAction(action);
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    runAction(button.dataset.action);
  });
});

startButton.addEventListener("click", () => {
  if (state === "paused") togglePause();
  else startGame();
});

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundButton.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
});

board = createBoard();
nextType = takeType();
piece = createPiece(nextType);
nextType = takeType();
updateHud();
drawPreviews();
requestAnimationFrame(update);
