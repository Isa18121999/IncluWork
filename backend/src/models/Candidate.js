const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  userId: String,
  name: String,
  professionalTitle: String,
  experience: Number,
  skills: [String],
  education: String,
  modality: String,
  cvUrl: String,
  accessibility: [String]
});

module.exports = mongoose.model("Candidate", CandidateSchema);
