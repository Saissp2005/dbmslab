import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import SeatTypes "../types/seats";
import EventTypes "../types/events";
import SeatsLib "../lib/seats";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  seats : Map.Map<Nat, SeatTypes.Seat>,
  showtimes : Map.Map<Nat, EventTypes.Showtime>,
  venues : Map.Map<Nat, EventTypes.Venue>,
) {
  public query func getSeatMap(showtimeId : Nat) : async SeatTypes.SeatMapPublic {
    let (rows, cols) = switch (showtimes.get(showtimeId)) {
      case (?st) {
        switch (venues.get(st.venueId)) {
          case (?v) (v.layoutRows, v.layoutCols);
          case null (10, 10);
        };
      };
      case null (10, 10);
    };
    SeatsLib.getSeatMap(seats, showtimeId, rows, cols);
  };

  public shared ({ caller }) func reserveSeats(input : SeatTypes.ReserveSeatInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to reserve seats");
    };
    // Validate all seats belong to the specified showtime
    for (seatId in input.seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          if (seat.showtimeId != input.showtimeId) {
            Runtime.trap("Seat does not belong to showtime");
          };
        };
      };
    };
    SeatsLib.reserveSeats(seats, input.seatIds, caller);
  };

  public shared ({ caller }) func releaseReservation(showtimeId : Nat, seatIds : [Nat]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    // Only release seats reserved by the caller
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null {};
        case (?seat) {
          if (seat.showtimeId != showtimeId) {
            Runtime.trap("Seat does not belong to showtime");
          };
          switch (seat.reservedBy) {
            case (?reservedBy) {
              if (not Principal.equal(reservedBy, caller)) {
                Runtime.trap("Cannot release seat reserved by another user");
              };
            };
            case null {};
          };
        };
      };
    };
    SeatsLib.releaseSeatReservation(seats, seatIds);
  };

  // Admin: block/unblock seats
  public shared ({ caller }) func blockSeats(showtimeId : Nat, seatIds : [Nat]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can block seats");
    };
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          if (seat.showtimeId != showtimeId) {
            Runtime.trap("Seat does not belong to showtime");
          };
          seat.status := #blocked;
        };
      };
    };
  };

  public shared ({ caller }) func unblockSeats(showtimeId : Nat, seatIds : [Nat]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can unblock seats");
    };
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          if (seat.showtimeId != showtimeId) {
            Runtime.trap("Seat does not belong to showtime");
          };
          switch (seat.status) {
            case (#blocked) { seat.status := #available };
            case _ {};
          };
        };
      };
    };
  };
};
