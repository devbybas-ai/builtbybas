"use client";

import dynamic from "next/dynamic";

const demoComponents: Record<string, React.ComponentType> = {
  "motion-gallery": dynamic(() =>
    import("@/components/portfolio/demos/MotionGallery").then((m) => ({ default: m.MotionGallery })),
  ),
  "kinetic-typography": dynamic(() =>
    import("@/components/portfolio/demos/KineticTypography").then((m) => ({ default: m.KineticTypography })),
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
