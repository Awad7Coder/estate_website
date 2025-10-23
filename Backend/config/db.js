const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB run success");
  } catch (e) {
    console.log("Error connection", e.message);
    process.exit(1);
  }
};
module.exports = db;
