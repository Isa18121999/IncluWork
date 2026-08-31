const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ["Postulado", "CV visto", "Aceptado", "Rechazado"],
    default: "Postulado"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ApplicationSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Application", ApplicationSchema);
