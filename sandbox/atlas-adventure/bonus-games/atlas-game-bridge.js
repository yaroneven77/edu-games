(() => {
  "use strict";

  const segments = location.pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) || "";
  const folder = lastSegment.includes(".") ? segments.at(-2) || "" : lastSegment;
  const islandByFolder = {
    "road-fighter-game": 1,
    "tetris-game": 2,
    "pacman-game": 3,
    "space-invaders-game": 4,
    "galaga-game": 5,
    "kick-and-run-game": 6
  };
  const islandFolder = {
    1: "../../index.html",
    2: "../../island-two/index.html",
    3: "../../island-three/index.html",
    4: "../../island-four/index.html",
    5: "../../island-five/index.html",
    6: "../../island-six/index.html"
  };
  const island = islandByFolder[folder] || 1;
  const sandbox = location.pathname.toLowerCase().includes("/sandbox/");
  const allAccess = new URLSearchParams(location.search).get("all") === "1";
  if (!sandbox && !allAccess) {
    try {
      const progress = JSON.parse(localStorage.getItem("edu-games-atlas-expedition-v1"));
      let complete = Boolean(progress?.islands?.[String(island)]?.complete);
      if (island === 1) {
        const legacy = JSON.parse(localStorage.getItem("edu-games-atlas-cloud-harbor-v1"));
        complete ||= Boolean(legacy?.step >= 10 && legacy?.secret);
      }
      if (island === 2) {
        const legacy = JSON.parse(localStorage.getItem("edu-games-atlas-gale-garden-v1"));
        complete ||= Boolean(legacy?.step >= 10);
      }
      if (!complete) {
        location.replace("../arcade-launcher/index.html");
        return;
      }
    } catch {
      location.replace("../arcade-launcher/index.html");
      return;
    }
  }
  const nav = document.createElement("nav");
  nav.className = "atlas-game-nav";
  nav.setAttribute("aria-label", "Atlas navigation");
  nav.innerHTML = `<a href="${islandFolder[island]}">← Return to Island ${island}</a><a href="../arcade-launcher/index.html${allAccess ? "?all=1" : ""}">All games</a><a href="../../map/index.html">Expedition map</a>`;
  document.body.prepend(nav);

  const style = document.createElement("style");
  style.textContent = `html,body{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.touch-controls,.controls,.touch-controls button,.controls button,canvas{touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}.atlas-game-nav{position:relative;z-index:50;width:min(920px,94vw);display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px auto 0;font:700 13px/1.2 system-ui,sans-serif}.atlas-game-nav a{min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #25f4ff;border-radius:10px;color:#fff;background:rgba(4,10,24,.88);text-decoration:none}.atlas-game-nav a:focus-visible{outline:3px solid #ffe600;outline-offset:2px}`;
  document.head.append(style);

  ["contextmenu", "selectstart", "dragstart"].forEach(type => {
    document.addEventListener(type, event => event.preventDefault());
  });
})();
