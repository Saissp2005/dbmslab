import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

const navLinks = [
  { label: "Events", href: "/", icon: CalendarDays },
  {
    label: "My Bookings",
    href: "/dashboard",
    icon: Ticket,
    requiresAuth: true,
  },
];

const adminLinks = [
  { label: "Admin Panel", href: "/admin", icon: ShieldCheck },
];

export function Navbar() {
  const { login, clear, isAuthenticated, identity } = useInternetIdentity();
  const { isAdmin, profile } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const principalShort = identity?.getPrincipal().toText().slice(0, 8) ?? "";
  const displayName = profile?.name ?? principalShort;
  const avatarInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-interactive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.logo_link"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-interactive">
            <Ticket className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
            TicketFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks
            .filter((l) => !l.requiresAuth || isAuthenticated)
            .map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid="nav.link"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth [&.active]:text-primary [&.active]:bg-primary/10"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: link.href === "/" }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          {isAdmin &&
            adminLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid="nav.admin_link"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth [&.active]:text-primary [&.active]:bg-primary/10"
                activeProps={{ className: "active" }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Right: Auth */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.user_menu_button"
                  className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-secondary"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  data-ocid="nav.profile_link"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  My Bookings
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    data-ocid="nav.admin_panel_link"
                    onClick={() => navigate({ to: "/admin" })}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-ocid="nav.logout_button"
                  onClick={clear}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              data-ocid="nav.login_button"
              className="gap-2 font-semibold"
            >
              <User className="w-4 h-4" />
              Sign in
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                data-ocid="nav.mobile_menu_button"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl">
                  TicketFlow
                </span>
              </div>
              <Separator className="mb-4" />
              <nav className="flex flex-col gap-1">
                {navLinks
                  .filter((l) => !l.requiresAuth || isAuthenticated)
                  .map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
                {isAdmin &&
                  adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
