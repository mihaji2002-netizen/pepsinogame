# PEPSINO LAB

**Gamified Education Operating System**

Planning, mentoring, gamification, analytics, reports, and motivation in one unified product experience.

## Repository Structure

```text
docs/srs/          Software Requirements Specification documents
web/               Next.js MVP web application (primary platform)
```

## Documentation

| Document | Description |
| --- | --- |
| [SRS Document 02 — PRD](docs/srs/02-product-requirements-document.md) | Product Requirements Document — the starting specification for implementation |

## MVP Web App

The `web/` package implements Version 1 MVP surfaces from the PRD:

- Landing website
- Authentication (demo email + role entry)
- First-login onboarding + Digital ID Card
- Student dashboard, Mission Board, Logbook, Weekly Planner
- XP, Coins, Levels, Labs, Achievements, Leaderboard
- Mentor command center, student detail, attendance, exams, printable reports

### Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo access

- **Student:** register a new account, or sign in with `ava@pepsinolab.dev`
- **Mentor:** open Sign in → Continue as Mentor

State persists in the browser via `localStorage` for demo purposes.

## Product Standard

Every page should feel like a premium SaaS product — polished enough for a flagship case study, while remaining practical for students and mentors.
