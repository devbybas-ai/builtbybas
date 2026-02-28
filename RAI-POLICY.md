# BuiltByBas — Responsible AI Policy

> Every AI feature has a human review gate. AI assists — it does not decide.
> Source of truth: `.claude/SITE-HEALTH-PLAN.md` (RAI Standards section)

---

## 1. AI Use Cases

| Feature                   | What AI Does                                                                              | Where It Runs          | Human Gate                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| **Proposal Drafting**     | Generates executive summary, scope of work, timeline from client intake data              | Server-side API route  | Bas reviews and edits every proposal before it reaches a client   |
| **Project Estimates**     | Suggests timeline, budget ranges, and milestone breakdown based on project type and scope | Server-side API route  | Bas reviews and adjusts all estimates before presenting to client |
| **Content Generation**    | Creates marketing copy, blog posts, social media content for marketing clients            | Server-side API route  | Bas reviews all generated content before delivery                 |
| **Follow-Up Suggestions** | Recommends next actions for clients in the pipeline based on stage and activity           | Admin dashboard widget | Suggestions displayed to Bas — he decides which to act on         |
| **Client Insights**       | Analyzes intake data and project history to surface patterns and opportunities            | Admin analytics page   | Insights are informational — no automated actions taken           |
| **Invoice Descriptions**  | Generates line item descriptions from deliverable data                                    | Invoice editor         | Bas reviews and edits all descriptions before sending             |

---

## 2. Human Review Gates

**Rule:** No AI-generated content reaches a client without Bas reviewing it first.

| Gate            | Where                                   | What Gets Reviewed           | Required Action                                                 |
| --------------- | --------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| Proposal review | Proposal editor (/admin/proposals/[id]) | Full proposal text           | "I have reviewed this proposal" checkbox before send is enabled |
| Estimate review | Project creation flow                   | Timeline, budget, milestones | Manual confirmation before saving to project                    |
| Content review  | Content delivery workflow               | All generated copy           | Bas reads and edits before delivery to client                   |
| Invoice review  | Invoice editor (/admin/invoices/[id])   | Line item descriptions       | Manual review before send button is active                      |

---

## 3. Data Handling

### What IS sent to AI (Anthropic Claude API)
- Client intake form responses (business info, project requirements, goals)
- Project type, scope, and service category
- Deliverable descriptions and status
- Non-sensitive business context needed for generation

### What is NEVER sent to AI
- Passwords or authentication tokens
- Payment information (credit cards, bank details)
- Social security numbers or government IDs
- Personal health information
- Any data the client has explicitly marked as confidential
- Full database dumps or raw SQL data

### Data retention
- API calls to Anthropic follow Anthropic's data retention policy
- No client data is used to train AI models (per Anthropic's API terms)
- Generated content is stored in the BuiltByBas database, not in external AI systems

---

## 4. Transparency

- The `/about` page mentions AI as part of the #OneTeam approach (Bas + AI partnership)
- Proposals include a note: "Drafted with AI assistance, reviewed and approved by Bas Rosario"
- Client portal does not expose raw AI output — only Bas-approved content
- If a client asks "did AI write this?" the answer is always honest

---

## 5. Bias Prevention

| Risk                                                             | Mitigation                                                                                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Proposal language could favor certain industries or demographics | Bas reviews every proposal for neutral, professional language                                                              |
| Estimates could be biased by project type assumptions            | Estimates always presented as ranges with justification, reviewed by Bas                                                   |
| Content could contain cultural assumptions                       | Bas reviews all content for cultural sensitivity before delivery                                                           |
| Follow-up suggestions could prioritize higher-value clients      | Suggestions are based on pipeline stage and recency, not client revenue                                                    |
| Scoring engine could encode bias                                 | Fit assessment scores based on objective project criteria (readiness, scope match, engagement), not client characteristics |

---

## 6. Incident Response

**If AI produces harmful, incorrect, or biased output:**

1. **Catch it** — Human review gates exist to catch problems before they reach clients
2. **Don't send it** — If caught in review, fix or regenerate. Never send problematic content.
3. **Log it** — Record the incident in AUDIT.md issues tracker with:
   - What was generated
   - Why it was problematic
   - What was done about it
4. **Fix the prompt** — Update the AI prompt template in `src/lib/ai/` to prevent recurrence
5. **If it reached a client** — Contact the client directly, apologize, correct the record
6. **Review the gate** — Determine if the human review process needs strengthening

**Escalation:** Bas is the sole decision-maker for AI incident response. There is no automated escalation — every incident is handled personally.
