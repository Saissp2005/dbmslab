import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/bookings";
import SeatTypes "../types/seats";
import EventTypes "../types/events";
import Common "../types/common";

module {
  public func createBooking(
    bookings : Map.Map<Nat, Types.Booking>,
    seats : Map.Map<Nat, SeatTypes.Seat>,
    nextId : Nat,
    userId : Common.UserId,
    input : Types.CreateBookingInput,
  ) : Types.Booking {
    // Build booking items from reserved seats
    let items = List.empty<Types.BookingItem>();
    let total : Nat = 0;

    for (seatId in input.seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          // Seat must be reserved by this user
          switch (seat.status) {
            case (#reserved) {};
            case _ { Runtime.trap("Seat is not reserved: " # seatId.toText()) };
          };
          switch (seat.reservedBy) {
            case (?reservedBy) {
              if (not Principal.equal(reservedBy, userId)) {
                Runtime.trap("Seat reserved by different user: " # seatId.toText());
              };
            };
            case null { Runtime.trap("Seat reservation missing owner") };
          };
          items.add({
            seatId = seat.id;
            seatLabel = seat.seatLabel;
            category = seat.category;
            priceInCents = 0; // Price will be filled from showtime below
          });
        };
      };
    };

    // Look up prices from the showtime seat categories via seats' showtime
    // We need to compute price per seat from showtime - but we only have seats here.
    // We'll look up prices by matching categories in showtimes. Since we don't have
    // showtimes in this function, we derive price = 0 for now and callers pass showtimeSeats.
    // Actually the caller (mixin) should pass showtime for pricing. For simplicity,
    // we pass seatCategories pricing in a separate approach: seats don't store price.
    // The mixin will pass showtimePrices separately.

    let qrRef = generateQrReference(nextId, userId);
    let booking : Types.Booking = {
      id = nextId;
      userId = userId;
      showtimeId = input.showtimeId;
      var items = items.toArray();
      var totalAmountCents = total;
      var status = #pending;
      var refundStatus = #notApplicable;
      var qrReference = qrRef;
      createdAt = Time.now();
      var cancelledAt = null;
    };
    bookings.add(nextId, booking);
    booking;
  };

  // Extended create that includes showtime pricing
  public func createBookingWithPrices(
    bookings : Map.Map<Nat, Types.Booking>,
    seats : Map.Map<Nat, SeatTypes.Seat>,
    nextId : Nat,
    userId : Common.UserId,
    input : Types.CreateBookingInput,
    categoryPrices : Map.Map<Text, Nat>,
  ) : Types.Booking {
    let items = List.empty<Types.BookingItem>();
    var total : Nat = 0;

    for (seatId in input.seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          switch (seat.status) {
            case (#reserved) {};
            case _ { Runtime.trap("Seat is not reserved: " # seatId.toText()) };
          };
          switch (seat.reservedBy) {
            case (?reservedBy) {
              if (not Principal.equal(reservedBy, userId)) {
                Runtime.trap("Seat reserved by different user: " # seatId.toText());
              };
            };
            case null { Runtime.trap("Seat reservation missing owner") };
          };
          let catKey = categoryToText(seat.category);
          let price = switch (categoryPrices.get(catKey)) {
            case (?p) p;
            case null 0;
          };
          total += price;
          items.add({
            seatId = seat.id;
            seatLabel = seat.seatLabel;
            category = seat.category;
            priceInCents = price;
          });
        };
      };
    };

    let qrRef = generateQrReference(nextId, userId);
    let booking : Types.Booking = {
      id = nextId;
      userId = userId;
      showtimeId = input.showtimeId;
      var items = items.toArray();
      var totalAmountCents = total;
      var status = #pending;
      var refundStatus = #notApplicable;
      var qrReference = qrRef;
      createdAt = Time.now();
      var cancelledAt = null;
    };
    bookings.add(nextId, booking);
    booking;
  };

  public func confirmBooking(bookings : Map.Map<Nat, Types.Booking>, bookingId : Common.EntityId) : () {
    switch (bookings.get(bookingId)) {
      case null { Runtime.trap("Booking not found") };
      case (?booking) {
        booking.status := #confirmed;
        booking.refundStatus := #nonRefundable;
      };
    };
  };

  public func cancelBooking(bookings : Map.Map<Nat, Types.Booking>, bookingId : Common.EntityId, userId : Common.UserId) : () {
    switch (bookings.get(bookingId)) {
      case null { Runtime.trap("Booking not found") };
      case (?booking) {
        if (not Principal.equal(booking.userId, userId)) {
          Runtime.trap("Unauthorized: Not your booking");
        };
        let wasConfirmed = switch (booking.status) {
          case (#cancelled) { Runtime.trap("Booking already cancelled") };
          case (#confirmed) true;
          case _ false;
        };
        booking.status := #cancelled;
        booking.cancelledAt := ?Time.now();
        if (wasConfirmed) {
          booking.refundStatus := #pending;
        } else {
          booking.refundStatus := #notApplicable;
        };
      };
    };
  };

  public func cancelBookingAdmin(bookings : Map.Map<Nat, Types.Booking>, bookingId : Common.EntityId) : () {
    switch (bookings.get(bookingId)) {
      case null { Runtime.trap("Booking not found") };
      case (?booking) {
        booking.status := #cancelled;
        booking.cancelledAt := ?Time.now();
        booking.refundStatus := #pending;
      };
    };
  };

  public func toPublic(booking : Types.Booking) : Types.BookingPublic {
    {
      id = booking.id;
      userId = booking.userId;
      showtimeId = booking.showtimeId;
      items = booking.items;
      totalAmountCents = booking.totalAmountCents;
      status = booking.status;
      refundStatus = booking.refundStatus;
      qrReference = booking.qrReference;
      createdAt = booking.createdAt;
      cancelledAt = booking.cancelledAt;
    };
  };

  public func listUserBookings(bookings : Map.Map<Nat, Types.Booking>, userId : Common.UserId, filter : Types.BookingFilter) : [Types.BookingPublic] {
    let result = List.empty<Types.BookingPublic>();
    for ((_, booking) in bookings.entries()) {
      if (Principal.equal(booking.userId, userId)) {
        let matchesStatus = switch (filter.status) {
          case (?s) {
            switch (s, booking.status) {
              case (#pending, #pending) true;
              case (#confirmed, #confirmed) true;
              case (#cancelled, #cancelled) true;
              case _ false;
            };
          };
          case null true;
        };
        let matchesShowtime = switch (filter.showtimeId) {
          case (?sid) { booking.showtimeId == sid };
          case null true;
        };
        if (matchesStatus and matchesShowtime) {
          result.add(toPublic(booking));
        };
      };
    };
    result.toArray();
  };

  public func generateQrReference(bookingId : Common.EntityId, userId : Common.UserId) : Text {
    "BK-" # bookingId.toText() # "-" # userId.toText();
  };

  func categoryToText(cat : EventTypes.TicketCategory) : Text {
    switch (cat) {
      case (#vip) "vip";
      case (#regular) "regular";
      case (#balcony) "balcony";
    };
  };
};
