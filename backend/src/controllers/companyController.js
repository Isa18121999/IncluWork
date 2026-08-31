const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const Application = require("../models/Application");
const calculateMatch = require("../services/matchingService");

const getRecommendedCandidates = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    const candidates = await Candidate.find();
    const applications = await Application.find({ jobId: job._id });

    const recommendations = candidates.map((candidate) => {
      const match = calculateMatch(candidate, job);
      const application = applications.find(
        (item) => item.candidateId.toString() === candidate._id.toString()
      );

      return {
        ...candidate.toObject(),
        score: match.score,
        matchedSkills: match.matchedSkills,
        applicationId: application?._id || null,
        status: application?.status || "No postulado"
      };
    }).sort((a, b) => b.score - a.score);

    res.json({
      jobId: job._id,
      candidates: recommendations
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo candidatos", error: error.message });
  }
};

module.exports = { getRecommendedCandidates };
