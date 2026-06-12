# 🎓 Edu Games

A collection of small, self-contained educational games for kids. Each game is a single offline-capable HTML file living in its own folder. No build step, no dependencies — hosted free on GitHub Pages.

## ▶️ Play
**https://yaroneven77.github.io/edu-games/**

The root page (`index.html`) is a hub that links to every game.

## 🎮 Games
| Folder | Game | Description |
|--------|------|-------------|
| [`division-game/`](./division-game/) | מִשְׂחֲקֵי חֶשְׁבּוֹן לְכִתָּה ג' | 9 Hebrew math mini-games for 3rd grade: division with remainder (typed & multiple-choice), multiply/divide up to 10,000, two-step word problems, fractions (identify & interactive coloring), divisibility by 5 & 10, interactive grouping division, and an interactive multiplication table. Includes a step-by-step "אֵיךְ פּוֹתְרִים?" explanation button. |
| [`word-game/`](./word-game/) | Word Games | Learn English words via pictures and phonics (picture→word, word→picture) with sound and Hebrew translations. |

## 📁 Project structure
```
edu-games/
├── index.html          # landing hub linking to all games
├── division-game/
│   └── index.html      # the entire division game (HTML+CSS+JS)
└── word-game/
    └── index.html      # the entire word game (HTML+CSS+JS)
```

## ➕ Add a new game
1. Create a new folder, e.g. `my-game/`.
2. Put a self-contained `index.html` inside it.
3. Add a card linking to `./my-game/` in the root `index.html` hub.

## 🛠️ Edit & republish
1. Edit the relevant `index.html`.
2. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```
3. GitHub Pages rebuilds automatically (~1 minute). Hard-refresh the live URL on mobile to clear cache.
