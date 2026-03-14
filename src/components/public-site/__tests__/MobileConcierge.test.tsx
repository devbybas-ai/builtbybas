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
    }) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
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

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
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

/** Helper: render and tap past the welcome screen to the category screen */
function renderAndSkipWelcome() {
  vi.useFakeTimers();
  render(<MobileConcierge />);
  fireEvent.click(screen.getByLabelText("Continue to get started"));
}

describe("MobileConcierge", () => {
  it("renders the welcome screen on initial load", () => {
    render(<MobileConcierge />);
    expect(screen.getAllByText(/Welcome to/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText("We build solutions shaped around your business."),
    ).toBeInTheDocument();
  });

  it("tapping welcome screen transitions to category", () => {
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Continue to get started"));
    expect(
      screen.getByRole("heading", { name: "What are we building?" }),
    ).toBeInTheDocument();
  });

  it("renders the category screen with all 4 categories", () => {
    renderAndSkipWelcome();
    expect(
      screen.getByRole("heading", { name: "What are we building?" }),
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

  it("shows qualifier screen when a category is selected", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "Is this a..." }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: A brand new site"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Select: A redesign")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: A single landing page"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows priority screen after qualifier selection", () => {
    renderAndSkipWelcome();
    // Select Website category
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Select qualifier
    fireEvent.click(screen.getByLabelText("Select: A brand new site"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", {
        name: "What matters most?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: Budget -- stay on target, no surprises"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows timeline screen after priority selection", () => {
    renderAndSkipWelcome();
    // Category -> Qualifier -> Priority
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByLabelText("Select: A brand new site"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: Budget -- stay on target, no surprises"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "When do you need this?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: ASAP -- I needed this yesterday"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Select: Flexible -- quality over speed"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows confirmation screen after timeline selection", () => {
    renderAndSkipWelcome();
    // Full flow: Category -> Qualifier -> Priority -> Timeline
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByLabelText("Select: A brand new site"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: Budget -- stay on target, no surprises"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: ASAP -- I needed this yesterday"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "Here's what we heard." }),
    ).toBeInTheDocument();
    // Confirmation shows service name
    expect(
      screen.getByText("a new marketing website", { exact: false }),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("'Something Else' skips qualifier and goes to priority", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: Something Else"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", {
        name: "What matters most?",
      }),
    ).toBeInTheDocument();
    // Shows generic priorities
    expect(
      screen.getByLabelText(
        "Select: Budget -- stay on target, no surprises",
      ),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("webapp category shows 'Something else' option in qualifier", () => {
    renderAndSkipWelcome();
    fireEvent.click(
      screen.getByLabelText("Select: A Web App or Dashboard"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByLabelText("Select: Something else"),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("back button returns to previous screen from qualifier", () => {
    renderAndSkipWelcome();
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", { name: "Is this a..." }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Go back to previous question"));
    expect(
      screen.getByRole("heading", { name: "What are we building?" }),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("back button returns to qualifier from priority", () => {
    renderAndSkipWelcome();
    // Category -> Qualifier -> Priority
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByLabelText("Select: A brand new site"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(
      screen.getByRole("heading", {
        name: "What matters most?",
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Go back to previous question"));
    expect(
      screen.getByRole("heading", { name: "Is this a..." }),
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
    expect(section?.getAttribute("aria-label")).toContain(
      "tell us what you",
    );
  });

  it("confirmation auto-navigates after 4.44s", () => {
    renderAndSkipWelcome();
    // Full flow to confirmation
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByLabelText("Select: A brand new site"));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: Budget -- stay on target, no surprises"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    fireEvent.click(
      screen.getByLabelText("Select: ASAP -- I needed this yesterday"),
    );
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Confirmation screen is shown
    expect(
      screen.getByRole("heading", { name: "Here's what we heard." }),
    ).toBeInTheDocument();
    // Advance past 7.77s
    act(() => {
      vi.advanceTimersByTime(7800);
    });
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/intake?service=marketing-website"),
    );
    vi.useRealTimers();
  });
});
