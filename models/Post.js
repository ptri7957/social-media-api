const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  body: {
      type: String,
      require: true
  },
  created_at: {
      type: Date,
      default: Date.now
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
