"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceIcon } from "@/components/public-site/ServiceIcon";
import type { Service } from "@/types/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
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

  if (shouldReduceMotion) {
    return (
      <div className="glass-card-hover flex h-full flex-col p-6">
        <CardContent service={service} />
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
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className="glass-card flex h-full flex-col p-6"
    >
      <CardContent service={service} />
    </motion.div>
  );
}

function CardContent({ service }: { service: Service }) {
  return (
    <>
      <ServiceIcon icon={service.icon} />

      <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>

      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {service.description}
      </p>

      <div className="mt-4">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
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

      <Link
        href="/intake"
        className="mt-6 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-cyan-hover"
      >
        Get Started
        <span className="ml-1" aria-hidden="true">
          &rarr;
        </span>
      </Link>
    </>
  );
}
