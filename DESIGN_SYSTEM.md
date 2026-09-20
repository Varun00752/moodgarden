# Design System — MoodGarden

Goal: the app should feel calm, not clinical. Soft colors, generous
whitespace, slow gentle animation. Avoid anything that looks like a
default Bootstrap/dashboard template.

## Color tokens (Tailwind config, CSS variables)

### Light mode
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF7F2` (warm off-white) | page background |
| `--surface` | `#FFFFFF` | cards |
| `--text-primary` | `#2E2A26` | main text |
| `--text-muted` | `#8A8378` | secondary text |
| `--accent` | `#7C9885` (sage green) | buttons, active states |
| `--border` | `#EDE8E0` | dividers |

### Dark mode
| Token | Value |
|---|---|
| `--bg` | `#1A1B1E` |
| `--surface` | `#232427` |
| `--text-primary` | `#EDEAE4` |
| `--text-muted` | `#9B978F` |
| `--accent` | `#8FB39B` |
| `--border` | `#333437` |

### Mood → color scale (for garden tiles)
Interpolate across a warm-to-cool gradient, low saturation (avoid harsh
red/green which reads as "grading" the user):

| Mood score | Color (light mode) |
|---|---|
| 1 | `#D9C7B8` (muted clay) |
| 2 | `#E3D4C2` |
| 3 | `#D8DFC8` (neutral sage) |
| 4 | `#BFDCC4` |
| 5 | `#9FCBAE` (soft green) |

No entry that day → tile renders as `--border` color, empty/hollow.

## Typography
- Headings: `Fraunces` (serif, warm, distinctive — avoid generic Inter-only look) via Google Fonts
- Body: `Inter` for readability
- Generous line-height (1.6+) on journal text areas

## Layout principles
- Max content width ~640px on desktop, centered — this is a personal app,
  not a dashboard; don't stretch content edge to edge on wide screens.
- Mobile-first: design the 375px layout first, then scale up.
- Rounded corners throughout: `rounded-2xl` (16px) on cards and buttons.
- Soft shadows only, never hard borders as the primary separator:
  `shadow-[0_2px_20px_rgba(0,0,0,0.04)]`.

## Garden grid spec (the centerpiece visual)
- A month view: 7-column grid (Sun–Sat), similar to a calendar.
- Each day = a rounded square tile, color per the mood scale above.
- If habits were logged that day, a small bloom icon (simple SVG flower,
  2–3 petal variants) fades in at the bottom-right corner of the tile,
  sized by number of habits completed (1 habit = small bud, 5 = full bloom).
- Tile appears with a soft fade+scale-in animation on load, staggered by
  ~20ms per tile (Framer Motion `staggerChildren`) — this single detail is
  what makes the page feel "alive" rather than static.
- Clicking a tile opens `DayModal` with a gentle scale+fade transition
  (not a hard modal pop-in).
- Today's tile has a subtle pulsing ring (`animate-pulse`, low opacity)
  if no entry has been logged yet — a soft nudge, not a red badge/alert.

## Motion principles
- All transitions 300–500ms, `ease-out` — nothing snappy or bouncy.
- No autoplay video/loud animation. This app's whole pitch is "calm."
- Respect `prefers-reduced-motion`: disable stagger/scale animations for
  users who have that OS setting on.

## Component notes
- `MoodPicker`: 5 emoji-style faces in a row, selected state = scale up
  slightly + accent-colored ring, not a jarring color change.
- `InsightCard`: appears below the garden grid, soft accent-colored left
  border, icon (a small sprout/leaf), one sentence, no numbers-heavy
  dashboard styling.
- `ThemeToggle`: sun/moon icon swap with a smooth icon-morph transition.

## What to avoid
- No default shadcn/ui look-and-feel left unstyled — reskin colors/fonts.
- No harsh pure-white (`#FFFFFF`) large backgrounds in light mode — use
  the warm off-white token instead.
- No red for "bad mood" — the muted clay tone keeps the whole palette calm
  even on low-mood days, which is the emotional point of the product.
