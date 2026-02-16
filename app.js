const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/YATRASETU";

// =======================
// ✅ MongoDB Connection
// =======================
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ DB Error:", err));

// =======================
// ✅ App Configuration
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// =======================
// ✅ Session + Flash Setup
// =======================
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

// =======================
// ✅ Global Middleware
// =======================

// Flash locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = null; // later auth me change karenge
  next();
});

// =======================
// ✅ Routes
// =======================

// Root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// 🔹 INDEX
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

// 🔹 NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// 🔹 SHOW
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading listing");
  }
});

// 🔹 CREATE
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating listing");
  }
});

// 🔹 EDIT
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading edit form");
  }
});

// 🔹 UPDATE
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating listing");
  }
});

// 🔹 DELETE
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting listing");
  }
});

// =======================
// ✅ Start Server
// =======================
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
