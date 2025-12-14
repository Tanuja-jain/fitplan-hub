const mongoose = require("mongoose");

const fitnessPlanSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    duration: Number,
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FitnessPlan", fitnessPlanSchema);
