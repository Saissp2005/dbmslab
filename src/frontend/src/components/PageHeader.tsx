import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    "data-ocid"?: string;
  };
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 mb-6 ${className ?? ""}`}
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          data-ocid={action["data-ocid"]}
          className="shrink-0 gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
