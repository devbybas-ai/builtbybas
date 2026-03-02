"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup, Reorder } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface Specimen {
  id: string;
  title: string;
  technique: string;
  render: (props: { replayKey: number }) => React.ReactNode;
}

function SpecimenCard({
  title,
  technique,
  children,
  onReplay,
}: {
  title: string;
  technique: string;
  children: React.ReactNode;
  onReplay: () => void;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{technique}</p>
        </div>
        <button
          onClick={onReplay}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          aria-label={`Replay ${title}`}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex min-h-[180px] items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

/* === Shared Layout Tabs === */
function SharedTabs({ replayKey }: { replayKey: number }) {
  const tabs = ["Design", "Develop", "Deploy"];
  const [active, setActive] = useState(0);

  return (
    <div key={replayKey} className="w-full max-w-xs">
      <LayoutGroup>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {i === active && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-md bg-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-4"
        >
          <p className="text-xs text-muted-foreground">
            {active === 0 && "Wireframes, prototypes, and visual design systems."}
            {active === 1 && "Clean code, responsive layouts, and smooth interactions."}
            {active === 2 && "Performance testing, CI/CD, and production launch."}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* === Reorder List === */
function ReorderList({ replayKey }: { replayKey: number }) {
  const [items, setItems] = useState(["Research", "Design", "Build", "Test"]);

  return (
    <div key={replayKey} className="w-full max-w-xs">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((item, i) => (
          <Reorder.Item
            key={item}
            value={item}
            className="flex cursor-grab items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm active:cursor-grabbing"
            whileDrag={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,212,255,0.2)" }}
          >
            <span className="text-xs font-bold text-primary">{i + 1}</span>
            <span>{item}</span>
            <svg className="ml-auto h-4 w-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6h8M4 10h8" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <p className="mt-3 text-center text-xs text-muted-foreground">Drag to reorder</p>
    </div>
  );
}

/* === Grid ↔ List Toggle === */
function GridListToggle({ replayKey }: { replayKey: number }) {
  const [isGrid, setIsGrid] = useState(true);
  const items = ["Alpha", "Beta", "Gamma", "Delta"];

  return (
    <div key={replayKey} className="w-full">
      <div className="mb-3 flex justify-center">
        <button
          type="button"
          onClick={() => setIsGrid(!isGrid)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium"
        >
          {isGrid ? "Switch to List" : "Switch to Grid"}
        </button>
      </div>
      <motion.div
        layout
        className={cn(isGrid ? "grid grid-cols-2 gap-2" : "space-y-2")}
      >
        {items.map((item) => (
          <motion.div
            layout
            key={item}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "rounded-lg border border-white/10 bg-white/5 text-xs font-medium",
              isGrid ? "flex h-16 items-center justify-center" : "px-4 py-2.5",
            )}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* === Accordion === */
function AnimatedAccordion({ replayKey }: { replayKey: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { title: "Planning", body: "Define goals, research market, outline strategy." },
    { title: "Execution", body: "Build iteratively, test early, ship often." },
    { title: "Delivery", body: "Launch, monitor metrics, optimize performance." },
  ];

  return (
    <div key={replayKey} className="w-full max-w-xs space-y-1.5">
      {items.map((item, i) => (
        <div key={item.title} className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium"
          >
            {item.title}
            <motion.span
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <p className="px-4 pb-3 text-xs text-muted-foreground">{item.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* === Animated Counter === */
function AnimatedCounter({ replayKey }: { replayKey: number }) {
  const [value, setValue] = useState(0);
  const targets = [0, 1284, 573, 9847];

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <div className="flex items-baseline gap-1 overflow-hidden">
        {String(value).padStart(4, "0").split("").map((digit, i) => (
          <div key={i} className="relative h-12 w-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${i}-${digit}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setValue(targets[(targets.indexOf(value) + 1) % targets.length])}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs"
      >
        Next Value
      </button>
    </div>
  );
}

/* === Flip Card === */
function FlipCard({ replayKey }: { replayKey: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4" style={{ perspective: 800 }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => setFlipped(!flipped)}
        className="relative h-28 w-44 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl border border-primary/20 bg-primary/10"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-sm font-semibold text-primary">Front</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-sm font-semibold text-violet-400">Back</span>
        </div>
      </motion.div>
      <p className="text-xs text-muted-foreground">Click to flip</p>
    </div>
  );
}

/* === MAIN === */
const specimens: Specimen[] = [
  {
    id: "tabs",
    title: "Shared Layout Tabs",
    technique: "layoutId + AnimatePresence",
    render: ({ replayKey }) => <SharedTabs replayKey={replayKey} />,
  },
  {
    id: "reorder",
    title: "Drag Reorder",
    technique: "Reorder.Group + layout",
    render: ({ replayKey }) => <ReorderList replayKey={replayKey} />,
  },
  {
    id: "grid-list",
    title: "Grid ↔ List",
    technique: "layout animation + cn",
    render: ({ replayKey }) => <GridListToggle replayKey={replayKey} />,
  },
  {
    id: "accordion",
    title: "Accordion",
    technique: "height auto + AnimatePresence",
    render: ({ replayKey }) => <AnimatedAccordion replayKey={replayKey} />,
  },
  {
    id: "counter",
    title: "Animated Counter",
    technique: "digit flip + stagger delay",
    render: ({ replayKey }) => <AnimatedCounter replayKey={replayKey} />,
  },
  {
    id: "flip",
    title: "3D Flip Card",
    technique: "rotateY + preserve-3d",
    render: ({ replayKey }) => <FlipCard replayKey={replayKey} />,
  },
];

export function LayoutAnimations() {
  const shouldReduceMotion = useReducedMotion();
  const [replayKeys, setReplayKeys] = useState<Record<string, number>>(() =>
    Object.fromEntries(specimens.map((s) => [s.id, 0])),
  );

  function replay(id: string) {
    setReplayKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  }

  if (shouldReduceMotion) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Animations are simplified because your system has reduced motion enabled.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {specimens.map((spec) => (
            <div key={spec.id} className="glass-card p-6">
              <p className="text-sm font-semibold">{spec.title}</p>
              <p className="text-xs text-muted-foreground">{spec.technique}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {specimens.map((spec) => (
        <SpecimenCard
          key={spec.id}
          title={spec.title}
          technique={spec.technique}
          onReplay={() => replay(spec.id)}
        >
          {spec.render({ replayKey: replayKeys[spec.id] })}
        </SpecimenCard>
      ))}
    </div>
  );
}
