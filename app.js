const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();


// =======================
// MongoDB Connection
// =======================
mongoose.connect("mongodb://127.0.0.1:27017/YATRASETU")
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ DB Error:", err));


// =======================
// App Configuration
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// =======================
// Routes
// =======================

// ROOT
app.get("/", (req, res) => {
  res.redirect("/listings");
});


// INDEX
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log(err);
    res.send("Error loading listings");
  }
});


// NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});


// SHOW  ✅ FIXED SIMPLE VERSION
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid ID");
      return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });

  } catch (err) {
    console.log("REAL ERROR:", err);
    res.send("Error loading listing");
  }
});


// CREATE
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send("Error creating listing");
  }
});


// EDIT
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });

  } catch (err) {
    console.log(err);
    res.send("Error loading edit form");
  }
});


// UPDATE
app.put("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${req.params.id}`);

  } catch (err) {
    console.log(err);
    res.send("Error updating listing");
  }
});


// DELETE
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);

    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    res.send("Error deleting listing");
  }
});


app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
