import Common "common";

module {
  public type UserProfile = {
    id : Common.UserId;
    var name : Text;
    var email : Text;
    var createdAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type UserProfilePublic = {
    id : Common.UserId;
    name : Text;
    email : Text;
    createdAt : Common.Timestamp;
  };
};
