import { Badge } from "@/components/ui/badge";
import { SeatStatus } from "../backend";

interface SeatStatusBadgeProps {
  status: SeatStatus;
  className?: string;
}

const statusConfig: Record<SeatStatus, { label: string; className: string }> = {
  [SeatStatus.available]: {
    label: "Available",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  [SeatStatus.reserved]: {
    label: "Reserved",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  },
  [SeatStatus.booked]: {
    label: "Booked",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },
  [SeatStatus.blocked]: {
    label: "Blocked",
    className: "bg-secondary text-muted-foreground border-border",
  },
};

export function SeatStatusBadge({ status, className }: SeatStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${config.className} ${className ?? ""}`}
    >
      {config.label}
    </Badge>
  );
}
