// tests to see if we are connected to the database
// node tests/connectTest.js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/friendsDB");

mongoose.connection.on("error", function () {
  console.log("friendsDB database connection error");
});
mongoose.connection.on("open", function () {
  console.log("Successful connection to friendsDB database");
});
console.log("Connecting to friendsDB database in progress...");
