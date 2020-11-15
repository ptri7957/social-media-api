const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const app = express();

const users = require("./routes/api/users");
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const following = require("./routes/api/following");
const posts = require("./routes/api/posts");
const comments = require("./routes/api/comments");
const likes = require("./routes/api/likes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount API routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/following", following);
app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/likes", likes);

// Pass current dir location to the request
const root = path.resolve(__dirname);
app.set("currentdir", root);

// Set up static folders
app.use(express.static("client/build"));
app.use(express.static("uploads"))

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server running at ${port}`));
