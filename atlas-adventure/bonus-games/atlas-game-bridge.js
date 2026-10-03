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

  const controls = document.querySelector(".touch-controls, .controls");
  if (controls) {
    const directionByCommand = {
      left: "left",
      right: "right",
      up: "up",
      down: "down",
      boost: "up",
      brake: "down"
    };
    const stick = document.createElement("div");
    const actions = document.createElement("div");
    const stickCore = document.createElement("span");
    stick.className = "gamepad-stick";
    stick.setAttribute("aria-label", "Movement controls");
    actions.className = "gamepad-actions";
    actions.setAttribute("aria-label", "Action controls");
    stickCore.className = "gamepad-stick-core";
    stick.setAttribute("role", "group");
    actions.setAttribute("role", "group");

    [...controls.querySelectorAll("button")].forEach(button => {
      const command = button.dataset.control || button.dataset.direction || button.dataset.action || "";
      const direction = directionByCommand[command];
      if (direction) {
        button.classList.add("gamepad-direction", `gamepad-${direction}`);
        stick.append(button);
      } else {
        button.classList.add("gamepad-action");
        actions.append(button);
      }
    });

    stick.append(stickCore);
    controls.classList.add("mobile-gamepad");
    controls.replaceChildren(stick, actions);
  }

  const style = document.createElement("style");
  style.textContent = `
    html,body{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
    .touch-controls,.controls,.touch-controls button,.controls button,canvas{touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}
    .atlas-game-nav{position:relative;z-index:50;width:min(920px,94vw);display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px auto 0;font:700 13px/1.2 system-ui,sans-serif}
    .atlas-game-nav a{min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #25f4ff;border-radius:10px;color:#fff;background:rgba(4,10,24,.88);text-decoration:none}
    .atlas-game-nav a:focus-visible{outline:3px solid #ffe600;outline-offset:2px}
    @media (max-width:1024px),(pointer:coarse){
      body{padding-bottom:max(150px,env(safe-area-inset-bottom))}
      .mobile-gamepad{position:fixed!important;z-index:100!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:clamp(145px,25vh,205px)!important;display:block!important;margin:0!important;padding:0!important;background:linear-gradient(180deg,transparent,rgba(2,5,15,.28) 32%,rgba(2,5,15,.72));pointer-events:none}
      .mobile-gamepad .gamepad-stick,.mobile-gamepad .gamepad-actions{position:absolute;bottom:max(12px,env(safe-area-inset-bottom));width:clamp(126px,30vw,184px);height:clamp(126px,30vw,184px);pointer-events:auto}
      .mobile-gamepad .gamepad-stick{left:max(14px,env(safe-area-inset-left));border:2px solid rgba(121,235,255,.62);border-radius:50%;background:radial-gradient(circle,rgba(76,176,214,.3) 0 28%,rgba(15,46,70,.72) 30% 58%,rgba(5,17,31,.88) 60%);box-shadow:inset 0 0 22px rgba(105,227,255,.32),0 8px 24px rgba(0,0,0,.42),0 0 18px rgba(54,209,255,.2)}
      .mobile-gamepad .gamepad-stick-core{position:absolute;inset:34%;border:2px solid rgba(178,246,255,.76);border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(205,251,255,.8),rgba(29,149,199,.6) 28%,rgba(7,45,71,.92) 70%);box-shadow:0 0 14px rgba(60,218,255,.75);pointer-events:none}
      .mobile-gamepad button{position:absolute!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:0!important;min-width:0!important;min-height:0!important;width:38%!important;height:38%!important;border:2px solid rgba(191,248,255,.72)!important;border-radius:50%!important;color:#effdff!important;background:linear-gradient(145deg,rgba(104,215,246,.5),rgba(7,52,81,.88))!important;box-shadow:inset 0 0 13px rgba(189,246,255,.28),0 5px 12px rgba(0,0,0,.42),0 0 11px rgba(63,218,255,.25)!important;font:900 clamp(13px,2.8vw,18px)/1 system-ui,sans-serif!important;text-shadow:0 1px 4px #001722!important;grid-area:auto!important}
      .mobile-gamepad button:active,.mobile-gamepad button.is-pressed{transform:scale(.9)!important;color:#07121b!important;background:linear-gradient(145deg,#fff9aa,#4ce9ff)!important;box-shadow:inset 0 3px 10px rgba(0,0,0,.35),0 0 20px rgba(86,235,255,.9)!important}
      .mobile-gamepad .gamepad-up{top:2%;left:31%}
      .mobile-gamepad .gamepad-down{bottom:2%;left:31%}
      .mobile-gamepad .gamepad-left{top:31%;left:2%}
      .mobile-gamepad .gamepad-right{top:31%;right:2%}
      .mobile-gamepad .gamepad-actions{right:max(14px,env(safe-area-inset-right))}
      .mobile-gamepad .gamepad-actions:empty{display:none}
      .mobile-gamepad .gamepad-action{width:48%!important;height:48%!important;color:#fff!important;background:linear-gradient(145deg,rgba(255,91,206,.72),rgba(102,12,116,.92))!important;border-color:rgba(255,213,248,.82)!important}
      .mobile-gamepad .gamepad-action:nth-child(1){right:0;bottom:8%}
      .mobile-gamepad .gamepad-action:nth-child(2){left:4%;top:8%}
      .mobile-gamepad .gamepad-action:nth-child(3){right:6%;top:0}
      .mobile-gamepad .gamepad-action:only-child{right:4%;bottom:8%;width:62%!important;height:62%!important}
    }
    @media (orientation:landscape) and (max-height:560px){
      body{padding-bottom:0}
      .mobile-gamepad{height:148px!important;background:linear-gradient(180deg,transparent,rgba(2,5,15,.38))}
      .mobile-gamepad .gamepad-stick,.mobile-gamepad .gamepad-actions{width:132px;height:132px;bottom:max(8px,env(safe-area-inset-bottom))}
    }
  `;
  document.head.append(style);

  ["contextmenu", "selectstart", "dragstart"].forEach(type => {
    document.addEventListener(type, event => event.preventDefault());
  });

  document.querySelectorAll(".mobile-gamepad button").forEach(button => {
    const release = () => button.classList.remove("is-pressed");
    button.addEventListener("pointerdown", () => button.classList.add("is-pressed"));
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
})();
