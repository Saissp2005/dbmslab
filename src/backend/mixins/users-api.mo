import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/users";
import UsersLib "../lib/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfilePublic {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(name : Text, email : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    UsersLib.updateProfile(userProfiles, caller, name, email);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserTypes.UserProfilePublic {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    UsersLib.getProfile(userProfiles, user);
  };
};
