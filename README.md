# 🎓 Edu Games

A collection of small, self-contained educational games for kids. Each game is a single offline-capable HTML file living in its own folder. No build step, no dependencies — hosted free on GitHub Pages. Exercises are generated dynamically, while interactive lesson examples remain fixed for clear teaching.

Every active page includes a persistent five-template design selector. A choice made on one page follows the learner across the site without requiring an account.

## ▶️ Play
**https://yaroneven77.github.io/edu-games/**

The root page (`index.html`) is a hub that links to every game.

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
│   └── theme-selector.js  # shared persistent visual-theme selector
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

Published paths that predate this hierarchy remain as lightweight redirects.

## ➕ Add a new game
1. Create a new folder under the appropriate subject and grade.
2. Put a self-contained `index.html` inside it.
3. Add a card to the appropriate grade hub.
4. Add or update the subject/grade selector only when introducing a new grade.
5. Preserve an old public URL with a redirect if published content moves.

## 🧪 Sandbox review workflow
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
