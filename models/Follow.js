const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  followee: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  follower: {
      type: Schema.Types.ObjectId,
      ref: "User"
  }
});

const Follower = mongoose.model("Follow", followSchema);

module.exports = Follower;
