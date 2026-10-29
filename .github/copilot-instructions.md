# Copilot instructions

Space exploration quiz delivered as a single self-contained `index.html` (inline CSS + JS). No build, no package manager, no tests, no linter, no server. To run it, open the file directly (`file:///.../index.html`) in a browser.

## Constraints
- Keep everything in `index.html`: no external dependencies, fonts, CDNs, or extra files.
- Layout is a single centered column (`main`, max-width 480px); body text is 14–16px (currently 15px) in the system sans-serif stack.

## Architecture
- **Data:** the `Q` array holds the 10 questions as `[question, options[], correctIndex, fact]`. The count is derived from `Q.length`, and the results emoji tiers in `finish()` assume a 10-point score, so adjust those thresholds if the question count changes.
- **State:** module-level `i` (current question), `score`, `locked` (prevents double answers). Flow is `start()` → `show()` → `answer(k)` → Next → `finish()` → `start()` on "Play again". DOM is re-rendered imperatively via `$()` (getElementById).
- **Progress:** `progress(n)` drives both the bar fill and the 🚀 position, and keeps `aria-valuenow` in sync. It is called with `i` on show and `i+1` after answering.
- **Theming:** colors are CSS variables on `:root`. Dark values are defined twice on purpose: once in `@media (prefers-color-scheme: dark)` guarded by `:not([data-theme=light])`, and once under `[data-theme=dark]` for the manual toggle. Any new color variable must be added in all three places. The toggle persists to `localStorage` under `theme` (wrapped in try/catch for `file://` restrictions).
- **Feedback animations:** `.correct` (green + `pop`) and `.wrong` (red + `shake`) classes; `prefers-reduced-motion` disables all animation, so don't rely on animation events for logic.

## Conventions
- Accessibility behaviors to preserve: options are real `<button>`s; after answering, focus moves to Next; after Next, focus moves to the first option (skipped on the first question so the page doesn't steal focus on load); the fact line is `aria-live`.
- Manual smoke test: load in the integrated browser, answer one wrong and one correct, check score/progress/feedback, finish to see the results screen, "Play again" resets, and toggle the theme.
