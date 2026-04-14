import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  onRetry?: () => void;
  className?: string;
  "data-ocid"?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  className,
  "data-ocid": dataOcid,
}: ErrorMessageProps) {
  const displayMessage =
    message ?? (error ? getErrorMessage(error) : "Please try again later.");

  return (
    <div
      data-ocid={dataOcid}
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className ?? ""}`}
    >
      <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-base font-display font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {displayMessage}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
          data-ocid={dataOcid ? `${dataOcid}.retry` : undefined}
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
