# Edu Games Copilot Instructions

## Project purpose

Edu Games is a collection of educational English, math, and Kindergarten games created for children. Keep every change child-friendly, simple to use, visually engaging, and appropriate for the intended age group.

## Architecture

- Keep the project dependency-free unless the user explicitly requests otherwise.
- Each game should keep its curriculum and JavaScript self-contained in its HTML file; shared presentation assets are limited to `assets/theme-selector.js` and `assets/refresh.css`.
- Do not introduce a build step, framework, package manager, or server requirement for ordinary content additions.
- Keep games usable from GitHub Pages and when opened locally in a browser.
- Preserve offline capability except for optional services already used by the project, such as analytics.
- Add a new game in its own folder with an `index.html` file.
- Link new games from the appropriate section hub and, when relevant, from the root `index.html`.
- Keep the learner hierarchy rooted in `english/`, `math/`, and `kindergarten/`.
- Organize math games by grade under `math/`, such as `math/grade-3/` and `math/grade-4/`.
- Organize English games under `english/`, with categories at `english/grade-3/`, `english/grade-4/`, and `english/english-12plus/`.
- Keep the two Kindergarten games at `kindergarten/picture-pairs/` and `kindergarten/number-war/`, linked from `kindergarten/index.html`.
- Grade 4 currently contains 11 games covering numbers to one million, order of operations, fraction comparison, written arithmetic, number properties, fraction operations, word problems, geometry, measurement, data, and probability.
- English Grade 4 lives at `english/grade-4/` and groups 28 vocabulary, grammar, reading-comprehension, and guided-writing topics into six learning worlds. Preserve both mixed world practice and direct access to every topic.
- All active production pages load `assets/theme-selector.js`. Preserve the upper-right five-template selector, the `edu-games-site-design` preference, and consistent theme behavior across navigation.
- Shared presentation assets are intentional exceptions to the otherwise self-contained game-page architecture; game content and behavior must remain usable if optional styling or the theme script fails to load.
- Keep original game content in the canonical `english/`, `math/`, and `kindergarten/` hierarchy; the approved comparison version mirrors these paths inside `edu-games2/`. Do not recreate obsolete top-level redirect folders.
- Treat `sandbox/sandbox.html` as the preview hub for all new or substantially changed content.
- Add staged content to the sandbox preview hub so the user can test it at the published sandbox URL before production promotion.
- Preserve existing previews as separate files or folders linked from the sandbox hub instead of overwriting unrelated staged content.
- Keep experimental content out of the production hubs and navigation until the user approves it.
- Before any production push, publish the proposed behavior in the sandbox and wait for explicit user approval.

## Canonical repository hierarchy

```text
edu-games/
├── index.html
├── assets/
│   ├── theme-selector.js
│   └── refresh.css
├── english/
│   ├── index.html
│   ├── grade-3/
│   │   └── index.html
│   ├── grade-4/
│   │   └── index.html
│   └── english-12plus/
│       ├── index.html
│       └── secret-agent/
│           └── index.html
├── math/
│   ├── index.html
│   ├── grade-3/
│   │   ├── index.html
│   │   └── fractions-lesson/
│   │       └── index.html
│   └── grade-4/
│       ├── index.html
│       ├── numbers/
│       ├── written-arithmetic/
│       ├── operations/
│       ├── number-properties/
│       ├── fractions/
│       ├── fraction-operations/
│       ├── word-problems/
│       ├── geometry/
│       ├── measurement/
│       ├── data/
│       └── probability/
└── kindergarten/
    ├── index.html
    ├── picture-pairs/
    │   └── index.html
    └── number-war/
        └── index.html
```

- The root learner hub links only to `english/`, `math/`, and `kindergarten/`.
- Subject hubs link to their direct children using local relative paths.
- Home and back controls move one level up through this hierarchy.
- English 12+ content belongs under `english/english-12plus/`; Secret Agent belongs under its `secret-agent/` folder.
- Math content belongs under its grade. The fractions lesson belongs under `math/grade-3/fractions-lesson/`.
- Kindergarten uses a two-card hub with separate Picture Pairs and Number War pages; do not combine them into tabs on the hub.
- Do not recreate the removed top-level `grade-3/`, `grade-4/`, `fractions-lesson/`, `division-game/`, `english-12plus/`, `secret-agent/`, or `word-game/` folders.
- Infrastructure and preview folders such as `.github/`, `assets/`, and `sandbox/` are not part of the learner hierarchy.
- Recalculate `assets/theme-selector.js` paths whenever a page moves. Subject hubs use `../assets/`, grade/category pages use `../../assets/`, and games nested below a grade/category use `../../../assets/`.

## Improving the existing games

- Preserve the existing page hierarchy, curriculum, game structure, and answer/scoring logic when improving appearance and usability.
- Start with one sandbox demo and obtain approval before expanding a redesign to other games.
- Prefer clearer typography, spacing, feedback, and controls. Do not add adventure layers, prerequisite puzzles, extra stages, or new scoring systems unless explicitly requested.
- The experimental adventure remake was rejected and removed. Do not restore its added puzzles or use it as the basis for future improvements.
- The simple visual-refresh demo remains at `sandbox/simple-refresh/index.html`. The subsequently approved design from `edu-games2/` has been promoted to the canonical pages; the theme engine and original gameplay scripts remain unchanged.

## Approved design and retained Edu Games 2 preview

- The user approved recreating `edu-games2/` as a visual-refresh copy of all original learner pages, not an adventure remake. Mirror the same subject, grade, and game hierarchy, including all curriculum and existing lessons.
- The user approved applying the new presentation to the main site locally. Canonical pages load root `assets/refresh.css`, retain their original gameplay scripts, and have no comparison bars or dependency on `edu-games2/`. A local promotion does not authorize a commit or push.
- Retain `edu-games2/` as a separate preview; do not automatically synchronize future edits. Its comparison links now open the refreshed canonical site. The earlier design is preserved in Git history.
- Preserve existing game mechanics, questions, scoring, help, next controls, and learning sequence. Use clearer typography, spacing, readable controls, and calmer styling; do not add prerequisite puzzles, extra stages, or new reward systems.
- Match page-title sizing and spacing to the corresponding original `edu-games` page across all five templates; do not enlarge or compact those headers as part of the refresh.
- English Grade 4 retains the original panel geometry, including topic actions, practice, explanations, and lesson dialogs. Its `data-original-layout`/`original-layout` markers opt out of shared layout overrides; comparison links share the existing top control area rather than adding page height.
- Every copied learner page has a clearly labeled comparison bar linking to its matching original in a separate tab, keeping the new version open. Internal game/home links stay within `edu-games2/`.
- Support **all five templates**: Adventure, Space, Classroom, Stickers, and Arcade. Keep their selector, distinct palettes, dark/light readability, and the shared `edu-games-site-design` preference across both versions.
- Preserve the selected template's decorative background pictures in the refreshed version. Keep them non-interactive and outside document flow so they never change panel sizes or positions.
- Give each template its own subtle background texture: Adventure scenery, Classroom paper/wood, Stickers notebook lines, Space stars, and Arcade grid. Keep text panels readable and their geometry unchanged.
- Load root `assets/theme-selector.js` as a read-only shared asset. Main-site pages use root `assets/refresh.css`; the retained preview uses its own `edu-games2/assets/refresh.css`. Keep page-specific refinements embedded in each HTML file. Do not copy or fork the theme engine.
- Keep the comparison version dependency-free and playable locally and on GitHub Pages. Use explicit `index.html` navigation links for local-file use; copy required local images and other game assets into matching relative locations.
- Link the comparison version from `sandbox/sandbox.html`; retain the earlier previews and obtain approval before any replacement of original pages or push.
- Validate matching page paths, asset links, curriculum/script parity, and active game states at mobile and desktop sizes in all five templates. Any gameplay correction must be small, necessary for playable questions, documented, and confined to the new version unless a cross-version change is approved.

## Existing patterns

- Study similar existing games before implementing new content and reuse their established patterns.
- Match the existing colorful card-based visual design, rounded controls, shadows, gradients, and responsive layouts.
- Preserve mobile-first behavior, large touch targets, readable typography, and short interaction flows.
- Support the repository's right-to-left Hebrew and left-to-right English content correctly.
- Keep Hebrew and English in separate sentences and DOM elements. Never combine both scripts in one user-visible text field.
- Write short lesson explanations and rules in Hebrew; keep fixed English examples in their own left-to-right section with optional pronunciation.
- Match the existing use of Hebrew niqqud when adding Hebrew text for young children.
- Reuse existing speech-synthesis patterns for English and Hebrew pronunciation.
- Include clear positive feedback, gentle retry messaging, scores, progress, or celebration effects where appropriate.
- Across every game and preview in the repository, whenever an incorrect selection reveals the correct answer, automatically open the corresponding `איך פותרים?` explanation and update the help-button label to its open state. Apply this consistently to existing and future content.
- In all 11 Math Grade 4 games, keep the `🔍 אֵיךְ פּוֹתְרִים?` button visible as soon as each question appears and after the learner answers. It must toggle the existing step-by-step explanation without requiring a mistake first.
- For every English Grade 4 question—including general vocabulary, mixed-world practice, multiple choice, reading, and sentence ordering—keep an always-visible `🔍 איך פותרים?` button before and after answering.
- The English Grade 4 help panel must teach how to derive the answer, not merely reveal it. Present four clear Hebrew steps: what to look for, which lesson rule applies, how the rule applies to this exact question, and how to verify or eliminate choices. Then show the English rule and correct English answer in separate left-to-right blocks.
- Adapt the help strategy to the question type: vocabulary uses meaning, translation, spelling, or sequence clues; grammar checks subject, time, and word role; reading returns to textual evidence; ordering checks sentence or paragraph structure.
- Every new or expanded English Grade 4 topic, generator, authored question, mixed-practice source, and question format must use this same four-step help structure and provide question-specific English and Hebrew explanations. Do not add content that only reveals the answer or relies on generic feedback.
- Keep the English help-button label synchronized between `🔍 איך פותרים?` and `🙈 הסתר הסבר`.
- Keep two synchronized English Grade 4 `לשאלה הבאה` or final-summary buttons: one beside `איך פותרים?` and one below the complete help panel. Hide both until the learner gives the correct answer, then reveal both so the learner can continue from either scroll position.
- In English Grade 4, present the short lesson through a `📚 שיעור קצר` button and modal, alongside a separate button that starts practice directly.
- Avoid interactions that require precise mouse control, hover, a physical keyboard, or desktop-only behavior.
- Keep audio optional: the game must remain understandable and playable when speech synthesis is unavailable.

## Educational content

- Use age-appropriate vocabulary, instructions, examples, and difficulty.
- Keep questions and answers unambiguous and factually correct.
- Prefer varied exercises while preventing impossible, duplicate, or misleading answer choices.
- Keep guided lesson examples fixed and intentional so explanations remain clear and repeatable.
- Base English Grade 4 topic coverage and exercise patterns on the audited Matic Grade 4 English resources, but write original passages, questions, and examples rather than copying worksheets.
- Generate game exercises, values, and answer choices dynamically where appropriate; occasional repeats are acceptable, but immediate duplicate rounds should be avoided.
- Preserve the educational objective of an existing game when extending it.
- When adding randomized content, ensure generated values always satisfy the exercise's rules.
- Do not add advertising, external tracking, purchases, or data collection unless explicitly requested.
- Do not collect personal information from children.

## Code changes

- Make focused changes and avoid unrelated refactoring, especially in the large single-file games.
- Reuse existing helpers, naming, formatting, and interaction logic before adding new implementations.
- Keep JavaScript understandable and avoid unnecessary abstractions for these small standalone games.
- Handle missing browser APIs gracefully without hiding genuine programming errors.
- Do not remove or alter GoatCounter analytics unless requested.
- Update directly related navigation, labels, descriptions, and documentation when content changes.

## Validation

- Open or serve the affected HTML page and verify that it loads without console errors.
- Test the complete interaction flow for the changed game, including correct and incorrect answers.
- Verify responsive behavior at phone-sized and desktop-sized widths.
- Check Hebrew directionality, English directionality, touch controls, navigation links, and speech controls.
- Confirm that existing games and hub links continue to work.
- For randomized games, exercise every generator category and verify that generated answers and distractors are valid.
- Validate all new content through `sandbox/sandbox.html` before adding it to the production hubs or navigation.
- Do not add build or test tooling solely to validate a small HTML-only change.
