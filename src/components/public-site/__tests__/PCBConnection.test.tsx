// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PCBConnection } from "../PCBConnection";

// Mock PCBFragment to avoid SVG complexity in unit tests
vi.mock("../PCBFragment", () => ({
  PCBFragment: ({ variant, scale, className }: Record<string, unknown>) => (
    <div data-testid="pcb-fragment" data-variant={variant} data-scale={scale} className={className as string} />
  ),
}));

// Mock useReducedMotion
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("PCBConnection", () => {
  const defaultConfig = { side: "left" as const, variant: "bus-cluster" as const };

  it("renders children (card content)", () => {
    render(
      <PCBConnection config={defaultConfig}>
        <div data-testid="card">Card Content</div>
      </PCBConnection>
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders PCBFragment with correct variant", () => {
    render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const fragment = screen.getByTestId("pcb-fragment");
    expect(fragment).toHaveAttribute("data-variant", "bus-cluster");
  });

  it("has aria-hidden on the decorative wrapper", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const decorative = container.querySelector("[aria-hidden='true']");
    expect(decorative).toBeInTheDocument();
  });

  it("has pointer-events-none on decorative elements", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const decorative = container.querySelector(".pointer-events-none");
    expect(decorative).toBeInTheDocument();
  });

  it("hides fragment on mobile (hidden md:flex)", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const decorative = container.querySelector("[aria-hidden='true']");
    expect(decorative).toHaveClass("hidden");
  });

  it("renders wrapper with relative positioning for left side", () => {
    const { container } = render(
      <PCBConnection config={{ side: "left", variant: "bus-cluster" }}>
        <div data-testid="card">Card</div>
      </PCBConnection>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("relative");
    // Decorative assembly should have right:100% style for left side
    const decorative = container.querySelector("[aria-hidden='true']");
    expect(decorative).toHaveStyle({ right: "100%" });
  });

  it("renders wrapper with absolute positioning for right side", () => {
    const { container } = render(
      <PCBConnection config={{ side: "right", variant: "ic-chip" }}>
        <div data-testid="card">Card</div>
      </PCBConnection>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("relative");
    // Decorative assembly should have left:100% style for right side
    const decorative = container.querySelector("[aria-hidden='true']");
    expect(decorative).toHaveStyle({ left: "100%" });
  });

  it("renders connector SVG with port pads (rectangles, not circles)", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const connectorSvg = container.querySelector("svg.pcb-connector");
    expect(connectorSvg).toBeInTheDocument();
    const rects = connectorSvg?.querySelectorAll("rect.pcb-port");
    expect(rects?.length).toBeGreaterThan(0);
    const portCircles = connectorSvg?.querySelectorAll("circle.pcb-port");
    expect(portCircles?.length ?? 0).toBe(0);
  });

  it("passes scale prop to PCBFragment", () => {
    render(
      <PCBConnection config={{ ...defaultConfig, scale: 0.5 }}>
        <div>Card</div>
      </PCBConnection>
    );
    const fragment = screen.getByTestId("pcb-fragment");
    expect(fragment).toHaveAttribute("data-scale", "0.5");
  });
});
