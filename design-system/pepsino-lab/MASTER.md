# Design System Master: PEPSINO LAB

> Generated with [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), then curated for PEPSINO LAB (Persian RTL · Gamified Education OS · Premium SaaS).

## Product

- **Name:** PEPSINO LAB
- **Type:** Gamified Education Operating System
- **Primary users:** دانش‌آموز · منتور · ادمین
- **Stack:** Next.js App Router + Tailwind + Framer Motion
- **Locale:** `fa` / `dir=rtl`

## Pattern

**Hero-first product OS + Mission-first dashboards**

1. Landing: Brand hero → Labs → How it works → FAQ → CTA
2. Student home: Today’s Mission, XP, Level, Coins first (not menus)
3. Mentor: Command center with roster, approvals, reports

## Style

**Soft UI Evolution + Liquid Glass accents**

- Soft depth, clear hierarchy, WCAG AA contrast
- Glass panels with subtle blur (not heavy clay / not kids UI)
- Motion 200–300ms, spring only on intentional moments
- Premium SaaS / Awwwards-adjacent polish

### Avoid

- Claymorphism / Comic fonts / kids candy UI
- Purple-on-white / AI purple-pink gradients
- Dark-mode-first
- Emoji as icons
- Opacity-0 SSR that blanks the page

## Colors

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#0F8A8A` | `--brand` |
| Primary deep | `#0B5F63` | `--brand-deep` |
| Accent / CTA gold | `#D4A017` | `--accent` |
| Success | `#2A9D6E` | `--success` |
| Danger | `#D1495B` | `--danger` |
| Ink | `#102027` | `--ink` |
| Ink soft | `#3A4F57` | `--ink-soft` |
| Paper | `#F3F7F6` | `--paper` |
| Paper deep | `#E7EFED` | `--paper-deep` |
| Line | `rgba(16,32,39,0.10)` | `--line` |

Lab accents remain: Neuro teal · Research amber · Catalyst coral · Pioneer green.

## Typography

- **UI / Display / Body (FA+EN):** Vazirmatn
- Weight: 400 body · 600 labels · 800 display
- Keep LTR for IDs, emails, numeric codes (`dir="ltr"`)

## Effects

- Soft multi-layer shadows
- Glass surfaces: `rgba(255,255,255,0.72)` + `backdrop-filter: blur(16px)`
- Hover lift 1–2px / 200ms
- Focus ring: 2–3px brand
- XP toast pop (not page-wide opacity hide)
- Respect `prefers-reduced-motion`

## Components

- Buttons: rounded-full, `cursor-pointer`, visible focus
- Surfaces: radius 18px, soft border, soft shadow
- Progress: 10px track, brand fill
- Cards only when interaction needs a container

## Pre-delivery checklist (UI UX Pro Max)

- [x] No emoji icons (Lucide)
- [ ] `cursor-pointer` on all clickables
- [ ] Hover 150–300ms
- [ ] Contrast ≥ 4.5:1
- [ ] Focus states visible
- [ ] `prefers-reduced-motion`
- [ ] Responsive 375 / 768 / 1024 / 1440
