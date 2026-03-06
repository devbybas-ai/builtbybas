# BuiltByBas — Responsible AI Policy

> **Version:** 2.0
> **Effective Date:** March 2026
> **Last Reviewed:** Session 31 (2026-03-06)
> **Owner:** Bas Rosario, BuiltByBas
> **Review Cycle:** Quarterly or upon any change in AI usage
>
> Every AI feature has a human review gate. AI assists — it does not decide.
> Source of truth: `.claude/SITE-HEALTH-PLAN.md` (RAI Standards section)
>
> This policy is designed to comply with: UK GDPR, EU General Data Protection Regulation (GDPR), EU AI Act (2024), UK ICO AI and Data Protection guidance, California Consumer Privacy Act (CCPA/CPRA), and internationally recognized AI ethics frameworks including the OECD AI Principles and UNESCO Recommendation on AI Ethics.

---

## 1. Scope and Applicability

This policy applies to:

- All AI-assisted features within the BuiltByBas platform (builtbybas.com)
- All client-facing and internal AI-generated content
- All data processed by or sent to AI systems
- All personnel and automated systems involved in AI operations
- All jurisdictions in which BuiltByBas operates or serves clients, with particular adherence to the strictest applicable standards (UK/EU)

**AI Risk Classification (EU AI Act):** All current BuiltByBas AI use cases fall within the "limited risk" category. No high-risk AI systems (as defined in Annex III of the EU AI Act) are deployed. If any use case approaches high-risk classification, it must undergo a Fundamental Rights Impact Assessment before deployment.

---

## 2. AI Use Cases

| Feature                   | What AI Does                                                                              | Where It Runs          | Risk Level | Human Gate                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------- | ---------- | --------------------------------------------------------------- |
| **Proposal Drafting**     | Generates executive summary, scope of work, timeline from client intake data              | Server-side API route  | Limited    | Bas reviews and edits every proposal before it reaches a client |
| **Project Estimates**     | Suggests timeline, budget ranges, and milestone breakdown based on project type and scope | Server-side API route  | Limited    | Bas reviews and adjusts all estimates before presenting         |
| **Content Generation**    | Creates marketing copy, blog posts, social media content for clients                      | Server-side API route  | Limited    | Bas reviews all generated content before delivery               |
| **Follow-Up Suggestions** | Recommends next actions for pipeline clients based on stage and activity                  | Admin dashboard widget | Minimal    | Suggestions displayed to Bas — he decides which to act on       |
| **Client Insights**       | Analyzes intake data and project history to surface patterns                              | Admin analytics page   | Minimal    | Insights are informational — no automated actions taken         |
| **Invoice Descriptions**  | Generates line item descriptions from deliverable data                                    | Invoice editor         | Limited    | Bas reviews and edits all descriptions before sending           |
| **Intake Scoring**        | Scores intake submissions on readiness, scope clarity, engagement, budget alignment       | Server-side scoring    | Limited    | Algorithmic (no external AI API) — Bas reviews all scores       |
| **Priority Ranking**      | Ranks submissions by objective project criteria for dashboard display                     | Server-side scoring    | Limited    | Algorithmic — bias-free by design (see Section 7)               |

---

## 3. Human Review Gates

**Rule:** No AI-generated content reaches a client without human review. No exceptions.

| Gate            | Where                                   | What Gets Reviewed           | Required Action                                                 |
| --------------- | --------------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| Proposal review | Proposal editor (/admin/proposals/[id]) | Full proposal text           | "I have reviewed this proposal" checkbox before send is enabled |
| Estimate review | Project creation flow                   | Timeline, budget, milestones | Manual confirmation before saving to project                    |
| Content review  | Content delivery workflow               | All generated copy           | Bas reads and edits before delivery to client                   |
| Invoice review  | Invoice editor (/admin/invoices/[id])   | Line item descriptions       | Manual review before send button is active                      |
| Scoring review  | Intake detail page                      | Priority and fit scores      | Bas reviews scoring rationale before acting on recommendations  |

### Meaningful Human Oversight (UK ICO Requirement)

Human review is not a rubber stamp. Reviewers must:

1. **Understand** the AI output and the data it was based on
2. **Have authority** to modify, reject, or override any AI recommendation
3. **Be accountable** for the final decision, not the AI system
4. **Document** any modifications made to AI-generated content
5. **Escalate** concerns about AI output quality or fairness

---

## 4. Data Protection and Privacy

### 4.1 Lawful Basis for Processing (UK GDPR / EU GDPR)

All processing of personal data through AI systems relies on one of the following lawful bases:

| Purpose                | Lawful Basis                        | Justification                                             |
| ---------------------- | ----------------------------------- | --------------------------------------------------------- |
| Proposal generation    | Legitimate interest (Art. 6(1)(f))  | Necessary to prepare requested service proposals          |
| Client intake scoring  | Legitimate interest (Art. 6(1)(f))  | Necessary to assess project fit and readiness             |
| Invoice generation     | Contract performance (Art. 6(1)(b)) | Necessary to deliver contracted services                  |
| Analytics and insights | Legitimate interest (Art. 6(1)(f))  | Business improvement with minimal impact on data subjects |

### 4.2 What IS Sent to AI (Anthropic Claude API)

- Client intake form responses (business info, project requirements, goals)
- Project type, scope, and service category
- Deliverable descriptions and status
- Non-sensitive business context needed for generation

### 4.3 What is NEVER Sent to AI

- Passwords or authentication tokens
- Payment information (credit cards, bank details, routing numbers)
- Social security numbers, national insurance numbers, or government IDs
- Personal health information (PHI)
- Biometric data
- Children's data (no data from individuals under 18 is processed)
- Racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, sexual orientation, or criminal records (UK GDPR Article 9 special categories)
- Any data the client has explicitly marked as confidential
- Full database dumps or raw SQL data

### 4.4 Data Minimization (UK GDPR Article 5(1)(c))

Only the minimum data necessary for the specific AI task is sent. Data is stripped of unnecessary identifiers before processing. PII fields are encrypted at rest using AES-256-GCM.

### 4.5 Data Retention and Deletion

- API calls to Anthropic follow Anthropic's zero-retention API policy — prompts and outputs are not stored by Anthropic or used for training
- Generated content is stored in the BuiltByBas PostgreSQL database with encryption at rest
- Clients may request deletion of all their data at any time (UK GDPR Article 17 — Right to Erasure)
- Upon deletion request, all PII and AI-generated content related to the client is permanently removed within 30 days
- Backup copies are purged on the next backup rotation cycle

### 4.6 International Data Transfers

BuiltByBas servers are located in the United States. When processing data of UK/EU residents:

- Data transfers rely on Anthropic's Standard Contractual Clauses (SCCs) for API processing
- All data in transit is encrypted via TLS 1.3
- All data at rest is encrypted via AES-256-GCM
- A Transfer Impact Assessment has been considered for the US destination

### 4.7 Data Subject Rights

BuiltByBas honors the following rights for all users, regardless of jurisdiction:

| Right                                    | How to Exercise              | Response Time |
| ---------------------------------------- | ---------------------------- | ------------- |
| Right of Access (Art. 15)                | Email privacy@builtbybas.com | 30 days       |
| Right to Rectification                   | Email privacy@builtbybas.com | 30 days       |
| Right to Erasure                         | Email privacy@builtbybas.com | 30 days       |
| Right to Restrict Processing             | Email privacy@builtbybas.com | 30 days       |
| Right to Data Portability                | Email privacy@builtbybas.com | 30 days       |
| Right to Object                          | Email privacy@builtbybas.com | 30 days       |
| Rights re: Automated Decisions (Art. 22) | Email privacy@builtbybas.com | 30 days       |

**Automated Decision-Making (UK GDPR Article 22):** No solely automated decisions with legal or similarly significant effects are made about any individual. All AI outputs are reviewed by a human before any action is taken. Clients have the right to request human review of any AI-assisted assessment.

---

## 5. Transparency

### 5.1 Client-Facing Transparency

- The `/about` page discloses AI as part of the #OneTeam approach
- Every proposal includes: "Reviewed and approved by Bas Rosario, BuiltByBas"
- Client portal does not expose raw AI output — only human-approved content
- If a client asks "did AI help with this?" the answer is always honest
- This RAI policy is publicly accessible and referenced in proposals

### 5.2 Algorithmic Transparency (UK ICO Guidance)

For algorithmic scoring (intake scoring, priority ranking):

- Every score includes a breakdown of contributing factors with explanations
- Scoring criteria are documented in source code and this policy
- No opaque or unexplainable models are used — all scoring is rule-based and auditable
- Clients can request an explanation of how their submission was assessed

### 5.3 AI Supply Chain Transparency

| Component      | Provider   | Purpose                     | Data Access                        |
| -------------- | ---------- | --------------------------- | ---------------------------------- |
| Language Model | Anthropic  | Text generation             | Receives prompts, returns text     |
| Scoring Engine | Internal   | Intake and priority scoring | No external data sharing           |
| Database       | PostgreSQL | Data storage                | Self-hosted, no third-party access |

---

## 6. Fairness and Bias Prevention

### 6.1 Design Principles

All AI and algorithmic systems in BuiltByBas are designed to be bias-free:

| Risk                                                             | Mitigation                                                                                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Proposal language could favor certain industries or demographics | Bas reviews every proposal for neutral, professional language                                                                                   |
| Estimates could be biased by project type assumptions            | Estimates presented as ranges with justification, reviewed by Bas                                                                               |
| Content could contain cultural assumptions                       | Bas reviews all content for cultural sensitivity before delivery                                                                                |
| Follow-up suggestions could prioritize higher-value clients      | Suggestions based on pipeline stage and recency, not client revenue                                                                             |
| Scoring could encode demographic bias                            | Fit assessment and priority scores based on objective project criteria (readiness, scope, engagement), never on client identity or demographics |
| Priority ranking could favor larger businesses                   | Company size, industry, budget amount, name, and demographics are explicitly excluded from the priority algorithm                               |

### 6.2 Priority Scoring — Bias-Free by Design

The priority scoring algorithm uses only these objective factors:

| Factor               | Weight | What It Measures                                | What It Excludes                    |
| -------------------- | ------ | ----------------------------------------------- | ----------------------------------- |
| Project Readiness    | 25%    | Preparation level (requirements, budget, scope) | Who the client is                   |
| Budget Alignment     | 20%    | Does budget fit the requested scope             | Budget size (a $3K project = valid) |
| Scope Clarity        | 20%    | How specific and measurable requirements are    | Industry or business type           |
| Engagement Level     | 15%    | Effort shown in intake responses                | Demographics or contact quality     |
| Timeline Feasibility | 10%    | Can we deliver given complexity vs timeline     | Client urgency pressure             |
| Risk Assessment      | 10%    | RAI concerns and warning flags                  | Subjective judgments                |

**Explicitly excluded from scoring:** Client name, email domain, industry, company size, budget amount, location, gender, age, race, ethnicity, disability status, or any other protected characteristic.

### 6.3 Equality Act 2010 Compliance (UK)

BuiltByBas does not use AI to make decisions that could constitute direct or indirect discrimination under the Equality Act 2010. Protected characteristics (age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation) are never factors in any algorithmic assessment.

### 6.4 RAI Screening

The intake scoring engine includes an automated screen for ethically concerning project requests across 8 categories:

1. Surveillance / tracking without consent
2. Deceptive practices
3. Discrimination / bias by design
4. Data harvesting / privacy violation
5. Dark patterns / manipulative UX
6. Exploitation of vulnerable populations
7. Illegal or harmful content
8. Circumventing laws / regulations

Flagged submissions are deprioritized and require Bas's manual review before any engagement.

---

## 7. Security

### 7.1 Technical Controls

- All PII encrypted at rest with AES-256-GCM
- All data in transit encrypted via TLS 1.3
- httpOnly cookies for authentication (no client-side token exposure)
- Rate limiting on login (5 attempts / 15 min / IP)
- CSRF protection via origin header validation
- Field whitelisting on all API endpoints — no raw request bodies passed to database
- No `eval()`, `dangerouslySetInnerHTML`, or string concatenation in queries
- No secrets in client-side code

### 7.2 Access Control

- Role-Based Access Control (RBAC): owner, team, client
- Auth checks enforced on every protected route
- Admin routes require owner-level authentication
- API keys stored in server-side environment variables only

### 7.3 Infrastructure

- VPS hosted on Hostinger (Ubuntu 24.04, US)
- PM2 process management with auto-restart
- Nginx reverse proxy with security headers
- Let's Encrypt SSL with auto-renewal
- PostgreSQL with connection pooling

---

## 8. Incident Response

**If AI produces harmful, incorrect, or biased output:**

1. **Catch it** — Human review gates exist to catch problems before they reach clients
2. **Don't send it** — If caught in review, fix or regenerate. Never send problematic content.
3. **Log it** — Record the incident in AUDIT.md issues tracker with:
   - Date and time of incident
   - What was generated
   - Why it was problematic
   - What corrective action was taken
   - Whether any data subjects were affected
4. **Fix the root cause** — Update the AI prompt template or scoring logic to prevent recurrence
5. **If it reached a client** — Contact the client directly within 72 hours, apologize, correct the record
6. **Review the gate** — Determine if the human review process needs strengthening
7. **Report if required** — If the incident involves a personal data breach, notify the ICO within 72 hours (UK GDPR Article 33) and affected data subjects without undue delay (Article 34)

### Incident Log

All incidents are recorded in `AUDIT.md` with the following fields:

| Field             | Description                            |
| ----------------- | -------------------------------------- |
| Incident ID       | Unique identifier                      |
| Date              | When it occurred                       |
| Severity          | Low / Medium / High / Critical         |
| Description       | What happened                          |
| Root Cause        | Why it happened                        |
| Impact            | Who was affected and how               |
| Resolution        | What was done                          |
| Prevention        | What was changed to prevent recurrence |
| Regulatory Notice | Whether ICO/authorities were notified  |

**Escalation:** Bas Rosario is the sole decision-maker for AI incident response. There is no automated escalation — every incident is handled personally.

---

## 9. Accountability and Governance

### 9.1 Roles and Responsibilities

| Role                     | Person      | Responsibilities                                                           |
| ------------------------ | ----------- | -------------------------------------------------------------------------- |
| AI Policy Owner          | Bas Rosario | Final authority on all AI decisions, policy updates, and incident response |
| Data Protection Contact  | Bas Rosario | Handles all data subject requests and privacy inquiries                    |
| Technical Implementation | Claude (AI) | Implements safeguards, scoring logic, and technical controls               |

### 9.2 Policy Review

This policy is reviewed:

- **Quarterly** as part of standard governance
- **Immediately** when a new AI feature is added or an existing feature changes
- **Upon request** from any client or regulatory authority
- **After any incident** involving AI-generated output

### 9.3 Record Keeping

BuiltByBas maintains records of:

- All AI-assisted processing activities (UK GDPR Article 30)
- All human review decisions on AI-generated content
- All data subject requests and responses
- All incidents involving AI output
- All changes to this policy

---

## 10. Children's Data

BuiltByBas does not knowingly collect or process personal data from children under 18 years of age. The intake form and all services are designed for business use by adults. If we become aware that data from a child has been collected, it will be deleted immediately.

This is in compliance with UK Age Appropriate Design Code (Children's Code), COPPA (US), and GDPR Article 8.

---

## 11. Contact

For questions about this policy, data subject requests, or to report concerns:

- **Email:** privacy@builtbybas.com
- **Website:** builtbybas.com
- **Response time:** Within 30 days for all formal requests

For UK/EU residents: You have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk if you believe your data protection rights have been violated.

---

*This policy was drafted with AI assistance and reviewed and approved by Bas Rosario, BuiltByBas.*
