(function () {
  "use strict";

  var STORAGE_KEY = "edu-games-site-design";
  var LEGACY_KEY = "edu-games-grade4-design";
  var DEFAULT_THEME = "adventure";
  var THEMES = [
    { id: "adventure", icon: "🗺️", label: "מפת הרפתקה" },
    { id: "space", icon: "🚀", label: "אקדמיית החלל" },
    { id: "classroom", icon: "🏫", label: "כיתה ידידותית" },
    { id: "stickers", icon: "📒", label: "אלבום מדבקות" },
    { id: "arcade", icon: "🕹️", label: "ארקייד משחקים" }
  ];

  var themeIds = THEMES.map(function (theme) { return theme.id; });

  function isTheme(value) {
    return themeIds.indexOf(value) !== -1;
  }

  function readTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (isTheme(saved)) return saved;
      var legacy = localStorage.getItem(LEGACY_KEY);
      if (isTheme(legacy)) {
        localStorage.setItem(STORAGE_KEY, legacy);
        return legacy;
      }
    } catch (error) {
      console.warn("Design preference storage is unavailable.", error);
    }
    return DEFAULT_THEME;
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      return true;
    } catch (error) {
      console.warn("Design preference could not be saved.", error);
      return false;
    }
  }

  function applyTheme(theme) {
    var selected = isTheme(theme) ? theme : DEFAULT_THEME;
    document.documentElement.setAttribute("data-edu-theme", selected);
    document.documentElement.style.colorScheme = selected === "space" || selected === "arcade" ? "dark" : "light";
    return selected;
  }

  var queryTheme = new URLSearchParams(location.search).get("themePreview");
  var initialTheme = applyTheme(isTheme(queryTheme) ? queryTheme : readTheme());

  var styles = [
    "#edu-theme-control{position:fixed;top:8px;right:8px;z-index:2147483000;display:flex;align-items:center;gap:6px;padding:5px 8px;border:3px solid var(--edu-accent,#287db9);border-radius:14px;background:var(--edu-control,#fff);box-shadow:0 4px 12px rgba(20,45,70,.25);direction:rtl;font-family:\"Segoe UI\",\"Arial Hebrew\",Arial,sans-serif}",
    "#edu-theme-control span{font-size:18px;line-height:1}",
    "#edu-theme-select{max-width:155px;border:0;outline:0;background:transparent;color:var(--edu-control-text,#243b53);font:900 13px \"Segoe UI\",\"Arial Hebrew\",Arial,sans-serif;cursor:pointer;direction:rtl}",
    "#edu-theme-select option{background:#fff;color:#243b53}",
    "@media(max-width:520px){#edu-theme-control{top:6px;right:6px;padding:4px 6px}#edu-theme-select{max-width:135px;font-size:12px}}",

    "html[data-edu-theme]{--blue:var(--edu-accent);--blue-d:var(--edu-accent-dark);--blue-dark:var(--edu-accent-dark);--green:var(--edu-success);--red:var(--edu-danger);--purple:var(--edu-secondary);--yellow:var(--edu-highlight);--ink:var(--edu-text);--muted:var(--edu-muted);--card:var(--edu-surface);--paper:var(--edu-surface);--pale:var(--edu-soft);--bg1:var(--edu-bg1);--bg2:var(--edu-bg2);--shadow:var(--edu-shadow)}",
    "html[data-edu-theme] body{background:var(--edu-background)!important;color:var(--edu-text)!important;font-family:var(--edu-font)!important;background-attachment:fixed!important;padding-top:62px!important}",
    "html[data-edu-theme] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.question-card,.world-card,.world-head,.progress-card,.modal,.lesson-modal,.explain,.score,.pill,.count-note,.source-note,.panel,.game-card,.menu-card,.stage-card,.content-card,.coming){background:var(--edu-surface)!important;border-color:var(--edu-border)!important;border-radius:var(--edu-radius)!important;box-shadow:var(--edu-card-shadow)!important;color:var(--edu-text)!important}",
    "html[data-edu-theme] :where(button,.btn,.choice,.next,.primary,.secondary,.home,.back,.learn,.action,.tab,.rnav,.check-order,.reset-order):not(.correct):not(.wrong):not(.ok):not(.no):not(.good):not(.bad){background:var(--edu-soft)!important;border-color:var(--edu-border)!important;border-radius:var(--edu-button-radius)!important;color:var(--edu-text)!important}",
    "html[data-edu-theme] :where(.next,.primary,.learn,.action,.btn.blue,.btn.green,.check-order):not(.correct):not(.wrong):not(.ok):not(.no){background:var(--edu-accent)!important;color:var(--edu-action-text)!important}",
    "html[data-edu-theme] :where(.correct,.ok,.good){color:#145c35!important}html[data-edu-theme] :where(.wrong,.no,.bad){color:#8c2c28!important}",
    "html[data-edu-theme] :where(input,select,textarea,.order-answer,.order-bank button,.vocab-chip){background:var(--edu-input)!important;border-color:var(--edu-border)!important;color:var(--edu-text)!important;border-radius:var(--edu-button-radius)!important}",
    "html[data-edu-theme] :where(h1,h2,h3,h4,.logo,.app-logo,.game-title,.section-title){color:var(--edu-heading)!important}",
    "html[data-edu-theme] :where(.number,.expression,.lesson-title,.lesson-visual,.big-eq,.big-number,.frac-target,.qtitle b,.kind){color:var(--edu-heading)!important}",
    "html[data-edu-theme] :where(.lesson-visual,.visual,.kind){background:var(--edu-soft)!important;border-color:var(--edu-border)!important}",
    "html[data-edu-theme] :where(.sub,.subtitle,footer,small,label,.tile p,.grade p,.world-card p){color:var(--edu-muted)!important}",
    "html[data-edu-theme] :where(.progress span,.progress-bar>div,.progress-fill){background:linear-gradient(90deg,var(--edu-accent),var(--edu-secondary))!important}",
    "html[data-edu-theme] :where(a,button){transition:transform .12s,box-shadow .12s,background-color .2s,border-color .2s,color .2s}",
    "html[data-edu-theme] body:before,html[data-edu-theme] body:after{position:fixed;z-index:-1;pointer-events:none;filter:drop-shadow(0 5px 4px rgba(0,0,0,.15));opacity:.42}",

    "html[data-edu-theme=\"adventure\"]{--edu-bg1:#bfe9ff;--edu-bg2:#91d675;--edu-background:linear-gradient(180deg,#bfe9ff 0 38%,#91d675 38% 100%);--edu-surface:#fffdf4;--edu-soft:#eef8dc;--edu-input:#fffef8;--edu-text:#244236;--edu-muted:#557263;--edu-heading:#256d4d;--edu-accent:#2d8c63;--edu-accent-dark:#206748;--edu-secondary:#dd9d2f;--edu-success:#2f9f5e;--edu-danger:#d9574e;--edu-highlight:#ffd45c;--edu-border:#d3b467;--edu-shadow:rgba(50,77,47,.23);--edu-card-shadow:0 7px 0 rgba(91,91,45,.2);--edu-control:#fffdf4;--edu-control-text:#244236;--edu-action-text:#fff;--edu-radius:22px;--edu-button-radius:16px;--edu-font:\"Segoe UI\",\"Arial Hebrew\",Arial,sans-serif}",
    "html[data-edu-theme=\"adventure\"] body:before{content:\"🌳\";font-size:110px;left:2vw;bottom:2vh}html[data-edu-theme=\"adventure\"] body:after{content:\"🧭\";font-size:86px;right:2vw;bottom:3vh}",
    "html[data-edu-theme=\"adventure\"] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.world-card){border:3px solid var(--edu-border)!important}",

    "html[data-edu-theme=\"space\"]{--edu-bg1:#18234a;--edu-bg2:#080c22;--edu-background:radial-gradient(circle at 18% 12%,#31458a,#0d1333 54%,#080c22);--edu-surface:#18234a;--edu-soft:#202f61;--edu-input:#111b3d;--edu-text:#eef8ff;--edu-muted:#c3d5ef;--edu-heading:#72d8ff;--edu-accent:#58ccef;--edu-accent-dark:#36acd0;--edu-secondary:#b976ef;--edu-success:#50cf8a;--edu-danger:#ff7777;--edu-highlight:#ffe06a;--edu-border:#526aba;--edu-shadow:rgba(0,0,0,.38);--edu-card-shadow:0 7px 0 rgba(4,8,28,.48),0 0 18px rgba(88,204,239,.16);--edu-control:#18234a;--edu-control-text:#eef8ff;--edu-action-text:#07162a;--edu-radius:22px;--edu-button-radius:16px;--edu-font:\"Segoe UI\",Arial,sans-serif}",
    "html[data-edu-theme=\"space\"] body{background-image:radial-gradient(#fff 1px,transparent 1px),var(--edu-background)!important;background-size:42px 42px,auto!important}",
    "html[data-edu-theme=\"space\"] body:before{content:\"🪐\";font-size:115px;left:2vw;bottom:2vh}html[data-edu-theme=\"space\"] body:after{content:\"🚀\";font-size:82px;right:3vw;bottom:4vh}",
    "html[data-edu-theme=\"space\"] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.world-card,.world-head,.score,.pill,.explain){border:2px solid var(--edu-border)!important}",
    "html[data-edu-theme=\"space\"] :where(p,small,label,footer,.feedback,.instruction){color:var(--edu-muted)!important}",

    "html[data-edu-theme=\"classroom\"]{--edu-bg1:#f4e6c6;--edu-bg2:#c59467;--edu-background:linear-gradient(180deg,#f4e6c6 0 78%,#c59467 78%);--edu-surface:#fffdf5;--edu-soft:#eff5dd;--edu-input:#fffef9;--edu-text:#293f35;--edu-muted:#5d7368;--edu-heading:#276b50;--edu-accent:#2f7258;--edu-accent-dark:#225440;--edu-secondary:#c8863d;--edu-success:#3f9b61;--edu-danger:#cc5d50;--edu-highlight:#f0bd42;--edu-border:#9f6c42;--edu-shadow:rgba(74,42,20,.22);--edu-card-shadow:0 7px 0 rgba(112,73,41,.22);--edu-control:#fffdf5;--edu-control-text:#293f35;--edu-action-text:#fff;--edu-radius:10px;--edu-button-radius:10px;--edu-font:\"Trebuchet MS\",\"Segoe UI\",\"Arial Hebrew\",Arial,sans-serif}",
    "html[data-edu-theme=\"classroom\"] body:before{content:\"✏️\";font-size:100px;left:2vw;bottom:2vh}html[data-edu-theme=\"classroom\"] body:after{content:\"📚\";font-size:92px;right:2vw;bottom:2vh}",
    "html[data-edu-theme=\"classroom\"] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.world-card){border:4px solid var(--edu-border)!important;border-bottom-width:9px!important}",

    "html[data-edu-theme=\"stickers\"]{--edu-bg1:#fff;--edu-bg2:#dff3fb;--edu-background:repeating-linear-gradient(#fff 0,#fff 31px,#cce7f3 32px);--edu-surface:#fff;--edu-soft:#fff0f6;--edu-input:#fffafd;--edu-text:#3f4050;--edu-muted:#747383;--edu-heading:#d94f7e;--edu-accent:#df5b86;--edu-accent-dark:#b53b66;--edu-secondary:#45abc9;--edu-success:#34a96b;--edu-danger:#e05a58;--edu-highlight:#ffd053;--edu-border:#e985a5;--edu-shadow:rgba(87,68,93,.18);--edu-card-shadow:0 7px 0 rgba(117,86,113,.16);--edu-control:#fff;--edu-control-text:#3f4050;--edu-action-text:#fff;--edu-radius:24px;--edu-button-radius:999px;--edu-font:\"Comic Sans MS\",\"Segoe UI\",\"Arial Hebrew\",Arial,sans-serif}",
    "html[data-edu-theme=\"stickers\"] body:before{content:\"🌈\";font-size:105px;left:1vw;bottom:2vh}html[data-edu-theme=\"stickers\"] body:after{content:\"⭐\";font-size:88px;right:2vw;bottom:3vh}",
    "html[data-edu-theme=\"stickers\"] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.world-card){border:3px dashed var(--edu-border)!important}",

    "html[data-edu-theme=\"arcade\"]{--edu-bg1:#11182d;--edu-bg2:#25204b;--edu-background:linear-gradient(135deg,#11182d,#25204b);--edu-surface:#17213b;--edu-soft:#202d4e;--edu-input:#10192e;--edu-text:#f7f8ff;--edu-muted:#c7cde7;--edu-heading:#48f5bb;--edu-accent:#48f5bb;--edu-accent-dark:#24c996;--edu-secondary:#ff55c8;--edu-success:#48e087;--edu-danger:#ff6969;--edu-highlight:#ffe65b;--edu-border:#48f5bb;--edu-shadow:rgba(0,0,0,.5);--edu-card-shadow:0 0 0 3px #48f5bb,0 0 19px rgba(72,245,187,.3);--edu-control:#17213b;--edu-control-text:#f7f8ff;--edu-action-text:#071c17;--edu-radius:4px;--edu-button-radius:4px;--edu-font:Consolas,\"Segoe UI\",\"Arial Hebrew\",monospace}",
    "html[data-edu-theme=\"arcade\"] body{background-image:linear-gradient(rgba(72,245,187,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(72,245,187,.07) 1px,transparent 1px),var(--edu-background)!important;background-size:24px 24px,24px 24px,auto!important}",
    "html[data-edu-theme=\"arcade\"] body:before{content:\"👾\";font-size:100px;left:2vw;bottom:2vh}html[data-edu-theme=\"arcade\"] body:after{content:\"🕹️\";font-size:86px;right:2vw;bottom:3vh}",
    "html[data-edu-theme=\"arcade\"] :where(.card,.tile,.grade,.lesson-card,.practice-card,.question-box,.world-card,.world-head,.score,.pill,.explain){border:3px solid var(--edu-border)!important}",
    "html[data-edu-theme=\"arcade\"] :where(p,small,label,footer,.feedback,.instruction){color:var(--edu-muted)!important}"
  ].join("\n");

  function installStyles() {
    if (document.getElementById("edu-theme-styles")) return;
    var style = document.createElement("style");
    style.id = "edu-theme-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function createSelector() {
    if (document.getElementById("edu-theme-control")) return;
    var control = document.createElement("label");
    control.id = "edu-theme-control";
    control.setAttribute("aria-label", "בחירת עיצוב");

    var icon = document.createElement("span");
    icon.textContent = "🎨";
    icon.setAttribute("aria-hidden", "true");

    var select = document.createElement("select");
    select.id = "edu-theme-select";
    select.setAttribute("aria-label", "בחירת עיצוב");

    THEMES.forEach(function (theme) {
      var option = document.createElement("option");
      option.value = theme.id;
      option.textContent = theme.icon + " " + theme.label;
      select.appendChild(option);
    });

    select.value = initialTheme;
    select.addEventListener("change", function () {
      initialTheme = applyTheme(select.value);
      select.value = initialTheme;
      saveTheme(initialTheme);
      document.dispatchEvent(new CustomEvent("edu-theme-change", { detail: { theme: initialTheme } }));
    });

    control.appendChild(icon);
    control.appendChild(select);
    document.body.appendChild(control);

    if (new URLSearchParams(location.search).get("themeSelfTest") === "1") {
      setTimeout(function () {
        var failures = [];
        var originalTheme = initialTheme;
        var originalStored = null;
        try {
          originalStored = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
          failures.push("Storage is unavailable");
        }

        if (select.options.length !== THEMES.length) failures.push("Theme options are missing");
        var bodyBackgrounds = new Set();
        THEMES.forEach(function (theme) {
          if (applyTheme(theme.id) !== theme.id || document.documentElement.getAttribute("data-edu-theme") !== theme.id) {
            failures.push(theme.id + ": theme did not apply");
          }
          void document.body.offsetWidth;
          var rootStyle = getComputedStyle(document.documentElement);
          if (!rootStyle.getPropertyValue("--edu-accent").trim()) failures.push(theme.id + ": theme variables are missing");
          bodyBackgrounds.add(getComputedStyle(document.body).backgroundImage);
        });
        if (bodyBackgrounds.size !== THEMES.length) failures.push("Page backgrounds do not vary across themes");

        select.value = "space";
        select.dispatchEvent(new Event("change"));
        try {
          if (localStorage.getItem(STORAGE_KEY) !== "space") failures.push("Theme was not persisted");
        } catch (error) {
          failures.push("Theme persistence could not be checked");
        }

        var controlRect = control.getBoundingClientRect();
        if (controlRect.right > innerWidth + 1 || controlRect.top < 0 || innerWidth - controlRect.right > 28) {
          failures.push("Selector is not at the upper right");
        }
        if (document.documentElement.scrollWidth > innerWidth + 1) {
          failures.push("Theme creates horizontal overflow");
        }

        applyTheme(originalTheme);
        select.value = originalTheme;
        try {
          if (originalStored === null) localStorage.removeItem(STORAGE_KEY);
          else localStorage.setItem(STORAGE_KEY, originalStored);
        } catch (error) {
          failures.push("Theme preference could not be restored");
        }

        var result = document.createElement("div");
        result.id = "edu-theme-selftest";
        result.hidden = true;
        result.textContent = failures.length ? "THEME SELFTEST: FAIL\n" + failures.join("\n") : "THEME SELFTEST: PASS";
        document.body.appendChild(result);
      }, 0);
    }
  }

  installStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSelector, { once: true });
  } else {
    createSelector();
  }
}());
