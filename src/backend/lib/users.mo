import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/users";
import Common "../types/common";

module {
  public func getProfile(users : Map.Map<Principal, Types.UserProfile>, userId : Common.UserId) : ?Types.UserProfilePublic {
    switch (users.get(userId)) {
      case (?p) { ?toPublic(p) };
      case null { null };
    };
  };

  public func ensureProfile(users : Map.Map<Principal, Types.UserProfile>, userId : Common.UserId) : Types.UserProfile {
    switch (users.get(userId)) {
      case (?p) { p };
      case null {
        let profile : Types.UserProfile = {
          id = userId;
          var name = "";
          var email = "";
          var createdAt = Time.now();
        };
        users.add(userId, profile);
        profile;
      };
    };
  };

  public func toPublic(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      name = profile.name;
      email = profile.email;
      createdAt = profile.createdAt;
    };
  };

  public func updateProfile(users : Map.Map<Principal, Types.UserProfile>, userId : Common.UserId, name : Text, email : Text) : () {
    let profile = ensureProfile(users, userId);
    profile.name := name;
    profile.email := email;
  };

  public func getUserBookingHistory(_users : Map.Map<Principal, Types.UserProfile>, _userId : Common.UserId) : [Common.EntityId] {
    // Booking history is tracked in the bookings map, not per user profile
    [];
  };
};
