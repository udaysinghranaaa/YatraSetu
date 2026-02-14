const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8",
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: "Unknown",
  },
  country: {
    type: String,
    default: "Unknown",
  },
});

module.exports = mongoose.model("Listing", listingSchema);