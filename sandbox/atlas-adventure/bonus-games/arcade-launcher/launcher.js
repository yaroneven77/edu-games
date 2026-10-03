(() => {
  "use strict";

  const sandbox = location.pathname.toLowerCase().includes("/sandbox/");
  const params = new URLSearchParams(location.search);
  const allAccess = params.get("all") === "1";
  const progressKey = sandbox ? "edu-games-atlas-expedition-sandbox-v1" : "edu-games-atlas-expedition-v1";
  const gameByIsland = {
    1: "../road-fighter-game/index.html",
    2: "../tetris-game/index.html",
    3: "../pacman-game/index.html",
    4: "../space-invaders-game/index.html",
    5: "../galaga-game/index.html",
    6: "../kick-and-run-game/index.html"
  };

  let progress = { islands: {} };
  try {
    progress = JSON.parse(localStorage.getItem(progressKey)) || progress;
  } catch {}
  const completed = new Set(
    Object.entries(progress.islands || {}).filter(([, value]) => value?.complete).map(([island]) => Number(island))
  );
  if (!sandbox) {
    try {
      const cloud = JSON.parse(localStorage.getItem("edu-games-atlas-cloud-harbor-v1"));
      const garden = JSON.parse(localStorage.getItem("edu-games-atlas-gale-garden-v1"));
      if (cloud?.step >= 10 && cloud?.secret) completed.add(1);
      if (garden?.step >= 10) completed.add(2);
    } catch {}
  }

  const unlocked = island => sandbox || allAccess || completed.has(island);
  const requestedValue = Number(params.get("island"));
  const requestedIsland = requestedValue ? Math.max(1, Math.min(6, requestedValue)) : 0;
  const status = document.getElementById("unlockStatus");
  const cards = [...document.querySelectorAll("[data-island]")];

  cards.forEach(card => {
    const island = Number(card.dataset.island);
    card.dataset.locked = String(!unlocked(island));
    card.dataset.highlighted = String(island === requestedIsland);
    const link = card.querySelector("a");
    const gamePath = link.getAttribute("href").split("?")[0];
    link.href = `${gamePath}?v=5${allAccess ? "&all=1" : ""}`;
  });

  const availableCount = cards.filter(card => card.dataset.locked === "false").length;
  status.textContent = sandbox || allAccess
    ? "All six games available"
    : `${availableCount} of 6 island games unlocked`;

  if (requestedIsland && unlocked(requestedIsland)) {
    location.replace(`${gameByIsland[requestedIsland]}?v=5${allAccess ? "&all=1" : ""}`);
  }
})();
