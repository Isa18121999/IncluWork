const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const calculateMatch = require("../services/matchingService");

const getRecommendedCandidates = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    const candidates = await Candidate.find();

    const recommendations = candidates.map((candidate) => ({
      ...candidate.toObject(),
      ...calculateMatch(candidate, job || {})
    })).sort((a, b) => b.score - a.score);

    res.json({
      jobId: req.params.jobId,
      candidates: recommendations
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo candidatos", error: error.message });
  }
};

module.exports = { getRecommendedCandidates };
