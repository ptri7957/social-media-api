const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  bio: {
      type: String
  },
  location: {
      type: String
  },
  profilePic: {
      type: String
  }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
