"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* === Toggle Switch === */
function ToggleSwitch({ replayKey }: { replayKey: number }) {
  const [on, setOn] = useState(false);
  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={cn(
          "relative h-8 w-14 rounded-full transition-colors duration-300",
          on ? "bg-primary" : "bg-white/10",
        )}
        aria-label="Toggle switch"
        role="switch"
        aria-checked={on}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
          style={{ left: on ? "calc(100% - 28px)" : "4px" }}
        />
      </button>
      <p className="text-xs text-muted-foreground">{on ? "On" : "Off"}</p>
    </div>
  );
}

/* === Success Checkmark === */
function SuccessCheck({ replayKey }: { replayKey: number }) {
  const [checked, setChecked] = useState(false);

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setChecked(!checked)}
        className="relative"
        aria-label="Trigger success animation"
      >
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={3}>
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/10"
            >
              <span className="text-xs text-muted-foreground">Click</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <p className="text-xs text-muted-foreground">
        {checked ? "Success!" : "Tap to complete"}
      </p>
    </div>
  );
}

/* === Like Button === */
function LikeButton({ replayKey }: { replayKey: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);

  return (
    <div key={replayKey} className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => {
          setLiked(!liked);
          setCount((c) => (liked ? c - 1 : c + 1));
        }}
        className="relative"
        aria-label={liked ? "Unlike" : "Like"}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-10 w-10"
          whileTap={{ scale: 0.8 }}
        >
          <motion.path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill={liked ? "#EF4444" : "transparent"}
            stroke={liked ? "#EF4444" : "rgba(255,255,255,0.3)"}
            strokeWidth={2}
            animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.svg>
        {liked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-red-400"
          />
        )}
      </button>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: liked ? 10 : -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: liked ? -10 : 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium text-muted-foreground"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* === Notification Bell === */
function NotificationBell({ replayKey }: { replayKey: number }) {
  const [count, setCount] = useState(0);

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="relative p-2"
        aria-label="Notification bell"
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          animate={count > 0 ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.6 }}
          key={count}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </motion.svg>
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <p className="text-xs text-muted-foreground">Click to notify</p>
    </div>
  );
}

/* === Progress Ring === */
function ProgressRing({ replayKey }: { replayKey: number }) {
  const [progress, setProgress] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 25))}
        className="relative"
        aria-label={`Progress: ${progress}%`}
      >
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={progress}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-sm font-bold"
            >
              {progress}%
            </motion.span>
          </AnimatePresence>
        </div>
      </button>
      <p className="text-xs text-muted-foreground">Click to increment</p>
    </div>
  );
}

/* === Expandable Card === */
function ExpandableCard({ replayKey }: { replayKey: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div key={replayKey} className="w-full max-w-xs">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div layout className="p-4">
          <motion.p layout className="text-sm font-semibold">Project Update</motion.p>
          <motion.p layout className="mt-1 text-xs text-muted-foreground">3 minutes ago</motion.p>
        </motion.div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/5 px-4 pb-4 pt-3"
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                The design phase is complete. Moving to development next week
                with a focus on responsive layouts and animation polish.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* === Ripple Button === */
function RippleButton({ replayKey }: { replayKey: number }) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        className="relative overflow-hidden rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
      >
        Click Me
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.5, x: ripple.x, y: ripple.y }}
            animate={{ width: 200, height: 200, opacity: 0, x: ripple.x - 100, y: ripple.y - 100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none absolute rounded-full bg-white/30"
          />
        ))}
      </button>
      <p className="text-xs text-muted-foreground">Material ripple effect</p>
    </div>
  );
}

/* === Magnetic Hover === */
function MagneticButton({ replayKey }: { replayKey: number }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  }

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <div
        onMouseMove={handleMouse}
        onMouseLeave={() => setPosition({ x: 0, y: 0 })}
        className="p-8"
      >
        <motion.button
          type="button"
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary"
        >
          Hover Near Me
        </motion.button>
      </div>
      <p className="text-xs text-muted-foreground">Magnetic attraction</p>
    </div>
  );
}

/* === MAIN === */
const specimens: Specimen[] = [
  {
    id: "toggle",
    title: "Toggle Switch",
    technique: "layout animation + spring",
    render: ({ replayKey }) => <ToggleSwitch replayKey={replayKey} />,
  },
  {
    id: "checkmark",
    title: "Success Checkmark",
    technique: "SVG pathLength + scale",
    render: ({ replayKey }) => <SuccessCheck replayKey={replayKey} />,
  },
  {
    id: "like",
    title: "Like Button",
    technique: "scale burst + counter flip",
    render: ({ replayKey }) => <LikeButton replayKey={replayKey} />,
  },
  {
    id: "bell",
    title: "Notification Bell",
    technique: "rotate keyframes + badge",
    render: ({ replayKey }) => <NotificationBell replayKey={replayKey} />,
  },
  {
    id: "progress",
    title: "Progress Ring",
    technique: "SVG dashoffset + spring",
    render: ({ replayKey }) => <ProgressRing replayKey={replayKey} />,
  },
  {
    id: "expand",
    title: "Expandable Card",
    technique: "layout + AnimatePresence",
    render: ({ replayKey }) => <ExpandableCard replayKey={replayKey} />,
  },
  {
    id: "ripple",
    title: "Ripple Effect",
    technique: "absolute position + scale",
    render: ({ replayKey }) => <RippleButton replayKey={replayKey} />,
  },
  {
    id: "magnetic",
    title: "Magnetic Hover",
    technique: "mouse tracking + spring",
    render: ({ replayKey }) => <MagneticButton replayKey={replayKey} />,
  },
];

export function MicroInteractions() {
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
