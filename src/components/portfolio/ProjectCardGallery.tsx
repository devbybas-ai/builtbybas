"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ProjectCardGalleryProps {
  images: string[];
  title: string;
  colorAccent: string;
}

const accentGradients: Record<string, string> = {
  teal: "from-teal-500/15 via-background to-teal-400/10",
  blue: "from-blue-500/15 via-background to-blue-400/10",
  pink: "from-pink-500/15 via-background to-pink-400/10",
  indigo: "from-indigo-500/15 via-background to-indigo-400/10",
  cyan: "from-cyan-500/15 via-background to-cyan-400/10",
  emerald: "from-emerald-500/15 via-background to-emerald-400/10",
  amber: "from-amber-500/15 via-background to-amber-400/10",
  rose: "from-rose-500/15 via-background to-rose-400/10",
  green: "from-green-500/15 via-background to-green-400/10",
};

const CYCLE_INTERVAL = 5000;

export function ProjectCardGallery({ images, title, colorAccent }: ProjectCardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gradient = accentGradients[colorAccent] ?? accentGradients.cyan;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (shouldReduceMotion || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, CYCLE_INTERVAL);
  }, [clearTimer, shouldReduceMotion, images.length]);

  useEffect(() => {
    if (!paused) {
      startTimer();
    }
    return clearTimer;
  }, [paused, startTimer, clearTimer]);

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  return (
    <div
      className={cn("relative overflow-hidden rounded-t-xl bg-gradient-to-br", gradient)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} screenshot ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator */}
        {!shouldReduceMotion && images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 px-1 pb-1">
            {images.map((_, i) => (
              <div
                key={i}
                className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{
                    width: i === activeIndex ? "100%" : i < activeIndex ? "100%" : "0%",
                  }}
                  transition={
                    i === activeIndex && !paused
                      ? { duration: CYCLE_INTERVAL / 1000, ease: "linear" }
                      : { duration: 0.2 }
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-1 bg-black/30 p-1 backdrop-blur-sm">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleThumbClick(i);
              }}
              className={cn(
                "relative h-10 flex-1 overflow-hidden rounded-sm transition-all",
                i === activeIndex
                  ? "ring-1.5 ring-primary ring-offset-1 ring-offset-black/50"
                  : "opacity-60 hover:opacity-90",
              )}
              aria-label={`View screenshot ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
