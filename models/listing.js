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
      default:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
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

  // ✅ OWNER FIELD ADD KARO
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Listing", listingSchema);
