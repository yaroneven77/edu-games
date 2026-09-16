# 🎓 Edu Games

A collection of small, self-contained educational games for kids. Each game is a single offline-capable HTML file living in its own folder. No build step, no dependencies — hosted free on GitHub Pages. Exercises are generated dynamically, while interactive lesson examples remain fixed for clear teaching.

Every active page includes the approved refreshed design and a persistent five-template selector. Adventure scenery, Space stars, Classroom textures, Stickers notebook lines, and the Arcade grid accompany the template pictures. A choice made on one page follows the learner across the site without requiring an account.

## ▶️ Play
**https://yaroneven77.github.io/edu-games/**

The root page (`index.html`) is a hub that links to every game.

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
| [`english/`](./english/) | מִשְׂחֲקֵי אַנְגְּלִית | English grade selector. |
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

The [Grade 4 curriculum preview](./sandbox/curriculum-refresh/index.html) stages numerical-variety improvements for Math and expanded, original English practice for children in Israel. Israeli Ministry of Education elementary guidance is the primary reference; Cambridge English and British Council children's resources supplement it, rather than defining Israeli Grade 4 expectations. English targets learners of an additional language, with short everyday sentences and Hebrew guidance; Math uses shekels, metric units, and familiar local contexts. Exercise prices and quantities are fictional, not current Israeli tariffs. Existing topics remain available, including enrichment that may go beyond a child's current classwork. This is supplementary practice, not Ministry-approved material or a claim of complete curriculum coverage. The Ministry describes a phased Math curriculum transition, with Grade 3 joining in 2026–27; do not assume the new curriculum already applies to Grade 4. The preview is isolated from the main games and retained `edu-games2` version. Its landing page links the educational sources; source material is not copied or loaded at runtime.

English sentence variation currently covers Have/Has, Present Simple, and Present Continuous: 120 compatible subject/phrase combinations per topic (360 total), with explicit verb forms, matching Hebrew guidance, and completed English pronunciation. Each direct ten-question session mixes five composed questions with five authored ones; mixed-world practice uses the same source decks. The finite combinations are shuffled locally, not generated by an online AI service, and may repeat across sessions. Reading passages, fixed lessons, and other authored content remain intact.

The [English sentence review](./sandbox/curriculum-refresh/english-sentence-review.html) is a static snapshot of all 360 composed questions exported from the preview generator, with completed sentences, choices, and the same Hebrew/English guidance. It supports topic/text filtering and works locally without fetching game content. It does not automatically update when the generator changes.

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
