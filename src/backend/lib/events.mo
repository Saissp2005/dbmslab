import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/events";
import Common "../types/common";

module {
  public func createEvent(events : Map.Map<Nat, Types.Event>, nextId : Nat, input : Types.CreateEventInput, caller : Common.UserId) : Types.Event {
    let event : Types.Event = {
      id = nextId;
      var title = input.title;
      var description = input.description;
      var eventType = input.eventType;
      var genre = input.genre;
      var durationMinutes = input.durationMinutes;
      var imageUrls = input.imageUrls;
      var isActive = true;
      createdAt = Time.now();
      createdBy = caller;
    };
    events.add(nextId, event);
    event;
  };

  public func updateEvent(events : Map.Map<Nat, Types.Event>, input : Types.UpdateEventInput) : () {
    switch (events.get(input.id)) {
      case null { Runtime.trap("Event not found") };
      case (?event) {
        event.title := input.title;
        event.description := input.description;
        event.eventType := input.eventType;
        event.genre := input.genre;
        event.durationMinutes := input.durationMinutes;
        event.imageUrls := input.imageUrls;
      };
    };
  };

  public func deactivateEvent(events : Map.Map<Nat, Types.Event>, eventId : Common.EntityId) : () {
    switch (events.get(eventId)) {
      case null { Runtime.trap("Event not found") };
      case (?event) { event.isActive := false };
    };
  };

  public func toEventPublic(event : Types.Event) : Types.EventPublic {
    {
      id = event.id;
      title = event.title;
      description = event.description;
      eventType = event.eventType;
      genre = event.genre;
      durationMinutes = event.durationMinutes;
      imageUrls = event.imageUrls;
      isActive = event.isActive;
      createdAt = event.createdAt;
      createdBy = event.createdBy;
    };
  };

  public func createVenue(venues : Map.Map<Nat, Types.Venue>, nextId : Nat, input : Types.CreateVenueInput) : Types.Venue {
    let venue : Types.Venue = {
      id = nextId;
      var name = input.name;
      var address = input.address;
      var totalSeats = input.totalSeats;
      var layoutRows = input.layoutRows;
      var layoutCols = input.layoutCols;
      var isActive = true;
      createdAt = Time.now();
    };
    venues.add(nextId, venue);
    venue;
  };

  public func updateVenue(venues : Map.Map<Nat, Types.Venue>, input : Types.UpdateVenueInput) : () {
    switch (venues.get(input.id)) {
      case null { Runtime.trap("Venue not found") };
      case (?venue) {
        venue.name := input.name;
        venue.address := input.address;
        venue.totalSeats := input.totalSeats;
        venue.layoutRows := input.layoutRows;
        venue.layoutCols := input.layoutCols;
      };
    };
  };

  public func deactivateVenue(venues : Map.Map<Nat, Types.Venue>, venueId : Common.EntityId) : () {
    switch (venues.get(venueId)) {
      case null { Runtime.trap("Venue not found") };
      case (?venue) { venue.isActive := false };
    };
  };

  public func toVenuePublic(venue : Types.Venue) : Types.VenuePublic {
    {
      id = venue.id;
      name = venue.name;
      address = venue.address;
      totalSeats = venue.totalSeats;
      layoutRows = venue.layoutRows;
      layoutCols = venue.layoutCols;
      isActive = venue.isActive;
      createdAt = venue.createdAt;
    };
  };

  public func createShowtime(showtimes : Map.Map<Nat, Types.Showtime>, nextId : Nat, input : Types.CreateShowtimeInput) : Types.Showtime {
    // Compute endTime based on event duration if needed; for now caller provides startTime
    // and we compute a default endTime as startTime + 3 hours if not set
    let cats : [Types.ShowtimeSeatCategory] = input.seatCategories.map<{ category : Types.TicketCategory; priceInCents : Nat; totalSeats : Nat }, Types.ShowtimeSeatCategory>(
      func(c) : Types.ShowtimeSeatCategory {
        {
          category = c.category;
          var priceInCents = c.priceInCents;
          var totalSeats = c.totalSeats;
        };
      }
    );
    let endTime = input.startTime + 10_800_000_000_000; // default 3h in nanoseconds
    let showtime : Types.Showtime = {
      id = nextId;
      eventId = input.eventId;
      venueId = input.venueId;
      var startTime = input.startTime;
      var endTime = endTime;
      var seatCategories = cats;
      var isActive = true;
      createdAt = Time.now();
    };
    showtimes.add(nextId, showtime);
    showtime;
  };

  public func toShowtimePublic(showtime : Types.Showtime, availableByCategory : Map.Map<Text, Nat>) : Types.ShowtimePublic {
    let catPubs = showtime.seatCategories.map(
      func(c) : Types.ShowtimeSeatCategoryPublic {
        let catKey = categoryToText(c.category);
        let available = switch (availableByCategory.get(catKey)) {
          case (?n) n;
          case null c.totalSeats;
        };
        {
          category = c.category;
          priceInCents = c.priceInCents;
          totalSeats = c.totalSeats;
          availableSeats = available;
        };
      }
    );
    {
      id = showtime.id;
      eventId = showtime.eventId;
      venueId = showtime.venueId;
      startTime = showtime.startTime;
      endTime = showtime.endTime;
      seatCategories = catPubs;
      isActive = showtime.isActive;
      createdAt = showtime.createdAt;
    };
  };

  public func filterShowtimes(showtimes : Map.Map<Nat, Types.Showtime>, eventFilter : Types.EventFilter) : [Types.Showtime] {
    let result = List.empty<Types.Showtime>();
    for ((_, st) in showtimes.entries()) {
      if (st.isActive) {
        let matchesVenue = switch (eventFilter.venueId) {
          case (?vid) { st.venueId == vid };
          case null { true };
        };
        let matchesDateFrom = switch (eventFilter.dateFrom) {
          case (?from) { st.startTime >= from };
          case null { true };
        };
        let matchesDateTo = switch (eventFilter.dateTo) {
          case (?to) { st.startTime <= to };
          case null { true };
        };
        if (matchesVenue and matchesDateFrom and matchesDateTo) {
          result.add(st);
        };
      };
    };
    result.toArray();
  };

  public func categoryToText(cat : Types.TicketCategory) : Text {
    switch (cat) {
      case (#vip) "vip";
      case (#regular) "regular";
      case (#balcony) "balcony";
    };
  };
};
