import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "../backend";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  [BookingStatus.pending]: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function BookingStatusBadge({
  status,
  className,
}: BookingStatusBadgeProps) {
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
