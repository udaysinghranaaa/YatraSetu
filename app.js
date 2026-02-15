const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/YATRASETU";

// ✅ Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// ✅ App configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// ✅ Index route: show all listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Failed to load listings");
  }
});

// ✅ New route: form to create listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// ✅ Show route: show one listing by ID
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("listings/show", { listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).send("Failed to load listing");
  }
});

// ✅ Create route: save new listing
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).send("Failed to create listing");
  }
});

// ✅ Edit route: form to edit listing
app.get("/listings/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    res.render("listings/edit", { listing });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Failed to load edit form");
  }
});

// ✅ Update route: apply changes
app.put("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).send("Failed to update listing");
  }
});

// ✅ Delete route: remove listing
app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).send("Failed to delete listing");
  }
});

// ✅ Start server
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});