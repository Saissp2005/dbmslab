import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/analytics";
import BookingTypes "../types/bookings";
import EventTypes "../types/events";
import PaymentTypes "../types/payments";
import UserTypes "../types/users";
import Common "../types/common";

module {
  public func computeAnalytics(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    _payments : Map.Map<Nat, PaymentTypes.Payment>,
    events : Map.Map<Nat, EventTypes.Event>,
    showtimes : Map.Map<Nat, EventTypes.Showtime>,
    users : Map.Map<Common.UserId, UserTypes.UserProfile>,
  ) : Types.AdminAnalytics {
    var totalBookings : Nat = 0;
    var totalRevenueCents : Nat = 0;
    let totalUsers = users.size();

    // Revenue per event (via showtime -> event mapping)
    let revenueByEvent = Map.empty<Nat, { var totalBookings : Nat; var totalRevenueCents : Nat }>();

    for ((_, booking) in bookings.entries()) {
      totalBookings += 1;
      // Find event id via showtime
      switch (showtimes.get(booking.showtimeId)) {
        case (?showtime) {
          let eventId = showtime.eventId;
          let entry = switch (revenueByEvent.get(eventId)) {
            case (?e) e;
            case null {
              let e = { var totalBookings = 0; var totalRevenueCents = 0 };
              revenueByEvent.add(eventId, e);
              e;
            };
          };
          entry.totalBookings += 1;
          switch (booking.status) {
            case (#confirmed) {
              entry.totalRevenueCents += booking.totalAmountCents;
              totalRevenueCents += booking.totalAmountCents;
            };
            case _ {};
          };
        };
        case null {};
      };
    };

    // Build popularEvents list sorted by revenue
    let popularList = List.empty<Types.RevenueByEvent>();
    for ((eventId, data) in revenueByEvent.entries()) {
      let title = switch (events.get(eventId)) {
        case (?ev) ev.title;
        case null "Unknown";
      };
      popularList.add({
        eventId = eventId;
        eventTitle = title;
        totalBookings = data.totalBookings;
        totalRevenueCents = data.totalRevenueCents;
      });
    };
    // Sort by revenue descending
    let sorted = popularList.sort(func(a, b) {
      if (a.totalRevenueCents > b.totalRevenueCents) #less
      else if (a.totalRevenueCents < b.totalRevenueCents) #greater
      else #equal
    });

    let occupancy = showtimeOccupancy(showtimes, bookings, events);

    {
      totalBookings = totalBookings;
      totalRevenueCents = totalRevenueCents;
      totalUsers = totalUsers;
      popularEvents = sorted.toArray();
      showtimeOccupancy = occupancy;
    };
  };

  public func paymentReconciliation(payments : Map.Map<Nat, PaymentTypes.Payment>) : [Types.PaymentReconciliationRow] {
    let result = List.empty<Types.PaymentReconciliationRow>();
    for ((_, payment) in payments.entries()) {
      let statusText = switch (payment.status) {
        case (#pending) "pending";
        case (#completed) "completed";
        case (#failed) "failed";
        case (#refunded) "refunded";
      };
      result.add({
        paymentId = payment.id;
        bookingId = payment.bookingId;
        userId = payment.userId;
        amountCents = payment.amountCents;
        status = statusText;
        transactionId = payment.transactionId;
        createdAt = payment.createdAt;
      });
    };
    result.toArray();
  };

  public func showtimeOccupancy(
    showtimes : Map.Map<Nat, EventTypes.Showtime>,
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    events : Map.Map<Nat, EventTypes.Event>,
  ) : [Types.ShowtimeOccupancy] {
    // Count booked seats per showtime
    let bookedSeatsMap = Map.empty<Nat, Nat>();
    for ((_, booking) in bookings.entries()) {
      switch (booking.status) {
        case (#confirmed) {
          let current = switch (bookedSeatsMap.get(booking.showtimeId)) {
            case (?n) n;
            case null 0;
          };
          bookedSeatsMap.add(booking.showtimeId, current + booking.items.size());
        };
        case _ {};
      };
    };

    let result = List.empty<Types.ShowtimeOccupancy>();
    for ((_, showtime) in showtimes.entries()) {
      if (showtime.isActive) {
        var totalSeats : Nat = 0;
        for (cat in showtime.seatCategories.values()) {
          totalSeats += cat.totalSeats;
        };
        let booked = switch (bookedSeatsMap.get(showtime.id)) {
          case (?n) n;
          case null 0;
        };
        let occupancyPct = if (totalSeats == 0) 0 else (booked * 100) / totalSeats;
        let title = switch (events.get(showtime.eventId)) {
          case (?ev) ev.title;
          case null "Unknown";
        };
        result.add({
          showtimeId = showtime.id;
          eventTitle = title;
          startTime = showtime.startTime;
          totalSeats = totalSeats;
          bookedSeats = booked;
          occupancyPercent = occupancyPct;
        });
      };
    };
    result.toArray();
  };
};
