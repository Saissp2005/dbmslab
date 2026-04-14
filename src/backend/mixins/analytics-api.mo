import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AnalyticsTypes "../types/analytics";
import AnalyticsLib "../lib/analytics";
import Common "../types/common";
import BookingTypes "../types/bookings";
import EventTypes "../types/events";
import PaymentTypes "../types/payments";
import UserTypes "../types/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  payments : Map.Map<Nat, PaymentTypes.Payment>,
  events : Map.Map<Nat, EventTypes.Event>,
  showtimes : Map.Map<Nat, EventTypes.Showtime>,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
) {
  public query ({ caller }) func getAdminAnalytics() : async AnalyticsTypes.AdminAnalytics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    AnalyticsLib.computeAnalytics(bookings, payments, events, showtimes, userProfiles);
  };

  public query ({ caller }) func getPaymentReconciliation() : async [AnalyticsTypes.PaymentReconciliationRow] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view reconciliation");
    };
    AnalyticsLib.paymentReconciliation(payments);
  };

  public query ({ caller }) func getShowtimeOccupancy() : async [AnalyticsTypes.ShowtimeOccupancy] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view occupancy data");
    };
    AnalyticsLib.showtimeOccupancy(showtimes, bookings, events);
  };
};
