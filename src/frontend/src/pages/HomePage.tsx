import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Calendar,
  CalendarDays,
  Film,
  Filter,
  MapPin,
  Music,
  Search,
  Sparkles,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { EventPublic, ShowtimePublic, VenuePublic } from "../backend";
import { EventType } from "../backend";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { EventCard } from "../components/EventCard";
import { PageLoader } from "../components/LoadingSpinner";
import { useEvents } from "../hooks/useEvents";
import { useShowtimes } from "../hooks/useShowtimes";
import { useVenues } from "../hooks/useShowtimes";

// ─── Demo fallback data ──────────────────────────────────────────────────────

const DEMO_EVENTS: EventPublic[] = [
  {
    id: 1n,
    title: "Dune: Part Two",
    genre: "sci-fi / adventure",
    eventType: EventType.movie,
    description:
      "Paul Atreides unites with Chani and the Fremen to seek revenge against the conspirators who destroyed his family.",
    imageUrls: ["/assets/generated/event-movie.dim_800x450.jpg"],
    durationMinutes: 166n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 2n,
    title: "Taylor Swift: The Eras Tour Concert",
    genre: "pop / singer-songwriter",
    eventType: EventType.concert,
    description:
      "A journey through the musical eras of Taylor Swift's iconic discography, spanning over three hours of electrifying performance.",
    imageUrls: ["/assets/generated/event-concert.dim_800x450.jpg"],
    durationMinutes: 204n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 3n,
    title: "Oppenheimer",
    genre: "historical drama",
    eventType: EventType.movie,
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    imageUrls: ["/assets/generated/event-movie.dim_800x450.jpg"],
    durationMinutes: 180n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 4n,
    title: "React Advanced Workshop 2026",
    genre: "technology / web development",
    eventType: EventType.workshop,
    description:
      "Deep-dive into React 19, Server Components, and advanced patterns. Hands-on coding sessions with industry experts.",
    imageUrls: ["/assets/generated/event-workshop.dim_800x450.jpg"],
    durationMinutes: 480n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 5n,
    title: "Champions League Final 2026",
    genre: "football",
    eventType: EventType.sports,
    description:
      "The pinnacle of European club football. Two champions battle for the most prestigious trophy in the game.",
    imageUrls: ["/assets/generated/event-sports.dim_800x450.jpg"],
    durationMinutes: 120n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 6n,
    title: "Coldplay: Music of the Spheres",
    genre: "alternative rock",
    eventType: EventType.concert,
    description:
      "Coldplay brings their spectacular Music of the Spheres World Tour, featuring their biggest hits and dazzling light shows.",
    imageUrls: ["/assets/generated/event-concert.dim_800x450.jpg"],
    durationMinutes: 150n,
    isActive: true,
    createdAt: 1700000000000000000n,
    createdBy: {
      _isPrincipal: true,
      _arr: new Uint8Array(),
    } as unknown as import("@icp-sdk/core/principal").Principal,
  },
];

const now = BigInt(Date.now()) * 1_000_000n;
const day = 86_400_000_000_000n;

const DEMO_VENUES: VenuePublic[] = [
  {
    id: 1n,
    name: "Grand Cinema Complex",
    address: "123 Main St, Downtown",
    totalSeats: 300n,
    layoutRows: 15n,
    layoutCols: 20n,
    isActive: true,
    createdAt: now,
  },
  {
    id: 2n,
    name: "Riverside Arena",
    address: "456 River Rd, Eastside",
    totalSeats: 5000n,
    layoutRows: 50n,
    layoutCols: 100n,
    isActive: true,
    createdAt: now,
  },
  {
    id: 3n,
    name: "Tech Hub Conference Center",
    address: "789 Innovation Ave",
    totalSeats: 200n,
    layoutRows: 10n,
    layoutCols: 20n,
    isActive: true,
    createdAt: now,
  },
  {
    id: 4n,
    name: "City Sports Stadium",
    address: "1 Stadium Way, Northside",
    totalSeats: 50000n,
    layoutRows: 200n,
    layoutCols: 250n,
    isActive: true,
    createdAt: now,
  },
];

const DEMO_SHOWTIMES: ShowtimePublic[] = [
  {
    id: 1n,
    eventId: 1n,
    venueId: 1n,
    startTime: now + 2n * day,
    endTime: now + 2n * day + 9960000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 1450n,
        totalSeats: 200n,
        availableSeats: 95n,
      },
      {
        category: "vip" as import("../backend").TicketCategory,
        priceInCents: 2800n,
        totalSeats: 50n,
        availableSeats: 12n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
  {
    id: 2n,
    eventId: 2n,
    venueId: 2n,
    startTime: now + 5n * day,
    endTime: now + 5n * day + 12240000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 5500n,
        totalSeats: 3000n,
        availableSeats: 450n,
      },
      {
        category: "vip" as import("../backend").TicketCategory,
        priceInCents: 12000n,
        totalSeats: 500n,
        availableSeats: 8n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
  {
    id: 3n,
    eventId: 3n,
    venueId: 1n,
    startTime: now + 3n * day,
    endTime: now + 3n * day + 10800000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 1450n,
        totalSeats: 200n,
        availableSeats: 180n,
      },
      {
        category: "balcony" as import("../backend").TicketCategory,
        priceInCents: 2200n,
        totalSeats: 50n,
        availableSeats: 40n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
  {
    id: 4n,
    eventId: 4n,
    venueId: 3n,
    startTime: now + 7n * day,
    endTime: now + 7n * day + 28800000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 19900n,
        totalSeats: 150n,
        availableSeats: 62n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
  {
    id: 5n,
    eventId: 5n,
    venueId: 4n,
    startTime: now + 14n * day,
    endTime: now + 14n * day + 7200000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 8900n,
        totalSeats: 40000n,
        availableSeats: 12500n,
      },
      {
        category: "vip" as import("../backend").TicketCategory,
        priceInCents: 25000n,
        totalSeats: 5000n,
        availableSeats: 15n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
  {
    id: 6n,
    eventId: 6n,
    venueId: 2n,
    startTime: now + 10n * day,
    endTime: now + 10n * day + 9000000000000n,
    seatCategories: [
      {
        category: "regular" as import("../backend").TicketCategory,
        priceInCents: 7500n,
        totalSeats: 3500n,
        availableSeats: 210n,
      },
      {
        category: "vip" as import("../backend").TicketCategory,
        priceInCents: 18000n,
        totalSeats: 500n,
        availableSeats: 5n,
      },
    ],
    isActive: true,
    createdAt: now,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  { value: "all", label: "All Types", icon: Sparkles },
  { value: EventType.movie, label: "Movies", icon: Film },
  { value: EventType.concert, label: "Concerts", icon: Music },
  { value: EventType.workshop, label: "Workshops", icon: Zap },
  { value: EventType.sports, label: "Sports", icon: Trophy },
  { value: EventType.other, label: "Other", icon: Calendar },
];

const SORT_OPTIONS = [
  { value: "date-asc", label: "Date: Soonest first" },
  { value: "date-desc", label: "Date: Latest first" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "popularity", label: "Most popular" },
];

type SortOption =
  | "date-asc"
  | "date-desc"
  | "price-asc"
  | "price-desc"
  | "popularity";

function getLowestPrice(
  event: EventPublic,
  showtimes: ShowtimePublic[],
): bigint | undefined {
  const prices = showtimes
    .filter((s) => s.eventId === event.id)
    .flatMap((s) => s.seatCategories.map((c) => c.priceInCents));
  if (prices.length === 0) return undefined;
  return prices.reduce((min, p) => (p < min ? p : min), prices[0]);
}

function getTotalAvailable(
  event: EventPublic,
  showtimes: ShowtimePublic[],
): number | undefined {
  const eventShowtimes = showtimes.filter((s) => s.eventId === event.id);
  if (eventShowtimes.length === 0) return undefined;
  return eventShowtimes.reduce(
    (sum, s) =>
      sum + s.seatCategories.reduce((a, c) => a + Number(c.availableSeats), 0),
    0,
  );
}

function getTotalBookings(
  event: EventPublic,
  showtimes: ShowtimePublic[],
): number {
  return showtimes
    .filter((s) => s.eventId === event.id)
    .reduce(
      (sum, s) =>
        sum +
        s.seatCategories.reduce(
          (a, c) => a + (Number(c.totalSeats) - Number(c.availableSeats)),
          0,
        ),
      0,
    );
}

function getNextShowtime(
  event: EventPublic,
  showtimes: ShowtimePublic[],
): ShowtimePublic | undefined {
  return showtimes
    .filter((s) => s.eventId === event.id && s.isActive)
    .sort((a, b) => Number(a.startTime - b.startTime))[0];
}

function fromDateInputValue(val: string): bigint | undefined {
  if (!val) return undefined;
  const ms = new Date(val).getTime();
  if (Number.isNaN(ms)) return undefined;
  return BigInt(ms) * 1_000_000n;
}

// ─── URL search params ────────────────────────────────────────────────────────

type HomeSearch = {
  q?: string;
  type?: string;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  venueId?: string;
};

function useHomeSearchParams(): [
  {
    search: string;
    type: string;
    sort: SortOption;
    dateFrom: string;
    dateTo: string;
    minPrice: number;
    maxPrice: number;
    venueId: string;
  },
  (
    updates: Partial<{
      search: string;
      type: string;
      sort: SortOption;
      dateFrom: string;
      dateTo: string;
      minPrice: number;
      maxPrice: number;
      venueId: string;
    }>,
  ) => void,
] {
  const raw = useSearch({ from: "/" }) as HomeSearch;
  const navigate = useNavigate({ from: "/" });

  const params = {
    search: raw.q ?? "",
    type: raw.type ?? "all",
    sort: (raw.sort ?? "date-asc") as SortOption,
    dateFrom: raw.dateFrom ?? "",
    dateTo: raw.dateTo ?? "",
    minPrice: raw.minPrice ?? 0,
    maxPrice: raw.maxPrice ?? 500,
    venueId: raw.venueId ?? "all",
  };

  const setParams = (updates: Partial<typeof params>) => {
    const next = { ...params, ...updates };
    void navigate({
      search: {
        q: next.search || undefined,
        type: next.type !== "all" ? next.type : undefined,
        sort: next.sort !== "date-asc" ? next.sort : undefined,
        dateFrom: next.dateFrom || undefined,
        dateTo: next.dateTo || undefined,
        minPrice: next.minPrice !== 0 ? next.minPrice : undefined,
        maxPrice: next.maxPrice !== 500 ? next.maxPrice : undefined,
        venueId: next.venueId !== "all" ? next.venueId : undefined,
      },
      replace: true,
    });
  };

  return [params, setParams];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useHomeSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const { data: backendEvents, isLoading, error, refetch } = useEvents();
  const { data: backendShowtimes = [] } = useShowtimes();
  const { data: backendVenues = [] } = useVenues();

  // Use demo data when backend returns empty
  const events: EventPublic[] =
    backendEvents && backendEvents.length > 0 ? backendEvents : DEMO_EVENTS;
  const showtimes: ShowtimePublic[] =
    backendShowtimes.length > 0 ? backendShowtimes : DEMO_SHOWTIMES;
  const venues: VenuePublic[] =
    backendVenues.length > 0 ? backendVenues : DEMO_VENUES;

  const isUsingDemo = !backendEvents || backendEvents.length === 0;

  // Compute price bounds
  const allPrices = events
    .map((e) => getLowestPrice(e, showtimes))
    .filter(Boolean) as bigint[];
  const globalMaxPrice =
    allPrices.length > 0
      ? Math.ceil(
          Number(allPrices.reduce((m, p) => (p > m ? p : m), allPrices[0])) /
            100,
        )
      : 500;

  // Filter + sort
  const filtered = useMemo(() => {
    let list = events.filter((e) => e.isActive);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.genre.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
    }
    if (filters.type !== "all") {
      list = list.filter((e) => e.eventType === filters.type);
    }
    if (filters.venueId !== "all") {
      const vid = BigInt(filters.venueId);
      list = list.filter((e) =>
        showtimes.some((s) => s.eventId === e.id && s.venueId === vid),
      );
    }
    if (filters.dateFrom) {
      const from = fromDateInputValue(filters.dateFrom);
      if (from)
        list = list.filter((e) =>
          showtimes.some((s) => s.eventId === e.id && s.startTime >= from),
        );
    }
    if (filters.dateTo) {
      const to = fromDateInputValue(filters.dateTo);
      if (to)
        list = list.filter((e) =>
          showtimes.some(
            (s) =>
              s.eventId === e.id && s.startTime <= to + 86_400_000_000_000n,
          ),
        );
    }
    if (filters.minPrice > 0) {
      const minCents = BigInt(filters.minPrice * 100);
      list = list.filter((e) => {
        const lp = getLowestPrice(e, showtimes);
        return lp !== undefined && lp >= minCents;
      });
    }
    if (filters.maxPrice < 500) {
      const maxCents = BigInt(filters.maxPrice * 100);
      list = list.filter((e) => {
        const lp = getLowestPrice(e, showtimes);
        return lp === undefined || lp <= maxCents;
      });
    }

    // Sort
    list = [...list];
    switch (filters.sort) {
      case "date-asc":
        list.sort((a, b) => {
          const sa = getNextShowtime(a, showtimes)?.startTime ?? 0n;
          const sb = getNextShowtime(b, showtimes)?.startTime ?? 0n;
          return Number(sa - sb);
        });
        break;
      case "date-desc":
        list.sort((a, b) => {
          const sa = getNextShowtime(a, showtimes)?.startTime ?? 0n;
          const sb = getNextShowtime(b, showtimes)?.startTime ?? 0n;
          return Number(sb - sa);
        });
        break;
      case "price-asc":
        list.sort((a, b) => {
          const pa = getLowestPrice(a, showtimes) ?? 0n;
          const pb = getLowestPrice(b, showtimes) ?? 0n;
          return Number(pa - pb);
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          const pa = getLowestPrice(a, showtimes) ?? 0n;
          const pb = getLowestPrice(b, showtimes) ?? 0n;
          return Number(pb - pa);
        });
        break;
      case "popularity":
        list.sort(
          (a, b) =>
            getTotalBookings(b, showtimes) - getTotalBookings(a, showtimes),
        );
        break;
    }
    return list;
  }, [events, showtimes, filters]);

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.venueId !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500;

  const activeFilterCount = [
    filters.search,
    filters.type !== "all" ? filters.type : null,
    filters.venueId !== "all" ? filters.venueId : null,
    filters.dateFrom,
    filters.dateTo,
    filters.minPrice > 0 ? filters.minPrice : null,
    filters.maxPrice < 500 ? filters.maxPrice : null,
  ].filter(Boolean).length;

  function clearFilters() {
    setFilters({
      search: "",
      type: "all",
      sort: "date-asc",
      dateFrom: "",
      dateTo: "",
      minPrice: 0,
      maxPrice: 500,
      venueId: "all",
    });
  }

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage error={error} onRetry={() => refetch()} />;

  return (
    <div className="bg-background flex-1">
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">
              Discover &amp; Book
              <span className="text-primary block sm:inline sm:ml-2">
                Movies &amp; Events
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 text-base max-w-xl">
              Browse upcoming shows, select your seats, and secure tickets
              instantly. From blockbusters to live concerts — all in one place.
            </p>
          </motion.div>

          {/* Search + filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="home.search_input"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search movies, concerts, workshops..."
                className="pl-9 h-11"
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(v) => setFilters({ type: v })}
            >
              <SelectTrigger
                data-ocid="home.type_filter.select"
                className="w-full sm:w-44 h-11 shrink-0"
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              data-ocid="home.filters_toggle_button"
              variant="outline"
              className="h-11 gap-2 shrink-0 relative"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-muted/40 border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date range */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date From
                </Label>
                <Input
                  data-ocid="home.date_from_input"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ dateFrom: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date To
                </Label>
                <Input
                  data-ocid="home.date_to_input"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ dateTo: e.target.value })}
                  className="h-9"
                />
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Venue
                </Label>
                <Select
                  value={filters.venueId}
                  onValueChange={(v) => setFilters({ venueId: v })}
                >
                  <SelectTrigger
                    data-ocid="home.venue_filter.select"
                    className="h-9"
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    {venues.map((v) => (
                      <SelectItem key={String(v.id)} value={String(v.id)}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Price Range: ${filters.minPrice} – $
                  {filters.maxPrice === 500 ? "500+" : filters.maxPrice}
                </Label>
                <div className="px-1 pt-2">
                  <Slider
                    data-ocid="home.price_range_slider"
                    min={0}
                    max={Math.max(globalMaxPrice, 500)}
                    step={5}
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) =>
                      setFilters({ minPrice: min, maxPrice: max })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-5 flex justify-end">
                <Button
                  data-ocid="home.clear_filters_button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar: result count + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "event" : "events"} found
            </p>
            {isUsingDemo && (
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground border-dashed"
              >
                Demo data
              </Badge>
            )}
            {filters.type !== "all" && (
              <Badge
                data-ocid="home.active_type_badge"
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setFilters({ type: "all" })}
              >
                {
                  EVENT_TYPE_OPTIONS.find((o) => o.value === filters.type)
                    ?.label
                }
                <X className="w-3 h-3" />
              </Badge>
            )}
            {filters.venueId !== "all" && (
              <Badge
                data-ocid="home.active_venue_badge"
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => setFilters({ venueId: "all" })}
              >
                {venues.find((v) => String(v.id) === filters.venueId)?.name ??
                  "Venue"}
                <X className="w-3 h-3" />
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <Select
              value={filters.sort}
              onValueChange={(v) => setFilters({ sort: v as SortOption })}
            >
              <SelectTrigger
                data-ocid="home.sort_select"
                className="h-8 w-52 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-sm"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Category pill filters */}
        <div className="flex gap-2 flex-wrap mb-7">
          {EVENT_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = filters.type === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                data-ocid={`home.type_filter.${opt.value}`}
                onClick={() => setFilters({ type: opt.value })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-smooth border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-interactive"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Event grid or empty state */}
        {filtered.length === 0 ? (
          <EmptyState
            data-ocid="home.empty_state"
            icon={<CalendarDays className="w-8 h-8" />}
            title="No events found"
            description={
              hasActiveFilters
                ? "Try adjusting your search terms or clearing some filters."
                : "No events are available right now. Check back soon!"
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear all filters",
                    onClick: clearFilters,
                    "data-ocid": "home.clear_filters_action",
                  }
                : undefined
            }
          />
        ) : (
          <div
            data-ocid="home.events_list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((event, idx) => {
              const nextShowtime = getNextShowtime(event, showtimes);
              const venue = venues.find((v) => v.id === nextShowtime?.venueId);

              return (
                <motion.div
                  key={String(event.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.06, 0.4),
                  }}
                >
                  <EventCard
                    data-ocid={`home.event.${idx + 1}`}
                    event={event}
                    lowestPrice={getLowestPrice(event, showtimes)}
                    availableSeats={getTotalAvailable(event, showtimes)}
                    nextShowtime={
                      nextShowtime
                        ? {
                            startTime: nextShowtime.startTime,
                            venueId: nextShowtime.venueId,
                            venueName: venue?.name,
                          }
                        : undefined
                    }
                    onBook={() =>
                      navigate({
                        to: "/events/$eventId",
                        params: { eventId: String(event.id) },
                      })
                    }
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
