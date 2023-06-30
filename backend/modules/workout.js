const db = require("./connection.js");
const mongoose = require("mongoose");

const Workout = mongoose.model("Workout", {
  title: String,
  userId: String,
});
module.exports = Workout;