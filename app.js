const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");   // ✅ fixed import

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/YATRASETU";

// Connect to DB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Root route
app.get("/", (req, res) => {
  res.send("Hi I am the root");
});

app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });  // ✅ fixed render
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Failed to load listings");
  }
});

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});