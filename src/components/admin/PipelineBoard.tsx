import Link from "next/link";
import { cn } from "@/lib/utils";
import { getStageMeta, type PipelineStage } from "@/types/client";

interface PipelineClient {
  id: string;
  name: string;
  company: string;
  email: string;
  daysInStage: number;
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
                href={`/admin/clients/${client.id}`}
                className="group rounded-md border border-white/5 bg-white/[0.03] p-2.5 transition-colors hover:border-primary/30 hover:bg-white/[0.06]"
              >
                <p className="text-sm font-medium group-hover:text-primary">
                  {client.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {client.company}
                </p>
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
