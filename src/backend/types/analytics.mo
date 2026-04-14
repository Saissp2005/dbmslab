import Common "common";

module {
  public type RevenueByEvent = {
    eventId : Common.EntityId;
    eventTitle : Text;
    totalBookings : Nat;
    totalRevenueCents : Nat;
  };

  public type ShowtimeOccupancy = {
    showtimeId : Common.EntityId;
    eventTitle : Text;
    startTime : Common.Timestamp;
    totalSeats : Nat;
    bookedSeats : Nat;
    occupancyPercent : Nat;
  };

  public type AdminAnalytics = {
    totalBookings : Nat;
    totalRevenueCents : Nat;
    totalUsers : Nat;
    popularEvents : [RevenueByEvent];
    showtimeOccupancy : [ShowtimeOccupancy];
  };

  public type PaymentReconciliationRow = {
    paymentId : Common.EntityId;
    bookingId : Common.EntityId;
    userId : Common.UserId;
    amountCents : Nat;
    status : Text;
    transactionId : ?Text;
    createdAt : Common.Timestamp;
  };
};
