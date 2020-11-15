const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Like = mongoose.model("Like", likesSchema);

module.exports = Like;
