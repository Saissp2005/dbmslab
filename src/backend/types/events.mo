import Common "common";

module {
  public type EventType = { #movie; #concert; #workshop; #sports; #other };

  public type Event = {
    id : Common.EntityId;
    var title : Text;
    var description : Text;
    var eventType : EventType;
    var genre : Text;
    var durationMinutes : Nat;
    var imageUrls : [Text];
    var isActive : Bool;
    createdAt : Common.Timestamp;
    createdBy : Common.UserId;
  };

  public type Venue = {
    id : Common.EntityId;
    var name : Text;
    var address : Text;
    var totalSeats : Nat;
    var layoutRows : Nat;
    var layoutCols : Nat;
    var isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type TicketCategory = { #vip; #regular; #balcony };

  public type ShowtimeSeatCategory = {
    category : TicketCategory;
    var priceInCents : Nat;
    var totalSeats : Nat;
  };

  public type Showtime = {
    id : Common.EntityId;
    eventId : Common.EntityId;
    venueId : Common.EntityId;
    var startTime : Common.Timestamp;
    var endTime : Common.Timestamp;
    var seatCategories : [ShowtimeSeatCategory];
    var isActive : Bool;
    createdAt : Common.Timestamp;
  };

  // Shared API types (no var fields)
  public type EventPublic = {
    id : Common.EntityId;
    title : Text;
    description : Text;
    eventType : EventType;
    genre : Text;
    durationMinutes : Nat;
    imageUrls : [Text];
    isActive : Bool;
    createdAt : Common.Timestamp;
    createdBy : Common.UserId;
  };

  public type VenuePublic = {
    id : Common.EntityId;
    name : Text;
    address : Text;
    totalSeats : Nat;
    layoutRows : Nat;
    layoutCols : Nat;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type ShowtimeSeatCategoryPublic = {
    category : TicketCategory;
    priceInCents : Nat;
    totalSeats : Nat;
    availableSeats : Nat;
  };

  public type ShowtimePublic = {
    id : Common.EntityId;
    eventId : Common.EntityId;
    venueId : Common.EntityId;
    startTime : Common.Timestamp;
    endTime : Common.Timestamp;
    seatCategories : [ShowtimeSeatCategoryPublic];
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type EventFilter = {
    title : ?Text;
    eventType : ?EventType;
    dateFrom : ?Common.Timestamp;
    dateTo : ?Common.Timestamp;
    venueId : ?Common.EntityId;
    minPriceCents : ?Nat;
    maxPriceCents : ?Nat;
  };

  public type CreateEventInput = {
    title : Text;
    description : Text;
    eventType : EventType;
    genre : Text;
    durationMinutes : Nat;
    imageUrls : [Text];
  };

  public type UpdateEventInput = {
    id : Common.EntityId;
    title : Text;
    description : Text;
    eventType : EventType;
    genre : Text;
    durationMinutes : Nat;
    imageUrls : [Text];
  };

  public type CreateVenueInput = {
    name : Text;
    address : Text;
    totalSeats : Nat;
    layoutRows : Nat;
    layoutCols : Nat;
  };

  public type UpdateVenueInput = {
    id : Common.EntityId;
    name : Text;
    address : Text;
    totalSeats : Nat;
    layoutRows : Nat;
    layoutCols : Nat;
  };

  public type CreateShowtimeInput = {
    eventId : Common.EntityId;
    venueId : Common.EntityId;
    startTime : Common.Timestamp;
    seatCategories : [{ category : TicketCategory; priceInCents : Nat; totalSeats : Nat }];
  };
};
