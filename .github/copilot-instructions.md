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
- The approved all-grades illustrated Body and Wearables game lives at `english/body-and-wearables/index.html`, linked directly from `english/index.html`. Its local JavaScript and SVG files are an intentional self-contained-folder exception to the single-HTML convention. It must not load sandbox content at runtime. Retain sandbox snapshots separately; do not synchronize them automatically. The original five-character prototype and full 50-character expansion are not promoted.
- Body and Wearables has five dropdown choices: picture exploration, build-and-reveal, Beginner, Intermediate, Advanced. The first two offer Beacon (Superhero1) and Pulse (Superhero2) through `picture-game.js`; the existing levels retain their 40-character engine. Keep picture DOM IDs prefixed with `picture-` and retain independent progress for each picture character and mode until reset or reload.
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
- English questions may combine vocabulary into varied sentences, but use semantically compatible subject/action/object combinations, correct inflections, one unambiguous answer, and Hebrew guidance that matches the exact generated sentence.
- Match English generation to each game's learner level and skill: short picture-supported sentences for Grade 3, grammar agreement for Grade 4, and scene-grounded clues for Secret Agent. Keep reading passages and fixed lesson examples authored; do not randomize their words or facts.
- Prefer varied exercises while preventing impossible, duplicate, or misleading answer choices.
- Keep guided lesson examples fixed and intentional so explanations remain clear and repeatable.
- Base English Grade 4 topic coverage and exercise patterns on the audited Matic Grade 4 English resources, but write original passages, questions, and examples rather than copying worksheets.
- Generate game exercises, values, and answer choices dynamically where appropriate; occasional repeats are acceptable, but immediate duplicate rounds should be avoided.
- Preserve the educational objective of an existing game when extending it.
- When adding randomized content, ensure generated values always satisfy the exercise's rules.
- Do not add advertising, external tracking, purchases, or data collection unless explicitly requested.
- Do not collect personal information from children.

## Curriculum preview: scope and source data

- The content expansion is under `sandbox/curriculum-refresh/`. Publishing this sandbox does **not** promote its content to canonical games or synchronize `edu-games2/`. Require explicit promotion approval before replacing production files.
- The paths and counts below describe this preview, not the older canonical question banks. Keep this inventory and the README current when adding content.
- Keep complete vocabulary, questions, translations, scenes and images in the game HTML/assets listed below. This instructions file documents their format and invariants; do not duplicate entire question banks here or use documentation as a runtime database.
- `sandbox/curriculum-refresh/index.html` is the preview landing page and educational-source directory. `english/index.html` mirrors the canonical English hierarchy; `math/grade-4/index.html` links all 11 Math games.

| Preview path under `sandbox/curriculum-refresh/` | Content and preservation requirements |
| --- | --- |
| `english/grade-3/index.html` | Eight tabs: picture-to-word, word-to-picture, first sound, missing letter, sentences, memory, reading, build-a-sentence. Preserve 13 authored reading pages, including translations and images. |
| `english/grade-4/index.html` | 28 topics, six worlds, original lessons/examples, expanded authored banks and constrained sentence composition. |
| `english/english-12plus/index.html` | Age-category navigation hub, not another game engine. |
| `english/english-12plus/secret-agent/index.html` | One active world, six missions, six actions per mission; six local scene photographs under `img/`. Worlds 2-4 remain defined but hidden. |
| `math/grade-4/*/index.html` | All 11 numerical/geometry/data/probability games; fixed `LESSON_STEPS` and existing learning flow stay intact. |
| `english-sentence-review.html` | Static review of 360 Grade 4 composed questions, answers, options and four-step help. |
| `english-all-levels-review.html` | Static searchable review of 740 practice entries: 236 Grade 3 mode-specific entries, 360 Grade 4 sentences and 144 Secret Agent clues. Entries are not all distinct sentences. |

- Preview asset paths must resolve to root `assets/`: the English subject hub uses `../../../assets/`, its grade/category pages use `../../../../assets/`, and Secret Agent uses `../../../../../assets/`. Preserve explicit `index.html` navigation for local-file use.
- Retain all five approved templates and original panel geometry. Curriculum expansion does not authorize another redesign.

## Israeli learner context and educational sources

- Target Israeli children learning English as an additional language. A grade or age label is not a native-English reading level or a guarantee of proficiency.
- Use familiar school, home, library, park, bus and family contexts; inclusive fictional characters; Hebrew guidance; and existing niqqud conventions for younger learners.
- Use shekels and metric units in numerical contexts. Exercise prices, quantities and fictional journeys are practice data, not current tariffs, verified distances or factual claims about a real institution.
- Write original exercises. Do not copy worksheets, passages, images or audio from external teaching resources. Existing game assets and authored passages stay in their established locations.
- Ministry of Education elementary guidance is the primary reference for elementary level/context; Cambridge English and British Council are supplementary resources, not proof of Israeli grade alignment.
- Do not claim Ministry approval, complete curriculum coverage, or completion of A1/Band I in Grade 4. Preserve existing enrichment topics without presenting all of them as compulsory grade-level content.
- Multiple choice and guided ordering do not replace listening, speaking, interaction and other classroom learning.
- Official math guidance describes a phased curriculum transition: Grade 3 joins in 2026-27. Recheck the official rollout before making year-specific Grade 4 alignment claims.

Reference links already used by the preview:

- English elementary curriculum: https://pop.education.gov.il/tchumey_daat/english/yesodi/curriculum/
- English curriculum components: https://pop.education.gov.il/tchumey_daat/english/yesodi/curriculum/components/
- Beginner communication descriptors: https://pop.education.gov.il/tchumey_daat/english/yesodi/curriculum/basic-user-a2/ (the page presents Pre-basic/Pre-A1 material despite its URL slug; do not infer level from the URL).
- Math curriculum and rollout: https://pop.education.gov.il/tchumey_daat/matmatika/yesodi/oraat-math/tohnit-limudim/
- Cambridge Pre-A1: https://www.cambridgeenglish.org/learning-english/parents-and-children/activities-for-children/pre-a1-level/
- Cambridge A1: https://www.cambridgeenglish.org/learning-english/parents-and-children/activities-for-children/a1-level/
- British Council possession grammar: https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/have-got
- British Council present tenses: https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/present-simple-present-continuous

The British Council links were identified through search; direct fetching was blocked. Do not describe their worksheets as downloaded or audited. Do not mix `have/has`, `do/does have`, and `have got` syntax when adapting examples.

## English data formats and generation rules

### Shared invariants

- Compose new practice from compatible vocabulary and explicitly reviewed phrase families, not arbitrary word substitution. Reading passages and fixed lesson examples remain carefully authored; never randomize their words or facts.
- Verify subject agreement, tense, articles, inflections, meaning and the supported answer together. Store irregular or spelling-changing forms explicitly when needed.
- Keep the question, accepted answer, Hebrew guidance and spoken English synchronized. Replaying speech, opening help or rerendering must not silently generate a different question.
- Pure phonics and memory games retain their original objectives; do not turn every tab into a sentence/grammar task.
- Prevent repeats using meaningful question identity, not answer order, punctuation, cosmetic instructions or theme. Use bounded finite decks/history; never promise unlimited novelty from a finite vocabulary.
- No external service generates content during play. Reload may reset in-memory histories; repeats across sessions are possible.

### Grade 3: picture-supported sentences

- Existing vocabulary maps include `WORDS1`, `WORDS2`, `PICS`, `CVC`, `MEM_POOL` and Hebrew `HE`/`HE_EXTRA`. Do not casually merge pools: each supports a different skill.
- `SENTENCES` maps full English sentences to picture strings; `SENT_HE` maps those same keys to complete Hebrew translations.
- `PRACTICE_PEOPLE`, `PRACTICE_FAMILIES`, `PRACTICE_ANIMALS` and `PRACTICE_PLACES` produce `GENERATED_SCENES`. Human actions use compatible possession, food, drink, reading and sport families; animal/place combinations stay simple.
- A build scene has `{emoji, pre, mid, post, subj:{word,distractors}, obj:{word,distractors}, he}`; generated scenes also have `topic` and `generated`. `sceneSentence` joins these fields into the spoken/rendered sentence. Put articles in the appropriate fixed phrase.
- The preview has 120 generated combinations. After overlaps with existing content, 118 new matching questions and 118 new build questions are added: 126 total sentence questions and 145 total build scenes.
- Preserve eight original sentence questions and 27 original build scenes. Nine missing-article corrections affect rendered/spoken practice only, not authored reading pages.
- `sentenceOptions` deduplicates visual choices and filters ambiguous named-child pictures. Different text keys or synonyms must not produce indistinguishable correct-looking choices.
- Use `nextPractice` for a finite shuffled cycle without a repeat at the cycle boundary. `installHelp` keeps the Hebrew explanation and completed English sentence available and synchronized.

### Grade 4: authored banks and composed questions

- Vocabulary items use `{en, he, emoji, group?}`. Preserve existing bank-specific fields such as numerical `value`.
- Authored multiple-choice items use `{prompt, answer, wrong, explanation, explanationHe, instruction?}`. `extendBank(name, rows)` takes `[prompt, answer, wrong, explanation, explanationHe, instruction?]`.
- `HEBREW_EXPLANATION_SETS` pairs each bank's `items` with Hebrew `values`; their lengths must match exactly. `AUTHORED_QUESTION_BANKS` derives from these sets.
- `makeMc` returns `{type:"mc", instruction, prompt, answer, choices, explanation, explanationHe, speak, signature, passage}`. Require four unique choices with the correct answer included.
- `makeOrder` uses ordered answer tokens/phrases and shuffled choices. Ensure the intended order is unambiguous from the prompt and punctuation, and avoid indistinguishable duplicate tiles.
- Reading passages use `{id, text, questions}`. New reading questions include `{prompt, answer, wrong, explanation, explanationHe, evidence, kind}`; evidence must occur in the passage. Cover detail, main idea, sequence, vocabulary and inference without unsupported outside knowledge.
- Writing tasks use `{kind, prompt, order, explanation, explanationHe}`; keep sentence/paragraph content authored and use explicit sequence cues or ordering instructions.
- Expanded inventory: 72 general vocabulary words; 30 Have/Has questions; other grammar banks generally 20 each; 20 plural entries; 12 family-relationship questions; 12 reading passages with five questions each; 30 writing tasks; 12 present-continuous ordering tasks and 12 past ordering tasks.
- `SENTENCE_SUBJECTS` entries have `{en, he, third, be, agreement}`. Ten human subjects encode third-person agreement and the correct auxiliary.
- `SENTENCE_POSSESSIONS` uses `{en, he}` for 12 compatible noun phrases. `SENTENCE_ACTIONS` uses `{base, third, ing, object, he}` for 12 verb/object phrases; keep the verb and its compatible object together.
- `composedSentenceQuestion` and `composedSentencePool` support exactly the `COMPOSED_TOPICS`: `have-has`, `present-simple`, `present-continuous`. Each currently has 120 combinations, 360 total. Adding a topic requires its own grammar, distractors, guidance and tests.
- `topicQuestionPool` retains authored content plus composed practice. `questionContentKey` and `distinctQuestions` ignore answer shuffling; vocabulary direction changes do not count as a new word.
- `topicPracticeDeck` mixes five authored and five composed questions in a direct ten-question session for these three topics. `createPracticeDeck` uses the same topic decks in mixed-world practice.
- Preserve honest finite capacity: seasons has eight distinct practice identities, not a fabricated ten unique questions.
- Reuse `buildQuestionHelpGuide`, the strict Hebrew/English validators and both synchronized next buttons. Generated English speech uses the completed sentence, never a blank placeholder.

### English 12+: Secret Agent

- `WORLD1` mission data contains scene objects `{key,en,...geometry}` and authored actions `{sentence,he,target}`. Preserve pictures, hitboxes, mission/action order and the active `WORLDS=[WORLD1]`; do not enable hidden worlds as part of content expansion.
- `PRACTICE_CLUES[missionIndex][actionIndex]` contains four tuples `[englishClue, hebrewClue, acceptedTargetKeys]` per action slot, 144 combinations total.
- `practiceOptions` constructs full bilingual instructions; `selectPractice` uses bounded history of three recent clues per slot. `state.practiceAction` keeps the selected clue stable through narration, translation, hints and rerendering.
- Ground every descriptor, spatial relation, colour and function in the actual scene. Two blue cups require a specific location or an accepted set containing both; a broad clue may have multiple valid targets, all of which must be accepted.
- Do not introduce fictional object locations or arbitrary adjective/object combinations. Ambiguous authored clues remain stored but need not be selected for practice when a reviewed replacement is available.

## Math numerical freshness and validity

- All 11 Grade 4 preview games retain authored lessons while generating practice values within valid ranges. Classification/shape/event questions may use finite pools.
- `CONTENT_BUILDERS` identifies generator families. `freshQuestion` tracks up to 32 meaningful exercises per builder using `exerciseSignature`; include operands, fractions, actual angles and chart data, not shuffled options or chart/table styling.
- Declare small domains through `finitePool`/`builder.capacity`, with history at most capacity minus one. Larger generators use bounded sampling and a verified 33-exercise reserve for stalled randomness. Reject a falsely large domain explicitly rather than silently repeat or loop forever.
- Keep correct numerical answers in the option set before selecting distractors. Require four distinct numeric choices where that game expects four; fixed semantic choices such as comparison symbols keep their intended format.
- Check mathematical equivalence, not just string equality, for fraction distractors. Identify digit position clearly when digits repeat. Construct exact division where required.
- New Operations patterns include division, giving eight patterns total. Broader operand ranges must remain appropriate for the existing learning objective.
- Keep each worked equation in an existing LTR `.step`/`.calc` element inside RTL Hebrew explanations; otherwise division and subtraction operands can display in reverse.

## Review pages, validation and publication

- Review HTML is a static export of actual runtime content, not a separate handwritten question database. Refresh affected exports when generators change; keep the older Grade 4 review available.
- Use review export records `{sentence, he, topic}` with optional `choices`, `targets` and `help`; an export envelope may use `{summary, records}`. Escape text before generating HTML and keep Hebrew/English elements separate.
- Preserve correct counts: the all-level review has 236 Grade 3 mode-specific records representing 120 unique sentences, plus 360 Grade 4 sentences and 144 Secret Agent clues.
- Review pages must work with `file://` and HTTP, support level/topic and text filtering, show empty/reset states, and link to the corresponding preview games. They do not fetch runtime data or automatically synchronize.
- Game selftests use `?selftest=1` and `window.__eduSelfTest`. Test hooks must not appear in ordinary play. Test every finite combination, correct-answer inclusion, distinct options, meaningful nonrepetition, stalled randomness and preservation of authored reading/lesson data.
- Exercise wrong/correct answers, help toggles, both Grade 4 next controls, pronunciation text, retries, replay, hints and mission transitions. Structural assertions do not replace reading generated language or checking scene descriptions against images.
- Check all five themes at 390px and 1280px, local-file loading, resource links and horizontal overflow. Test expanded help as well as initial pages.
- Keep canonical `english/`, `math/`, shared assets and `edu-games2/` unchanged during sandbox-only work. Committing/pushing a preview is separate from promoting it.
- Use explicit staging paths. Never read, modify, delete, stage, commit or push `lastSession.md`; it is an intentionally excluded conversation export.

## Creating complete cartoon character asset packages

- For new character-generation requests and prompts, require the COMPLETE game asset package, not an assembled-only picture or a "Stage 1" substitute. The reusable character-specific prompts are in `english/body-and-wearables/character-prompts.html`; preserve their written designs, exact inventories, stable concept IDs and excluded vocabulary.
- Always create original, child-friendly 2D CARTOON artwork, never photographs, photorealistic people or 3D renders. Preserve each character's approved palette, including black-and-white Manga designs.
- Use SVG-first construction: draw actual editable paths and shapes for the separate parts before rendering the finished character. If an image generator cannot produce precise aligned image layers, create the SVG files using code/file tools instead. Do not stop at a reference picture or promise that separately generated images will align.
- Each new package requires exactly 38 concepts: 26 allowed body parts and 12 distinct clothing/accessory concepts from its brief. Supply self-contained SVG sources and corresponding transparent PNG exports on the same 1024 x 1536 canvas; SVG viewBox is `0 0 1024 1536`. Preserve origin, pose, scale and coordinates without cropping or recentering.
- Each part contains only its own artwork. Draw missing anatomy as a modest neutral mannequin foundation and complete fabric beneath overlapping garments. No flattened character hidden behind masks, rectangular image crops, duplicate whole limbs, placeholder shapes or baked-in neighboring accessories. Slight seam overlap is permitted only when it does not reveal another unearned concept.
- Group rear/front fragments under one concept, with separate globally sorted paint orders. Namespace SVG definitions so combined fragments cannot collide. Render the finished reference from the actual delivered parts, never from an unrelated image generation.
- Deliver all SVG/PNG parts, the assembled SVG and PNG, a transparent from-layers composite, `manifest.json` with concept IDs/file paths/orders/highlight ellipses, `character.js` with embedded SVG asset data, an offline `preview.html`, reproducible production scripts/source, `README.txt`, actual `validation-report.json` results and a downloadable ZIP containing every referenced file. The preview starts empty and provides 38 concept toggles, Show all, Clear all and location highlights without a server or network.
- Validate exact concept coverage, real nonempty files, transparency, canvas alignment, SVG parsing, highlight bounds, fragment order and connected anatomy. Inspect isolated parts, body-only and complete assemblies. Check that selecting one word reveals only that concept, selection order never changes the final image, and clearing removes all artwork. Independently composite the exported PNGs and compare them with the delivered reference; check the extracted ZIP and offline preview.
- Use available code execution, SVG rendering and file-packaging tools to produce the files, not merely instructions for someone else. If a required capability is genuinely unavailable, report BLOCKED / INCOMPLETE and list missing deliverables. Never fabricate links or validation results, and never call an assembled-only image or partial package gameplay-ready.
- These requirements govern new asset production; they do not silently migrate the legacy character registries or authorize replacing published artwork. Inspect and integrate returned assets explicitly, preserving earned-only rendering and existing game behavior.

## Body and Wearables picture games

- Keep the shared game dropdown in this exact order: `explore` / `לומדים מהתמונה`, `finish` / `בונים וחושפים תמונה`, `beginner` / `מתחילים`, `intermediate` / `ממשיכים`, `advanced` / `מתקדמים`. Picture exploration is the initial selection. Do not restore a separate build-only game; it was removed as redundant.
- Picture exploration shows the supplied complete cartoon, English words, Hebrew meanings, pronunciation and location highlights. Track visited words separately from earned construction words; exploring a word must not grant construction credit.
- Build-and-reveal starts with an empty canvas and uses 38 concepts: 26 body parts and 12 wearables. Each correct spelling choice reveals only that concept's independent SVG artwork, then selects the next unanswered hint. Keep four similar spelling choices, persistent red/disabled wrong options and pronunciation for found words. Only after all 38 words are found does the original picture replace the assembled vector drawing.
- Keep both modes in the standard Body and Wearables layout: shared help, character-style dropdown, game dropdown and restart controls; character on the left on desktop and first on mobile; learned words beneath the answer panel; full-width clues beneath both columns. Keep the additional-hint button on its own row with clear spacing below the answer choices.
- Both picture games offer Beacon (Superhero1) and Pulse (Superhero2). Keep the character-style dropdown visible, offering only Superhero, plus a character dropdown shown only in these modes. Use each character's own 26 body concepts, 12 wearables, vector artwork and reference-image coordinates; never reuse Beacon's geometry or item inventory for Pulse. Returning to the original levels restores all four styles and the previous collection-style selection. Do not expand the picture modes to unapproved assets automatically.
- Preserve separate in-memory progress for each character in each picture game across dropdown switches, including visits, found words and rejected choices. Restart affects only the selected character in the active picture game; reload clears progress. Selecting one of the original three levels starts its normal fresh round with the previous collection character and level-appropriate wardrobe.
- Keep picture-game DOM IDs prefixed with `picture-`. Route shared help/restart controls to the active game, stop obsolete speech and reject stale answer controls after switches. Use separate highlight coordinates for the original picture and the independently drawn character; explain that covered body-part highlights indicate anatomy beneath clothing.
- Use production-local `picture-game.js`, `beacon-art.js`, `pulse-art.js` and the matching `picture-art/beacon.png` / `picture-art/pulse.png`, with the existing vocabulary helpers. Never load sandbox files at runtime. Keep the standalone sandbox demo independent. If a reference image fails, show an explicit notice and use that character's vector artwork and coordinates without affecting the other character.
- Preserve the existing Beginner, Intermediate and Advanced mechanics and 40-character collection. Asset production, game integration and publishing are separate actions; never treat incoming packages or their claimed PASS reports as approval to replace artwork.

## Body and Wearables game and retained previews

- Beginner's three distractors must look very similar to the correct spelling: keep the initial letter and all original letters, using only one adjacent transposition or one repeated letter. Do not remove letters or introduce arbitrary substitutions. Continue excluding all accepted vocabulary/aliases and keep exactly four distinct options.

- In Beginner spelling choices, mark a selected misspelling red with strikethrough and disable it. Remember rejected choices for each clue throughout the round, including switching away and back; reset on a new round or level. Reject repeat activation without changing state, and move keyboard focus to an enabled option.

- Place `המילים שמצאתם` in its own panel directly beneath the right-hand input/clue panel, not below the character canvas. On mobile, keep the canvas first, then input/clues and the learned-word panel.

- Keep the detailed letter-hint/pronunciation/Show word explanation in a labeled popup opened by `איך משתמשים ברמזים?` in the clue panel, not as an inline paragraph. Support close/Escape and restore focus to its trigger without changing progress.

- In production, place the additional-word hint button immediately below the word-entry form and its clue panel immediately below that button. The user explicitly requested input-help text, live answer feedback, bonus streak, bonus explanation and level description inside the `מידע על הסבב והבונוס` popup, opened below the clue panel. Keep these values updated while closed, with close/Escape and focus restoration. Do not automatically open it on answers; retain the separate earned-bonus popup near the input.

- Display clue pronunciation as a speaker-icon button beside the revealed/masked English word on the same row, not among the letter-hint controls. Use `השמעה` as its accessible name and tooltip; retain the half-visible-letters threshold and a minimum 44px touch target.

- The user approved publishing all 40 illustrated characters in the main English game on September 17, 2026, including saving, committing and pushing their pictures. The expansion adds eight original characters to each of Anime, Superhero, Cartoon and Manga (IDs 03-10), giving ten per category. Keep original IDs 01-02 and their approved artwork unchanged. Retain all 40 standalone SVGs and complete runtime registries independently under production and sandbox; keep source/export generators in the sandbox. This approval does not add Animals or authorize the old 50-character plan.
- Each expanded character must provide all 27 independent body concepts, its actual base-outfit layers, body/outfit location metadata, a standalone original SVG and ten fitted accessory choices from existing vocabulary (five compatible randomly chosen per round). Each `style-samples/collection-<category>.js` registers the category's new metadata, layers and accessories. Custom accessory variants may specify `conceptId` to map explicitly to an existing word. Keep correct image paths, namespaced SVG definitions, each character's authored palette and fixed paint order; no borrowed/franchise art or simple recolor-only duplicates.
- Follow the user's positive Anime, cool anime-inspired Superhero, detailed reference-inspired Manga and positive Cartoon style directions. Preserve friendly expressions, balanced head/hand proportions and aligned limbs; do not reintroduce oversized scary eyes or twisted faces/legs. Distinguish new characters by silhouette, hair, outfit cuts and details, not only palette. Keep ten varied accessory choices per character and avoid repeating the same five across everyone. Use headwear slots for cap/beret/beanie/hat variants.
- The revised illustrated Manga collection has exactly five color and five black-and-white characters in production and sandbox. Keep original manga-01/02 unchanged and monochrome; redesign manga-03..07 in color and manga-08..10 in monochrome. New metadata declares `colorMode` as `color` or `monochrome`; body, outfit and accessories must match it. The user's seven local reference images guide richer hair locks/highlights, expressive faces, natural proportions and detailed clothing folds, not tracing or copying their identities/artwork. This supersedes all-monochrome Manga rules for the expanded illustrated collection only; the original five-character builder remains unchanged.
- Keep backpacks on only four of the eight new Cartoon characters (03, 07, 08, 09), fitted behind the shoulders rather than floating beside the body. The other four use different accessories. Optional accessory `rearSvg` paints behind the base artwork; `svg` paints straps/details in front. Both fragments share selection, visibility and preview in the gallery and illustrated games, with gallery-only persistence and earned-word state in games. Never reveal unearned body or outfit pieces to conceal a bag.

- The eight-character illustrated builder was approved for production and commit/push on September 16, 2026; the approved 40-character expansion followed on September 17. Maintain its approved behavior in `english/body-and-wearables/`; the illustrated-demo rules below also describe this production game unless explicitly preview-only.

- Production Beginner has exactly 38 words per character: all 26 allowed body concepts and exactly 12 distinct clothing/accessory concepts, including its allowed base outfit. Use `BeginnerRound.selectAccessories(character, originalAccessories)` in `beginner-round.js` to choose a compatible expanded wardrobe, reusing original fitted pieces and supplementing with independent, fitted allowed-vocabulary artwork as needed. Do not mutate original ten-accessory registries or add duplicate concepts to reach the count. Respect headwear/neckwear/handwear conflicts and each character's color/monochrome palette. Beginner uses canonical labels (including pants) and four spelling choices; it no longer shares Intermediate's restricted vocabulary.
- Production Intermediate retains its typed restricted vocabulary: arms, cheeks, chest, chin, ears, elbows, eyes, feet, fingers, hair, hands, head, legs, lips, mouth, neck, nose and shoulders, plus only available round items matching bag, belt, boots, coat, dress, glasses, gloves, hat, jeans, ring, shirt, shoes, skirt, watch or pants through existing canonical spellings/explicit aliases. Prefer an allowed canonical spelling; otherwise display the matching familiar alias with an accurate Hebrew meaning, retaining semantic IDs and all accepted aliases for included concepts. Never invent garment aliases. Advanced uses all 26 allowed body concepts, allowed outfit pieces and five compatible allowed accessories with advanced clues. Intermediate and Advanced retain their shared five-accessory selection and variable counts.
- All production levels exclude anklets, beanie, blouse, beret, boot bow, boot chain, boot wings, bow tie, brooch, knee pads, leg warmers, leggings, mittens, palms, shoe charm, shoulder cord and waist chain, including their corresponding parts/accessories rather than relabeling them. Centralize concept-ID exclusions in `IllustratedContent.playableTargets` and `availableAccessories`, including accessory variants mapped through `conceptId` or contextual IDs. Apply these exclusions to both wardrobe selectors before basic alias mapping; typed modes use all five when only five compatible allowed accessories remain. Excluded concepts must not enter clues, answers, hints, bonuses, artwork, departing previews or the word list. Display and speak pants at every level and in the word list, retaining the existing trousers alias and artwork ID. Keep these production vocabulary overrides in `illustrated-content.js`, not the generated dictionary snapshot or retained sandbox.
- In production, finding every active word in any level permanently reveals all allowed current-round layers until reset, including body/outfit pieces outside the basic vocabulary. This completion reveal and the departing preview are the two exceptions to earned-only rendering; never restore globally excluded concepts or add learned words/credit for revealed extras. Before the last answer, visible concepts must exactly match learned concepts. Render active targets using their existing objects so location highlights remain valid on the final answer and after completion. Verify all 40 characters at all three levels, final-answer highlighting, empty resets and persistent completed artwork.
- At every Beginner round start (initial load, category/new-character reset and switching back to Beginner), select an available Hebrew hint and render its four spelling choices automatically. Reuse the existing available-hint selector after rendering the clue list. Keep artwork and learned words empty and do not change typed modes' initially unselected hint.
- Beginner uses a selected unsolved Hebrew clue (card or random assist), one canonical English option and three distinct single-edit misspellings of that same word. Generate bounded candidates excluding accepted vocabulary, active-concept and contextual round aliases; never use other concepts as distractors. Shuffle fairly and cache per clue for the round, preserving options on re-selection. Use native keyboard buttons, minimum 44px targets, English LTR labels and a labeled group. Hide and disable textbox/Check, typing hints, Show word and unsolved-clue audio, with handler guards against programmatic use. Found-word cards retain pronunciation in every level. Wrong choices reset the streak, give gentle visible local feedback and preserve choices; correct choices use shared learning bookkeeping, earn only the active concept, automatically select another unsolved clue and focus its hint panel (no next clue and focus New Character at completion). Preserve the success message and answered word's Hebrew meaning after advancing. Guard detached/rapid/stale buttons. Three new correct choices in a row append visible praise and reset the streak: no prefill, bonus ID or extra credit. Keep general feedback/streak/help inside the round-information dialog; Beginner choice feedback/praise is the intentional local exception.
- Keep `IllustratedContent.buildTargets(character, accessories)` unfiltered for full source-metadata validation. Apply `playableTargets` to the departing preview and word list (69 playable concepts: 26 body and 43 items); `targetsForLevel` applies the same global exclusion before deriving the active level pool. Clues, choices, letter spellings, Show word, spelling assistance, bonus candidates, credit and completion use that active pool. Excluded concepts never earn credit or artwork, including at completion and during previews. The departing preview may show allowed advanced-only pieces without credit. Read the selected level at startup. Every level change restarts the same character, including input, hints, choices and bonus timers. Cache Beginner's expanded wardrobe and the typed modes' shared five-accessory set independently per character; restore the appropriate set on level changes and clear both on a new character/category. Unsupported levels and invalid 26+12 counts fail visibly. Retained sandbox snapshots and the original five-character builder keep their prior all-level behavior; do not automatically synchronize them.

- Illustrated-game clues are displayed directly in Hebrew; no English clue or translation button is needed. The all-clues panel lists exactly the current round targets using the selected level's authored Hebrew sentences. Unsolved clues must not show their answers. Found clues have line-through sentences, a checkmark, textual completion status, and the canonical English word plus its Hebrew meaning in separate language/direction elements. Keep counts, level changes and new-round resets synchronized with learned IDs.
- Only unsolved clue cards are selectable, using native keyboard-accessible buttons; solved cards remain visible but disabled. Clicking an enabled clue opens that exact clue in the hint panel below "רמז למילה נוספת", scrolls it into view and moves keyboard focus to the panel. Mark the selected card visually and with `aria-pressed`. Selecting a clue must not fill the input, grant credit or reveal artwork. Preserve progress when reselecting the same clue, reset for a different clue, and retain rejected attempts associated with the selected word. Disable clue selection during the departing-character preview and load errors.
- In production Intermediate/Advanced and retained typed previews, award a prefilled-word bonus after every three newly learned non-bonus concepts in a row. Duplicate words/aliases and accepting a bonus word do not advance the next streak. Keep bonus-word IDs for the whole round so accepting an earlier bonus later still does not advance it. Nonempty rejected answers, including known unavailable words, reset the streak; empty input and hints do not. Reset the streak after awarding a bonus and clear all bonus state on a new round. Production Beginner instead awards praise only, as described above.
- A bonus randomly prefills the canonical spelling of an unlearned current-round word, preferring words not previously offered as bonuses. Never automatically submit it, mark its clue solved, award credit or draw its piece: the learner must press Check (or Enter). If no words remain, show normal completion rather than an invalid bonus.
- Show cheerful Hebrew bonus feedback in a popup anchored to the input, not a separate panel or modal. It auto-closes after **4 seconds**, or immediately with its labeled X button. Dismissal leaves the bonus word in the input and restores input focus if the close button held focus. Cancel stale popup timers on edits, submissions and round changes. Preserve the visible streak counter and explain that bonus words do not earn the next bonus.
- New Character reveals the **completed current character**, not a picture gallery, for **3 seconds**, then randomly selects a different character in the chosen category and starts on an empty canvas. Include the active mode's allowed outfit and selected accessories using the independent layer renderer. This departing-round preview is an intentional exception to earned-only visibility, alongside the production completion reveal; never change learned IDs, clue completion or credit during it. Keep its explanatory caption outside the artwork so it cannot hide the character. Scroll the character into view, lock gameplay/clue/category controls during the preview, prevent duplicate transitions and restore controls afterward. A category reset cancels pending transition timers and starts a fresh round.
- Place the instructions button directly after the game description. In the production Body and Wearables game, put it, the character-style dropdown, game-level dropdown and New Character button on one desktop toolbar row, wrapping accessibly on smaller screens. Keep the English hub's Body and Wearables card after the grade/age-group cards. Open the explanation in a labeled modal dialog with a close button and Escape support; closing restores focus to the trigger without changing game state.
- The illustrated demo always uses the full 600x800 canvas view; do not show close-up/zoom controls. Learned-word location highlights remain available.

- In the illustrated demo, Assist prioritizes a likely misspelling in the input over a random new clue. Match current-round unlearned aliases conservatively (one edit for short input, up to two for six or more characters, including adjacent transpositions); use the active clue only to break nearest-match ties. Ambiguous/unknown input gets explicit fallback feedback, never a confident correction. Keep the input unchanged, preserve same-clue letter progress and prior rejected attempts, and never grant credit or artwork through spelling assistance. Clearing the input restores random-clue selection.

- `sandbox/body-and-wearables/illustrated-demo.html` and the original three production levels in `english/body-and-wearables/index.html` start EMPTY, following the user's correction of the earlier visible-character mode. The two new picture games follow their separate rules above; picture exploration intentionally starts with the full reference. Select Anime/Superhero/Cartoon/Manga in the original levels to randomly choose from that category's ten illustrated characters; typed rounds have five compatible random accessories, while production Beginner uses its expanded 12-item wardrobe. Reveal only the independent geometry for correctly answered concepts (spelling choices in production Beginner, typing otherwise), in any order, except the documented completion reveal and departing-round preview. Never load a complete illustration behind a mask or clipping region. Do not repeat the immediately preceding character within its category when another is available. Keep round progress transient and never overwrite gallery accessory preferences. These games do not replace the original builder, expand to its full 46-wearable wardrobe or authorize 50 characters.
- Full illustrated targets consist of all 27 body concepts, the character's authored base outfit and the selected accessory options only; production Beginner/Intermediate use the filtered active pool described above. `illustrated-layers-anime-manga.js` and `illustrated-layers-hero-cartoon.js` register `{defs, layers:[{id,order,svg}]}` by character ID in `window.IllustratedLayers`. Provide exactly one independent layer for every body concept and base-outfit ID. Preserve detailed identity/outfits while drawing neutral missing anatomy; head excludes facial features/hair/ears, hands exclude fingers, and clothes exclude unearned skin/features. Keep paint order fixed, not dependent on entry order. Accessory fragments remain separate. During play, insert only learned `data-concept` groups; the explicitly requested departing-character preview may temporarily show all current-round groups. Body parts are below clothes. Blank/new rounds have no drawable character pieces or outlines. Hints, rejected guesses and Show word never add artwork. Match round-specific aliases before the full dictionary; known unavailable words get neutral feedback. Highlights only mark already learned words. Verify every piece in isolation, both input orders, exact visible IDs, alias deduplication and empty resets.
- `export-illustrated-vocabulary.cjs` generates `illustrated-vocabulary.js` from the original embedded `vocabulary-data`; do not hand-edit this snapshot. `illustrated-content.js` supplies authored extra wearable vocabulary, explicit accessory-to-concept mappings and contextual aliases. `style-samples/illustrated-anime-manga.js` and `illustrated-hero-cartoon.js` define eight metadata records with `{id, category, nameEn, nameHe, image, bodyRegions, outfit}`; body/outfit regions are arrays of `{cx,cy,rx,ry,angle?}` ellipses in global 600×800 coordinates. Validate every required body ID, every outfit vocabulary reference, all ten possible accessory targets per character and every compatible five-item combination. Source SVG art and original five-character review remain independent.
- `sandbox/body-and-wearables/index.html` is a separate typed-input, free-building English demo. Keyboard/touch-keyboard spelling is intentional here; do not convert existing choice-only games. `review.html` is a static export of this game's vocabulary and SVG artwork, not an independent content source.
- The embedded `vocabulary-data` JSON contains `{vocabulary, characters}`. Vocabulary records use `{id, category, canonical, acceptedForms, he, suggestedLevel, hints}`; `hints` maps beginner/intermediate/advanced to authored `{en, he}` pairs. Categories are `body`, `clothing`, `footwear`, `accessory`, and `costume`. Character records include `{id, category, nameEn, nameHe, descriptionHe, sampleIds}`.
- The DOM-independent `artwork-code` script exposes `BodyWearablesArt.renderCharacter(characterId, conceptIds)` as SVG markup, with one `data-concept` group per requested concept. It also defines anchors, draw order, slots and conflicts. The renderer itself preserves requested layers; game state resolves clothing conflicts before rendering. `window.BodyWearables` exposes frozen data, normalization/resolution, rendering and a serializable state snapshot for review and validation.
- Regenerate the review from the actual embedded JSON and artwork renderer: export every isolated character/concept combination and each character's `sampleIds`, not a separately maintained drawing or dictionary. Verify snapshot equality after any content/art changes. The catalogue supports filtering and isolated-layer zoom without loading the game or fetching network data.
- Phase one has five original characters: Superhero, Cartoon, Anime, upright cartoon Animal with human-like anatomy, and monochrome Manga. Keep the full 50-character expansion blocked until the user approves the samples. Do not promote or publish automatically.
- `sandbox/body-and-wearables/style-samples/index.html` is a separate art-direction gallery retaining the original two standalone SVGs per category and adding eight per category through `collection-gallery.js`. All 40 have independent geometry for the illustrated builder's body concepts and character-specific wardrobe, not the original builder's full 73-concept coverage. They do not replace the existing five builder characters or expand Animals. Preserve original identities and do not embed or redistribute the user's reference images. Integrating them into the original builder requires approval and full 73-concept layer adaptation; dimensional SVG shading is not rendered 3D.
- The style gallery and illustrated games load `accessories-anime-manga.js`, `accessories-hero-cartoon.js` and the four `collection-<category>.js` registries as local classic scripts into `window.CharacterAccessories`, keyed by SVG filename stem. Each character has ten distinct `{id, en, he, svg, slot?, rearSvg?, conceptId?}` accessories; fragments use global 600×800 coordinates, no external assets and each Manga character's authored color mode. `accessory-selection.js` randomly selects five unique compatible items on first visit and on Shuffle, with at most one item per slot. Defaults map hat/glasses/scarf to headwear/eyewear/neckwear; otherwise the ID is the slot unless explicitly overridden. Every pool needs at least five distinct slots. Shuffle must change the selected set even if the RNG repeats. `accessory-gallery.js` overlays the selected authored fragments on the unchanged base SVG with independent labeled checkboxes, shuffle/show/hide-all controls and a live count. New selections start visible and original clothing stays fixed. `accessory-storage.js` saves each character separately under `edu-games:style-accessories:<characterId>` as `{version:1, selectedIds, visibleIds}`. Restore exactly five existing, distinct, slot-compatible IDs and a unique visible subset; an empty visible subset means all hidden. Save first-visit defaults and every toggle/shuffle/show/hide action, not just on unload. Corrupt/outdated records regenerate only the affected character with an alert; storage failures warn and preserve session interaction. This persistence is gallery-only, not game progress. The enlarged dialog clones current layers and restores focus on close. Preserve offline `file://` support without fetching SVGs, and verify all 400 pool items, five-item selection shape, slot conflicts, repeat prevention, character independence, persistence/failure cases, toggles, enlarged selections, keyboard use and mobile layout.
- Preserve exactly these 27 body concepts: head, hair, forehead, eyes, ears, nose, cheeks, mouth, lips, chin, jaw, neck, shoulders, chest, waist, arms, elbows, wrists, hands, palms, fingers, legs, thighs, knees, ankles, feet, heels.
- The wearable inventory has 46 concepts (17 clothing, 5 footwear, 20 accessories/headwear, 4 costume extras), for 73 concepts total. All five characters must support every concept with its own independently drawable SVG layer. Do not substitute a count assertion for exact-ID coverage.
- The canvas starts empty; named parts appear at fixed anchors in any order, without prerequisites or automatically drawn neighbours. Keep detailed anatomy distinct from broad base shapes: jaw/chin, hands/palms, legs/thighs, feet/heels. Covered body layers stay beneath clothes.
- Explicit garment conflicts replace displayed layers only; compatible garments may coexist. Learned IDs are unique, aliases do not add credit, and re-entering a replaced garment re-equips it without increasing the count.
- In the original five-character builder and retained illustrated sandbox, all levels accept all supported words. Levels affect cumulative suggestion pools and authored English/Hebrew clues only. Assist chooses an unfound concept; valid alternatives are always accepted. Optional translation and letter support never submit an answer. Exhausting suggestions must not end free play. Production illustrated Beginner/Intermediate instead use the active vocabulary and interaction rules above.
- Letter hints share cumulative revealed positions for the active clue. Sequential hints reveal the leftmost unrevealed letter; random hints choose one unrevealed position without replacement. Show a masked canonical word, revealed/total letter counter and next sequential letter number. Spaces and hyphens stay visible and do not count as letters. Repeated letters are separate positions.
- In production Intermediate/Advanced, show the clue's English pronunciation button once at least half its letter positions are visible (`ceil(letterCount / 2)`, excluding spaces/hyphens). Sequential/random reveals and Show word share this threshold. Speak the current level's displayed spelling using the existing speech helper; do not change input, revealed letters, credit, streak or artwork. Hide/reset for a different clue or round, preserve for the same clue, and disable during the departing preview. Report unavailable/failed speech inside the clue panel without breaking play; do not add preparing/ended speech messages. Beginner hides/disables unsolved-clue audio and all typing hints, but every found-word card has pronunciation in every level. Reuse the speech helper and found-word status area; reject stale cards and disable during previews.
- Unlock the optional Show word button after **either** three nonempty rejected submissions **or** three successful letter-hint clicks for the current clue; do not combine the two counters. Empty input, Hebrew translation and valid alternative words do not count. Revealing the word also opens its matching Hebrew clue, but never enters it, adds artwork or grants learned-word credit. The learner must still type a supported form.
- Preserve typed-level letter progress across valid alternative entries. Every production illustrated level change resets it; the original builder and retained previews preserve it across all levels. Clear it when the active clue changes, its concept is found or a character is reset; selecting the same sole remaining clue preserves its progress. Both letter buttons disable when every letter is visible.
- Normalize surrounding/repeated whitespace and case only, then match explicit aliases (including foot/feet, T-shirt/tshirt/t shirt, trainers/sneakers, trousers/pants, sweater/jumper). Never strip a trailing `s` generically: glass and short are not wearable aliases. Unknown words get neutral feedback; genuine misspellings get no credit, automatic spelling reveal or autocorrection. Manual Show word and the explicitly earned bonus prefill are intentional exceptions to the original no-reveal design, never automatic answers.
- Reset learned words, drawing, hints and bonus state when starting a new character. No persistence, quota, time limit, score penalty or cross-character score. The illustrated game's 4-second notification and 3-second departing preview are UI timers, not timed challenges. Keep Hebrew and English in separate elements; optional speech failures must not break play.
- Validate exact bonus/preview timing boundaries, manual dismissal, input preservation, repeated rewards, no bonus credit before Check, reset/cancellation, and no input during departing previews. Test enabled-clue click/keyboard activation, focus transfer, disabled solved clues, bilingual completion labels and preserved hint progress across all five themes, desktop/mobile and local-file loading.
- Validate all aliases, isolated layers, arbitrary entry order, garment conflicts/re-equipping, hint exhaustion, reset and safe text rendering. Check all five site themes at mobile/desktop sizes and local-file operation. Themes must not recolor artwork; enforce each Manga character's authored color mode and the expanded collection's exact five-color/five-monochrome split.

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
