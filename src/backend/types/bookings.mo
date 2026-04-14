import Common "common";
import Events "events";

module {
  public type BookingStatus = { #pending; #confirmed; #cancelled };

  public type RefundStatus = { #notApplicable; #pending; #refunded; #nonRefundable };

  public type BookingItem = {
    seatId : Common.EntityId;
    seatLabel : Text;
    category : Events.TicketCategory;
    priceInCents : Nat;
  };

  public type Booking = {
    id : Common.EntityId;
    userId : Common.UserId;
    showtimeId : Common.EntityId;
    var items : [BookingItem];
    var totalAmountCents : Nat;
    var status : BookingStatus;
    var refundStatus : RefundStatus;
    var qrReference : Text;
    createdAt : Common.Timestamp;
    var cancelledAt : ?Common.Timestamp;
  };

  // Shared immutable type for API boundary
  public type BookingPublic = {
    id : Common.EntityId;
    userId : Common.UserId;
    showtimeId : Common.EntityId;
    items : [BookingItem];
    totalAmountCents : Nat;
    status : BookingStatus;
    refundStatus : RefundStatus;
    qrReference : Text;
    createdAt : Common.Timestamp;
    cancelledAt : ?Common.Timestamp;
  };

  public type BookingFilter = {
    status : ?BookingStatus;
    showtimeId : ?Common.EntityId;
  };

  public type CreateBookingInput = {
    showtimeId : Common.EntityId;
    seatIds : [Common.EntityId];
  };
};
