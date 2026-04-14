import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";

import UserTypes "types/users";
import EventTypes "types/events";
import SeatTypes "types/seats";
import BookingTypes "types/bookings";
import PaymentTypes "types/payments";

import BookingsLib "lib/bookings";
import EventsLib "lib/events";
import PaymentsLib "lib/payments";
import SeatsLib "lib/seats";

import UsersMixin "mixins/users-api";
import EventsMixin "mixins/events-api";
import SeatsMixin "mixins/seats-api";
import BookingsMixin "mixins/bookings-api";
import PaymentsMixin "mixins/payments-api";
import AnalyticsMixin "mixins/analytics-api";

actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- User Profiles ---
  let userProfiles = Map.empty<Principal, UserTypes.UserProfile>();
  include UsersMixin(accessControlState, userProfiles);

  // --- Events, Venues, Showtimes ---
  let events = Map.empty<Nat, EventTypes.Event>();
  let venues = Map.empty<Nat, EventTypes.Venue>();
  let showtimes = Map.empty<Nat, EventTypes.Showtime>();
  var nextEventId : Nat = 1;
  var nextVenueId : Nat = 1;
  var nextShowtimeId : Nat = 1;
  include EventsMixin(accessControlState, events, venues, showtimes);

  // Create functions managed in actor to mutate var counters
  public shared ({ caller }) func createEvent(input : EventTypes.CreateEventInput) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let id = nextEventId;
    nextEventId += 1;
    ignore EventsLib.createEvent(events, id, input, caller);
    id;
  };

  public shared ({ caller }) func createVenue(input : EventTypes.CreateVenueInput) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create venues");
    };
    let id = nextVenueId;
    nextVenueId += 1;
    ignore EventsLib.createVenue(venues, id, input);
    id;
  };

  public shared ({ caller }) func createShowtime(input : EventTypes.CreateShowtimeInput) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create showtimes");
    };
    switch (events.get(input.eventId)) {
      case null { Runtime.trap("Event not found") };
      case _ {};
    };
    switch (venues.get(input.venueId)) {
      case null { Runtime.trap("Venue not found") };
      case _ {};
    };
    let id = nextShowtimeId;
    nextShowtimeId += 1;
    ignore EventsLib.createShowtime(showtimes, id, input);
    id;
  };

  // --- Seats ---
  let seats = Map.empty<Nat, SeatTypes.Seat>();
  var nextSeatId : Nat = 1;
  include SeatsMixin(accessControlState, seats, showtimes, venues);

  // Admin: initialize seat inventory for a showtime
  public shared ({ caller }) func initializeShowtimeSeats(showtimeId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize seats");
    };
    let showtime = switch (showtimes.get(showtimeId)) {
      case null { Runtime.trap("Showtime not found") };
      case (?st) st;
    };
    let venue = switch (venues.get(showtime.venueId)) {
      case null { Runtime.trap("Venue not found") };
      case (?v) v;
    };
    let catInput = showtime.seatCategories.map(
      func(c) {
        {
          category = c.category;
          priceInCents = c.priceInCents;
          totalSeats = c.totalSeats;
        };
      }
    );
    let newNextId = SeatsLib.initializeSeatsForShowtime(seats, nextSeatId, showtimeId, venue, catInput);
    nextSeatId := newNextId;
  };

  // --- Bookings ---
  let bookings = Map.empty<Nat, BookingTypes.Booking>();
  var nextBookingId : Nat = 1;
  include BookingsMixin(accessControlState, bookings, seats, showtimes);

  // createBooking managed here to mutate var nextBookingId
  public shared ({ caller }) func createBooking(input : BookingTypes.CreateBookingInput) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to book");
    };
    let showtime = switch (showtimes.get(input.showtimeId)) {
      case null { Runtime.trap("Showtime not found") };
      case (?st) st;
    };
    let catPrices = Map.empty<Text, Nat>();
    for (cat in showtime.seatCategories.values()) {
      catPrices.add(categoryToText(cat.category), cat.priceInCents);
    };
    let id = nextBookingId;
    nextBookingId += 1;
    ignore BookingsLib.createBookingWithPrices(bookings, seats, id, caller, input, catPrices);
    SeatsLib.confirmSeatBooking(seats, input.seatIds, id);
    id;
  };

  // --- Payments ---
  let payments = Map.empty<Nat, PaymentTypes.Payment>();
  var nextPaymentId : Nat = 1;
  include PaymentsMixin(accessControlState, payments, nextPaymentId, bookings);

  // --- Stripe ---
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?cfg) { cfg };
    };
  };

  public shared ({ caller }) func createCheckoutSession(bookingId : Nat, successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let booking = switch (bookings.get(bookingId)) {
      case null { Runtime.trap("Booking not found") };
      case (?b) b;
    };
    if (not Principal.equal(booking.userId, caller)) {
      Runtime.trap("Unauthorized: Not your booking");
    };
    let lineItems = booking.items.map(
      func(item) : Stripe.ShoppingItem {
        let catName = switch (item.category) {
          case (#vip) "VIP";
          case (#regular) "Regular";
          case (#balcony) "Balcony";
        };
        {
          currency = "usd";
          productName = catName # " Seat - " # item.seatLabel;
          productDescription = "Seat " # item.seatLabel # " (" # catName # ")";
          priceInCents = item.priceInCents;
          quantity = 1;
        };
      }
    );
    let sessionUrl = await Stripe.createCheckoutSession(getStripeConfig(), caller, lineItems, successUrl, cancelUrl, transform);
    let paymentInput : PaymentTypes.CreatePaymentInput = {
      bookingId = bookingId;
      stripeSessionId = sessionUrl;
    };
    let paymentId = nextPaymentId;
    nextPaymentId += 1;
    ignore PaymentsLib.createPayment(payments, paymentId, paymentInput, caller, booking.totalAmountCents);
    sessionUrl;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let status = await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
    switch (status) {
      case (#completed(_)) {
        switch (PaymentsLib.getByStripeSession(payments, sessionId)) {
          case (?payment) {
            switch (payment.status) {
              case (#completed) {};
              case _ {
                PaymentsLib.markCompleted(payments, payment.id, sessionId);
                BookingsLib.confirmBooking(bookings, payment.bookingId);
              };
            };
          };
          case null {};
        };
      };
      case (#failed(_)) {};
    };
    status;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // --- Analytics (admin) ---
  include AnalyticsMixin(accessControlState, bookings, payments, events, showtimes, userProfiles);

  func categoryToText(cat : EventTypes.TicketCategory) : Text {
    switch (cat) {
      case (#vip) "vip";
      case (#regular) "regular";
      case (#balcony) "balcony";
    };
  };
};
