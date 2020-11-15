const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useUnifiedTopology", true);
    await mongoose.connect(config.get("mongoURI"));
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
