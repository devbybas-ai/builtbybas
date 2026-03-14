// @vitest-environment happy-dom
import type React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

// Mock HeroBackground (heavy SVG)
vi.mock("../HeroBackground", () => ({
  HeroBackground: () => <div data-testid="hero-bg" />,
}));

// Mock useReducedMotion
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

import { MobileConcierge } from "../MobileConcierge";

/** Helper: render and tap past the welcome screen to the greeting */
function renderAndSkipWelcome() {
  vi.useFakeTimers();
  render(<MobileConcierge />);
  fireEvent.click(screen.getByLabelText("Continue to get started"));
}

describe("MobileConcierge", () => {
  it("renders the welcome screen on initial load", () => {
    render(<MobileConcierge />);
    expect(
      screen.getByRole("heading", { name: "Welcome to BuiltByBas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Where we build solutions that work like your business does.",
      ),
    ).toBeInTheDocument();
  });

  it("tapping welcome screen transitions to greeting", () => {
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Continue to get started"));
    expect(
      screen.getByRole("heading", { name: "What are you building?" }),
    ).toBeInTheDocument();
  });

  it("renders the greeting screen with all 4 categories", () => {
    renderAndSkipWelcome();
    expect(
      screen.getByRole("heading", { name: "What are you building?" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Select: A Website")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: A Web App or Dashboard"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: A Full Platform"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: Something Else"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders the skip link to services", () => {
    renderAndSkipWelcome();
    const skipLink = screen.getByText(/browse our services/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.closest("a")).toHaveAttribute("href", "/services");
    vi.useRealTimers();
  });

  // Note: ConciergeOption has a 150ms selection glow delay before calling onSelect.
  // Tests use vi.useFakeTimers() + act() to advance past the delay.

  it("shows follow-up screen when a category is selected", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "What matters most to you?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: It needs to look incredible"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows matching screen then payoff when priority is selected", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: It needs to look incredible"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Should show matching screen with labor illusion (aria-live also has text, so use getAllBy)
    const matchingTexts = screen.getAllByText("Finding your match...");
    expect(matchingTexts.length).toBeGreaterThanOrEqual(1);
    // Advance past 800ms matching animation
    act(() => {
      vi.advanceTimersByTime(800);
    });
    // Now should show payoff with intent-matched CTA
    expect(
      screen.getByText("Let\u2019s make your brand stand out"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("'Something Else' skips to payoff with intake CTA", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: Something Else"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", {
        name: "We\u2019d love to hear about it",
      }),
    ).toBeInTheDocument();
    const ctaLink = screen.getByText("Tell Us About Your Project");
    expect(ctaLink.closest("a")).toHaveAttribute("href", "/intake?type=other");
    vi.useRealTimers();
  });

  it("payoff CTA includes progressive profiling params", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: It needs to look incredible"),
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const ctaLink = screen.getByText(
      "Let\u2019s make your brand stand out",
    );
    expect(ctaLink.closest("a")).toHaveAttribute(
      "href",
      "/intake?type=website&priority=design",
    );
    vi.useRealTimers();
  });

  it("back button returns to previous screen", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "What matters most to you?" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Go back to previous question"));
    expect(
      screen.getByRole("heading", { name: "What are you building?" }),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has aria-live region for screen reader announcements", () => {
    render(<MobileConcierge />);
    const liveRegion = document.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });

  it("has proper section aria-label", () => {
    render(<MobileConcierge />);
    const section = document.querySelector("section[aria-label]");
    expect(section).toBeInTheDocument();
    expect(section?.getAttribute("aria-label")).toContain("Welcome");
    expect(section?.getAttribute("aria-label")).toContain("tell us what you");
  });
});
