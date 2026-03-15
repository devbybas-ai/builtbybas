# BuiltByBas — Document Navigation Index

> The map of all maps. Every document, what it answers, when to read it.
> AI reads this FIRST to know where to find anything.
> This file is the fastest path to any answer about this project.

---

## Quick Lookup — "I need to know about..."

| I need to know about...                  | Read this file                     | Location                                           |
| ---------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| What this project IS                     | HANDOFF.md                         | `docs/HANDOFF.md`                                  |
| What standards we follow                 | SITE-HEALTH-PLAN.md                | `.claude/SITE-HEALTH-PLAN.md`                      |
| Session rules (start/during/end)         | CLAUDE.md                          | `.claude/CLAUDE.md`                                |
| Current project health and issues        | AUDIT.md                           | `AUDIT.md`                                         |
| Where files go in the codebase           | DIRECTORY-STRUCTURE.md             | `docs/DIRECTORY-STRUCTURE.md`                      |
| Every page and route in the app          | SITEMAP.md                         | `docs/SITEMAP.md`                                  |
| How we test and what's covered           | TESTING-PLAN.md                    | `docs/TESTING-PLAN.md`                             |
| How to set up a new project from scratch | PROJECT-SETUP.md                   | `PROJECT-SETUP.md`                                 |
| AI governance and human review gates     | RAI-POLICY.md                      | `RAI-POLICY.md`                                    |
| Environment variables needed             | .env.example                       | `.env.example`                                     |
| Historical completed work                | completedscope.md                  | `docs/archive/completedscope.md`                   |
| Tech stack and architecture decisions    | HANDOFF.md Part 2                  | `docs/HANDOFF.md`                                  |
| Database schema                          | DIRECTORY-STRUCTURE.md + schema.ts | `docs/DIRECTORY-STRUCTURE.md`, `src/lib/schema.ts` |
| API endpoints and routes                 | SITEMAP.md                         | `docs/SITEMAP.md`                                  |
| Component inventory                      | DIRECTORY-STRUCTURE.md             | `docs/DIRECTORY-STRUCTURE.md`                      |
| Design tokens and brand                  | CLAUDE.md (Pillar 6/UX)            | `.claude/CLAUDE.md`                                |
| CI/CD pipeline                           | .github/workflows/ci.yml           | `.github/workflows/ci.yml`                         |
| Deployment process                       | SITE-HEALTH-PLAN.md (Deployment)   | `.claude/SITE-HEALTH-PLAN.md`                      |
| VPS server details                       | Memory files                       | Claude memory                                      |
| SME Agent Personas                       | AGENT-PERSONAS.md                  | `docs/AGENT-PERSONAS.md`                           |
| Agent performance tracking               | AGENT-PERFORMANCE.md               | `docs/AGENT-PERFORMANCE.md`                        |

---

## Session Protocol — What to Read and When

### Starting a Session (read in this order)

| #   | File                | Why                                               | Time                        |
| --- | ------------------- | ------------------------------------------------- | --------------------------- |
| 1   | `docs/HANDOFF.md`   | Current state, what's done, what's next, blockers | 30 sec                      |
| 2   | `AUDIT.md`          | Open issues, health scores, tech debt             | 15 sec                      |
| 3   | `.claude/CLAUDE.md` | Rules, stack, prohibited actions                  | Only if new session context |

### During a Session (reference as needed)

| Task                      | Reference File                                                       |
| ------------------------- | -------------------------------------------------------------------- |
| Building a new page/route | SITEMAP.md → DIRECTORY-STRUCTURE.md                                  |
| Creating a component      | DIRECTORY-STRUCTURE.md (components section)                          |
| Writing API endpoint      | SITEMAP.md (route protection) → DIRECTORY-STRUCTURE.md (api section) |
| Writing tests             | TESTING-PLAN.md                                                      |
| Security question         | SITE-HEALTH-PLAN.md (Pillar 1)                                       |
| Accessibility question    | SITE-HEALTH-PLAN.md (Pillar 4 + 7)                                   |
| Performance question      | SITE-HEALTH-PLAN.md (Pillar 3)                                       |
| Code quality question     | SITE-HEALTH-PLAN.md (Code Quality Enforcement)                       |
| AI feature development    | RAI-POLICY.md + AGENT-PERSONAS.md                                    |
| Deploying to VPS          | SITE-HEALTH-PLAN.md (Deployment Standards)                           |

### Ending a Session

| #   | Action                                | File              |
| --- | ------------------------------------- | ----------------- |
| 1   | Update what's done, in-progress, next | `docs/HANDOFF.md` |
| 2   | Log any issues found or fixed         | `AUDIT.md`        |
| 3   | Run tests, note pass/fail             | Terminal output   |
| 4   | Recommend next steps                  | `docs/HANDOFF.md` |

---

## Document Relationships

```
PROJECT-SETUP.md                    ← Read once (project founding)
    │
    ├── Creates → .claude/CLAUDE.md         ← Read every session (rules)
    │                 │
    │                 └── References → .claude/SITE-HEALTH-PLAN.md  ← Source of truth
    │
    ├── Creates → docs/HANDOFF.md           ← Read + update every session (state)
    │                 │
    │                 └── Archives to → docs/archive/completedscope.md
    │
    ├── Creates → AUDIT.md                  ← Read + update every session (health)
    │
    ├── Creates → docs/DIRECTORY-STRUCTURE.md  ← Reference during builds
    ├── Creates → docs/TESTING-PLAN.md         ← Reference when writing tests
    ├── Creates → docs/SITEMAP.md              ← Reference when building pages/API
    ├── Creates → docs/DOCUMENT-INDEX.md       ← THIS FILE — master navigation
    ├── Creates → docs/AGENT-PERSONAS.md       ← AI agent specialist definitions
    ├── Creates → RAI-POLICY.md                ← Reference for AI features
    ├── Creates → .env.example                 ← Reference for configuration
    └── Creates → .github/workflows/ci.yml     ← Automated quality gates
```

---

## Document Ownership

| Document               | Primary Owner | Updated By             | Update Frequency                      |
| ---------------------- | ------------- | ---------------------- | ------------------------------------- |
| CLAUDE.md              | Bas           | Claude (with approval) | When standards or stack change        |
| HANDOFF.md             | Claude + Bas  | Claude                 | Every session                         |
| AUDIT.md               | Claude        | Claude                 | When issues found/fixed               |
| SITE-HEALTH-PLAN.md    | Bas           | Bas                    | When universal standards evolve       |
| DIRECTORY-STRUCTURE.md | Claude        | Claude                 | When new directories/patterns added   |
| TESTING-PLAN.md        | Claude        | Claude                 | When new test types or areas added    |
| SITEMAP.md             | Claude + Bas  | Claude                 | When new routes/pages added           |
| DOCUMENT-INDEX.md      | Claude        | Claude                 | When any document is added or removed |
| AGENT-PERSONAS.md      | Bas + Claude  | Both                   | When new SME agents are designed      |
| AGENT-PERFORMANCE.md   | Claude        | Claude                 | When agents are activated in sessions |
| RAI-POLICY.md          | Claude + Bas  | Claude                 | When AI scope changes                 |
| PROJECT-SETUP.md       | Bas           | Bas                    | When setup protocol evolves           |

---

## Adding a New Document

When a new document is created in this project:

1. Add it to the Quick Lookup table above
2. Add it to the Document Relationships diagram
3. Add it to Document Ownership table
4. If it's a session-critical document, add to Session Protocol section
5. Reference it in CLAUDE.md Quick Reference section
6. Update PROJECT-SETUP.md File Manifest if it should be created for every project

---

## For Future Projects

This DOCUMENT-INDEX.md pattern is universal. Every Rosario project should have one. Copy the structure, adapt the Quick Lookup table to the specific project's documents. The faster AI can navigate your docs, the faster you ship.
