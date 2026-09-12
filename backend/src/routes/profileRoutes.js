const express = require("express");
const Candidate = require("../models/Candidate");
const Company = require("../models/Company");
const Job = require("../models/Job");
const calculateMatch = require("../services/matchingService");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const candidateFields = ["name", "professionalTitle", "experience", "skills", "education", "modality", "accessibility"];
const companyFields = ["name", "sector", "country", "description", "inclusionPolicy", "accessibilityOptions"];
const pick = (source, fields) => Object.fromEntries(fields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]));

router.get("/me", requireAuth, async (req, res) => {
  try {
    const Model = req.user.role === "company" ? Company : Candidate;
    const profile = await Model.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });
    return res.json(profile);
  } catch (error) { return res.status(500).json({ message: "Error obteniendo perfil", error: error.message }); }
});

router.get("/matches", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "candidate") return res.status(403).json({ message: "Solo los candidatos tienen matches" });
    const candidate = await Candidate.findOne({ userId: req.user.id });
    if (!candidate) return res.status(404).json({ message: "Perfil de candidato no encontrado" });
    const jobs = await Job.find().populate("companyId", "name").sort({ createdAt: -1 });
    const matches = jobs.map((job) => {
      const match = calculateMatch(candidate, job);
      return {
        ...job.toObject(),
        score: match.score,
        breakdown: match.breakdown,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        matchedAccessibility: match.matchedAccessibility,
        missingAccessibility: match.missingAccessibility,
        reasons: match.reasons
      };
    }).sort((a, b) => b.score - a.score);
    return res.json({ candidateId: candidate._id, matches });
  } catch (error) { return res.status(500).json({ message: "Error obteniendo matches", error: error.message }); }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const isCompany = req.user.role === "company";
    const Model = isCompany ? Company : Candidate;
    const changes = pick(req.body, isCompany ? companyFields : candidateFields);
    if (changes.experience !== undefined) changes.experience = Number(changes.experience) || 0;
    if (changes.skills !== undefined && !Array.isArray(changes.skills)) return res.status(400).json({ message: "skills debe ser una lista" });
    const profile = await Model.findOneAndUpdate({ userId: req.user.id }, changes, { new: true, runValidators: true });
    if (!profile) return res.status(404).json({ message: "Perfil no encontrado" });
    return res.json(profile);
  } catch (error) { return res.status(500).json({ message: "Error actualizando perfil", error: error.message }); }
});

module.exports = router;
