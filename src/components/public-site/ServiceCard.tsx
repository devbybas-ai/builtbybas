"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceIcon } from "@/components/public-site/ServiceIcon";
import type { Service } from "@/types/services";

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  }

  const interactive = !!onClick;

  if (shouldReduceMotion) {
    return (
      <div
        className={`group glass-card-hover flex h-full flex-col p-6 ${interactive ? "cursor-pointer" : ""}`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={
          interactive ? `Learn more about ${service.title}` : undefined
        }
      >
        <CardContent service={service} hasWalkthrough={interactive} />
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={springs.smooth}
      whileHover={{
        y: -8,
        borderColor: "rgba(0, 212, 255, 0.3)",
        boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive ? `Learn more about ${service.title}` : undefined
      }
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className={`group glass-card relative flex h-full flex-col p-6 ${interactive ? "cursor-pointer" : ""}`}
    >
      <CardContent service={service} hasWalkthrough={interactive} />
    </motion.div>
  );
}

function CardContent({
  service,
  hasWalkthrough,
}: {
  service: Service;
  hasWalkthrough: boolean;
}) {
  return (
    <>
      {/* Banner: icon + title */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(0,212,255,0.4)]">
        <ServiceIcon icon={service.icon} bare />
        <h3 className="text-lg font-semibold">{service.title}</h3>
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      <div className="mt-4">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors duration-300 group-hover:bg-primary/20">
          {service.priceRange}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {service.features.slice(0, 4).map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {hasWalkthrough ? (
        <span className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-cyan-hover">
          See Our Process
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </span>
      ) : (
        <Link
          href="/intake"
          className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-cyan-hover"
          onClick={(e) => e.stopPropagation()}
        >
          Get Started
          <span className="ml-1" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      )}
    </>
  );
}
