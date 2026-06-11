# 🎉 Word Games for Kids

A simple, colorful word-learning game for kids. One self-contained HTML file, no build, no dependencies — works offline. Hosted free on GitHub Pages.

## ▶️ Play
**https://yaroneven77.github.io/word-game/**

Send that **link** (not the file) to play on a phone. Opening the raw `.html` in WhatsApp's preview won't run the game — it must open in a browser (Safari/Chrome).

## 🎮 Features
- **Two games on tabs:**
  - **🖼️ Picture → Word** — see an emoji picture, pick the matching word (35 words).
  - **📖 Word → Picture** — read the word as text, pick the matching picture (34 phonics/CVC words).
- **3 tries** per word with a heart indicator (❤️ ❤️ ❤️).
- **🔊 button** — reads the English word aloud (female voice when available).
- **עב button** — shows the Hebrew translation (with niqqud) and reads it aloud (uses the device's Hebrew voice, e.g. "Carmit" on iPhone; text shows even if no Hebrew voice).
- Separate score + streak per tab. Fully offline.

## 📁 Project structure
- `index.html` — the entire game (HTML + CSS + JS in one file). **This is the only file needed to run it.**

## 🛠️ How to edit & republish
1. Edit `index.html`.
2. Commit and push to `main`:
   ```bash
   git add index.html
   git commit -m "your message"
   git push origin main
   ```
3. GitHub Pages rebuilds automatically (~1 minute). Refresh the live URL (hard-refresh on mobile to clear cache).

> Note: a personal access token (PAT) with `repo` scope for the GitHub account is used to push. Don't commit the token.

## ▶️ Continue next week
Just clone and keep working:
```bash
git clone https://github.com/yaroneven77/word-game.git
cd word-game
```
Open `index.html` in a browser to test locally; edit; commit; push.

## 📝 Word lists
- **Game 1 (picture → word):** dog, old, hungry, sun, goat, bear, young, milkshake, moon, soft, horse, slow, hippo, bird, sleeping, duck, fast, deer, dolphin, sandals, giraffe, fat, thin, sheep, spider, elevator, lion, small, big, cow, mouse, monkey, happy, snail, elephant, cactus.
- **Game 2 (word → picture, phonics):** dad, mad, bag, gap, beg, cat, pam, egg, hat, can, ten, pan, bad, pen, has, pat, cab, dan, hen, the, nat, ant, sad, tag, is, nag, bat, net, in, bed, tap, sat, pet, on.

Some abstract/function words and names use best-effort emojis and Hebrew (the, is, in, on, has, can, gap, nag, sat, beg; names Pam/Pat/Dan/Nat).
