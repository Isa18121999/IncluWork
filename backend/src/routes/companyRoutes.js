const express = require("express");
const router = express.Router();

const jobs = [];

const candidates = [
  {
    name: "Candidato recomendado",
    skills: ["React", "JavaScript", "Accesibilidad"],
    match: 94,
    status: "Postulado"
  },
  {
    name: "Perfil compatible",
    skills: ["Node.js", "MongoDB"],
    match: 87,
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
  res.json({
    jobId: req.params.jobId,
    candidates,
    message: "Candidatos recomendados por Match IA"
  });
});

module.exports = router;
