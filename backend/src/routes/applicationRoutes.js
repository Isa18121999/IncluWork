const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const Company = require("../models/Company");
const calculateMatch = require("../services/matchingService");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "candidate") {
      const candidate = await Candidate.findOne({ userId: req.user.id });
      filter.candidateId = candidate?._id;
    } else if (req.user.role === "company") {
      const company = await Company.findOne({ userId: req.user.id });
      const jobs = await Job.find({ companyId: company?._id }).select("_id");
      filter.jobId = { $in: jobs.map((job) => job._id) };
    }
    const applications = await Application.find(filter).populate({ path: "jobId", populate: { path: "companyId", select: "name" } }).populate("candidateId", "name professionalTitle skills cvUrl").sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) { res.status(500).json({ message: "Error obteniendo postulaciones", error: error.message }); }
});

router.post("/", requireRole("candidate"), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.id });
    const job = await Job.findById(req.body.jobId);
    if (!candidate || !job) return res.status(404).json({ message: "Candidato u oferta no encontrada" });
    const match = calculateMatch(candidate, job);
    const application = await Application.create({ candidateId: candidate._id, jobId: job._id, matchScore: match.score, status: "Postulado" });
    res.status(201).json({ ...application.toObject(), matchScore: match.score, matchedSkills: match.matchedSkills });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Ya te postulaste a esta oferta" });
    res.status(400).json({ message: "Error creando postulación", error: error.message });
  }
});

router.patch("/:id/status", requireRole("company"), async (req, res) => {
  try {
    const allowedStatuses = ["Postulado", "CV visto", "Aceptado", "Rechazado"];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Estado de postulación no válido" });
    const application = await Application.findById(req.params.id).populate("jobId");
    const company = await Company.findOne({ userId: req.user.id });
    if (!application || !company || application.jobId.companyId.toString() !== company._id.toString()) return res.status(404).json({ message: "Postulación no encontrada" });
    application.status = req.body.status;
    application.updatedAt = new Date();
    await application.save();
    res.json(application);
  } catch (error) { res.status(500).json({ message: "Error actualizando postulación", error: error.message }); }
});

module.exports = router;
