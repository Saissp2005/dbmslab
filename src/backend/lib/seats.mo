import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/seats";
import EventTypes "../types/events";
import Common "../types/common";

module {
  public func initializeSeatsForShowtime(
    seats : Map.Map<Nat, Types.Seat>,
    nextIdRef : Nat,
    showtimeId : Common.EntityId,
    venue : EventTypes.Venue,
    seatCategories : [{ category : EventTypes.TicketCategory; priceInCents : Nat; totalSeats : Nat }],
  ) : Nat {
    // Remove any existing seats for this showtime first
    let toRemove = List.empty<Nat>();
    for ((seatId, seat) in seats.entries()) {
      if (seat.showtimeId == showtimeId) {
        toRemove.add(seatId);
      };
    };
    for (seatId in toRemove.values()) {
      seats.remove(seatId);
    };

    // Compute total seats across categories
    var totalSeats : Nat = 0;
    for (cat in seatCategories.values()) {
      totalSeats += cat.totalSeats;
    };

    // Assign seats row-by-row. Each category fills consecutive rows.
    var currentId = nextIdRef;
    var _seatIndex : Nat = 0;
    let cols = venue.layoutCols;

    // Build a flat list of categories per seat slot
    let catList = List.empty<EventTypes.TicketCategory>();
    for (cat in seatCategories.values()) {
      var i = 0;
      while (i < cat.totalSeats) {
        catList.add(cat.category);
        i += 1;
      };
    };

    for ((idx, cat) in catList.enumerate()) {
      let row = idx / cols;
      let col = idx % cols;
      let rowLetter = rowToLetter(row);
      let seatLabelText = rowLetter # (col + 1).toText();
      let seat : Types.Seat = {
        id = currentId;
        showtimeId = showtimeId;
        row = row;
        col = col;
        seatLabel = seatLabelText;
        category = cat;
        var status = #available;
        var bookingId = null;
        var reservedAt = null;
        var reservedBy = null;
      };
      seats.add(currentId, seat);
      currentId += 1;
    };

    currentId;
  };

  public func getSeatMap(seats : Map.Map<Nat, Types.Seat>, showtimeId : Common.EntityId, rows : Nat, cols : Nat) : Types.SeatMapPublic {
    let result = List.empty<Types.SeatPublic>();
    for ((_, seat) in seats.entries()) {
      if (seat.showtimeId == showtimeId) {
        result.add(toPublic(seat));
      };
    };
    // Sort by row then col
    let sorted = result.sort(func(a, b) {
      if (a.row < b.row) #less
      else if (a.row > b.row) #greater
      else if (a.col < b.col) #less
      else if (a.col > b.col) #greater
      else #equal
    });
    {
      showtimeId = showtimeId;
      rows = rows;
      cols = cols;
      seats = sorted.toArray();
    };
  };

  public func reserveSeats(seats : Map.Map<Nat, Types.Seat>, seatIds : [Common.EntityId], userId : Common.UserId) : () {
    // Validate all seats are available first (atomic check)
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          switch (seat.status) {
            case (#available) {};
            case (#reserved) { Runtime.trap("Seat already reserved: " # seatId.toText()) };
            case (#booked) { Runtime.trap("Seat already booked: " # seatId.toText()) };
            case (#blocked) { Runtime.trap("Seat is blocked: " # seatId.toText()) };
          };
        };
      };
    };
    // Now reserve all
    let now = Time.now();
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null {};
        case (?seat) {
          seat.status := #reserved;
          seat.reservedAt := ?now;
          seat.reservedBy := ?userId;
        };
      };
    };
  };

  public func confirmSeatBooking(seats : Map.Map<Nat, Types.Seat>, seatIds : [Common.EntityId], bookingId : Common.EntityId) : () {
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null { Runtime.trap("Seat not found: " # seatId.toText()) };
        case (?seat) {
          seat.status := #booked;
          seat.bookingId := ?bookingId;
          seat.reservedAt := null;
          seat.reservedBy := null;
        };
      };
    };
  };

  public func releaseSeatReservation(seats : Map.Map<Nat, Types.Seat>, seatIds : [Common.EntityId]) : () {
    for (seatId in seatIds.values()) {
      switch (seats.get(seatId)) {
        case null {};
        case (?seat) {
          switch (seat.status) {
            case (#reserved) {
              seat.status := #available;
              seat.reservedAt := null;
              seat.reservedBy := null;
              seat.bookingId := null;
            };
            case (#booked) {
              // On cancellation, release booked seat back to available
              seat.status := #available;
              seat.bookingId := null;
              seat.reservedAt := null;
              seat.reservedBy := null;
            };
            case _ {};
          };
        };
      };
    };
  };

  public func toPublic(seat : Types.Seat) : Types.SeatPublic {
    {
      id = seat.id;
      showtimeId = seat.showtimeId;
      row = seat.row;
      col = seat.col;
      seatLabel = seat.seatLabel;
      category = seat.category;
      status = seat.status;
      bookingId = seat.bookingId;
    };
  };

  public func countAvailableByShowtime(seats : Map.Map<Nat, Types.Seat>, showtimeId : Common.EntityId) : Nat {
    var count : Nat = 0;
    for ((_, seat) in seats.entries()) {
      if (seat.showtimeId == showtimeId) {
        switch (seat.status) {
          case (#available) { count += 1 };
          case _ {};
        };
      };
    };
    count;
  };

  // Count available seats per category for a showtime
  public func countAvailableByCategoryMap(seats : Map.Map<Nat, Types.Seat>, showtimeId : Common.EntityId) : Map.Map<Text, Nat> {
    let result = Map.empty<Text, Nat>();
    for ((_, seat) in seats.entries()) {
      if (seat.showtimeId == showtimeId) {
        switch (seat.status) {
          case (#available) {
            let catKey = categoryToText(seat.category);
            let current = switch (result.get(catKey)) {
              case (?n) n;
              case null 0;
            };
            result.add(catKey, current + 1);
          };
          case _ {};
        };
      };
    };
    result;
  };

  func categoryToText(cat : EventTypes.TicketCategory) : Text {
    switch (cat) {
      case (#vip) "vip";
      case (#regular) "regular";
      case (#balcony) "balcony";
    };
  };

  func rowToLetter(row : Nat) : Text {
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    if (row < 26) {
      letters[row];
    } else {
      let high = row / 26;
      let low = row % 26;
      letters[high - 1] # letters[low];
    };
  };
};
