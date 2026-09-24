# 🎓 Edu Games

A collection of small, self-contained educational games for kids. Each game has an offline-capable HTML entry point in its own folder; the illustrated character game also keeps its JavaScript and SVG artwork in local files. No build step, no dependencies — hosted free on GitHub Pages. Exercises are generated dynamically, while interactive lesson examples remain fixed for clear teaching.

Every active page includes the approved refreshed design and a persistent five-template selector. Adventure scenery, Space stars, Classroom textures, Stickers notebook lines, and the Arcade grid accompany the template pictures. A choice made on one page follows the learner across the site without requiring an account.

## ▶️ Play
**https://yaroneven77.github.io/edu-games/**

The root page (`index.html`) is a hub that links to every game.

## Body and Wearables picture games

The production [Body and Wearables game](./english/body-and-wearables/index.html)
now offers five choices in one dropdown, in order: learn from the picture,
build and reveal the picture, Beginner, Intermediate, and Advanced. The first
two offer Beacon (Superhero1) and Pulse (Superhero2), each with its own 26 body
concepts, 12 matching wearables, independently drawn cartoon layers and accurate
reference-picture highlights. Progress is separate for each character and mode;
the three existing levels retain the 40-character collection and their original
mechanics. Selecting an existing level starts a fresh round with the previous
collection character. Picture artwork and logic live in the production folder,
with no runtime dependency on the separate sandbox demo.
The picture modes retain the standard toolbar, character panel, learned-word
panel and full-width clue panel. Their character-type dropdown offers only
Superhero, with a separate dropdown for the two supplied characters. Restart
clears only the selected character in the active picture mode; switching keeps
progress until reload. Returning to an existing level restores all four styles
and the previous selection. Both reference images and redraws live in the
production folder; a picture-load error affects only that character.

Beacon (`superhero-01`) shows the approved cartoon reference from
`english/body-and-wearables/completion-art/beacon.png` after completing a round
in the original three levels. The picture is a celebration illustration, not an
exact record of the randomized wardrobe. Gameplay and departing previews retain
independent SVG layers. A toggle returns to the game drawing; found-word location
buttons also restore that drawing for accurate highlights. Other characters in
the original levels are unchanged. If the picture cannot load, an explicit notice
accompanies the completed SVG.

## Approved design and retained preview

The approved design is now applied to the main site's local files. Open `index.html` to use it. This promotion changes presentation only: the existing curriculum, lessons, questions, scoring, help, and next-button behavior are preserved. English Grade 4 retains its original panel sizes and positions.

[`edu-games2/index.html`](./edu-games2/index.html) remains as the approved preview, also linked from the [sandbox hub](./sandbox/sandbox.html). Its comparison links now open the refreshed main site, not the old design. The old design remains available in Git history. Future edits do not automatically synchronize the two copies.

Main pages use `assets/theme-selector.js`, `assets/refresh.css`, and embedded game-specific styling, with no dependency on `edu-games2/`. Comparison-only bars are absent from the main site. No build or server is needed. Publishing still requires a separately authorized commit and push.

The preview retains its demo-only Order of Operations answer-choice correction. Main-site gameplay scripts, including existing choice-generation defects, are unchanged by this visual promotion.

## 🎮 Games
| Folder | Game | Description |
|--------|------|-------------|
| [`math/`](./math/) | מִשְׂחֲקֵי חֶשְׁבּוֹן | Math grade selector. |
| [`math/grade-3/`](./math/grade-3/) | חֶשְׁבּוֹן לְכִתָּה ג' | 9 Hebrew math mini-games for 3rd grade: division with remainder, multiplication and division, word problems, fractions, divisibility, grouping division, and the multiplication table. |
| [`math/grade-4/`](./math/grade-4/) | חֶשְׁבּוֹן לְכִתָּה ד' | 11 Grade 4 math games covering numbers, written arithmetic, order of operations, number properties, fractions, word problems, geometry, measurement, data, and probability. Each game includes an interactive Hebrew lesson with narration, examples, and practice. |
| [`english/`](./english/) | מִשְׂחֲקֵי אַנְגְּלִית | English games and grade selector. |
| [`english/body-and-wearables/`](./english/body-and-wearables/) | בונים דמות במילים | All-grades English spelling game: 40 illustrated characters, ten per style. Beginner has 38 words: 26 body parts and 12 clothing/accessory concepts. Typed levels retain their own word pools and five compatible accessories. Starts empty; correct words reveal independent pieces. |
| [`english/grade-3/`](./english/grade-3/) | English Grade 3 | Learn English words via pictures and phonics with sound and Hebrew translations. |
| [`english/grade-4/`](./english/grade-4/) | English Grade 4 | Six learning worlds containing all 28 vocabulary, grammar, reading, and guided-writing topics, with mixed practice, Hebrew lessons, English audio, and detailed bilingual answer explanations. |
| [`english/english-12plus/`](./english/english-12plus/) | English 12+ | English adventure games for ages 12 and up. |
| [`kindergarten/`](./kindergarten/) | גַּן · Kindergarten | Picture Pairs and Number War for young learners. |

## 📁 Project structure
```
edu-games/
├── index.html             # landing hub linking to subject sections
├── assets/
│   ├── theme-selector.js  # shared persistent visual-theme selector
│   └── refresh.css        # approved five-template presentation
├── math/
│   ├── index.html         # math grade selector
│   ├── grade-3/
│   │   ├── index.html     # Grade 3 math games
│   │   └── fractions-lesson/index.html
│   └── grade-4/
│       ├── index.html     # Grade 4 math hub
│       └── [11 game folders]/index.html
├── english/
│   ├── index.html         # English grade selector
│   ├── body-and-wearables/index.html # all-grades illustrated spelling game
│   ├── grade-3/
│   │   └── index.html     # Grade 3 English games
│   ├── grade-4/
│   │   └── index.html     # Grade 4 English academy with 6 worlds and 28 topics
│   └── english-12plus/
│       ├── index.html
│       └── secret-agent/index.html
└── kindergarten/
    ├── index.html         # kindergarten game selector
    ├── picture-pairs/index.html
    └── number-war/index.html
```

## ➕ Add a new game
1. Create a new folder under the appropriate subject and grade.
2. Put a self-contained `index.html` inside it.
3. Add a card to the appropriate grade hub.
4. Add or update the subject/grade selector only when introducing a new grade.
5. Keep game content only in the canonical subject and grade hierarchy.

## 🧪 Sandbox review workflow

The approved illustrated game now publishes **40 original characters**, ten each in Anime, Superhero, Cartoon and Manga, in the [main English game](./english/body-and-wearables/). Manga includes five color and five black-and-white characters: the newer eight use more detailed reference-inspired faces, hair and clothing, while the original two remain unchanged. All original eight characters across the four categories remain unchanged; IDs 03-10 provide independently revealable body/outfit layers and ten optional accessories. All 40 standalone SVGs and the complete runtime registries are retained in both the production folder and sandbox. The [expanded gallery](./sandbox/body-and-wearables/style-samples/index.html) and [builder preview](./sandbox/body-and-wearables/illustrated-demo.html) share four new `collection-<category>.js` registries; their source/export generators remain in the sandbox. Production has its own independent copies, with no sandbox runtime dependencies. References inform broad art style only; reference images and franchise characters are not copied.

The production illustrated game rewards three new correct answers in a row. **Beginner gives praise only**, beside the choices: no word prefill, automatic answer or extra artwork. **Intermediate and Advanced** prefill a random missing word and show Hebrew encouragement; the child must press Check to earn its artwork. Bonus words and duplicate aliases do not advance the next streak; hints/empty input preserve it, rejected answers reset it, and new rounds clear bonus state.

Production levels control both vocabulary and answer interaction. **Beginner has exactly 38 words for every character: all 26 allowed body concepts and 12 distinct clothing/accessory concepts, including the allowed base outfit.** `beginner-round.js` selects a compatible wardrobe, reusing fitted character accessories and adding fitted independent pieces where needed. Original pools and typed modes remain separate. Beginner uses canonical vocabulary (including pants), not Intermediate's restricted list.

Every Beginner round starts with an unsolved Hebrew hint and its four spelling choices already selected, including initial load, category/new-character changes and switching back to Beginner. This never reveals artwork or awards a word; typed modes still start without a selected hint.

Beginner selects a Hebrew clue and clicks the correct spelling among four English buttons: one canonical answer and three distinct single-edit misspellings of that word, excluding all accepted game spellings and contextual round aliases. Options are shuffled once per clue per round and remain stable on re-selection. Wrong choices give gentle local feedback, reset the streak and leave the clue/options unchanged. Correct choices earn only that concept and automatically select another unsolved hint with its spelling options, preserving the success message and answered word's Hebrew meaning (including streak praise). At completion no further hint is selected. The textbox/Check, letter hints, Show word and unsolved-clue audio are hidden and disabled in Beginner; programmatic typed submissions cannot earn credit. Found-word cards have a pronunciation button in every level, speaking their displayed English spelling without changing progress.

**Intermediate** types from the restricted list: 18 body parts (arms, cheeks, chest, chin, ears, elbows, eyes, feet, fingers, hair, hands, head, legs, lips, mouth, neck, nose, shoulders), plus available round items matching bag, belt, boots, coat, dress, glasses, gloves, hat, jeans, ring, shirt, shoes, skirt, watch or pants through existing accepted spellings. Familiar labels retain artwork identity and accepted aliases. **Advanced** types from all 26 allowed body concepts, allowed outfit pieces and five allowed accessories with advanced clues. Both typed modes retain their authored hints and variable round counts.

All production levels exclude these concepts and their corresponding artwork: anklets, beanie, blouse, beret, boot bow, boot chain, boot wings, bow tie, brooch, knee pads, leg warmers, leggings, mittens, palms, shoe charm, shoulder cord and waist chain. Exclusion uses concept identity before basic-name mapping, so an excluded beret cannot return as a hat. Both wardrobe selectors apply these exclusions; typed modes choose five compatible accessories (all five when only five remain). The departing preview and vocabulary page apply the same exclusion. **Pants** is the canonical display/spoken spelling at every level and in the word list; the existing trousers alias and artwork ID remain valid for this allowed concept.

Every level change restarts the same character, clearing words, hints, choices and bonuses. Beginner's expanded wardrobe and the typed modes' shared five-accessory selection are cached independently for that character: switching back restores the mode's selection; a new character/category resets both. During an unfinished round, only earned pieces are visible. **Finding every active word reveals all allowed current-round layers in every level**, including body/outfit pieces outside the basic word list, and keeps the completed character visible until reset. This adds no learned words or credit and never restores excluded concepts. The explicit three-second departing preview uses the same full allowed artwork. The vocabulary page lists 69 playable concepts (26 body parts and 43 items), with selection/filter/export behavior independent of game level. Full source artwork/metadata and generated vocabulary snapshots remain intact for validation; production policy lives in `illustrated-content.js`. Retained sandbox snapshots and the original five-character builder remain unchanged.

Completed clue cards also show the canonical English word and its Hebrew meaning beneath the crossed-out sentence. Unsolved clues never display their answers.

Unsolved clue cards are keyboard-accessible buttons that open their clue in the hint panel, scroll/focus that panel and mark the selection. Solved clues remain visible but are disabled. In typed levels, reselecting the same clue preserves letter progress; choosing another resets it. Selecting clues never fills an answer or adds artwork, and all clue/choice buttons are disabled during the new-character preview. Beginner options use native keyboard buttons with English LTR labels inside the Hebrew panel; after a correct choice focus moves to the automatically selected hint panel (or New Character on completion).

The typed-level bonus notification is anchored to the input and closes after four seconds or with its X button, leaving the bonus word in place. General feedback, input help, streak, bonus explanation and level description remain in the round-information dialog; only Beginner's choice feedback/praise is local beside the choices. New Character temporarily reveals the completed full current-round character (including the active mode's accessories) for three seconds without awarding answers, then switches to another character on an empty canvas at the same level. Gameplay controls, including category/level selectors, are locked during this brief preview; changing category outside the preview starts a fresh round.

The approved illustrated game is now published under [`english/body-and-wearables/`](./english/body-and-wearables/), directly linked from the English hub for all grades. Its instructions open in a popup below the description, and it always shows the full canvas without zoom controls. Hebrew clues are visible immediately; a separate panel lists all current-round clues and crosses out those already solved. Assist helps with likely misspellings without autocorrecting or drawing anything. The sandbox copies, original five-character prototype and style gallery remain available separately and are not automatically synchronized with production. The illustrated game's local scripts/artwork are an intentional exception to single-file games; no sandbox files are loaded at runtime.

The [illustrated Body and Wearables builder demo](./sandbox/body-and-wearables/illustrated-demo.html) lets the learner choose Anime, Superhero, Cartoon or Manga, then secretly chooses one of that category's ten illustrated preview characters and five compatible random accessories. **The canvas starts empty.** Only correctly typed body parts, available clothes and accessories appear, as independent SVG pieces, except during the explicit departing-character preview. Eyes do not reveal the head, and a hat does not reveal hair; entries work in any order. All 27 required body concepts and each character's base outfit have independent geometry, with clothes drawn over learned body pieces. The full illustration is never used as a hidden/clipped background. Hints and Show word do not reveal any artwork or grant credit. Hints come only from that round's available targets, with level-matched authored Hebrew clues, cumulative sequential/random letters and optional Show word after three failed guesses or three letter reveals. New character/category resets to empty without saving progress; gallery accessory preferences remain separate and untouched. This sandbox has character-specific wardrobe options, not the original builder's entire 46-wearable inventory or the 50-character library.

The illustrated demo reuses the original game's 73 authored dictionary records via `illustrated-vocabulary.js`, generated by `node sandbox/body-and-wearables/export-illustrated-vocabulary.cjs`. Regenerate after changing the original embedded dictionary. `illustrated-content.js` adds authored vocabulary for new illustrated wearables, explicitly maps accessory variants to concepts and derives targets from each character's body locations, base outfit and selected accessories. `style-samples/illustrated-layers-anime-manga.js` and `illustrated-layers-hero-cartoon.js` hold independent body/clothing fragments and their paint order; only earned fragments enter the canvas. The source gallery SVGs remain unchanged.

The [Body and Wearables demo](./sandbox/body-and-wearables/index.html) is a separate typed-English free-building game: 27 body concepts and 46 wearable concepts assemble original SVG layers on an initially empty canvas. Three proficiency levels change the suggested vocabulary and authored bilingual hints, not which correct words are accepted. Explicit aliases count once; replacing or re-equipping clothes preserves learned words. Progress resets with a new character and is not saved. Optional Hebrew translation accompanies cumulative sequential or random-position letter hints, with a revealed-letter counter. After either three rejected guesses or three letter-hint clicks for the active clue, the learner can choose **Show word**. This never automatically enters the answer or grants credit; the learner still types it. Changing levels preserves hint progress; finding the word, choosing another clue or resetting the character clears it.

The [parent review catalogue](./sandbox/body-and-wearables/review.html) exports the actual dictionary, accepted forms, level-specific clues and artwork for inspection, without fetching game data. It is a snapshot and must be regenerated after game content/art changes. This first phase has **five original sample characters**, one per category (Superhero, Cartoon, Anime, upright cartoon Animal, monochrome Manga). The full 50-character library awaits explicit sample approval; this demo neither replaces existing English games nor authorizes publication or promotion. Open either HTML file locally; no server or installation is needed.

The separate [art-style gallery](./sandbox/body-and-wearables/style-samples/index.html) presents 40 original SVG characters: ten each for Anime, Superhero, Cartoon and Manga (five color, five black-and-white), informed by the user's visual references. The original eight designs are preserved. Each character has ten additional accessories, with five randomly selected on the first visit. **Shuffle accessories** picks a different compatible set of five for that character, with English/Hebrew labels, individual toggles and show/hide-all controls. Conflicting accessories cannot be selected together. Newly selected accessories start visible; original outfits remain fixed. Enlarging a character preserves the current selection. Each character's selected accessory IDs and visibility are automatically saved in browser-local storage and restored on reopening. These settings are local to that browser/profile and page origin, not synced; local-file storage behavior depends on the browser. Invalid/outdated selections are regenerated with a visible warning, and storage failures warn without disabling the gallery. Everything works from local files without a server. The same designs have independent body/outfit pieces in the illustrated builder, but not the original game's full 73-concept coverage. The original builder and Animal category are unchanged. Cartoon shading suggests volume rather than claiming a rendered 3D result; reference photographs/artwork are not embedded or republished.

The [curriculum preview](./sandbox/curriculum-refresh/index.html) stages numerical-variety improvements for Math Grade 4 and expanded, original English practice for children in Israel. Its [English hub](./sandbox/curriculum-refresh/english/index.html) follows the canonical Grade 3, Grade 4, and English 12+ hierarchy. Grade 3 focuses on short concrete words and picture-supported sentences; Grade 4 combines familiar subjects with correctly inflected verbs; Secret Agent uses clues grounded in its existing scenes. Phonics and memory activities retain their skill objectives rather than becoming grammar games. Authored reading passages and fixed lesson examples remain unchanged, and hidden Secret Agent worlds stay hidden.

Israeli Ministry of Education elementary guidance is the primary reference for the elementary preview; Cambridge English and British Council children's resources supplement it, rather than defining Israeli grade expectations. Age labels do not imply native-English proficiency. English targets learners of an additional language, with everyday vocabulary and Hebrew guidance; Math uses shekels, metric units, and familiar local contexts. Exercise prices and quantities are fictional, not current Israeli tariffs. Existing topics remain available, including enrichment that may go beyond a child's current classwork. This is supplementary practice, not Ministry-approved material or a claim of complete curriculum coverage. The Ministry describes a phased Math curriculum transition, with Grade 3 joining in 2026–27; do not assume the new curriculum already applies to Grade 4. The preview is isolated from the main games and retained `edu-games2` version. Its landing page links the educational sources; source material is not copied or loaded at runtime.

Grade 4 sentence variation covers Have/Has, Present Simple, and Present Continuous: 120 compatible subject/phrase combinations per topic (360 total), with explicit verb forms, matching Hebrew guidance, and completed English pronunciation. Each direct ten-question session mixes five composed questions with five authored ones; mixed-world practice uses the same source decks. The finite combinations are shuffled locally, not generated by an online AI service, and may repeat across sessions. Reading passages, fixed lessons, and other authored content remain intact.

The [English sentence review](./sandbox/curriculum-refresh/english-sentence-review.html) is a static snapshot of all 360 composed questions exported from the preview generator, with completed sentences, choices, and the same Hebrew/English guidance. It supports topic/text filtering and works locally without fetching game content. It does not automatically update when the generator changes.

The [all-level English review](./sandbox/curriculum-refresh/english-all-levels-review.html) adds Grade 3 and Secret Agent, with 740 practice entries filtered by level or text (not 740 distinct sentences). Grade 3 composes 120 simple sentence combinations, yielding 118 additions in each of its sentence-matching and sentence-building modes after existing overlaps are excluded; all eight tabs and 13 fixed readings remain. Secret Agent has 144 reviewed bilingual clue/target combinations across the same six active missions, four per original action slot. Its clue stays stable through narration, translation, hints and rerendering; replay uses bounded recent history. This is finite local variation, not live AI or newly unlocked worlds. The review is an exported snapshot, not an automatically synchronized game database.

1. Stage every new or substantially changed experience under [`sandbox/`](./sandbox/).
2. Link it from `sandbox/sandbox.html` and publish the preview.
3. Wait for explicit approval.
4. Promote the approved files to production, remove sandbox-only labels, validate, then commit and push.

## 🛠️ Edit & republish
1. Edit and validate the relevant files.
2. For user-visible changes, complete the sandbox review workflow first.
3. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```
4. GitHub Pages rebuilds automatically. Hard-refresh the live URL on mobile to clear cache.
