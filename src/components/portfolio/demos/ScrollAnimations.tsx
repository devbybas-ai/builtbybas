"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  tall,
}: {
  title: string;
  technique: string;
  children: React.ReactNode;
  onReplay: () => void;
  tall?: boolean;
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
      <div className={tall ? "p-0" : "flex min-h-[200px] items-center justify-center p-6"}>
        {children}
      </div>
    </div>
  );
}

/* === Parallax Layers === */
function ParallaxLayers({ replayKey }: { replayKey: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div
      key={replayKey}
      ref={containerRef}
      className="relative h-64 w-full overflow-y-auto rounded-b-xl"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="relative h-[500px] w-full overflow-hidden">
        {/* Background layer */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-x-0 top-8 flex justify-center"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/10" />
        </motion.div>

        {/* Mid layer */}
        <motion.div
          style={{ y: y2 }}
          className="absolute inset-x-0 top-24 flex justify-center gap-6"
        >
          <div className="h-10 w-24 rounded-lg bg-violet-500/15" />
          <div className="h-10 w-24 rounded-lg bg-violet-500/15" />
        </motion.div>

        {/* Foreground layer */}
        <motion.div
          style={{ y: y3 }}
          className="absolute inset-x-0 top-48 flex justify-center gap-3"
        >
          <div className="h-8 w-16 rounded-md bg-primary/20" />
          <div className="h-8 w-16 rounded-md bg-primary/20" />
          <div className="h-8 w-16 rounded-md bg-primary/20" />
        </motion.div>

        {/* Content */}
        <div className="absolute inset-x-0 top-72 px-6 text-center">
          <p className="text-xs text-muted-foreground">
            Keep scrolling to see parallax layers move at different speeds
          </p>
          <div className="mt-8 space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-lg bg-white/[0.03] border border-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Scroll Progress Bar === */
function ScrollProgress({ replayKey }: { replayKey: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <div key={replayKey} className="w-full">
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-1 w-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
      />
      <div
        ref={containerRef}
        className="mt-2 h-52 overflow-y-auto rounded-lg"
      >
        <div className="space-y-4 p-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs font-medium">Section {i + 1}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scroll to see the progress bar fill up.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* === Reveal On Scroll === */
function RevealOnScroll({ replayKey }: { replayKey: number }) {
  return (
    <div
      key={replayKey}
      className="h-64 w-full overflow-y-auto rounded-b-xl"
    >
      <div className="space-y-4 p-4">
        <p className="text-center text-xs text-muted-foreground">
          Scroll down to reveal items
        </p>
        {Array.from({ length: 6 }, (_, i) => (
          <RevealItem key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

function RevealItem({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20px" });
  const colors = ["from-cyan-500/20", "from-violet-500/20", "from-emerald-500/20", "from-amber-500/20", "from-rose-500/20", "from-blue-500/20"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`rounded-lg bg-gradient-to-r ${colors[index]} to-transparent p-4 border border-white/5`}
    >
      <p className="text-xs font-medium">Item {index + 1}</p>
      <p className="text-xs text-muted-foreground">Revealed on scroll</p>
    </motion.div>
  );
}

/* === Number Counter === */
function ScrollCounter({ replayKey }: { replayKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const stats = [
    { label: "Projects", target: 15 },
    { label: "Clients", target: 8 },
    { label: "Lines of Code", target: 47000 },
  ];

  return (
    <div
      key={replayKey}
      ref={ref}
      className="grid w-full grid-cols-3 gap-4"
    >
      {stats.map((stat) => (
        <CounterBox key={stat.label} label={stat.label} target={stat.target} active={isInView} />
      ))}
    </div>
  );
}

function CounterBox({ label, target, active }: { label: string; target: number; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const formatted = target >= 1000 ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}k` : String(count);

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-primary">{formatted}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* === Sticky Scroll Section === */
function StickyScroll({ replayKey }: { replayKey: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const steps = ["Plan", "Design", "Build", "Ship"];
  const activeStep = useTransform(scrollYProgress, [0, 1], [0, steps.length - 1]);
  const [current, setCurrent] = useState(0);

  activeStep.on("change", (v) => setCurrent(Math.round(v)));

  return (
    <div
      key={replayKey}
      ref={containerRef}
      className="h-64 w-full overflow-y-auto rounded-b-xl"
    >
      <div className="flex min-h-[600px]">
        {/* Sticky sidebar */}
        <div className="sticky top-0 flex h-64 w-20 shrink-0 flex-col items-center justify-center gap-3 border-r border-white/5 bg-background/80 backdrop-blur-sm">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: i === current ? 1.2 : 0.8,
                  backgroundColor: i === current ? "#00D4FF" : "rgba(255,255,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-3 w-3 rounded-full"
              />
              <span className={`text-[9px] ${i === current ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-0 p-4">
          {steps.map((step, i) => (
            <div key={step} className="flex min-h-[150px] items-center">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <p className="text-sm font-semibold">{step}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Phase {i + 1} of the development process. Scroll to advance.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* === MAIN === */
const specimens: Specimen[] = [
  {
    id: "parallax",
    title: "Parallax Layers",
    technique: "useScroll + useTransform",
    render: ({ replayKey }) => <ParallaxLayers replayKey={replayKey} />,
  },
  {
    id: "progress",
    title: "Scroll Progress",
    technique: "scrollYProgress + scaleX",
    render: ({ replayKey }) => <ScrollProgress replayKey={replayKey} />,
  },
  {
    id: "reveal",
    title: "Scroll Reveal",
    technique: "useInView + spring",
    render: ({ replayKey }) => <RevealOnScroll replayKey={replayKey} />,
  },
  {
    id: "counter",
    title: "Number Counter",
    technique: "useInView + interval",
    render: ({ replayKey }) => <ScrollCounter replayKey={replayKey} />,
  },
  {
    id: "sticky",
    title: "Sticky Navigation",
    technique: "sticky + scrollYProgress",
    render: ({ replayKey }) => <StickyScroll replayKey={replayKey} />,
  },
];

export function ScrollAnimations() {
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
      {specimens.map((spec) => {
        const isTall = ["parallax", "reveal", "sticky"].includes(spec.id);
        return (
          <SpecimenCard
            key={spec.id}
            title={spec.title}
            technique={spec.technique}
            onReplay={() => replay(spec.id)}
            tall={isTall}
          >
            {spec.render({ replayKey: replayKeys[spec.id] })}
          </SpecimenCard>
        );
      })}
    </div>
  );
}
