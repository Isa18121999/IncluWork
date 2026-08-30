const express = require("express");
const router = express.Router();

const jobs = [];

router.get("/jobs", (req, res) => {
  res.json(jobs);
});

router.post("/jobs", (req, res) => {
  const job = {
    ...req.body,
    createdAt: new Date()
  };

  jobs.push(job);
  res.status(201).json(job);
});

router.get("/candidates/:jobId", (req, res) => {
  res.json({
    jobId: req.params.jobId,
    candidates: [],
    message: "Candidatos recomendados por Match IA"
  });
});

module.exports = router;
