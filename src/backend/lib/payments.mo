import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "../types/payments";
import Common "../types/common";

module {
  public func createPayment(payments : Map.Map<Nat, Types.Payment>, nextId : Nat, input : Types.CreatePaymentInput, userId : Common.UserId, amountCents : Nat) : Types.Payment {
    let payment : Types.Payment = {
      id = nextId;
      bookingId = input.bookingId;
      userId = userId;
      var amountCents = amountCents;
      var status = #pending;
      var transactionId = null;
      var paymentMode = #card;
      var stripeSessionId = ?input.stripeSessionId;
      createdAt = Time.now();
      var completedAt = null;
    };
    payments.add(nextId, payment);
    payment;
  };

  public func markCompleted(payments : Map.Map<Nat, Types.Payment>, paymentId : Common.EntityId, transactionId : Text) : () {
    switch (payments.get(paymentId)) {
      case null { Runtime.trap("Payment not found") };
      case (?payment) {
        payment.status := #completed;
        payment.transactionId := ?transactionId;
        payment.completedAt := ?Time.now();
      };
    };
  };

  public func markFailed(payments : Map.Map<Nat, Types.Payment>, paymentId : Common.EntityId) : () {
    switch (payments.get(paymentId)) {
      case null { Runtime.trap("Payment not found") };
      case (?payment) {
        payment.status := #failed;
      };
    };
  };

  public func markRefunded(payments : Map.Map<Nat, Types.Payment>, paymentId : Common.EntityId) : () {
    switch (payments.get(paymentId)) {
      case null { Runtime.trap("Payment not found") };
      case (?payment) {
        payment.status := #refunded;
      };
    };
  };

  public func getByBooking(payments : Map.Map<Nat, Types.Payment>, bookingId : Common.EntityId) : ?Types.PaymentPublic {
    for ((_, payment) in payments.entries()) {
      if (payment.bookingId == bookingId) {
        return ?toPublic(payment);
      };
    };
    null;
  };

  public func getByStripeSession(payments : Map.Map<Nat, Types.Payment>, sessionId : Text) : ?Types.Payment {
    for ((_, payment) in payments.entries()) {
      switch (payment.stripeSessionId) {
        case (?sid) {
          if (sid == sessionId) { return ?payment };
        };
        case null {};
      };
    };
    null;
  };

  public func toPublic(payment : Types.Payment) : Types.PaymentPublic {
    {
      id = payment.id;
      bookingId = payment.bookingId;
      userId = payment.userId;
      amountCents = payment.amountCents;
      status = payment.status;
      transactionId = payment.transactionId;
      paymentMode = payment.paymentMode;
      stripeSessionId = payment.stripeSessionId;
      createdAt = payment.createdAt;
      completedAt = payment.completedAt;
    };
  };

  public func listAll(payments : Map.Map<Nat, Types.Payment>) : [Types.PaymentPublic] {
    let result = List.empty<Types.PaymentPublic>();
    for ((_, payment) in payments.entries()) {
      result.add(toPublic(payment));
    };
    result.toArray();
  };
};
