# SME Agent Performance Log

> **Purpose:** Track agent activation, task outcomes, and quality patterns.
> Use high-performing agents for their strengths. Retrain or replace underperformers.
> Updated every session where agents are activated.
>
> Author: Bas Rosario + Claude (#OneTeam)

---

## Leaderboard

_Updated after each session. Agents ranked by success rate and quality consistency._

| Rank | Agent                   | Tasks | Success | Partial | Failed | Win Rate | Best At                          |
| ---- | ----------------------- | ----- | ------- | ------- | ------ | -------- | -------------------------------- |
| 1    | AGENT-42: ScoringEngine | 1     | 1       | 0       | 0      | 100%     | Algorithmic scoring, data models |
| 1    | AGENT-07: DataModeler   | 1     | 1       | 0       | 0      | 100%     | Type definitions, interfaces     |
| 1    | AGENT-04: APIArchitect  | 1     | 1       | 0       | 0      | 100%     | API routes, storage, validation  |
| 1    | AGENT-13: UIArchitect   | 1     | 1       | 0       | 0      | 100%     | Admin dashboards, data viz       |

---

## Rating System

| Rating  | Criteria                                                                                  |
| ------- | ----------------------------------------------------------------------------------------- |
| Success | Output met all quality criteria. No rework needed. Passed lint, tsc, tests on first pass. |
| Partial | Output was usable but needed correction. Minor issues caught in review.                   |
| Failed  | Output required significant rework or was scrapped. Agent not suited for this task type.  |

### What Gets Tracked

- **Agent ID + Name** — Which SME persona was activated
- **Task** — Specific work performed
- **Session** — When it ran
- **Result** — Success / Partial / Failed
- **Quality Notes** — What went well, what didn't, specific issues
- **Lines/Files** — Scale of output
- **Recommendation** — Keep / Retrain (refine prompt) / Replace (Claude direct)

### Retraining Protocol

When an agent scores Partial or Failed:

1. **Identify root cause** — Was the prompt too vague? Wrong domain match? Missing context?
2. **Refine agent card** — Update instructions, quality criteria, or anti-patterns in AGENT-PERSONAS.md
3. **Retry the same task** — Run the refined agent on the same or similar task
4. **Compare results** — Did the refinement improve output?
5. **Log both attempts** — Original failure + retry result for the performance record

---

## Performance Log

### Session: Phase 3 — Intake Analysis Engine (2026-02-28)

_Agents activated this session will be logged below as tasks complete._

| Agent                                                    | Task                                          | Result  | Quality Notes                                                                                                                  | Lines/Files                                   | Recommendation |
| -------------------------------------------------------- | --------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | -------------- |
| AGENT-42: ScoringEngineArchitect + AGENT-07: DataModeler | Types + Scoring Engine + Tests (Commit 1)     | Success | 55/55 tests, lint clean, tsc clean, all on first pass. Pure functions, deterministic, fully testable.                          | ~490 + 80 + 370 lines / 3 files               | Keep           |
| AGENT-04: APIArchitect                                   | Storage + API + Form Connection (Commits 2-3) | Success | Clean API routes, path traversal protection, Zod validation, proper error responses. No rework needed.                         | ~65 + 50 + 35 + 25 lines / 4 files            | Keep           |
| AGENT-13: UIArchitect                                    | Admin Dashboard + Pages (Commit 4)            | Success | 4 components + 2 pages, semantic HTML, ARIA roles, glassmorphism design, responsive grid. Build green (26 routes). First pass. | ~50 + 55 + 75 + 185 + 40 + 45 lines / 6 files | Keep           |

---

## Patterns & Insights

_Populated as data accumulates across sessions._

### Agent-Task Affinity Map

| Task Category | Best Agent(s) | Avoid Agent(s) | Notes |
| ------------- | ------------- | -------------- | ----- |
| _No data yet_ | —             | —              | —     |

### Common Failure Modes

| Mode          | Frequency | Root Cause | Fix Applied |
| ------------- | --------- | ---------- | ----------- |
| _No data yet_ | —         | —          | —           |

---

## Audit Trail

| Date       | Session                | Agents Used                            | Results Summary                                                            |
| ---------- | ---------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| 2026-02-28 | Intake Analysis Engine | AGENT-42, AGENT-07, AGENT-04, AGENT-13 | 4 agents, 3 tasks, 3/3 Success (100%). 13 files, 55 tests, 26-route build. |
