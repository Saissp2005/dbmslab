import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import PaymentTypes "../types/payments";
import BookingTypes "../types/bookings";
import PaymentsLib "../lib/payments";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  payments : Map.Map<Nat, PaymentTypes.Payment>,
  nextPaymentId : Nat,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
) {
  public query ({ caller }) func getMyPayment(bookingId : Nat) : async ?PaymentTypes.PaymentPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    // Verify ownership
    switch (bookings.get(bookingId)) {
      case null { return null };
      case (?booking) {
        if (not Principal.equal(booking.userId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not your booking");
        };
      };
    };
    PaymentsLib.getByBooking(payments, bookingId);
  };

  // Admin: list all payments
  public query ({ caller }) func listAllPayments() : async [PaymentTypes.PaymentPublic] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all payments");
    };
    PaymentsLib.listAll(payments);
  };
};
