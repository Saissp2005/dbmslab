import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const footerUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={footerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            TicketFlow — Movie & Event Booking
          </p>
        </div>
      </footer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
