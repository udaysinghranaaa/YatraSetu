const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // adjust path if needed

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/YATRASETU";

// Connect to DB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Hi I am the root");
});

// Test route to insert a sample listing
app.get("/testListing", async (req, res) => {
  try {
    const sampleListing = new Listing({
      title: "My New Villa",
      description: "By the beach",
      price: 1200,
      location: "Calangute, Goa",
      country: "India",
    });

    await sampleListing.save();
    console.log("✅ Sample listing saved");
    res.send("Successful testing");
  } catch (err) {
    console.error("❌ Error saving listing:", err);
    res.status(500).send("Failed to save listing");
  }
});

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});