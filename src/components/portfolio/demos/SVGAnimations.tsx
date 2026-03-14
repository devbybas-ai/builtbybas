"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
      <div className="flex min-h-[200px] items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

/* === Logo Draw === */
function LogoDraw({ replayKey }: { replayKey: number }) {
  return (
    <svg key={replayKey} viewBox="0 0 120 60" className="h-24 w-48" fill="none">
      {/* B */}
      <motion.path
        d="M10 10 L10 50 L30 50 Q45 50 45 40 Q45 30 30 30 L10 30 M10 30 L28 30 Q40 30 40 20 Q40 10 28 10 L10 10"
        stroke="#00D4FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* B */}
      <motion.path
        d="M55 10 L55 50 L75 50 Q90 50 90 40 Q90 30 75 30 L55 30 M55 30 L73 30 Q85 30 85 20 Q85 10 73 10 L55 10"
        stroke="#0EA5E9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Fill after draw */}
      <motion.path
        d="M10 10 L10 50 L30 50 Q45 50 45 40 Q45 30 30 30 L10 30 M10 30 L28 30 Q40 30 40 20 Q40 10 28 10 L10 10"
        fill="#00D4FF"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      />
      <motion.path
        d="M55 10 L55 50 L75 50 Q90 50 90 40 Q90 30 75 30 L55 30 M55 30 L73 30 Q85 30 85 20 Q85 10 73 10 L55 10"
        fill="#0EA5E9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 2, duration: 0.5 }}
      />
    </svg>
  );
}

/* === Icon Morph === */
function IconMorph({ replayKey }: { replayKey: number }) {
  const [shape, setShape] = useState(0);
  const paths = [
    "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z", // star
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", // heart
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", // hexagon
    "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z", // circle
  ];
  const colors = ["#00D4FF", "#EF4444", "#8B5CF6", "#10B981"];

  return (
    <div key={replayKey} className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setShape((s) => (s + 1) % paths.length)}
        aria-label="Morph icon"
      >
        <svg viewBox="0 0 24 24" className="h-20 w-20">
          <motion.path
            d={paths[shape]}
            fill={colors[shape]}
            animate={{ d: paths[shape], fill: colors[shape] }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            fillOpacity={0.2}
            stroke={colors[shape]}
            strokeWidth={1.5}
          />
        </svg>
      </button>
      <p className="text-xs text-muted-foreground">Click to morph</p>
    </div>
  );
}

/* === Animated Checkmark === */
function DrawCheckmark({ replayKey }: { replayKey: number }) {
  return (
    <svg key={replayKey} viewBox="0 0 100 100" className="h-24 w-24">
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#10B981"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <motion.path
        d="M30 50 L45 65 L70 35"
        fill="none"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="#10B981"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
    </svg>
  );
}

/* === Wavy Line === */
function WavyLine({ replayKey }: { replayKey: number }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPhase((p) => p + 1), 2000);
    return () => clearInterval(interval);
  }, [replayKey]);

  const generateWave = useCallback((offset: number) => {
    const points: string[] = [];
    for (let x = 0; x <= 200; x += 2) {
      const y = 30 + Math.sin((x / 20) + offset) * 15;
      points.push(`${x},${y}`);
    }
    return `M${points.join(" L")}`;
  }, []);

  return (
    <svg key={replayKey} viewBox="0 0 200 60" className="h-16 w-full max-w-xs">
      <motion.path
        d={generateWave(phase)}
        fill="none"
        stroke="url(#wave-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d={generateWave(phase + 2)}
        fill="none"
        stroke="url(#wave-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
      <defs>
        <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* === Circular Loader === */
function CircularLoader({ replayKey }: { replayKey: number }) {
  return (
    <div key={replayKey} className="flex items-center gap-8">
      {/* Segmented spinner */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 50 50" className="h-12 w-12">
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="15 80"
              strokeDashoffset={i * -25}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
              style={{ transformOrigin: "center" }}
              opacity={1 - i * 0.2}
            />
          ))}
        </svg>
        <span className="text-[10px] text-muted-foreground">Segments</span>
      </div>

      {/* Orbit */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 50 50" className="h-12 w-12">
          <circle cx="25" cy="25" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
          <motion.circle
            cx="25"
            cy="7"
            r="3"
            fill="#8B5CF6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "25px 25px" }}
          />
        </svg>
        <span className="text-[10px] text-muted-foreground">Orbit</span>
      </div>

      {/* Morphing ring */}
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 50 50" className="h-12 w-12">
          <motion.circle
            cx="25"
            cy="25"
            r="18"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="113"
            animate={{ strokeDashoffset: [113, 0, 113], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
        <span className="text-[10px] text-muted-foreground">Morph</span>
      </div>
    </div>
  );
}

/* === Handwriting === */
function Handwriting({ replayKey }: { replayKey: number }) {
  const letters = [
    { d: "M5 35 Q5 5 15 5 Q25 5 15 25 Q10 35 20 35", delay: 0 },
    { d: "M22 15 Q22 35 30 35 Q38 35 38 25 Q38 15 30 15 Q22 15 22 15", delay: 0.3 },
    { d: "M42 5 L42 35 M42 25 Q42 15 50 15 Q58 15 58 25 L58 35", delay: 0.6 },
    { d: "M62 25 Q62 15 70 15 Q78 15 78 25 Q78 35 70 35 Q62 35 62 25", delay: 0.9 },
  ];

  return (
    <svg key={replayKey} viewBox="0 0 85 40" className="h-16 w-48">
      {letters.map((letter, i) => (
        <motion.path
          key={i}
          d={letter.d}
          fill="none"
          stroke="#00D4FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: letter.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* === Animated Bars Chart === */
function AnimatedBars({ replayKey }: { replayKey: number }) {
  const [data, setData] = useState([65, 40, 85, 55, 70, 90]);

  function randomize() {
    setData(Array.from({ length: 6 }, () => 20 + Math.floor(Math.random() * 80)));
  }

  const colors = ["#00D4FF", "#0EA5E9", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];
  const maxH = 80;

  return (
    <div key={replayKey} className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 140 90" className="h-24 w-full max-w-[200px]">
        {data.map((val, i) => (
          <motion.rect
            key={i}
            x={5 + i * 23}
            width="18"
            rx="3"
            fill={colors[i]}
            fillOpacity={0.7}
            initial={{ height: 0, y: maxH }}
            animate={{ height: (val / 100) * maxH, y: maxH - (val / 100) * maxH }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.08 }}
          />
        ))}
      </svg>
      <button
        type="button"
        onClick={randomize}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs"
      >
        Randomize
      </button>
    </div>
  );
}

/* === MAIN === */
const specimens: Specimen[] = [
  {
    id: "logo-draw",
    title: "Logo Path Draw",
    technique: "pathLength + stroke animation",
    render: ({ replayKey }) => <LogoDraw replayKey={replayKey} />,
  },
  {
    id: "icon-morph",
    title: "Icon Morph",
    technique: "animated d path + fill",
    render: ({ replayKey }) => <IconMorph replayKey={replayKey} />,
  },
  {
    id: "checkmark",
    title: "Draw Checkmark",
    technique: "pathLength sequence",
    render: ({ replayKey }) => <DrawCheckmark replayKey={replayKey} />,
  },
  {
    id: "wavy",
    title: "Generative Waves",
    technique: "Math.sin + pathLength",
    render: ({ replayKey }) => <WavyLine replayKey={replayKey} />,
  },
  {
    id: "loaders",
    title: "SVG Spinners",
    technique: "dasharray + rotate",
    render: ({ replayKey }) => <CircularLoader replayKey={replayKey} />,
  },
  {
    id: "handwriting",
    title: "Handwriting Effect",
    technique: "staggered pathLength",
    render: ({ replayKey }) => <Handwriting replayKey={replayKey} />,
  },
  {
    id: "bars",
    title: "Animated Bar Chart",
    technique: "spring height + stagger",
    render: ({ replayKey }) => <AnimatedBars replayKey={replayKey} />,
  },
];

export function SVGAnimations() {
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
