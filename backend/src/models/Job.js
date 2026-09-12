const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  area: { type: String, default: "" },
  modality: { type: String, default: "" },
  requirements: { type: [String], default: [] },
  accessibility: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
