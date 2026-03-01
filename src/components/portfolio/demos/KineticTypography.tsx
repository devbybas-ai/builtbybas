"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TypographySpecimen {
  id: string;
  title: string;
  technique: string;
  text: string;
  render: (props: { text: string; replayKey: number }) => React.ReactNode;
}

function SpecimenRow({
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
      <div className="flex min-h-[100px] items-center justify-center px-6 py-8">
        {children}
      </div>
    </div>
  );
}

/* === Word-by-Word Reveal === */
function WordReveal({ text, replayKey }: { text: string; replayKey: number }) {
  const words = text.split(" ");
  return (
    <motion.p
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="text-2xl font-bold tracking-tight sm:text-3xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* === Character Cascade === */
function CharCascade({ text, replayKey }: { text: string; replayKey: number }) {
  const chars = text.split("");
  return (
    <motion.p
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03 } },
      }}
      className="text-2xl font-bold tracking-tight sm:text-3xl"
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-block"
          style={{ minWidth: char === " " ? "0.3em" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* === Typewriter === */
function Typewriter({ text, replayKey }: { text: string; replayKey: number }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const type = useCallback(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const cleanup = type();
    return cleanup;
  }, [type, replayKey]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <p className="font-mono text-xl font-bold sm:text-2xl">
      {displayed}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
    </p>
  );
}

/* === Gradient Sweep === */
function GradientSweep({ text, replayKey }: { text: string; replayKey: number }) {
  return (
    <motion.p
      key={replayKey}
      initial={{ backgroundPosition: "200% 50%" }}
      animate={{ backgroundPosition: "-100% 50%" }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="text-2xl font-bold tracking-tight sm:text-3xl"
      style={{
        background: "linear-gradient(90deg, #FAFAFA 0%, #00D4FF 30%, #FAFAFA 60%, #FAFAFA 100%)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </motion.p>
  );
}

/* === Split Flip === */
function SplitFlip({ text, replayKey }: { text: string; replayKey: number }) {
  const chars = text.split("");
  return (
    <motion.div
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
      className="flex"
      style={{ perspective: 600 }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={{
            hidden: { opacity: 0, rotateX: -90 },
            visible: { opacity: 1, rotateX: 0 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block text-2xl font-bold sm:text-3xl"
          style={{
            transformOrigin: "bottom center",
            minWidth: char === " " ? "0.3em" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* === Wave Motion === */
function WaveMotion({ text, replayKey }: { text: string; replayKey: number }) {
  const chars = text.split("");
  return (
    <motion.div
      key={replayKey}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
      className="flex"
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={{
            hidden: { y: 0, opacity: 0.3 },
            visible: {
              y: [0, -15, 0],
              opacity: [0.3, 1, 1],
            },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block text-2xl font-bold sm:text-3xl"
          style={{ minWidth: char === " " ? "0.3em" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* === Blur In === */
function BlurIn({ text, replayKey }: { text: string; replayKey: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={replayKey}
        initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-2xl font-bold tracking-tight sm:text-3xl"
      >
        {text}
      </motion.p>
    </AnimatePresence>
  );
}

/* === MAIN COMPONENT === */
const specimens: TypographySpecimen[] = [
  {
    id: "word-reveal",
    title: "Word Reveal",
    technique: "stagger + spring + blur",
    text: "Built Different by Design",
    render: (props) => <WordReveal {...props} />,
  },
  {
    id: "char-cascade",
    title: "Character Cascade",
    technique: "per-character stagger + spring",
    text: "Every Detail Matters",
    render: (props) => <CharCascade {...props} />,
  },
  {
    id: "typewriter",
    title: "Typewriter",
    technique: "interval + cursor blink",
    text: "Code with intention.",
    render: (props) => <Typewriter {...props} />,
  },
  {
    id: "gradient-sweep",
    title: "Gradient Sweep",
    technique: "animated background-position",
    text: "Light in Motion",
    render: (props) => <GradientSweep {...props} />,
  },
  {
    id: "split-flip",
    title: "Split Flip",
    technique: "rotateX + transform-origin",
    text: "Flip Into View",
    render: (props) => <SplitFlip {...props} />,
  },
  {
    id: "wave",
    title: "Wave Motion",
    technique: "keyframe y-offset stagger",
    text: "Ride the Wave",
    render: (props) => <WaveMotion {...props} />,
  },
  {
    id: "blur-in",
    title: "Blur In",
    technique: "filter blur + scale + ease",
    text: "Focus Revealed",
    render: (props) => <BlurIn {...props} />,
  },
];

export function KineticTypography() {
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
        <div className="space-y-4">
          {specimens.map((spec) => (
            <div key={spec.id} className="glass-card p-6">
              <p className="text-sm font-semibold">{spec.title}</p>
              <p className="mt-2 text-2xl font-bold">{spec.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">{spec.technique}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {specimens.map((spec) => (
        <SpecimenRow
          key={spec.id}
          title={spec.title}
          technique={spec.technique}
          onReplay={() => replay(spec.id)}
        >
          {spec.render({ text: spec.text, replayKey: replayKeys[spec.id] })}
        </SpecimenRow>
      ))}
    </div>
  );
}
