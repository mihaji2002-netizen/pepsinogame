# 21st.dev integration

- Skill: `.cursor/skills/21st-registry/`
- shadcn initialized in `web/` (`components.json`, rtl: true)
- Inspired components (no auth required to use):
  - `web/src/components/ui/shimmer-button.tsx`
  - `web/src/components/ui/number-ticker.tsx`

To pull more from 21st after login:
```bash
npx @21st-dev/cli login
npx shadcn@latest add "https://21st.dev/r/<author>/<slug>"
```
