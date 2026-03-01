import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { StageBadge } from "./StageBadge";
import type { PipelineStage } from "@/types/client";

interface ClientListCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    company: string;
    industry: string | null;
    pipelineStage: PipelineStage;
    stageChangedAt: Date;
    assignedUser: { id: string; name: string | null } | null;
  };
}

export function ClientListCard({ client }: ClientListCardProps) {
  const daysInStage = Math.floor(
    (Date.now() - new Date(client.stageChangedAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/admin/clients/${client.id}`}>
      <GlassCard
        hover
        className="cursor-pointer transition-all hover:border-primary/30"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-base font-semibold">
                {client.name}
              </h3>
              <StageBadge stage={client.pipelineStage} />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {client.company}
              {client.industry ? ` — ${client.industry}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {daysInStage}d in stage
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{client.email}</span>
          {client.assignedUser?.name && (
            <span>
              Assigned:{" "}
              <strong className="text-foreground">
                {client.assignedUser.name}
              </strong>
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
