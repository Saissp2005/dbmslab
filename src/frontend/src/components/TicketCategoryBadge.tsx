import { Badge } from "@/components/ui/badge";
import { TicketCategory } from "../backend";

interface TicketCategoryBadgeProps {
  category: TicketCategory;
  className?: string;
}

const categoryConfig: Record<
  TicketCategory,
  { label: string; className: string }
> = {
  [TicketCategory.vip]: {
    label: "VIP",
    className:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300",
  },
  [TicketCategory.regular]: {
    label: "Regular",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300",
  },
  [TicketCategory.balcony]: {
    label: "Balcony",
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300",
  },
};

export function TicketCategoryBadge({
  category,
  className,
}: TicketCategoryBadgeProps) {
  const config = categoryConfig[category];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold ${config.className} ${className ?? ""}`}
    >
      {config.label}
    </Badge>
  );
}
