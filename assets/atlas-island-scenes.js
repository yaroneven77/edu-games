(() => {
  "use strict";

  const wrap = (className, title, description, content) => `
    <svg class="scene-svg ${className}" viewBox="0 0 1000 562" preserveAspectRatio="none" role="img" aria-label="${description}">
      <title>${title}</title>
      <desc>${description}</desc>
      <defs>
        <filter id="${className}-shadow"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity=".38"/></filter>
        <filter id="${className}-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="${className}-brass"><stop stop-color="#fff1a6"/><stop offset=".48" stop-color="#c9893d"/><stop offset="1" stop-color="#6d3f2a"/></linearGradient>
      </defs>
      ${content}
    </svg>`;

  const emberArchive = wrap(
    "ember-scene",
    "Ember Archive",
    "A volcanic archive complex with book halls, rune machinery, brass walkways, a memory furnace, and glowing lava channels.",
    `
      <rect width="1000" height="562" fill="#261827"/>
      <path d="M0 0h1000v208Q820 172 702 201T425 184 0 214Z" fill="#593039"/>
      <circle cx="852" cy="91" r="64" fill="#e8a659" opacity=".76"/>
      <g fill="#241a25" opacity=".8"><path d="M0 203 112 105l72 77 126-145 97 154 117-93 107 100 125-158 109 147 135-90v188H0Z"/></g>
      <path d="M0 398Q171 323 327 356t294-7 379 31v182H0Z" fill="#312129"/>
      <path d="M0 514q178-61 358-14t330-4 312 8v58H0Z" fill="#160f18"/>
      <path d="M35 511q148-42 281 2t276 0 373-8" fill="none" stroke="#ff9a3d" stroke-width="26" opacity=".54" filter="url(#ember-scene-glow)"/>
      <path d="M62 511q137-27 257 5m326-5q137-31 276 0" fill="none" stroke="#ffd36e" stroke-width="5" opacity=".7"/>
      <g filter="url(#ember-scene-shadow)">
        <path d="M72 345V203Q72 151 124 151h748q56 0 56 56v138H807v-93h-87v93H598v-93h-93v93H385v-93h-89v93H179v-93h-74v93Z" fill="#6d3b32" stroke="#bf7446" stroke-width="7"/>
        <path d="M95 202h808M121 177h755" stroke="#e0a15a" stroke-width="8"/>
        <g fill="#1d151d" stroke="#a96443" stroke-width="5">
          <path d="M106 345v-84q0-38 37-38t37 38v84Z"/><path d="M297 345v-84q0-38 43-38t43 38v84Z"/>
          <path d="M507 345v-84q0-38 45-38t45 38v84Z"/><path d="M721 345v-84q0-38 43-38t43 38v84Z"/>
        </g>
      </g>
      <g fill="#6d4a35" stroke="#d29854" stroke-width="4"><path d="M91 411 288 287l223 99 205-145 195 113" fill="none" stroke-width="19"/><path d="M91 411 288 287l223 99 205-145 195 113" fill="none" stroke="#2d2526" stroke-width="8" stroke-dasharray="18 10"/></g>
      <g opacity=".75"><circle cx="163" cy="304" r="7" fill="#ffbb4f"/><circle cx="424" cy="304" r="7" fill="#ffbb4f"/><circle cx="650" cy="304" r="7" fill="#ffbb4f"/><circle cx="845" cy="305" r="7" fill="#ffbb4f"/></g>
      <g transform="translate(100 393)" filter="url(#ember-scene-shadow)">
        <path d="M-38 28h76V-30H-20l-18 18Z" fill="#d9bd82" stroke="#70402e" stroke-width="5"/><path d="M-24-12h43M-24 1h49M-24 14h34" stroke="#8d4f35" stroke-width="4"/><path d="m-38-12 18-18v18Z" fill="#f1d69b"/>
        <path d="M-47 34h94" stroke="#2d2022" stroke-width="10"/>
      </g>
      <g transform="translate(230 360)" filter="url(#ember-scene-shadow)">
        <rect x="-46" y="-44" width="92" height="82" rx="8" fill="#4f2f29" stroke="#d2924d" stroke-width="6"/><g stroke="#f0c56a" stroke-width="4"><path d="M-33-27h66M-33-9h66M-33 9h66"/></g>
        <g fill="#ff7d46"><circle cx="-27" cy="-27" r="7"/><circle cx="-8" cy="-27" r="7"/><circle cx="15" cy="-27" r="7"/><circle cx="31" cy="-9" r="7"/><circle cx="-20" cy="9" r="7"/></g>
      </g>
      <g transform="translate(350 309)" filter="url(#ember-scene-shadow)">
        <circle r="50" fill="#37232b" stroke="url(#ember-scene-brass)" stroke-width="8"/><path d="m0-33 27 17v32L0 33l-27-17v-32Z" fill="#e66545" stroke="#ffd36e" stroke-width="5"/><circle r="10" fill="#fff3aa" filter="url(#ember-scene-glow)"/>
        <g stroke="#ed9f50" stroke-width="5"><path d="M0-48v-18M42-24l17-10M42 24l17 10M0 48v18M-42 24l-17 10M-42-24l-17-10"/></g>
      </g>
      <g transform="translate(480 371)" filter="url(#ember-scene-shadow)">
        <rect x="-53" y="-50" width="106" height="92" rx="7" fill="#4a302d" stroke="#b36a42" stroke-width="6"/><path d="M-35-38v67M-9-38v67M17-38v67M39-38v67M-48-16h96M-48 8h96" stroke="#d79852" stroke-width="4"/>
        <g fill="#6fa5b1"><circle cx="-22" cy="-27" r="7"/><circle cx="28" cy="-4" r="8"/><circle cx="3" cy="20" r="6"/></g><path d="M-61 45h122" stroke="#24191d" stroke-width="12"/>
      </g>
      <g transform="translate(610 320)" filter="url(#ember-scene-shadow)">
        <path d="M-48 35V-34q24-15 48 0 24-15 48 0v69q-24-13-48 1-24-14-48-1Z" fill="#f3d99c" stroke="#845038" stroke-width="6"/><path d="M0-30v62M-35-16h25M10-16h25M-35-2h25M10-2h25M-35 12h25" stroke="#9f6846" stroke-width="3"/>
        <path d="m-11-49 11-18 11 18Z" fill="#ffb54f"/>
      </g>
      <g transform="translate(740 371)" filter="url(#ember-scene-shadow)">
        <rect x="-49" y="-46" width="98" height="88" rx="8" fill="#2b2430" stroke="#bb7144" stroke-width="6"/><g fill="#efb35b" stroke="#58372e" stroke-width="4"><path d="m-39-32 28 0 0 27-28 0Z"/><path d="m-5-32 44 0 0 27-44 0Z"/><path d="m-39 2 44 0 0 27-44 0Z"/><path d="m11 2 28 0 0 27-28 0Z"/></g><path d="M-38-31-12-6M-4-30 38-7M-38 3 3 28M12 4 38 28" stroke="#fff0a4" stroke-width="3"/>
      </g>
      <g transform="translate(870 315)" filter="url(#ember-scene-shadow)">
        <path d="M-43 38V-31l43-23 43 23v69Z" fill="#4b3030" stroke="#bd7748" stroke-width="6"/><path d="M0-37v62M-22-14h44" stroke="#f2cf7b" stroke-width="6"/><path d="m-8 25 8-15 8 15Z" fill="#ff9f45" filter="url(#ember-scene-glow)"/>
      </g>
      <g transform="translate(760 219)" filter="url(#ember-scene-shadow)">
        <path d="m-52 39 18-77h67l19 77Z" fill="#b67b52" stroke="#55352d" stroke-width="7"/><path d="M-33-21h65M-40 4h80M-46 28h92" stroke="#f4d18a" stroke-width="4"/><path d="m-20-11 13-9m11 22 18-12m-42 36 18-10" stroke="#55352d" stroke-width="5"/>
      </g>
      <g transform="translate(530 191)" filter="url(#ember-scene-shadow)">
        <circle r="48" fill="#2e2530" stroke="url(#ember-scene-brass)" stroke-width="8"/><g fill="none" stroke="#67d8dd" stroke-width="7"><path d="M-26-19 0-34l28 16v34L0 32l-28-16Z"/><path d="M0-34v66M-28-18l56 34M28-18l-56 34"/></g><circle r="9" fill="#fff3a4" filter="url(#ember-scene-glow)"/>
      </g>
      <g transform="translate(290 202)" filter="url(#ember-scene-shadow)">
        <path d="M-64 47V-25q0-64 64-64t64 64v72Z" fill="#5b342c" stroke="#c47745" stroke-width="8"/><path d="M-33 47V-16q0-34 33-34t33 34v63Z" fill="#1b1218" stroke="#8b4e34" stroke-width="6"/><path d="M0 25q-31-23 0-61 31 38 0 61Z" fill="#ff9d3f" filter="url(#ember-scene-glow)"/><path d="M-70 48h140" stroke="#2b1c20" stroke-width="13"/>
      </g>
      <g fill="#d78b45"><circle cx="61" cy="445" r="5"/><circle cx="142" cy="462" r="4"/><circle cx="822" cy="455" r="6"/><circle cx="932" cy="420" r="4"/></g>
    `
  );

  const tidalObservatory = wrap(
    "tidal-scene",
    "Tidal Observatory",
    "A moon-powered ocean laboratory with connected platforms, glass tanks, tide gates, pearl instruments, docks, pipes, and a large telescope.",
    `
      <rect width="1000" height="562" fill="#12607a"/>
      <path d="M0 0h1000v265q-170-54-330-19T344 229 0 258Z" fill="#48a9ad"/>
      <circle cx="850" cy="88" r="58" fill="#e9ffd1" opacity=".92"/>
      <g fill="#dff9ec" opacity=".4"><path d="M45 126q34-48 83-8 30-36 72-4 33-6 49 28H21q-4-23 24-16Z"/><path d="M655 142q30-38 71-7 29-35 70-2 29-4 43 27H632q-3-20 23-18Z"/></g>
      <path d="M0 356q174-62 343-19t303-4 354 24v205H0Z" fill="#0d4c6c"/>
      <g fill="none" stroke="#bdebdc" filter="url(#tidal-scene-shadow)">
        <ellipse cx="515" cy="320" rx="360" ry="134" stroke-width="24" opacity=".55"/><ellipse cx="515" cy="320" rx="211" ry="81" stroke-width="17" opacity=".5"/>
      </g>
      <g fill="#75c7ba" stroke="#d0f0e3" stroke-width="7" filter="url(#tidal-scene-shadow)">
        <path d="M43 433q80-38 173-14l-13 98H55Z"/><path d="M801 419q89-27 159 13l-13 86H811Z"/>
        <path d="M240 362q108-73 219-36l-12 115-214 6Z"/><path d="M555 324q111-35 221 39l-8 84-222-9Z"/>
      </g>
      <g stroke="#d8f4e6" stroke-width="13" fill="none"><path d="M188 428 290 379M433 357l143-5M741 386l98 52"/><path d="M328 425 332 533M677 421l-2 111" stroke="#5fc7d1" stroke-dasharray="20 11"/></g>
      <g fill="#d8c88d" stroke="#385a61" stroke-width="5"><path d="M41 470h165v32H41Z"/><path d="M62 450v76M103 450v76M145 450v76M186 450v76"/></g>
      <g transform="translate(90 405)" filter="url(#tidal-scene-shadow)">
        <path d="M-44 32h88V-36H-7l-37 20Z" fill="#e3d7a5" stroke="#41666a" stroke-width="5"/><path d="M-25-15h48M-25 0h52M-25 15h37" stroke="#517f7c" stroke-width="4"/><path d="M0 32v22M-15 54h30" stroke="#5b4b37" stroke-width="7"/>
      </g>
      <g transform="translate(200 320)" filter="url(#tidal-scene-shadow)">
        <path d="M-42 44V-32l42-26 42 26v76Z" fill="#317b82" stroke="#d3e9cc" stroke-width="7"/><circle cy="-11" r="25" fill="#eff9d8" stroke="#775f47" stroke-width="5"/><path d="M0-11V-27M0-11l14 8" stroke="#5c4a3d" stroke-width="5"/><path d="M-51 46h102" stroke="#263d4b" stroke-width="12"/>
      </g>
      <g transform="translate(330 388)" filter="url(#tidal-scene-shadow)">
        <rect x="-51" y="-43" width="102" height="84" rx="12" fill="#2d7481" stroke="#cef1e0" stroke-width="7"/><path d="M-34 14q18-39 34 0t34 0" fill="none" stroke="#8de8e3" stroke-width="10"/><path d="M-28-22h56M0-22v20" stroke="#ddc978" stroke-width="6"/><circle cy="-22" r="9" fill="#fff6ae"/>
      </g>
      <g transform="translate(450 309)" filter="url(#tidal-scene-shadow)">
        <path d="M-52 35V-35h104v70Z" fill="#275f76" stroke="#c7ebdc" stroke-width="7"/><g fill="#dde5b2" stroke="#547b7e" stroke-width="4"><circle cx="-31" cy="-16" r="12"/><circle cx="0" cy="-16" r="12"/><circle cx="31" cy="-16" r="12"/><circle cx="-16" cy="15" r="12"/><circle cx="18" cy="15" r="12"/></g>
      </g>
      <g transform="translate(580 382)" filter="url(#tidal-scene-shadow)">
        <path d="M-44 38V-34h88v72Z" fill="#2b6977" stroke="#c8e9d9" stroke-width="6"/><path d="M-25 25q-11-47 25-55 36 8 25 55Z" fill="#79cfd1" stroke="#d9f2de" stroke-width="5"/><circle cy="-7" r="15" fill="#133f5d"/><path d="M-13 25h26M-19 36h38" stroke="#5c503d" stroke-width="6"/>
      </g>
      <g transform="translate(700 309)" filter="url(#tidal-scene-shadow)">
        <circle r="45" fill="#285e75" stroke="#d4edcf" stroke-width="7"/><path d="M0-32q30 18 15 48T-26 25Q5 13 0-32Z" fill="#fff1a6"/><path d="M-44 0h88M0-44v88" stroke="#75c9c4" stroke-width="4"/>
      </g>
      <g transform="translate(880 382)" filter="url(#tidal-scene-shadow)">
        <path d="M-42 40V-25h84v65Z" fill="#2b6473" stroke="#c7eada" stroke-width="6"/><path d="M0-25v-45M-19-55 0-70l19 15M-31-5 0-25 31-5" fill="none" stroke="#e4d184" stroke-width="7"/><circle cy="-71" r="9" fill="#fff6b0" filter="url(#tidal-scene-glow)"/>
      </g>
      <g transform="translate(810 219)" filter="url(#tidal-scene-shadow)">
        <rect x="-55" y="-45" width="110" height="91" rx="8" fill="#2c7480" stroke="#ccecdf" stroke-width="7"/><g fill="#65bfc9" stroke="#d6f4e6" stroke-width="5"><rect x="-43" y="-31" width="37" height="61" rx="8"/><rect x="7" y="-31" width="37" height="61" rx="8"/></g><path d="M-25-17q17 13 0 28M25-12q-16 13 0 27" fill="none" stroke="#f4de8c" stroke-width="4"/>
      </g>
      <g transform="translate(550 191)" filter="url(#tidal-scene-shadow)">
        <circle r="53" fill="#226070" stroke="#d3eddc" stroke-width="8"/><path d="M-34-12h68v39h-68Z" fill="#64bfc7" stroke="#e5f5e5" stroke-width="5"/><path d="M-22-12v-25M0-12v-33M22-12v-25" stroke="#e8d37f" stroke-width="7"/><path d="M-42 29h84" stroke="#193b50" stroke-width="12"/>
      </g>
      <g transform="translate(270 191)" filter="url(#tidal-scene-shadow)">
        <path d="M-58 46V-25q0-57 58-57t58 57v71Z" fill="#367b7f" stroke="#d7eedc" stroke-width="8"/><path d="M-19-69 16-118l22 14-32 52Z" fill="#d7eedc" stroke="#40696e" stroke-width="6"/><ellipse cx="30" cy="-113" rx="42" ry="13" transform="rotate(24 30-113)" fill="#143f5d" stroke="#d7eedc" stroke-width="6"/><path d="M-67 48h134" stroke="#193c50" stroke-width="13"/>
      </g>
      <g fill="#b6e8d8" opacity=".65"><circle cx="122" cy="354" r="5"/><circle cx="150" cy="338" r="3"/><circle cx="746" cy="471" r="6"/><circle cx="776" cy="451" r="4"/><circle cx="937" cy="340" r="5"/></g>
    `
  );

  const frostfireSummit = wrap(
    "frostfire-scene",
    "Frostfire Summit",
    "A mountain weather station divided between an ice ridge and a lava ridge, filled with instruments, supply lifts, thermal cores, beacons, and a guardian gate.",
    `
      <rect width="1000" height="562" fill="#3d4058"/>
      <path d="M0 0h500v562H0Z" fill="#769bbb"/><path d="M500 0h500v562H500Z" fill="#87443b"/>
      <circle cx="112" cy="83" r="54" fill="#eff8ff" opacity=".9"/>
      <path d="M0 350 139 169l78 82 128-207 154 236 128-236 127 197 82-81 164 196v206H0Z" fill="#2f3445"/>
      <path d="M0 350 139 169l78 82 128-207 154 236v282H0Z" fill="#d8eaf0" opacity=".86"/>
      <path d="M500 280 627 44l127 197 82-81 164 196v206H500Z" fill="#663a39"/>
      <path d="m500 562 109-177 54 71 71-163 79 115 64-86 123 142v98Z" fill="#b94c32" opacity=".85"/>
      <path d="M12 512q143-45 276 7t287-6 413 2" fill="none" stroke="#252735" stroke-width="45"/>
      <path d="M80 454 240 390l139 49 133-116 142 117 139-61 151 75" fill="none" stroke="#b8b1a2" stroke-width="24"/><path d="M80 454 240 390l139 49 133-116 142 117 139-61 151 75" fill="none" stroke="#3b3b42" stroke-width="8" stroke-dasharray="18 10"/>
      <g transform="translate(90 354)" filter="url(#frostfire-scene-shadow)">
        <path d="M-49 38V-35h98v73Z" fill="#596879" stroke="#dbe8e8" stroke-width="6"/><path d="m-35-20 29 0 0 28-29 0Z" fill="#d8edf6"/><path d="M11-20h25M11-7h25M-35 20h71" stroke="#f2d78b" stroke-width="5"/><path d="M0-35v-30M-18-51 0-65l18 14" fill="none" stroke="#e7edf0" stroke-width="6"/>
      </g>
      <g transform="translate(210 405)" filter="url(#frostfire-scene-shadow)">
        <rect x="-48" y="-48" width="96" height="90" rx="8" fill="#536779" stroke="#e4edf1" stroke-width="6"/><path d="M-32-29h64M-32-9h64M-32 11h64" stroke="#88cbe6" stroke-width="4"/><path d="M0-35v57" stroke="#ff6c48" stroke-width="8"/><circle cy="24" r="16" fill="#ff7c4d" stroke="#f5ece7" stroke-width="5"/>
      </g>
      <g transform="translate(340 320)" filter="url(#frostfire-scene-shadow)">
        <circle r="51" fill="#4a5663" stroke="#d9e6e8" stroke-width="7"/><path d="M0 26q-30-24 0-66 31 42 0 66Z" fill="#ff7841" filter="url(#frostfire-scene-glow)"/><path d="M-45 5h-24M45 5h24M0-51v-21" stroke="#71cde8" stroke-width="8"/>
      </g>
      <g transform="translate(470 388)" filter="url(#frostfire-scene-shadow)">
        <path d="M-55 38V-39h110v77Z" fill="#62616a" stroke="#d6dcdb" stroke-width="6"/><path d="M-35-18h70M-35 6h70" stroke="#e8c875" stroke-width="6"/><circle cx="-22" cy="-18" r="9" fill="#75cce9"/><circle cx="22" cy="-18" r="9" fill="#ff8250"/><path d="M-65 41h130" stroke="#292932" stroke-width="12"/>
      </g>
      <g transform="translate(590 315)" filter="url(#frostfire-scene-shadow)">
        <rect x="-48" y="-42" width="96" height="80" rx="10" fill="#514d5d" stroke="#d7dadd" stroke-width="6"/><rect x="-18" y="-27" width="36" height="48" rx="18" fill="#c7b9c3" stroke="#322e3d" stroke-width="5"/><path d="M-31 26h62M0 21v23" stroke="#efc96f" stroke-width="6"/><circle cy="-8" r="7" fill="#ff8a55"/>
      </g>
      <g transform="translate(710 388)" filter="url(#frostfire-scene-shadow)">
        <path d="M-51 39V-40h102v79Z" fill="#657486" stroke="#e5eff2" stroke-width="7"/><path d="M-36-23h72M-36-5h72M-36 13h72" stroke="#9ee4f2" stroke-width="5"/><path d="m-25-28 15 12-15 12m44-24-15 12L19-4" fill="none" stroke="#fff" stroke-width="4"/>
      </g>
      <g transform="translate(880 326)" filter="url(#frostfire-scene-shadow)">
        <path d="M-43 41V-25h86v66Z" fill="#5d4d54" stroke="#e2d8d4" stroke-width="6"/><path d="M0-25v-48M-24-58H24L13-19h-26Z" fill="#e35d4b" stroke="#f0dfd7" stroke-width="6"/><circle cy="-63" r="10" fill="#fff1a6" filter="url(#frostfire-scene-glow)"/>
      </g>
      <g transform="translate(780 219)" filter="url(#frostfire-scene-shadow)">
        <path d="M-55 39V-40h110v79Z" fill="#564d56" stroke="#ded8d5" stroke-width="6"/><path d="m-39-25 28-8 25 14 29-8v52l-29 8-25-14-28 8Z" fill="#e5d9ad" stroke="#5a4b42" stroke-width="4"/><path d="M-11-33v52M14-19v52" stroke="#8a6e4a" stroke-width="3"/><path d="M-29 8 1-7l25 18" fill="none" stroke="#de6e48" stroke-width="5"/>
      </g>
      <g transform="translate(540 191)" filter="url(#frostfire-scene-shadow)">
        <circle r="55" fill="#51515b" stroke="#e3ded8" stroke-width="8"/><path d="M-24 26q-21-25 0-54 24 29 0 54ZM24 26q-21-25 0-54 24 29 0 54Z" fill="#ff7b45" filter="url(#frostfire-scene-glow)"/><path d="M0-47v94" stroke="#7bd4ed" stroke-width="7"/>
      </g>
      <g transform="translate(270 202)" filter="url(#frostfire-scene-shadow)">
        <path d="M-67 50V-15q0-70 67-70t67 70v65Z" fill="#44464d" stroke="#85898b" stroke-width="9"/><path d="M-35 49V-9q0-37 35-37T35-9v58Z" fill="#20222b"/><path d="M-76 52h152" stroke="#292a30" stroke-width="15"/><circle cx="-43" cy="-48" r="8" fill="#8fd9ed"/><circle cx="43" cy="-48" r="8" fill="#ff8a51"/>
      </g>
      <g fill="#edf8fb" opacity=".75"><circle cx="44" cy="299" r="5"/><circle cx="149" cy="328" r="4"/><circle cx="296" cy="136" r="5"/></g><g fill="#ff7c48" opacity=".7"><circle cx="835" cy="444" r="6"/><circle cx="919" cy="399" r="4"/><circle cx="664" cy="472" r="5"/></g>
    `
  );

  const unwrittenIsle = wrap(
    "unwritten-scene",
    "The Unwritten Isle",
    "A mysterious final island combining cloud, garden, fire, water, and ice landscapes around a luminous Atlas temple and its guardian.",
    `
      <rect width="1000" height="562" fill="#292553"/>
      <path d="M0 0h1000v246q-179-53-340-18t-310-7Q181 184 0 244Z" fill="#6f60a0"/>
      <circle cx="858" cy="82" r="54" fill="#fff1a5" opacity=".96"/>
      <path d="M0 405Q160 291 315 342t238-17q118-76 231 1t216 72v164H0Z" fill="#3a4262"/>
      <path d="M55 444Q159 314 282 354L337 508H58Z" fill="#5282a1"/><path d="M276 354q103-78 212-11l14 169H337Z" fill="#6c9e67"/><path d="M488 343q107-77 213 2l-33 167H502Z" fill="#a65343"/><path d="M701 345q126-60 244 99l-11 68H668Z" fill="#a9c6d3"/>
      <g fill="none" stroke="#e8d476" opacity=".7"><ellipse cx="530" cy="258" rx="180" ry="129" stroke-width="5"/><ellipse cx="530" cy="258" rx="124" ry="88" stroke-width="4" transform="rotate(28 530 258)"/><ellipse cx="530" cy="258" rx="84" ry="150" stroke-width="3" transform="rotate(-35 530 258)"/></g>
      <path d="M83 409 207 315l131 87 137-111 139 113 142-122 155 111" fill="none" stroke="#d9c67b" stroke-width="24"/><path d="M83 409 207 315l131 87 137-111 139 113 142-122 155 111" fill="none" stroke="#443b58" stroke-width="8" stroke-dasharray="18 10"/>
      <g transform="translate(90 393)" filter="url(#unwritten-scene-shadow)">
        <path d="M-58 39V-33h116v72Z" fill="#4a5574" stroke="#d7c979" stroke-width="6"/><path d="m-37-18 32-13 42 13-42 14Z" fill="#e3d29c" stroke="#655049" stroke-width="4"/><path d="M-5-31v61M-35 3h60M-35 17h48" stroke="#8b6747" stroke-width="4"/><path d="M0-33v-31M-16-52 0-64l16 12" fill="none" stroke="#f0db84" stroke-width="6"/>
      </g>
      <g transform="translate(210 315)" filter="url(#unwritten-scene-shadow)">
        <circle r="50" fill="#4a486c" stroke="#e3d173" stroke-width="7"/><g fill="#75d1dd"><path d="m0-37 16 22-16 21-16-21Z"/><path d="m-30-8 16 21-16 21-16-21Z"/><path d="m30-8 16 21-16 21-16-21Z"/></g><circle cy="14" r="9" fill="#fff0a5" filter="url(#unwritten-scene-glow)"/>
      </g>
      <g transform="translate(340 388)" filter="url(#unwritten-scene-shadow)">
        <path d="M-53 37V-38h106v75Z" fill="#465a70" stroke="#dbc975" stroke-width="6"/><path d="M-38 18 0-23l38 41" fill="none" stroke="#b0d8da" stroke-width="13"/><path d="M-25-2 0 24 25-2" fill="none" stroke="#df8a4b" stroke-width="8"/><circle cx="-39" cy="22" r="8" fill="#82c983"/><circle cx="39" cy="22" r="8" fill="#d9e7ee"/>
      </g>
      <g transform="translate(470 309)" filter="url(#unwritten-scene-shadow)">
        <path d="M-50 39V-38h100v77Z" fill="#504865" stroke="#decf80" stroke-width="6"/><path d="M-32 10h64M-22-22h44" stroke="#e9d477" stroke-width="7"/><circle cx="-24" cy="10" r="14" fill="#76cbd9"/><circle cx="24" cy="10" r="22" fill="#da7c4c"/><path d="M0-38v77" stroke="#2b2c42" stroke-width="5"/>
      </g>
      <g transform="translate(600 388)" filter="url(#unwritten-scene-shadow)">
        <path d="M-42 40V-34q0-33 42-33t42 33v74Z" fill="#696b75" stroke="#d9cb83" stroke-width="7"/><path d="M-22 30V-12q0-20 22-20t22 20v42Z" fill="#303346"/><circle cy="-45" r="9" fill="#fff0a2" filter="url(#unwritten-scene-glow)"/><path d="M-52 43h104" stroke="#303141" stroke-width="12"/>
      </g>
      <g transform="translate(720 309)" filter="url(#unwritten-scene-shadow)">
        <path d="M-53 39V-39h106v78Z" fill="#48566f" stroke="#dfcd7b" stroke-width="6"/><path d="m-38-24 29-8 23 13 27-8v51l-27 8-23-13-29 8Z" fill="#d9d6b1" stroke="#635049" stroke-width="4"/><path d="M-9-32v51M14-19v51" stroke="#8f7150" stroke-width="3"/><path d="M-27 10 2-7l25 17" fill="none" stroke="#69b9ca" stroke-width="5"/>
      </g>
      <g transform="translate(880 376)" filter="url(#unwritten-scene-shadow)">
        <path d="M-48 40V-38h96v78Z" fill="#4a4865" stroke="#decf7e" stroke-width="6"/><path d="M-29-20h58M-29-2h58M-29 16h42" stroke="#ead889" stroke-width="5"/><path d="m25 10 16 17-16 17" fill="none" stroke="#8ed6d9" stroke-width="6"/>
      </g>
      <g transform="translate(790 214)" filter="url(#unwritten-scene-shadow)">
        <path d="M-59 47V-21q0-58 59-58t59 58v68Z" fill="#514867" stroke="#e1cf77" stroke-width="8"/><path d="M-30 46V-11q0-31 30-31t30 31v57Z" fill="#24263d"/><path d="M0 19q-29-20 0-54 29 34 0 54Z" fill="#ffe16f" filter="url(#unwritten-scene-glow)"/><path d="M-68 49h136" stroke="#2f3042" stroke-width="13"/>
      </g>
      <g transform="translate(540 185)" filter="url(#unwritten-scene-shadow)">
        <circle r="57" fill="#403b62" stroke="#e4d177" stroke-width="8"/><g fill="none" stroke-width="7"><ellipse rx="42" ry="18" stroke="#75c9da"/><ellipse rx="42" ry="18" stroke="#df7b4d" transform="rotate(60)"/><ellipse rx="42" ry="18" stroke="#85c77e" transform="rotate(120)"/></g><circle r="12" fill="#fff1a2" filter="url(#unwritten-scene-glow)"/>
      </g>
      <g transform="translate(280 202)" filter="url(#unwritten-scene-shadow)">
        <path d="M-67 50V-17q0-68 67-68t67 68v67Z" fill="#514865" stroke="#e5d079" stroke-width="8"/><path d="M-34 50V-8q0-36 34-36T34-8v58Z" fill="#21233a"/><path d="m0-25 22 25L0 29-22 0Z" fill="#7ed8e2" stroke="#fff0a0" stroke-width="5" filter="url(#unwritten-scene-glow)"/><path d="M-76 52h152" stroke="#303144" stroke-width="14"/>
      </g>
      <g fill="#e9db86"><circle cx="53" cy="458" r="5"/><circle cx="161" cy="443" r="4"/><circle cx="440" cy="469" r="5"/><circle cx="657" cy="458" r="4"/><circle cx="941" cy="448" r="6"/></g>
    `
  );

  window.ATLAS_ISLAND_SCENES = {
    3: emberArchive,
    4: tidalObservatory,
    5: frostfireSummit,
    6: unwrittenIsle
  };
})();
