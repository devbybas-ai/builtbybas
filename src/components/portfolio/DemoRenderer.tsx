"use client";

import dynamic from "next/dynamic";

const demoComponents: Record<string, React.ComponentType> = {
  // Animation demos
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
  // BBB business system demos
  "bbb-intranet": dynamic(() =>
    import("@/components/portfolio/demos/IntranetDemo").then((m) => ({ default: m.IntranetDemo })),
  ),
  "bbb-filing": dynamic(() =>
    import("@/components/portfolio/demos/FilingDemo").then((m) => ({ default: m.FilingDemo })),
  ),
  "bbb-meeting-rooms": dynamic(() =>
    import("@/components/portfolio/demos/MeetingRoomsDemo").then((m) => ({ default: m.MeetingRoomsDemo })),
  ),
  "bbb-help-desk": dynamic(() =>
    import("@/components/portfolio/demos/HelpDeskDemo").then((m) => ({ default: m.HelpDeskDemo })),
  ),
  "bbb-inventory": dynamic(() =>
    import("@/components/portfolio/demos/InventoryDemo").then((m) => ({ default: m.InventoryDemo })),
  ),
  "bbb-assets": dynamic(() =>
    import("@/components/portfolio/demos/AssetsDemo").then((m) => ({ default: m.AssetsDemo })),
  ),
  "bbb-maintenance": dynamic(() =>
    import("@/components/portfolio/demos/MaintenanceDemo").then((m) => ({ default: m.MaintenanceDemo })),
  ),
  "bbb-purchase-orders": dynamic(() =>
    import("@/components/portfolio/demos/PurchaseOrdersDemo").then((m) => ({ default: m.PurchaseOrdersDemo })),
  ),
  "bbb-inspections": dynamic(() =>
    import("@/components/portfolio/demos/InspectionsDemo").then((m) => ({ default: m.InspectionsDemo })),
  ),
  "bbb-client-portal": dynamic(() =>
    import("@/components/portfolio/demos/ClientPortalDemo").then((m) => ({ default: m.ClientPortalDemo })),
  ),
  "bbb-booking": dynamic(() =>
    import("@/components/portfolio/demos/BookingDemo").then((m) => ({ default: m.BookingDemo })),
  ),
  "bbb-proposals": dynamic(() =>
    import("@/components/portfolio/demos/ProposalsDemo").then((m) => ({ default: m.ProposalsDemo })),
  ),
  "bbb-support": dynamic(() =>
    import("@/components/portfolio/demos/SupportDemo").then((m) => ({ default: m.SupportDemo })),
  ),
  "bbb-vendors": dynamic(() =>
    import("@/components/portfolio/demos/VendorsDemo").then((m) => ({ default: m.VendorsDemo })),
  ),
  "bbb-order-tracking": dynamic(() =>
    import("@/components/portfolio/demos/OrderTrackingDemo").then((m) => ({ default: m.OrderTrackingDemo })),
  ),
  "bbb-loyalty": dynamic(() =>
    import("@/components/portfolio/demos/LoyaltyDemo").then((m) => ({ default: m.LoyaltyDemo })),
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
