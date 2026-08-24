# Edu Games Copilot Instructions

## Project purpose

Edu Games is a collection of educational English and math games created for children. Keep every change child-friendly, simple to use, visually engaging, and appropriate for the intended age group.

## Architecture

- Keep the project dependency-free unless the user explicitly requests otherwise.
- Each game should remain a self-contained HTML file with its CSS and JavaScript embedded.
- Do not introduce a build step, framework, package manager, or server requirement for ordinary content additions.
- Keep games usable from GitHub Pages and when opened locally in a browser.
- Preserve offline capability except for optional services already used by the project, such as analytics.
- Add a new game in its own folder with an `index.html` file.
- Link new games from the appropriate section hub and, when relevant, from the root `index.html`.
- Organize math games by grade: the root links to `math/`, which links to `grade-3/`, `grade-4/`, and future grade folders.
- Organize English games under `english/`, with each grade in a nested folder such as `english/grade-3/`.
- Grade 4 currently contains 11 games covering numbers to one million, order of operations, fraction comparison, written arithmetic, number properties, fraction operations, word problems, geometry, measurement, data, and probability.
- Preserve legacy public URLs with lightweight redirects when moving published games.
- Treat `sandbox/sandbox.html` as the preview hub for all new or substantially changed content.
- Add staged content to the sandbox preview hub so the user can test it at the published sandbox URL before production promotion.
- Preserve existing previews as separate files or folders linked from the sandbox hub instead of overwriting unrelated staged content.
- Keep experimental content out of the production hubs and navigation until the user approves it.
- Before any production push, publish the proposed behavior in the sandbox and wait for explicit user approval.

## Existing patterns

- Study similar existing games before implementing new content and reuse their established patterns.
- Match the existing colorful card-based visual design, rounded controls, shadows, gradients, and responsive layouts.
- Preserve mobile-first behavior, large touch targets, readable typography, and short interaction flows.
- Support the repository's right-to-left Hebrew and left-to-right English content correctly.
- Match the existing use of Hebrew niqqud when adding Hebrew text for young children.
- Reuse existing speech-synthesis patterns for English and Hebrew pronunciation.
- Include clear positive feedback, gentle retry messaging, scores, progress, or celebration effects where appropriate.
- Avoid interactions that require precise mouse control, hover, a physical keyboard, or desktop-only behavior.
- Keep audio optional: the game must remain understandable and playable when speech synthesis is unavailable.

## Educational content

- Use age-appropriate vocabulary, instructions, examples, and difficulty.
- Keep questions and answers unambiguous and factually correct.
- Prefer varied exercises while preventing impossible, duplicate, or misleading answer choices.
- Keep guided lesson examples fixed and intentional so explanations remain clear and repeatable.
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
