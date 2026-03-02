"use client";

import dynamic from "next/dynamic";

const demoComponents: Record<string, React.ComponentType> = {
  "motion-gallery": dynamic(() =>
    import("@/components/portfolio/demos/MotionGallery").then((m) => ({ default: m.MotionGallery })),
  ),
  "kinetic-typography": dynamic(() =>
    import("@/components/portfolio/demos/KineticTypography").then((m) => ({ default: m.KineticTypography })),
  ),
  "micro-interactions": dynamic(() =>
    import("@/components/portfolio/demos/MicroInteractions").then((m) => ({ default: m.MicroInteractions })),
  ),
  "layout-animations": dynamic(() =>
    import("@/components/portfolio/demos/LayoutAnimations").then((m) => ({ default: m.LayoutAnimations })),
  ),
  "svg-animations": dynamic(() =>
    import("@/components/portfolio/demos/SVGAnimations").then((m) => ({ default: m.SVGAnimations })),
  ),
  "scroll-animations": dynamic(() =>
    import("@/components/portfolio/demos/ScrollAnimations").then((m) => ({ default: m.ScrollAnimations })),
  ),
};

interface DemoRendererProps {
  slug: string;
}

export function DemoRenderer({ slug }: DemoRendererProps) {
  const DemoComponent = demoComponents[slug];

  if (!DemoComponent) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <p>Demo coming soon.</p>
      </div>
    );
  }

  return <DemoComponent />;
}
