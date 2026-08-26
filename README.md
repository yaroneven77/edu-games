# 🎓 Edu Games

A collection of small, self-contained educational games for kids. Each game is a single offline-capable HTML file living in its own folder. No build step, no dependencies — hosted free on GitHub Pages. Exercises are generated dynamically, while interactive lesson examples remain fixed for clear teaching.

## ▶️ Play
**https://yaroneven77.github.io/edu-games/**

The root page (`index.html`) is a hub that links to every game.

## 🎮 Games
| Folder | Game | Description |
|--------|------|-------------|
| [`math/`](./math/) | מִשְׂחֲקֵי חֶשְׁבּוֹן | Math grade selector. |
| [`grade-3/`](./grade-3/) | חֶשְׁבּוֹן לְכִתָּה ג' | 9 Hebrew math mini-games for 3rd grade: division with remainder, multiplication and division, word problems, fractions, divisibility, grouping division, and the multiplication table. |
| [`grade-4/`](./grade-4/) | חֶשְׁבּוֹן לְכִתָּה ד' | 11 Grade 4 math games covering numbers, written arithmetic, order of operations, number properties, fractions, word problems, geometry, measurement, data, and probability. Each game includes an interactive Hebrew lesson with narration, examples, and practice. |
| [`english/`](./english/) | מִשְׂחֲקֵי אַנְגְּלִית | English grade selector. |
| [`english/grade-3/`](./english/grade-3/) | English Grade 3 | Learn English words via pictures and phonics with sound and Hebrew translations. |
| [`english/grade-4/`](./english/grade-4/) | English Grade 4 | 28 vocabulary, grammar, reading, and guided-writing topics with Hebrew lessons, English audio, randomized practice, and detailed bilingual answer explanations. |

## 📁 Project structure
```
edu-games/
├── index.html             # landing hub linking to subject sections
├── math/
│   └── index.html         # math grade selector
├── grade-3/
│   └── index.html         # Grade 3 math games
├── grade-4/
│   ├── index.html         # Grade 4 math hub
│   ├── numbers/index.html
│   ├── operations/index.html
│   ├── fractions/index.html
│   ├── written-arithmetic/index.html
│   ├── number-properties/index.html
│   ├── fraction-operations/index.html
│   ├── word-problems/index.html
│   ├── geometry/index.html
│   ├── measurement/index.html
│   ├── data/index.html
│   └── probability/index.html
├── english/
│   ├── index.html         # English grade selector
│   ├── grade-3/
│   │   └── index.html     # Grade 3 English games
│   └── grade-4/
│       └── index.html     # Grade 4 English academy with 28 topics
├── division-game/
│   └── index.html         # legacy redirect to grade-3/
└── word-game/
    └── index.html         # legacy redirect to english/grade-3/
```

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
