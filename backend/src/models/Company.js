const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  sector: { type: String, default: "" },
  country: { type: String, default: "" },
  description: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  inclusionPolicy: { type: String, default: "" },
  accessibilityOptions: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);
