import Common "common";
import Events "events";

module {
  public type SeatStatus = { #available; #reserved; #booked; #blocked };

  public type Seat = {
    id : Common.EntityId;
    showtimeId : Common.EntityId;
    row : Nat;
    col : Nat;
    seatLabel : Text;
    category : Events.TicketCategory;
    var status : SeatStatus;
    var bookingId : ?Common.EntityId;
    var reservedAt : ?Common.Timestamp;
    var reservedBy : ?Common.UserId;
  };

  public type SeatPublic = {
    id : Common.EntityId;
    showtimeId : Common.EntityId;
    row : Nat;
    col : Nat;
    seatLabel : Text;
    category : Events.TicketCategory;
    status : SeatStatus;
    bookingId : ?Common.EntityId;
  };

  public type SeatMapPublic = {
    showtimeId : Common.EntityId;
    rows : Nat;
    cols : Nat;
    seats : [SeatPublic];
  };

  public type ReserveSeatInput = {
    showtimeId : Common.EntityId;
    seatIds : [Common.EntityId];
  };
};
