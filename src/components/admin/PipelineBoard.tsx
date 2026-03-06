import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "@/types/client";

interface PipelineClient {
  id: string;
  name: string;
  company: string;
  email: string;
  daysInStage: number;
  isIntake?: boolean;
  intakeStatus?: string;
  primaryService?: string;
}

interface PipelineColumn {
  stage: { value: PipelineStage; label: string; order: number };
  count: number;
  clients: PipelineClient[];
}

interface PipelineBoardProps {
  columns: PipelineColumn[];
}

function getColumnAccent(order: number): string {
  if (order <= 3) return "border-t-blue-500";
  if (order <= 6) return "border-t-cyan-500";
  if (order <= 8) return "border-t-emerald-500";
  if (order <= 10) return "border-t-amber-500";
  return "border-t-primary";
}

const INTAKE_STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  reviewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
};

export function PipelineBoard({ columns }: PipelineBoardProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3 pb-4">
      {columns.map((col) => (
        <div
          key={col.stage.value}
          className={cn(
            "flex min-w-0 flex-col rounded-lg border border-white/5 border-t-2 bg-white/[0.02]",
            getColumnAccent(col.stage.order)
          )}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-3 py-2.5">
            <h3 className="text-xs font-semibold">{col.stage.label}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-medium">
              {col.count}
            </span>
          </div>

          {/* Client cards */}
          <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
            {col.clients.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                No clients
              </p>
            )}
            {col.clients.map((client) => (
              <Link
                key={client.id}
                href={
                  client.isIntake
                    ? `/admin/intake/${client.id}`
                    : `/admin/clients/${client.id}`
                }
                className={cn(
                  "group rounded-md border bg-white/[0.03] p-2.5 transition-colors hover:border-primary/30 hover:bg-white/[0.06]",
                  client.isIntake
                    ? "border-blue-500/20"
                    : "border-white/5"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {client.name}
                  </p>
                  {client.isIntake && client.intakeStatus && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                        INTAKE_STATUS_BADGE[client.intakeStatus] ??
                          "bg-white/10 text-muted-foreground"
                      )}
                    >
                      {client.intakeStatus === "new" ? "Intake" : client.intakeStatus}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {client.company}
                </p>
                {client.primaryService && (
                  <p className="mt-0.5 truncate text-xs text-primary/70">
                    {client.primaryService}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {client.daysInStage}d in stage
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
