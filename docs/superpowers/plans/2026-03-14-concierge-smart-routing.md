# Concierge Smart Routing Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage concierge from a portfolio showcase funnel into a smart intake router where every tap captures qualifying data (category, service, priority, timeline), then auto-routes to the right intake form with data pre-filled.

**Architecture:** Replace the 5-screen concierge (welcome, greeting, followup, matching, payoff) with a 7-screen flow (welcome, category, qualifier, qualifier-expanded, priority, timeline, confirmation). The concierge state machine in MobileConcierge.tsx drives all screens. Data passes to the intake form via URL query params (`?service=x&priority=y&timeline=z`). The intake form reads these params to skip already-answered steps and pre-fill fields.

**Tech Stack:** Next.js App Router, TypeScript, Framer Motion, Zod validation, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-03-14-concierge-smart-routing-design.md`

---

## Chunk 1: Data Layer (Types, Content, Validation)

### Task 1: Update ConciergeScreen Type and Add Qualifier Types

**Files:**
- Modify: `src/lib/concierge-content.ts:3-64`

- [ ] **Step 1: Update the ConciergeScreen type and expand ConciergeIconName**

Replace line 3 (`ConciergeScreen` type):

```typescript
// OLD
export type ConciergeScreen = "welcome" | "greeting" | "followup" | "matching" | "payoff";

// NEW
export type ConciergeScreen = "welcome" | "category" | "qualifier" | "qualifier-expanded" | "priority" | "timeline" | "confirmation";
```

Also expand `ConciergeIconName` (lines 7-12) to include all icons needed by qualifier/timeline screens:

```typescript
// OLD
export type ConciergeIconName = "Globe" | "LayoutDashboard" | "Layers" | "Sparkles" | "Check";

// NEW
export type ConciergeIconName =
  | "Globe" | "LayoutDashboard" | "Layers" | "Sparkles" | "Check"
  | "RefreshCw" | "FileText" | "BarChart3" | "Users" | "Target"
  | "ShoppingCart" | "HelpCircle" | "Clock";
```

- [ ] **Step 2: Add QualifierId type, qualifier data structures, and update ConciergePriority**

Add `icon` field to the existing `ConciergePriority` interface (lines 23-26):

```typescript
// OLD
export interface ConciergePriority {
  id: PriorityId;
  label: string;
}

// NEW
export interface ConciergePriority {
  id: PriorityId;
  label: string;
  icon?: ConciergeIconName;
}
```

Add after the `ConciergePriority` interface (before `ConciergePayoff`):

```typescript
export type QualifierId =
  | "marketing-website" | "website-redesign" | "landing-page"
  | "business-dashboard" | "client-portal" | "crm-system" | "ai-tools"
  | "full-platform" | "ecommerce";

export type TimelineId = "asap" | "2-4-weeks" | "5-6-weeks" | "flexible";

export interface ConciergeQualifier {
  id: QualifierId;
  label: string;
  description: string;
  icon: ConciergeIconName;
}

export interface ConciergeTimeline {
  id: TimelineId;
  label: string;
}

export interface ConciergeQualifierGroup {
  headline: string;
  options: ConciergeQualifier[];
  hasSomethingElse: boolean;
}
```

- [ ] **Step 3: Update the ConciergeContent interface**

Add the new properties to the `ConciergeContent` interface (lines 34-64) so the `conciergeContent` object compiles in strict mode:

```typescript
// Add these properties to the ConciergeContent interface:
qualifiers: Record<Exclude<CategoryId, "other">, ConciergeQualifierGroup>;
timelines: ConciergeTimeline[];
otherPriorities: ConciergePriority[];
confirmation: {
  headline: string;
  standardTemplate: { serviceLine: string; priorityLine: string; timelineLine: string; closing: string };
  otherTemplate: { serviceLine: string; priorityLine: string; timelineLine: string; closing: string };
};
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Type errors in MobileConcierge.tsx (expected at this stage, the old screen names are still referenced there). Errors in concierge-content.ts because the `conciergeContent` object doesn't yet have the new properties (added in Task 2). No errors in the types themselves.

---

### Task 2: Add Qualifier Content Data

**Files:**
- Modify: `src/lib/concierge-content.ts:66-199`

- [ ] **Step 1: Add qualifier groups to the content structure**

Add a new `qualifiers` property to `conciergeContent` after the `greeting` section. This maps each category to its qualifier options:

```typescript
qualifiers: {
  website: {
    headline: "Is this a...",
    options: [
      { id: "marketing-website", label: "A brand new site", description: "Start fresh with a custom website", icon: "Globe" },
      { id: "website-redesign", label: "A redesign", description: "Rebuild and improve your current site", icon: "RefreshCw" },
      { id: "landing-page", label: "A single landing page", description: "One focused page to drive action", icon: "FileText" },
    ],
    hasSomethingElse: false,
  } as ConciergeQualifierGroup,
  webapp: {
    headline: "What kind of tool are you looking for?",
    options: [
      { id: "business-dashboard", label: "A dashboard to see my business data", description: "Real-time visibility into your operations", icon: "BarChart3" },
      { id: "client-portal", label: "A portal for my clients", description: "Give your clients their own login", icon: "Users" },
      { id: "crm-system", label: "A system to track leads and sales", description: "Manage your pipeline and close more deals", icon: "Target" },
      { id: "ai-tools", label: "A tool powered by AI", description: "Automate tasks with artificial intelligence", icon: "Sparkles" },
    ],
    hasSomethingElse: true,
  } as ConciergeQualifierGroup,
  platform: {
    headline: "What does your platform need to do?",
    options: [
      { id: "full-platform", label: "Run my entire business operations", description: "End-to-end system with CRM, portals, and more", icon: "Layers" },
      { id: "ecommerce", label: "Sell products or services online", description: "Online store with payments and shipping", icon: "ShoppingCart" },
    ],
    hasSomethingElse: true,
  } as ConciergeQualifierGroup,
} as Record<Exclude<CategoryId, "other">, ConciergeQualifierGroup>,
```

- [ ] **Step 2: Add timeline options to concierge content**

Add a `timelines` property:

```typescript
timelines: [
  { id: "asap", label: "ASAP -- I needed this yesterday" },
  { id: "2-4-weeks", label: "2-4 weeks" },
  { id: "5-6-weeks", label: "5-6 weeks" },
  { id: "flexible", label: "Flexible -- quality over speed" },
] as ConciergeTimeline[],
```

- [ ] **Step 3: Add generic priorities for "Something Else"**

Add an `otherPriorities` property:

```typescript
otherPriorities: [
  { id: "quality" as PriorityId, label: "Quality -- built right, no shortcuts", icon: "Check" as ConciergeIconName },
  { id: "speed" as PriorityId, label: "Speed -- I need this fast", icon: "Check" as ConciergeIconName },
  { id: "budget" as PriorityId, label: "Budget -- I need it done smart", icon: "Check" as ConciergeIconName },
] as ConciergePriority[],
```

- [ ] **Step 4: Add confirmation screen copy**

Add a `confirmation` property:

```typescript
confirmation: {
  headline: "Here\u2019s what we heard.",
  standardTemplate: {
    serviceLine: "You\u2019re looking for a {service}.",
    priorityLine: "{priority} matters most.",
    timelineLine: "And you need it {timeline}.",
    closing: "We\u2019ve got the right form ready for you.",
  },
  otherTemplate: {
    serviceLine: "You\u2019ve got something unique in mind.",
    priorityLine: "{priority} matters most.",
    timelineLine: "And you\u2019re {timeline}.",
    closing: "Let\u2019s find the right fit together.",
  },
},
```

- [ ] **Step 5: Add display label maps for confirmation screen**

These convert IDs to natural language for the confirmation summary:

```typescript
export const serviceDisplayLabels: Record<QualifierId, string> = {
  "marketing-website": "a new marketing website",
  "website-redesign": "a website redesign",
  "landing-page": "a landing page",
  "business-dashboard": "a business dashboard",
  "client-portal": "a client portal",
  "crm-system": "a CRM system",
  "ai-tools": "an AI-powered tool",
  "full-platform": "a full operations platform",
  "ecommerce": "an e-commerce store",
};

export const priorityDisplayLabels: Record<string, string> = {
  design: "Design",
  speed: "Speed",
  budget: "Budget",
  realtime: "Real-time data",
  ux: "User experience",
  scale: "Scalability",
  control: "Control",
  portal: "Client experience",
  growth: "Growth",
  quality: "Quality",
};

export const timelineDisplayLabels: Record<TimelineId, string> = {
  asap: "ASAP",
  "2-4-weeks": "in 2-4 weeks",
  "5-6-weeks": "in 5-6 weeks",
  flexible: "flexible on timing",
};
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Still type errors in MobileConcierge.tsx (old screen names). No new errors.

---

### Task 3: Replace Helper Functions

**Files:**
- Modify: `src/lib/concierge-content.ts:202-215`

- [ ] **Step 1: Replace getPayoff and getIntakeHref with new routing function**

Remove `getPayoff()` (lines 202-207) and `getIntakeHref()` (lines 210-215). Replace with:

```typescript
/** Build intake form URL with concierge-captured data as query params */
export function buildIntakeUrl(
  service: QualifierId | null,
  priority: PriorityId | null,
  timeline: TimelineId | null,
  category: CategoryId | null,
): string {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (priority) params.set("priority", priority);
  if (timeline) params.set("timeline", timeline);
  if (category && !service) params.set("category", category);
  return `/intake?${params.toString()}`;
}
```

- [ ] **Step 2: Update exports**

Remove `getPayoff` and `getIntakeHref` from any export statements. The `payoffs` data object, `ConciergePayoff` type, and `payoffSecondary` content can be removed entirely as they are no longer referenced (will be cleaned up when MobileConcierge is updated).

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Errors in MobileConcierge.tsx for removed functions/types. No errors in concierge-content.ts.

- [ ] **Step 4: Commit data layer changes**

```bash
git add src/lib/concierge-content.ts
git commit -m "feat: add concierge qualifier, timeline, and confirmation content data"
```

---

### Task 4: Update IntakeFormData Type

**Files:**
- Modify: `src/types/intake.ts:1-58`

- [ ] **Step 1: Add conciergePriority field to IntakeFormData**

Add after the `timeline` field (around line 21):

```typescript
conciergePriority: string;
```

- [ ] **Step 2: Add conciergePriority to INITIAL_FORM_DATA**

Add to the initial data object (around line 50):

```typescript
conciergePriority: "",
```

- [ ] **Step 3: Update timeline options in buildSteps if referenced**

Check that `buildSteps` does not hardcode timeline values (it does not — it just adds the step type). No change needed.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Errors in files that spread INITIAL_FORM_DATA or reference IntakeFormData (expected, will be resolved in later tasks).

---

### Task 5: Update Validation Schemas

**Files:**
- Modify: `src/lib/intake-validation.ts:32-35,85-106`

- [ ] **Step 1: Update timelineBudgetSchema with new timeline values**

Replace the timeline radio options at line 32-35:

```typescript
export const timelineBudgetSchema = z.object({
  timeline: z.string().min(1, "Please select a timeline"),
  budgetRange: z.string().min(1, "Please select a budget range"),
});
```

Note: The schema just validates non-empty string. The actual radio options are in IntakeStep.tsx and will be updated in Task 9.

- [ ] **Step 2: Add conciergePriority to fullIntakeSchema**

Add to the fullIntakeSchema (around line 95):

```typescript
conciergePriority: z.string().optional().default(""),
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit type and validation changes**

```bash
git add src/types/intake.ts src/lib/intake-validation.ts
git commit -m "feat: add conciergePriority to intake types and validation"
```

---

## Chunk 2: Concierge Component (State Machine Rewrite)

### Task 6: Rewrite MobileConcierge State Machine

**Files:**
- Modify: `src/components/public-site/MobileConcierge.tsx:1-120`

- [ ] **Step 1: Update imports and state variables**

Replace the state declarations (lines 22-27) with the new state shape:

```typescript
const [screen, setScreen] = useState<ScreenType>("welcome");
const [category, setCategory] = useState<CategoryId | null>(null);
const [service, setService] = useState<QualifierId | null>(null);
const [priority, setPriority] = useState<PriorityId | null>(null);
const [timeline, setTimeline] = useState<TimelineId | null>(null);
const [direction, setDirection] = useState<1 | -1>(1);
const announcementRef = useRef<HTMLDivElement>(null);
const focusTargetRef = useRef<HTMLElement | null>(null);
```

Update imports to include the new types from concierge-content:

```typescript
import {
  conciergeContent,
  buildIntakeUrl,
  serviceDisplayLabels,
  priorityDisplayLabels,
  timelineDisplayLabels,
  type ConciergeScreen as ScreenType,
  type CategoryId,
  type PriorityId,
  type QualifierId,
  type TimelineId,
} from "@/lib/concierge-content";
```

- [ ] **Step 2: Update the concierge-reset handler**

Update the reset handler (lines 49-58) to clear all state:

```typescript
useEffect(() => {
  function handleReset() {
    setScreen("welcome");
    setCategory(null);
    setService(null);
    setPriority(null);
    setTimeline(null);
    setDirection(-1);
  }
  window.addEventListener("concierge-reset", handleReset);
  return () => window.removeEventListener("concierge-reset", handleReset);
}, []);
```

- [ ] **Step 3: Update handleWelcomeTap and rewrite navigation handlers**

Update `handleWelcomeTap` (lines 29-32) — change `"greeting"` to `"category"`:

```typescript
function handleWelcomeTap() {
  setDirection(1);
  setScreen("category"); // was "greeting"
}
```

Also update the `conciergeContent.greeting.headline` value from "What are you building?" to "What are we building?" to match the spec (Section 4).

Replace handleCategorySelect, handlePrioritySelect, and handleBack (lines 73-107) with:

```typescript
function handleCategorySelect(catId: CategoryId) {
  setCategory(catId);
  setDirection(1);
  if (catId === "other") {
    setScreen("priority");
  } else {
    setScreen("qualifier");
  }
}

function handleQualifierSelect(qualId: QualifierId) {
  setService(qualId);
  setDirection(1);
  setScreen("priority");
}

function handleSomethingElse() {
  setDirection(1);
  setScreen("qualifier-expanded");
}

function handleStillNotSure() {
  // Keep original category, null service, use generic priorities
  setService(null);
  setDirection(1);
  setScreen("priority");
}

function handlePrioritySelect(priId: PriorityId) {
  setPriority(priId);
  setDirection(1);
  setScreen("timeline");
}

function handleTimelineSelect(tlId: TimelineId) {
  setTimeline(tlId);
  setDirection(1);
  setScreen("confirmation");
}

function handleBack() {
  setDirection(-1);
  if (screen === "confirmation") {
    setTimeline(null);
    setScreen("timeline");
  } else if (screen === "timeline") {
    setPriority(null);
    setScreen("priority");
  } else if (screen === "priority") {
    if (category === "other") {
      setCategory(null);
      setScreen("category");
    } else {
      setScreen(service ? "qualifier" : "qualifier-expanded");
    }
  } else if (screen === "qualifier-expanded") {
    setService(null);
    setScreen("qualifier");
  } else if (screen === "qualifier") {
    setCategory(null);
    setService(null);
    setScreen("category");
  } else {
    setScreen("category");
  }
}
```

- [ ] **Step 4: Update the currentHeadline for screen reader announcements**

Replace the currentHeadline computation (lines 35-46) with a map lookup for readability:

```typescript
const headlineMap: Record<string, string> = {
  welcome: conciergeContent.welcome.headline,
  category: conciergeContent.greeting.headline,
  qualifier: category && category !== "other" ? conciergeContent.qualifiers[category].headline : "",
  "qualifier-expanded": category && category !== "other" ? conciergeContent.qualifiers[category].headline : "",
  priority: "What matters most in this project?",
  timeline: "When do you need this?",
  confirmation: conciergeContent.confirmation.headline,
};
const currentHeadline = headlineMap[screen] ?? "";
```

- [ ] **Step 5: Verify TypeScript compiles (partial)**

Run: `npx tsc --noEmit 2>&1 | head -30`

Expected: Errors for removed JSX screens (payoff, matching) that still reference old code. The state machine logic should compile.

---

### Task 7: Update ConciergeOption Icon Map (PREREQUISITE for qualifier screens)

**Files:**
- Modify: `src/components/public-site/ConciergeOption.tsx:7-16`

- [ ] **Step 1: Add all new icons to ConciergeOption's iconMap and imports**

The current `iconMap` only has 5 entries. Add 8 new icons needed by qualifier/timeline screens:

```typescript
// Update imports (line 7):
import {
  Globe, LayoutDashboard, Layers, Sparkles, Check,
  RefreshCw, FileText, BarChart3, Users, Target,
  ShoppingCart, HelpCircle, Clock,
  type LucideIcon,
} from "lucide-react";

// Update iconMap (lines 10-16):
const iconMap: Record<string, LucideIcon> = {
  Globe, LayoutDashboard, Layers, Sparkles, Check,
  RefreshCw, FileText, BarChart3, Users, Target,
  ShoppingCart, HelpCircle, Clock,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit icon update**

```bash
git add src/components/public-site/ConciergeOption.tsx
git commit -m "feat: add qualifier and timeline icons to ConciergeOption"
```

---

### Task 8: Rewrite MobileConcierge JSX (Screens)

**Files:**
- Modify: `src/components/public-site/MobileConcierge.tsx:114-351`

- [ ] **Step 1: Keep the Welcome screen as-is**

The welcome screen (lines 144-190) stays unchanged. No modifications needed.

- [ ] **Step 2: Replace the Greeting screen with Category screen**

Replace the greeting screen block (lines 193-231) — change `screen === "greeting"` to `screen === "category"`, keep the same content and ConciergeOption cards. Update the screenKey:

```typescript
{screen === "category" && (
  <ConciergeScreen screenKey="category" direction={direction}>
    {/* Same content as current greeting screen */}
```

- [ ] **Step 3: Replace the Followup screen with Qualifier screen**

Replace the followup screen block (lines 234-276) with the new qualifier screen:

```typescript
{screen === "qualifier" && category && category !== "other" && (
  <ConciergeScreen screenKey="qualifier" direction={direction}>
    <div className="relative z-10">
      <button
        onClick={handleBack}
        aria-label="Go back to previous question"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    <div className="flex-1" />
    <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
      <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
        {conciergeContent.qualifiers[category].headline}
      </h2>
      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
        {conciergeContent.qualifiers[category].options.map((opt, index) => (
          <ConciergeOption
            key={opt.id}
            ref={index === 0 ? setFocusTarget : undefined}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            index={index}
            onSelect={() => handleQualifierSelect(opt.id)}
          />
        ))}
        {conciergeContent.qualifiers[category].hasSomethingElse && (
          <ConciergeOption
            label="Something else"
            icon="HelpCircle"
            index={conciergeContent.qualifiers[category].options.length}
            onSelect={handleSomethingElse}
          />
        )}
      </div>
    </div>
    <div className="flex-1" />
  </ConciergeScreen>
)}
```

- [ ] **Step 4: Add Qualifier Expanded screen**

Add after the qualifier screen:

```typescript
{screen === "qualifier-expanded" && category && category !== "other" && (
  <ConciergeScreen screenKey="qualifier-expanded" direction={direction}>
    <div className="relative z-10">
      <button
        onClick={handleBack}
        aria-label="Go back to previous question"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    <div className="flex-1" />
    <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
      <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
        {conciergeContent.qualifiers[category].headline}
      </h2>
      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
        {conciergeContent.qualifiers[category].options.map((opt, index) => (
          <ConciergeOption
            key={opt.id}
            ref={index === 0 ? setFocusTarget : undefined}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            index={index}
            onSelect={() => handleQualifierSelect(opt.id)}
          />
        ))}
        <ConciergeOption
          label="Still not sure?"
          description="We'll help you figure it out"
          icon="HelpCircle"
          index={conciergeContent.qualifiers[category].options.length}
          onSelect={handleStillNotSure}
        />
      </div>
    </div>
    <div className="flex-1" />
  </ConciergeScreen>
)}
```

- [ ] **Step 5: Replace the Priority screen (formerly followup)**

Update to use the correct priorities based on category. For "other" category, use `otherPriorities`:

```typescript
{screen === "priority" && (
  <ConciergeScreen screenKey="priority" direction={direction}>
    <div className="relative z-10">
      <button
        onClick={handleBack}
        aria-label="Go back to previous question"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    <div className="flex-1" />
    <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
      <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
        What matters most in this project?
      </h2>
      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
        {(category === "other" || !category
          ? conciergeContent.otherPriorities
          : conciergeContent.followUps[category].priorities
        ).map((pri, index) => (
          <ConciergeOption
            key={pri.id}
            ref={index === 0 ? setFocusTarget : undefined}
            label={pri.label}
            icon={pri.icon ?? "Check"}
            index={index}
            onSelect={() => handlePrioritySelect(pri.id)}
          />
        ))}
      </div>
    </div>
    <div className="flex-1" />
  </ConciergeScreen>
)}
```

- [ ] **Step 6: Add Timeline screen**

```typescript
{screen === "timeline" && (
  <ConciergeScreen screenKey="timeline" direction={direction}>
    <div className="relative z-10">
      <button
        onClick={handleBack}
        aria-label="Go back to previous question"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    <div className="flex-1" />
    <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
      <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
        When do you need this?
      </h2>
      <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
        {conciergeContent.timelines.map((tl, index) => (
          <ConciergeOption
            key={tl.id}
            ref={index === 0 ? setFocusTarget : undefined}
            label={tl.label}
            icon="Clock"
            index={index}
            onSelect={() => handleTimelineSelect(tl.id)}
          />
        ))}
      </div>
    </div>
    <div className="flex-1" />
  </ConciergeScreen>
)}
```

- [ ] **Step 7: Add Confirmation screen with 4.44s auto-transition**

```typescript
{screen === "confirmation" && (
  <ConciergeScreen screenKey="confirmation" direction={direction}>
    <div className="relative z-10">
      <button
        onClick={handleBack}
        aria-label="Go back to previous question"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    <div className="flex-1" />
    <ConfirmationContent
      category={category}
      service={service}
      priority={priority}
      timeline={timeline}
      focusRef={setFocusTarget}
    />
    <div className="flex-1" />
  </ConciergeScreen>
)}
```

- [ ] **Step 8: Remove matching and payoff screens**

Delete the `screen === "matching"` block (lines 278-291) and `screen === "payoff"` block (lines 293-347) entirely.

- [ ] **Step 9: Remove PayoffContent component and carousel helpers**

Delete the `PayoffContent` function (lines 368-end) and `getCarouselProjects` helper (lines 353-365). These are no longer used.

- [ ] **Step 10: Remove unused imports**

Remove imports that are no longer needed: `Link`, `Image`, `X`, `ExternalLink`, `projects` (from portfolio data). Keep `ArrowLeft`. Add `Clock`, `HelpCircle`, `RefreshCw`, `FileText`, `BarChart3`, `Target`, `ShoppingCart` to lucide imports if the ConciergeOption/ServiceIcon component needs them (check if ServiceIcon handles these — if it does, no import changes needed in MobileConcierge).

---

### Task 9: Create ConfirmationContent Component

**Files:**
- Modify: `src/components/public-site/MobileConcierge.tsx` (add at bottom of file)

- [ ] **Step 1: Write the ConfirmationContent component**

Add after the MobileConcierge function:

```typescript
function ConfirmationContent({
  category,
  service,
  priority,
  timeline,
  focusRef,
}: {
  category: CategoryId | null;
  service: QualifierId | null;
  priority: PriorityId | null;
  timeline: TimelineId | null;
  focusRef: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Auto-navigate after 4.44 seconds
  useEffect(() => {
    const url = buildIntakeUrl(service, priority, timeline, category);
    const timer = setTimeout(() => {
      router.push(url);
    }, 4440);
    return () => clearTimeout(timer);
  }, [service, priority, timeline, category, router]);

  // Tap anywhere to skip countdown
  function handleSkip() {
    const url = buildIntakeUrl(service, priority, timeline, category);
    router.push(url);
  }

  const isOther = category === "other" || !service;
  const serviceName = service ? serviceDisplayLabels[service] : "";
  const priorityName = priority ? priorityDisplayLabels[priority] ?? priority : "";
  const timelineName = timeline ? timelineDisplayLabels[timeline] : "";

  return (
    <button
      onClick={handleSkip}
      ref={focusRef as React.Ref<HTMLButtonElement>}
      tabIndex={-1}
      className="relative z-10 mx-auto w-full max-w-sm text-center outline-none md:max-w-xl lg:max-w-2xl"
      aria-label="Skip to intake form"
    >
      <h2 className="text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-4xl">
        {conciergeContent.confirmation.headline}
      </h2>
      <div className="mt-6 space-y-2 text-base leading-relaxed text-white/70 md:text-lg">
        {isOther ? (
          <>
            <p>You&apos;ve got something unique in mind.</p>
            <p><span className="text-white">{priorityName}</span> matters most.</p>
            <p>And you&apos;re <span className="text-white">{timelineName}</span>.</p>
          </>
        ) : (
          <>
            <p>You&apos;re looking for <span className="text-white">{serviceName}</span>.</p>
            <p><span className="text-white">{priorityName}</span> matters most.</p>
            <p>And you need it <span className="text-white">{timelineName}</span>.</p>
          </>
        )}
      </div>
      <p className="mt-8 text-sm text-white/40 md:text-base">
        {isOther
          ? "Let\u2019s find the right fit together."
          : "We\u2019ve got the right form ready for you."}
      </p>
      {/* Progress bar */}
      <div className="mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-white/10 md:w-48">
        <div
          className={shouldReduceMotion ? "h-full w-full bg-primary/60" : "h-full animate-confirmation-fill bg-primary/60"}
          role="progressbar"
          aria-label="Redirecting to your form"
        />
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Add useRouter import**

Add to imports at top of file:

```typescript
import { useRouter } from "next/navigation";
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Clean compile (no errors).

- [ ] **Step 4: Commit concierge rewrite**

```bash
git add src/components/public-site/MobileConcierge.tsx
git commit -m "feat: rewrite concierge with qualifier, timeline, and confirmation screens"
```

---

### Task 10: Add Confirmation Progress Bar CSS

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the confirmation fill animation**

Add before the reduced motion section:

```css
/* === CONFIRMATION FILL — 4.44s linear progress === */
@keyframes confirmation-fill {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-confirmation-fill {
  animation: confirmation-fill 4.44s linear forwards;
}
```

- [ ] **Step 2: Add reduced motion override**

The existing reduced-motion block already sets `animation-duration: 0.01ms !important`. This will apply to the confirmation fill automatically. No extra CSS needed.

- [ ] **Step 3: Commit CSS changes**

```bash
git add src/app/globals.css
git commit -m "feat: add 4.44s confirmation progress bar animation"
```

---

## Chunk 3: Intake Form Integration

### Task 11: Update useIntakeForm Hook for Concierge Params

**Files:**
- Modify: `src/hooks/useIntakeForm.ts:55-85`
- Modify: `src/types/intake.ts:109` (export SERVICE_LABELS)

- [ ] **Step 1: Add useSearchParams import and read concierge query params**

Add `useSearchParams` to imports at top of file:

```typescript
import { useSearchParams } from "next/navigation";
```

Update the hook initialization to read all three concierge params. The hook already receives `preselectedService` via options; add priority and timeline via `useSearchParams`:

```typescript
export function useIntakeForm(options: UseIntakeFormOptions = {}) {
  const searchParams = useSearchParams();
  const conciergeService = options.preselectedService ?? searchParams.get("service");
  const conciergePriority = searchParams.get("priority");
  const conciergeTimeline = searchParams.get("timeline");
  const conciergeCategory = searchParams.get("category");

  const skipServiceSelection = !!conciergeService;
  const skipTimeline = !!conciergeTimeline;
```

Update the initial state setup to apply concierge params, with precedence over draft:

```typescript
const [state, setState] = useState<IntakeFormState>(() => {
  const draft = loadDraft();
  const base = draft ?? { ...INITIAL_FORM_DATA };

  // Concierge params override draft for controlled fields
  if (conciergeService) {
    base.selectedServices = [conciergeService];
  }
  if (conciergePriority) {
    base.conciergePriority = conciergePriority;
  }
  if (conciergeTimeline) {
    base.timeline = conciergeTimeline;
  }

  return {
    currentStep: 0,
    formData: base,
    errors: {},
    isSubmitting: false,
    isComplete: false,
  };
});
```

- [ ] **Step 2: Export SERVICE_LABELS from types/intake.ts**

In `src/types/intake.ts` line 109, add `export` keyword:

```typescript
// OLD
const SERVICE_LABELS: Record<string, string> = {
// NEW
export const SERVICE_LABELS: Record<string, string> = {
```

- [ ] **Step 3: Update buildSteps to skip timeline when pre-filled**

Modify the `steps` computation (lines 82-85) to pass the skipTimeline flag:

```typescript
const steps = buildSteps(state.formData.selectedServices, skipServiceSelection, skipTimeline);
```

**IMPORTANT:** Also update the SECOND `buildSteps` call inside the `nextStep` callback (around line 191):

```typescript
// OLD (line 191)
const newSteps = buildSteps(prev.formData.selectedServices, skipServiceSelection);
// NEW
const newSteps = buildSteps(prev.formData.selectedServices, skipServiceSelection, skipTimeline);
```

Both call sites must pass `skipTimeline` to avoid step count mismatch.

- [ ] **Step 4: Update buildSteps function in types/intake.ts**

Modify `buildSteps` (lines 80-107) to accept and use `skipTimeline`:

```typescript
export function buildSteps(
  selectedServices: string[],
  skipServiceSelection = false,
  skipTimeline = false,
): StepConfig[] {
  const steps: StepConfig[] = [];

  if (!skipServiceSelection) {
    steps.push({ type: "service-selection", label: "Services" });
  }

  steps.push({ type: "contact", label: "Contact" });
  steps.push({ type: "business", label: "Business" });

  for (const serviceId of selectedServices) {
    steps.push({ type: "service-questions", label: SERVICE_LABELS[serviceId] ?? serviceId, serviceId });
  }

  if (skipTimeline) {
    steps.push({ type: "budget-only", label: "Budget" });
  } else {
    steps.push({ type: "timeline-budget", label: "Timeline & Budget" });
  }

  steps.push({ type: "design-brand", label: "Design" });
  steps.push({ type: "final", label: "Final" });

  return steps;
}
```

- [ ] **Step 5: Add "budget-only" to StepType union**

In `types/intake.ts` around line 65, update:

```typescript
export type StepType =
  | "service-selection"
  | "contact"
  | "business"
  | "service-questions"
  | "timeline-budget"
  | "budget-only"
  | "design-brand"
  | "final";
```

- [ ] **Step 6: Update validateCurrentStep in useIntakeForm**

Add a case for `"budget-only"` in the validation switch (around line 132-164):

```typescript
case "budget-only": {
  const result = budgetOnlySchema.safeParse({
    budgetRange: state.formData.budgetRange,
  });
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      fieldErrors[field] = issue.message;
    }
    setState((prev) => ({ ...prev, errors: fieldErrors }));
    return false;
  }
  break;
}
```

- [ ] **Step 7: Add budgetOnlySchema to intake-validation.ts**

Add after `timelineBudgetSchema`:

```typescript
export const budgetOnlySchema = z.object({
  budgetRange: z.string().min(1, "Please select a budget range"),
});
```

Add `budgetOnlySchema` to the import block in `useIntakeForm.ts`:

```typescript
import {
  serviceSelectionSchema,
  contactSchema,
  businessSchema,
  timelineBudgetSchema,
  budgetOnlySchema,  // ADD THIS
  designBrandSchema,
  finalSchema,
  validateServiceStep,
} from "@/lib/intake-validation";
```

- [ ] **Step 8: Add skipTimeline and conciergeService to useIntakeForm return**

Add `skipTimeline` and `conciergeService` to the existing return object (around line 264-275). Add them alongside the existing properties:

```typescript
return {
  // ...all existing return properties (state, steps, totalSteps, etc.)
  skipTimeline,
  conciergeService,
};
```

- [ ] **Step 9: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 10: Commit intake hook changes**

```bash
git add src/hooks/useIntakeForm.ts src/types/intake.ts src/lib/intake-validation.ts
git commit -m "feat: intake form reads concierge params, skips pre-filled steps"
```

---

### Task 12: Update IntakeForm Component

**Files:**
- Modify: `src/components/public-site/IntakeForm.tsx:31-55`

- [ ] **Step 1: Update query param resolution**

The existing query param resolution logic (lines 31-39) already reads the service param and resolves it. Keep this logic as-is — the `useIntakeForm` hook now also reads priority/timeline params internally via `useSearchParams`.

- [ ] **Step 2: Destructure conciergeService from hook**

Add `conciergeService` to the existing destructuring of `useIntakeForm`. Find the destructuring statement and add it alongside the other properties:

```typescript
const {
  state,
  steps,
  totalSteps,
  currentStepConfig,
  updateField,
  updateServiceAnswer,
  nextStep,
  prevStep,
  goToStep,
  submitForm,
  conciergeService,  // ADD THIS
} = useIntakeForm({ preselectedService });
```

- [ ] **Step 3: Add locked service badge above the progress bar**

After the progress component and before the step content, add:

```typescript
{conciergeService && (
  <div className="mb-4 flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2">
    <span className="text-sm font-medium text-white">
      {SERVICE_LABELS[conciergeService] ?? conciergeService}
    </span>
    <a
      href="/"
      className="text-xs text-muted-foreground transition-colors hover:text-white"
    >
      change
    </a>
  </div>
)}
```

Import `SERVICE_LABELS` from `@/types/intake` (exported in Task 11 Step 2).

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Commit IntakeForm changes**

```bash
git add src/components/public-site/IntakeForm.tsx
git commit -m "feat: show locked service badge, skip service selection for concierge users"
```

---

### Task 13: Add BudgetOnly Step to IntakeStep

**Files:**
- Modify: `src/components/public-site/IntakeStep.tsx:575-629,795-855`

- [ ] **Step 1: Add BudgetOnlyStep function**

Add after `TimelineBudgetStep` (around line 630). Use the same inline prop type pattern as other step components (no shared `StepProps` type exists). The `RadioGroup` component only accepts `{ name, options, value, onChange }` — use separate `<Label>` and `<FieldError>` elements, matching the pattern in `TimelineBudgetStep`:

```typescript
function BudgetOnlyStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Budget"
        description="What investment range are you considering?"
      />
      <div>
        <Label>Investment Range *</Label>
        <div className="mt-1.5">
          <RadioGroup
            name="budgetRange"
            options={[
              { value: "1k-5k", label: "$1,000 - $5,000" },
              { value: "5k-15k", label: "$5,000 - $15,000" },
              { value: "15k-30k", label: "$15,000 - $30,000" },
              { value: "30k+", label: "$30,000+" },
              { value: "unsure", label: "Not sure yet" },
            ]}
            value={formData.budgetRange}
            onChange={(val) => onUpdate("budgetRange", val)}
          />
        </div>
        <FieldError error={errors.budgetRange} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update timeline radio option values in TimelineBudgetStep**

Update the timeline radio option values (around line 594-605). Only change the `value` strings and labels — keep the existing `RadioGroup` call structure:

```typescript
// Update these option values in the existing RadioGroup:
{ value: "asap", label: "ASAP — I needed this yesterday" },
{ value: "2-4-weeks", label: "2-4 weeks" },
{ value: "5-6-weeks", label: "5-6 weeks" },
{ value: "flexible", label: "Flexible — quality over speed" },
```

- [ ] **Step 3: Add budget-only case to IntakeStep switch**

In the main `IntakeStep` function's switch statement (around line 802-854), add (no `onUpdateServiceAnswer` — BudgetOnlyStep does not use it):

```typescript
case "budget-only":
  return (
    <BudgetOnlyStep
      formData={formData}
      errors={errors}
      onUpdate={onUpdate}
    />
  );
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Clean compile.

- [ ] **Step 5: Run tests**

Run: `pnpm test --run 2>&1 | tail -20`

Expected: All existing tests pass (229/229).

- [ ] **Step 6: Commit IntakeStep changes**

```bash
git add src/components/public-site/IntakeStep.tsx
git commit -m "feat: add budget-only step, update timeline options to concierge values"
```

---

## Chunk 4: Cleanup and Verification

### Task 14: Clean Up Removed Code

**Files:**
- Modify: `src/lib/concierge-content.ts`

- [ ] **Step 1: Remove payoff data**

Remove the `payoffs` record object, `otherPayoff` object, `payoffSecondary` string, and `ConciergePayoff` interface. These are no longer referenced anywhere.

- [ ] **Step 2: Remove the ConciergeContent interface if no longer needed**

If the `conciergeContent` object has been restructured significantly, update or remove the `ConciergeContent` interface to match the new shape.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: Zero errors.

- [ ] **Step 4: Commit cleanup**

```bash
git add src/lib/concierge-content.ts
git commit -m "refactor: remove payoff data, matching screen content"
```

---

### Task 15: Verify All Icons Render (already handled in Task 7)

**Files:**
- Read: `src/components/public-site/ConciergeOption.tsx`
- Read: `src/components/public-site/ServiceIcon.tsx`

- [ ] **Step 1: Check if ServiceIcon supports the new icon names**

The qualifier screens use icons: `Globe`, `RefreshCw`, `FileText`, `BarChart3`, `Users`, `Target`, `Sparkles`, `Layers`, `ShoppingCart`, `HelpCircle`, `Clock`.

Read `ServiceIcon.tsx` and verify all these icons are handled. If any are missing, add them to the icon map.

- [ ] **Step 2: Update ConciergeIconName type if needed**

If new icons were added, update the `ConciergeIconName` union type in `concierge-content.ts` to include them.

- [ ] **Step 3: Verify TypeScript compiles clean**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit if changes were needed**

```bash
git add src/components/public-site/ServiceIcon.tsx src/lib/concierge-content.ts
git commit -m "feat: add new icons for qualifier screens"
```

---

### Task 16: Full Build and Test Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 2: Run full test suite**

Run: `pnpm test --run`

Expected: All tests pass (may need to update tests that reference old concierge screen names).

- [ ] **Step 3: Run build**

Run: `pnpm build 2>&1 | tail -20`

Expected: Build succeeds with all routes.

- [ ] **Step 4: Manual smoke test**

Start dev server (`pnpm dev`) and verify:
1. Welcome screen loads, click advances to category
2. Pick "A Website" — qualifier shows 3 options (new site, redesign, landing page)
3. Pick "A brand new site" — priority shows 3 options
4. Pick a priority — timeline shows 4 options
5. Pick a timeline — confirmation shows summary, progress bar fills
6. After 4.44s (or tap), navigates to `/intake?service=marketing-website&priority=design&timeline=asap`
7. Intake form shows locked service badge, skips service selection, skips timeline
8. "Something Else" path works (generic priorities, full service selection in form)
9. Back button works on every screen
10. Home button resets concierge

- [ ] **Step 5: Final commit if any test fixes were needed**

```bash
git add -A
git commit -m "fix: update tests for concierge smart routing"
```
