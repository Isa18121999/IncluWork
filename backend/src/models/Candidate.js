const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  country: String,
  accreditationType: String,
  accreditationNumber: String,
  professionalTitle: String,
  experience: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  education: String,
  modality: String,
  cvUrl: String,
  accessibility: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Candidate", CandidateSchema);
