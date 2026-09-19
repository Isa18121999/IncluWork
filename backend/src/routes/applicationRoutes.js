const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const Company = require("../models/Company");
const calculateMatch = require("../services/matchingService");
const { requireAuth, requireRole } = require("../middleware/auth");
const { createNotification } = require("../services/notificationService");

router.use(requireAuth, requireRole("candidate", "company"));

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "candidate") {
      const candidate = await Candidate.findOne({ userId: req.user.id }).select("_id");
      if (!candidate) return res.status(404).json({ message: "Perfil de candidato no encontrado" });
      filter.candidateId = candidate._id;
    } else {
      const company = await Company.findOne({ userId: req.user.id }).select("_id");
      if (!company) return res.status(404).json({ message: "Perfil de empresa no encontrado" });
      const jobs = await Job.find({ companyId: company._id }).select("_id");
      filter.jobId = { $in: jobs.map((job) => job._id) };
    }

    const applications = await Application.find(filter)
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name" }
      })
      .populate("candidateId", "name professionalTitle skills experience education modality accessibility")
      .sort({ createdAt: -1 });

    const enrichedApplications = applications.map((application) => {
      const item = application.toObject();
      if (item.candidateId && item.jobId) {
        const match = calculateMatch(item.candidateId, item.jobId);
        item.matchScore = match.score;
        item.matchBreakdown = match.breakdown;
        item.matchedSkills = match.matchedSkills;
        item.missingSkills = match.missingSkills;
        item.matchedAccessibility = match.matchedAccessibility;
        item.missingAccessibility = match.missingAccessibility;
      }
      return item;
    });

    res.json(enrichedApplications);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo postulaciones", error: error.message });
  }
});

router.post("/", requireRole("candidate"), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.id });
    const job = await Job.findById(req.body.jobId);
    if (!candidate || !job) return res.status(404).json({ message: "Candidato u oferta no encontrada" });

    const match = calculateMatch(candidate, job);
    const application = await Application.create({
      candidateId: candidate._id,
      jobId: job._id,
      matchScore: match.score,
      status: "Postulado"
    });

    const company = await Company.findById(job.companyId).select("userId name");
    if (company?.userId) {
      try {
        await createNotification({
          userId: company.userId,
          type: "new_application",
          title: "Nueva postulación",
          message: `${candidate.name} se postuló a ${job.title}`,
          data: { applicationId: application._id, jobId: job._id, candidateId: candidate._id }
        });
      } catch (notificationError) {
        console.error("Application notification error", notificationError.message);
      }
    }

    res.status(201).json({
      ...application.toObject(),
      matchScore: match.score,
      matchedSkills: match.matchedSkills
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Ya te postulaste a esta oferta" });
    res.status(400).json({ message: "Error creando postulación", error: error.message });
  }
});

router.patch("/:id/status", requireRole("company"), async (req, res) => {
  try {
    const allowedStatuses = ["Postulado", "CV visto", "En proceso", "Proceso finalizado"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Estado de postulación no válido" });
    }

    const application = await Application.findById(req.params.id).populate("jobId");
    const company = await Company.findOne({ userId: req.user.id });
    if (!application || !company || application.jobId.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    const previousStatus = application.status;
    application.status = req.body.status;
    await application.save();

    if (previousStatus !== application.status) {
      const candidate = await Candidate.findById(application.candidateId).select("userId");
      if (candidate?.userId) {
        const statusMessages = {
          "CV visto": "La empresa ha visto tu CV.",
          "En proceso": "Tu postulación pasó a la etapa En proceso.",
          "Proceso finalizado": "El proceso de tu postulación ha finalizado."
        };
        const message = statusMessages[application.status];
        if (message) {
          try {
            await createNotification({
              userId: candidate.userId,
              type: "application_status",
              title: `Postulación: ${application.status}`,
              message,
              data: { applicationId: application._id, jobId: application.jobId._id, status: application.status }
            });
          } catch (notificationError) {
            console.error("Status notification error", notificationError.message);
          }
        }
      }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando postulación", error: error.message });
  }
});

module.exports = router;
