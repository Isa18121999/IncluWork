const express = require("express");
const router = express.Router();

const calculateMatch = require("../services/matchingService");

const jobs = [];

const candidates = [
  {
    name: "Candidato recomendado",
    skills: ["React", "JavaScript", "Accesibilidad"],
    status: "Postulado"
  },
  {
    name: "Perfil compatible",
    skills: ["Node.js", "MongoDB"],
    status: "CV visto"
  }
];

router.get("/jobs", (req, res) => {
  res.json(jobs);
});

router.post("/jobs", (req, res) => {
  const job = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };

  jobs.push(job);
  res.status(201).json(job);
});

router.get("/candidates/:jobId", (req, res) => {
  const job = jobs.find(item => item.id === req.params.jobId) || {
    requirements: ["React", "JavaScript"]
  };

  const recommended = candidates.map(candidate => ({
    ...candidate,
    ...calculateMatch(candidate, job)
  }));

  res.json({
    jobId: req.params.jobId,
    candidates: recommended,
    message: "Candidatos recomendados por Match IA"
  });
});

module.exports = router;
