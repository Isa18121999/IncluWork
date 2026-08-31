const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo postulaciones", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const application = await Application.create({
      candidateId: req.body.candidateId,
      jobId: req.body.jobId,
      matchScore: req.body.matchScore ?? req.body.score ?? 0,
      status: req.body.status || "Postulado"
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: "Error creando postulación", error: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const allowedStatuses = ["Postulado", "CV visto", "Aceptado", "Rechazado"];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Estado de postulación no válido" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando postulación", error: error.message });
  }
});

module.exports = router;
