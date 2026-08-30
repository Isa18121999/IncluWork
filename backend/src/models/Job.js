const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  companyId: String,
  area: String,
  modality: String,
  requirements: [String],
  accessibility: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
