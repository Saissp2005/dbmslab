import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    "data-ocid"?: string;
  };
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className ?? ""}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon ?? <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          data-ocid={action["data-ocid"]}
          variant="default"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
