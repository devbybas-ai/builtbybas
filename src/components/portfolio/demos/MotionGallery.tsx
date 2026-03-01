"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface Specimen {
  id: string;
  title: string;
  technique: string;
  render: (props: { onReplay: () => void; key: number }) => React.ReactNode;
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

/* === SPECIMEN: Spring Physics === */
function SpringBall({ replayKey }: { replayKey: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 15 });
  const springY = useSpring(y, { stiffness: 300, damping: 15 });
  const scale = useTransform(
    [springX, springY],
    ([latestX, latestY]: number[]) => {
      const dist = Math.sqrt(latestX * latestX + latestY * latestY);
      return 1 + dist * 0.001;
    },
  );

  return (
    <div className="relative h-32 w-full" key={replayKey}>
      <motion.div
        drag
        dragConstraints={{ top: -50, bottom: 50, left: -100, right: 100 }}
        dragElastic={0.2}
        style={{ x: springX, y: springY, scale }}
        className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 cursor-grab rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_20px_rgba(0,212,255,0.4)] active:cursor-grabbing"
        whileTap={{ scale: 1.2 }}
        aria-label="Draggable spring ball"
        role="slider"
        tabIndex={0}
      />
      <p className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground">
        Drag me
      </p>
    </div>
  );
}

/* === SPECIMEN: Stagger Reveal === */
function StaggerReveal({ replayKey }: { replayKey: number }) {
  const items = ["Design", "Develop", "Deploy", "Deliver"];

  return (
    <motion.div
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className="flex gap-3"
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.8 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* === SPECIMEN: Morphing Shape === */
function MorphShape({ replayKey }: { replayKey: number }) {
  const [shape, setShape] = useState(0);
  const shapes = [
    { borderRadius: "50%", rotate: 0, background: "linear-gradient(135deg, #00D4FF, #0EA5E9)" },
    { borderRadius: "12%", rotate: 45, background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" },
    { borderRadius: "50% 0% 50% 0%", rotate: 90, background: "linear-gradient(135deg, #F59E0B, #D97706)" },
    { borderRadius: "20%", rotate: 180, background: "linear-gradient(135deg, #10B981, #059669)" },
  ];

  return (
    <div className="flex flex-col items-center gap-4" key={replayKey}>
      <motion.div
        animate={shapes[shape]}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="h-20 w-20 cursor-pointer"
        onClick={() => setShape((s) => (s + 1) % shapes.length)}
        aria-label="Click to morph shape"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShape((s) => (s + 1) % shapes.length);
        }}
      />
      <p className="text-xs text-muted-foreground">Click to morph</p>
    </div>
  );
}

/* === SPECIMEN: Hover 3D Tilt === */
function Tilt3D({ replayKey }: { replayKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glow = useMotionValue("0 0 0px rgba(0,212,255,0)");

  function handleMouse(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    rotateY.set(cx / 8);
    rotateX.set(-cy / 8);
    glow.set(`0 0 30px rgba(0,212,255,${Math.min(0.4, (Math.abs(cx) + Math.abs(cy)) / 200)})`);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glow.set("0 0 0px rgba(0,212,255,0)");
  }

  return (
    <motion.div
      key={replayKey}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, boxShadow: glow, transformPerspective: 600 }}
      className="flex h-28 w-44 items-center justify-center rounded-xl border border-white/10 bg-white/5"
    >
      <span className="text-sm font-medium text-muted-foreground">Hover me</span>
    </motion.div>
  );
}

/* === SPECIMEN: Loading Patterns === */
function LoadingPatterns({ replayKey }: { replayKey: number }) {
  return (
    <div key={replayKey} className="flex items-center gap-8">
      {/* Pulse */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 w-10 rounded-lg bg-primary/30"
        />
        <span className="text-[10px] text-muted-foreground">Pulse</span>
      </div>
      {/* Dots */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="h-2.5 w-2.5 rounded-full bg-primary"
            />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">Bounce</span>
      </div>
      {/* Spinner */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <span className="text-[10px] text-muted-foreground">Spin</span>
      </div>
      {/* Skeleton */}
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-3 w-20 rounded"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <span className="text-[10px] text-muted-foreground">Skeleton</span>
      </div>
    </div>
  );
}

/* === SPECIMEN: Gesture Swipe === */
function GestureSwipe({ replayKey }: { replayKey: number }) {
  const [cards, setCards] = useState(["Card 3", "Card 2", "Card 1"]);

  function removeTop() {
    setCards((c) => {
      if (c.length <= 1) return ["Card 3", "Card 2", "Card 1"];
      return c.slice(0, -1);
    });
  }

  return (
    <div key={replayKey} className="relative h-28 w-40">
      <AnimatePresence>
        {cards.map((card, i) => (
          <motion.div
            key={card}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 80) removeTop();
            }}
            initial={{ scale: 1 - (cards.length - 1 - i) * 0.05, y: (cards.length - 1 - i) * 4 }}
            animate={{ scale: 1 - (cards.length - 1 - i) * 0.05, y: (cards.length - 1 - i) * 4 }}
            exit={{ x: 200, opacity: 0, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "absolute inset-0 flex cursor-grab items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-medium active:cursor-grabbing",
              i === cards.length - 1 && "border-primary/20 bg-primary/5",
            )}
            style={{ zIndex: i }}
          >
            {card}
          </motion.div>
        ))}
      </AnimatePresence>
      <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-muted-foreground">
        Swipe cards
      </p>
    </div>
  );
}

/* === SPECIMEN: Scale Entrance === */
function ScaleEntrance({ replayKey }: { replayKey: number }) {
  const items = [1, 2, 3, 4, 5, 6];
  return (
    <motion.div
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="grid grid-cols-3 gap-2"
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-xs font-bold text-foreground"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* === SPECIMEN: Hover Glow Button === */
function GlowButton({ replayKey }: { replayKey: number }) {
  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(0,212,255,0.4), 0 0 50px rgba(0,212,255,0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        type="button"
      >
        Hover & Click
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05, borderColor: "rgba(0,212,255,0.5)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold"
        type="button"
      >
        Ghost Button
      </motion.button>
    </div>
  );
}

/* === MAIN GALLERY === */
const specimens: Specimen[] = [
  {
    id: "spring",
    title: "Spring Physics",
    technique: "useSpring + drag constraints",
    render: ({ key }) => <SpringBall replayKey={key} />,
  },
  {
    id: "stagger",
    title: "Stagger Reveal",
    technique: "staggerChildren + spring",
    render: ({ key }) => <StaggerReveal replayKey={key} />,
  },
  {
    id: "morph",
    title: "Morphing Shapes",
    technique: "animate + spring transition",
    render: ({ key }) => <MorphShape replayKey={key} />,
  },
  {
    id: "tilt",
    title: "3D Tilt Card",
    technique: "useMotionValue + perspective",
    render: ({ key }) => <Tilt3D replayKey={key} />,
  },
  {
    id: "loading",
    title: "Loading Patterns",
    technique: "keyframe animations",
    render: ({ key }) => <LoadingPatterns replayKey={key} />,
  },
  {
    id: "swipe",
    title: "Gesture Cards",
    technique: "drag + AnimatePresence",
    render: ({ key }) => <GestureSwipe replayKey={key} />,
  },
  {
    id: "scale",
    title: "Scale Entrance",
    technique: "stagger + scale variants",
    render: ({ key }) => <ScaleEntrance replayKey={key} />,
  },
  {
    id: "glow",
    title: "Hover Effects",
    technique: "whileHover + boxShadow",
    render: ({ key }) => <GlowButton replayKey={key} />,
  },
];

export function MotionGallery() {
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
          {spec.render({ onReplay: () => replay(spec.id), key: replayKeys[spec.id] })}
        </SpecimenCard>
      ))}
    </div>
  );
}
