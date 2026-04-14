import type { backendInterface, SeatPublic } from "../backend";
import {
  BookingStatus,
  EventType,
  PaymentMode,
  PaymentStatus,
  RefundStatus,
  SeatStatus,
  TicketCategory,
  UserRole,
} from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = Principal.fromText("aaaaa-aa");
const now = BigInt(Date.now()) * BigInt(1_000_000);
const futureTime = BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000);

const sampleEvents = [
  {
    id: BigInt(1),
    title: "Dune: Part Two",
    imageUrls: ["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "The epic continuation of the Dune saga. Paul Atreides unites with Chani and the Fremen.",
    isActive: true,
    genre: "Sci-Fi",
    durationMinutes: BigInt(166),
    eventType: EventType.movie,
  },
  {
    id: BigInt(2),
    title: "Taylor Swift: The Eras Tour Concert",
    imageUrls: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "Taylor Swift performs hits from all her eras in this spectacular concert event.",
    isActive: true,
    genre: "Pop",
    durationMinutes: BigInt(195),
    eventType: EventType.concert,
  },
  {
    id: BigInt(3),
    title: "Oppenheimer",
    imageUrls: ["https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "The story of the man who created the atomic bomb. A Christopher Nolan masterpiece.",
    isActive: true,
    genre: "Drama",
    durationMinutes: BigInt(180),
    eventType: EventType.movie,
  },
  {
    id: BigInt(4),
    title: "Web3 Developer Workshop",
    imageUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "An intensive workshop on building decentralized applications on the Internet Computer.",
    isActive: true,
    genre: "Technology",
    durationMinutes: BigInt(240),
    eventType: EventType.workshop,
  },
  {
    id: BigInt(5),
    title: "Champions League Final",
    imageUrls: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "The biggest club football match of the year. Two of Europe's finest teams battle it out.",
    isActive: true,
    genre: "Football",
    durationMinutes: BigInt(120),
    eventType: EventType.sports,
  },
  {
    id: BigInt(6),
    title: "Coldplay: Music of the Spheres",
    imageUrls: ["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=600&fit=crop"],
    createdAt: now,
    createdBy: samplePrincipal,
    description: "Coldplay's spectacular world tour featuring their latest album with stunning visuals.",
    isActive: true,
    genre: "Rock",
    durationMinutes: BigInt(150),
    eventType: EventType.concert,
  },
];

const sampleVenues = [
  {
    id: BigInt(1),
    name: "Grand Cinema Multiplex",
    createdAt: now,
    isActive: true,
    totalSeats: BigInt(300),
    address: "123 Main Street, New York, NY 10001",
    layoutCols: BigInt(20),
    layoutRows: BigInt(15),
  },
  {
    id: BigInt(2),
    name: "Madison Square Garden",
    createdAt: now,
    isActive: true,
    totalSeats: BigInt(20000),
    address: "4 Pennsylvania Plaza, New York, NY 10001",
    layoutCols: BigInt(50),
    layoutRows: BigInt(40),
  },
  {
    id: BigInt(3),
    name: "Tech Conference Center",
    createdAt: now,
    isActive: true,
    totalSeats: BigInt(500),
    address: "456 Innovation Ave, San Francisco, CA 94102",
    layoutCols: BigInt(25),
    layoutRows: BigInt(20),
  },
];

const sampleShowtimes = [
  {
    id: BigInt(1),
    startTime: futureTime,
    eventId: BigInt(1),
    endTime: futureTime + BigInt(166 * 60 * 1_000_000_000),
    venueId: BigInt(1),
    seatCategories: [
      { totalSeats: BigInt(50), availableSeats: BigInt(30), category: TicketCategory.vip, priceInCents: BigInt(3500) },
      { totalSeats: BigInt(150), availableSeats: BigInt(100), category: TicketCategory.regular, priceInCents: BigInt(1450) },
      { totalSeats: BigInt(100), availableSeats: BigInt(70), category: TicketCategory.balcony, priceInCents: BigInt(1200) },
    ],
    createdAt: now,
    isActive: true,
  },
  {
    id: BigInt(2),
    startTime: futureTime + BigInt(3 * 24 * 60 * 60 * 1_000_000_000),
    eventId: BigInt(2),
    endTime: futureTime + BigInt(3 * 24 * 60 * 60 * 1_000_000_000) + BigInt(195 * 60 * 1_000_000_000),
    venueId: BigInt(2),
    seatCategories: [
      { totalSeats: BigInt(500), availableSeats: BigInt(10), category: TicketCategory.vip, priceInCents: BigInt(25000) },
      { totalSeats: BigInt(10000), availableSeats: BigInt(500), category: TicketCategory.regular, priceInCents: BigInt(8500) },
      { totalSeats: BigInt(9500), availableSeats: BigInt(800), category: TicketCategory.balcony, priceInCents: BigInt(5500) },
    ],
    createdAt: now,
    isActive: true,
  },
];

const generateSeats = (showtimeId: bigint, rows: number, cols: number): SeatPublic[] => {
  const seats: SeatPublic[] = [];
  let id = BigInt(1);
  const categories = [TicketCategory.vip, TicketCategory.regular, TicketCategory.balcony];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cat = row < 2 ? TicketCategory.vip : row < 8 ? TicketCategory.regular : TicketCategory.balcony;
      const statusRand = Math.random();
      const status = statusRand < 0.3 ? SeatStatus.booked : statusRand < 0.35 ? SeatStatus.reserved : SeatStatus.available;
      seats.push({
        id: id++,
        col: BigInt(col),
        row: BigInt(row),
        status,
        showtimeId,
        seatLabel: `${String.fromCharCode(65 + row)}${col + 1}`,
        category: cat,
        bookingId: status === SeatStatus.booked ? BigInt(1) : undefined,
      });
    }
  }
  return seats;
};

const sampleBookings = [
  {
    id: BigInt(1),
    status: BookingStatus.confirmed,
    refundStatus: RefundStatus.notApplicable,
    userId: samplePrincipal,
    createdAt: now - BigInt(7 * 24 * 60 * 60 * 1_000_000_000),
    showtimeId: BigInt(1),
    qrReference: "QR-BOOKING-001-DUNE",
    totalAmountCents: BigInt(2900),
    items: [
      { seatId: BigInt(1), seatLabel: "C5", category: TicketCategory.regular, priceInCents: BigInt(1450) },
      { seatId: BigInt(2), seatLabel: "C6", category: TicketCategory.regular, priceInCents: BigInt(1450) },
    ],
  },
  {
    id: BigInt(2),
    status: BookingStatus.pending,
    refundStatus: RefundStatus.notApplicable,
    userId: samplePrincipal,
    createdAt: now - BigInt(2 * 24 * 60 * 60 * 1_000_000_000),
    showtimeId: BigInt(2),
    qrReference: "QR-BOOKING-002-SWIFT",
    totalAmountCents: BigInt(17000),
    items: [
      { seatId: BigInt(10), seatLabel: "A1", category: TicketCategory.vip, priceInCents: BigInt(25000) },
    ],
  },
  {
    id: BigInt(3),
    status: BookingStatus.cancelled,
    refundStatus: RefundStatus.refunded,
    userId: samplePrincipal,
    createdAt: now - BigInt(30 * 24 * 60 * 60 * 1_000_000_000),
    showtimeId: BigInt(1),
    cancelledAt: now - BigInt(29 * 24 * 60 * 60 * 1_000_000_000),
    qrReference: "QR-BOOKING-003-CANCELLED",
    totalAmountCents: BigInt(1450),
    items: [
      { seatId: BigInt(5), seatLabel: "B3", category: TicketCategory.regular, priceInCents: BigInt(1450) },
    ],
  },
];

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async () => undefined,
  blockSeats: async () => undefined,
  cancelBooking: async () => undefined,
  createBooking: async () => BigInt(4),
  createCheckoutSession: async () => "https://checkout.stripe.com/mock-session",
  createEvent: async () => BigInt(7),
  createShowtime: async () => BigInt(3),
  createVenue: async () => BigInt(4),
  deleteEvent: async () => undefined,
  deleteShowtime: async () => undefined,
  deleteVenue: async () => undefined,
  getAdminAnalytics: async () => ({
    popularEvents: [
      { eventId: BigInt(2), totalBookings: BigInt(15420), eventTitle: "Taylor Swift: The Eras Tour Concert", totalRevenueCents: BigInt(131070000) },
      { eventId: BigInt(1), totalBookings: BigInt(8234), eventTitle: "Dune: Part Two", totalRevenueCents: BigInt(11939300) },
      { eventId: BigInt(3), totalBookings: BigInt(6120), eventTitle: "Oppenheimer", totalRevenueCents: BigInt(8874000) },
      { eventId: BigInt(5), totalBookings: BigInt(4500), eventTitle: "Champions League Final", totalRevenueCents: BigInt(56250000) },
    ],
    totalBookings: BigInt(2795),
    totalUsers: BigInt(733),
    showtimeOccupancy: [
      { startTime: futureTime, occupancyPercent: BigInt(78), showtimeId: BigInt(1), totalSeats: BigInt(300), bookedSeats: BigInt(234), eventTitle: "Dune: Part Two" },
      { startTime: futureTime + BigInt(3 * 24 * 60 * 60 * 1_000_000_000), occupancyPercent: BigInt(95), showtimeId: BigInt(2), totalSeats: BigInt(20000), bookedSeats: BigInt(19000), eventTitle: "Taylor Swift: The Eras Tour Concert" },
    ],
    totalRevenueCents: BigInt(100000000),
  }),
  getBooking: async (id) => sampleBookings.find(b => b.id === id) ?? null,
  getCallerUserProfile: async () => ({
    id: samplePrincipal,
    name: "Alex Johnson",
    createdAt: now,
    email: "alex.johnson@example.com",
  }),
  getCallerUserRole: async () => UserRole.user,
  getEvent: async (id) => sampleEvents.find(e => e.id === id) ?? null,
  getMyPayment: async () => ({
    id: BigInt(1),
    status: PaymentStatus.completed,
    completedAt: now,
    bookingId: BigInt(1),
    userId: samplePrincipal,
    createdAt: now,
    amountCents: BigInt(2900),
    paymentMode: PaymentMode.card,
    stripeSessionId: "cs_mock_123",
    transactionId: "txn_mock_456",
  }),
  getPaymentReconciliation: async () => [
    { status: "completed", bookingId: BigInt(1), userId: samplePrincipal, createdAt: now, amountCents: BigInt(2900), paymentId: BigInt(1), transactionId: "txn_001" },
    { status: "pending", bookingId: BigInt(2), userId: samplePrincipal, createdAt: now, amountCents: BigInt(17000), paymentId: BigInt(2), transactionId: undefined },
  ],
  getSeatMap: async (showtimeId) => ({
    cols: BigInt(10),
    rows: BigInt(8),
    showtimeId,
    seats: generateSeats(showtimeId, 8, 10),
  }),
  getShowtime: async (id) => sampleShowtimes.find(s => s.id === id) ?? null,
  getShowtimeOccupancy: async () => [
    { startTime: futureTime, occupancyPercent: BigInt(78), showtimeId: BigInt(1), totalSeats: BigInt(300), bookedSeats: BigInt(234), eventTitle: "Dune: Part Two" },
    { startTime: futureTime + BigInt(3 * 24 * 60 * 60 * 1_000_000_000), occupancyPercent: BigInt(95), showtimeId: BigInt(2), totalSeats: BigInt(20000), bookedSeats: BigInt(19000), eventTitle: "Taylor Swift: The Eras Tour Concert" },
  ],
  getStripeSessionStatus: async () => ({ __kind__: "completed", completed: { userPrincipal: "aaaaa-aa", response: "paid" } }),
  getUserProfile: async () => ({
    id: samplePrincipal,
    name: "Alex Johnson",
    createdAt: now,
    email: "alex.johnson@example.com",
  }),
  getVenue: async (id) => sampleVenues.find(v => v.id === id) ?? null,
  initializeShowtimeSeats: async () => undefined,
  isCallerAdmin: async () => false,
  isStripeConfigured: async () => true,
  listAllBookings: async () => sampleBookings,
  listAllPayments: async () => [
    { id: BigInt(1), status: PaymentStatus.completed, completedAt: now, bookingId: BigInt(1), userId: samplePrincipal, createdAt: now, amountCents: BigInt(2900), paymentMode: PaymentMode.card, stripeSessionId: "cs_mock_123", transactionId: "txn_001" },
    { id: BigInt(2), status: PaymentStatus.pending, bookingId: BigInt(2), userId: samplePrincipal, createdAt: now, amountCents: BigInt(17000), paymentMode: PaymentMode.card, stripeSessionId: "cs_mock_456", transactionId: undefined },
  ],
  listBookingsByShowtime: async () => sampleBookings,
  listEvents: async () => sampleEvents,
  listMyBookings: async () => sampleBookings,
  listShowtimes: async () => sampleShowtimes,
  listVenues: async () => sampleVenues,
  releaseReservation: async () => undefined,
  reserveSeats: async () => undefined,
  saveCallerUserProfile: async () => undefined,
  setStripeConfiguration: async () => undefined,
  transform: async (input) => ({ status: BigInt(200), body: new Uint8Array(), headers: [] }),
  unblockSeats: async () => undefined,
  updateEvent: async () => undefined,
  updateVenue: async () => undefined,
};
