import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BookingItem {
    seatId: EntityId;
    seatLabel: string;
    category: TicketCategory;
    priceInCents: bigint;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShowtimeOccupancy {
    startTime: Timestamp;
    occupancyPercent: bigint;
    showtimeId: EntityId;
    totalSeats: bigint;
    bookedSeats: bigint;
    eventTitle: string;
}
export type EntityId = bigint;
export interface CreateBookingInput {
    seatIds: Array<EntityId>;
    showtimeId: EntityId;
}
export interface AdminAnalytics {
    popularEvents: Array<RevenueByEvent>;
    totalBookings: bigint;
    totalUsers: bigint;
    showtimeOccupancy: Array<ShowtimeOccupancy>;
    totalRevenueCents: bigint;
}
export interface SeatMapPublic {
    cols: bigint;
    rows: bigint;
    showtimeId: EntityId;
    seats: Array<SeatPublic>;
}
export interface ShowtimePublic {
    id: EntityId;
    startTime: Timestamp;
    eventId: EntityId;
    endTime: Timestamp;
    venueId: EntityId;
    seatCategories: Array<ShowtimeSeatCategoryPublic>;
    createdAt: Timestamp;
    isActive: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface BookingFilter {
    status?: BookingStatus;
    showtimeId?: EntityId;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface RevenueByEvent {
    eventId: EntityId;
    totalBookings: bigint;
    eventTitle: string;
    totalRevenueCents: bigint;
}
export interface EventPublic {
    id: EntityId;
    title: string;
    imageUrls: Array<string>;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    isActive: boolean;
    genre: string;
    durationMinutes: bigint;
    eventType: EventType;
}
export interface VenuePublic {
    id: EntityId;
    name: string;
    createdAt: Timestamp;
    isActive: boolean;
    totalSeats: bigint;
    address: string;
    layoutCols: bigint;
    layoutRows: bigint;
}
export interface UpdateVenueInput {
    id: EntityId;
    name: string;
    totalSeats: bigint;
    address: string;
    layoutCols: bigint;
    layoutRows: bigint;
}
export interface UpdateEventInput {
    id: EntityId;
    title: string;
    imageUrls: Array<string>;
    description: string;
    genre: string;
    durationMinutes: bigint;
    eventType: EventType;
}
export interface PaymentPublic {
    id: EntityId;
    status: PaymentStatus;
    completedAt?: Timestamp;
    bookingId: EntityId;
    userId: UserId;
    createdAt: Timestamp;
    amountCents: bigint;
    paymentMode: PaymentMode;
    stripeSessionId?: string;
    transactionId?: string;
}
export interface EventFilter {
    title?: string;
    dateTo?: Timestamp;
    venueId?: EntityId;
    maxPriceCents?: bigint;
    dateFrom?: Timestamp;
    minPriceCents?: bigint;
    eventType?: EventType;
}
export interface BookingPublic {
    id: EntityId;
    status: BookingStatus;
    refundStatus: RefundStatus;
    userId: UserId;
    createdAt: Timestamp;
    showtimeId: EntityId;
    cancelledAt?: Timestamp;
    qrReference: string;
    totalAmountCents: bigint;
    items: Array<BookingItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface UserProfilePublic {
    id: UserId;
    name: string;
    createdAt: Timestamp;
    email: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface CreateVenueInput {
    name: string;
    totalSeats: bigint;
    address: string;
    layoutCols: bigint;
    layoutRows: bigint;
}
export interface ReserveSeatInput {
    seatIds: Array<EntityId>;
    showtimeId: EntityId;
}
export interface CreateEventInput {
    title: string;
    imageUrls: Array<string>;
    description: string;
    genre: string;
    durationMinutes: bigint;
    eventType: EventType;
}
export interface ShowtimeSeatCategoryPublic {
    totalSeats: bigint;
    availableSeats: bigint;
    category: TicketCategory;
    priceInCents: bigint;
}
export interface PaymentReconciliationRow {
    status: string;
    bookingId: EntityId;
    userId: UserId;
    createdAt: Timestamp;
    amountCents: bigint;
    paymentId: EntityId;
    transactionId?: string;
}
export interface SeatPublic {
    id: EntityId;
    col: bigint;
    row: bigint;
    status: SeatStatus;
    bookingId?: EntityId;
    showtimeId: EntityId;
    seatLabel: string;
    category: TicketCategory;
}
export interface CreateShowtimeInput {
    startTime: Timestamp;
    eventId: EntityId;
    venueId: EntityId;
    seatCategories: Array<{
        totalSeats: bigint;
        category: TicketCategory;
        priceInCents: bigint;
    }>;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum EventType {
    movie = "movie",
    concert = "concert",
    workshop = "workshop",
    other = "other",
    sports = "sports"
}
export enum PaymentMode {
    other = "other",
    card = "card"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    refunded = "refunded",
    failed = "failed"
}
export enum RefundStatus {
    pending = "pending",
    nonRefundable = "nonRefundable",
    refunded = "refunded",
    notApplicable = "notApplicable"
}
export enum SeatStatus {
    blocked = "blocked",
    reserved = "reserved",
    booked = "booked",
    available = "available"
}
export enum TicketCategory {
    vip = "vip",
    balcony = "balcony",
    regular = "regular"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockSeats(showtimeId: bigint, seatIds: Array<bigint>): Promise<void>;
    cancelBooking(bookingId: bigint): Promise<void>;
    createBooking(input: CreateBookingInput): Promise<bigint>;
    createCheckoutSession(bookingId: bigint, successUrl: string, cancelUrl: string): Promise<string>;
    createEvent(input: CreateEventInput): Promise<bigint>;
    createShowtime(input: CreateShowtimeInput): Promise<bigint>;
    createVenue(input: CreateVenueInput): Promise<bigint>;
    deleteEvent(eventId: bigint): Promise<void>;
    deleteShowtime(showtimeId: bigint): Promise<void>;
    deleteVenue(venueId: bigint): Promise<void>;
    getAdminAnalytics(): Promise<AdminAnalytics>;
    getBooking(bookingId: bigint): Promise<BookingPublic | null>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvent(eventId: bigint): Promise<EventPublic | null>;
    getMyPayment(bookingId: bigint): Promise<PaymentPublic | null>;
    getPaymentReconciliation(): Promise<Array<PaymentReconciliationRow>>;
    getSeatMap(showtimeId: bigint): Promise<SeatMapPublic>;
    getShowtime(showtimeId: bigint): Promise<ShowtimePublic | null>;
    getShowtimeOccupancy(): Promise<Array<ShowtimeOccupancy>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfilePublic | null>;
    getVenue(venueId: bigint): Promise<VenuePublic | null>;
    initializeShowtimeSeats(showtimeId: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listAllBookings(): Promise<Array<BookingPublic>>;
    listAllPayments(): Promise<Array<PaymentPublic>>;
    listBookingsByShowtime(showtimeId: bigint): Promise<Array<BookingPublic>>;
    listEvents(filter: EventFilter | null): Promise<Array<EventPublic>>;
    listMyBookings(filter: BookingFilter | null): Promise<Array<BookingPublic>>;
    listShowtimes(eventId: bigint | null, venueId: bigint | null): Promise<Array<ShowtimePublic>>;
    listVenues(): Promise<Array<VenuePublic>>;
    releaseReservation(showtimeId: bigint, seatIds: Array<bigint>): Promise<void>;
    reserveSeats(input: ReserveSeatInput): Promise<void>;
    saveCallerUserProfile(name: string, email: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unblockSeats(showtimeId: bigint, seatIds: Array<bigint>): Promise<void>;
    updateEvent(input: UpdateEventInput): Promise<void>;
    updateVenue(input: UpdateVenueInput): Promise<void>;
}
