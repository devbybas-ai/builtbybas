"use client";

import { useEffect, useRef } from "react";

// Chip locations + PCB trace paths from hub (500,300) — routed with right-angle segments, no crossings
// side: which side of the board the chip is on (for opposite-side targeting)
// p1 arrives from left → fire to "right" chips
// p2 arrives from top  → fire to "bottom" chips
// p3 arrives from right → fire to "left" chips
const chipTargets = [
  // Left side
  { x: 230, y: 90, w: 12, h: 6, peak: 0.35, side: "left" as const, trace: "M500,300 L460,300 L460,93 L236,93" },
  { x: 140, y: 365, w: 12, h: 6, peak: 0.35, side: "left" as const, trace: "M500,300 L300,300 L300,368 L146,368" },
  { x: 70, y: 250, w: 30, h: 45, peak: 0.15, side: "left" as const, trace: "M500,300 L350,300 L350,272 L85,272" },
  { x: 195, y: 500, w: 45, h: 35, peak: 0.15, side: "left" as const, trace: "M500,300 L400,300 L400,480 L217,480 L217,517" },
  // Right side
  { x: 810, y: 310, w: 12, h: 6, peak: 0.35, side: "right" as const, trace: "M500,300 L700,300 L700,313 L816,313" },
  { x: 620, y: 240, w: 12, h: 6, peak: 0.35, side: "right" as const, trace: "M500,300 L580,300 L580,243 L626,243" },
  { x: 860, y: 230, w: 30, h: 50, peak: 0.15, side: "right" as const, trace: "M500,300 L740,300 L740,255 L875,255" },
  { x: 870, y: 360, w: 35, h: 40, peak: 0.15, side: "right" as const, trace: "M500,300 L760,300 L760,380 L887,380" },
  // Top side
  { x: 560, y: 65, w: 12, h: 6, peak: 0.35, side: "top" as const, trace: "M500,300 L520,300 L520,68 L566,68" },
  { x: 530, y: 130, w: 40, h: 30, peak: 0.15, side: "top" as const, trace: "M500,300 L550,300 L550,145" },
  // Bottom side
  { x: 460, y: 550, w: 12, h: 6, peak: 0.35, side: "bottom" as const, trace: "M500,300 L500,450 L466,450 L466,553" },
  { x: 430, y: 440, w: 40, h: 30, peak: 0.15, side: "bottom" as const, trace: "M500,300 L450,300 L450,455" },
];

// Particle → opposite side mapping
const particleOpposite: Record<string, string> = {
  p1: "right",  // p1 comes from left
  p2: "bottom", // p2 comes from top
  p3: "left",   // p3 comes from right
};

function useChipActivity(
  pathsRef: React.RefObject<SVGGElement | null>,
  rectsRef: React.RefObject<SVGGElement | null>,
  hubOuterRef: React.RefObject<SVGCircleElement | null>,
  hubInnerRef: React.RefObject<SVGCircleElement | null>,
) {
  useEffect(() => {
    const pg = pathsRef.current;
    const rg = rectsRef.current;
    const hubOuter = hubOuterRef.current;
    const hubInner = hubInnerRef.current;
    if (!pg || !rg || !hubOuter || !hubInner) return;
    const svg = pg.closest("svg");
    if (!svg) return;

    const rects = rg.querySelectorAll<SVGRectElement>("rect");
    const paths = pg.querySelectorAll<SVGPathElement>("path");
    if (!rects.length || !paths.length) return;

    // Measure each trace path length and set up hidden dasharray
    const lengths: number[] = [];
    paths.forEach((path, idx) => {
      const len = path.getTotalLength();
      lengths[idx] = len;
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    });

    // Only one trace active at a time — ignore extra endEvents
    let lastIdx = -1;
    let busy = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const fireTrace = (targetSide: string) => {
      if (busy) return;
      busy = true;
      // Pick a random chip on the opposite side
      const candidates = chipTargets
        .map((c, idx) => ({ ...c, idx }))
        .filter((c) => c.side === targetSide && c.idx !== lastIdx);
      if (!candidates.length) return;

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      lastIdx = pick.idx;

      const rect = rects[pick.idx];
      const path = paths[pick.idx];
      const peak = pick.peak;
      const len = lengths[pick.idx];

      // Progress-bar fill: trace lights up from hub toward chip over 2s
      const fillAnim = path.animate(
        [
          { strokeDashoffset: len, stroke: "rgba(0, 212, 255, 0.35)" },
          { strokeDashoffset: 0, stroke: "rgba(0, 212, 255, 0.35)" },
        ],
        { duration: 2000, easing: "ease-in-out", fill: "forwards" }
      );

      fillAnim.onfinish = () => {
        // Chip lights up once trace reaches it
        rect.animate(
          [
            { fill: `rgba(0, 212, 255, 0)`, offset: 0 },
            { fill: `rgba(0, 212, 255, ${peak})`, offset: 0.05 },
            { fill: `rgba(0, 212, 255, ${peak})`, offset: 0.6 },
            { fill: `rgba(0, 212, 255, 0)`, offset: 1 },
          ],
          { duration: 3330, easing: "linear" }
        );

        // Fade trace back to dim after chip is lit
        const fadeAnim = path.animate(
          [
            { strokeDashoffset: 0, stroke: "rgba(0, 212, 255, 0.35)" },
            { strokeDashoffset: 0, stroke: "rgba(0, 212, 255, 0.06)" },
          ],
          { duration: 2000, delay: 800, easing: "ease-out", fill: "forwards" }
        );
        fadeAnim.onfinish = () => {
          path.style.strokeDashoffset = String(len);
          busy = false;
        };
      };
    };

    // Listen for SMIL particle arrivals at the center hub — fire trace immediately
    const particles = svg.querySelectorAll<SVGAnimateMotionElement>("animateMotion[id^='p']");
    const handler = (e: Event) => {
      const id = (e.target as SVGAnimateMotionElement).id;
      const targetSide = particleOpposite[id];
      if (!targetSide) return;
      fireTrace(targetSide);
    };
    particles.forEach((p) => p.addEventListener("endEvent", handler));

    return () => {
      particles.forEach((p) => p.removeEventListener("endEvent", handler));
      timeouts.forEach(clearTimeout);
    };
  }, [pathsRef, rectsRef, hubOuterRef, hubInnerRef]);
}

export function HeroBackground() {
  const chipPathsRef = useRef<SVGGElement>(null);
  const chipRectsRef = useRef<SVGGElement>(null);
  const hubOuterRef = useRef<SVGCircleElement>(null);
  const hubInnerRef = useRef<SVGCircleElement>(null);
  useChipActivity(chipPathsRef, chipRectsRef, hubOuterRef, hubInnerRef);

  return (
    <div
      className="pointer-events-none absolute inset-0 translate-y-[7%] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(0, 15, 30, 0.6) 0%, rgba(10, 10, 15, 1) 70%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Kill heavy SMIL animations + SVG filters on mobile and reduced-motion */}
        <style>{`
          @media (max-width: 768px), (prefers-reduced-motion: reduce) {
            .hero-anim { display: none !important; }
            .hero-filter-glow { filter: none !important; }
          }
        `}</style>
        <defs>
          <filter id="g1" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Animated routes */}
          <path id="r1" d="M0,150 H200 V250 H350 V300 H500" fill="none" />
          <path id="r2" d="M0,300 H150 V350 H300 V300 H500" fill="none" />
          <path id="r3" d="M0,450 H180 V400 H320 V350 H500 V300" fill="none" />
          <path id="r4" d="M100,0 V100 H250 V200 H400 V300 H500" fill="none" />
          <path id="r5" d="M300,0 V80 H400 V180 H500 V300" fill="none" />
          <path id="r6" d="M500,0 V100 H450 V200 H500 V300" fill="none" />
          <path id="r7" d="M700,0 V120 H600 V220 H550 V300 H500" fill="none" />
          <path id="r8" d="M900,0 V80 H800 V180 H700 V250 H550 V300 H500" fill="none" />
          <path id="r9" d="M1000,150 H850 V250 H700 V300 H500" fill="none" />
          <path id="r10" d="M1000,300 H850 V350 H700 V300 H500" fill="none" />
          <path id="r11" d="M1000,450 H820 V400 H680 V350 H550 V300 H500" fill="none" />
          <path id="r12" d="M500,600 V500 H450 V400 H500 V300" fill="none" />
          <path id="r13" d="M300,600 V520 H400 V420 H450 V350 H500 V300" fill="none" />
          <path id="r14" d="M700,600 V520 H600 V420 H550 V350 H500 V300" fill="none" />
          <path id="r15" d="M100,600 V530 H250 V450 H380 V350 H500 V300" fill="none" />
          <path id="r16" d="M900,600 V530 H750 V450 H620 V350 H500 V300" fill="none" />
          {/* Background bus paths — deep layer */}
          <path id="b1" d="M30,40 H280" fill="none" />
          <path id="b2" d="M740,40 H970" fill="none" />
          <path id="b3" d="M50,110 H200" fill="none" />
          <path id="b4" d="M800,110 H960" fill="none" />
          <path id="b5" d="M60,30 V180" fill="none" />
          <path id="b6" d="M940,30 V180" fill="none" />
          <path id="b7" d="M30,550 H280" fill="none" />
          <path id="b8" d="M740,550 H970" fill="none" />
          <path id="b9" d="M60,420 V570" fill="none" />
          <path id="b10" d="M940,420 V570" fill="none" />
        </defs>

        {/* ============================================ */}
        {/* DENSE TRACE NETWORK                          */}
        {/* ============================================ */}

        {/* Parallel bus lines — horizontal groups */}
        <g stroke="rgba(0, 212, 255, 0.08)" strokeWidth="0.5" fill="none">
          {/* Top bus group */}
          <line x1="30" y1="40" x2="280" y2="40" /><line x1="30" y1="44" x2="260" y2="44" />
          <line x1="30" y1="48" x2="240" y2="48" /><line x1="30" y1="52" x2="220" y2="52" />
          <line x1="320" y1="40" x2="480" y2="40" /><line x1="340" y1="44" x2="480" y2="44" />
          <line x1="520" y1="40" x2="700" y2="40" /><line x1="520" y1="44" x2="680" y2="44" />
          <line x1="520" y1="48" x2="660" y2="48" />
          <line x1="740" y1="40" x2="970" y2="40" /><line x1="760" y1="44" x2="970" y2="44" />
          <line x1="780" y1="48" x2="970" y2="48" /><line x1="800" y1="52" x2="970" y2="52" />
          {/* Upper-mid bus */}
          <line x1="50" y1="110" x2="200" y2="110" /><line x1="50" y1="114" x2="180" y2="114" />
          <line x1="50" y1="118" x2="160" y2="118" />
          <line x1="280" y1="110" x2="420" y2="110" /><line x1="300" y1="114" x2="420" y2="114" />
          <line x1="580" y1="110" x2="720" y2="110" /><line x1="580" y1="114" x2="700" y2="114" />
          <line x1="800" y1="110" x2="960" y2="110" /><line x1="820" y1="114" x2="960" y2="114" />
          <line x1="840" y1="118" x2="960" y2="118" />
          {/* Center-top bus */}
          <line x1="30" y1="195" x2="170" y2="195" /><line x1="30" y1="199" x2="150" y2="199" />
          <line x1="240" y1="195" x2="380" y2="195" /><line x1="260" y1="199" x2="380" y2="199" />
          <line x1="620" y1="195" x2="760" y2="195" /><line x1="640" y1="199" x2="760" y2="199" />
          <line x1="830" y1="195" x2="970" y2="195" /><line x1="850" y1="199" x2="970" y2="199" />
          {/* Center bus */}
          <line x1="30" y1="265" x2="130" y2="265" /><line x1="30" y1="269" x2="110" y2="269" />
          <line x1="200" y1="265" x2="340" y2="265" /><line x1="220" y1="269" x2="340" y2="269" />
          <line x1="660" y1="265" x2="800" y2="265" /><line x1="680" y1="269" x2="800" y2="269" />
          <line x1="870" y1="265" x2="970" y2="265" /><line x1="890" y1="269" x2="970" y2="269" />
          {/* Center-bottom bus */}
          <line x1="30" y1="335" x2="130" y2="335" /><line x1="30" y1="339" x2="110" y2="339" />
          <line x1="200" y1="335" x2="340" y2="335" /><line x1="220" y1="339" x2="340" y2="339" />
          <line x1="660" y1="335" x2="800" y2="335" /><line x1="680" y1="339" x2="800" y2="339" />
          <line x1="870" y1="335" x2="970" y2="335" /><line x1="890" y1="339" x2="970" y2="339" />
          {/* Lower-mid bus */}
          <line x1="30" y1="410" x2="160" y2="410" /><line x1="30" y1="414" x2="140" y2="414" />
          <line x1="240" y1="410" x2="380" y2="410" /><line x1="260" y1="414" x2="380" y2="414" />
          <line x1="620" y1="410" x2="760" y2="410" /><line x1="640" y1="414" x2="760" y2="414" />
          <line x1="830" y1="410" x2="970" y2="410" /><line x1="850" y1="414" x2="970" y2="414" />
          {/* Lower bus */}
          <line x1="50" y1="485" x2="200" y2="485" /><line x1="50" y1="489" x2="180" y2="489" />
          <line x1="280" y1="485" x2="420" y2="485" /><line x1="300" y1="489" x2="420" y2="489" />
          <line x1="580" y1="485" x2="720" y2="485" /><line x1="580" y1="489" x2="700" y2="489" />
          <line x1="800" y1="485" x2="960" y2="485" /><line x1="820" y1="489" x2="960" y2="489" />
          {/* Bottom bus group */}
          <line x1="30" y1="550" x2="280" y2="550" /><line x1="30" y1="554" x2="260" y2="554" />
          <line x1="30" y1="558" x2="240" y2="558" />
          <line x1="320" y1="550" x2="480" y2="550" /><line x1="340" y1="554" x2="480" y2="554" />
          <line x1="520" y1="550" x2="700" y2="550" /><line x1="520" y1="554" x2="680" y2="554" />
          <line x1="740" y1="550" x2="970" y2="550" /><line x1="760" y1="554" x2="970" y2="554" />
          <line x1="780" y1="558" x2="970" y2="558" />
        </g>

        {/* Vertical bus lines */}
        <g stroke="rgba(0, 212, 255, 0.08)" strokeWidth="0.5" fill="none">
          <line x1="60" y1="30" x2="60" y2="180" /><line x1="64" y1="30" x2="64" y2="160" />
          <line x1="60" y1="220" x2="60" y2="380" /><line x1="64" y1="240" x2="64" y2="380" />
          <line x1="60" y1="420" x2="60" y2="570" /><line x1="64" y1="440" x2="64" y2="570" />
          <line x1="160" y1="30" x2="160" y2="160" /><line x1="164" y1="30" x2="164" y2="140" />
          <line x1="160" y1="220" x2="160" y2="380" /><line x1="164" y1="240" x2="164" y2="360" />
          <line x1="160" y1="420" x2="160" y2="570" /><line x1="164" y1="440" x2="164" y2="570" />
          <line x1="340" y1="30" x2="340" y2="160" /><line x1="344" y1="30" x2="344" y2="140" />
          <line x1="340" y1="380" x2="340" y2="570" /><line x1="344" y1="400" x2="344" y2="570" />
          <line x1="660" y1="30" x2="660" y2="160" /><line x1="656" y1="30" x2="656" y2="140" />
          <line x1="660" y1="380" x2="660" y2="570" /><line x1="656" y1="400" x2="656" y2="570" />
          <line x1="840" y1="30" x2="840" y2="160" /><line x1="836" y1="30" x2="836" y2="140" />
          <line x1="840" y1="220" x2="840" y2="380" /><line x1="836" y1="240" x2="836" y2="360" />
          <line x1="840" y1="420" x2="840" y2="570" /><line x1="836" y1="440" x2="836" y2="570" />
          <line x1="940" y1="30" x2="940" y2="180" /><line x1="936" y1="30" x2="936" y2="160" />
          <line x1="940" y1="220" x2="940" y2="380" /><line x1="936" y1="240" x2="936" y2="380" />
          <line x1="940" y1="420" x2="940" y2="570" /><line x1="936" y1="440" x2="936" y2="570" />
        </g>

        {/* Dense short connectors — fills the gaps */}
        <g stroke="rgba(0, 212, 255, 0.09)" strokeWidth="0.6" fill="none">
          {/* Dozens of small right-angle connectors */}
          <path d="M80,40 V70 H120" /><path d="M180,44 V75 H220" /><path d="M280,40 V60 H320" />
          <path d="M480,40 V65 H520" /><path d="M700,40 V60 H740" />
          <path d="M120,80 H160 V110" /><path d="M220,75 H260 V110" /><path d="M420,65 V85 H460" />
          <path d="M720,60 H760 V90" /><path d="M200,110 V140 H240" /><path d="M420,110 V140 H460" />
          <path d="M720,110 V140 H760" /><path d="M960,110 V140 H920" />
          <path d="M170,195 V220 H200" /><path d="M380,195 V215 H420" /><path d="M760,195 V215 H800" />
          <path d="M130,265 V290 H170" /><path d="M340,265 V290 H380" />
          <path d="M800,265 V290 H840" /><path d="M130,335 V360 H170" />
          <path d="M340,335 V310 H380" /><path d="M800,335 V310 H840" />
          <path d="M160,410 V435 H200" /><path d="M380,410 V430 H420" />
          <path d="M760,410 V430 H800" /><path d="M200,485 V510 H240" />
          <path d="M420,485 V505 H460" /><path d="M720,485 V505 H760" />
          <path d="M960,485 V510 H920" /><path d="M80,550 V530 H120" />
          <path d="M280,550 V530 H320" /><path d="M480,550 V530 H520" />
          <path d="M700,550 V530 H740" />
          {/* Fill more gaps */}
          <path d="M60,180 H100 V195" /><path d="M60,380 H100 V410" />
          <path d="M60,420 V410" /><path d="M940,180 H900 V195" />
          <path d="M940,380 H900 V410" /><path d="M340,160 H380 V195" />
          <path d="M340,380 V410" /><path d="M660,160 H620 V195" />
          <path d="M660,380 V410" /><path d="M160,160 H200 V195" />
          <path d="M160,380 V410" /><path d="M840,160 H800 V195" />
          <path d="M840,380 V410" />
        </g>

        {/* Main animated route traces */}
        <g stroke="rgba(0, 212, 255, 0.12)" strokeWidth="1" fill="none" strokeLinecap="square">
          <use href="#r1" /><use href="#r2" /><use href="#r3" /><use href="#r4" />
          <use href="#r5" /><use href="#r6" /><use href="#r7" /><use href="#r8" />
          <use href="#r9" /><use href="#r10" /><use href="#r11" /><use href="#r12" />
          <use href="#r13" /><use href="#r14" /><use href="#r15" /><use href="#r16" />
        </g>
        <g className="hero-filter-glow" stroke="rgba(0, 212, 255, 0.22)" strokeWidth="1" fill="none" filter="url(#g1)" strokeLinecap="square">
          <use href="#r1" /><use href="#r5" /><use href="#r6" /><use href="#r9" /><use href="#r12" />
        </g>

        {/* ============================================ */}
        {/* IC CHIPS — scattered across board             */}
        {/* ============================================ */}
        {/* IC pin lines — drawn first so chip bodies cover them */}
        <g stroke="rgba(0, 212, 255, 0.12)" strokeWidth="0.7" fill="none">
          {/* IC 1 pins */}
          <line x1="70" y1="65" x2="58" y2="65" /><line x1="70" y1="75" x2="58" y2="75" />
          <line x1="70" y1="85" x2="58" y2="85" /><line x1="70" y1="95" x2="58" y2="95" />
          <line x1="105" y1="65" x2="117" y2="65" /><line x1="105" y1="75" x2="117" y2="75" />
          <line x1="105" y1="85" x2="117" y2="85" /><line x1="105" y1="95" x2="117" y2="95" />
          {/* IC 2 pins */}
          <line x1="295" y1="120" x2="295" y2="110" /><line x1="305" y1="120" x2="305" y2="110" />
          <line x1="315" y1="120" x2="315" y2="110" /><line x1="320" y1="120" x2="320" y2="110" />
          <line x1="295" y1="150" x2="295" y2="160" /><line x1="305" y1="150" x2="305" y2="160" />
          <line x1="315" y1="150" x2="315" y2="160" /><line x1="320" y1="150" x2="320" y2="160" />
          {/* IC 3 pins */}
          <line x1="880" y1="55" x2="880" y2="43" /><line x1="890" y1="55" x2="890" y2="43" />
          <line x1="900" y1="55" x2="900" y2="43" /><line x1="910" y1="55" x2="910" y2="43" />
          <line x1="880" y1="95" x2="880" y2="107" /><line x1="890" y1="95" x2="890" y2="107" />
          <line x1="900" y1="95" x2="900" y2="107" /><line x1="910" y1="95" x2="910" y2="107" />
          {/* IC 4 pins */}
          <line x1="860" y1="240" x2="848" y2="240" /><line x1="860" y1="250" x2="848" y2="250" />
          <line x1="860" y1="260" x2="848" y2="260" /><line x1="860" y1="270" x2="848" y2="270" />
          <line x1="890" y1="240" x2="902" y2="240" /><line x1="890" y1="250" x2="902" y2="250" />
          <line x1="890" y1="260" x2="902" y2="260" /><line x1="890" y1="270" x2="902" y2="270" />
          {/* IC 5 pins */}
          <line x1="70" y1="260" x2="58" y2="260" /><line x1="70" y1="270" x2="58" y2="270" />
          <line x1="70" y1="280" x2="58" y2="280" />
          <line x1="100" y1="260" x2="112" y2="260" /><line x1="100" y1="270" x2="112" y2="270" />
          <line x1="100" y1="280" x2="112" y2="280" />
          {/* IC 6 pins */}
          <line x1="205" y1="500" x2="205" y2="488" /><line x1="215" y1="500" x2="215" y2="488" />
          <line x1="225" y1="500" x2="225" y2="488" /><line x1="230" y1="500" x2="230" y2="488" />
          <line x1="205" y1="535" x2="205" y2="547" /><line x1="215" y1="535" x2="215" y2="547" />
          <line x1="225" y1="535" x2="225" y2="547" /><line x1="230" y1="535" x2="230" y2="547" />
          {/* IC 7 pins */}
          <line x1="770" y1="500" x2="770" y2="488" /><line x1="780" y1="500" x2="780" y2="488" />
          <line x1="790" y1="500" x2="790" y2="488" /><line x1="795" y1="500" x2="795" y2="488" />
          <line x1="770" y1="535" x2="770" y2="547" /><line x1="780" y1="535" x2="780" y2="547" />
          <line x1="790" y1="535" x2="790" y2="547" /><line x1="795" y1="535" x2="795" y2="547" />
          {/* IC 8 pins */}
          <line x1="440" y1="440" x2="440" y2="428" /><line x1="450" y1="440" x2="450" y2="428" />
          <line x1="460" y1="440" x2="460" y2="428" />
          <line x1="440" y1="470" x2="440" y2="482" /><line x1="450" y1="470" x2="450" y2="482" />
          <line x1="460" y1="470" x2="460" y2="482" />
          {/* IC 9 pins */}
          <line x1="540" y1="130" x2="540" y2="118" /><line x1="550" y1="130" x2="550" y2="118" />
          <line x1="560" y1="130" x2="560" y2="118" />
          <line x1="540" y1="160" x2="540" y2="172" /><line x1="550" y1="160" x2="550" y2="172" />
          <line x1="560" y1="160" x2="560" y2="172" />
          {/* IC 10 pins */}
          <line x1="870" y1="370" x2="858" y2="370" /><line x1="870" y1="380" x2="858" y2="380" />
          <line x1="870" y1="390" x2="858" y2="390" />
          <line x1="905" y1="370" x2="917" y2="370" /><line x1="905" y1="380" x2="917" y2="380" />
          <line x1="905" y1="390" x2="917" y2="390" />
        </g>
        {/* SMD components — small rectangles scattered everywhere */}
        <g stroke="rgba(0, 212, 255, 0.10)" strokeWidth="0.6" fill="rgb(8, 18, 28)">
          <rect x="140" y="72" width="12" height="6" rx="1" /><rect x="230" y="90" width="12" height="6" rx="1" />
          <rect x="410" y="55" width="6" height="12" rx="1" /><rect x="560" y="65" width="12" height="6" rx="1" />
          <rect x="640" y="85" width="6" height="12" rx="1" /><rect x="770" y="70" width="12" height="6" rx="1" />
          <rect x="140" y="230" width="12" height="6" rx="1" /><rect x="240" y="245" width="6" height="12" rx="1" />
          <rect x="380" y="235" width="12" height="6" rx="1" /><rect x="620" y="240" width="12" height="6" rx="1" />
          <rect x="760" y="230" width="6" height="12" rx="1" /><rect x="810" y="310" width="12" height="6" rx="1" />
          <rect x="140" y="365" width="12" height="6" rx="1" /><rect x="240" y="355" width="6" height="12" rx="1" />
          <rect x="380" y="385" width="12" height="6" rx="1" /><rect x="620" y="380" width="12" height="6" rx="1" />
          <rect x="760" y="365" width="6" height="12" rx="1" />
          <rect x="140" y="500" width="12" height="6" rx="1" /><rect x="350" y="510" width="6" height="12" rx="1" />
          <rect x="560" y="505" width="12" height="6" rx="1" /><rect x="680" y="515" width="6" height="12" rx="1" />
          <rect x="860" y="500" width="12" height="6" rx="1" /><rect x="460" y="550" width="12" height="6" rx="1" />
        </g>

        {/* Via holes */}
        <g fill="none" stroke="rgba(0, 212, 255, 0.12)" strokeWidth="0.6">
          <circle cx="200" cy="250" r="4" /><circle cx="200" cy="250" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="350" cy="300" r="4" /><circle cx="350" cy="300" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="400" cy="180" r="4" /><circle cx="400" cy="180" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="700" cy="250" r="4" /><circle cx="700" cy="250" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="600" cy="220" r="4" /><circle cx="600" cy="220" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="850" cy="250" r="4" /><circle cx="850" cy="250" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="300" cy="350" r="4" /><circle cx="300" cy="350" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="700" cy="350" r="4" /><circle cx="700" cy="350" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="450" cy="400" r="4" /><circle cx="450" cy="400" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="550" cy="420" r="4" /><circle cx="550" cy="420" r="1.5" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="150" cy="350" r="3" /><circle cx="150" cy="350" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="850" cy="350" r="3" /><circle cx="850" cy="350" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="250" cy="200" r="3" /><circle cx="250" cy="200" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="750" cy="180" r="3" /><circle cx="750" cy="180" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="400" cy="420" r="3" /><circle cx="400" cy="420" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
          <circle cx="600" cy="420" r="3" /><circle cx="600" cy="420" r="1.2" fill="rgba(0, 212, 255, 0.06)" />
        </g>

        {/* Center hub */}
        <circle ref={hubOuterRef} className="hero-filter-glow" cx="500" cy="300" r="5" fill="rgba(0, 212, 255, 0.5)">
          <animate attributeName="fill" values="rgba(0,212,255,0.5);rgba(255,255,255,1);rgba(255,255,255,0.9);rgba(0,212,255,0.5)" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p1.end" fill="remove" />
          <animate attributeName="fill" values="rgba(0,212,255,0.5);rgba(255,255,255,1);rgba(255,255,255,0.9);rgba(0,212,255,0.5)" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p2.end" fill="remove" />
          <animate attributeName="fill" values="rgba(0,212,255,0.5);rgba(255,255,255,1);rgba(255,255,255,0.9);rgba(0,212,255,0.5)" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p3.end" fill="remove" />
          <animate attributeName="r" values="5;7;5" keyTimes="0;0.3;1" dur="0.6s" begin="p1.end" fill="remove" />
          <animate attributeName="r" values="5;7;5" keyTimes="0;0.3;1" dur="0.6s" begin="p2.end" fill="remove" />
          <animate attributeName="r" values="5;7;5" keyTimes="0;0.3;1" dur="0.6s" begin="p3.end" fill="remove" />
        </circle>
        <circle ref={hubInnerRef} cx="500" cy="300" r="2.5" fill="#00D4FF" opacity="1">
          <animate attributeName="fill" values="#00D4FF;#FFFFFF;#FFFFFF;#00D4FF" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p1.end" fill="remove" />
          <animate attributeName="fill" values="#00D4FF;#FFFFFF;#FFFFFF;#00D4FF" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p2.end" fill="remove" />
          <animate attributeName="fill" values="#00D4FF;#FFFFFF;#FFFFFF;#00D4FF" keyTimes="0;0.1;0.5;1" dur="0.6s" begin="p3.end" fill="remove" />
          <animate attributeName="r" values="2.5;3.5;2.5" keyTimes="0;0.3;1" dur="0.6s" begin="p1.end" fill="remove" />
          <animate attributeName="r" values="2.5;3.5;2.5" keyTimes="0;0.3;1" dur="0.6s" begin="p2.end" fill="remove" />
          <animate attributeName="r" values="2.5;3.5;2.5" keyTimes="0;0.3;1" dur="0.6s" begin="p3.end" fill="remove" />
        </circle>

        {/* Junction nodes on routes */}
        <g fill="rgba(0, 212, 255, 0.45)">
          <circle cx="200" cy="150" r="1.5" /><circle cx="200" cy="250" r="1.5" />
          <circle cx="350" cy="250" r="1.5" /><circle cx="350" cy="300" r="1.5" />
          <circle cx="150" cy="300" r="1.5" /><circle cx="150" cy="350" r="1.5" />
          <circle cx="300" cy="300" r="1.5" /><circle cx="180" cy="450" r="1.5" />
          <circle cx="320" cy="400" r="1.5" /><circle cx="100" cy="100" r="1.5" />
          <circle cx="250" cy="200" r="1.5" /><circle cx="400" cy="300" r="1.5" />
          <circle cx="300" cy="80" r="1.5" /><circle cx="400" cy="180" r="1.5" />
          <circle cx="500" cy="180" r="1.5" /><circle cx="500" cy="100" r="1.5" />
          <circle cx="450" cy="200" r="1.5" /><circle cx="700" cy="120" r="1.5" />
          <circle cx="600" cy="220" r="1.5" /><circle cx="550" cy="300" r="1.5" />
          <circle cx="900" cy="80" r="1.5" /><circle cx="800" cy="180" r="1.5" />
          <circle cx="700" cy="250" r="1.5" /><circle cx="850" cy="150" r="1.5" />
          <circle cx="850" cy="250" r="1.5" /><circle cx="700" cy="300" r="1.5" />
          <circle cx="850" cy="350" r="1.5" /><circle cx="820" cy="400" r="1.5" />
          <circle cx="680" cy="350" r="1.5" /><circle cx="500" cy="500" r="1.5" />
          <circle cx="450" cy="400" r="1.5" /><circle cx="400" cy="520" r="1.5" />
          <circle cx="450" cy="350" r="1.5" /><circle cx="600" cy="520" r="1.5" />
          <circle cx="550" cy="420" r="1.5" /><circle cx="250" cy="530" r="1.5" />
          <circle cx="380" cy="350" r="1.5" /><circle cx="750" cy="530" r="1.5" />
          <circle cx="620" cy="350" r="1.5" /><circle cx="100" cy="530" r="1.5" />
          <circle cx="250" cy="450" r="1.5" /><circle cx="900" cy="530" r="1.5" />
          <circle cx="750" cy="450" r="1.5" />
        </g>

        {/* Chip trace paths — drawn before chip bodies so chips cover them */}
        <g className="hero-anim" ref={chipPathsRef}>
          {chipTargets.map((c, i) => (
            <path key={`t${i}`} d={c.trace} fill="none" stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.8" />
          ))}
        </g>

        {/* IC chip bodies — drawn last to cover ALL lines */}
        <g stroke="rgba(0, 212, 255, 0.12)" strokeWidth="0.7" fill="rgb(8, 18, 28)">
          <rect x="70" y="55" width="35" height="50" rx="1" />
          <rect x="285" y="120" width="45" height="30" rx="1" />
          <rect x="870" y="55" width="50" height="40" rx="1" />
          <rect x="860" y="230" width="30" height="50" rx="1" />
          <rect x="70" y="250" width="30" height="45" rx="1" />
          <rect x="195" y="500" width="45" height="35" rx="1" />
          <rect x="760" y="500" width="45" height="35" rx="1" />
          <rect x="430" y="440" width="40" height="30" rx="1" />
          <rect x="530" y="130" width="40" height="30" rx="1" />
          <rect x="870" y="360" width="35" height="40" rx="1" />
        </g>
        {/* IC chip processing LEDs */}
        <g className="hero-anim" fill="#00D4FF">
          <circle cx="76" cy="61" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.6s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="82" cy="61" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="88" cy="61" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.6s" begin="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="876" cy="61" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="1.1s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="866" cy="236" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.9s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="436" cy="446" r="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="1s" begin="0.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Chip glow overlay rects — on top of chip bodies so animation lights them up */}
        <g className="hero-anim" ref={chipRectsRef}>
          {chipTargets.map((c, i) => (
            <rect key={`c${i}`} x={c.x} y={c.y} width={c.w} height={c.h} rx={1} fill="rgba(0, 212, 255, 0)" stroke="none" />
          ))}
        </g>

        {/* ============================================ */}
        {/* DEEP LAYER PARTICLES — dim, small, slow        */}
        {/* Creates 3D depth: these feel "behind" the PCB  */}
        {/* ============================================ */}
        <g className="hero-anim">
          <circle r="0.4" fill="#00D4FF" opacity="0.15">
            <animateMotion dur="6s" repeatCount="indefinite"><mpath href="#b1" /></animateMotion>
          </circle>
          <circle r="0.4" fill="#00D4FF" opacity="0.12">
            <animateMotion dur="5.5s" repeatCount="indefinite" begin="2s"><mpath href="#b2" /></animateMotion>
          </circle>
          <circle r="0.35" fill="#00D4FF" opacity="0.1">
            <animateMotion dur="4.5s" repeatCount="indefinite" begin="1s"><mpath href="#b3" /></animateMotion>
          </circle>
          <circle r="0.35" fill="#00D4FF" opacity="0.1">
            <animateMotion dur="5s" repeatCount="indefinite" begin="3.5s"><mpath href="#b4" /></animateMotion>
          </circle>
          <circle r="0.4" fill="#00D4FF" opacity="0.12">
            <animateMotion dur="5s" repeatCount="indefinite" begin="0.5s"><mpath href="#b5" /></animateMotion>
          </circle>
          <circle r="0.4" fill="#00D4FF" opacity="0.12">
            <animateMotion dur="5s" repeatCount="indefinite" begin="4s"><mpath href="#b6" /></animateMotion>
          </circle>
          <circle r="0.35" fill="#00D4FF" opacity="0.1">
            <animateMotion dur="6s" repeatCount="indefinite" begin="1.5s"><mpath href="#b7" /></animateMotion>
          </circle>
          <circle r="0.4" fill="#00D4FF" opacity="0.15">
            <animateMotion dur="5.5s" repeatCount="indefinite" begin="3s"><mpath href="#b8" /></animateMotion>
          </circle>
          <circle r="0.35" fill="#00D4FF" opacity="0.1">
            <animateMotion dur="5s" repeatCount="indefinite" begin="2.5s"><mpath href="#b9" /></animateMotion>
          </circle>
          <circle r="0.35" fill="#00D4FF" opacity="0.1">
            <animateMotion dur="5.5s" repeatCount="indefinite" begin="5s"><mpath href="#b10" /></animateMotion>
          </circle>
        </g>

        {/* ============================================ */}
        {/* ============================================ */}
        {/* TRACE ILLUMINATION + PARTICLES — chained       */}
        {/* After particle arrives: 1.11s delay + 2s trace */}
        {/* + 3.33s chip glow + 2.22s pause = 7.55s gap   */}
        {/* ============================================ */}
        <g className="hero-anim" fill="none" filter="url(#g1)">
          <use href="#r1" stroke="#00D4FF" strokeWidth="1.5" opacity="0.5" strokeDasharray="30 2000" strokeDashoffset="30" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="30" to="-620" dur="1.8s" begin="0s; p3.end+7.55s" fill="remove" />
          </use>
          <use href="#r6" stroke="#00D4FF" strokeWidth="1.5" opacity="0.5" strokeDasharray="30 2000" strokeDashoffset="30" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="30" to="-370" dur="1.2s" begin="p1.end+7.55s" fill="remove" />
          </use>
          <use href="#r9" stroke="#00D4FF" strokeWidth="1.5" opacity="0.5" strokeDasharray="30 2000" strokeDashoffset="30" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="30" to="-620" dur="1.8s" begin="p2.end+7.55s" fill="remove" />
          </use>
        </g>

        {/* Particles — 7.55s gap: chip completes + 2.22s pause */}
        <g className="hero-anim">
          <circle r="0.8" fill="#66EEFF" filter="url(#g1)" opacity="1">
            <animateMotion id="p1" dur="1.8s" begin="0s; p3.end+7.55s" fill="remove"><mpath href="#r1" /></animateMotion>
          </circle>
          <circle r="0.8" fill="#66EEFF" filter="url(#g1)" opacity="1">
            <animateMotion id="p2" dur="1.2s" begin="p1.end+7.55s" fill="remove"><mpath href="#r6" /></animateMotion>
          </circle>
          <circle r="0.8" fill="#66EEFF" filter="url(#g1)" opacity="1">
            <animateMotion id="p3" dur="1.8s" begin="p2.end+7.55s" fill="remove"><mpath href="#r9" /></animateMotion>
          </circle>
        </g>
      </svg>

      {/* Central processor area — subtle, no glow */}
      <div
        className="absolute left-1/2 top-[65%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[500px] md:w-[500px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 212, 255, 0.03) 0%, transparent 50%)",
        }}
      />

      {/* Grain — hidden on mobile to reduce GPU load */}
      <div
        className="absolute inset-0 hidden opacity-[0.02] md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Edge fades */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
