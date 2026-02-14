const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/YATRASETU";

main()
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

async function main() {
  // yahan variable use karo, string literal nahi
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi I am the root");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});