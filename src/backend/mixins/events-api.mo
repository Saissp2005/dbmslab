import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import EventTypes "../types/events";
import EventsLib "../lib/events";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  events : Map.Map<Nat, EventTypes.Event>,
  venues : Map.Map<Nat, EventTypes.Venue>,
  showtimes : Map.Map<Nat, EventTypes.Showtime>,
) {
  // --- Public browse ---
  public query func listEvents(filter : ?EventTypes.EventFilter) : async [EventTypes.EventPublic] {
    let result = List.empty<EventTypes.EventPublic>();
    for ((_, event) in events.entries()) {
      if (event.isActive) {
        let matches = switch (filter) {
          case null true;
          case (?f) {
            let matchesTitle = switch (f.title) {
              case (?t) { event.title.toLower().contains(#text (t.toLower())) };
              case null true;
            };
            let matchesType = switch (f.eventType) {
              case (?et) {
                switch (et, event.eventType) {
                  case (#movie, #movie) true;
                  case (#concert, #concert) true;
                  case (#workshop, #workshop) true;
                  case (#sports, #sports) true;
                  case (#other, #other) true;
                  case _ false;
                };
              };
              case null true;
            };
            matchesTitle and matchesType;
          };
        };
        if (matches) {
          result.add(EventsLib.toEventPublic(event));
        };
      };
    };
    result.toArray();
  };

  public query func getEvent(eventId : Nat) : async ?EventTypes.EventPublic {
    switch (events.get(eventId)) {
      case (?event) { ?EventsLib.toEventPublic(event) };
      case null null;
    };
  };

  public query func listVenues() : async [EventTypes.VenuePublic] {
    let result = List.empty<EventTypes.VenuePublic>();
    for ((_, venue) in venues.entries()) {
      if (venue.isActive) {
        result.add(EventsLib.toVenuePublic(venue));
      };
    };
    result.toArray();
  };

  public query func getVenue(venueId : Nat) : async ?EventTypes.VenuePublic {
    switch (venues.get(venueId)) {
      case (?venue) { ?EventsLib.toVenuePublic(venue) };
      case null null;
    };
  };

  public query func listShowtimes(eventId : ?Nat, venueId : ?Nat) : async [EventTypes.ShowtimePublic] {
    let result = List.empty<EventTypes.ShowtimePublic>();
    for ((_, showtime) in showtimes.entries()) {
      if (showtime.isActive) {
        let matchesEvent = switch (eventId) {
          case (?eid) { showtime.eventId == eid };
          case null true;
        };
        let matchesVenue = switch (venueId) {
          case (?vid) { showtime.venueId == vid };
          case null true;
        };
        if (matchesEvent and matchesVenue) {
          let emptyMap = Map.empty<Text, Nat>();
          result.add(EventsLib.toShowtimePublic(showtime, emptyMap));
        };
      };
    };
    result.toArray();
  };

  public query func getShowtime(showtimeId : Nat) : async ?EventTypes.ShowtimePublic {
    switch (showtimes.get(showtimeId)) {
      case (?showtime) {
        let emptyMap = Map.empty<Text, Nat>();
        ?EventsLib.toShowtimePublic(showtime, emptyMap);
      };
      case null null;
    };
  };

  // --- Admin CRUD (no counter mutations) ---
  public shared ({ caller }) func updateEvent(input : EventTypes.UpdateEventInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    EventsLib.updateEvent(events, input);
  };

  public shared ({ caller }) func deleteEvent(eventId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    EventsLib.deactivateEvent(events, eventId);
  };

  public shared ({ caller }) func updateVenue(input : EventTypes.UpdateVenueInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update venues");
    };
    EventsLib.updateVenue(venues, input);
  };

  public shared ({ caller }) func deleteVenue(venueId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete venues");
    };
    EventsLib.deactivateVenue(venues, venueId);
  };

  public shared ({ caller }) func deleteShowtime(showtimeId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete showtimes");
    };
    switch (showtimes.get(showtimeId)) {
      case null { Runtime.trap("Showtime not found") };
      case (?st) { st.isActive := false };
    };
  };
};
