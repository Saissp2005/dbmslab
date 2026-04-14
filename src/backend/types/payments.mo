import Common "common";

module {
  public type PaymentStatus = { #pending; #completed; #failed; #refunded };

  public type PaymentMode = { #card; #other };

  public type Payment = {
    id : Common.EntityId;
    bookingId : Common.EntityId;
    userId : Common.UserId;
    var amountCents : Nat;
    var status : PaymentStatus;
    var transactionId : ?Text;
    var paymentMode : PaymentMode;
    var stripeSessionId : ?Text;
    createdAt : Common.Timestamp;
    var completedAt : ?Common.Timestamp;
  };

  // Shared immutable type for API boundary
  public type PaymentPublic = {
    id : Common.EntityId;
    bookingId : Common.EntityId;
    userId : Common.UserId;
    amountCents : Nat;
    status : PaymentStatus;
    transactionId : ?Text;
    paymentMode : PaymentMode;
    stripeSessionId : ?Text;
    createdAt : Common.Timestamp;
    completedAt : ?Common.Timestamp;
  };

  public type CreatePaymentInput = {
    bookingId : Common.EntityId;
    stripeSessionId : Text;
  };
};
