const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//connecting to mongo db
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/onlineOfflineTracker";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

/* mongoose.connect("mongodb://localhost/onlineOfflineTracker", {
  useNewUrlParser: true,
  useFindAndModify: false
 }); */

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on  localhost:${PORT}`);
});