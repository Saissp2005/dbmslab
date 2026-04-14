import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingTypes "../types/bookings";
import SeatTypes "../types/seats";
import EventTypes "../types/events";
import BookingsLib "../lib/bookings";
import SeatsLib "../lib/seats";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  seats : Map.Map<Nat, SeatTypes.Seat>,
  showtimes : Map.Map<Nat, EventTypes.Showtime>,
) {
  public query ({ caller }) func getBooking(bookingId : Nat) : async ?BookingTypes.BookingPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (bookings.get(bookingId)) {
      case null null;
      case (?booking) {
        // User can only see own bookings, admin can see all
        if (not Principal.equal(booking.userId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not your booking");
        };
        ?BookingsLib.toPublic(booking);
      };
    };
  };

  public query ({ caller }) func listMyBookings(filter : ?BookingTypes.BookingFilter) : async [BookingTypes.BookingPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let f = switch (filter) {
      case (?f) f;
      case null { { status = null; showtimeId = null } };
    };
    BookingsLib.listUserBookings(bookings, caller, f);
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let booking = switch (bookings.get(bookingId)) {
      case null { Runtime.trap("Booking not found") };
      case (?b) b;
    };
    if (not Principal.equal(booking.userId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not your booking");
    };
    BookingsLib.cancelBooking(bookings, bookingId, booking.userId);
    // Release the seats
    let seatIds = booking.items.map(func(item) { item.seatId });
    SeatsLib.releaseSeatReservation(seats, seatIds);
  };

  // Admin: list all bookings for a showtime
  public query ({ caller }) func listBookingsByShowtime(showtimeId : Nat) : async [BookingTypes.BookingPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    let result = List.empty<BookingTypes.BookingPublic>();
    for ((_, booking) in bookings.entries()) {
      if (booking.showtimeId == showtimeId) {
        result.add(BookingsLib.toPublic(booking));
      };
    };
    result.toArray();
  };

  // Admin: list all bookings
  public query ({ caller }) func listAllBookings() : async [BookingTypes.BookingPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    let result = List.empty<BookingTypes.BookingPublic>();
    for ((_, booking) in bookings.entries()) {
      result.add(BookingsLib.toPublic(booking));
    };
    result.toArray();
  };
};
