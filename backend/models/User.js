const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "trainer"],
    required: true
  },
  followedTrainers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
  subscribedPlans: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FitnessPlan" }
  ]
});

module.exports = mongoose.model("User", userSchema);
