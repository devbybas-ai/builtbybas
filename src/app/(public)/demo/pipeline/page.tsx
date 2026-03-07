"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { demoPipelineStages, type DemoPipelineCard } from "@/data/demo-data";

function getPriorityColor(score: number) {
  if (score >= 80) return "bg-red-500/20 text-red-400";
  if (score >= 60) return "bg-amber-500/20 text-amber-400";
  return "bg-emerald-500/20 text-emerald-400";
}

const stageColors: Record<string, string> = {
  intake_review: "border-t-blue-500",
  discovery_call: "border-t-violet-500",
  proposal_sent: "border-t-amber-500",
  proposal_accepted: "border-t-emerald-500",
  in_development: "border-t-cyan-500",
  review_qa: "border-t-orange-500",
  launched: "border-t-green-500",
};

type Stage = {
  id: string;
  label: string;
  cards: DemoPipelineCard[];
};

export default function DemoPipelinePage() {
  const [stages, setStages] = useState<Stage[]>(
    () => demoPipelineStages.map((s) => ({ ...s, cards: [...s.cards] })),
  );
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const dragDataRef = useRef<{ cardId: string; fromStageId: string } | null>(null);

  function moveCard(cardId: string, fromStageId: string, toStageId: string) {
    if (fromStageId === toStageId) return;
    setStages((prev) => {
      const next = prev.map((s) => ({ ...s, cards: [...s.cards] }));
      const fromStage = next.find((s) => s.id === fromStageId);
      const toStage = next.find((s) => s.id === toStageId);
      if (!fromStage || !toStage) return prev;

      const cardIndex = fromStage.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;

      const [card] = fromStage.cards.splice(cardIndex, 1);
      toStage.cards.push({ ...card, daysInStage: 0 });
      return next;
    });
    setSelectedCard(null);
  }

  function handleDragStart(cardId: string, stageId: string) {
    dragDataRef.current = { cardId, fromStageId: stageId };
  }

  function handleDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    setDragOverStage(stageId);
  }

  function handleDragLeave(e: React.DragEvent, stageId: string) {
    const related = e.relatedTarget as Node | null;
    const current = e.currentTarget as Node;
    if (related && current.contains(related)) return;
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  }

  function handleDrop(e: React.DragEvent, toStageId: string) {
    e.preventDefault();
    setDragOverStage(null);
    if (!dragDataRef.current) return;
    const { cardId, fromStageId } = dragDataRef.current;
    dragDataRef.current = null;
    moveCard(cardId, fromStageId, toStageId);
  }

  function handleDragEnd() {
    dragDataRef.current = null;
    setDragOverStage(null);
  }

  const totalCards = stages.reduce((sum, s) => sum + s.cards.length, 0);
  const totalValue = stages.reduce(
    (sum, s) => sum + s.cards.reduce((acc, c) => acc + parseFloat(c.value.replace(/[$,]/g, "")), 0),
    0,
  );

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-muted-foreground">
            Drag cards between stages or click to move. Track every project from intake to launch.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-bold text-foreground">{totalCards}</span> deals
          </span>
          <span className="text-muted-foreground">
            <span className="font-bold text-primary">${totalValue.toLocaleString()}</span> total
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="min-w-0"
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={(e) => handleDragLeave(e, stage.id)}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={cn("rounded-t-lg border-t-2 px-3 py-2", stageColors[stage.id] ?? "border-t-white/20")}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stage.label}
                </h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {stage.cards.length}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "min-h-[120px] space-y-2 rounded-b-lg border border-t-0 p-2 transition-colors",
                dragOverStage === stage.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/5 bg-white/[0.01]",
              )}
            >
              {stage.cards.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/10 px-3 py-6 text-center text-xs text-muted-foreground/50">
                  {dragOverStage === stage.id ? "Drop here" : "No projects"}
                </div>
              )}
              {stage.cards.map((card) => (
                <div key={card.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={() => handleDragStart(card.id, stage.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                    className={cn(
                      "w-full cursor-grab rounded-lg border bg-white/[0.03] p-3 text-left transition-all hover:border-primary/30 active:cursor-grabbing",
                      selectedCard === card.id
                        ? "border-primary/50 ring-1 ring-primary/30"
                        : "border-white/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{card.name}</p>
                      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums", getPriorityColor(card.priority))}>
                        {card.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{card.company}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">{card.service}</span>
                      <span className="font-semibold text-foreground">{card.value}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">
                      {card.daysInStage}d in stage
                    </p>
                  </button>

                  {/* Move controls */}
                  {selectedCard === card.id && (
                    <div className="mt-1 rounded-lg border border-primary/20 bg-primary/5 p-2">
                      <p className="mb-1.5 text-[10px] font-semibold text-primary">Move to:</p>
                      <div className="flex flex-wrap gap-1">
                        {stages
                          .filter((s) => s.id !== stage.id)
                          .map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => moveCard(card.id, stage.id, s.id)}
                              className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
                            >
                              {s.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
